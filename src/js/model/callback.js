import { AF_TARGETTYPE, FILEEXTENSION_ANIMATION, FILEEXTENSION_MOTION, FILEOPTION, INTERNAL_FILE, UserAnimationState } from "../../res/appconst.js";
import { VVAnimationFrameActor, VVAnimationProject, VVAvatar, VVAvatarEquipSaveClass, VVTimelineFrameData, VVTimelineTarget } from "../prop/cls_vvavatar.js";
import { appModelOperator } from "./operator.js";
import { LimitOfCallbackObjectProperty } from "../../res/appconst.js";
import { AppDBMeta } from "../appconf.js";
import { VFileHelper, VFileOptions, VFileType } from "../../../public/static/js/filehelper.js";
import { AvatarPunchEffect, AvatarShakeEffect, UnityColor } from "../prop/cls_unityrel.js";


export class UnityCallbackFunctioner {
    /**
     * Management class for callback from Unity-webGL
     * @param {*} main 
     * @param {*} ribbon 
     * @param {*} objlist 
     * @param {*} objprop 
     * @param {*} timeline 
     * @param {*} unityConfig
     */
     constructor(main, ribbon, objlist, objprop, timeline,unityConfig,refs) {
        this.mainData = main;
        this.ribbonData = ribbon;
        this.objlistData = objlist;
        this.objpropData = objprop;
        this.timelineData = timeline;
        this.unity = unityConfig;
        this.refs = refs;

        this.timelineEvent = null;

        /**
         * @type {appModelOperator}
         */
        this.modelOperator = null;

        this.modelLoader = null;

        const { t } = VueI18n.useI18n({ useScope: 'global' });
        this.t = t;

        var self = this;
    }

