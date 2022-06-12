import { appModelOperator } from "./model/operator.js";
import { VVPoseConfig, VVTimelineFrameData, VVTimelineTarget } from "./prop/cls_vvavatar.js";
import { AnimationParsingOptions,AnimationRegisterOptions,AnimationTargetAudio } from "./prop/cls_unityrel.js";
import { FILEEXTENSION_AUDIO,AF_TARGETTYPE, FILEEXTENSION_VRM, FILEEXTENSION_OTHEROBJECT,FILEEXTENSION_IMAGE,
    FILEEXTENSION_ANIMATION, 
    INTERNAL_FILE,
    FILEOPTION
} from "../res/appconst.js";
import { VFileHelper,VFileOptions } from "../../public/static/js/filehelper.js" 

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {*} mainData 
 * @param {*} ribbonData 
 * @param {*} modelLoader
 * @param {appModelOperator} modelOperator 
 * @param {*} callback 
 * @param {*} refs 
 * @returns 
 */
export function defineRibbonTab(app,Quasar,mainData,ribbonData,timelineData,modelLoader,modelOperator,callback,refs) {
    const { t, locale  } = VueI18n.useI18n({ useScope: 'global' });

    /**
     * 
     * @param {String} filetype 
     * @param {String} accepts 
     */
    const Sub_openfile = async (filetype,accepts) => {
        mainData.states.fileloadtype = filetype;

        VFileHelper.openFromDialog(FILEOPTION[accepts],(files,cd,err)=>{
            if (cd == 0) {
                mainData.elements.loading = true;
                mainData.elements.loadingTypePercent = false;
                modelLoader.OnChange_Common_AppFile(files[0],FILEOPTION[accepts]);
            }
        });
        /*
        if ("showOpenFilePicker" in window) {
            modelLoader.OnChange_AppFilePicker(accepts);
        }else{
            const fopt = FILEOPTION[accepts];
            var arr = [];
            for (var obj in fopt.types[0].accept) {
                arr = fopt.types[0].accept[obj];
                break;
            }
            refs.hid_file.value.value = "";
            refs.hid_file.value.accept = arr.join(",");
            refs.hid_file.value.click();

        }
        */
        
    }
    /**
     * 
     * @param {Boolean} isTransparent 
     */
    const Sub_getcapture = (isTransparent) => {
        refs.aud01_capture.value.play();

        var param = ribbonData.elements.capture.isTransparent ? 1 : 0;

        if (mainData.appconf.confs.application.UseHTMLCanvasForScreenShot) {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'EnableHandleShowCamera',param:0},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'GetEnableHandleShowCamera',param:0},
                "tmp",QD_INOUT.returnJS,
                callback.takescreenshot,  //---Here is somebody OK 
                {callback}
            ));
        }else{
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'CaptureScreen',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        AppQueue.start();
    }
    const Sub_vrminfo = () => {
        modelOperator.getVRMInfo(mainData.states.selectedAvatar,true);
        /*if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
            appAlert(t("msg_modelinfo_check1"));
            return;
        }
        
        mainData.elements.vrminfodlg.selectedAvatar = mainData.states.selectedAvatar;
        mainData.elements.vrminfodlg.showmode = true;
        mainData.elements.vrminfodlg.show = true;
        */
    }
    const Sub_beginrecord = () => {
        ribbonData.elements.lnk_download.state = true;
        
    }
    const Sub_playframecommon = () => {
        var param = new AnimationParsingOptions();
        param.isExecuteForDOTween = 1;
        param.index = 1;
        param.isCameraPreviewing = 1;
        param.isBuildDoTween = 1;
        param.isLoop = ribbonData.elements.frame.isloop ? 1 : 0;
        param.isCompileAnimation = mainData.appconf.confs.animation.with_compling ? 1 : 0;

        var offmarkerparam = -1;
        
        if (ribbonData.elements.frame.play_normal.icon == "play_arrow") {
            ribbonData.elements.frame.play_normal.icon = "pause";
            offmarkerparam = 0;
        }else{
            ribbonData.elements.frame.play_normal.icon = "play_arrow";
            offmarkerparam = 1;
        }

        var js = JSON.stringify(param);
        if (mainData.appconf.confs.animation.off_ikmarker_during_play_animation === true) {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'EnableHandleShowCamera',param:offmarkerparam},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        return js;
    }
    //===============================================================
    //  Computed events
    //===============================================================
    const chk_enableClipboardButton = Vue.computed(() => {
        var ret = true;
        //---if current frame of timeline is empty, disable
        var hitFrame = mainData.states.selectedTimeline.frames.find(item => {
            if (item.key == ribbonData.elements.frame.current) return true;
            return false;
        });
        if (!hitFrame) ret = false;

        //---if avatar of role of timeline is empty, disable
        if (mainData.states.selectedTimeline.target) {
            if (!mainData.states.selectedTimeline.target.avatar) ret = false;
        }else{
            ret = false;
        }

        //---Because to use is disabled, return !Boolean
        return !ret;
    });
    const chk_enableKeyframeButton = Vue.computed(() => {
        var ret = true;
        
        //---if avatar of role of timeline is empty, disable
        if (mainData.states.selectedTimeline.target) {
            if (!mainData.states.selectedTimeline.target.avatar) ret = false;
        }else{
            ret = false;
        }

        //---mainData.states.animationPlaying is true, disable
        if (mainData.states.animationPlaying === true) ret = false;


        //---Because to use is disabled, return !Boolean
        return !ret;
    });

    const chkbgmenable = Vue.computed(() => {
        var flag = false;
        if (ribbonData.elements.audio.bgm.selection != null) {
            flag = false;
        }else{
            flag = true;
        }
        
        return flag;
    });
    const chkseenable = Vue.computed(() => {
        var flag = false;
        if (ribbonData.elements.audio.se.selection != null) {
            flag = false;
        }else{
            flag = true;
        }
        return flag;
    });
    //===============================================================
    //  Main events judge
    //===============================================================
    const RibbonFuncHome = (ename) => {
        if (ename == "thisapp") {
            mainData.elements.appinfodlg = true;

            /*
            appPrompt("inpu?",(val) => {
                var param = val;
                AppQueue.add(new queueData(
                    {target:mainData.states.selectedAvatar.id,method:'SetTextureConfig',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            });
            */
        }else if (ename == "clearcache") {
            
            appConfirm(t("msg_clearcache"),()=>{
                AppDB.clearAll();
                //AppDB.clearHistory();
                AppQueue.list.splice(0,AppQueue.list.length);
                AppQueue.isExecuting = false;
            });
            /*
            navigator.serviceWorker.getRegistration()
            .then(registration => {
                registration.unregister();
            });
            caches.keys().then(function(keys) {
                var promises = [];
                // clear all cache
                keys.forEach(function(cacheName) {
                    if (cacheName) {
                        promises.push(caches.delete(cacheName));
                    }
                });
            });
            */
        }else if (ename == "vrminfo") {
            Sub_vrminfo();
        }else if (ename == "openvrm") {
            Sub_openfile("v","VRM");
        }else if (ename == "openobject") {
            Sub_openfile("o","OBJECTS");
        }else if (ename == "recentvrm") {
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.VRM.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.VRM;
            mainData.elements.projectSelector.selectType = FILEOPTION.VRM.types;
            modelOperator.enumerateFilesToProjectSelector("VRM");
            mainData.elements.projectSelector.show = true;
        }else if (ename == "recentobj") {
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.OBJECTS.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.OBJECTS;
            mainData.elements.projectSelector.selectType = FILEOPTION.OBJECTS.types;
            modelOperator.enumerateFilesToProjectSelector("OBJECTS");
            mainData.elements.projectSelector.show = true;
        }else if (ename == "recentimg") {
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.IMAGES.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.IMAGES;
            mainData.elements.projectSelector.selectType = FILEOPTION.IMAGES.types;
            modelOperator.enumerateFilesToProjectSelector("IMAGES");
            mainData.elements.projectSelector.show = true;
        }else if (ename == "recentuimg") {
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.IMAGES.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.IMAGES;
            mainData.elements.projectSelector.selectType = FILEOPTION.IMAGES.types;
            modelOperator.enumerateFilesToProjectSelector("IMAGES");
            mainData.elements.projectSelector.show = true;
        }else if (ename == "getcapture") {
            Sub_getcapture();
        }else if (ename == "config") {
            mainData.elements.configdlg.show = true;
            
        }else if (ename == "vpad") {
            mainData.elements.vpaddlg.show = true;
        }
    }
    //==================================================
    const RibbonFuncScreen = (ename, options) => {
        if (ename == "applyscreen") {
            //mainData.elements.canvas.styles.width = `${options.width}px`;
            //mainData.elements.canvas.styles.height = `${options.height}px`;
            modelOperator.setScreenSize(options.width,options.height,false);
        }else if (ename == "originalsize") {
            mainData.elements.canvas.styles.width = "100%";
            mainData.elements.canvas.styles.height = "100%";
            //elements.canvas.styles.width = elements.canvas.width;
            //elements.canvas.styles.height = elements.canvas.height;
            Vue.nextTick(() => {
                ribbonData.elements.scr_size.width = refs.unitycontainer.value.width; //document.getElementById("unity-canvas").width;
                ribbonData.elements.scr_size.height = refs.unitycontainer.value.height; //document.getElementById("unity-canvas").height;
                mainData.elements.canvas.width =  refs.unitycontainer.value.width;
                mainData.elements.canvas.height =  refs.unitycontainer.value.height;
            });
            modelOperator.setScreenSize(-1,-1,true);
            
        }else if (ename == "resetcamera") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'ResetCameraFromOuter'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "getcapture") {
            Sub_getcapture(options.isTransparent);
            
        }else if (ename == "listcapture") {
            sessionStorage.setItem("UseDarkTheme",mainData.appconf.confs.application.UseDarkTheme ? "1" : "0");

            mainData.elements.win_screenshot = window.open("./static/win/capture/index.html","capturewindow",
                `width=${parseInt(window.outerWidth * 0.7)},height=${parseInt(window.outerHeight * 0.7)},alwaysRaised=yes,resizable=yes,autoHideMenuBar=true`
            );
            
            
        //}else if (ename == "settransparent") {
        }else if (ename == "beginrecord") {
            Sub_beginrecord();
        }else if (ename == "endrecord") {
            ribbonData.elements.lnk_download.state = false;
        //}else if (ename == "downloadvideo") {
        }else if (ename == "videomute") {
            var tracks = callback.unity.screen.recorder.stream.getAudioTracks();
            if (tracks.length > 0) {
                tracks[0].enabled = !tracks[0].enabled;
                if (tracks[0].enabled) {
                    ribbonData.elements.lnk_download.icon_mute = "volume_up";
                }else{
                    ribbonData.elements.lnk_download.icon_mute = "volume_mute";
                }
            }
        }else if (ename == "videoplayer") {
            sessionStorage.setItem("UseDarkTheme",mainData.appconf.confs.application.UseDarkTheme ? "1" : "0");

            mainData.elements.win_vplayer = window.open("./static/win/vplayer/index.html","playerwindow",
                "width=720,height=570,alwaysRaised=yes,resizable=yes,autoHideMenuBar=true"
            );
        }else if (ename == "rotate360") {
            var param = parseFloat(options.speed);
            if (options.isOn) {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'StartRotate360',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }else{
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'StopRotate360',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }
            AppQueue.start();
        //}else if (ename == "rotatespeed") {
        }else if (ename == "antialias") {
            var param = "taa," + (options.isOn ? "1" : "0");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'EnablePostProcessing',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "showikmarker") {
            var param = options.isOn ? 1 : 0;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'EnableHandleShowCamera',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));

            AppQueue.start();
        }else if (ename == "ikmarkersize") {
            var param = parseFloat(options.size);
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ChangeIKMarkerStyle',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }
    }
    //==================================================
    const RibbonFuncModel = (ename, options) => {
        if (ename == "addtext") {
            var param = [
                "ABC",
                "tl"
            ];
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'OpenText',param:param.join(",")},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.start();
        }else if (ename == "adduimage") {
            Sub_openfile("ui","IMAGES");
        }else if (ename == "addcamera") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'CreateCameraObject',param:"0"},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.start();
        }else if (ename == "addeffect") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'CreateSingleEffect'},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.start();
        }else if (ename == "addspotlight") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'OpenSpotLight'},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.start();
        }else if (ename == "addpointlight") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'OpenPointLight'},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.start();
        }else if (ename == "addbasicshape") {
            var param = options.format;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'CreateBlankObject',param:param},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.start();
        }else if (ename == "openvrm") {
            Sub_openfile("v","VRM");
        }else if (ename == "openobject") {
            Sub_openfile("o","OBJECTS");
        }else if (ename == "openimage") {
            Sub_openfile("img","IMAGES");
        }else if (ename == "vrminfo") {
            Sub_vrminfo();
        }else if (ename == "savepose") {
            if (mainData.states.selectedAvatar == null) return;
            
            if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
                var msg = t("msg_pose_save_check1");
                appAlert(msg);
                return;
            }

            appPrompt(t("msg_pose_sav"),(keyname)=>{
                AppQueue.add(new queueData(
                    {target:mainData.states.selectedAvatar.id,method:'BackupAvatarTransform',param:"vrm"},
                    "backupnowpose",QD_INOUT.returnJS,
                    (val,key) => {
                        var js = val; //JSON.parse(val);
                        var pose = new VVPoseConfig(-1,js);
                        pose.name = key;
                        AppDB.pose.setItem(key,js);
                    },keyname
                ));
                AppQueue.start();
            },"");
        }else if (ename == "poselist") {
            sessionStorage.setItem("UseDarkTheme",mainData.appconf.confs.application.UseDarkTheme ? "1" : "0");
            mainData.elements.win_pose = window.open("static/win/pose/index.html","posewindow",
                "width=400,height=700,alwaysRaised=yes,resizable=yes,autoHideMenuBar=true"
            );
        }else if (ename == "resetposition") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ResetParentHandlePosition'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "resetrotate") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ResetParentHandleRotation'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "modelremove") {
            appConfirm(t("msg_vrm_delconfirm"),() => {
                modelOperator.removeBodyObject(mainData.states.selectedAvatar);
                AppQueue.start();
            });
        }else if (ename == "resetallbone") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ResetAllHandle'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "mediapipe") {
            if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
                appAlert(t("msg_error_mediapipe1"));
                return;
            }
            appConfirm(t("msg_start_mediapipe"),() => {
                mainData.elements.win_mediapipe = window.open("./static/win/mp/index.html",
                    "_blank",
                    "width=1280,height=720,alwaysRaised=yes,resizable=yes,autoHideMenuBar=true"
                );
                AppQueue.add(new queueData(
                    {target:mainData.states.selectedAvatar.id,method:'GetIKTransformAll'},
                    "saveTPoseInfo",QD_INOUT.returnJS,
                    (val) => {
                        if (!val) return;
                        var js = JSON.parse(val);
                        
                        mainData.states.selectedAvatar.TPoseInfo = js;
                    }
                ));
                AppQueue.start();
            });

        }
    }
    //==================================================
    const RibbonFuncAnimation = (ename, options) => {
        if (ename == "newproject") {
            appConfirm(t("msg_project_new"),() => {
                //---remove all timeline 

                //---reset and re-create project
                modelOperator.newProject();
                AppQueue.start();

                modelLoader.setupDefaultObject();
                modelOperator.destroy_materialFile(true);
            });
        }else if (ename == "openproject") {
            if (options.type == "f") {
                Sub_openfile("ap","PROJECT");
            }else if (options.type == "i") {
                mainData.elements.projectSelector.selectTypeName = FILEOPTION.PROJECT.types[0].description;
                mainData.elements.projectSelector.selectDB = INTERNAL_FILE.PROJECT;
                mainData.elements.projectSelector.selectType = FILEOPTION.PROJECT.types;
                modelOperator.enumerateFilesToProjectSelector("PROJECT");
                /*
                mainData.elements.projectSelector.files.splice(0,mainData.elements.projectSelector.files.length);
                AppDB.scene_meta.iterate((value,key,num)=>{
                    console.log(key,value,num);
                    mainData.elements.projectSelector.files.push({
                        fullname : value.fullname,
                        name : value.name,
                        size : value.size,
                        createdDate : value.createdDate.toLocaleString(),
                        updatedDate : value.updatedDate.toLocaleString(),
                    });
                })
                .then(res => {
                    //mainData.elements.projectSelector.selected = mainData.elements.projectSelector.files[0];
                });*/
                mainData.elements.projectSelector.show = true;
            }
        }else if (ename == "saveproject") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SaveProject'},
                "saveproject",QD_INOUT.returnJS,
                callback.saveproject,
                {callback, disktype : options.type, savetype : "overwrite"}
            ));
            AppQueue.start();
        }else if (ename == "saveasproject") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SaveProject'},
                "saveproject",QD_INOUT.returnJS,
                callback.saveproject,
                {callback, disktype : options.type, savetype : "as"}
            ));
            AppQueue.start();
        }else if (ename == "setuprole") {
            if (!mainData.elements.projdlg.mat_firstload) {
                //---load material firstly.
                modelOperator.load_materialFileBody();
            }
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'GetAllActorsFromOuter'},
                "enumactorsroles",QD_INOUT.returnJS,
                callback.enumactorsroles,
                {callback}
            ));
            AppQueue.start();
        }else if (ename == "playfirst") {
            var js = Sub_playframecommon();
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'StartAllTimeline',param:js},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            mainData.states.animationPlaying = true;
            if (mainData.appconf.confs.animation.play_with_record_movie === true) {
                Sub_beginrecord();
            }
        }else if (ename == "playnormal") {
            Sub_playframecommon();
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'PauseAllTimeline'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            mainData.states.animationPlaying = !mainData.states.animationPlaying;
        }else if (ename == "stop") {
            var param = new AnimationParsingOptions();
            param.isExecuteForDOTween = 1;
            
            if (mainData.appconf.confs.animation.off_ikmarker_during_play_animation === true) {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'EnableHandleShowCamera',param:1},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'StopAllTimeline'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            mainData.states.animationPlaying = false;
        }else if (ename == "setfps") {
            //---FPS--------------------------------------=====
            var param = parseInt(ribbonData.elements.frame.fps);
            if (isNaN(param)) return;
    
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetFps',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "setloop") {
        }else if (ename == "setcurrentframe") {
            if (mainData.stetes.animationPlaying) return;

            modelOperator.select_keyframePosition(options.value);
        }else if (ename == "setmaxframe") {
            mainData.data.project.timelineFrameLength = parseFloat(options.value);
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetTimelineFrameLength',param:mainData.data.project.timelineFrameLength},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "addkeyframe") {
            modelOperator.addKeyFrame(mainData.states.selectedAvatar);
        }else if (ename == "cutframe") {
            var param = `${mainData.states.selectedCast.roleName},${mainData.states.selectedCast.type},${timelineData.states.currentcursor},1`;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'CopyFrame',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            mainData.data.clipboard.frame = {
                mode : "cut",
                index : timelineData.states.currentcursor,
            };
        }else if (ename == "copyframe") {
            var param = `${mainData.states.selectedCast.roleName},${mainData.states.selectedCast.type},${timelineData.states.currentcursor},0`;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'CopyFrame',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            mainData.data.clipboard.frame = {
                mode : "copy",
                index : timelineData.states.currentcursor,
            };
        }else if (ename == "pasteframe") {
            var param = `${mainData.states.selectedCast.roleName},${mainData.states.selectedCast.type},${timelineData.states.currentcursor}`;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'PasteFrame',param:param},
                "paste_keyframe",QD_INOUT.returnJS,
                callback.paste_keyframe,
                {callback}
            ));
            AppQueue.start();
        }else if (ename == "addallkeyframe") {
            var aro = new AnimationRegisterOptions();
            aro.targetId = "";
            aro.targetType = "";
            aro.index = timelineData.states.currentcursor;
            
            for (var obj = 0; obj <  timelineData.data.timelines.length; obj++) {
                var fdata = new VVTimelineFrameData(aro.index,{});
                var tl = timelineData.data.timelines[obj];
                if (tl && tl.target && tl.target.avatar) {
                    var keyframe = tl.getFrameByKey(fdata.key);
                    if (keyframe) {
                        tl.setFrameByKey(fdata.key, fdata);
                    }else{
                        tl.insertFrame(aro.index,fdata);
                    }
                }
            }
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'RegisterFrame',param:JSON.stringify(aro)},
                "registernowpose",QD_INOUT.returnJS,
                callback.registernowpose,
                {callback}
            ));
            AppQueue.start();
        }else if (ename == "delkeyframe") {
            appConfirm(t("msg_delframe_currentkey"),()=>{
                var aro = new AnimationRegisterOptions();
                aro.targetId = mainData.states.selectedAvatar.id;
                aro.targetType = mainData.states.selectedAvatar.type;
                aro.index = timelineData.states.currentcursor;
                
                //---timeline ui    
                mainData.states.selectedTimeline.clearFrame(aro.index);
    
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'UnregisterFrame',param:JSON.stringify(aro)},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            });
        }else if (ename == "delemptyline") {
        }
    }
    //==================================================
    const RibbonFuncSystemEffect = (ename, options) => {
        if (ename == "addkeyframe") {
            var aro = new AnimationRegisterOptions();
            aro.targetId = "SystemEffect";
            aro.targetRole = "SystemEffect";
            aro.targetType = AF_TARGETTYPE.SystemEffect;
            aro.index = timelineData.states.currentcursor;
            
            //---timeline ui
            var fdata = new VVTimelineFrameData(aro.index,{});
            var tl = modelOperator.getTimeline("SystemEffect");
            if (tl) {
                var keyframe = tl.getFrameByKey(fdata.key);
                if (keyframe) {
                    tl.setFrameByKey(aro.index,fdata);
                }else{
                    tl.insertFrame(aro.index,fdata);
                }
            }
            
            
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'RegisterFrame',param:JSON.stringify(aro)},
                "registernowpose",QD_INOUT.returnJS,
                callback.registernowpose,
                {callback}
            ));
            AppQueue.start();
            
        }else if (ename == "copyframe") {
        }else if (ename == "pasteframe") {
        }else if (ename == "bloom_checked") {
            var param = "bloom," + (ribbonData.elements.syseff.bloom.checked ? "1" : "0");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'EnablePostProcessing',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "bloom_intensity") {
            var param = "intensity," + ribbonData.elements.syseff.bloom.intensity;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'BloomSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "chroma_checked") {
            var param = "chromatic," + (ribbonData.elements.syseff.chroma.checked ? "1" : "0");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'EnablePostProcessing',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "chroma_intensity") {
            var param = "intensity," + ribbonData.elements.syseff.chroma.intensity;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'ChromaticSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "colorgrd_checked") {
            var param = "colorgrading," + (ribbonData.elements.syseff.colorgrd.checked ? "1" : "0");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'EnablePostProcessing',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "colorgrd_filter") {
            var param = "colorfilter," + ribbonData.elements.syseff.colorgrd.filter;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'ColorGradingSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "colorgrd_temperature") {
            var param = "temperature," + ribbonData.elements.syseff.colorgrd.temperature;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'ColorGradingSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "colorgrd_tint") {
            var param = "tint," + ribbonData.elements.syseff.colorgrd.tint;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'ColorGradingSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "depthov_checked") {
            var param = "depthoffield," + (ribbonData.elements.syseff.depthov.checked ? "1" : "0");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'EnablePostProcessing',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "depthov_aperture") {
            var param = "aperture," + ribbonData.elements.syseff.depthov.aperture;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'DepthOfFieldSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "depthov_focallength") {
            var param = "focallength," + ribbonData.elements.syseff.depthov.focallength;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'DepthOfFieldSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "grain_checked") {
            var param = "grain," + (ribbonData.elements.syseff.grain.checked ? "1" : "0");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'EnablePostProcessing',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "grain_intensity") {
            var param = "intensity," + ribbonData.elements.syseff.grain.intensity;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'GrainSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "grain_size") {
            var param = "size," + ribbonData.elements.syseff.grain.size;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'GrainSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "vignette_checked") {
            var param = "vignette," + (ribbonData.elements.syseff.vignette.checked ? "1" : "0");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'EnablePostProcessing',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "vignette_intensity") {
            var param = "intensity," + ribbonData.elements.syseff.vignette.intensity;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'VignetteSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "moblur_checked") {
            var param = "motionblur," + (ribbonData.elements.syseff.moblur.checked ? "1" : "0");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'EnablePostProcessing',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "moblur_shutterangle") {
            var param = "shutterangle," + ribbonData.elements.syseff.moblur.shutterangle;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'MotionBlurSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "moblur_samplecount") {
            var param = "samplecount," + ribbonData.elements.syseff.moblur.samplecount;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'MotionBlurSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }
    }
    //==================================================
    const RibbonFuncAudio = (ename, options) => {
        var unityTarget = "";
        var audioobj = null;
        if (ribbonData.elements.audio.operatetype == "bgm") {
            unityTarget = AppQueue.unity.AudioBGM;
            audioobj = ribbonData.elements.audio.bgm;
        }else if (ribbonData.elements.audio.operatetype == "se") {
            unityTarget = AppQueue.unity.AudioSE;
            audioobj = ribbonData.elements.audio.se;
        }else{
            return;
        }
        
        if (ename == "addkeyframe") {
            var aro = new AnimationRegisterOptions();
            aro.targetId = unityTarget;
            aro.targetRole = unityTarget;
            aro.targetType = AF_TARGETTYPE.Audio;
            aro.index = timelineData.states.currentcursor; // this.parent.children.timeline.states.frame.current;

            
            var fdata = new VVTimelineFrameData(aro.index,{
            });
            /**
             * @type {VVTimelineTarget}
             */
            var tl = modelOperator.getTimeline(unityTarget);
            if (tl) {
                var keyframe = tl.getFrameByKey(fdata.key);
                if (keyframe) {
                    tl.setFrameByKey(aro.index,fdata);
                }else{
                    tl.insertFrame(aro.index,fdata);
                }
            }                     
            
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'RegisterFrame',param:JSON.stringify(aro)},
                "registernowpose",QD_INOUT.returnJS,
                callback.registernowpose,
                {callback: callback}
            ));
            AppQueue.start();
            
            
        }else if (ename == "copyframe") {
        }else if (ename == "pasteframe") {
        }else if (ename == "operationtype") {
            AppQueue.add(new queueData(
                {target:unityTarget,method:'GetIndicatedPropertyFromOuter'},
                "getpropaudio",QD_INOUT.returnJS,
                callback.getPropertyAudio,
                {callback, AudioType: unityTarget}
            ));
            AppQueue.start();
        }else if (ename == "audioadd") {
            mainData.states.fileloadtype = ribbonData.elements.audio.operatetype;
            Sub_openfile(mainData.states.fileloadtype, "AUDIOS");
        }else if (ename == "audiodel") {
            var AUTYPE = ribbonData.elements.audio.operatetype.toUpperCase();
            var val = audioobj.selection.value;
            var avatar = modelOperator.getAvatarFromRole(AUTYPE).avatar;
            appConfirm(t('msg_del_audio'),() => {
                var ishit = audioobj.list.findIndex(item => {
                    if (item.value == val) return true;
                    return false;
                })
                if (ishit > -1) {
                    audioobj.list.splice(ishit,1);
                    AppQueue.add(new queueData(
                        {target:unityTarget,method:'RemoveAudio',param:val},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                    AppQueue.start();
                }
            });
            
        }else if (ename == "audioselect") {
            AppQueue.add(new queueData(
                {target:unityTarget,method:'SetAudio',param:options.value},
                "",QD_INOUT.toUNITY,
                null
            ));
            /*AppQueue.add(new queueData(
                {target:unityTarget,method:'GetIndicatedPropertyFromOuter'},
                "getpropbgm",QD_INOUT.returnJS,
                callback.getPropertyAudio,
                {callback, AudioType: unityTarget}
            ));*/
            AppQueue.start();
        }else if (ename == "audioplayflag") {
            AppQueue.add(new queueData(
                {target:unityTarget,method:'SetPlayFlagFromOuter',param:options.value},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "audioplay") {
            if (audioobj.playbtn_state == "play_circle") {
                if (ribbonData.elements.audio.operatetype == "se") {
                    AppQueue.add(new queueData(
                        {target:unityTarget,method:'PlaySe'},
                        "",QD_INOUT.toUNITY,
                        null
                    ));

                }else{
                    AppQueue.add(new queueData(
                        {target:unityTarget,method:'PlayAudio'},
                        "",QD_INOUT.toUNITY,
                        null
                    ));

                }
                AppQueue.start();
                audioobj.playbtn_state = "pause";
            }else{
                AppQueue.add(new queueData(
                    {target:unityTarget,method:'PauseAudio'},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
                audioobj.playbtn_state = "play_circle";
            }
        }else if (ename == "audiostop") {
            AppQueue.add(new queueData(
                {target:unityTarget,method:'StopAudio'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            audioobj.playbtn_state = "play_circle";
        }else if (ename == "audioseek") {
            var param = parseFloat(audioobj.seek);
            AppQueue.add(new queueData(
                {target:unityTarget,method:'SetSeekSeconds',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "audioloop") {
            var param = audioobj.isloop ? 1 : 0;
            AppQueue.add(new queueData(
                {target:unityTarget,method:'SetLoop',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "audiovol") {
            var param = parseFloat(audioobj.vol) * 0.01;
            AppQueue.add(new queueData(
                {target:unityTarget,method:'SetVolume',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "audiopitch") {
            var param = parseFloat(audioobj.pitch) * 0.01;
            AppQueue.add(new queueData(
                {target:unityTarget,method:'SetPitch',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }
    }
    //===============================================================
    //  Watch events
    //===============================================================
    /*
    const wa_langbox_selected = Vue.watch(() => ribbonData.elements.language_box.selected, (newval) => {
        locale.value = newval;
        localStorage.setItem("appLocale",newval);
        
    },{deep:true});
    */
    const changeStateLnkdownload = (newval) => {
        if (newval == "initial") {
            ribbonData.elements.lnk_download.startEnable = false;
            ribbonData.elements.lnk_download.stopEnable = true;
            ribbonData.elements.lnk_download.enabled = true;
        }else if (newval == "start") {
            ribbonData.elements.lnk_download.startEnable = true;
            ribbonData.elements.lnk_download.stopEnable = false;
            ribbonData.elements.lnk_download.enabled = true;
        }else if (newval == "stop") {
            ribbonData.elements.lnk_download.startEnable = false;
            ribbonData.elements.lnk_download.stopEnable = true;
            ribbonData.elements.lnk_download.enabled = false;
        }
    }
    const wa_lnkdownload_onoff = Vue.watch(() => ribbonData.elements.lnk_download.state, (newval) => {
        if (newval === true) {
            if (refs.lnk_recdownload.value) window.URL.revokeObjectURL(refs.lnk_recdownload.value.href);
            callback.unity.screen.recorder.start();
            changeStateLnkdownload("start");
        }else if (newval === false) {
            callback.unity.screen.recorder.stop();
            changeStateLnkdownload("stop");
        }
    });
    /*
    const wa_hrefdownload = Vue.watch(()=> hrefdownload.value, (newval)=>{
        elements.value.lnk_download.href = newval;
    });
    const wa_screenwidth = Vue.watch(()=> screenwidth.value, (newval,oldval)=> {
        elements.value.scr_size.width = newval;
    },{deep:true});
    const wa_screenheight = Vue.watch(()=> screenheight.value, (newval,oldval)=> {
        elements.value.scr_size.height = newval;
    },{deep:true});
    */
    const getCurrentModeSize = () => {
        var tab = parseInt(ribbonData.elements.tab.style.height);
        var tabpanel = parseInt(ribbonData.elements.tabpanel.style.height);
        return tab + tabpanel;
    }
    
    //===============================================================
    //  Trigger events
    //===============================================================
    const language_box_changed = (val) => {
        locale.value = val;
        localStorage.setItem("appLocale",val);
        //AppDB.app.setItem("appLocale",val);
    }
    //---Screen tab--------------------------------
    const applyScreen_onclick = (evt) => {
        RibbonFuncScreen("applyscreen",{
            width : ribbonData.elements.scr_size.width,
            height : ribbonData.elements.scr_size.height
        });
    }
    const originalSize_onclick = (evt) => {
        RibbonFuncScreen("originalsize",{
            width : ribbonData.elements.scr_size.width,
            height : ribbonData.elements.scr_size.height
        });
    }
    const downloadVideo_onclick = (evt) =>  {
        if (refs.lnk_recdownload.value) refs.lnk_recdownload.value.click();
    }

    const getCapture_onclick = (evt) => {
        RibbonFuncScreen('getcapture',{
            isTransparent : ribbonData.elements.capture.isTransparent
        });
    }
    const rotate360_onchange = (value, evt) => {            
        RibbonFuncScreen("rotate360",{
            isOn : value,
            speed : ribbonData.elements.optionArea.rotateSpeed
        });
    }
    const rotateSpeed_onchange = (value, evt) => {
        RibbonFuncScreen("rotate360",{
            isOn : ribbonData.elements.optionArea.rotate360,
            speed : value
        });
    }
    const useAntialias_onchange = (value, evt) => {
        RibbonFuncScreen("antialias",{
            isOn : value
        });
    }
    const showIKMarker_onchange = (value, evt) => {
        RibbonFuncScreen("showikmarker",{
            isOn : value
        });
    }
    const ikmarkerSize_onchange = (value, evt) => {
        RibbonFuncScreen("ikmarkersize",{
            size : value
        });
    }

    //---Model tab----------------------------
    const basicshape_onclick = (evt) => {
        RibbonFuncModel("addbasicshape",{
            format : evt
        });
    }

    //---Animation tab------------------------
    const openproject_file_onclick = (evt) => {
        RibbonFuncAnimation('openproject',{
            type : "f"
        });
    }
    const openproject_internal_onclick = (evt) => {
        RibbonFuncAnimation('openproject',{
            type : "i"
        });
    }
    const saveproject_file_onclick = (evt) => {
        RibbonFuncAnimation('saveproject',{
            type : "f"
        });
    }
    const saveproject_internal_onclick = (evt) => {
        RibbonFuncAnimation('saveproject',{
            type : "i"
        });
    }
    const saveasproject_file_onclick = (evt) => {
        RibbonFuncAnimation('saveasproject',{
            type : "f"
        });
    }
    const saveasproject_internal_onclick = (evt) => {
        RibbonFuncAnimation('saveasproject',{
            type : "i"
        });
    }

    const setmaxframe_onchange = (evt) => {
        RibbonFuncAnimation("setmaxframe",{
            value: ribbonData.elements.frame.max
        });
    }
    const setfps_onchange = (evt) => {
        RibbonFuncAnimation("setfps",{
            value: ribbonData.elements.frame.fps
        });
    }
    const setloop_onchange = (evt) => {
        RibbonFuncAnimation("setloop",{
            value: ribbonData.elements.frame.isloop
        });
    }
    const setcurrentframe_onchange = (evt) => {
        RibbonFuncAnimation("setcurrentframe",{
            value: ribbonData.elements.frame.current
        });
    }
    //--System effect-----------------------------------
    const bloom_checked_onchange = (value, evt) => {
        RibbonFuncSystemEffect('bloom_checked',{
            value:value
        });
    }
    const bloom_intensity_onchange = (value, evt) => {
        RibbonFuncSystemEffect("bloom_intensity",{
            value:value
        });
    }
    const chroma_checked_onchange = (value, evt) => {
        RibbonFuncSystemEffect("chroma_checked",{
            value:value
        });
    }
    const chroma_intensity_onchange = (value, evt) => {
        RibbonFuncSystemEffect("chroma_intensity",{
            value:value
        });
    }
    const colorgrd_checked_onchange = (value, evt) => {
        RibbonFuncSystemEffect("colorgrd_checked",{
            value:value
        });
    }
    const colorgrd_filter_onchange = (value, evt) => {
        RibbonFuncSystemEffect("colorgrd_filter",{
            value:value
        });
    }
    const colorgrd_temperature_onchange = (value, evt) => {
        RibbonFuncSystemEffect("colorgrd_temperature",{
            value:value
        });
    }
    const colorgrd_tint_onchange = (value, evt) => {
        RibbonFuncSystemEffect("colorgrd_tint",{
            value:value
        });
    }
    const depthov_checked_onchange = (value, evt) => {
        RibbonFuncSystemEffect("depthov_checked",{
            value:value
        });
    }
    const depthov_aperture_onchange = (value, evt) => {
        RibbonFuncSystemEffect("depthov_aperture",{
            value:value
        });
    }
    const depthov_focallength_onchange = (value, evt) => {
        RibbonFuncSystemEffect("depthov_focallength",{
            value:value
        });
    }
    const grain_checked_onchange = (value, evt) => {
        RibbonFuncSystemEffect("grain_checked",{
            value:value
        });
    }
    const grain_intensity_onchange = (value, evt) => {
        RibbonFuncSystemEffect("grain_intensity",{
            value:value
        });
    }
    const grain_size_onchange = (value, evt) => {
        RibbonFuncSystemEffect("grain_size",{
            value:value
        });
    }
    const vignette_checked_onchange = (value, evt) => {
        RibbonFuncSystemEffect("vignette_checked",{
            value:value
        });
    }
    const vignette_intensity_onchange = (value, evt) => {
        RibbonFuncSystemEffect("vignette_intensity",{
            value:value
        });
    }
    const moblur_checked_onchange = (value, evt) => {
        RibbonFuncSystemEffect("moblur_checked",{
            value:value
        });
    }
    const moblur_shutterangle_onchange = (value, evt) => {
        RibbonFuncSystemEffect("moblur_shutterangle",{
            value:value
        });
    }
    const moblur_samplecount_onchange = (value, evt) => {
        RibbonFuncSystemEffect("moblur_samplecount",{
            value:value
        });
    }
    //---Audio-----------------------------------
    const operationtype_onchange = (value, evt) => {
        RibbonFuncAudio("operationtype",{
            value: value
        });
    }
    const bgmselect_onchange = (value, evt) => {
        RibbonFuncAudio("audioselect",{
            //name:'bgmselect',
            type : ribbonData.elements.audio.operatetype,
            value: value.value
        });
    }
    const bgmplayflag_onchange = (value, evt) => {
        RibbonFuncAudio("audioplayflag",{
            type : ribbonData.elements.audio.operatetype,
            value: value.value
        });
    }
    const bgmseek_onchange = (value, evt) => {
        RibbonFuncAudio("audioseek",{
            type : ribbonData.elements.audio.operatetype,
            value: value
        });
    }
    const bgmloop_onchange = (value, evt) => {
        RibbonFuncAudio("audioloop",{
            type : ribbonData.elements.audio.operatetype,
            value: value
        });
    }
    const bgmvol_onchange = (value, evt) => {
        RibbonFuncAudio("audiovol",{
            type : ribbonData.elements.audio.operatetype,
            value: value
        });
    }
    const bgmpitch_onchange = (value, evt) => {
        RibbonFuncAudio("audiopitch",{
            type : ribbonData.elements.audio.operatetype,
            value: value
        });
    }

    Vue.onMounted(() => {
        changeStateLnkdownload("initial");
    });
    return Vue.reactive({
        RibbonFuncHome, RibbonFuncScreen, RibbonFuncModel, RibbonFuncAnimation,RibbonFuncSystemEffect, RibbonFuncAudio,

        //---computed
        chk_enableClipboardButton, chk_enableKeyframeButton,

        //---watches
        //wa_langbox_selected,
        wa_lnkdownload_onoff,
        changeStateLnkdownload,
        getCurrentModeSize,
        
        //---trigger events
        language_box_changed,
        applyScreen_onclick,originalSize_onclick,downloadVideo_onclick,getCapture_onclick,
        rotate360_onchange,rotateSpeed_onchange,useAntialias_onchange,showIKMarker_onchange,
        ikmarkerSize_onchange,

        basicshape_onclick,
        
        openproject_file_onclick,openproject_internal_onclick,
        saveproject_file_onclick,saveproject_internal_onclick,saveasproject_file_onclick,saveasproject_internal_onclick,
        setmaxframe_onchange,setfps_onchange,setloop_onchange,setcurrentframe_onchange,

        bloom_checked_onchange, bloom_intensity_onchange,
        chroma_checked_onchange, chroma_intensity_onchange, 
        colorgrd_checked_onchange, colorgrd_filter_onchange, colorgrd_temperature_onchange, colorgrd_tint_onchange,
        depthov_checked_onchange, depthov_aperture_onchange, depthov_focallength_onchange,
        grain_checked_onchange, grain_intensity_onchange, grain_size_onchange,
        vignette_checked_onchange, vignette_intensity_onchange,
        moblur_checked_onchange, moblur_shutterangle_onchange, moblur_samplecount_onchange,
        
        operationtype_onchange,
        bgmselect_onchange, bgmplayflag_onchange, bgmseek_onchange, bgmloop_onchange, bgmvol_onchange, bgmpitch_onchange,
            
        chkbgmenable, chkseenable
    })
}
