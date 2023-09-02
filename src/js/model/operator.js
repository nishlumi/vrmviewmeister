import { AF_TARGETTYPE, AF_MOVETYPE, CNS_BODYBONES, IKBoneType, INTERNAL_FILE, FILEEXTENSION_ANIMATION, FILEOPTION} from "../../res/appconst.js"
import { VVAnimationProject, VVAvatar, VVCast, VVSelectedObjectItem,  VVBlendShape, VVAvatarEquipSaveClass, VVTimelineTarget, VVTimelineFrameData, VVAnimationFrameActor, VVAnimationProjectMaterialPackage, VVAnimationFrame } from '../prop/cls_vvavatar.js';
import { AnimationParsingOptions, AnimationRegisterOptions, BvhData, BvhNode, UnityVector3 } from "../prop/cls_unityrel.js";
import { ChildReturner } from "../../../public/static/js/cls_childreturner.js";
import { AppDBMeta } from "../appconf.js";
import { appDataTimeline } from "../prop/apptimelinedata.js";
import { appMainData } from "../prop/appmaindata.js";
import { UnityCallbackFunctioner } from "./callback.js";
import { appDataRibbon } from "../prop/appribbondata.js";
import { appDataObjectProp } from "../prop/appobjpropdata.js";
import { VFileHelper } from "../../../public/static/js/filehelper.js";

