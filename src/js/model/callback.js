import { AF_TARGETTYPE, FILEEXTENSION_ANIMATION, FILEEXTENSION_MOTION, FILEEXTENSION_POSE, FILEEXTENSION_VRMA, FILEOPTION, INTERNAL_FILE, STORAGE_TYPE, UserAnimationState } from "../../res/appconst.js";
import { AnimationProjectPreloadFiles, VVAnimationFrameActor, VVAnimationProject, VVAvatar, VVAvatarEquipSaveClass, VVPoseConfig, VVTimelineFrameData, VVTimelineTarget } from "../prop/cls_vvavatar.js";
import { appModelOperator } from "./operator.js";
import { LimitOfCallbackObjectProperty } from "../../res/appconst.js";
import { AppDBMeta } from "../appconf.js";
import { VFileHelper, VFileOptions, VFileType, VOSFile } from "../../../public/static/js/filehelper.js";
import { AvatarPunchEffect, AvatarShakeEffect, UnityColor, VRMAnimationClip, VRMAnimationCllip } from "../prop/cls_unityrel.js";
import { appMainData } from "../prop/appmaindata.js";
import { appDataTimeline } from "../prop/apptimelinedata.js";
import { appDataRibbon } from "../prop/appribbondata.js";
import { appDataObjectProp } from "../prop/appobjpropdata.js";
const yaml = require("js-yaml");


