import { appModelOperator } from "./model/operator.js";
import { UnityCallbackFunctioner } from "./model/callback.js";
import { AnimationProjectPreloadFiles, VVTimelineTarget } from "./prop/cls_vvavatar.js";
import { AF_TARGETTYPE, FILEEXTENSION_DEFAULT, FILEEXTENSION_MOTION, FILEEXTENSION_MOTION_GENERAL, FILEOPTION, STORAGE_TYPE } from "../res/appconst.js";
import { VFileHelper, VFileOptions, VFileType, VOSFile } from "../../public/static/js/filehelper.js";
import { AnimationParsingOptions } from "./prop/cls_unityrel.js";
import { appDataTimeline } from "./prop/apptimelinedata.js";
import { appMainData } from "./prop/appmaindata.js";
/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {appMainData} mainData 
 * @param {appDataTimeline} timelineData
 * @param {appModelOperator} modelOperator 
 * @param {UnityCallbackFunctioner} callback 
 * @returns 
 */
export function defineProjectDialog (app, Quasar, mainData, timelineData, modelOperator, callback) {
    const { t  } = VueI18n.useI18n({ useScope: 'global' });

    //---computed------------------------------------------------------
    const checkSelectFixedObject = Vue.computed(() => {
        if (mainData.elements.projdlg.avatarselection) {
            if (
                (mainData.elements.projdlg.avatarselection.typeId == AF_TARGETTYPE.Stage) ||
                (mainData.elements.projdlg.avatarselection.typeId == AF_TARGETTYPE.SystemEffect) ||
                (mainData.elements.projdlg.avatarselection.typeId == AF_TARGETTYPE.Audio) ||
                (mainData.elements.projdlg.avatarselection.typeId == AF_TARGETTYPE.Unknown)
            ) {
                return true;
            }
        }
        /*
        if (mainData.elements.projdlg.roleselection.toLowerCase() == "stage") {
            return true;
        }
        if (mainData.elements.projdlg.avatarselection.toLowerCase() == "stage") {
            return true;
        }
        */
        return false;
    });
    const checkAvatarSelectable = Vue.computed( () => {
        if ((mainData.elements.projdlg.tab == 'role')
            ||
            (mainData.elements.projdlg.tab == 'avatar')
        ) {
            return true;
        }else{
            return false;
        }
    });
    const checkSelectVRMObject = Vue.computed(() => {
        if (mainData.elements.projdlg.avatarselection) {
            if (
                (mainData.elements.projdlg.avatarselection.typeId == AF_TARGETTYPE.VRM)
            ) {
                return false;
            }
        }
        return true;
    });
    const checkVRMASelected = Vue.computed( () => {
        if ((mainData.elements.projdlg.tab == 'vrmas')
        ) {
            return true;
        }else{
            return false;
        }
    });
    const rowIsFixedObject = (row) => {
        if (
            (row.name == "Stage") ||
            (row.name == "SystemEffect") ||
            (row.name == "BGM") ||
            (row.name == "SE")
        ) {
            return true;
        }else{
            return false;
        }
    }
    //---watch------------------------------------------------


    //---event--------------------------------------------------------------
    //  [toolbar] --------------------------------------------
    const btn_refresh_onclick = () => {
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetAllActorsFromOuter'},
            "enumactorsroles",QD_INOUT.returnJS,
            callback.enumactorsroles,
            {callback}
        ));
        AppQueue.start();
    }
    const btn_delRole_onclick = () => {
        if (mainData.elements.projdlg.tab == "role") {

        }else if (mainData.elements.projdlg.tab == "avatar") {

        }else{
            appAlert(t('msg_role_delete2'));
            return;
        }
        appConfirm(t('msg_role_delete'), () => {
            const projdlg = mainData.elements.projdlg;
            var tmpcast = null;
            if (projdlg.tab == "role") {
                var hitIndex = projdlg.editroles.findIndex(item => {
                    if (item.name == projdlg.roleselection) return true;
                    return false;
                });
                if (hitIndex > -1) {
                    var editroles = projdlg.editroles.splice(hitIndex,1);
                    var editrole = null;
                    if (editroles.length > 0) {
                        editrole = editroles[0];
                    }
                    if (editrole) {
                        tmpcast = modelOperator.getRole(editrole.roleName,"role");

                        //---remove from selavatars list
                        var hitSelavatar = projdlg.selavatars.findIndex(item => {
                            if (item.roleName == editrole.roleName) return true;
                            return false;
                        });
                        if (hitSelavatar > -1) {
                            projdlg.selavatars.splice(hitSelavatar,1);
                        }
    
                        //---finally project and Unity
                        modelOperator.del_roleAndTimelilne(tmpcast,editrole.typeId);
    
                    }
                    
                }
            }else if (mainData.elements.projdlg.tab == "avatar") {
                var hitSelavatar = projdlg.selavatars.findIndex(item => {
                    if (!projdlg.avatarselection) return false;
                    if (item.roleName == projdlg.avatarselection.roleName) return true;
                    return false;
                });
                if (hitSelavatar > -1) {
                    //---1st: remove talbe[selavatar]
                    var selavatars = projdlg.selavatars.splice(hitSelavatar,1);
                    var selavatar = null;
                    if (selavatars.length > 0) {
                        selavatar = selavatars[0];
                    }
                    if (selavatar) {
                        tmpcast = modelOperator.getRole(selavatar.roleName,"role");

                        //---remove from editroles list
                        //var hitIndex = projdlg.editroles.findIndex(item => {
                        //    if (item.roleName == selavatar.roleName) return true;
                        //    return false;
                        //});
                        //if (hitIndex > -1) {
                        //    projdlg.editroles.splice(hitIndex,1);
                        //}
    
                        //---finally project and Unity
                        modelOperator.del_roleAndTimelilne(tmpcast,selavatar.typeId);
                    }
                    
                }
            }
            if (tmpcast && tmpcast.avatar) {
                modelOperator.removeBodyObject(tmpcast.avatar);
            }
            AppQueue.start();
        });
    }
    const btn_delAllRole_onclick = () => {
        var msg = t('msg_role_delete3');
        appConfirm(msg,() => {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'DeleteAllEmptyTimeline'},
                "deleteallempty",QD_INOUT.returnJS,
                callback.clearemptytimeline,
                {callback}
            ));
            AppQueue.start();
        });
    }
    const btn_delVRMA_onclick = () => {
        var msg = t('msg_motion_delconfirm');
        var filepath = mainData.elements.projdlg.vrmaselection;
        if (filepath != "") {
            appConfirm(msg,() => {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'CloseVRMA',param:filepath},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
                var ishit = mainData.elements.projdlg.vrmaList.findIndex(v => {
                    if (v.filepath == filepath) return true;
                    return false;
                });
                if (ishit > -1) {
                    var beforeData = mainData.elements.projdlg.vrmaList[ishit];
                    var ishit_objprop = callback.objpropData.elements.vrmui.vrmanim.list.options.findIndex(v => {
                        if (v == beforeData.filename) return true;
                        return false;
                    });
                    if (ishit_objprop > -1) {
                        callback.objpropData.elements.vrmui.vrmanim.list.options.splice(ishit_objprop, 1);
                    }
                    mainData.elements.projdlg.vrmaList.splice(ishit, 1);
                    
                }
            });
        }
        
    }
    const vrmarow_save_onchecked = (flag, row) => {
        console.log(flag, row);
        /*if ((row.storageTypeId == STORAGE_TYPE.LOCAL) && (!VFileHelper.checkNativeAPI)) {
            appAlert(t("msg_saveproj_vrma"));
            return;
        }*/
        const project = mainData.data.project;
        var ishit = project.preloadFiles.findIndex(v => {
            if ((v.fileuri == row.filepath) && (v.filetype == "vrma")) return true;
            return false;
        });
        var data = new AnimationProjectPreloadFiles();
        data.filetype = "vrma";
        data.fileuri = row.filepath;
        data.filename = row.filename;
        data.options = "";
        data.uritype = row.storageTypeId;
        //---if app is webapp and to open from local
        if (!VFileHelper.checkNativeAPI) {
            if (row.storageTypeId == STORAGE_TYPE.LOCAL) {
                data.uritype = STORAGE_TYPE.INTERNAL;
            }
        }
        
        if (flag === true) {
            //---create
            if (ishit == -1) {
                project.preloadFiles.push(data);
            }else{
                project.preloadFiles[ishit] = data;
            }
        }else{
            //---delete
            project.preloadFiles.splice(ishit, 1);
        }
        
    }
    const btn_loadsinglemotion_onclick = async (fromscreen) => {
        //fil_animmotion.value = null;
        //fil_animmotion.click();

        var fopt = new VFileOptions();
        fopt.types = FILEOPTION.MOTION.types;
        VFileHelper.openFromDialog(FILEOPTION.MOTION, 0,
            /**
             * 
             * @param {VOSFile[]} files 
             * @param {Number} cd 
             * @param {*} err 
             */
        async (files,cd,err)=>{
            if (cd == 0) {
                await fil_animmotion_onchange({
                    screen : fromscreen,
                    target : {
                        files : files
                    }
                });
            }
        });
    }
    const fil_animmotion_onchange = async (evt) => {
        if (evt.target.files.length == 0) return;

        /**
         * @type {VOSFile}
         */
        var onefile = evt.target.files[0];
        /**
         * @type {File}
         */
        var file = null;
        if (VFileHelper.flags.isHistoryFSAA && VFileHelper.flags.isEnableFSAA) {
            file = await onefile.getFile();
        }else{
            file = onefile.data;
        }

        const projdlg = mainData.elements.projdlg;
        var tmpcast = null;
        /*if (mainData.elements.projdlg.tab == "role") {
            //---mode for editing role title
            var hitIndex = projdlg.editroles.findIndex(item => {
                if (item.name == projdlg.roleselection) return true;
                return false;
            });
            if (hitIndex > -1) {
                var editrole = projdlg.editroles[hitIndex];
                tmpcast = modelOperator.getRole(editrole.roleName,"role");
                
                
            }
        }else 
        */
        if (evt.screen == "projdlg") {
            if (mainData.elements.projdlg.tab == "avatar") {
                //---mode for selecting avatar
                var hitSelavatar = projdlg.selavatars.findIndex(item => {
                    if (!projdlg.avatarselection) return false;
                    if (item.roleName == projdlg.avatarselection.roleName) return true;
                    return false;
                });
                if (hitSelavatar > -1) {
                    var selavatar = projdlg.selavatars[hitSelavatar];
                    tmpcast = modelOperator.getRole(selavatar.roleName,"role");
                }
            }
        }else if (evt.screen == "objlist"){
            tmpcast = mainData.states.selectedCast;
        }
        
        if (!tmpcast) return;

        const CHECK_GENERALMOTION = (filename) => {
            var ret = false;
            for (var i = 0; i < FILEEXTENSION_MOTION_GENERAL.length; i++) {
                if (filename.indexOf(FILEEXTENSION_MOTION_GENERAL[i]) > -1) {
                    ret = true;
                    break;
                }
            }
            return ret;
        }


        const callbody = (motiondata) => {
            //---Firstly, set target.
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetLoadTargetSingleMotion',param:tmpcast.roleName},
                "",QD_INOUT.toUNITY,
                null
            ));
            //---Second load a motion data.
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'LoadSingleMotionDirect',param:motiondata},
                "openmotionresult",QD_INOUT.returnJS,
                callback.openmotionresult,
                {callback}
            ));
            {
                var param = new AnimationParsingOptions();
                param.index = 1;
                param.isCameraPreviewing = 0;
                
                param.isExecuteForDOTween = 1;
                param.targetRole = tmpcast.roleName;
                param.targetType = tmpcast.type.toString();

                var js = JSON.stringify(param);

                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'PreviewSingleFrame',param:js},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }
            AppQueue.start();
        }
        if (typeof file == "string") {
            //---already loaded text (Electron etc...)
            var jsdata = JSON.parse(file);
            var msgadd = `${jsdata.frames[jsdata.frames.length-1].index}`;
            if (mainData.data.project.timelineFrameLength < jsdata.frames[jsdata.frames.length-1].index) {
                appConfirm(t("msg_openmotion_error3")+msgadd,() => {
                    callbody(file);
                });
            }else{
                callbody(file);
            }
        }else{
            var fdata = URL.createObjectURL(file);
            if ((file.name.indexOf(FILEEXTENSION_MOTION) > -1) ||
                (file.name.indexOf(FILEEXTENSION_DEFAULT) > -1) ||
                (CHECK_GENERALMOTION(file.name))
            ) {
                if (file.name.indexOf(FILEEXTENSION_MOTION_GENERAL[0]) > -1) {
                    //---if Bvh, analyze this data
                    var text = await file.text();
                    var data = modelOperator.analyzeBVH(text);
                    //console.log(data);
                }else{
                    
                    var text = await file.text();
                    var jsdata = JSON.parse(text);
                    var msgadd = `${jsdata.frames[jsdata.frames.length-1].index}`;
                    if (mainData.data.project.timelineFrameLength < jsdata.frames[jsdata.frames.length-1].index) {
                        appConfirm(t("msg_openmotion_error3")+msgadd,() => {
                            callbody(text);
                        });
                    }else{
                        callbody(text);
                    }
                }
                
            }else{
                appAlert(t("msg_error_allfile"));
            }
        }
        
    }
    const btn_savesinglemotion_onclick = () => {
        const projdlg = mainData.elements.projdlg;
        var tmpcast = null;
        if (mainData.elements.projdlg.tab == "role") {
            //---mode for editing role title
            var hitIndex = projdlg.editroles.findIndex(item => {
                if (item.name == projdlg.roleselection) return true;
                return false;
            });
            if (hitIndex > -1) {
                var editrole = projdlg.editroles[hitIndex]; //.splice(hitIndex,1);
                tmpcast = modelOperator.getRole(editrole.roleName,"role");
            }
        }else if (mainData.elements.projdlg.tab == "avatar") {
            //---mode for selecting avatar
            var hitSelavatar = projdlg.selavatars.findIndex(item => {
                if (!projdlg.avatarselection) return false;
                if (item.roleName == projdlg.avatarselection.roleName) return true;
                return false;
            });
            if (hitSelavatar > -1) {
                var selavatar = projdlg.selavatars[hitSelavatar]; //.splice(hitSelavatar,1);
                tmpcast = modelOperator.getRole(selavatar.roleName,"role");

            }
        }else{
            return;
        }
        if (!tmpcast) return;

        var param = tmpcast.roleName + "," + tmpcast.type;
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SaveSingleMotion', param:param},
            "savemotion",QD_INOUT.returnJS,
            callback.savemotion,
            {callback}
        ));
        AppQueue.start();
    }

    const btn_saveanimmotion_onclick = () => {
        const projdlg = mainData.elements.projdlg;
        var tmpcast = null;
        if (mainData.elements.projdlg.tab == "avatar") {
            //---mode for selecting avatar
            var hitSelavatar = projdlg.selavatars.findIndex(item => {
                if (!projdlg.avatarselection) return false;
                if (item.roleName == projdlg.avatarselection.roleName) return true;
                return false;
            });
            if (hitSelavatar > -1) {
                var selavatar = projdlg.selavatars[hitSelavatar]; //.splice(hitSelavatar,1);
                tmpcast = modelOperator.getRole(selavatar.roleName,"role");

            }
        }else{
            return;
        }
        if (!tmpcast) return;

        var param = tmpcast.roleName + "," + tmpcast.type + ",m";
        //AppQueue.unity.ManageAnimation
        AppQueue.add(new queueData(
            {target:tmpcast.avatar.id,method:'GenerateAnimationCurve'},
            "savebvhmotion",QD_INOUT.returnJS,
            callback.saveanimmotion,
            {callback, selRoleTitle: tmpcast.roleTitle}
        ));
        AppQueue.start();
    }
    const btn_savebvhmotion_onclick = () => {
        const projdlg = mainData.elements.projdlg;
        var tmpcast = null;
        if (mainData.elements.projdlg.tab == "avatar") {
            //---mode for selecting avatar
            var hitSelavatar = projdlg.selavatars.findIndex(item => {
                if (!projdlg.avatarselection) return false;
                if (item.roleName == projdlg.avatarselection.roleName) return true;
                return false;
            });
            if (hitSelavatar > -1) {
                var selavatar = projdlg.selavatars[hitSelavatar]; //.splice(hitSelavatar,1);
                tmpcast = modelOperator.getRole(selavatar.roleName,"role");

            }
        }else{
            return;
        }
        if (!tmpcast) return;

        var param = tmpcast.roleName + "," + tmpcast.type + ",m";
        //AppQueue.unity.ManageAnimation
        AppQueue.add(new queueData(
            {target:tmpcast.avatar.id,method:'ExportRecordedBVH'},
            "savebvhmotion",QD_INOUT.returnJS,
            callback.savebvhmotion,
            {callback, selRoleTitle: tmpcast.roleTitle}
        ));
        AppQueue.start();
    }

    //=========================================================================
    //  Project info tab
    //=========================================================================
    const fps_onchange = (val) => {
        //---FPS--------------------------------------===== setfps
        appConfirmWithCancel(t("msg_fps_warning"),()=> {
            var param = parseInt(mainData.elements.projdlg.pinfo.fps);
            if (isNaN(param)) {
                mainData.elements.projdlg.pinfo.fps = mainData.elements.projdlg.pinfo.oldfps;
                return;
            }
    
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetFps',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            mainData.elements.projdlg.pinfo.oldfps = mainData.elements.projdlg.pinfo.fps;
        },() => {
            mainData.elements.projdlg.pinfo.fps = mainData.elements.projdlg.pinfo.oldfps;     
        });

        
    }
    const baseDuration_onchange = () => {
        //---FPS--------------------------------------===== setfps
        appConfirmWithCancel(t("msg_baseduration_warning"),()=> {
            var param = parseInt(mainData.elements.projdlg.pinfo.baseDuration);
            if (isNaN(param)) {
                mainData.elements.projdlg.pinfo.baseDuration = mainData.elements.projdlg.pinfo.oldbaseDuration;
                return;
            }

            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'ApplyBaseDuration',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            mainData.elements.projdlg.pinfo.oldbaseDuration = mainData.elements.projdlg.pinfo.baseDuration;
            mainData.states.currentEditOperationCount++;
        },() => {
            mainData.elements.projdlg.pinfo.baseDuration = mainData.elements.projdlg.pinfo.oldbaseDuration;     
        });
    }
    //=========================================================================
    //  role tab
    //=========================================================================

    /**
     * Apply changing row.roleTitle by Edit Popup
     * @param {String} val 
     * @param {*} row line data of mainData.elements.projdlg.selavatars
     */
    const oneditok_roleTitle = (val, row) => {

        //---update cast in project on html side.
        var role = modelOperator.getRole(row.roleName,"role");
        if (role) {
            //---change roleTitle of table row
            role.roleTitle = row.roleTitle;
            var finx = timelineData.data.timelines.findIndex(item => {
                if (item.target.roleName  == row.rowName) return true;
                return false;
            });
            /**
             * @type {VVTimelineTarget}
             */
            var tl = timelineData.data.timelines[finx];

            //---change roleTitle of timeline.target (VVCast)
            if (tl) {
                tl.target.roleTitle = row.roleTitle;
            }

            //---update Unity also
            var param = row.id + "," + row.roleTitle;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'EditActorsRole',param: param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }
    }

    /**
     * Apply changing row.roleName and VVCast by Edit Popup
     * @param {*} val 
     * @param {*} row line data of mainData.elements.projdlg.selavatars
     */
    const onselectok_avatar = (val, row) => {
        //--old value
        var oldID = row.id;
        var oldName = row.oldname;

        //---new saving value {label:String, value:String}
        var avatarName = row.name.label || row.name;
        var avatarID = row.name.value;

        var newrole = modelOperator.getRoleFromAvatar(avatarID);
        var newpath = (newrole) ? newrole.path : "";
        var newext = (newrole) ? newrole.ext : "";

        var projdlg = mainData.elements.projdlg;

        //console.log("old=",oldID, oldName);
        //console.log("new=",avatarID, avatarName);
        //--------------------------------------------------
        //---apply detaching old reference
        //--------------------------------------------------
        var currow = null;
        if (avatarID == "null") {
            //---detach only role and avatar
            //var param = `${row.roleName},role`;
            //AppQueue.add(new queueData(
            //    {target:AppQueue.unity.ManageAnimation,method:'DetachAvatarFromRole',param:param},
            //    "",QD_INOUT.toUNITY,
            //    null
            //));
            currow = row;
        }else{
            //---table [selavatar]---------------
            //---detach old reference avatar (previous avatar)
            currow = projdlg.selavatars.find(item => {
                if ((item.id == avatarID)) return true;
                return false;
            });
            
            //---table [editrole]-----------------
            //---apply changing to editrole table
            //var editcurrow = projdlg.editroles.find(item => {
            //    if (item.id == avatarID) return true;
            //    return false;
            //});
            //if (editcurrow) {
            //    //projdlg.editroles[editcurrow]
            //    editcurrow.name = "";
            //    editcurrow.id = "";
            //}
        }
        if (currow) {
            //projdlg.selavatars[currow]
            currow.id = "";
            currow.name = "";

            //---detach at Unity
            var param = `${currow.roleName},role`;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'DetachAvatarFromRole',param: param},
                "",QD_INOUT.toUNITY,
                null
            ));
            /**
             * @type {VVTimelineTarget}
             */
            var tl = timelineData.data.timelines.find(item => {
                if (!item.target) return false;
                if (item.target.roleName  == currow.roleName) return true;
                return false;
            });
            //---detach at HTML
            if (tl) {
                //---unlink cast and avatar
                tl.target.avatar = null;
                tl.target.avatarId = "";
                tl.target.path = "";
                tl.detachTarget();

            }
            
        }


        //-----------------------------------------------------
        //---apply new attach reference
        //< Already updated for reactive >
        //-----------------------------------------------------

        //---exchange old and new.
        row.id = avatarID;
        row.name = avatarName;
        
        if (avatarID != "null") {
            //---get new avatar and current role
            var newavatar = modelOperator.getAvatar(avatarID);
            var cast = modelOperator.getAvatarFromRole(row.roleName);
            if (cast) {
                cast.avatar = newavatar;
                cast.avatarId = newavatar.id;
                cast.path = newpath;
                cast.ext = newext;

                //---apply to Unity
                var param = row.roleName + "," + avatarID;
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'AttachAvatarToRole',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                //---apply connection with current role(timeline) and avatar 
                /**
                 * @type {VVTimelineTarget}
                 */
                var tl = timelineData.data.timelines.find(item => {
                    if (item.target.roleName == row.roleName) return true;
                    return false;
                });
                if (tl) {
                    tl.setTarget(cast);
                }else{
                    timelineData.data.timelines.push(new VVTimelineTarget(cast));
                }
            }
        }
        AppQueue.start();
    }

    //=========================================================================
    //  Material tab
    //=========================================================================
    const wa_mat_tabradio = Vue.watch(() => mainData.elements.projdlg.mat_tabradio, (newval, oldval) => {
        mainData.elements.projdlg.materialrows = 
            mainData.elements.projdlg.materialLoadedRows[newval];
    });
    const wa_mat_selection = Vue.watch(() => mainData.elements.projdlg.materialselection, (newval, oldval) => {
        mainData.elements.projdlg.mat_textureFileActionFrom = "u";
    });
    const fil_proj_material_onChange = (evt) => {
        if (evt.target.files.length > 0) {
            if (mainData.elements.projdlg.mat_textureFileActionFrom == "n") {
                //---apply viewing to input UI
                mainData.elements.materialadddlg.textureFile = evt.target.files[0];
                mainData.elements.materialadddlg.textureFileShow = evt.target.files[0].name;
            }else if (mainData.elements.projdlg.mat_textureFileActionFrom == "u") {
                //---save as internal data
                var row = mainData.elements.projdlg.mat_ActionFromPreviewRow;
                var fl = URL.createObjectURL(evt.target.files[0]);
                var param = [
                    row.name,
                    "",
                    fl,
                    mainData.elements.projdlg.mat_tabradio,
                ].join("\t");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'LoadOneMaterialTexture', param:param},
                    "loadmaterialtexture",QD_INOUT.returnJS,
                    (val,options) => {
                        if (val == "") {
                            appAlert(t("msg_material_notfound"));
                        }else{
                            //---overwrite html-row
                            row.preview = options.preview;
                            row.path = options.filepath;
                        }
                
                    },{row:row, preview : fl, filepath:evt.target.files[0].name }
                ));
                AppQueue.start();
            }
            
        }
    }
    const fil_proj_material_btn_clicked = () => {
        mainData.elements.materialadddlg.textureFile = null;
        mainData.elements.materialadddlg.mat_textureFileActionFrom = "n";
        document.getElementById("fil_proj_material").click();
    }
    const materialNoPreview_onclick = (row) => {
        mainData.elements.projdlg.mat_textureFile = null;
        mainData.elements.projdlg.mat_textureFileActionFrom = "u";
        mainData.elements.projdlg.mat_ActionFromPreviewRow = row;
        document.getElementById("fil_proj_material").click();
    }
    const materialAddDialog_Show_onclick = () => {
        mainData.elements.materialadddlg.show = true;
        mainData.elements.projdlg.mat_textureFileActionFrom = "n";

        mainData.elements.materialadddlg.textureFileShow = "";

    }
    const chk_addmat_rad_file = Vue.computed( () => {
        return mainData.elements.materialadddlg.addtype == "f";
    });
    const chk_addmat_rad_sd = Vue.computed( () => {
        return mainData.elements.materialadddlg.addtype == "sd";
    });
    /**
     * To push Add button for material
     */
    const materialFileLoad_onclick = () => {
        var fl = null;
        var floriginal = null;
        var flname = "";
        if (mainData.elements.materialadddlg.addtype == "f") {
            floriginal = mainData.elements.materialadddlg.textureFile;
            fl = URL.createObjectURL(mainData.elements.materialadddlg.textureFile);
            flname = mainData.elements.materialadddlg.textureFile.name;
        }else{
            floriginal = mainData.elements.materialadddlg.ai.resultBlob;
            fl = URL.createObjectURL(floriginal);
            flname = mainData.elements.materialadddlg.ai.prompt;
        }
        var row = {
            preview : fl,
            name : mainData.elements.materialadddlg.textureLabel,
            oldname : mainData.elements.materialadddlg.textureLabel,
            type : mainData.elements.projdlg.sel_mat_materialType,  //from parent dialog
            typeId : mainData.elements.projdlg.sel_mat_materialType,  //from parent dialog
            path : flname,
        }
        var param = [
            row.name,
            "",
            row.preview,
            "1",
            mainData.elements.projdlg.mat_tabradio,
        ].join("\t");
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'LoadMaterialTexture', param:param},
            "loadmaterialtexture",QD_INOUT.returnJS,
            (val) => {
                if (val == "") {
                    appAlert(t("msg_material_found"));
                }else{
                    mainData.elements.projdlg.materialrows.push(row);
                    //---When my app & project file, save to IndexedDB.
                    //   Exclude an imported project
                    var projectName = "";
                    if (mainData.elements.projdlg.mat_tabradio == "p") {
                        projectName = mainData.states.currentProjectFilename;
                    }
                    AppDB.materials.setItem(row.name,{
                        name : row.name,
                        type : row.type,
                        file : floriginal,
                        location : mainData.elements.projdlg.mat_tabradio,
                        projectName : projectName
                    });
                }
        
            }
        ));
        AppQueue.start();

        mainData.elements.materialadddlg.show = false;
    }
    const materialFileRemove_onclick = () => {
        appConfirm(t('msg_material_delete'),() => {
            var ishit = mainData.elements.projdlg.materialrows.findIndex(item => {
                if (mainData.elements.projdlg.materialselection == null) return false;
                if (item.name == mainData.elements.projdlg.materialselection.name) return true;
                return false;
            });
            if (ishit > -1) {
                var param = mainData.elements.projdlg.materialrows[ishit].name;
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'RemoveMaterialFromOuter', param:param},
                    "removematerial",QD_INOUT.returnJS,
                    (val, options) => {
                        //console.log("refCount=",val);
                        if (val == -1) {
                            appAlert(t('msg_material_untilRefer'));
                        }else{
                            URL.revokeObjectURL(mainData.elements.projdlg.materialrows[ishit].preview);
                            AppDB.materials.removeItem(param);
                            mainData.elements.projdlg.materialrows.splice(options.hitNo,1);
                        }
                    },{
                        hitNo : ishit
                    }
                ));
                AppQueue.start();

                

            }
        });
    }
    const materialAIGenerate_onclick = async () => {
        if (mainData.elements.materialadddlg.ai.preview != null) {
            URL.revokeObjectURL(mainData.elements.materialadddlg.ai.preview);
        }
        try {
            var param = {
                prompt : mainData.elements.materialadddlg.ai.prompt,
                orig_width : mainData.elements.materialadddlg.ai.size.x,
                orig_height : mainData.elements.materialadddlg.ai.size.x
            };
            mainData.elements.materialadddlg.ai.loading = true;
            var ret = await AIManager.sdcall("txt2img","post",param);
            console.log(ret);
            if (ret != null) {
                mainData.elements.materialadddlg.ai.resultBlob = new Blob([ret], {type: "image/png"});
                var ourl = URL.createObjectURL(mainData.elements.materialadddlg.ai.resultBlob);
                mainData.elements.materialadddlg.ai.preview = ourl;
            }
            
         
        }catch (e) {
            appAlert(t("msg_material_errorAI"));
        }finally {
            //URL.revokeObjectURL(ourl);
            mainData.elements.materialadddlg.ai.loading = false;
        }
           
        
    }
    /**
     * finish to input on popup-edit for Material
     * @param {*} val 
     * @param {*} row 
     */
    const onselectok_material = (val, row) => {

        var param = [
            row.oldname,
            val
        ].join("\t");
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'RenameMaterialName', param:param},
            "renamematerialtexture",QD_INOUT.returnJS,
            (val) => {
                if (val == "") {
                    console.log("texture is not found.");
                    appAlert(t("msg_material_found"));
                }else{
                    console.log("successfully renaming.");

                }
        
            }
        ));
        AppQueue.start();
    }
    /**
     * To return avatars of type to equal to selected row avatar.
     */
    const filteredlist_selavatar_popup = Vue.computed(() => {
        return (row) => {
            var arr = mainData.data.vrms.filter(item => {
                if (item.type == row.typeId) return true;
                return false;
            });
            var ret = [{
                label : 'None',
                value : "null",
            }];
            for (var i = 0; i < arr.length; i++) {
                ret.push({
                    label : arr[i].title,
                    value : arr[i].id
                });
            }
            return ret;
        }
    });

    //---add material dialog---------------------===================
    

    const fil_animmotion = Vue.ref(null);
    const lnk_savemotion = Vue.ref(null);

    return {
        projectdlgEvent : Vue.reactive({
            //---computed------------------
            checkSelectFixedObject,checkAvatarSelectable,checkVRMASelected,
            chk_addmat_rad_file,chk_addmat_rad_sd,
            checkSelectVRMObject,rowIsFixedObject,
            //---event----------------------
            btn_refresh_onclick,btn_delRole_onclick,btn_loadsinglemotion_onclick,fil_animmotion_onchange,
            btn_savesinglemotion_onclick,btn_delAllRole_onclick,btn_delVRMA_onclick,
            vrmarow_save_onchecked,
            oneditok_roleTitle,onselectok_avatar,filteredlist_selavatar_popup,
            btn_saveanimmotion_onclick,btn_savebvhmotion_onclick,

            wa_mat_tabradio,

            fps_onchange,baseDuration_onchange,

            fil_proj_material_onChange,fil_proj_material_btn_clicked,materialNoPreview_onclick,
            materialFileLoad_onclick,materialFileRemove_onclick,
            onselectok_material,
            materialAddDialog_Show_onclick,materialAIGenerate_onclick
        }),
        fil_animmotion, lnk_savemotion
    }
}