export class appModelOperator {
    /**
     * 
     * @param {appMainData} mainData 
     * @param {appDataRibbon} ribbonData 
     * @param {*} objlistData 
     * @param {appDataObjectProp} objpropData 
     * @param {appDataTimeline} timelineData 
     * @param {UnityCallbackFunctioner} UnityCallback 
     * @param {*} refs 
     */
    constructor(mainData, ribbonData, objlistData, objpropData, timelineData, UnityCallback, refs) {
        /**
         * @type {appMainData}
         */
        this.mainData = mainData;
        /**
         * @type {appDataRibbon}
         */
        this.ribbonData = ribbonData;
        this.objlistData = objlistData;
        /**
         * @type {appDataObjectProp}
         */
        this.objpropData = objpropData;
        /**
         * @type {appDataTimeline}
         */
        this.timelineData = timelineData;
        /**
         * @type {UnityCallbackFunctioner}
         */
        this.UnityCallback = UnityCallback;
        this.refs = refs;

        const { t   } = VueI18n.useI18n({ useScope: 'global' });
        this._t = t;
    }
    destroy() {
        this.mainData.appconf.save();
        for (var i = 0; i < this.mainData.data.vrms.length; i++) {
            var target = this.mainData.data.vrms[i];
            //this.continueEvent(false);
            if (target.type == AF_TARGETTYPE.VRM) {
                //this.callUnityCanvas("DestroyVRM",target.id);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'DestroyVRM',param:target.id},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }else if (target.type == AF_TARGETTYPE.OtherObject) {
                //this.callUnityCanvas("DestroyOther",target.id);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'DestroyOther',param:target.id},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }else if (target.type == AF_TARGETTYPE.Light) {
                //this.callUnityCanvas("DestroyOther",target.id);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'DestroyLight',param:target.id},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }else if (target.type == AF_TARGETTYPE.Camera) {
                //this.callUnityCanvas("DestroyOther",target.id);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'DestroyCamera',param:target.id},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }else if (target.type == AF_TARGETTYPE.Image) {
                //this.callUnityCanvas("DestroyOther",target.id);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'DestroyImage',param:target.id},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }else if (target.type == AF_TARGETTYPE.Effect) {
                //this.callUnityCanvas("DestroyOther",target.id);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'DestroyEffect',param:target.id},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }else if (target.type == AF_TARGETTYPE.Text) {
                //this.callUnityCanvas("DestroyOther",target.id);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'DestroyText',param:target.id},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }else if (target.type == AF_TARGETTYPE.UImage) {
                //this.callUnityCanvas("DestroyOther",target.id);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'DestroyUImage',param:target.id},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }
            this.data.vrms[i].destroy();
        }
        AppQueue.start();

        localStorage.removeItem("tempvideo");
    }
    setDarkMode(flag) {
        Quasar.Dark.set(flag);
        this.timelineData.states.toppanelCSS["q-dark"] = flag;
        this.timelineData.states.toppanelCSS["text-dark"] = !flag;

    }
    setTitle(title,isAppName = true) {
        var addtitle = "";
        if (title != "") {
            addtitle = `[ ${title} ]`;
        }
        document.title = `${(isAppName ? this.mainData.appinfo.name : "")} ${ addtitle }`;
    }
    setScreenSize (width, height, isDefault = false) {
        if (isDefault === true) {
            this.mainData.elements.canvas.styles.width = "100%";
            this.mainData.elements.canvas.styles.height = "100%";
            //this.mainData.elements.canvas.scrollArea.width = "100%";
            //this.mainData.elements.canvas.scrollArea.height = "100%";
            Vue.nextTick(() => {
                const ww = parseInt(this.refs.unitycontainer.value.clientWidth);
                const hh = parseInt(this.refs.unitycontainer.value.clientHeight);
                this.ribbonData.elements.scr_size.width = ww; //document.getElementById("unity-canvas").width;
                this.ribbonData.elements.scr_size.height = hh //document.getElementById("unity-canvas").height;
                this.mainData.elements.canvas.width =  ww;
                this.mainData.elements.canvas.height =  hh;
                this.mainData.elements.navigationdlg.webglw = ww;
                this.mainData.elements.navigationdlg.webglh = hh;

                var newresolution = [ww,hh].join(",");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'Reload2DObject',param:newresolution},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            });
        }else{
            this.mainData.elements.canvas.styles.width = `${width}px`;
            this.mainData.elements.canvas.styles.height = `${height}px`;
            //this.mainData.elements.canvas.scrollArea.width = `${width}px`;
            //this.mainData.elements.canvas.scrollArea.height = `${height}px`;
            const ww = parseInt(width);
            const hh = parseInt(height);
            this.ribbonData.elements.scr_size.width = ww; 
            this.ribbonData.elements.scr_size.height = hh;
            this.mainData.elements.canvas.width =  ww;
            this.mainData.elements.canvas.height =  hh;
            this.mainData.elements.navigationdlg.webglw = ww;
            this.mainData.elements.navigationdlg.webglh = hh;
            Vue.nextTick(() => {
                var newresolution = [ww,hh].join(",");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'Reload2DObject',param:newresolution},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            });
        }
        
        
    }
    newProject(isAlsoUnity = true) {
        if (isAlsoUnity) {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'NewProject'},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        const proj = this.mainData.data.project;

        proj.timelineFrameLength = parseInt(this.mainData.appconf.confs.animation.initial_framecount);
        this.ribbonData.elements.frame.max = proj.timelineFrameLength;

        this.mainData.elements.projdlg.pinfo.fps = proj.fps;

        this.ribbonData.elements.frame.baseDuration = proj.fps / 6000.0;

        this.mainData.states.currentProjectFilename = "project";
        this.mainData.states.currentProjectHandle = null;
        this.mainData.states.currentProjectFromFile = true;

        //---objprop
        this.objpropData.colliderTargetSelected = null;

        //---ribbon bar
        const syseff = this.ribbonData.elements.syseff;
        syseff.bloom.checked = false;
        syseff.bloom.intensity = 0;
        syseff.chroma.checked = false;
        syseff.chroma.intensity = 0;
        syseff.colorgrd.checked = false;
        syseff.colorgrd.filter = "";
        syseff.colorgrd.temperature = 0;
        syseff.colorgrd.tint = 0;
        syseff.depthov.checked = false;
        syseff.depthov.aperture = 5.6;
        syseff.depthov.focallength = 50;
        syseff.grain.checked = false;
        syseff.grain.intensity = 1;
        syseff.grain.size = 1;
        syseff.vignette.checked = false;
        syseff.vignette.intensity = 0;
        syseff.moblur.checked = false;
        syseff.moblur.shutterangle = 270;
        syseff.moblur.samplecount = 10;

        this.setTitle("");

        //---set up fixed object
        this.mainData.data.vrms.splice(0,this.mainData.data.vrms.length);
        this.timelineData.data.timelines.splice(0,this.timelineData.data.timelines.length);
        proj.casts.splice(0,proj.casts.length);
        proj.timeline.characters.splice(0, proj.timeline.characters.length);
        //for (var i = mainData.data.vrms.length-1; i >= 0; i--) {
        //    modelOperator.del_objectItem(mainData.data.vrms[i]);
        //}
        //timelineData.data.timelines.forEach(tl => {
        //    tl.clearAll();
        //});
        //---forcely remove empty timeline
        //modelOperator.clearTimeline();
        this.mainData.states.currentEditOperationCount = 0;
        this.mainData.states.backupEditOperationCount = 0;
    }
    //==============================================================
    //
    //  getter functions
    //
    //==============================================================

    /**
     * Get Avatar directly from id.
     * @param {String} name VRM/OtherObject's id
     * @returns {VVAvatar} hitted object
     */
    getAvatar  (name)  {
        var ret = null;
        for (var i = 0; i < this.mainData.data.vrms.length; i++) {
            if (this.mainData.data.vrms[i].id == name) {
                ret = this.mainData.data.vrms[i];
                break;
            }
        }
        return ret;
    }
    /**
     * Get Avatar object from role name
     * @param {String} role role name in project
     * @returns {VVCast} hitted object
     */
    getAvatarFromRole (role)  {
        var ret = this.mainData.data.project.casts.find(match => {
            if (match.roleName == role) return true;
            return false;
        });
        return ret;
    }
    /**
     * Get Cast(Role) from role name
     * @param {String} roleName role name of Cast
     * @param {String} conditionType role is rolename, title is roletitle, path is path
     * @returns 
    */
    getRole (roleName,conditionType) {
        var ret = null;
        ret = this.mainData.data.project.casts.find(match => {
            if (conditionType == "role") {
                if (match.roleName == roleName) return true;
            }else if (conditionType == "title") {
                if (match.roleTitle == roleName) return true;
            }else if (conditionType == "path") {
                if (match.path == roleName) return true;
            }
            
            return false;
        });
        return ret;
    }
    /**
     * Get Cast(Role) from avatar's id
     * @param {String} avatarId avatar id
     * @returns {VVCast} hitted Cast object
     */
    getRoleFromAvatar (avatarId)  {
        var ret = this.mainData.data.project.casts.find(match => {
            if (match.avatar && match.avatar.id == avatarId) return true;
            return false;
        });
        return ret;
    }
    /**
     * @param {String} id id of avatar
     * @returns {VVSelectedObjectItem}
     */
    getSelected_objectItem (id)  {
        var ret = null;
        //var id = elem.getAttribute("data-id");
        for (var i = 0; i < this.mainData.data.vrms.length; i++) {
            if (this.mainData.data.vrms[i].id == id) {
                ret = new VVSelectedObjectItem(i,this.mainData.data.vrms[i],null);
            }
        }
        return ret;
    }
    /**
     * 
     * @param {String} roleName 
     * @returns {VVTimelineTarget}
     */
    getTimeline (roleName) {
        return this.timelineData.data.timelines.find(item  => {
            if (!item.target) return false;
            if (item.target.roleName == roleName) return true;
            return false;
        });
    }
    /**
     * 
     * @param {VVAvatar} avatar 
     * @param {Boolean} isOpenDialog 
     * @returns 
     */
    getVRMInfo (avatar,isOpenDialog) {
        if (avatar.type != AF_TARGETTYPE.VRM) {
            appAlert(this._t("msg_modelinfo_check1"));
            return;
        }
        
        this.mainData.elements.vrminfodlg.selectedAvatar = avatar;
        this.mainData.elements.vrminfodlg.showmode = true;
        this.mainData.elements.vrminfodlg.show = isOpenDialog;
    }
    /**
     * 
     * @param {AF_TARGETTYPE} avatar 
     */
    enumerateTargetBones(avatar) {
        var ret = [];
        if (avatar == AF_TARGETTYPE.VRM) {
            for (var obj in IKBoneType) {
                if ((IKBoneType[obj] >= IKBoneType.IKParent) && 
                    (IKBoneType[obj] <= IKBoneType.RightLeg)
                ){
                    ret.push({label:obj, id:IKBoneType[obj]});
                }
                
            }
        }else{
            ret.push({label: "IKParent", id: IKBoneType.IKParent});
        }
        return ret;
    }
    /**
     * 
     * @param {AF_TARGETTYPE} avatar 
     */
    selectInitialTargetBones(avatar) {
        this.ribbonData.elements.frame.bonelist.selection.splice(0, this.ribbonData.elements.frame.bonelist.selection.length);
        if (avatar == AF_TARGETTYPE.VRM) {
            for (var obj in IKBoneType) {
                if ((IKBoneType[obj] >= IKBoneType.IKParent) && 
                    (IKBoneType[obj] <= IKBoneType.RightLeg)
                ){
                    this.ribbonData.elements.frame.bonelist.selection.push(IKBoneType[obj]);
                }
            }
        }else{
            this.ribbonData.elements.frame.bonelist.selection.push(IKBoneType.IKParent);
        }
        return this.ribbonData.elements.frame.bonelist.selection;
    }
    /**
     * select specified bone to register key-frame
     * @param {IKBoneType} bone 
     */
    selectSpecifyBoneForRegister(bone) {
        var ishit = this.ribbonData.elements.frame.bonelist.selection.findIndex(v => {
            if (v == bone) return true;
            return false;
        });
        if (ishit == -1) this.ribbonData.elements.frame.bonelist.selection.push(bone);
    }
    /**
     * operation after adding VRM
     * @param {AF_TARGETTYPE} type 
     * @param {VVAvatar} avatar 
     * @param {Object} additionalData
     * @return {VVCast} registered role object
     */
    addVRM (type, avatar, additionalData)  {
        this.mainData.data.vrms.push(avatar);

        var role = null;
        if (additionalData[2] == "o") {
            role = this.getRole(additionalData[1],"title");
        }
        if (role != null) {
            role.avatar = avatar;
            role.avatarId = avatar.id;
            role.type = avatar.type;

            //+++var tl = this.children.timeline.getTimeline(role.roleName);
            //+++if (tl) tl.setTarget(role);
        }else{
            //[creation point] VVCast
            role = new VVCast(additionalData[0],additionalData[1]);
            role.avatar = avatar;
            role.avatarId = avatar.id;
            role.type = avatar.type;
            this.mainData.data.project.casts.push(role);

            //+++this.elements.timeline.appendTimeline(role);
        }

        return role;
    }
    /**
     * operation after adding OtherObject ~ Effect
     * @param {AF_TARGETTYPE} type 
     * @param {JSON} json 
     * @param {String} path
     * @returns 
     */
    addObject (type, json, path)  {
        //[creation point] VVAvatar
        var it = new VVAvatar(type,json);

        this.mainData.data.vrms.push(it);
        
        var role = null;
        if (json.isOverwrite == "o") {
            role = this.getRole(path,"title");
        }
        if (role != null) {
            role.avatar = it;
            role.avatarId = it.id;
            role.type = it.type;
        }else{
            //[creation point] VVCast
            var role = new VVCast(json.roleName,json.roleTitle);
            role.avatar = it;
            role.avatarId = it.id;
            role.avatarTitle = path;
            role.path = path;
            role.type = it.type;
            this.mainData.data.project.casts.push(role);
        }

        //+++this.children.timeline.appendTimeline(role);

        return {
            avatar :it,
            role : role
        };
    }
    /**
     * 
     * @param {AF_TARGETTYPE} type 
     * @param {JSON} json 
     * @param {Array<String>} additionalData [0] - ?, [1] - role title, [2] - "o" is search by title
     * @returns {VVAvatar}
     */
    addRecoverObject(type, json, additionalData) {

        var role = null;
        if (additionalData[2] == "o") {
            role = this.getRole(additionalData[1],"title");
        }

        //[creation point] VVAvatar
        var hitobj = "";
        for (var obj in AF_TARGETTYPE) {
            if (AF_TARGETTYPE[obj] == type) {
                hitobj = obj;
                break;
            }
        }
        var it = new VVAvatar(hitobj,{
            id : json.avatarId,
            Title : additionalData[1] || json.avatarTitle,
            type : hitobj,
        });
        if (role != null) {
            role.avatar = it;
            role.avatarId = it.id;
            role.type = it.type;
        }
        this.mainData.data.vrms.push(it);

        return it;
    }
    /**
     * 
     * @param {VVAvatar} avatar 
     * @param {Array<IKBoneType>} bonetypes
     * @param {Array<AF_MOVETYPE>} movetypes
     * @param {String} mode overwrite, append
     */
    addKeyFrame(avatar, bonetypes, movetypes, mode = "overwrite") {
        /**
         * @type {VVTimelineTarget}
         */
        var selectedTimeline = this.mainData.states.selectedTimeline;
        if (selectedTimeline.target.avatar == null) {
            appAlert(this._t("msg_disable1_addkeyframe"));
            return;
        }
        if (this.timelineData.states.currentcursor == 0) return;
        var aro = new AnimationRegisterOptions();
        aro.targetId = avatar.id;
        aro.targetType = avatar.type;
        aro.index = this.timelineData.states.currentcursor;
        aro.registerBoneTypes = bonetypes;
        aro.registerMoveTypes = movetypes;
        if (mode == "append") {
            aro.isRegisterAppend = 1;
            aro.addTranslateExecuteIndex = this.timelineData.elements.childKey.val;
            var ishitmovetype = movetypes.findIndex(v => {
                if (v == AF_MOVETYPE.Translate) return true;
                return false;
            });
            //if (ishitmovetype > -1) this.timelineData.elements.childKey.max++;
        }else{
            //this.timelineData.elements.childKey.max = 0;
        }

        if (this.mainData.appconf.confs.animation.with_compling === true) {
            aro.isCompileForLibrary = 1;
        }
        
        aro.isRotate360 = this.objpropData.elements.common.fastRotate360 ? "1" : "0";
        

        //---timeline ui
        var fdata = new VVTimelineFrameData(aro.index,{
            //targetId : this.parent.states.selectedAvatar.id,
            //targetType : this.parent.states.selectedAvatar.type,
            //data : this.parent.states.selectedCast
        });
        /**
         * @type {VVTimelineTarget}
         */
        var tl = this.mainData.states.selectedTimeline;
        if (tl) {
            var keyframe = tl.getFrameByKey(fdata.key);
            if (keyframe) {
                tl.setFrameByKey(fdata.key, fdata);
            }else{
                tl.insertFrame(aro.index,fdata);
            }
        }            
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'RegisterFrameFromOuter',param:JSON.stringify(aro)},
            "registernowpose",QD_INOUT.returnJS,
            this.UnityCallback.registernowpose,
            {callback : this.UnityCallback, selectedTimeline: tl}
        ));
        AppQueue.start();
    }
    /**
     * Remove a keyframe of specified index
     * @param {VVAvatar} avatar 
     * @param {Number} frameIndex 
     * @param {AF_MOVETYPE} movetype
     */
    removeKeyframe(avatar, frameIndex, movetype = AF_MOVETYPE.Rest) {
        var aro = new AnimationRegisterOptions();
        aro.targetId = avatar.id;
        aro.targetType = avatar.type;
        aro.index = frameIndex;
        aro.registerMoveTypes = [movetype];
        
        //---timeline ui    
        this.mainData.states.selectedTimeline.clearFrame(aro.index, movetype);

        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'UnregisterFrame',param:JSON.stringify(aro)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        this.mainData.states.currentEditOperationCount++;
    }
    /**
     * Remove specified child key in any key-frame
     * @param {VVAvatar} avatar 
     * @param {Number} frameIndex 
     * @param {Number} childIndex 
     */
    removeChildKey(avatar, frameIndex, childIndex) {
        appConfirm(this._t("msg_delframe_currentkey"),()=>{
            var aro = new AnimationRegisterOptions();
            aro.targetId = avatar.id;
            aro.targetType = avatar.type;
            aro.index = frameIndex;
            aro.addTranslateExecuteIndex = childIndex;
            
            //---timeline ui    
            var fr = this.mainData.states.selectedTimeline.getFrameByKey(aro.index);
            if ("translateMoving" in fr.data) {
                fr.data.translateMoving--;
                this.timelineData.elements.childKey.max--;
                if (this.timelineData.elements.childKey.max == 2) {
                    this.timelineData.elements.childKey.disable_remove = true;
                }else{
                    this.timelineData.elements.childKey.disable_remove = false;
                }
            }

            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'DeleteChildKey',param:JSON.stringify(aro)},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            this.mainData.states.currentEditOperationCount++;
        });
    }
    /**
     * enumerate file in the internal storage by file type
     * @param {String} dbname appconst.INTERNAL_FILE
     * @param {String}  searchname file name to search
     */
    enumerateFilesToProjectSelector(dbname, searchname = "") {
        var db = AppDB[INTERNAL_FILE[dbname]];
        if (db) {
            var metadb = (INTERNAL_FILE[dbname] == INTERNAL_FILE.PROJECT) ? AppDB.scene_meta : AppDB.avatar_meta;

            this.mainData.elements.projectSelector.selectDBName = dbname;
            this.mainData.elements.projectSelector.files.splice(0,this.mainData.elements.projectSelector.files.length);

            var csearchname = searchname.toLowerCase();
            metadb.iterate((value,key,num)=> {
                if (value.type == dbname) {
                    var ishit = false;
                    if (csearchname == "") {
                        ishit = true;
                    }else{
                        ishit = value.fullname.toLowerCase().indexOf(csearchname) > -1;
                    }
                    if (ishit === true) {
                        var tmpname = value.fullname.split(".");
                        var meta = new AppDBMeta(value.fullname,
                            (VFileHelper.flags.isElectron ? value.name : value.fullname),
                            value.size,
                            value.type,
                            value.createdDate.toLocaleString(),
                            value.updatedDate.toLocaleString()
                        );
                        this.mainData.elements.projectSelector.files.push(meta);
                    }   
                }
            })
            .finally(() => {
                if (this.mainData.elements.projectSelector.files.length == 0) {
                    this.mainData.elements.projectSelector.selected = "";
                }
            });
        }
    }
    /**
     * 
     * @param {FileSystemFileHandle} handle 
     * @param {*} options 
     */
    async verifyFileHandlePermission(handle,options) {
        if (await handle.requestPermission(options) === "granted"){
            return true;
        }
        // not grant permission, return false.
        return false;
    }
    /**
     * Delete Avatar(VVAvatar) without to detach role and timeline
     * @param {VVAVatar} avatar 
     * @returns 
     */
    del_objectItem (avatar)  {
        var ret = false;
        var afterIndex = -1;

        for (var i = 0; i < this.mainData.data.vrms.length; i++) {
            if (this.mainData.data.vrms[i].id == avatar.id) {
                var role = this.getRoleFromAvatar(avatar.id);

                //---detach cast(role) and timeline
                if (role) {
                    role.avatar = null;
                    role.avatarId = "";
                }
                this.mainData.data.vrms.splice(i,1);
                ret = true;
                afterIndex = (i >= this.mainData.data.vrms.length-1) ? i-1 : i;
                break;
            }
        }

        //---after select
        this.mainData.states.selectedAvatar = this.mainData.data.vrms[afterIndex];
        

        return ret;
    }
    /**
     * Delete Cast(role) and timeline
     * @param {VVCast} role 
     * @param {String} type 
     */
    del_roleAndTimelilne (role,type)  {
        //---Apply HTML
        this.del_timelineOnly(role.roleName);

        //---Apply Unity
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'ApplyAllVRM_ResetIKTargetBySearchObject',param:role.roleTitle},
            "",QD_INOUT.toUNITY,
            null
        ));

        var param = role.roleName + "," + type;
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'DeleteAvatarFromCast',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        //AppQueue.start();
        this.mainData.states.currentEditOperationCount++;

    }
    del_timelineOnly (role) {
        var index = this.mainData.data.project.casts.findIndex(match => {
            if (match.roleName == role) return true;
            return false;
        });

        //---start removing from timelines and project.casts
        var tlindex = this.timelineData.data.timelines.findIndex(item => {
            if (item.target.roleName == role) return true;
            return false;
        });
        if (tlindex > -1) this.timelineData.data.timelines.splice(tlindex,1);
        if (index > -1) this.mainData.data.project.casts.splice(index,1);

    }
    /**
     * To remove all timelines
     */
    clearTimeline() {
        for (var i = this.timelineData.data.timelines.length-1; i >= 0; i--) {
            var tl = this.timelineData.data.timelines[i];
            if (tl.fixed === false) {
                this.timelineData.data.timelines.splice(i,1);
            }
        }

        this.mainData.states.currentEditOperationCount++;
    }
    /**
     * To remove the object all type.(not Cast)
     * @param {VVAvatar} selavatar object to remove
     */
    removeBodyObject (selavatar)  {
        //var sel = this.getSelected_objectItem();
        if (!selavatar) return;

        //this.del_objectItem(sel.index);
        //this.continueEvent(false);
        if (selavatar.type == AF_TARGETTYPE.VRM) {
            //this.callUnityCanvas('DestroyVRM', sel.avatar.id);
            //---Unequip an equipments
            for (var i = 0; i < this.mainData.data.vrms.length; i++) {
                var obj = this.mainData.data.vrms[i];
                if (
                    (obj.type == AF_TARGETTYPE.OtherObject) || 
                    (obj.type == AF_TARGETTYPE.Light) || 
                    (obj.type == AF_TARGETTYPE.Camera) || 
                    (obj.type == AF_TARGETTYPE.Image) ||
                    (obj.type == AF_TARGETTYPE.Effect)
                ) {
                    var eq = selavatar.isEquipping(obj);
                    if ((eq.avatar != null) && (eq.parts != null)) {
                        var param = selavatar.unequip(true, eq.parts, obj);
                        AppQueue.add(new queueData(
                            {target:selavatar.id,method:'UnequipObjectFromOuter',param:param},
                            "destroyobject",QD_INOUT.returnJS,
                            this.UnityCallback.destroyAfter,
                            {callback : this.UnityCallback}
                        ));
                    }
                }
            }
            //---delete avatar and detach from cast(role)
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'DestroyVRM',param:selavatar.id},
                "",QD_INOUT.toUNITY,
                null
            ));
        }else if ((selavatar.type == AF_TARGETTYPE.OtherObject) || (selavatar.type == AF_TARGETTYPE.Image)) { 
            //---search an avatar, equipped it.
            for (var i = 0; i < this.mainData.data.vrms.length; i++) {
                var vrm = this.mainData.data.vrms[i];
                var isHit = vrm.isEquipping(selavatar.id);
                if (isHit && isHit.avatar) {
                    var param = isHit.avatar.unequip(true, isHit.parts, selavatar);
                    AppQueue.add(new queueData(
                        {target:isHit.avatar.id,method:'UnequipObjectFromOuter',param:param},
                        "destroyobject",QD_INOUT.returnJS,
                        this.UnityCallback.destroyAfter,
                        {callback : this.UnityCallback}
                    ));
                    break;
                }
            }
            //---delete avatar and detach from cast(role)
            if (selavatar.type == AF_TARGETTYPE.Image) { 
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'DestroyImage',param:selavatar.id},
                    "destroyobject",QD_INOUT.returnJS,
                    this.UnityCallback.destroyAfter,
                    {callback : this.UnityCallback}
                ));
            }else{
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'DestroyOther',param:selavatar.id},
                    "destroyobject",QD_INOUT.returnJS,
                    this.UnityCallback.destroyAfter,
                    {callback : this.UnityCallback}
                ));
            }
        }else if (selavatar.type == AF_TARGETTYPE.Light) { 
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'DestroyLight',param:selavatar.id},
                "destroyobject",QD_INOUT.returnJS,
                this.UnityCallback.destroyAfter,
                {callback : this.UnityCallback}
            ));
        }else if (selavatar.type == AF_TARGETTYPE.Camera) { 
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'DestroyCamera',param:selavatar.id},
                "destroyobject",QD_INOUT.returnJS,
                this.UnityCallback.destroyAfter,
                {callback : this.UnityCallback}
            ));
        }else if (selavatar.type == AF_TARGETTYPE.Effect) { 
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'DestroyEffect',param:selavatar.id},
                "destroyobject",QD_INOUT.returnJS,
                this.UnityCallback.destroyAfter,
                {callback : this.UnityCallback}
            ));
        }else if (selavatar.type == AF_TARGETTYPE.Text) { 
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'DestroyText',param:selavatar.id},
                "destroyobject",QD_INOUT.returnJS,
                this.UnityCallback.destroyAfter,
                {callback : this.UnityCallback}
            ));
        }else if (selavatar.type == AF_TARGETTYPE.UImage) { 
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'DestroyUImage',param:selavatar.id},
                "destroyobject",QD_INOUT.returnJS,
                this.UnityCallback.destroyAfter,
                {callback : this.UnityCallback}
            ));
        }
        //AppQueue.start();
        this.del_objectItem(selavatar);
    }

    deselect_objectItem ()  {
        this.objlistData.elements.objectlist.selected = "";
        this.mainData.states.selectedAvatar = null;
        this.mainData.states.selectedCast = null;
        this.mainData.states.selectedTimeline = null;
        //this.mainData.states.selectedProp = null;

        //$store.commit("vrmthis.mainData/setSelectedAvatar",null);
    }
    /**
     * Move frame number on the timeline, and connect Vue.watch(currentcursor)...
     * @param {Number} index 
     */
    select_keyframePosition (index) {
        for (var obj of this.timelineData.data.headercounts) {
            obj.vclass.currentcursor = false;
        }
        //item.vclass.currentcursor = true;
        const newval = index+1;
        //---Fire watch event
        this.timelineData.states.currentcursor = newval;
        //-->  timeline.js.wa_frame_current 
        this.timelineData.elements.seekbar = newval;

        var fr = this.mainData.states.selectedTimeline.getFrameByKey(newval);
        if (fr) {
            var isenable = false;
            if ("translateMoving" in fr.data) {
                this.timelineData.elements.childKey.max = fr.data.translateMoving-1 || 0;
                this.timelineData.elements.childKey.val = -1;
                if (fr.data.translateMoving > 1) isenable = true;
                else isenable = false;
            }else{
                isenable = false;
            }
            this.timelineData.elements.childKey.isEnable = isenable;
            if (this.timelineData.elements.childKey.val == -1) {
                this.timelineData.elements.childKey.disable_remove = true;    
            }else{
                this.timelineData.elements.childKey.disable_remove = !isenable;
            }
            
        }else{
            this.timelineData.elements.childKey.disable_remove = true;
        }
    }
    /**
     * Select specified timeline by the Role
     * @param {VVCast} role 
     */
    select_timeline (role) {
        for (var obj = 0; obj < this.timelineData.data.timelines.length; obj++) {
            var tl = this.timelineData.data.timelines[obj];
            if (tl.target == role) {
                tl.selected.currentcursor = true;
                this.mainData.states.selectedTimeline = tl;
            }else{
                tl.selected.currentcursor = false;
            }
        }
    }
    /**
     * Select specified object.
     * @param {String} name object's id
     */
    select_objectItem (name, isPropertyOnly = false)  {
        //deselect_objectItem();
        var selected = this.getSelected_objectItem(name);
        if (selected) {
            //elements.objectlist.selected = selected.avatar.id;
            var role = this.getRoleFromAvatar(selected.avatar.id);

            //---For whole reference: save to vuex
            if (!isPropertyOnly) {
                //this.mainData.states.selectedAvatar = selected.avatar;
                this.mainData.states.selectedCast = role;

                //---timeline change coloring(selecting)
                if (role) {
                    this.select_timeline(role);
                }
                
                this.objpropData.states.dimension = "3d";
            }
            
            this.ribbonData.elements.frame.bonelist.options = this.enumerateTargetBones(selected.avatar.type);
            this.selectInitialTargetBones(selected.avatar.type);
            this.objpropData.elements.common.fastRotate360 = false;

            //===========================================================================================
            // Common properties
            //---setup each panel: turn on/off panel, enumerate avatar's BlendShapes, equipList
            if (
                (selected.avatar.type == AF_TARGETTYPE.Text) || 
                (selected.avatar.type == AF_TARGETTYPE.UImage)
            ) {
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetCommonTransformFromOuter'},
                    "gettransform2D",QD_INOUT.returnJS,
                    this.UnityCallback.gettransform2D,
                    {callback : this.UnityCallback}
                ));
                this.objpropData.states.dimension = "2d";
            }else if (selected.avatar.type == AF_TARGETTYPE.SystemEffect) {

            }else if (selected.avatar.type == AF_TARGETTYPE.Audio) {

            }else if (selected.avatar.type == AF_TARGETTYPE.Stage) {
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetCommonTransformFromOuter'},
                    "gettransform3D",QD_INOUT.returnJS,
                    this.UnityCallback.gettransform3D,
                    {callback : this.UnityCallback}
                ));
            }else{
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetCommonTransformFromOuter'},
                    "gettransform3D",QD_INOUT.returnJS,
                    this.UnityCallback.gettransform3D,
                    {callback : this.UnityCallback}
                ));
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetFixMovingFromOuter'},
                    "getfixmoving",QD_INOUT.returnJS,
                    this.UnityCallback.getfixmoving,
                    {callback : this.UnityCallback}
                ));
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetJumpPowerFromOuter'},
                    "getjumppower",QD_INOUT.returnJS,
                    this.UnityCallback.getjumppower,
                    {callback : this.UnityCallback}
                ));
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetJumpNumFromOuter'},
                    "getjumpnum",QD_INOUT.returnJS,
                    this.UnityCallback.getjumpnum,
                    {callback : this.UnityCallback}
                ));
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetPunchFromOuter'},
                    "getpunch",QD_INOUT.returnJS,
                    this.UnityCallback.getpunch,
                    {callback : this.UnityCallback}
                ));
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetShakeFromOuter'},
                    "getshake",QD_INOUT.returnJS,
                    this.UnityCallback.getshake,
                    {callback : this.UnityCallback}
                ));
            }

            //==========================================================================================
            //  Each properties
            this.ribbonData.elements.frame.bonelist.disable_bodyselect = true;
            if (this.mainData.states.selectedAvatar.type == AF_TARGETTYPE.VRM) {
                this.listupEquipList(this.mainData.states.selectedAvatar);
                this.ribbonData.elements.frame.bonelist.disable_bodyselect  = false;
            }

            var tmpav = this.getAvatar(selected.avatar.id);
            //---Properties of Each object-------------------
            if (selected.avatar.type == AF_TARGETTYPE.VRM) {
                
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetIndicatedPropertyFromOuter'},
                    "getpropertyVRM",QD_INOUT.returnJS,
                    this.UnityCallback.getpropertyVRM,
                    {avatar: tmpav, callback : this.UnityCallback}
                    
                ));
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetBlinkEye'},
                    "getblinkeye",QD_INOUT.returnJS,
                    this.UnityCallback.getpropertyBlinkEye,
                    {avatar: tmpav, callback : this.UnityCallback}
                    
                ));
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'ListProxyBlendShapeFromOuter'},
                    "getlistblendshapeproxy",QD_INOUT.returnJS,
                    this.UnityCallback.getListBlendShapeProxy,
                    {avatar: tmpav, callback : this.UnityCallback}
                    
                ));
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'ListFingerPoseClass'},
                    "getfingerposeclass",QD_INOUT.returnJS,
                    this.UnityCallback.getfingerposeclass,
                    {avatar: tmpav, callback : this.UnityCallback}
                    
                ));
                /*AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetTextureConfig',param:""},
                    "gettextureconfig",QD_INOUT.returnJS,
                    this.UnityCallback.getpropertyTextureConfig,
                    {avatar: tmpav, callback : this.UnityCallback}
                    
                ));*/
            }else if (selected.avatar.type == AF_TARGETTYPE.OtherObject) {
                //ID("slid_other_animation_seek").max = this.states.selectedAvatar.animations.length;
                //ID("slid_other_animation_seek").value = 0;
                var oflag = 0;
                if (selected.avatar.type == AF_TARGETTYPE.OtherObject) {
                    oflag = 1;
                }
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                    "getpropertyOtherObject",QD_INOUT.returnJS,
                    this.UnityCallback.getpropertyOtherObject,
                    { oflag : oflag, avatar: tmpav, callback : this.UnityCallback}
                ));
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetTargetClipFromOuter'},
                    "getcurrentanimclip",QD_INOUT.returnJS,
                    this.UnityCallback.get_current_animationcilp,
                    { oflag : oflag, avatar: tmpav, callback : this.UnityCallback}
                ));
            }else if (selected.avatar.type == AF_TARGETTYPE.Image) {
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetIndicatedPropertyFromOuter',param:0},
                    "getpropertyImageObject",QD_INOUT.returnJS,
                    this.UnityCallback.getpropertyOOImage,
                    { oflag : oflag, avatar: tmpav, callback : this.UnityCallback}
                ));
            }else if (selected.avatar.type == AF_TARGETTYPE.Light) {
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                    "getpropertyLight",QD_INOUT.returnJS,
                    this.UnityCallback.getpropertyLight, 
                    { avatar: tmpav, callback : this.UnityCallback}
                ));
            }else if (selected.avatar.type == AF_TARGETTYPE.Camera) {
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                    "getpropertyCamera",QD_INOUT.returnJS,
                    this.UnityCallback.getpropertyCamera,
                    { avatar: tmpav, callback : this.UnityCallback}
                ));
            }else if (selected.avatar.type == AF_TARGETTYPE.Effect) {            
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                    "getpropertyEffect",QD_INOUT.returnJS,
                    this.UnityCallback.getpropertyEffect,
                    { avatar: tmpav, callback : this.UnityCallback}
                ));
            }else if (selected.avatar.type == AF_TARGETTYPE.Text) {
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                    "getpropertyText",QD_INOUT.returnJS,
                    this.UnityCallback.getpropertyText,
                    { avatar: tmpav, callback : this.UnityCallback}
                ));
            }else if (selected.avatar.type == AF_TARGETTYPE.UImage) {
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetIndicatedPropertyFromOuter',param:1},
                    "getpropertyUImage",QD_INOUT.returnJS,
                    this.UnityCallback.getpropertyUImage,
                    { avatar: tmpav, callback : this.UnityCallback}
                ));

            }else if (selected.avatar.type == AF_TARGETTYPE.Stage) {
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'ListStageFromOuter',param:1},
                    "liststage",QD_INOUT.returnJS,
                    this.UnityCallback.liststage,
                    {callback : this.UnityCallback}
                ));
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetActiveStageType',param:1},
                    "getstagetype",QD_INOUT.returnJS,
                    this.UnityCallback.getstagetype,
                    {callback : this.UnityCallback}
                ));
                //---sea stage
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'ListUserMaterialFromOuter',param:"1"},
                    "getseastage_material",QD_INOUT.returnJS,
                    this.UnityCallback.getseastage_material,
                    {callback: this.UnityCallback}
                ));
                //---user stage
                AppQueue.add(new queueData(
                    {target:selected.avatar.id,method:'GetMaterialUserStageFromOuter'},
                    "getustg_materialfloat",QD_INOUT.returnJS,
                    this.UnityCallback.getustg_materialfloat,
                    {callback: this.UnityCallback}
                ));
                //---sky mode
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'GetIndicatedPropertyFromOuter'},
                    "getPropertySky",QD_INOUT.returnJS,
                    this.UnityCallback.getPropertySky,
                    {callback: this.UnityCallback}
                ));
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.DLight,method:'GetRotationFromOuter'},
                    "get_dlightrotation",QD_INOUT.returnJS,
                    this.UnityCallback.get_dlight_rotation,
                    {callback: this.UnityCallback}
                ));
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.DLight,method:'GetPowerFromOuter'},
                    "get_dlightpower",QD_INOUT.returnJS,
                    (val) => {
                        this.objpropData.elements.stageui.dlight_power = parseFloat(val);
                    }
                ));
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.DLight,method:'GetShadowPowerFromOuter'},
                    "get_dlightshadowpower",QD_INOUT.returnJS,
                    (val) => {
                        this.objpropData.elements.stageui.dlight_strength = parseFloat(val);
                    }
                ));
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.DLight,method:'GetColorFromOuter'},
                    "get_dlightcolor",QD_INOUT.returnJS,
                    (val) => {
                        this.objpropData.elements.stageui.dlight_color = MUtility.toHexaColor(val);
                    }
                ));
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Windzone,method:'GetIndicatedPropertyFromOuter',param:1},
                    "getpropertyWind",QD_INOUT.returnJS,
                    this.UnityCallback.getPropertyWindzone,
                    {callback : this.UnityCallback}
                ));
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Windzone,method:'GetWindDirFromOuter',param:1},
                    "getwinddir",QD_INOUT.returnJS,
                    this.UnityCallback.getWinddir,
                    {callback : this.UnityCallback}
                ));
            }
            //===============================================
            //this.getUnityData_EachObject(vsel.avatar.type);
            AppQueue.start();

            //this.judge_accordion(vsel.avatar.type);
            //this.toggleUIStates(vsel.avatar.type,true);
        }
    }

    //==============================================================
    //
    //  material functions
    //
    //==============================================================

    /**
     * Load materials in app
     * @param {Boolean} isEffectiveLoad 
     * @returns 
     */
    load_materialFile (isEffectiveLoad = false)  {
        const apptbl = this.mainData.elements.projdlg.materialLoadedRows[this.mainData.elements.projdlg.mat_tabradio];
        this.mainData.elements.projdlg.materialrows = this.mainData.elements.projdlg.materialLoadedRows[this.mainData.elements.projdlg.mat_tabradio];
        return AppDB.materials.iterate( (value,key,num) => {
            if (value.location == "a") {
                var row = {
                    preview : URL.createObjectURL(value.file),
                    name : value.name,
                    oldname : value.name,
                    type : value.type,
                    typeId : value.type,
                    path : value.file.name
                };
                apptbl.push(row);
            }
        },() => {
            //this.mainData.elements.projdlg.mat_firstload = true;
            return true;
        });   
    }
    /**
     * 
     * @param {String} fromtype 
     * @param {VVAnimationProjectMaterialPackage} pkg 
     */
    async listload_materialFile(fromtype, pkg) {
        if ("materials" in pkg) {
            const projdlg = this.mainData.elements.projdlg;
            for (var i = 0; i < pkg.materials.length; i++) {
                var row = {
                    preview : "",
                    name : pkg.materials[i].name,
                    oldname : pkg.materials[i].name,
                    type : projdlg.mat_materialTypeOptions[pkg.materials[i].materialType],
                    typeId : projdlg.mat_materialTypeOptions[pkg.materials[i].materialType],
                    path : pkg.materials[i].path
                };
                this.mainData.elements.projdlg.materialLoadedRows[fromtype].push(row);
                
            }
    
            //---complete URL of row 
            var tbl = this.mainData.elements.projdlg.materialLoadedRows[fromtype];
            for (var i = 0; i < tbl.length; i++) {
                var row = tbl[i];
                AppDB.materials.iterate( (value,key,num) => {
                    if (
                        (value.name == row.name) &&
                        (value.location == "p") &&
                        (value.projectName == this.mainData.states.currentProjectFilename)
                    ) {
                        //---get object-url from indexedDB
                        var url = URL.createObjectURL(value.file);
                        row.preview = url;
                        //---apply Unity also
                        var param = [row.name,"",row.preview,this.mainData.elements.projdlg.mat_tabradio].join("\t");
                        AppQueue.add(new queueData(
                            {target:AppQueue.unity.ManageAnimation,method:'LoadOneMaterialTexture', param:param},
                            "loadmaterialtexture",QD_INOUT.returnJS,
                            (val, options) => {
                                if (val == "") {
                                    AppDB.writeLog(`operator.listload_materialFile[${options.name}]`,"warning",this._t("msg_material_notfound"));
                                }
                            },{name: row.name}
                        ));
                    }
                });
            }
        }
        
    }
    /**
     * load effectively a material in the app
     */
    load_materialFileBody() {
        const apptbl = this.mainData.elements.projdlg.materialLoadedRows[this.mainData.elements.projdlg.mat_tabradio];

        //---apply Unity also
        for (var i = 0; i < apptbl.length; i++) {
            var item = apptbl[i];
            var param = [item.name,"",item.preview,"1",this.mainData.elements.projdlg.mat_tabradio].join("\t");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'LoadMaterialTexture', param:param},
                "loadmaterialtexture",QD_INOUT.returnJS,
                (val, options) => {
                    if (val == "") {
                        AppDB.writeLog(`operator.load_materialFileBody[${options.name}]`,"warning",this._t("msg_material_found"));
                    }
                },{name: item.name}
            ));
        }
        this.mainData.elements.projdlg.mat_firstload = true;
    }
    destroy_materialFile  (isProjectOnly = false) {
        if (!isProjectOnly) {
            this.mainData.elements.projdlg.materialrows = null;
            this.mainData.elements.projdlg.materialLoadedRows.a.forEach(item => {
                URL.revokeObjectURL(item.preview);
            });
            this.mainData.elements.projdlg.materialLoadedRows.a.splice(0, this.mainData.elements.projdlg.materialLoadedRows.a.length);    
        }
        
        this.mainData.elements.projdlg.materialLoadedRows.p.forEach(item => {
            URL.revokeObjectURL(item.preview);
        });
        this.mainData.elements.projdlg.materialLoadedRows.p.splice(0, this.mainData.elements.projdlg.materialLoadedRows.p.length);
    }
    
    //==============================================================
    //
    //  VRM functions
    //
    //==============================================================
    /**
     * 
     * @param {VVAvatar} avatar 
     */
    listupBlendShapes (avatar)  {
        const autocutBlendShapeString = (val) => {
            var ret = val;
            const cutStrList = [
                "M_F00_000_00_",
                "M_A00_000_00_",
                "PROX:"
            ];
            for (var i = 0; i < cutStrList.length; i++) {
                var curstr = cutStrList[i];
                ret = ret.replace(curstr,"");
            }
            return ret;
        }
        var data = avatar.blendShapes;
        var sel = this.getSelected_objectItem(avatar.id);

        //---current reset
        this.objpropData.elements.vrmui.blendshapes.splice(0,this.objpropData.elements.vrmui.blendshapes.length);
        this.objpropData.elements.vrmui.proxyBlendshapes.splice(0,this.objpropData.elements.vrmui.proxyBlendshapes.length);
        avatar.blendShapeList.splice(0,avatar.blendShapeList.length);

        //---(re)generate blend shape items
        if (avatar.type == AF_TARGETTYPE.VRM) {
            if (avatar.blendShapeList.length > 0) {
                for (var i = 0; i < avatar.blendShapeList.length; i++) {
                    if (avatar.blendShapeList[i].id.startsWith("PROX:")) {
                        this.objpropData.elements.vrmui.proxyBlendshapes.push(avatar.blendShapeList[i]);
                    }else{
                        this.objpropData.elements.vrmui.blendshapes.push(avatar.blendShapeList[i]);
                    }
                    
                }
            }else{
                var arr = data.split(",");
                var newarr = [];
                for (var i = 0; i < arr.length; i++) {
                    var ln = arr[i].split("=");
                    var cls = new VVBlendShape();
                    cls.id = ln[0];

                    var facestr = ln[0].split(".");
                    var blstitle = autocutBlendShapeString(facestr.length > 1 ? facestr[1] : facestr[0]);
                    var titlearr = blstitle.split(":");
                    if (titlearr.length > 1) {
                        //format: MeshPartsName:BlendshapeName=value
                        //                      ^^^^^^^^^^^^^^
                        cls.title = titlearr[1];
                    }else{
                        cls.title = titlearr[0];
                    }
                    
                    //---change C# float to int 1-100%
                    cls.value = parseFloat(ln[1]);
                    if (isNaN(cls.value)) {
                        cls.value = 0;
                    }else{
                        if (cls.id.startsWith("PROX:")) {
                            cls.value = Math.round(cls.value * 100);
                        }else{
                            cls.value *= 1;
                        }
                        
                    }
                    
                    newarr.push(cls);

                    if (cls.id.startsWith("PROX:")) {
                        if (i <= 17) {
                            this.objpropData.elements.vrmui.proxyBlendshapes.push(cls);
                        }else{
                            this.objpropData.elements.vrmui.blendshapes.push(cls);    
                        }
                    }else{
                        this.objpropData.elements.vrmui.blendshapes.push(cls);
                    }
                    
                }
                avatar.blendShapeList = newarr;
            }
        }
    }
    /**
     * enumerate equip information on select avatar
     * @param {VVAvatar} avatar 
     */
    listupEquipList (avatar)  {
        if (avatar.type == AF_TARGETTYPE.VRM) {
            this.objpropData.elements.vrmui.equip.equipments.splice(0, this.objpropData.elements.vrmui.equip.equipments.length);
            for (var i in CNS_BODYBONES) {
                avatar.equipList.forEach(item => {
                    if (CNS_BODYBONES[i] == item.bodybonename) {
                        this.objpropData.elements.vrmui.equip.equipments.push(item);
                    }
                });
            }
        }
    }
    /**
     * 
     * @param {VVCast} equipitem 
     */
    checkEnumurateEquipping (equipitem) {
        var ret = {avatar: null, parts: null};
        for (var i = 0; i < this.mainData.data.vrms.length; i++) {
            /**
             * @type {VVAvatar}
             */
            var vrm = this.mainData.data.vrms[i];
            if (vrm.type == AF_TARGETTYPE.VRM) {
                ret = vrm.isEquipping(equipitem);
                break;
            }
        }
        return ret;
    }

    //==============================================================
    //
    //  Timeline functions
    //
    //==============================================================
    /**
     * 
     * @param {VVAnimationProject} project 
     */
    async LoadAndApplyToTimelineUI(project) {
        this.ribbonData.elements.frame.max = parseInt(project.timelineFrameLength);

        this.ribbonData.elements.frame.fps = parseInt(project.fps);

        var overmb = this.mainData.appconf.confs.application.not_autoload_over_mb || -1;
        const calc_overmb = parseInt(overmb)*1024*1024;
        const overmessage = (fname) => {
            Quasar.Notify.create({
                message : this._t("msg_noload_oversize_file") + " " + fname,
                position : "bottom-right",
                multiLine : true,
                timeout : 3000,
                color : "info",
                textColor : "black",
                actions: [
                    { label: 'OK', color: 'yellow', handler: () => { /* ... */ } }
                ]
            });
        }
        /**
         * 
         * @param {String} ftype 
         * @param {VOSFile} vos 
         */
        const localFileOpen = async (ftype, vos) => {
            var mimetype = "";
            var result = null;
            for (var obj in FILEOPTION[ftype].types[0].accept) {
                mimetype = obj;
            }
            //---new version is VOSFile.data
            var chk = await VFileHelper.checkFilepath(vos.path);
            if (chk === true) {
                var files = await VFileHelper.openFromPath(vos.path,{
                    isBinary : true,
                    mimetype : mimetype
                });
                if (files.length > 0) {
                    if (files[0].encoding === "binary") {
                        result = new Blob([files[0].data]);
                    }else{
                        result = files[0].data;
                    }
                }
            }
            return result;
        }

        //---set up new cast and role
        for (var i = 0; i < project.casts.length; i++) {
            var cast = project.casts[i];

            if (cast.avatarId != "") {
                if (cast.type == AF_TARGETTYPE.VRM) {
                    var dbf = await AppDB.vrm.getItem(cast.path);
                    if (dbf) {
                        var f = null;
                        if (dbf.data instanceof File) {
                            //---ver 2.x
                            f = dbf.data;
                        }else if (dbf instanceof File) {
                            //---ver 1.x
                            f = dbf;
                        }else{
                            //---Electron and ver 2.x
                            f = await localFileOpen("VRM",dbf);
                        }
                        if ((overmb == -1) || (f.size < calc_overmb)) {
                            var fdata = URL.createObjectURL(f);
                            //this.mainData.data.objectUrl.vrm = fdata;
                            //this.mainData.states.fileloadname = f.name;
                            //this.mainData.states.fileloadtype = "v";
                            //this.mainData.states.loadingfileHandle = f;
                            AppQueue.add(new queueData(
                                {target:AppQueue.unity.FileMenuCommands,method:'LoadVRMURI',param:fdata},
                                "firstload_vrm",QD_INOUT.returnJS,
                                this.UnityCallback.historySendObjectInfo,
                                {callback:this.UnityCallback,objectURL:fdata}
                            ));
                            AppQueue.add(new queueData(
                                {target:AppQueue.unity.FileMenuCommands,method:'AcceptLoadVRM'},
                                "accept_vrm",QD_INOUT.returnJS,
                                this.UnityCallback.firstload_vrm,
                                {callback:this.UnityCallback,filename:f.name,
                                 fileloadtype: "v",
                                 loadingfileHandle : f}
                            ));
                        }else{
                            this.mainData.elements.percentLoad.current += this.mainData.elements.percentLoad.percent;
                            overmessage(f.name);
                        }
                        
                    }else{
                        this.mainData.elements.percentLoad.current += this.mainData.elements.percentLoad.percent;
                        //---error file notify
                        Quasar.Notify.create({
                            message : "VRM: " + this._t("msg_notfound_file") + ": " + cast.path,
                            position : "bottom-right",
                            color : "negative",
                            textColor : "white",
                            timeout : 3000,
                            multiLine : true
                        });
                    }
                }else if (cast.type == AF_TARGETTYPE.OtherObject) {
                    var dbf = await AppDB.obj.getItem(cast.path);
                    if (dbf) {
                        var f = null;
                        if (dbf.data instanceof File) {
                            //---ver 2.x
                            f = dbf.data;
                        }else if (dbf instanceof File) {
                            //---ver 1.x
                            f = dbf;
                        }else{
                            //---Electron and ver 2.x
                            f = await localFileOpen("OBJECTS",dbf);
                        }
                        if ((overmb == -1) || (f.size < calc_overmb)) {
                            var fdata = URL.createObjectURL(f);
                            //this.mainData.data.objectUrl.vrm = fdata;
                            //this.mainData.states.fileloadname = f.name;
                            //this.mainData.states.fileloadtype = "o";
                            //this.mainData.states.loadingfileHandle = f;
                            var filearr =  f.name.split(".");
                            var ext = filearr[filearr.length-1];
                            
                            var param = [fdata,f.name,ext].join("\t");
                            AppQueue.add(new queueData(
                                {target:AppQueue.unity.FileMenuCommands,method:'LoadOtherObjectURI',param:param},
                                "sendobjectinfo",QD_INOUT.returnJS,
                                this.UnityCallback.sendObjectInfo,
                                {callback:this.UnityCallback,objectURL:fdata,filename:f.name,
                                    fileloadtype: "o",
                                    loadingfileHandle : f}
                            ));
                        }else{
                            this.mainData.elements.percentLoad.current += this.mainData.elements.percentLoad.percent;
                            overmessage(f.name);
                        }
                    }else{
                        if (cast.path == "%BLANK%") {
                            //---Non file object
                            var it = this.addRecoverObject(cast.type, cast, ["",cast.roleTitle, "o"]);
                        }else{
                            this.mainData.elements.percentLoad.current += this.mainData.elements.percentLoad.percent;
                            //---error file notify
                            Quasar.Notify.create({
                                message : "Other Object: " + this._t("msg_notfound_file") + ": " +  cast.path,
                                position : "bottom-right",
                                color : "negative",
                                textColor : "white",
                                timeout : 3000,
                                multiLine : true
                            });
                        }
                    }
                }else if (cast.type == AF_TARGETTYPE.Image) {
                    var dbf = await  AppDB.image.getItem(cast.path);
                    if (dbf) {
                        var f = null;
                        if (dbf.data instanceof File) {
                            //---ver 2.x
                            f = dbf.data;
                        }else if (dbf instanceof File) {
                            //---ver 1.x
                            f = dbf;
                        }else{
                            //---Electron and ver 2.x
                            f = await localFileOpen("IMAGES",dbf);
                        }
                        if ((overmb == -1) || (f.size < calc_overmb)) {
                            var fdata = URL.createObjectURL(f);
                            //this.mainData.states.fileloadname = f.name;
                            //this.mainData.states.loadingfile = fdata;
                            //this.mainData.states.loadingfileHandle = f;
                            var filearr =  f.name.split(".");
                            var ext = filearr[filearr.length-1];
                            
                            var param = [fdata,f.name,ext].join("\t");
                            AppQueue.add(new queueData(
                                {target:AppQueue.unity.FileMenuCommands,method:'ImageFileSelected',param:param},
                                "sendobjectinfo",QD_INOUT.returnJS,
                                this.UnityCallback.sendObjectInfo,
                                {callback:this.UnityCallback,objectURL:fdata,filename:f.name,
                                    fileloadtype: "img",
                                    loadingfileHandle : f}
                            ));
                            AppQueue.start();
                        }else{
                            this.mainData.elements.percentLoad.current += this.mainData.elements.percentLoad.percent;
                            overmessage(f.name);
                        }
                    }else{
                        this.mainData.elements.percentLoad.current += this.mainData.elements.percentLoad.percent;
                        //---error file notify
                        Quasar.Notify.create({
                            message : "Image: " + this._t("msg_notfound_file") + ": " + cast.path,
                            position : "bottom-right",
                            color : "negative",
                            textColor : "white",
                            timeout : 3000,
                            multiLine : true
                        });
                    }
                }else if (cast.type == AF_TARGETTYPE.UImage) {
                    var dbf = await AppDB.image.getItem(cast.path);
                    if (dbf) {
                        var f = null;
                        if (dbf.data instanceof File) {
                            //---ver 2.x
                            f = dbf.data;
                        }else if (dbf instanceof File) {
                            //---ver 1.x
                            f = dbf;
                        }else{
                            //---Electron and ver 2.x
                            f = await localFileOpen("IMAGES",dbf);
                        }
                        if ((overmb == -1) || (f.size < calc_overmb)) {
                            var fdata = URL.createObjectURL(f);
                            //this.mainData.states.fileloadname = f.name;
                            //this.mainData.states.loadingfile = fdata;
                            //this.mainData.states.loadingfileHandle = f;
                            var filearr =  f.name.split(".");
                            var ext = filearr[filearr.length-1];
                            
                            var param = [fdata,f.name,ext].join("\t");
                            AppQueue.add(new queueData(
                                {target:AppQueue.unity.FileMenuCommands,method:'UIImageFileSelected',param:param},
                                "sendobjectinfo",QD_INOUT.returnJS,
                                this.UnityCallback.sendObjectInfo,
                                {callback:this.UnityCallback,objectURL:fdata,filename:f.name,
                                    fileloadtype: "ui",
                                    loadingfileHandle : f}
                            ));
                            AppQueue.start();
                        }else{
                            this.mainData.elements.percentLoad.current += this.mainData.elements.percentLoad.percent;
                            overmessage(f.name);
                        }
                    }else{
                        this.mainData.elements.percentLoad.current += this.mainData.elements.percentLoad.percent;
                        //---error file notify
                        Quasar.Notify.create({
                            message : "UImage: " + this._t("msg_notfound_file") + ": " + cast.path,
                            position : "bottom-right",
                            color : "negative",
                            textColor : "white",
                            timeout : 3000,
                            multiLine : true
                        });
                    }
                }else if (cast.type == AF_TARGETTYPE.SystemEffect){
                }else if (cast.type == AF_TARGETTYPE.Stage) {
                    
                }else if (cast.type == AF_TARGETTYPE.Audio) {
                }else{
                    //---Non file object
                    var it = this.addRecoverObject(cast.type, cast, ["",cast.roleTitle, "o"]);
                }
            }
        }

        //---set up new data timeline
        project.timeline.characters.forEach(element => {
            //---search each Avatar
            this.SingleApplyToTimelineUI(element, element.targetRole);
            
        });

        //---Audio
        /*
        project.htmlOnly.timeline.BGM.forEach(bgm => {
            var fdata = new VVTimelineFrameData(bgm);
            this.children.timeline.getTimeline("BGM").insertFrame(bgm.key, fdata);
        });
        project.htmlOnly.timeline.SE.forEach(se => {
            var fdata = new VVTimelineFrameData(se);
            this.children.timeline.getTimeline("SE").insertFrame(se.key, fdata);
        });
        */
    }
    /**
     * 
     * @param {VVAnimationFrameActor} timelineElement targeted frame actor object on the Unity
     * @param {String} role target role's roleName
     */
    SingleApplyToTimelineUI(timelineElement, role) {
        /**
         * 
         * @param {VVAnimationFrame} frame 
         * @returns {Number} count of translate registration
         */
        const analyzeTranslateMoving = (frame) => {
            var chkikparent = "0"; //for check only
            var ret = frame.movingData.filter(m => {
                var marr = m.split(",");
                if ((marr[0] == chkikparent) && (marr[2] == "position")) return true;
                return false;
            });
            return ret.length;
        }
        var av = this.getAvatarFromRole(role);
        if (av) {
            var tl = this.timelineData.data.timelines.find(item => {
                if (item.target.roleName == av.roleName) return true;
                return false;
            });
            if (tl) { //---already role timeline exists.
                tl.clearAll();
                //---enumurate and insert frames of the Avatar
                timelineElement.frames.forEach(frame => {
                    var fdata = new VVTimelineFrameData(frame.index,frame);
                    fdata.data["translateMoving"] = analyzeTranslateMoving(frame);
                    tl.insertFrame(frame.index,fdata);
                    
                });
            }else{
                //---timeline not exist, create timeline of HTML version
                /**
                 * @type {VVCast} tmpcast
                 */
                var tmpcast = this.mainData.data.project.casts.find(match=>{
                    if (match.roleName == role) return true;
                    return false;
                });
                if (tmpcast) {
                    var nav = tmpcast;
                    /**
                     * @type {VVTimelineTarget} tl
                     */
                    var tl = new VVTimelineTarget(nav);
                    this.timelineData.data.timelines.push(tl);
                    
                    //---enumurate and insert frames of the Avatar
                    timelineElement.frames.forEach(frame => {
                        var fdata = new VVTimelineFrameData(frame.index,frame);
                        fdata.data["translateMoving"] = analyzeTranslateMoving(frame);
                        tl.insertFrame(frame.index,fdata);
                        
                    });
                }
                
            }
        }else{

        }
    }
    /**
     * load frame contents of all timeline 
     * @param {Number} newval frame index (1~n)
     * @param {Object} options paramater options (childkey: Number)
     * @param {Boolean} isSelectObject do select after preview ?
     */
    common_loadFrame (newval, options, isSelectObject = true){
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'PreparePreviewMarker'},
            "",QD_INOUT.toUNITY,
            null
        ));
        for (var i = 0; i < this.mainData.data.project.casts.length; i++) {
            var item = this.mainData.data.project.casts[i];
            if ((item.avatar != null) && (item.avatar != "")) {
                var param = new AnimationParsingOptions();
                param.index = newval;
                param.isCameraPreviewing = 0;
                
                param.isExecuteForDOTween = 1;
                
                //param.isCompileAnimation = this.appconf.confs.animation.with_compling ? 1 : 0;
                //param.targetId = item.avatar.id;
                var ishitpreview = false;
                if (this.mainData.appconf.confs.animation.preview_onlyselected_whenselected === true) {
                    if (item.avatarId == this.mainData.states.selectedCast.avatarId) ishitpreview = true;
                }else{
                    ishitpreview = true;
                }
                if (item.avatarId == this.mainData.states.selectedCast.avatarId) {
                    if (options.childkey > -1) {
                        param.addTranslateExecuteIndex = options.childkey;
                    }
                }
                param.targetRole = item.roleName;
                param.targetType = item.avatar.type.toString();

                var js = JSON.stringify(param);

                if (ishitpreview) {
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.ManageAnimation,method:'PreviewSingleFrame',param:js},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                }
                
            }
            
        }
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'BackupPreviewMarker'},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'FinishPreviewMarker'},
            "",QD_INOUT.toUNITY,
            null
        ));

        //---fixed every call: SystemEffect, Audio
        AppQueue.add(new queueData(
            {target:AppQueue.unity.AudioBGM,method:'GetIndicatedPropertyFromOuter'},
            "getpropbgm",QD_INOUT.returnJS,
            this.UnityCallback.getPropertyAudio,
            {callback:this.UnityCallback, AudioType:AppQueue.unity.AudioBGM}
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.AudioSE,method:'GetIndicatedPropertyFromOuter'},
            "getpropse",QD_INOUT.returnJS,
            this.UnityCallback.getPropertyAudio,
            {callback:this.UnityCallback, AudioType:AppQueue.unity.AudioSE}
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageSystemEffect,method:'GetIndicatedPropertyFromOuter',param:1},
            "getpropsyse",QD_INOUT.returnJS,
            this.UnityCallback.getPropertySystemEffect,
            {callback:this.UnityCallback}
        ));

        if (isSelectObject) {
            this.mainData.states.old_selectedAvatar = this.mainData.states.selectedAvatar;
            this.select_objectItem(this.mainData.states.selectedAvatar.id,true);
            if (this.mainData.states.selectedAvatar.type == AF_TARGETTYPE.VRM) {
                this.returnBoneTransformReloadBtn({avatarId:this.mainData.states.selectedAvatar.id});
            }
        }
        //AppQueue.start();
    }
    callVRM_limitedBoneOperation() {
        var param = [
            this.mainData.appconf.confs.model.body_natural_limit ? 1 : 0,
            this.mainData.appconf.confs.model.interlock_body_pelvis ? "p,1" : "p,0",
            this.mainData.appconf.confs.model.interlock_body_arms ? "a,1" : "a,0", 
            this.mainData.appconf.confs.model.interlock_body_legs ? "l,1" : "l,0"
        ]
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'RecoverBoneLimitatonMarker',param:param.join("\t")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //==============================================================
    //
    //  child window functions
    //
    //==============================================================

    /**
     * filtering function of the data from child dialog
     * @param {ChildReturner} data 
     */
    filteringFromChildWindow(data) {
        if (data.windowName == "pose") { //---pose dialog
            if (data.funcName == "apply_pose") {
                var js = JSON.parse(data.data);
                this.returnPoseDialogValue(js);
            }
        }else if (data.windowName == "mediapipe") {
            if (data.funcName == "apply_pose") {
                var js = JSON.parse(data.data);
                this.returnMediaPipePose(js);
            }
        }else if (data.windowName == "bonetransform") {
            if (data.funcName == "apply_pose") {
                var js = JSON.parse(data.data);
                this.returnBoneTransformApply(js);
            }else if (data.funcName == "call_getikvalue") {
                var js = JSON.parse(data.data);
                this.returnBoneTransformReloadBtn(js);
            }
        }
    }
    //--------------------------------------------------
    // opener function for PoseDialog
    //--------------------------------------------------
    returnPoseDialogValue(pose) {
        if (!this.mainData.states.selectedAvatar) {
            appAlert(this._t("msg_pose_noselectmodel"));
            return;
        }
        if (this.mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
            appAlert(this._t("msg_pose_noselectmodel"));
            return;
        }
        if (!this.mainData.appconf.confs.model.apply_pose_global_position) {
            for (var i = pose.frameData.frames[0].movingData.length-1; i >= 0; i--) {
                var ln = pose.frameData.frames[0].movingData[i];
                var arr = ln.split(",");
                if (arr[0] == "0") {
                    pose.frameData.frames[0].movingData.splice(i,1);
                }
            }
        }
        AppQueue.add(new queueData(
            {target:this.mainData.states.selectedAvatar.id,method:'AnimateAvatarTransform',param:JSON.stringify(pose)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //-------------------------------------------------
    // Mediapipe window
    //-------------------------------------------------
    returnMediaPipePose (pose) {
        if (this.mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
            appAlert(t("msg_error_mediapipe1"));
            return;
        }
        AppQueue.add(new queueData(
            {target:this.mainData.states.selectedAvatar.id,method:'GetIKTransformAll'},
            "saveTPoseInfo",QD_INOUT.returnJS,
            this.UnityCallback.saveTPoseInfo,
            {pose : pose, callback : this.UnityCallback}
        ));
        AppQueue.start();
    }
    applyMediaPipe(pose) {
        //console.log(pose);
        var TwoPoint2CenterCalc = (left, right) => {
            var le2 = parseFloat(Math.abs(left));
            var ri2 = parseFloat(Math.abs(right));

            var calc = (le2 - ri2) * 0.5;

            var dir = 0;
            if (le2 > ri2) {
                dir = -1;
            }else{
                dir = 1;
            }
            return calc * dir;
        }

        var height = parseFloat(this.mainData.states.selectedAvatar.height.replace("cm","").trim());
        var pelvisY = !this.mainData.states.selectedAvatar.TPoseInfo ? 
            parseFloat((height/100.0) * 0.55) 
            : parseFloat(this.mainData.states.selectedAvatar.TPoseInfo.list[6].position.y);
            //: parseFloat(this.states.selectedAvatar.TPoseInfo.y);
        var posx = 1; var posy = 2; var posz = 3; var rotx = 4; var roty = 5; var rotz = 6;
        var pelvis = 6;
        var leftshoulder = IKBoneType.LeftShoulder; var rightshoulder = IKBoneType.RightShoulder; 
        var leftlowerarm = IKBoneType.LeftLowerArm; var rightlowerarm = IKBoneType.RightLowerArm; 
        var lefthand = IKBoneType.LeftHand; var righthand = IKBoneType.RightHand;
        var leftlowerleg = IKBoneType.LeftLowerLeg; var rightlowerleg = IKBoneType.RightLowerLeg; 
        var leftfoot = IKBoneType.LeftLeg; var rightfoot = IKBoneType.RightLeg;

        var poseland = pose.poseWorldLandmarks;
        var unitylist = [];
        //Head ~ Pelvis
        var ss = this.mainData.states.selectedAvatar.TPoseInfo;

        /*
        //---generate ikname array.
        var iknames = [];
        for (var obj in IKBoneType) {
            iknames.push(obj);
        }
        var ikix = 0;


        //---IKParent
        unitylist.push({
            ikname : iknames[IKBoneType.IKParent],
            position : ss.list[0].position,
            rotation : new UnityVector3(180,180,180)
        });

        //---EyeviewHandle
        unitylist.push({
            ikname : iknames[IKBoneType.EyeViewHandle],
            position : new UnityVector3(
                TwoPoint2CenterCalc(poseland[2].x,poseland[5].x),
                ss.list[1].position.y,ss.list[1].position.z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Nose 2 Head
        unitylist.push({
            ikname : iknames[IKBoneType.Head],
            position : new UnityVector3(
                poseland[0].x, pelvisY + Math.abs(poseland[0].y),
                ss.list[2].position.z
            ),
            rotation : new UnityVector3(180,0,180)
        });

        //---Nose 2 LookAt
        unitylist.push({
            ikname : iknames[IKBoneType.LookAt],
            position : new UnityVector3(
                poseland[0].x, pelvisY + Math.abs(poseland[0].y),
                ss.list[3].position.z
            ),
            rotation : new UnityVector3(180,180,180)
        });
        ikix++;

        //---Left Shoulder + Right Shoulder 2 Aim
        var newx = TwoPoint2CenterCalc(poseland[11].x, poseland[12].x);
        var newy = pelvisY + ((Math.abs(poseland[11].y) + Math.abs(poseland[12].y)) * 0.5);
        var newz = TwoPoint2CenterCalc(poseland[11].z, poseland[12].z);
        unitylist.push({
            ikname : iknames[IKBoneType.Aim],
            position : new UnityVector3(
                newz, ss.list[4].position.y,
                ss.list[4].position.z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---2 Chest
        unitylist.push({
            ikname : iknames[IKBoneType.Chest],
            position : new UnityVector3(newx,newy,newz),
            rotation : new UnityVector3(180,0,180)
        });

        //hip 2 Pelvis
        unitylist.push({
            ikname : iknames[IKBoneType.Pelvis],
            position : new UnityVector3(
                TwoPoint2CenterCalc(poseland[23].x, poseland[24].x),
                pelvisY + ((Math.abs(poseland[23].y) + Math.abs(poseland[24].y)) * 0.5) ,
                TwoPoint2CenterCalc(poseland[23].z, poseland[24].z)
            ),
            rotation : new UnityVector3(180,0,180)
        });

        //---Left shoulder
        unitylist.push({
            ikname : iknames[IKBoneType.LeftShoulder],
            position : new UnityVector3(
                poseland[11].x,
                Math.abs(poseland[11].y), //pelvisY + 
                poseland[11].z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Right shoulder
        unitylist.push({
            ikname : iknames[IKBoneType.RightShoulder],
            position : new UnityVector3(
                poseland[12].x,
                Math.abs(poseland[12].y), //pelvisY + 
                poseland[12].z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Left elbow 2 Left Lower Arm
        unitylist.push({
            ikname : iknames[IKBoneType.LeftLowerArm],
            position : new UnityVector3(
                poseland[13].x,
                pelvisY + Math.abs(poseland[13].y),
                poseland[13].z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Right elbow 2 Right Lower Arm
        unitylist.push({
            ikname : iknames[IKBoneType.RightLowerArm],
            position : new UnityVector3(
                poseland[14].x,
                pelvisY + Math.abs(poseland[14].y),
                poseland[14].z
            ),
            rotation : new UnityVector3(180,180,180)
        });
        //---Left wrist 2 left Hand
        unitylist.push({
            ikname : iknames[IKBoneType.LeftHand],
            position : new UnityVector3(
                poseland[15].x,
                pelvisY + Math.abs(poseland[15].y),
                poseland[15].z
            ),
            rotation : new UnityVector3(180,0,180)
        });
        //---Right wrist 2 right Hand
        unitylist.push({
            ikname : iknames[IKBoneType.RightHand],
            position : new UnityVector3(
                poseland[16].x,
                pelvisY + Math.abs(poseland[16].y),
                poseland[16].z
            ),
            rotation : new UnityVector3(180,0,180)
        });


        //---Pelvis ~ Foot
        //---Left knee 2 Left Lower leg
        unitylist.push({
            ikname : iknames[IKBoneType.LeftLowerLeg],
            position : new UnityVector3(
                poseland[25].x,
                pelvisY - Math.abs(poseland[25].y),
                poseland[25].z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Right knee 2 Right Lower leg
        unitylist.push({
            ikname : iknames[IKBoneType.RightLowerLeg],
            position : new UnityVector3(
                poseland[26].x,
                pelvisY - Math.abs(poseland[26].y),
                poseland[26].z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Left ankle 2 Left foot
        unitylist.push({
            ikname : iknames[IKBoneType.LeftLeg],
            position : new UnityVector3(
                poseland[27].x,
                pelvisY - Math.abs(poseland[27].y),
                poseland[27].z
            ),
            rotation : new UnityVector3(180,0,180)
        });

        //---Right ankle 2 Right foot
        unitylist.push({
            ikname : iknames[IKBoneType.RightLeg],
            position : new UnityVector3(
                poseland[28].x,
                pelvisY - Math.abs(poseland[28].y),
                poseland[28].z
            ),
            rotation : new UnityVector3(180,0,180)
        });
        */
        //---newcode---
        unitylist = [];
        poseland.forEach((item, index, arr) => {
            unitylist.push({
                ikname : index.toString(),
                position : new UnityVector3(item.x, item.y, item.z),
                rotation : new UnityVector3(0, 0, 0)
            });
        });
        //---end---
        var param = JSON.stringify({
            list : unitylist
        });
        console.log(param);
        
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:0},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:this.mainData.states.selectedAvatar.id,method:'SetIKTransformAll2',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:1},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //-------------------------------------------------
    // bonetransform window
    //-------------------------------------------------
    returnBoneTransformApply(data) {
        if (!this.mainData.states.selectedAvatar) {
            appAlert(this._t("msg_pose_noselectmodel"));
            return;
        }
        if (this.mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
            appAlert(this._t("msg_pose_noselectmodel"));
            return;
        }
        
        var param = JSON.stringify({
            list : data.list
        });
        if (this.mainData.states.selectedAvatar.type == AF_TARGETTYPE.VRM) {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:0},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.add(new queueData(
                {target:data.avatarId,method:'SetIKTransformAll',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:1},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }
    }
    /**
     * save IK transform data for Bonetran window
     * @param {Object} data 
     * @returns 
     */
    returnBoneTransformReloadBtn(data) {
        if (this.mainData.states.selectedAvatar.id != data.avatarId) return;
        if (this.mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) return;

        AppQueue.add(new queueData(
            {target:this.mainData.states.selectedAvatar.id,method:'GetIKTransformAll'},
            "alliktransform",QD_INOUT.returnJS,
            (val) => {
                val = val.replaceAll("NaN","0");
                var js = JSON.parse(val);

                var clsdata = {
                    //avatarId : this.mainData.states.selectedAvatar.id,
                    //avatarType: this.mainData.states.selectedAvatar.type,
                    data : js
                };
                AppDB.temp.setItem("btapp_call_getikvalue",clsdata);
                AppDB.temp.setItem("bonetran_avatar_id",this.mainData.states.selectedAvatar.id);
                AppDB.temp.setItem("bonetran_avatar_title",this.mainData.states.selectedAvatar.title);
                AppDB.temp.setItem("bonetran_avatar_type",this.mainData.states.selectedAvatar.type);
        
            }
        ));
        AppQueue.start();
    }

    analyzeBVH (text) {
        var filearr = text.split(/\r|\n|\r\n/);
        if (filearr[0] !== "HIERARCHY") {
            console.error("BVH file error.");
            return;
        }
        var nodeList = [];
        var motionList = [];
        var rootNode = new BvhNode();
        /**
         * @type {BvhNode}
         */
        var isCurrentJoint = null;
        var isMotionPhase = false;
        for (var ln of filearr) {
            var childNode = new BvhNode();
            var tokens = ln.trim().split(/[\s]+/);
            if (isMotionPhase) {
                //---analyze motion
                if (!isNaN(parseFloat(tokens[0]))) {
                    var flist = [];
                    for (var i = 0; i < tokens.length; i++) {
                        var fv = parseFloat(tokens[i]);
                        if (!isNaN(fv)) {
                            flist.push(fv);
                        }
                    }
                    motionList.push(flist);
                }
            }else{
                //---analyze bone
                if (tokens[0].toUpperCase() == "ROOT") {
                    rootNode.joint = tokens[1];
                    isCurrentJoint = rootNode;
                }
                if (tokens[0].toUpperCase() == "JOINT") {
                    //---finish previous node
                    nodeList.push(isCurrentJoint);
                    isCurrentJoint = null;
    
                    //---start node
                    childNode.joint = tokens[1];
                    isCurrentJoint = childNode;
                }
                if (tokens[0].toUpperCase() == "OFFSET") {
                    isCurrentJoint.offset = tokens.filter(item => {
                        if (!isNaN(parseFloat(item))) return true; 
                        return false;
                    });   
                }
                if (tokens[0].toUpperCase() == "CHANNELS") {
                    for (var cha = 2; cha < tokens.length; cha++) {
                        isCurrentJoint.channels.push(tokens[cha]);
                    }
                }
                if ((tokens[0].toUpperCase() == "END") && (tokens[0].toUpperCase() == "SITE")) {
                    childNode.endsite = true;
                }
            }
            if (tokens[0].toUpperCase() == "MOTION") isMotionPhase = true;
            
        }
        var rowIndex = 0;
        var motionTL = [];
        //---packing as vector
        for (var ml of motionList) {
            var mtline = {};
            for (var nd = 0; nd < nodeList.length; nd++) {
                rowIndex = (nd * nodeList[nd].channels.length);
                var vpos = new UnityVector3(0, 0, 0);
                var vrot = new UnityVector3(0, 0, 0);
                for (var cha = 0; cha < nodeList[nd].channels.length; cha++) {
                    var chastr = nodeList[nd].channels[cha];
                    if (chastr.toLowerCase() == "xposition") {
                        vpos.x = ml[rowIndex + cha];
                    }else if (chastr.toLowerCase() == "yposition") {
                        vpos.y = ml[rowIndex + cha];
                    }else if (chastr.toLowerCase() == "zposition") {
                        vpos.z = ml[rowIndex + cha];
                    }else if (chastr.toLowerCase() == "xrotation") {
                        vrot.x = ml[rowIndex + cha];
                    }else if (chastr.toLowerCase() == "yrotation") {
                        vrot.y = ml[rowIndex + cha];
                    }else if (chastr.toLowerCase() == "zrotation") {
                        vrot.z = ml[rowIndex + cha];
                    }
                }
                var mtdata = {
                    "bone" : nodeList[nd].joint,
                    "position" : vpos,
                    "rotation" : vrot
                };
                mtline[nodeList[nd].joint] = mtdata;
            }
            motionTL.push(mtline);
        }

        var bdata = new BvhData();
        bdata.bones = nodeList;
        bdata.motions = motionTL;
        return bdata;
    }
    //-------------------------------------------------
    // keyframe window
    //-------------------------------------------------
    returnKeyframeWindowChangeTimeline() {
        AppDB.temp.setItem("kfa_set_timeline",JSON.original({
            timeline : this.mainData.states.selectedTimeline,
            frameIndex : this.timelineData.states.currentcursor,
            maxframeNumber : this.mainData.data.project.timelineFrameLength,
        }));
    }
    returnKeyFrameWindowTemporaryCastArray() {
        AppDB.temp.setItem("kfa_set_vrms",JSON.original({
            vrms : this.mainData.data.project.casts
        }));
    }
}

/**
 * 
 */
export const defineModelOperator = (mainData, ribbonData, objlistData, objpropData, timelineData, UnityCallback, refs) => {
    const { t } = VueI18n.useI18n({ useScope: 'global' });

    const modelOperator = new appModelOperator(mainData, ribbonData, objlistData, objpropData, timelineData, UnityCallback, refs);

    //---watches--------------------------------------
    const wa_selectedAvatar = Vue.watch(() => mainData.states.selectedAvatar, (newval, oldval) => {
        //console.log(newval, oldval);
        if (
            (newval.type != AF_TARGETTYPE.Stage) &&
            (newval.type != AF_TARGETTYPE.Text) &&
            (newval.type != AF_TARGETTYPE.UImage) &&
            (newval.type != AF_TARGETTYPE.SystemEffect) 
        ) {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ChangeEnableAvatarFromOuter',param:newval.id},
                "",QD_INOUT.toUNITY,
                null
            ));
            if (mainData.appconf.confs.application.focus_camera_onselect) {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'CenteringCameraForAvatar',param:newval.id},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }
        }
        mainData.states.old_selectedAvatar = oldval;
        modelOperator.select_objectItem(newval.id);

        AppDB.temp.setItem("bonetran_avatar_id",newval.id);
        AppDB.temp.setItem("bonetran_avatar_title",newval.title);
        AppDB.temp.setItem("bonetran_avatar_type",newval.type);
        if (newval.type == AF_TARGETTYPE.VRM) {
            modelOperator.returnBoneTransformReloadBtn({avatarId:newval.id});
            //AppDB.temp.setItem("kfa_hoge",JSON.original(mainData.states.selectedTimeline));
        }
        modelOperator.returnKeyframeWindowChangeTimeline();
        modelOperator.returnKeyFrameWindowTemporaryCastArray();
    });
    const wa_percentCurrent = Vue.watch(() => mainData.elements.percentLoad.current,(newval)=>{
        if (mainData.elements.percentLoad.current >= 1.0) {
            mainData.elements.loadingTypePercent = false;
            mainData.elements.loading = false;
            Vue.nextTick(() => {
                mainData.elements.percentLoad.current = 0;
                //---load first frame
                modelOperator.common_loadFrame(1,{childkey:-1});
            });
            
        }
    });
    const cmp_percentLoad = Vue.computed(() => {
        return (mainData.elements.percentLoad.current * 100).toFixed(2) + "%";
    });
    
    //---finalize-------------------------------------
    return {
        modelOperator,
        /*modelOperator : ({
            addVRM, addObject, del_objectItem, del_roleAndTimelilne,
            getAvatar, getAvatarFromRole, getRole, getRoleFromAvatar, getSelected_objectItem,
            deselect_objectItem, select_objectItem,
            listupBlendShapes,listupEquipList
        })*/
        wa_selectedAvatar,wa_percentCurrent,
        cmp_percentLoad
    };
}