export class UnityCallbackFunctioner {
    /**
     * Management class for callback from Unity-webGL
     * @param {appMainData} main 
     * @param {appDataRibbon} ribbon 
     * @param {*} objlist 
     * @param {appDataObjectProp} objprop 
     * @param {appDataTimeline} timeline 
     * @param {*} unityConfig
     */
     constructor(main, ribbon, objlist, objprop, timeline,unityConfig,refs) {
        /**
         * @type {appMainData}
         */
        this.mainData = main;
        /**
         * @type {appDataRibbon}
         */
        this.ribbonData = ribbon;
        this.objlistData = objlist;
        /**
         * @type {appDataObjectProp}
         */
        this.objpropData = objprop;
        /**
         * @type {appDataTimeline}
         */
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
        var ribbonData = callback.ribbonData;
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
        /**
         * @type {VOSFile}
         */
        var loadingfileHandle = options.loadingfileHandle || null;
        if (objectURL != "") URL.revokeObjectURL(objectURL);
        mainData.elements.loading = false;
        if (typeof js == "string") {
            //console.log(js);

        }else{
            if (js.type == "VRM") {
                //[creation point] VVAvatar
                mainData.data.preview = new VVAvatar("VRM",js);
                mainData.data.preview.comeFrom = loadingfileHandle.storageType;
                mainData.data.preview.additionalData = loadingfileHandle.additionalData;
                //console.log(mainData.data.preview);
                mainData.elements.vrminfodlg.selectedAvatar = mainData.data.preview;
                //console.log(mainData.elements.vrminfodlg.selectedAvatar);

                mainData.elements.vrminfodlg.showmode = false;
                mainData.elements.vrminfodlg.show = true;

                //URL.revokeObjectURL(mainData.data.objectUrl.vrm);
            }else{
                if (filename != "") {
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
                
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.OperateActiveVRM,method:'ChangeIKMarkerStyle',param:parseFloat(ribbonData.elements.optionArea.ikmarkerSize)},
                    "",QD_INOUT.toUNITY,
                    null
                ));

            }
            mainData.states.fileloadname = "";
        }
        if (mainData.elements.loadingTypePercent) {
            if (mainData.elements.percentLoad.current <= 1.0) {
                mainData.elements.percentLoad.current += mainData.elements.percentLoad.percent;
            }
        }
    }
    async callVRM_Limitedfunction(mainData, ribbonData) {
        //---option changed: each loading of VRM: HingeLimited
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetHingeLimited',param:mainData.appconf.confs.model.body_natural_limit ? 1 : 0},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetLimitedBones',param:mainData.appconf.confs.model.interlock_body_pelvis ? "p,1" : "p,0"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetLimitedBones',param:mainData.appconf.confs.model.interlock_body_arms ? "a,1" : "a,0"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetLimitedBones',param:mainData.appconf.confs.model.interlock_body_legs ? "l,1" : "l,0"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.OperateActiveVRM,method:'ChangeIKMarkerStyle',param:parseFloat(ribbonData.elements.optionArea.ikmarkerSize)},
            "",QD_INOUT.toUNITY,
            null
        ));
    }
    async historySendObjectInfo (js, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        var mainData = callback.mainData;
        var ribbonData = callback.ribbonData;
        var timelineData = callback.timelineData;
        var modelOperator = callback.modelOperator;
        /**
         * @type {VOSFile}
         */
        const loadingfileHandle = options.loadingfileHandle;

        var objectURL = options.objectURL;
        if (objectURL != "") URL.revokeObjectURL(objectURL);
        mainData.elements.loading = false;

        if (js.type == "VRM") {
            //[creation point] VVAvatar
            mainData.data.preview = new VVAvatar("VRM",js);
            mainData.data.preview.comeFrom = loadingfileHandle.storageType;
            mainData.data.preview.additionalData = loadingfileHandle.additionalData;
            //console.log(mainData.data.preview);
            mainData.elements.vrminfodlg.selectedAvatar = mainData.data.preview;
            //console.log(mainData.elements.vrminfodlg.selectedAvatar);

            //---option: omitted vrminfo dialog to open VRM from history
            if (!mainData.appconf.confs.application.shortcut_vrminfo_from_history) {
                mainData.elements.vrminfodlg.showmode = false;
                mainData.elements.vrminfodlg.show = true;
            }
            //---call VRM IK limitation
            callback.callVRM_Limitedfunction(mainData,ribbonData);

            //URL.revokeObjectURL(mainData.data.objectUrl.vrm);
        }
        //mainData.states.fileloadname = "";
    }
    async vroidhubSendObjectInfo (js, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        var mainData = callback.mainData;
        var ribbonData = callback.ribbonData;
        var timelineData = callback.timelineData;
        var modelOperator = callback.modelOperator;
        /**
         * @type {VOSFile}
         */
        const loadingfileHandle = options.loadingfileHandle;

        var objectURL = options.objectURL;
        if (objectURL != "") URL.revokeObjectURL(objectURL);
        mainData.elements.loading = false;

        if (js.type == "VRM") {
            //[creation point] VVAvatar
            mainData.data.preview = new VVAvatar("VRM",js);
            mainData.data.preview.comeFrom = loadingfileHandle.storageType;
            mainData.data.preview.additionalData = loadingfileHandle.additionalData;
            //console.log(mainData.data.preview);
            mainData.elements.vrminfodlg.selectedAvatar = mainData.data.preview;
            //console.log(mainData.elements.vrminfodlg.selectedAvatar);

            //---forcely: omitted vrminfo dialog to open own models
            
            //---call VRM IK limitation
            callback.callVRM_Limitedfunction(mainData,ribbonData);

            //URL.revokeObjectURL(mainData.data.objectUrl.vrm);
        }
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
        var ribbonData = callback.ribbonData;
        var timelineData = callback.timelineData;
        var modelOperator = callback.modelOperator;
        var modelLoader = callback.modelLoader;

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
        /**
         * @type {VOSFile}
         */
        var loadingfileHandle = options.loadingfileHandle || null;


        if (mainData.data.preview) {
            var ischeck = modelOperator.getVRMFromTitle(mainData.data.preview.title);
            if (ischeck) {
                appAlert(callback.t("msg_already_added_collider"));
                mainData.data.preview = null;
                loadingfileHandle = null;
        
                return;
            }
    
            var arr = js.split(",");
            var role = modelOperator.addVRM(AF_TARGETTYPE.VRM,mainData.data.preview,arr);
            //var role = modelOperator.getRoleFromAvatar(mainData.data.preview.id);
    
            //#########
            //---this path is NOT real path. filename to search AppDB(history)
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
    
    
            //---call VRM IK limitation
            callback.callVRM_Limitedfunction(mainData,ribbonData);
    
            //AppQueue.start();
            if (mainData.elements.loadingTypePercent) {
                if (mainData.elements.percentLoad.current <= 1.0) {
                    mainData.elements.percentLoad.current += mainData.elements.percentLoad.percent;
                }
            }
    
        }else{
            console.error("firstload_vrm:preview vrm is not Null.");
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
        const avatar = callback.mainData.states.selectedAvatar;

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
            var calctmpscax = Math.round(parseFloat(tmpsca[0]) * 100);
            var calctmpscay = Math.round(parseFloat(tmpsca[1]) * 100);
            var calctmpscaz = Math.round(parseFloat(tmpsca[2]) * 100);
            /*if (avatar.type == AF_TARGETTYPE.Text3D) {
                calctmpscax = Math.round(parseFloat(tmpsca[0]));
                calctmpscay = Math.round(parseFloat(tmpsca[1]));
                calctmpscaz = Math.round(parseFloat(tmpsca[2]));
            }*/
            if (arr.length >= 4) {
                var tmpdrag = arr[3].split(",");
                callback.objpropData.elements.common.drag = parseFloat(tmpdrag[0]);
                callback.objpropData.elements.common.angularDrag = parseFloat(tmpdrag[1]);
                callback.objpropData.elements.common.useCollision = (tmpdrag[2] == "1") ? true : false;
                callback.objpropData.elements.common.useGravity = (tmpdrag[3] == "1") ? true : false;
            }
            
            
            
            callback.objpropData.elements.common.scale3d.x = calctmpscax;
            callback.objpropData.elements.common.scale3d.y = calctmpscay;
            callback.objpropData.elements.common.scale3d.z = calctmpscaz;
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
                        callback.objpropData.elements.vrmui.lefthand.poseValue = parseInt(parseFloat(ln[2]) * 100);
                    }else{
                        callback.objpropData.elements.vrmui.righthand.poseSelected = 
                        callback.objpropData.elements.vrmui.righthand.poseOptions.find(item => {
                            if (item.value == ln[1]) return true;
                            return false;
                        });
                        callback.objpropData.elements.vrmui.righthand.poseValue = parseInt(parseFloat(ln[2]) * 100);
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

            //============================
            //---VRMAnimation
            //---is playing animation flag
            callback.isplayanima_oth(arr[8],options);
            //---animation state flag
            callback.getplayflag_oth(arr[9],options);
            //---seek position animation [4]
            callback.getseek4oth(arr[10],options);
            //---animation speed 
            callback.get_animationspeed(arr[11],callback.objpropData);
            //---max length [6]
            callback.get_animationmaxlength(arr[12],callback.objpropData);
            //---wrap mode
            callback.get_animationwrapmode(arr[13],callback.objpropData);
            //---animation clip list
            callback.get_anmimationcliplist(arr[14],callback.objpropData);
            //---VRMAnimation selected file name
            callback.objpropData.elements.vrmui.vrmanim.list.selected = arr[16];
            //---current animation clip
            callback.get_current_animationcilp(arr[15],options);
            //---enable flag of VRMAnimation
            callback.objpropData.elements.vrmui.vrmanim.isenable = arr[17] == "1" ? true : false;
            
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
    async getpropertyLipsync(val, options) {
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
        vrmui.lipsync.enable = js[0] == "1" ? true : false;
        //---interval
        vrmui.lipsync.interval = parseFloat(js[1]);
        //---opening
        vrmui.lipsync.opening = parseFloat(js[2]);
        //---closing
        vrmui.lipsync.closing = parseFloat(js[3]);

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
    async getListBlendShapeProxy(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
         const callback = options.callback;
         const mainData = callback.mainData;
         const objpropData = callback.objpropData;
         const vrmui = objpropData.elements.vrmui;

         //console.log(val.split(","));
    }
    async getfingerposeclass(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const mainData = callback.mainData;
        const objpropData = callback.objpropData;
        const vrmui = objpropData.elements.vrmui;
        const name_thumbs = ["spread","roll","stretched1","stretched2","stretched3","roll1","roll2","roll3"];
        const name_other = ["spread","roll","stretched1","stretched2","stretched3"];

        if (val) {
            var js = val.split("\t");
            var leftf = JSON.parse(js[0]);
            var rightf = JSON.parse(js[1]);
            //console.log(leftf, rightf);
            //---left 
            for (var i = 0; i < leftf.Thumbs.length; i++) {
                var name = name_thumbs[i];
                vrmui.lefthand.finger.thumbs[name] = leftf.Thumbs[i];
            }
            for (var i = 0; i < leftf.Index.length; i++) {
                var name = name_other[i];
                vrmui.lefthand.finger.index[name] = leftf.Index[i];
                vrmui.lefthand.finger.middle[name] = leftf.Middle[i];
                vrmui.lefthand.finger.ring[name] = leftf.Ring[i];
                vrmui.lefthand.finger.little[name] = leftf.Little[i];
            }
            //---right 
            for (var i = 0; i < rightf.Thumbs.length; i++) {
                var name = name_thumbs[i];
                vrmui.righthand.finger.thumbs[name] = rightf.Thumbs[i];
            }
            for (var i = 0; i < rightf.Index.length; i++) {
                var name = name_other[i];
                vrmui.righthand.finger.index[name] = rightf.Index[i];
                vrmui.righthand.finger.middle[name] = rightf.Middle[i];
                vrmui.righthand.finger.ring[name] = rightf.Ring[i];
                vrmui.righthand.finger.little[name] = rightf.Little[i];
            }
        }
    }
    async getnaturalrotation(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const mainData = callback.mainData;
        const objpropData = callback.objpropData;
        const vrmui = objpropData.elements.vrmui;

        if (options.bonename == "leftarm") {
            vrmui.ikGoalNaruralRotation.leftHand = val == 1 ? true : false;
        }else if (options.bonename == "rightarm") { 
            vrmui.ikGoalNaruralRotation.rightHand = val == 1 ? true : false;
        }else if (options.bonename == "leftleg") {
            vrmui.ikGoalNaruralRotation.leftFoot = val == 1 ? true : false;
        }else if (options.bonename == "rightleg") { 
            vrmui.ikGoalNaruralRotation.rightFoot = val == 1 ? true : false;
        }
    }
    async after_setvrma(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;

        var arr = val.split("\t");

        //---vrma enabled?
        callback.objpropData.elements.vrmui.vrmanim.isenable = arr[0] == "1" ? true : false;

        //---animation clip list
        callback.get_anmimationcliplist(arr[1],callback.objpropData);
        //---current animation clip
        callback.get_current_animationcilp(arr[2],options);
        //---max length [6]
        callback.get_animationmaxlength(arr[3],callback.objpropData);        
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
        
        objpropData.elements.objectui.animation.isenable = (lst.length > 0);
        
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
        // 1 - material name
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
            el.objectui.materialIsChanges.splice(0, el.objectui.materialIsChanges.length);
            el.objectui.matopt.isChanged = false;
            lst.forEach(item => {
                if (item != "") {
                    var itemarr = item.split("=");
                    mainData.states.selectedAvatar.materials.push(itemarr);
                    el.objectui.materials.push(itemarr);
                    el.objectui.materialnames.push(itemarr[0]);
                    el.objectui.materialIsChanges.push(false);
                }
            });
            if (mainData.states.selectedAvatar.id != mainData.states.old_selectedAvatar.id) {
                el.objectui.materialnameSelected = "";
                Vue.nextTick(() => {
                    if (el.objectui.materials.length > 0) {
                        if (el.objectui.materials[0].length > 0) {
                            el.objectui.materialnameSelected = el.objectui.materials[0][0];
                        }
                        el.objectui.materialSelected = el.objectui.materials[0];
                    }
                    
                });
            }else{
                //---if same material of same avatar, reload material settings
                var param  = el.objectui.materialnameSelected;
                if (param != null) {
                    AppQueue.add(new queueData(
                        {target:mainData.states.selectedAvatar.id,method:'ListGetOneUserMaterialFromOuter', param:param},
                        "listoneusermaterial",QD_INOUT.returnJS,
                        callback.apply_selectedMaterial,
                        {callback}
                    ));
                }
                
            }
            
            
            //console.log(lst);

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
    async apply_selectedMaterial(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const modelOperator = callback.modelOperator;
        const mainData = callback.mainData;
        var el = callback.objpropData.elements;

        var arr = val.split("=");
        
        var inx = 1;
        if (mainData.data.project.version >= 2) {
            // v2 = 1
            el.objectui.matopt.matname = arr[inx++];
        }
        // v1 = 1, v2 = 2
        el.objectui.matopt.shaderselected = el.objectui.matopt.shader.find(item => {
            if (item.value == arr[inx]) return true;
            return false;
        });
        if (!el.objectui.matopt.shaderselected) return;

        const shaderName = el.objectui.matopt.shaderselected.value;
        inx += 1; // v1 = 2, v2 = 3
        if ((shaderName == "Standard") || (shaderName == "VRM/MToon") || (shaderName == "VRM10/MToon10")){
            el.objectui.matopt.colorselected = MUtility.toHexaColor(arr[inx++]);
            // v1 = 3, v2 = 4
            var cullmode = el.objectui.matopt.cullmode.find(item => {
                if (item.value == parseInt(arr[inx])) return true;
                return false;
            });
            if (cullmode) el.objectui.matopt.cullmodeselected =  cullmode.value;
            inx += 1;

            // v1 = 4, v2 = 5
            el.objectui.matopt.blendmodeselected = el.objectui.matopt.blendmode.find(item => {
                if (item.value == parseInt(arr[inx])) return true;
                return false;
            });
            inx += 1;

            // v1 = 5, v2 = 6
            if (arr[inx].indexOf("#Camera") > -1) {
                //---Camera object
                el.objectui.matopt.textureSeltypeselected = el.objectui.matopt.textureSeltype[1];
                var role = arr[inx].replace("#Camera","");
                var hitrole = modelOperator.getAvatarFromRole(role);
                if (hitrole) {
                    el.objectui.matopt.textureCameraRender = {
                        label : hitrole.roleTitle,
                        value : hitrole.roleName
                    }
                }
                /*el.objectui.matopt.textureCameraRender = 
                    el.objectui.matopt.textureCameraRenderOptions.find(match => {
                        if (match.value == role) return true;
                        return false;
                    });*/
            }else{
                //---Normal texture name
                el.objectui.matopt.textureSeltypeselected = el.objectui.matopt.textureSeltype[0];
                el.objectui.matopt.textureFilelabelSelected = arr[inx];
            }
            inx += 1;
            
            // v1 = 6 ~ 14, v2 = 7 ~ 15
            el.objectui.matopt.metallic = parseFloat(arr[inx++]);
            el.objectui.matopt.glossiness = parseFloat(arr[inx++]);
            el.objectui.matopt.emissioncolor = MUtility.toHexaColor(arr[inx++]);
            el.objectui.matopt.shadetexcolor = MUtility.toHexaColor(arr[inx++]);
            el.objectui.matopt.shadingtoony = parseFloat(arr[inx++]);
            el.objectui.matopt.rimcolor = MUtility.toHexaColor(arr[inx++]);
            el.objectui.matopt.rimfresnel = parseFloat(arr[inx++]);
            el.objectui.matopt.srcblend = parseFloat(arr[inx++]);
            el.objectui.matopt.dstblend = parseFloat(arr[inx++]);
            // v2 = 16
            el.objectui.matopt.cutoff = parseFloat(arr[inx++]);
            el.objectui.matopt.shadingshift = parseFloat(arr[inx++]);
            el.objectui.matopt.receiveshadow = parseFloat(arr[inx++]);
            el.objectui.matopt.shadinggrade = parseFloat(arr[inx++]);
            el.objectui.matopt.lightcolorattenuation = parseFloat(arr[inx++]);


        }else if (shaderName == "FX/Water4") {

            // v1 = 2 ~ 5, v2 = 3 ~ 6
            el.objectui.matopt.fresnelScale = parseFloat(arr[inx++]);
            el.objectui.matopt.colorselected = MUtility.toHexaColor(arr[inx++]);
            el.objectui.matopt.reflectionColor = MUtility.toHexaColor(arr[inx++]);
            el.objectui.matopt.specularColor = MUtility.toHexaColor(arr[inx++]);

            // v1 = 6 ~ 29, v2 = 7 ~ 30
            var wa = arr[inx++].split(",");
            el.objectui.matopt.waveAmplitude.x = parseFloat(wa[0]);
            el.objectui.matopt.waveAmplitude.y = parseFloat(wa[1]);
            el.objectui.matopt.waveAmplitude.z = parseFloat(wa[2]);
            el.objectui.matopt.waveAmplitude.w = parseFloat(wa[3]);

            var wf = arr[inx++].split(",");
            el.objectui.matopt.waveFrequency.x = parseFloat(wf[0]);
            el.objectui.matopt.waveFrequency.y = parseFloat(wf[1]);
            el.objectui.matopt.waveFrequency.z = parseFloat(wf[2]);
            el.objectui.matopt.waveFrequency.w = parseFloat(wf[3]);

            var wt = arr[inx++].split(",");
            el.objectui.matopt.waveSteepness.x = parseFloat(wt[0]);
            el.objectui.matopt.waveSteepness.y = parseFloat(wt[1]);
            el.objectui.matopt.waveSteepness.z = parseFloat(wt[2]);
            el.objectui.matopt.waveSteepness.w = parseFloat(wt[3]);

            var ws = arr[inx++].split(",");
            el.objectui.matopt.waveSpeed.x = parseFloat(ws[0]);
            el.objectui.matopt.waveSpeed.y = parseFloat(ws[1]);
            el.objectui.matopt.waveSpeed.z = parseFloat(ws[2]);
            el.objectui.matopt.waveSpeed.w = parseFloat(ws[3]);

            var wdab = arr[inx++].split(",");
            el.objectui.matopt.waveDirectionAB.x = parseFloat(wdab[0]);
            el.objectui.matopt.waveDirectionAB.y = parseFloat(wdab[1]);
            el.objectui.matopt.waveDirectionAB.z = parseFloat(wdab[2]);
            el.objectui.matopt.waveDirectionAB.w = parseFloat(wdab[3]);

            var wdcd = arr[inx++].split(",");
            el.objectui.matopt.waveDirectionCD.x = parseFloat(wdcd[0]);
            el.objectui.matopt.waveDirectionCD.y = parseFloat(wdcd[1]);
            el.objectui.matopt.waveDirectionCD.z = parseFloat(wdcd[2]);
            el.objectui.matopt.waveDirectionCD.w = parseFloat(wdcd[3]);

        }else if (shaderName == "PencilShader/SketchShader") {
            el.objectui.matopt.strokeDensity = parseFloat(arr[inx++]);
            el.objectui.matopt.addBrightness = parseFloat(arr[inx++]);
            el.objectui.matopt.multBrightness = parseFloat(arr[inx++]);
            el.objectui.matopt.shadowBrightness = parseFloat(arr[inx++]);

        }else if (shaderName == "PencilShader/PostSketchShader") {
            el.objectui.matopt.strokeDensity = parseFloat(arr[inx++]);
            el.objectui.matopt.addBrightness = parseFloat(arr[inx++]);
            el.objectui.matopt.multBrightness = parseFloat(arr[inx++]);
            el.objectui.matopt.shadowBrightness = parseFloat(arr[inx++]);
        }else if (shaderName == "Custom/ComicShader") {
            el.objectui.matopt.enableTexTransparent = parseFloat(arr[inx++]);
            el.objectui.matopt.lineWidth = parseFloat(arr[inx++]);
            el.objectui.matopt.lineColor = MUtility.toHexaColor(arr[inx++]);
            el.objectui.matopt.tone1Threshold = parseFloat(arr[inx++]);
        }else if (shaderName == "Custom/IceShader") {
            el.objectui.matopt.iceColor = MUtility.toHexaColor(arr[inx++]);
            el.objectui.matopt.transparency = parseFloat(arr[inx++]);
            el.objectui.matopt.baseTransparency = parseFloat(arr[inx++]);
            el.objectui.matopt.iceRoughness = parseFloat(arr[inx++]);
            el.objectui.matopt.distortion = parseFloat(arr[inx++]);
        }else if (shaderName == "Custom/PixelizeTexture") {
            el.objectui.matopt.pixelSize = parseFloat(arr[inx++]);
        }

        //el.objectui.old_materialnameSelected = oldval;
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
            //---animation state flag
            callback.getplayflag_oth(arr[3],options);
            //---seek position animation [4]
            callback.getseek4oth(arr[4],options);
            //---animation speed 
            callback.get_animationspeed(arr[5],callback.objpropData);
            //---max length [6]
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

            //---halo
            lightui.halo = arr[6] == "1" ? true : false;
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
        if (val) {
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
            //---camera previewing ? (not register flag)
            cameraui.previewBtnEnabled = arr[7];

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
            //---collidar target VRMs
            var vrms = arr[4].split(",");
            effectui.colliderReigsters.splice(0, effectui.colliderReigsters.length);
            for (var i = 0; i < vrms.length; i++) {
                var role = callback.modelOperator.getRole(vrms[i], "role");
                if (role) {
                    effectui.colliderReigsters.push(role);
                }
            }
            
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
            //---size
            textui.size = parseInt(arr[1]);
            //---style
            textui.fontstyleselected = textui.fontstyleOptions.find(item => {
                if (item.value == parseInt(arr[2])) return true;
                return false;
            });
            for (var obj in textui.fontstylesRich) {
                if (arr[2].indexOf(obj) > -1) {
                    textui.fontstylesRich[obj] = obj;
                }
            }
            //---color
            textui.colorselected = MUtility.toHexaColor(arr[3]);

            //---size:x & y
            {
                var sizearr = arr[4].split(",");
                textui.area_size.x = parseInt(sizearr[0]);
                //---size:y
                textui.area_size.y = parseInt(sizearr[1]);
            }
            //---text alignment
            textui.anchor_position = textui.anchor_positionOptions.find(item => {
                if (item.value == arr[5]) return true;
                return false;
            });
            
            //---text overflow
            var arr8int = parseInt(arr[6]);
            textui.text_overflow = textui.text_overflow_options[arr8int];
            //---dimension
            textui.dimension = arr[7];
            //---is gradient
            textui.colortype = arr[8] == "1" ? "g" : "s";
            //---gradient colors
            var colors = arr[9].split(",");
            var colordir = ["tl","tr","bl","br"];
            colors.forEach((v,i,a) => {
                textui.colorGradient[colordir[i]] = MUtility.toHexaColor(v);
            });
            //---outline width
            textui.outlineWidth = parseFloat(arr[10]);
            //---outline color
            textui.outlineColor = MUtility.toHexaColor(arr[11]);
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
                syse.depthov.focusdistance = parseFloat(prop[3]);
            }else if (i == 4) {
                //4 - Grain(on/off, intensity, size)
                syse.grain.checked = prop[0] == "1" ? true : false;
                syse.grain.intensity = parseFloat(prop[1]);
                syse.grain.size = parseFloat(prop[2]);
            }else if (i == 5) {
                //5 - Vignette(on/off, intensity)
                syse.vignette.checked = prop[0] == "1" ? true : false;
                syse.vignette.intensity = parseFloat(prop[1]);
                syse.vignette.smoothness = parseFloat(prop[2]);
                syse.vignette.roundness = parseFloat(prop[3]);
                syse.vignette.color = prop[4];
                syse.vignette.center.x = parseFloat(prop[5]);
                syse.vignette.center.y = parseFloat(prop[6]);
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
            if (val == stageui.typeoptions[i].value) {
                stageui.typeselected = stageui.typeoptions[i];
                break;
            }
        }
    }
    async getseastage_material(val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const stageui = callback.objpropData.elements.stageui;
        const stage_sea = stageui.stage_sea;

        var js = val.split("=");
        if (js.length > 12) {
            // 0 - key name
            // 1 - shader name
            // 2 - wave scale
            stage_sea.waveScale = parseFloat(js[2]);
            // 3 - fresnel scale
            stage_sea.fresnelScale = parseFloat(js[3]);
            // 4 - base color
            stage_sea.basecolor = "#" + js[4];
            // 5 - reflection color
            stage_sea.reflectionColor = "#" + js[5];
            // 6 - specular color
            stage_sea.reflectionColor = "#" + js[6];
            // 7 - wave amplitude
            var wa = js[7].split(",");
            stage_sea.waveAmplitude.x = parseFloat(wa[0]);
            stage_sea.waveAmplitude.y = parseFloat(wa[1]);
            stage_sea.waveAmplitude.z = parseFloat(wa[2]);
            stage_sea.waveAmplitude.w = parseFloat(wa[3]);
            // 8 - wave frequency
            var wf = js[8].split(",");
            stage_sea.waveFrequency.x = parseFloat(wf[0]);
            stage_sea.waveFrequency.y = parseFloat(wf[1]);
            stage_sea.waveFrequency.z = parseFloat(wf[2]);
            stage_sea.waveFrequency.w = parseFloat(wf[3]);
            // 9 - wave steepness
            var wst = js[9].split(",");
            stage_sea.waveSteepness.x = parseFloat(wst[0]);
            stage_sea.waveSteepness.y = parseFloat(wst[1]);
            stage_sea.waveSteepness.z = parseFloat(wst[2]);
            stage_sea.waveSteepness.w = parseFloat(wst[3]);
            // 10- wave speed
            var ws = js[10].split(",");
            stage_sea.waveSpeed.x = parseFloat(ws[0]);
            stage_sea.waveSpeed.y = parseFloat(ws[1]);
            stage_sea.waveSpeed.z = parseFloat(ws[2]);
            stage_sea.waveSpeed.w = parseFloat(ws[3]);
            // 11- wave direction AB
            var wdab = js[11].split(",");
            stage_sea.waveDirectionAB.x = parseFloat(wdab[0]);
            stage_sea.waveDirectionAB.y = parseFloat(wdab[1]);
            stage_sea.waveDirectionAB.z = parseFloat(wdab[2]);
            stage_sea.waveDirectionAB.w = parseFloat(wdab[3]);
            // 12- wave direction CD
            var wdcd = js[12].split(",");
            stage_sea.waveDirectionCD.x = parseFloat(wdcd[0]);
            stage_sea.waveDirectionCD.y = parseFloat(wdcd[1]);
            stage_sea.waveDirectionCD.z = parseFloat(wdcd[2]);
            stage_sea.waveDirectionCD.w = parseFloat(wdcd[3]);
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
        stageui.windpower = parseFloat(arr[0]);
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
        /**
         * @type {VVTimelineTarget}
         */
        const seltimeline = options.selectedTimeline;

        //---save current pose(IK transform), and add timeline as key frame (not backup)
        var js = JSON.parse(val);


        console.log(seltimeline);
        //console.log("val=",js);

        /**
         * @type {VVTimelineFrameData}
         */
        var fk = new VVTimelineFrameData(js.frames[0].frame.index,js.frames[0]);
        //fk.data = js;
        console.log(fk);

        seltimeline.setFrameByKey(fk.key, fk);

        console.log(seltimeline);

        callback.timelineData.elements.childKey.max = fk.data.translateMoving-1;
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
        callback.mainData.states.currentEditOperationCount++;
    }
    async takescreenshot (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const ribbonData = callback.ribbonData;
        
        var context = callback.unity.instance.Module.canvas;
        
        var dataurl = context.toDataURL("image/png");
        AppDB.capture.setItem(new Date().valueOf(), dataurl);

        
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'EnableHandleShowCamera',param:ribbonData.elements.optionArea.showIKMarker ? 1 : 0},
            "",QD_INOUT.toUNITY,
            null
        ));
        
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'ShowTargetObject',param: callback.mainData.appconf.confs.application.show_camera_target_object},
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

        var clipboard = options.clipboard;
        if (!clipboard) {
            clipboard = mainData.data.clipboard.frame;
        }


        if (role == "null") {
            appAlert(callback.t("msg_error_paste"));
        }else{
            var tl = timelineData.data.timelines.find(item => {
                if (item.target.roleName == role) return true;
                return false;
            });
            if (tl) {
                //---source data
                var cp = tl.getFrameByKey(clipboard.index);
                //---destination
                var fk = tl.getFrameByKey(cursor);
                if (fk) {
                    fk.data["translateMoving"] = parseInt(js[3]);
                    tl.setFrameByKey(fk.key, cp);
                }else{
                    var tmpfk = new VVTimelineFrameData(parseInt(cursor),{
                        id : mainData.states.selectedCast.avatarId,
                        role : mainData.states.selectedCast.roleName,
                        translateMoving : parseInt(js[3])
                    });
                    tl.insertFrame(tmpfk.key, tmpfk);
                }
                if (clipboard.mode == "cut") {
                    tl.removeFrameByKey(clipboard.index);
                }
                //---preview this frame
                //callback.timelineEvent.common_loadFrame(parseInt(cursor));
    
                mainData.states.currentEditOperationCount++;
            }
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
                
            //if ((js.roleName.indexOf("SystemEffect") == -1) &&
            //    (js.roleName.indexOf("BGM") == -1) &&
            //    (js.roleName.indexOf("SE") == -1)
            //) {
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
            //}
            
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
        const ribbonData = callback.ribbonData;        
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
        try {
            var js = JSON.parse(val);
            if (typeof js != "object") throw new Error("returned value is not JSON.");

            var proj = new VVAnimationProject(js);
            mainData.data.project.setFromUnity(proj);
            mainData.data.project.preloadFiles = options.preload;
    
            //---apply UI
            mainData.elements.projdlg.pinfo.fps = proj.fps;
            var bd = parseFloat(proj.baseDuration);
            if (isNaN(bd)) {
                ribbonData.elements.frame.baseDuration = 0.01;
            }else{
                ribbonData.elements.frame.baseDuration = fullRound(bd,1000);
            }
            
            //---set up meta
            mainData.elements.projdlg.pinfo.name = proj.meta.name;
            mainData.elements.projdlg.pinfo.description = proj.meta.description;
            mainData.elements.projdlg.pinfo.license = proj.meta.license;
            mainData.elements.projdlg.pinfo.url = proj.meta.referurl;
            mainData.elements.projdlg.pinfo.baseDuration = proj.baseDuration;
    
            //---load project material
            modelOperator.listload_materialFile("p",proj.materialManager);
    
            if (mainData.elements.percentLoad.percent == 0) {
                //---calculate percent for objects number to load.
                const inputDatapathFromHistory = async (db, rawpath, objtype) => {
                    var result = await db.getItem(rawpath);
                    if (result) {
    
                    }
                    return result;
                }
                const casts = proj.casts;
                var fullCount = 0;
                for (var c = 0; c < casts.length; c++) {
                    var INTF = "";
                    if (casts[c].type == AF_TARGETTYPE.VRM) {
                        INTF = INTERNAL_FILE.VRM;
                        fullCount++;
                    }else if (casts[c].type == AF_TARGETTYPE.OtherObject) { 
                        INTF = INTERNAL_FILE.OBJECTS;
                        var castfile = await inputDatapathFromHistory(AppDB[INTF],casts[c].path,casts[c].type);
                        if (castfile) {
                            fullCount++;
                        }
                    }else if (casts[c].type == AF_TARGETTYPE.Image) {
                        INTF = INTERNAL_FILE.IMAGES;
                        fullCount++;
                    }else if (casts[c].type == AF_TARGETTYPE.UImage) {
                        INTF = INTERNAL_FILE.IMAGES;
                        fullCount++;
                    }
                }
                if (fullCount == 0) {
                    mainData.elements.percentLoad.percent = 0;
                }else{
                    mainData.elements.percentLoad.percent = (100.0 / parseFloat(fullCount)) / 100;
                }
            }
            
    
            //---apply value to UI
            await modelOperator.LoadAndApplyToTimelineUI(mainData.data.project);
            callback.timelineData.states.currentcursor = 1;
    
            modelOperator.setTitle(mainData.states.currentProjectFilename);
    
            if (mainData.elements.percentLoad.percent == 0) {
                mainData.elements.loadingTypePercent = false;
                mainData.elements.loading = false;
                modelOperator.common_loadFrame(1,{childkey:-1});
            }
        }catch(e) {
            console.error(e);
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
        const BKUPNAME = "%BACKUP%";

        var js = JSON.parse(val);

        var proj = new VVAnimationProject(js);
        proj.meta.name = mainData.elements.projdlg.pinfo.name;
        proj.meta.description = mainData.elements.projdlg.pinfo.description;
        proj.meta.license = mainData.elements.projdlg.pinfo.license;
        proj.meta.referURL = mainData.elements.projdlg.pinfo.url;

        //---re-set cast's path (from javascript's project to unity's project )
        mainData.data.project.casts.forEach(item => {
            var ishit = proj.casts.find(target => {
                if (target.roleName == item.roleName) return true;
                return false;
            });
            if (ishit && (item.path != "")) {
                ishit.path = item.path;
            }
        });
        //---re-set preload data
        proj.preloadFiles = JSON.original(mainData.data.project.preloadFiles);

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

        //---default is parameter savetype
        var cond = savetype;
        if (savetype == "overwrite") {
            //---From file or Google Drive to internal
            if ((disktype == "i") && (mainData.states.currentProjectFromStorageType != "i")) {
                //---save from disk to internal storage
                cond = "as";
            }
            //---From internal or Google Drive to File
            if ((disktype == "f") && (mainData.states.currentProjectFromStorageType != "f")) {
                //---save from internal storage to disk
                cond = "as";
            }
            //---From internal or file to Google Drive
            if ((disktype == "g") && (mainData.states.currentProjectFromStorageType != "g")) {
                //---save from internal storage to disk
                cond = "as";
            }
            if (!mainData.states.currentProjectHandle) {
                //---user do not save .
                cond = "as";
            }
        }

        //---to internal storage
        if (disktype == "i") {
            //---save function main body---
            const funcbody = (filename,cmeta,cproj) => {
                AppDB.scene_meta.setItem(cmeta.fullname,cmeta);
                AppDB.scene.setItem(cmeta.fullname,cproj)
                .then(res => {
                    notify();
                    mainData.states.currentProjectFilename = filename;
                    mainData.states.currentProjectFilepath = filename;
                    mainData.states.currentProjectHandle = filename;
                    mainData.states.currentProjectFromFile = false;
                    mainData.states.currentProjectFromStorageType = "i";
                    modelOperator.setTitle(mainData.states.currentProjectFilename);
                });
            }
            const enterSave = (value)=>{
                var filename = value;
                if (filename.indexOf(BKUPNAME) > -1) {
                    appAlert(callback.t("msg_project_save_error1"));
                    return;
                }
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
            //To disk directly
            var vfopt = new VFileOptions();
            vfopt.suggestedName = mainData.states.currentProjectFilename;
            vfopt.types.push(new VFileType());
            vfopt.encoding = FILEOPTION.PROJECT.encoding;
            vfopt.types[0] = FILEOPTION.PROJECT.types[0];

            if (cond == "as") {
                //---save as
                var ret = await VFileHelper.saveUsingDialog(JSON.stringify(proj),vfopt);
                if (ret) {
                    if (ret.cd == 0) {
                        mainData.states.currentProjectFilename = ret.name;
                        mainData.states.currentProjectHandle = ret.name;
                        mainData.states.currentProjectFilepath = ret.path;
                        mainData.states.currentProjectFromFile = true;
                        mainData.states.currentProjectFromStorageType = "f";
                        modelOperator.setTitle(mainData.states.currentProjectFilename);
                        notify();
                    }else if (ret.cd == 1) {

                    }else{
                        appAlert(ret.err.message);
                    }
                }
                
            }else{
                //---save overwrite
                var ret = await VFileHelper.saveOnefile(mainData.states.currentProjectFilepath,JSON.stringify(proj),vfopt);
                if (ret.cd == 0) {
                    notify();
                }else{
                    appAlert(ret.err.message);
                }
            }
        }else if (disktype == "g") {
            //---To Google Drive
            var googlemeta = {extension:"vvmproj"}
            var is_saveas = true;
            if (cond == "overwrite") {
                is_saveas = false;
            }
            const enterSave = (value) => {
                googlemeta["name"] = value + (value.indexOf(FILEEXTENSION_ANIMATION) == -1 ? FILEEXTENSION_ANIMATION : "");
                googlemeta["nameoverwrite"] = true;
                VFileHelper.saveToGoogleDrive(is_saveas,googlemeta,proj)
                .then(retdum => {
                    //---confirm latest saved file
                    return VFileHelper.confirmGoogleDriveLastSavedFile(googlemeta);
                })
                .then(retjs => {
                    notify();
                    mainData.states.currentProjectFilename = retjs.name;
                    mainData.states.currentProjectFilepath = retjs.name;
                    mainData.states.currentProjectHandle = retjs.name;
                    mainData.states.currentProjectFileID = retjs.id;
                    mainData.states.currentProjectFromFile = false;
                    mainData.states.currentProjectFromStorageType = "g";
                    modelOperator.setTitle(mainData.states.currentProjectFilename);
                })
                .catch(err => {
                    Quasar.Notify.create({
                        message : "Google Drive save error" + err.toString(), 
                        position : "top-right",
                        color : "error",
                        textColor : "white",
                        timeout : 3000, 
                        multiLine : true
                    });
                });
            }
            if (cond == "as") {
                appPrompt(callback.t("msg_project_save"),enterSave,mainData.states.currentProjectFilename);
            }else{
                googlemeta["id"] = mainData.states.currentProjectFileID;
                enterSave(mainData.states.currentProjectFilename);
            }
            
            
        }else if (disktype == "bkup") {
            const funcbody = (filename,cmeta,cproj) => {
                AppDB.scene_meta.setItem(cmeta.fullname,cmeta);
                AppDB.scene.setItem(cmeta.fullname,cproj)
                .then(res => {
                    Quasar.Notify.create({
                        message : callback.t("cons_backuping"), 
                        position : "top-right",
                        color : "info",
                        textColor : "black",
                        timeout : 1000, 
                        multiLine : true
                    });
                });
            }

            var filename = BKUPNAME + FILEEXTENSION_ANIMATION;
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
                    meta = existmeta;
                    meta.updatedDate = curdate;
                    meta.size = JSON.stringify(proj).length;
                    funcbody(filename,meta,proj);
                }else{
                    //---newly save
                    funcbody(filename,meta,proj);
                }
                
            });
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

        var chkerr = false;
        if (val == "") {
            appAlert(callback.t("msg_openmotion_error1"));
            chkerr = true;
        }
        if (val == "typeerr") {
            appAlert(callback.t("msg_openmotion_error2"));
            chkerr = true;
        }
        if (!chkerr) {
            /**
             * @type {VVAnimationFrameActor}
             */
            var js = JSON.parse(val);
            //console.log(js);

            //---To apply on HTML
            modelOperator.SingleApplyToTimelineUI(js, js.targetRole);
        }

        callback.mainData.elements.loading = false;
        callback.mainData.states.currentEditOperationCount++;
    }
    async savemotion (val,options) {
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
                message : callback.t("cons_save_complete"), 
                position : "top-right",
                color : "info",
                textColor : "black",
                timeout : 3000, 
                multiLine : true
            });
        }

        var js = JSON.parse(val);

        //console.log(js);
        //---default is parameter savetype

        if (disktype == "i") {
            //---To internal storage
            appPrompt(callback.t("msg_motion_save"),(fname)=>{
                AppDB.motion.setItem(fname, js)
                .then(ret => {
                    notify();
                });
            });
        }else if (disktype == "f") {
            //---To local disk
            //---File System Access API
            var vopt = new VFileType();
            vopt = FILEOPTION.MOTION.types[0];
            var vf = new VFileOptions();
            vf.suggestedName = "motion.vvmmot";
            
            if (VFileHelper.flags.isElectron) {
                vf.types.push(vopt);
                VFileHelper.saveUsingDialog(val,vf,true);
                notify();
            }else{
                appPrompt(callback.t("msg_motion_save"),(fname)=>{
                    vf.types.push(vopt);
                    vf.suggestedName = fname;
                    if (vf.suggestedName.indexOf(FILEEXTENSION_MOTION) == -1) {
                        vf.suggestedName + FILEEXTENSION_MOTION;
                    }
                    var acckey = "";
                    var accval = "";
                    for (var obj in vopt.accept) {
                        acckey = obj;
                        accval = vopt.accept[obj];
                        break;
                    }
                    var content = new Blob([val], {type : acckey});
                    var burl = URL.createObjectURL(content);
                    VFileHelper.saveUsingDialog(burl,vf,true)
                    .then(ret => {
                        URL.revokeObjectURL(burl);
                        notify();
                    });
                    
                },vf.suggestedName);
            }
        }else if (disktype == "g") {
            //---To Google drive
            var googlemeta = {
                extension:FILEEXTENSION_MOTION,
                nameoverwrite : true //always overwrite saving
            }
            
            const enterSave = (value) => {
                VFileHelper.saveToGoogleDrive(false,googlemeta,value)
                .then(retdum => {
                    //---confirm latest saved file
                    return VFileHelper.confirmGoogleDriveLastSavedFile(googlemeta);
                })
                .then(retjs => {
                    notify();
                    
                })
                .catch(err => {
                    Quasar.Notify.create({
                        message : "Google Drive save error" + err.toString(), 
                        position : "top-right",
                        color : "error",
                        textColor : "white",
                        timeout : 3000, 
                        multiLine : true
                    });
                });
            }
            

            appPrompt(callback.t("msg_motion_save"),(fname)=>{
                googlemeta["name"] = fname + (fname.indexOf(FILEEXTENSION_MOTION) > -1 ? "" : FILEEXTENSION_MOTION)
                enterSave(js);
            });
        }

        
    }
    async saveanimmotion (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const refs = callback.refs;
        const selRoleTitle = options.selRoleTitle;

        //---edit complete to YAML
        var js = JSON.parse(val);
        js.m_Name = selRoleTitle;
        var anim = {
            "animationClip" : js
        };
        var txt = yaml.dump(anim);
        txt = [
        "%YAML 1.1",
        "%TAG !u! tag:unity3d.com,2011:",
        "--- !u!74 &7400000"
        ].join("\r\n") + "\r\n" + txt;
        console.log(txt);

        //console.log(js);

        //---File System Access API
        var vopt = new VFileType();
        vopt = FILEOPTION.MOTION.types[0];
        var vf = new VFileOptions();
        vf.suggestedName = "motion.anim";

        if (VFileHelper.flags.isElectron) {
            vf.types.push(vopt);
            VFileHelper.saveUsingDialog(txt,vf,true);
        }else{
            appPrompt(callback.t("msg_motion_save"),(fname)=>{
                vf.types.push(vopt);
                vf.suggestedName = fname + (fname.indexOf(".anim") > -1 ? "" : ".anim");
                var acckey = "";
                var accval = "";
                for (var obj in vopt.accept) {
                    acckey = obj;
                    accval = vopt.accept[obj];
                    break;
                }
                var content = new Blob([txt], {type : acckey});
                var burl = URL.createObjectURL(content);
                VFileHelper.saveUsingDialog(burl,vf,true)
                .then(ret => {
                    URL.revokeObjectURL(burl);
                });
                
            },vf.suggestedName);
        }
    }
    async savebvhmotion (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const refs = callback.refs;
        const selRoleTitle = options.selRoleTitle;

        //---edit complete to YAML
        var txt = val;        
        //console.log(js);

        //---File System Access API
        var vopt = new VFileType();
        vopt = FILEOPTION.MOTION.types[0];
        var vf = new VFileOptions();
        vf.suggestedName = "motion.bvh";

        if (VFileHelper.flags.isElectron) {
            vf.types.push(vopt);
            VFileHelper.saveUsingDialog(txt,vf,true);
        }else{
            appPrompt(callback.t("msg_motion_save"),(fname)=>{
                vf.types.push(vopt);
                vf.suggestedName = fname + (fname.indexOf(".bvh") > -1 ? "" : ".bvh");
                var acckey = "";
                var accval = "";
                for (var obj in vopt.accept) {
                    acckey = obj;
                    accval = vopt.accept[obj];
                    break;
                }
                var content = new Blob([txt], {type : acckey});
                var burl = URL.createObjectURL(content);
                VFileHelper.saveUsingDialog(burl,vf,true)
                .then(ret => {
                    URL.revokeObjectURL(burl);
                });
                
            },vf.suggestedName);
        }
    }
    async savevrmamotion (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const refs = callback.refs;
        const selRoleTitle = options.selRoleTitle;

        const notify = () => {
            Quasar.Notify.create({
                message : callback.t("cons_save_complete"), 
                position : "top-right",
                color : "info",
                textColor : "black",
                timeout : 3000, 
                multiLine : true
            });
        }

        //---edit complete to YAML
        var js = JSON.parse(val);
        console.log(js);
        var txt = new Uint8Array(js.data);

        //---File System Access API
        var vopt = new VFileType();
        vopt = FILEOPTION.VRMA.types[0];
        var vf = new VFileOptions();
        vf.suggestedName = "motion.vrma";

        if (options.disktype == "i") {
            //---To internal storage
            //   save data: File object
            appPrompt(callback.t("msg_motion_save"),(fname)=>{
                vf.types.push(vopt);
                vf.suggestedName = fname + (fname.indexOf(".vrma") > -1 ? "" : ".vrma");
                var accval = "";
                var acckey = "";
                for (var obj in vopt.accept) {
                    acckey = obj;
                    accval = vopt.accept[obj];
                    break;
                }
                var curdate = new Date();
                var content = new Blob([txt], {type : acckey});
                var gfile = new File([txt], fname);
                var meta = new AppDBMeta(
                    fname + (fname.indexOf(FILEEXTENSION_VRMA) == -1 ? FILEEXTENSION_VRMA : ""),
                    fname,
                    gfile.size,
                    "VRMA",
                    curdate,
                    curdate
                );
                AppDB.avatar_meta.setItem(meta.fullname, meta);
                AppDB.vrma.setItem(meta.fullname, {
                    filename : meta.fullname,
                    data : gfile
                })
                .then(ret => {
                    notify();
                });
            });
        }else if (options.disktype == "f") {
            //---To Local disk
            //   save data: File(byte[])
            if (VFileHelper.flags.isElectron) {
                vf.types.push(vopt);
                VFileHelper.saveUsingDialog(txt,vf,true);
            }else{
                appPrompt(callback.t("msg_motion_save"),(fname)=>{
                    vf.types.push(vopt);
                    vf.suggestedName = fname + (fname.indexOf(".vrma") > -1 ? "" : ".vrma");
                    var acckey = "";
                    var accval = "";
                    for (var obj in vopt.accept) {
                        acckey = obj;
                        accval = vopt.accept[obj];
                        break;
                    }
                    var content = new Blob([txt], {type : acckey});
                    var burl = URL.createObjectURL(content);
                    VFileHelper.saveUsingDialog(burl,vf,true)
                    .then(ret => {
                        URL.revokeObjectURL(burl);
                    });
                    
                },vf.suggestedName);
            }
        }else if (options.disktype == "g") {
            //---To Google drive
            //   save data: byte[]
            var googlemeta = {
                extension:FILEEXTENSION_VRMA,
                nameoverwrite : true, //always overwrite saving
                isbinary : true
            }
            
            const enterSave = (value) => {
                VFileHelper.saveToGoogleDrive(false,googlemeta,value)
                .then(retdum => {
                    //---confirm latest saved file
                    return VFileHelper.confirmGoogleDriveLastSavedFile(googlemeta);
                })
                .then(retjs => {
                    notify();
                    
                })
                .catch(err => {
                    Quasar.Notify.create({
                        message : "Google Drive save error" + err.toString(), 
                        position : "top-right",
                        color : "error",
                        textColor : "white",
                        timeout : 3000, 
                        multiLine : true
                    });
                });
            }
            

            appPrompt(callback.t("msg_motion_save"),(fname)=>{
                googlemeta["name"] = fname + (fname.indexOf(FILEEXTENSION_VRMA) > -1 ? "" : FILEEXTENSION_VRMA)
                
                enterSave(txt);
            });
        }
        
        
    }
    async savepose (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const filename = options.filename;
        const mode = options.mode; 
        const notify = () => {
            Quasar.Notify.create({
                message : callback.t("cons_save_complete"), 
                position : "top-right",
                color : "info",
                textColor : "black",
                timeout : 3000, 
                multiLine : true
            });
        }

        if (mode == "i") { 
            //---internal storage
            var js = val; //JSON.parse(val);
            var pose = new VVPoseConfig(-1,js);
            pose.name = filename;
            AppDB.pose.setItem(filename,js);
        }else if (mode == "f") {
            //---to disk directly
            var opt = new VFileOptions();
            opt.types = FILEOPTION.POSE.types;
            opt.suggestedName = filename + FILEEXTENSION_POSE;

            var content = null;
            var useHTMLSaving = false;

            //---for security
            //if ("thumbnail" in val) val.thumbnail = ""
            //else val["thumbnail"] = "";

            if (VFileHelper.checkNativeAPI) {
                content = JSON.stringify(val);

                VFileHelper.saveUsingDialog(
                    content,
                    opt,
                    useHTMLSaving
                );
            }else{
                var tmpcontent = JSON.stringify(val);

                var acckey = "";
                var accval = "";
                for (var obj in opt.types[0].accept) {
                    acckey = obj;
                    accval = opt.types[0].accept[obj];
                    break;
                }
                content = new Blob([tmpcontent], {type : acckey});
                var burl = URL.createObjectURL(content);

                var ret = await VFileHelper.saveUsingDialog(
                    burl,
                    opt,
                    useHTMLSaving
                );
                if (ret.cd == 0) {

                }else{

                }
                URL.revokeObjectURL(burl);
            
            }
         
        }else if (mode == "g") {
            //--Google Drive
            var googlemeta = {
                name : filename + (filename.indexOf(FILEEXTENSION_POSE) > -1 ? "" : FILEEXTENSION_POSE),
                extension:FILEEXTENSION_POSE,
                nameoverwrite : true //always overwrite saving
            }
            
            var tmpcontent = (val);
            const enterSave = (value) => {
                VFileHelper.saveToGoogleDrive(false,googlemeta,value)
                .then(retdum => {
                    //---confirm latest saved file
                    return VFileHelper.confirmGoogleDriveLastSavedFile(googlemeta);
                })
                .then(retjs => {
                    notify();
                    
                })
                .catch(err => {
                    Quasar.Notify.create({
                        message : "Google Drive save error" + err.toString(), 
                        position : "top-right",
                        color : "error",
                        textColor : "white",
                        timeout : 3000, 
                        multiLine : true
                    });
                });
            }
            enterSave(tmpcontent);
        }
    }
    async endingVRAR (val, options) {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const mainData = callback.mainData;
        const timelineData = callback.timelineData;
        const modelOperator = callback.modelOperator;

        var js = JSON.parse(val);
        console.log("endingVRAR=",js);

        var proj = new VVAnimationProject(js);

        //---Scan all objects to apply keyframe changes.
        for (var i = 0; i < proj.timeline.characters.length; i++) {
            /**
             * @type {VVAnimationFrameActor}
             */
            var chara = proj.timeline.characters[i];
            /**
             * @type {VVTimelineTarget}
             */
            var tl = modelOperator.getTimeline(chara.targetRole);
            if (tl) {
                if (chara.targetType in [
                    AF_TARGETTYPE.VRM,AF_TARGETTYPE.OtherObject,
                    AF_TARGETTYPE.Camera,AF_TARGETTYPE.Light,
                    AF_TARGETTYPE.Effect,AF_TARGETTYPE.Image,
                    AF_TARGETTYPE.Text3D
                ]) {
                    for (var f = 0; f < chara.frames.length; f++) {
                        var fdata = chara.frames[f];
                        //---this time key of Unity side is "index"
                        //   HTML side is "key".
                        var hitkeyframe = tl.getFrameByKey(fdata.index);
                        if (!hitkeyframe) {
                            var vf = new VVTimelineFrameData(fdata.index, fdata);
                            vf.data["translateMoving"] = modelOperator.analyzeTranslateMoving(fdata);
                            tl.insertFrame(fdata.index,vf);
                        }
                    }
                }
            }
        }

    }
    async loadAfterVRMA(val, options)  {
        /**
         * @type {UnityCallbackFunctioner}
         */
        const callback = options.callback;
        const mainData = callback.mainData;
        const modelOperator = callback.modelOperator;
        const vrmui = callback.objpropData.elements.vrmui;
        const strageTypeName = (id) => {
            for (var obj in STORAGE_TYPE) {
                if (id == STORAGE_TYPE[obj]) {
                    return obj;
                }
                "";
            }
        }

        mainData.elements.loading = false;

        var js = JSON.parse(val);
        var vac = new VRMAnimationClip();
        vac.filename = js.filename;
        vac.clips =  js.clips;
        vac.originalFile = options.loadingfileHandle;
        console.log(vac);

        var ishit = mainData.elements.projdlg.vrmaList.findIndex(v => {
            if (v.filepath == vac.originalFile.path) {
                return true;
            }
            return false;
        });

        if (ishit == -1) {
            //---loaded VRMA list of parent
            mainData.elements.projdlg.vrmaList.push({
                filename : vac.filename,
                clipCount : vac.clips.length,
                filepath : vac.originalFile.path,
                storageTypeId : vac.originalFile.storageType,
                storageType : strageTypeName(vac.originalFile.storageType),
                save : options.saveInProject,
                data : vac,
            });
            //---selection VRMA list
            vrmui.vrmanim.list.options.push(vac.filename);
        }
        if (options.objectURL) {
            URL.revokeObjectURL(options.objectURL);
        }

    }
}
export const defineUnityCallback = (mainData,ribbonData,objlistData,objpropData,timelineData,unityConfig,refs) => {
    const { t } = VueI18n.useI18n({ useScope: 'global' });

    const UnityCallback = new UnityCallbackFunctioner(mainData,ribbonData,objlistData,objpropData,timelineData,unityConfig,refs);
    return {
        UnityCallback
    }
}