    //----------------------------------------------------------------------------
    //---loader functions
    //----------------------------------------------------------------------------
    /**
     * For Callback from Unity:
     * Go through the loaded data to HTML from Unity
     * @param {JSON} js 
     */
     async sendObjectInfo (js, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        var mainData = callback.mainData;
        var timelineData = callback.timelineData;
        var modelOperator = callback.modelOperator;

        // option paramater
        /*
            callback @type {UnityCallbackFunctioner}
            objectURL @type {String}  object URL
            filename @type {String} file name
            fileloadtype @type {String} file indicated flag
            loadingfileHandle @type {File} File object
        */
        var objectURL = options.objectURL;
        var filename = options.filename || "";
        var fileloadtype = options.fileloadtype || "";
        var loadingfileHandle = options.loadingfileHandle || null;
        if (objectURL != "") URL.revokeObjectURL(objectURL);
        mainData.elements.loading = false;
        if (typeof js == "string") {
            //console.log(js);

        }else{
            if (js.type == "VRM") {
                //[creation point] VVAvatar
                mainData.data.preview = new VVAvatar("VRM",js);
                //console.log(mainData.data.preview);
                mainData.elements.vrminfodlg.selectedAvatar = mainData.data.preview;
                //console.log(mainData.elements.vrminfodlg.selectedAvatar);

                mainData.elements.vrminfodlg.showmode = false;
                mainData.elements.vrminfodlg.show = true;

                //URL.revokeObjectURL(mainData.data.objectUrl.vrm);
            }else{
                if (mainData.states.fileloadname != "") {
                    js["Title"] = filename;
                }
                var baseFilepath = (loadingfileHandle) ? loadingfileHandle.name : "";
                var addedObj = modelOperator.addObject(js.type, js, js.roleTitle);
                //modeloperator.deselect_objectItem();
                mainData.states.selectedAvatar = addedObj.avatar;
                addedObj.role.path = baseFilepath;

                var role = addedObj.role;

                //[creation point] VVTimelineTarget
                var ishit = timelineData.data.timelines.find(item => {
                    if ((item.target.roleName == role.roleName) || (item.target.roleTitle == role.roleTitle)) return true;
                    return false;
                });
                if (ishit) {
                    ishit.setTarget(role);
                }else{
                    timelineData.data.timelines.push(new VVTimelineTarget(role));
                }

                if (addedObj.avatar.type == AF_TARGETTYPE.OtherObject) {
                    //---first only load materials
                    if (!mainData.elements.projdlg.mat_firstload) {
                        modelOperator.load_materialFileBody();
                    }
                }
                

                if (mainData.states.loadingfile) URL.revokeObjectURL(mainData.states.loadingfile);
                mainData.states.loadingfileHandle = null;
                loadingfileHandle = null;
            }
            mainData.states.fileloadname = "";
        }
        if (mainData.elements.loadingTypePercent) {
            if (mainData.elements.percentLoad.current <= 1.0) {
                mainData.elements.percentLoad.current += mainData.elements.percentLoad.percent;
            }
        }
    }
    async historySendObjectInfo (js, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        var mainData = callback.mainData;
        var timelineData = callback.timelineData;
        var modelOperator = callback.modelOperator;

        var objectURL = options.objectURL;
        if (objectURL != "") URL.revokeObjectURL(objectURL);
        mainData.elements.loading = false;

        if (js.type == "VRM") {
            //[creation point] VVAvatar
            mainData.data.preview = new VVAvatar("VRM",js);
            //console.log(mainData.data.preview);
            mainData.elements.vrminfodlg.selectedAvatar = mainData.data.preview;
            //console.log(mainData.elements.vrminfodlg.selectedAvatar);

            //---option: omitted vrminfo dialog to open VRM from history
            if (!mainData.appconf.confs.application.shortcut_vrminfo_from_history) {
                mainData.elements.vrminfodlg.showmode = false;
                mainData.elements.vrminfodlg.show = true;
            }
            

            //URL.revokeObjectURL(mainData.data.objectUrl.vrm);
        }
        //mainData.states.fileloadname = "";
    }
    /**
     * Load VRM after confirm dialog
     * @param {*} js 
     * @param {*} options each objects
     */
     async firstload_vrm (js, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        var mainData = callback.mainData;
        var timelineData = callback.timelineData;
        var modelOperator = callback.modelOperator;

        // option paramater
        /*
            callback @type {UnityCallbackFunctioner}
            objectURL @type {String}  object URL
            filename @type {String} file name
            fileloadtype @type {String} file indicated flag
            loadingfileHandle @type {File} File object
        */
        var filename = options.filename || "";
        var fileloadtype = options.fileloadtype || "";
        var loadingfileHandle = options.loadingfileHandle || null;

        var arr = js.split(",");
        var role = modelOperator.addVRM(AF_TARGETTYPE.VRM,mainData.data.preview,arr);
        //var role = modelOperator.getRoleFromAvatar(mainData.data.preview.id);
        role.path = (loadingfileHandle) ? loadingfileHandle.name : "";
        //modeloperator.select_objectItem(mainData.data.preview.id);
        mainData.states.selectedAvatar = mainData.data.preview;
        
        //[creation point] VVTimelineTarget
        var ishit = timelineData.data.timelines.find(item => {
            if ((item.target.roleName == role.roleName) || (item.target.roleTitle == role.roleTitle)) return true;
            return false;
        });
        if (ishit) {
            ishit.setTarget(role);
        }else{
            timelineData.data.timelines.push(new VVTimelineTarget(role));
        }
        mainData.data.preview = null;
        loadingfileHandle = null;

        //---option changed: each loading of VRM: HingeLimited
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetHingeLimited',param:mainData.appconf.confs.model.body_natural_limit ? 1 : 0},
            "",QD_INOUT.toUNITY,
            null
        ));
        //AppQueue.start();
        if (mainData.elements.loadingTypePercent) {
            if (mainData.elements.percentLoad.current <= 1.0) {
                mainData.elements.percentLoad.current += mainData.elements.percentLoad.percent;
            }
        }
    }
    async firstload_audio (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        var mainData = callback.mainData;
        var ribbonData = callback.ribbonData;
        var modelOperator = callback.modelOperator;

        mainData.elements.loading = false;
        
        var js = val.split(",");

        if (js[0] == "BGM") {
            ribbonData.elements.audio.bgm.list.push({label:js[1],value:js[1]});

            ribbonData.elements.audio.bgm.maxLength = parseFloat(js[3]);
        }else if (js[0] == "SE") {
            ribbonData.elements.audio.se.list.push({label:js[1],value:js[1]});

            ribbonData.elements.audio.se.maxLength = parseFloat(js[3]);
        }
        URL.revokeObjectURL(mainData.data.objectUrl.vrm);
        mainData.states.fileloadname = "";
    }

    async destroyAfter(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        var mainData = callback.mainData;
        var ribbonData = callback.ribbonData;
        var modelOperator = callback.modelOperator;

        var selavatar = modelOperator.getAvatar(val);
        if (selavatar) {
            modelOperator.del_objectItem(selavatar);
        }
        
    }
    //----------------------------------------------------------------------------
    //---properties functions
    //----------------------------------------------------------------------------

    /*
      below paramater "options"
      {
          callback : {UnityCallbackFunctioner},
          any paramaters...
      }
    */
    async gettransform3D (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;

        var arr = val.split("%");
        //---position
        var tmppos = arr[0].split(",");
        if (callback.objpropData) {
            callback.objpropData.elements.common.position3d.x = parseFloat(tmppos[0]);
            callback.objpropData.elements.common.position3d.y = parseFloat(tmppos[1]);
            callback.objpropData.elements.common.position3d.z = parseFloat(tmppos[2]);
            //---rotation
            var tmprot = arr[1].split(",");
            callback.objpropData.elements.common.rotation3d.x = Math.round(parseFloat(tmprot[0]));
            callback.objpropData.elements.common.rotation3d.y = Math.round(parseFloat(tmprot[1]));
            callback.objpropData.elements.common.rotation3d.z = Math.round(parseFloat(tmprot[2]));
            //---scale
            var tmpsca = arr[2].split(",");
            const calctmpsca = Math.round(parseFloat(tmpsca[0]) * 100);
            callback.objpropData.elements.common.scale3d.x = calctmpsca;
            callback.objpropData.elements.common.scale3d.y = calctmpsca;
            callback.objpropData.elements.common.scale3d.z = calctmpsca;
        }
    }
    async gettransform2D (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;

         var arr = val.split("%");
        //---position
        var tmppos = arr[0].split(",");
        if (callback.objpropData) {
            callback.objpropData.elements.common.position2d.x = parseFloat(tmppos[0]);
            callback.objpropData.elements.common.position2d.y = parseFloat(tmppos[1]) * -1;
            //---rotation
            var tmprot = arr[1].split(",");
            callback.objpropData.elements.common.rotation2d.x = Math.round(parseFloat(tmprot[0]));
            callback.objpropData.elements.common.rotation2d.y = Math.round(parseFloat(tmprot[1]));
            callback.objpropData.elements.common.rotation2d.z = Math.round(parseFloat(tmprot[2]));
            //---size
            var tmpsiz = arr[2].split(",");
            callback.objpropData.elements.common.size2d.x = Math.round(parseFloat(tmpsiz[0]));
            callback.objpropData.elements.common.size2d.y = Math.round(parseFloat(tmpsiz[1]));
            //---scale
            var tmpsca = arr[3].split(",");
            callback.objpropData.elements.common.scale2d.x = Math.round(parseFloat(tmpsca[0]));
            callback.objpropData.elements.common.scale2d.y = Math.round(parseFloat(tmpsca[1]));
        }
    }
    /**
     * fix moving option for VRM
     * @param {Number} val 
     */
     async getfixmoving(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;

         if (val == 1) {
            callback.objpropData.elements.vrmui.movemode = true;
        }else{
            callback.objpropData.elements.vrmui.movemode = false;
        }
        
    }
    async getjumppower(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        callback.objpropData.elements.common.jumpPower = parseFloat(val);
    }
    async getjumpnum(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        callback.objpropData.elements.common.jumpNum = parseInt(val);
    }
    async getpunch(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;

        var js = "";
        if (val == "") {
            js = new AvatarPunchEffect();
        }else{
            /**
             * @type {AvatarPunchEffect}
             */
            js = JSON.parse(val);
            js.isEnable = js.isEnable == 1 ? true : false;
        }
        callback.objpropData.elements.common.punch = js;
    }
    async getshake(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;

        var js = "";
        if (val == "") {
            js = new AvatarShakeEffect();
        }else{
            /**
             * @type {AvatarShakeEffect}
             */
            js = JSON.parse(val);
            js.isEnable = js.isEnable == 1 ? true : false;
            js.fadeOut = js.fadeOut == 1 ? true : false;
 
        }
        callback.objpropData.elements.common.shake = js;
    }
    //===VRM properties==========================================
    async getpropertyVRM(val,options){
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        /**
         * @type {VVAvatar}
         */
        const avatar = options.avatar;

        //console.log(callback);
        if (val) {
            callback.objpropData.elements.vrmui.ikhandles.partSelected = null;
            callback.objpropData.elements.vrmui.ikhandles.assignSelected = null;
            var arr = val.split("\t");
            { 
                //---set handpose
                var js = arr[0].split("=");
                //this.mixins.methods.listupHandArmPanel(js);
                for (var i = 0; i < js.length; i++) {
                    var ln = js[i].split(",");
                    if (ln[0] == "l") {
                        callback.objpropData.elements.vrmui.lefthand.poseSelected = 
                        callback.objpropData.elements.vrmui.lefthand.poseOptions.find(item => {
                            if (item.value == ln[1]) return true;
                            return false;
                        });
                        callback.objpropData.elements.vrmui.lefthand.poseValue = parseInt(ln[2]) * 100;
                    }else{
                        callback.objpropData.elements.vrmui.righthand.poseSelected = 
                        callback.objpropData.elements.vrmui.righthand.poseOptions.find(item => {
                            if (item.value == ln[1]) return true;
                            return false;
                        });
                        callback.objpropData.elements.vrmui.righthand.poseValue = parseInt(ln[2]) * 100;
                    }
                }
            }
            
            { 
                //---enum blendshapes
                callback.mainData.states.selectedAvatar.blendShapes = arr[1];
                callback.modelOperator.listupBlendShapes(callback.mainData.states.selectedAvatar);
            }
            //---getequipflag
            //arr[2];
            //---listequipinfo
            var js = JSON.parse(arr[3]);
            if (js) {
                callback.mainData.states.selectedAvatar.equipList.splice(0,callback.mainData.states.selectedAvatar.equipList.length);
                js.list.forEach(item => {
                    var obj = callback.modelOperator.getRole(item.equipitem,"role");
                    var cl = new VVAvatarEquipSaveClass(item.bodybonename,item.equipitem,obj);
                    callback.mainData.states.selectedAvatar.equipList.push(cl);
                });
            }
            callback.modelOperator.listupEquipList(callback.mainData.states.selectedAvatar);
            //---gravityList
            //arr[4];
            //---Headlock
            callback.objpropData.elements.vrmui.headLock = arr[5];
            //---UserMaterial
            callback.enummaterial(arr[6],options);
            //---MoveMode
            callback.objpropData.elements.vrmui.movemode = arr[7] == "1" ? true : false;

        }else{
            AppQueue.add(new queueData(
                {target:avatar.id,method:'GetIndicatedPropertyFromOuter'},
                "getpropertyVRM",QD_INOUT.returnJS,
                callback.getpropertyVRM,
                {callback}
            ));
        }
    }
    async getpropertyBlinkEye(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
         /**
          * @type {VVAvatar}
          */
        const avatar = options.avatar;
        const vrmui = callback.objpropData.elements.vrmui;

        var js = val.split(",");
        //---enable
        vrmui.blink.enable = js[0] == "1" ? true : false;
        //---interval
        vrmui.blink.interval = parseFloat(js[1]);
        //---opening
        vrmui.blink.opening = parseFloat(js[2]);
        //---closing
        vrmui.blink.closing = parseFloat(js[3]);
        //---closeTime
        vrmui.blink.closeTime = parseFloat(js[4]);
    }
    async getpropertyTextureConfig(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const mainData = callback.mainData;
        const objpropData = callback.objpropData;
        const vrmui = objpropData.elements.vrmui;

        if (val != "") {
            var js = JSON.parse(val);
        
            vrmui.matopt.colorselected = new UnityColor(js.color).toHexaColor();
            vrmui.matopt.srcblend = js.srcblend;
            vrmui.matopt.dstblend = js.dstblend;
            vrmui.matopt.emissioncolor = new UnityColor(js.emissioncolor).toHexaColor();
            vrmui.matopt.shadetexcolor  = new UnityColor(js.shadetexcolor).toHexaColor();
            vrmui.matopt.shadingtoony = js.shadingtoony;
            vrmui.matopt.rimcolor = new UnityColor(js.rimcolor).toHexaColor();
            vrmui.matopt.rimfresnel = js.rimfresnel;
            vrmui.matopt.cullmodeselected = js.cullmode;
            vrmui.matopt.blendmodeselected = js.blendmode;
    
        }

    }
    //===OtherObject properties==========================================
    async isplayanima_oth(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;

        //---Check wheather selected avatar(other object) is playing animation.
        var el = callback.objpropData.elements;
        if (val == 1) {
            el.objectui.animation.play_icon = "pause";
        }else{
            el.objectui.animation.play_icon = "play_circle";
        }
        
    }
    async getplayflag_oth(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        var el = callback.objpropData.elements;
        var fil = el.objectui.animation.flagOptions.find(item => {
            if (item.value == parseInt(val)) return true;
            return false;
        });
        el.objectui.animation.flagSelected = fil;
    }
    async get_current_animationcilp(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        var objpropData = callback.objpropData;
        objpropData.elements.objectui.animation.clipselected = val;
    }
    async get_anmimationcliplist (val, objpropData) {
        var lst = val.split("=");
        objpropData.elements.objectui.animation.cliplist = lst;
    }
    async get_animationspeed(val, objpropData) {
        objpropData.elements.objectui.animation.speed = parseFloat(val);
    }
    async get_animationmaxlength(val, objpropData) {
        objpropData.elements.objectui.animation.maxPosition = parseFloat(val);
    }
    async get_animationwrapmode(val, objpropData) {
        var ival = parseInt(val);
        var ishit = objpropData.elements.objectui.animation.wrapmodeOptions.findIndex(item => {
            if (item.value == ival) return true;
            return false;
        });
        if (ishit > -1) {
            objpropData.elements.objectui.animation.wrapmodeSelected = 
                objpropData.elements.objectui.animation.wrapmodeOptions[ishit];
        }
    }
    async enummaterial(val, options)  {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const mainData = callback.mainData;
        var el = callback.objpropData.elements;

        var sesItem = "callnum_enummaterial";
        var callCounter = parseInt(sessionStorage.getItem(sesItem) || "0");

        //---enumerate Mateial info of the other object
        // 0 - key name
        // 1 - shader name
        // 2 - material color
        // 3 - Cull mode
        // 4 - Blend mode
        // 5 - Texture name
        // 6 - Metallic (Standard)
        // 7 - Glossiness (Standard)
        // 8 - Emission Color 
        // 9 - Shade Texture Color (VRM/MToon)
        // 10- Shaing Toony (VRM/MToon)
        // 11- Rim Color (VRM/MToon)
        // 12- Rim Fresnel Power (VRM/MToon)
        // 13- SrcBlend (VRM/MToon)
        // 14- DstBlend (VRM/MToon)

        if (val) {
            var lst = val.split("\r\n");
            mainData.states.selectedAvatar.materials = [];
            el.objectui.materialnames.splice(0, el.objectui.materialnames.length);
            el.objectui.materials.splice(0,el.objectui.materials.length);
            lst.forEach(item => {
                var itemarr = item.split("=");
                mainData.states.selectedAvatar.materials.push(itemarr);
                el.objectui.materials.push(itemarr);
                el.objectui.materialnames.push(itemarr[0]);
            });
            el.objectui.materialnameSelected = "";
            Vue.nextTick(() => {
                el.objectui.materialnameSelected = el.objectui.materials[0][0];
                el.objectui.materialSelected = el.objectui.materials[0];
            });
            
            //console.log(lst);

            //---default selection is 0
            /*if (lst.length > 0) {
                var arr = lst[0].split(",");

                el.objectui.matopt.shaderselected = el.objectui.matopt.shader.find(item => {
                    if (item.value == arr[1]) return true;
                    return false;
                });
                el.objectui.matopt.colorselected = arr[2];
                el.objectui.matopt.cullmodeselected = el.objectui.matopt.cullmode.find(item => {
                    if (item.value == arr[3]) return true;
                    return false;
                });
                el.objectui.matopt.blendmodeselected = el.objectui.matopt.blendmode.find(item => {
                    if (item.value == arr[4]) return true;
                    return false;
                });
                if (arr[5].indexOf("#Camera") > -1) {
                    el.objectui.matopt.textureSeltypeselected = el.objectui.matopt.textureSeltype[1];
                }else{
                    el.objectui.matopt.textureSeltypeselected = el.objectui.matopt.textureSeltype[0];
                }
                el.objectui.matopt.metallic = parseFloat(arr[6]);
                el.objectui.matopt.glossiness = parseFloat(arr[7]);
                el.objectui.matopt.emissioncolor = arr[8];
                el.objectui.matopt.shadetexcolor = arr[9];
                el.objectui.matopt.shaingtoony = parseFloat(arr[10]);
                el.objectui.matopt.rimcolor = arr[11];
                el.objectui.matopt.rimfresnel = parseFloat(arr[12]);
            }*/
        }else{
            if (callCounter <= LimitOfCallbackObjectProperty) {
                AppQueue.add(new queueData(
                    {target:callback.mainData.states.selectedAvatar.id,method:'ListUserMaterialFromOuter'},
                    "enummaterial",QD_INOUT.returnJS,
                    callback.enummaterial,
                    {callback}
                ));
                AppQueue.start();
                callCounter++;
                sessionStorage.setItem(sesItem,callCounter);
            }else{
                AppDB.writeLog("callback","warning","#WARNING: limit over of calling 'ListUserMaterialFromOuter'. Please call the method manually.");
                sessionStorage.removeItem(sesItem);
            }
            
        }
    }
    async getseek4oth (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        //---get animation seek position of other object 
        callback.objpropData.elements.objectui.animation.seek = parseFloat(val);
    }
    async getpropertyOtherObject(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;

        if (val) {
            var arr = val.split("\t");
            //---user material
            if (arr[0] == "o") {
                callback.enummaterial(arr[1],options);
            }
            //---is playing animation flag
            callback.isplayanima_oth(arr[2],options);

            callback.getplayflag_oth(arr[3],options);
            //---seek position animation
            callback.getseek4oth(arr[4],options);
            //---animation speed 
            callback.get_animationspeed(arr[5],callback.objpropData);
            //---max length
            callback.get_animationmaxlength(arr[6],callback.objpropData);
            //---wrap mode
            callback.get_animationwrapmode(arr[7],callback.objpropData);
            //---animation clip list
            callback.get_anmimationcliplist(arr[8],callback.objpropData);
            //---current animation clip
            callback.get_current_animationcilp(arr[9],options);
        }else{
            AppQueue.add(new queueData(
                {target:callback.mainData.states.selectedAvatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                "getpropertyOtherObject",QD_INOUT.returnJS,
                callback.getpropertyOtherObject,
                {oflag : options.oflag, avatar: options.avatar, callback:callback}
            ));
        }
    }
    async getpropertyOOImage(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const objpropData = callback.objpropData;

        if (val) {
            var arr = val.split("\t");
            
            //---material
            callback.enummaterial(arr[1],options);
            //---image object color
            //this.elements.clr_imageobj.fromString(arr[1]);
            objpropData.elements.imageui.colorselected = MUtility.toHexaColor(arr[2]);
        }else{
            AppQueue.add(new queueData(
                {target:callback.mainData.states.selectedAvatar.id,method:'GetIndicatedPropertyFromOuter',param:0},
                "getpropertyImageObject",QD_INOUT.returnJS,
                this.UnityCallback.getpropertyOOImage,
                { oflag : options.oflag, avatar: options.avatar, callback : callback}
            ));
        }
    }
    //===Light properties==========================================
    async getpropertyLight(val, options)  {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const lightui = callback.objpropData.elements.lightui;

        if (val) {
            var arr = val.split("\t");

            //---range
            lightui.range = parseFloat(arr[1]);
            //---color
            lightui.colorselected = MUtility.toHexaColor(arr[2]);
            //---power
            lightui.power = parseFloat(arr[3]);
            
            //---spot angle
            lightui.spotangle = parseFloat(arr[4]);
            
            //---light render mode
            lightui.rendermodeselected = 
                lightui.rendermodeOptions[parseInt(arr[5])];
        }else{
            AppQueue.add(new queueData(
                {target:callback.mainData.states.selectedAvatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                "getpropertyLight",QD_INOUT.returnJS,
                callback.getpropertyLight,
                {callback}
            ));
        }
    }
    //===Camera properties=================================
    async getviewport(cameraui,val)  {
        if (rect) {
            var rect = val.split(",");
        
            cameraui.vp.position.x = parseFloat(rect[0]);
            cameraui.vp.position.y = parseFloat(rect[1]);
            cameraui.vp.size.x = parseFloat(rect[2]);
            cameraui.vp.size.y = parseFloat(rect[3]);
        }
    }
    async getpropertyCamera (val,options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const cameraui = callback.objpropData.elements.cameraui;

        if (val) {
            var arr = val.split("\t");

            //---playing flag
            var play_intflag = parseInt(arr[0]);
            var playFlag = cameraui.animation.flagOptions.find(item => {
                if (item.value == play_intflag) return true;
                return false;
            });
            cameraui.animation.flagSelected = playFlag;
            //---fov
            cameraui.fov = parseFloat(arr[1]);
            //---depth
            cameraui.depth = parseFloat(arr[2]);
            //---viewport
            callback.getviewport(cameraui,arr[3]);
            //---clear flag
            //console.log(arr[4]);
            //---render flag
            cameraui.renderTexture.isOn = parseInt(arr[5]) == 1 ? true : false;
            //---render size
            var rendersize = arr[6].split("/");
            cameraui.renderTexture.x = parseInt(rendersize[0]);
            cameraui.renderTexture.y = parseInt(rendersize[1]);
        }else{
            AppQueue.add(new queueData(
                {target:callback.mainData.states.selectedAvatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                "getpropertyCamera",QD_INOUT.returnJS,
                callback.getpropertyCamera,
                {callback}
            ));
        }
    }
    //===Effect properties===============================
    async firstLoad_effectDirectory (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        var mainData = callback.mainData;
        const effectui = callback.objpropData.elements.effectui;

        var js = val.split("\t");
        for (var i = 0; i < js.length; i++) {
            var ln = js[i].replace("Effects/","");
            var lnarr = ln.split("/");
            if (!mainData.data.EffectDirectory[lnarr[0]]) {
                mainData.data.EffectDirectory[lnarr[0]] = [];
                effectui.genreoptions.push(lnarr[0]);

            }
            mainData.data.EffectDirectory[lnarr[0]].push(lnarr[1]);
        }
    }
    async getcurrenteffect (val, effectui, mainData)  {
        mainData.states.selectedAvatar.effects = {genre:"", effectName:""};

        if (!val) return;
        var arr = JSON.parse(val);

        effectui.effectoptions.splice(0, effectui.effectoptions.length);

        var ishit = effectui.genreoptions.findIndex(item => {
            if (item == arr.genre) return true;
            return false;
        });
        if (ishit > -1) {
            effectui.genre = arr.genre;

            var eff = mainData.data.EffectDirectory[arr.genre];
            eff.forEach(item=> {
                effectui.effectoptions.push({label:item, value:item});
            });
            effectui.effect = effectui.effectoptions.find(item => {
                if (item.value == arr.effectName) return true;
                return false;
            });
            mainData.states.selectedAvatar.effects.genre = arr.genre;
            mainData.states.selectedAvatar.effects.effectName = arr.effectName;
        }
    }
    async getpropertyEffect (val,options)  {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const effectui = callback.objpropData.elements.effectui;

        if (val) {
            var arr = val.split("\t");

            //---play flag
            var flag = parseInt(arr[0]);
            effectui.animation.flagSelected = effectui.animation.flagOptions.find(item => {
                if (item.value == flag) return true;
                return false;
            });
            //---current effect
            callback.getcurrenteffect(arr[1], effectui, callback.mainData);
            //---collider flag
            //console.log(arr[2]);
            effectui.colliderOn = parseInt(arr[2]) == 1 ? true : false;
            //---collider size
            //console.log(arr[3]);
            effectui.colliderSize = parseFloat(arr[3]);
        }else{
            AppQueue.add(new queueData(
                {target:callback.mainData.states.selectedAvatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                "getpropertyEffect",QD_INOUT.returnJS,
                callback.getpropertyEffect,
                {callback}
            ));
        }

    }
    //===Text properties=================================
    async getpropertyText(val,options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const textui = callback.objpropData.elements.textui;

        if (val) {
            var arr = val.split("\t");

            //---text
            textui.text = arr[0];
            //---anchor pos
            textui.anchor_position = textui.anchor_positionOptions.find(item => {
                if (item.value == arr[1]) return true;
                return false;
            });
            //---size
            textui.size = parseInt(arr[2]);
            //---style
            textui.fontstyleselected = textui.fontstyleOptions.find(item => {
                if (item.value == parseInt(arr[3])) return true;
                return false;
            });
            //---color
            textui.colorselected = MUtility.toHexaColor(arr[4]);
        }else{
            AppQueue.add(new queueData(
                {target:callback.mainData.states.selectedAvatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                "getpropertyText",QD_INOUT.returnJS,
                callback.getpropertyText,
                {callback}
            ));
        }
    }
    //===UI image properties=================================
    async getpropertyUImage (val,options)  {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const uimageui = callback.objpropData.elements.uimageui;

        if (val) {
            var arr = val.split("\t");

            //---anchor pos
            //parent.callbackDB.getanchorpos(arr[0]);
            //---color
            uimageui.colorselected = MUtility.toHexaColor(arr[1]);
        }else{
            AppQueue.add(new queueData(
                {target:callback.mainData.states.selectedAvatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                "getpropertyUImage",QD_INOUT.returnJS,
                callback.getpropertyUImage,
                {callback}
            ));
        }
    }
    //===Audio properties=================================
    async getPropertyAudio(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const ribbonData = callback.ribbonData;
        const audio = ribbonData.elements.audio;
        const AudioType = options.AudioType;

        if (val) {
            var arr = val.split("\t");
            
            //0 - type
            //audio.operatetype = String(arr[0]).toLowerCase();

            const typeaudio = audio[AudioType.toLowerCase()];
            //1 - play flag
            var ishit_playflag = typeaudio.playflag_options.find(item => {
                if (item.value == parseInt(arr[1])) return true;
                return false;
            })
            typeaudio.playflag = ishit_playflag;
            /*if (ishit_playflag.value == UserAnimationState.Stop) {
                typeaudio.playbtn_state = "play_circle";
            }else{
                typeaudio.playbtn_state = "pause";
            }*/
            //2 - current audio
            var ishit_selection = typeaudio.list.find(item => {
                if (item.value == arr[2]) return true;
                return false;
            })
            typeaudio.selection = ishit_selection;
            //3 - audio length
            typeaudio.maxLength = parseFloat(arr[3]);
            //4 - seek pos
            typeaudio.seek = parseFloat(arr[4]);
            //5 - volume
            typeaudio.vol = parseFloat(arr[5]) * 100;
            //6 - pitch
            typeaudio.pitch = parseFloat(arr[6]) * 100;
            //7 - loop
            typeaudio.isloop = arr[7] == "1" ? true : false;
        }
    }
    //===SystemEffect properties=================================
    async getPropertySystemEffect(val,options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const ribbonData = callback.ribbonData;
        const syse = ribbonData.elements.syseff;

        if (val == null) return;

        var lines = val.split("\t");
        for (var i = 0; i < lines.length; i++) {
            var prop = lines[i].split(",");

            if (i == 0) {
                //0 - Bloom(on/off, intensity)
                syse.bloom.checked = prop[0] == "1" ? true : false;
                syse.bloom.intensity = parseFloat(prop[1]);
            }else if (i == 1) {
                //1 - Chromatic(on/off, intensity)
                syse.chroma.checked = prop[0] == "1" ? true : false;
                syse.chroma.intensity = parseFloat(prop[1]);
            }else if (i == 2) {
                //2 - Color grading(on/off, colorfilter, temperature, tint)
                syse.colorgrd.checked = prop[0] == "1" ? true : false;
                syse.colorgrd.filter = prop[1];
                syse.colorgrd.temperature = parseFloat(prop[2]);
                syse.colorgrd.tint = parseFloat(prop[3]);
            }else if (i == 3) {
                //3 - depth of field(on/off, aperture, focallength)
                syse.depthov.checked = prop[0] == "1" ? true : false;
                syse.depthov.aperture = parseFloat(prop[1]);
                syse.depthov.focallength = parseFloat(prop[2]);
            }else if (i == 4) {
                //4 - Grain(on/off, intensity, size)
                syse.grain.checked = prop[0] == "1" ? true : false;
                syse.grain.intensity = parseFloat(prop[1]);
                syse.grain.size = parseFloat(prop[2]);
            }else if (i == 5) {
                //5 - Vignette(on/off, intensity)
                syse.vignette.checked = prop[0] == "1" ? true : false;
                syse.vignette.intensity = parseFloat(prop[1]);
            }else if (i == 6) {
                //6 - MotionBlur(on/off, shutterangle, samplecount)
                syse.moblur.checked = prop[0] == "1" ? true : false;
                syse.moblur.intensity = parseFloat(prop[1]);
                syse.moblur.size = parseFloat(prop[2]);
            }
        }
    }
    //===Stage properties=================================
    async liststage(val,options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const stageui = callback.objpropData.elements.stageui;

        var arr = val.split(",");
        stageui.typeoptions.splice(0, stageui.typeoptions.length);
        //console.log(arr);
        var data = [];
        //console.log(arr);
        for (var i = 0; i < arr.length; i++) {
            stageui.typeoptions.push({
                label : _T(arr[i]),
                value : i
            });
        }
        //console.log(stageui.typeoptions);
    }
    async getstagetype(val, options)  {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const stageui = callback.objpropData.elements.stageui;

        for (var i = 0; i < stageui.typeoptions.length; i++) {
            if (val == stageui.typeoptions.value) {
                stageui.typeselected = stageui.typeoptions[i];
                break;
            }
        }
    }
    async getustg_materialfloat(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const stageui = callback.objpropData.elements.stageui;
        var arr = val.split("\t");
        for (var i = 0; i < arr.length; i++) {
            var js = arr[i].split("=");
            if (js[0] == "color") {
                stageui.ustg_color = MUtility.toHexaColor(js[1]);
            }else if (js[0] == "renderingtype") {
                var ishit = callback.objpropData.elements.objectui.matopt.blendmode.find(item => {
                    if (item.value == parseInt(js[1])) return true;
                    return false;
                });
                stageui.ustg_blendmode = ishit;
            }else if (js[0] == "metallic") {
                stageui.ustg_metallic = parseFloat(js[1]);
            }else if (js[0] == "glossiness") {
                stageui.ustg_glossiness = parseFloat(js[1]);
            }else if (js[0] == "emissioncolor") {
                stageui.ustg_emissioncolor = MUtility.toHexaColor(js[1]);
            }
        }        
    }
    async getPropertySky(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const stageui = callback.objpropData.elements.stageui;

        var js = JSON.parse(val);
        if (js) {
            stageui.skymodeselected = 
            stageui.skymodeoptions.find(item => {
                if (item.value == js.skymodeselected) return true;
                return false;
            });
            stageui.skyshaderselected = 
            stageui.skyshaderoptions.find(item => {
                if (item.value == js.skyshaderselected) return true;
                return false;
            });
            stageui.skycolorselected = js.skycolorselected;
            
            stageui.skyparam.sunsize = js.sunsize;
            stageui.skyparam.sunsize_convergence = js.sunsize_convergence;
            stageui.skyparam.atmosphere_thickness = js.atmosphere_thickness;
            stageui.skyparam.exposure = js.exposure;
            stageui.skyparam.rotation = js.rotation;
            stageui.skyparam.tint = js.tint;
            stageui.skyparam.ground_color = js.ground_color;
        }
        
    }
    async get_dlight_rotation(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const stageui = callback.objpropData.elements.stageui;
        
        var js = JSON.parse(val);
        if (js != null) {
            stageui.dlight_rotation.x = Math.round(js.x);
            stageui.dlight_rotation.y = Math.round(js.y);
            stageui.dlight_rotation.z = Math.round(js.z);
        }
        
    }
    async getWinddir(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const stageui = callback.objpropData.elements.stageui;

        var js = JSON.parse(val);

        stageui.winddirection.xz = js.x;
        stageui.winddirection.y = js.y;
    }
    async getPropertyWindzone(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const stageui = callback.objpropData.elements.stageui;

        var arr = val.split(",");
        //0: power
        stageui.winpower = parseFloat(arr[0]);
        //1: frequency
        stageui.windfrequency = parseFloat(arr[1]);
        //2: duration min
        stageui.windduration.min = parseFloat(arr[2]);
        //3: duration max
        stageui.windduration.max = parseFloat(arr[3]);
    }
    //----------------------------------------------------------------------------
    //---pose, capture functions
    //----------------------------------------------------------------------------
    async registernowpose (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;

        //---save current pose(IK transform), and add timeline as key frame (not backup)
        var js = JSON.parse(val);
        //console.log("val=",js);

        /**
         * @type {VVTimelineFrameData}
         */
        var fk = new VVTimelineFrameData(js);
        fk.data = js;
        /*
        var tl = parent.elements.timeline.getTimeline(parent.states.selectedAvatar.id);
        if (tl) {
            var frameCurrent = parent.elements.timeline.states.frame.current;
            if (tl.getFrameByKey(frameCurrent)) {
                tl.setFrameByKey(frameCurrent,fk);
            }else{
                tl.insertFrame(frameCurrent,fk);
            }
            
        }
        */
    }
    async takescreenshot (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        
        var context = callback.unity.instance.Module.canvas;
        
        var dataurl = context.toDataURL("image/png");
        AppDB.capture.setItem(new Date().valueOf(), dataurl);

        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'EnableHandleShowCamera',param:1},
            "",QD_INOUT.toUNITY,
            null
        ));
        //AppQueue.start();
    }
    async saveTPoseInfo(val, options) {
        const pose = options.pose;
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const mainData = callback.mainData;

        if (!val) return;
        var js = JSON.parse(val); //String(val).split(",");
        
        mainData.states.selectedAvatar.TPoseInfo = js;
        /*
        parent.states.selectedAvatar.TPoseInfo = new UnityVector3(
            parseFloat(js[0]),parseFloat(js[1]),parseFloat(js[2]),
        );*/
        
        callback.modelOperator.applyMediaPipe(pose);
    }
    async paste_keyframe (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const mainData = callback.mainData;
        const timelineData = callback.timelineData;
        var js = val.split(",");
        var role = js[0];
        var cursor = js[2];
        var tl = timelineData.data.timelines.find(item => {
            if (item.target.roleName == role) return true;
            return false;
        });
        if (tl) {
            //---source data
            var cp = tl.getFrameByKey(mainData.data.clipboard.frame.index);
            //---destination
            var fk = tl.getFrameByKey(cursor);
            if (fk) {
                tl.setFrameByKey(fk.key, cp);
            }else{
                var tmpfk = new VVTimelineFrameData(parseInt(cursor),{
                    key : parseInt(cursor),
                    data : mainData.states.selectedCast
                });
                tl.insertFrame(tmpfk.key, tmpfk);
            }
            if (mainData.data.clipboard.frame.mode == "cut") {
                tl.removeFrameByKey(mainData.data.clipboard.frame.index);
            }
            //---preview this frame
            //callback.timelineEvent.common_loadFrame(parseInt(cursor));
        }
    }
    //----------------------------------------------------------------------------
    //---project functions
    //----------------------------------------------------------------------------
    async enumactorsroles(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const mainData = callback.mainData; 
        var projdlg = mainData.elements.projdlg;



        projdlg.editroles.splice(0, projdlg.editroles.length);
        projdlg.selavatars.splice(0, projdlg.selavatars.length);
        projdlg.selavatarOptions.splice(0, projdlg.selavatarOptions.length);
        projdlg.selavatarOptions.push({
            label : 'None',
            value : "null",
        });

        var arr = val.split("%");
        for (var i = 0; i < arr.length; i++) {
            /**
             * @type {VVCast}
             */
            var js = JSON.parse(arr[i]);  //AnimationAvatar
                
            if ((js.roleName.indexOf("SystemEffect") == -1) &&
                (js.roleName.indexOf("BGM") == -1) &&
                (js.roleName.indexOf("SE") == -1)
            ) {
                var av = callback.modelOperator.getAvatar(js.avatarId);
                if (av) av.role = js;

                projdlg.editroles.push({
                    name : av ? av.title : "None",
                    type : av ? GetEnumName(AF_TARGETTYPE,av.type) : GetEnumName(AF_TARGETTYPE,js.type),
                    typeId : av ? av.type : js.type,
                    roleTitle : js.roleTitle,
                    oldroleTitle : js.roleTitle,
                    id : av ? av.id : js.avatarId,
                    roleName : js.roleName,
                });
                projdlg.selavatars.push({
                    roleTitle : js.roleTitle,
                    type : av ? GetEnumName(AF_TARGETTYPE,av.type) : GetEnumName(AF_TARGETTYPE,js.type),
                    typeId : av ? av.type : js.type,
                    name : av ? av.title : "None",
                    oldname : av ? av.title : "",
                    id : av ? av.id : js.avatarId,
                    roleName : js.roleName,
                });
            }
            
        }

        mainData.elements.projdlg.show = true;
    }
    async openproject(val,options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const mainData = callback.mainData;
        const modelOperator = callback.modelOperator;
        const modelLoader = callback.modelLoader;
        //const objectUrls = options.objectUrls;

        //---revoke object urls
        /*objectUrls.forEach(item => {
            URL.revokeObjectURL(item);
        });*/

        //mainData.elements.loadingTypePercent = false;
        mainData.states.loadingfileHandle = null;
        modelOperator.destroy_materialFile(true);
        modelLoader.setupDefaultObject();
        
        //---Return is AnimationProject.
        var js = JSON.parse(val);

        var proj = new VVAnimationProject(js);
        mainData.data.project.setFromUnity(proj);
        
        //---set up meta
        mainData.elements.projdlg.pinfo.name = proj.meta.name;
        mainData.elements.projdlg.pinfo.description = proj.meta.description;
        mainData.elements.projdlg.pinfo.license = proj.meta.license;
        mainData.elements.projdlg.pinfo.url = proj.meta.referurl;

        //---load project material
        modelOperator.listload_materialFile("p",proj.materialManager);

        //---apply value to UI
        await modelOperator.LoadAndApplyToTimelineUI(mainData.data.project);
        callback.timelineData.states.currentcursor = 1;

        modelOperator.setTitle(mainData.states.currentProjectFilename);

        if (mainData.elements.percentLoad.percent == 0) {
            mainData.elements.loadingTypePercent = false;
        }
    }
    async saveproject(val,options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const mainData = callback.mainData;
        const modelOperator = callback.modelOperator;
        const refs = callback.refs;
        const disktype = options.disktype;
        const savetype = options.savetype;
        const notify = () => {
            Quasar.Notify.create({
                message : callback.t("msg_project_internal_save"), 
                position : "top-right",
                color : "info",
                textColor : "black",
                timeout : 3000, 
                multiLine : true
            });
        }

        var js = JSON.parse(val);

        var proj = new VVAnimationProject(js);
        proj.meta.name = mainData.elements.projdlg.pinfo.name;
        proj.meta.description = mainData.elements.projdlg.pinfo.description;
        proj.meta.license = mainData.elements.projdlg.pinfo.license;
        proj.meta.referURL = mainData.elements.projdlg.pinfo.url;

        //---re-set cast's path
        mainData.data.project.casts.forEach(item => {
            var ishit = proj.casts.find(target => {
                if (target.roleName == item.roleName) return true;
                return false;
            });
            if (ishit && (item.path != "")) {
                ishit.path = item.path;
            }
        });
        //---delete empty timeline
        /*
        if (mainData.appconf.confs.animation.remove_emptytimeline_whensave) {
            for (var i = proj.timeline.characters.length-1; i >= 0; i--) {
                var tl = proj.timeline.characters[i];
                if (tl.frames.length == 0) {
                    var cast_i = proj.casts.findIndex(item => {
                        if (item.roleName == tl.targetRole) {
                            if (item.avatarId == "") return true;
                            return false;
                        }else{
                            return false;
                        }
                    });
                    if (cast_i > -1) {
                        proj.timeline.characters.splice(i,1);
                        proj.casts.splice(cast_i,1);
                    }
                }
            }
        }
        */

        //---get write permission
        if ((disktype == "f") && (mainData.states.currentProjectFromFile === true)) {
            var options = {
                mode : "readwrite"
            };
            //await modelOperator.verifyFileHandlePermission(mainData.states.currentProjectHandle,options);
            if (await VFileHelper.verifyFilePermission(mainData.states.currentProjectHandle,options)) {
                await VFileHelper.checkFilePermission(mainData.states.currentProjectHandle,options);
            }
        }

        var cond = "as";
        if (savetype == "overwrite") {
            if (mainData.states.currentProjectHandle) {
                cond = "overwrite";
            }
            if (disktype == "f" && (typeof mainData.states.currentProjectHandle == "string")) {
                cond = "as";
            }
        }

        //---to internal storage
        if (disktype == "i") {
            const funcbody = (filename,cmeta,cproj) => {
                AppDB.scene_meta.setItem(cmeta.fullname,cmeta);
                AppDB.scene.setItem(cmeta.fullname,cproj)
                .then(res => {
                    notify();
                    mainData.states.currentProjectFilename = filename;
                    mainData.states.currentProjectHandle = filename;
                    mainData.states.currentProjectFromFile = false;
                    modelOperator.setTitle(mainData.states.currentProjectFilename);
                });
            }
            const enterSave = (value)=>{
                var filename = value;
                if (filename == "") filename = "project" + FILEEXTENSION_ANIMATION;
                if (filename.indexOf(FILEEXTENSION_ANIMATION) == -1) filename += FILEEXTENSION_ANIMATION;
                //---to internal storage
                AppDB.scene_meta.getItem(filename)
                .then((existmeta) => {
                    var curdate = new Date();
                    var meta = new AppDBMeta(
                        filename + (filename.indexOf(FILEEXTENSION_ANIMATION) == -1 ? FILEEXTENSION_ANIMATION : ""),
                        filename,
                        JSON.stringify(proj).length,
                        "PROJECT",
                        curdate,
                        curdate,   
                    );
                    
                    if (existmeta) {
                        //---already exists, overwrite
                        appConfirm(callback.t('msg_project_internal_save_confirm'),(r)=>{
                            meta = existmeta;
                            meta.updatedDate = curdate;
                            meta.size = JSON.stringify(proj).length;
                            funcbody(filename,meta,proj);
                        });
                        
                    }else{
                        //---newly save
                        funcbody(filename,meta,proj);
                    }
                    
                });
            }
            if (cond == "as") {
                appPrompt(callback.t("msg_project_save"),enterSave,mainData.states.currentProjectFilename);
            }else{
                enterSave(mainData.states.currentProjectFilename);
            }
        }else if (disktype == "f") {
            //File System Access API
            var vfopt = new VFileOptions();
            vfopt.suggestedName = mainData.states.currentProjectFilename;
            vfopt.types.push(new VFileType());
            vfopt.types[0].description = FILEOPTION.PROJECT.description;
            vfopt.types[0].accept = FILEOPTION.PROJECT.accept;

            if (cond == "as") {
                var ret = await VFileHelper.saveUsingDialog(JSON.stringify(proj),vfopt);
                if (ret.cd == 0) {
                    mainData.states.currentProjectFilename = savepicker.name;
                    mainData.states.currentProjectHandle = savepicker;
                    mainData.states.currentProjectFromFile = true;
                    modelOperator.setTitle(mainData.states.currentProjectFilename);
                    notify();
                }else{
                    appAlert(ret.err);
                }
                
                /*
                if ("showSaveFilePicker" in window) {
                    //
                    // @type {FileSystemFileHandle}
                    //
                    const savepicker = await window.showSaveFilePicker({
                        suggestedName : mainData.states.currentProjectFilename,
                        types: FILEOPTION.PROJECT.types
                    });
                    if (savepicker) {
                        const writer = await savepicker.createWritable();
                        writer.write(JSON.stringify(proj));
                        await writer.close();
    
                        //var tmpname = savepicker.name.split(".");
                        mainData.states.currentProjectFilename = savepicker.name;
                        mainData.states.currentProjectHandle = savepicker;
                        mainData.states.currentProjectFromFile = true;
                        modelOperator.setTitle(mainData.states.currentProjectFilename);
                        notify();
                    }
                }else{
                    console.log("Not found window.showSaveFilePicker...");
                }
                */
            }else{
                var ret = await VFileHelper.saveOnefile(mainData.states.currentProjectHandle,JSON.stringify(proj),vfopt);
                if (ret.cd == 0) {
                    notify();
                }else{
                    appAlert(ret.err);
                }
                /*
                const writer = await mainData.states.currentProjectHandle.createWritable();
                writer.write(JSON.stringify(proj));
                await writer.close();
                notify();
                */
            }
            
        }
    }
    async clearemptytimeline (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const modelOperator = callback.modelOperator;

        //console.log(val);
        var js = val.split(",");
        //---delete HTML timeline also.
        for (var i = 0; i < js.length; i++) {
            modelOperator.del_timelineOnly(js[i]);
        }

        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetAllActorsFromOuter'},
            "enumactorsroles",QD_INOUT.returnJS,
            callback.enumactorsroles,
            {callback}
        ));
    }
    async openmotionresult (val,options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const modelOperator = callback.modelOperator;

        if (val == "") {
            appAlert(callback.t("msg_openmotion_error1"));
            return;
        }
        if (val == "typeerr") {
            appAlert(callback.t("msg_openmotion_error2"));
            return;
        }
        /**
         * @type {VVAnimationFrameActor}
         */
        var js = JSON.parse(val);
        //console.log(js);

        //---To apply on HTML
        modelOperator.SingleApplyToTimelineUI(js, js.targetRole);
    }
    async savemotion (val,options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const refs = callback.refs;
        
        var js = JSON.parse(val);

        //console.log(js);
        /*
        appPrompt(callback.t("msg_motion_save"),(value)=>{
            var filename = value;
            
            if (filename == "") filename = "motion";
            var bb = new Blob([val], {type : "application/json"});
            if (refs.lnk_savemotion.value.href) window.URL.revokeObjectURL(refs.lnk_savemotion.value.href);
            var burl = URL.createObjectURL(bb);
            refs.lnk_savemotion.value.href = burl;
            refs.lnk_savemotion.value.download = filename + FILEEXTENSION_MOTION;
            refs.lnk_savemotion.value.click(); 
        });
        */

        //---File System Access API
        var vopt = new VFileType();
        vopt = FILEOPTION.MOTION.types[0];
        var vf = new VFileOptions();
        
        if (VFileHelper.flags.isElectron) {
            vf.types.push(vopt);
            vf.suggestedName = "motion.vvmmot";
            VFileHelper.saveUsingDialog(val,vf,true);
        }else{
            appPrompt(callback.t("msg_project_save"),(val)=>{
                vf.types.push(vopt);
                vf.suggestedName = val;
                VFileHelper.saveUsingDialog(val,vf,true);
            },vf.suggestedName);
        }
        /*
        if ("showSaveFilePicker" in window) {
            const savepicker = await window.showSaveFilePicker(FILEOPTION.MOTION);
            if (savepicker) {
                const writer = await savepicker.createWritable();
                writer.write(val);
                await writer.close();
            }
            
        }else{
            console.log("Not found window.showSaveFilePicker...");
        }
        */
    }
}
export const defineUnityCallback = (mainData,ribbonData,objlistData,objpropData,timelineData,unityConfig,refs) => {
    const { t } = VueI18n.useI18n({ useScope: 'global' });

    const UnityCallback = new UnityCallbackFunctioner(mainData,ribbonData,objlistData,objpropData,timelineData,unityConfig,refs);
    return {
        UnityCallback
    }
}