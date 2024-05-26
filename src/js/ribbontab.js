import { appModelOperator } from "./model/operator.js";
import { VVPoseConfig, VVTimelineFrameData, VVTimelineTarget } from "./prop/cls_vvavatar.js";
import { AnimationParsingOptions,AnimationRegisterOptions,AnimationTargetAudio } from "./prop/cls_unityrel.js";
import { FILEEXTENSION_AUDIO,AF_TARGETTYPE, AF_MOVETYPE, FILEEXTENSION_VRM, FILEEXTENSION_OTHEROBJECT,FILEEXTENSION_IMAGE,
    FILEEXTENSION_ANIMATION, 
    INTERNAL_FILE,
    FILEOPTION,
    IKBoneType,
    STORAGE_TYPE
} from "../res/appconst.js";
import { VFileHelper,VFileOptions } from "../../public/static/js/filehelper.js" 
import { appMainData } from "./prop/appmaindata.js";
import { appDataTimeline } from "./prop/apptimelinedata.js";
import { UnityCallbackFunctioner } from "./model/callback.js";
import { appDataRibbon } from "./prop/appribbondata.js";
import { VRoidHubConnector } from "./model/vroidhub.js";

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {appMainData} mainData 
 * @param {appDataRibbon} ribbonData 
 * @param {appDataTimeline} timelineData
 * @param {*} modelLoader
 * @param {appModelOperator} modelOperator 
 * @param {UnityCallbackFunctioner} callback 
 * @param {*} refs 
 * @returns 
 */
export function defineRibbonTab(app,Quasar,mainData,ribbonData,timelineData,modelLoader,modelOperator,callback,refs) {
    const { t, locale  } = VueI18n.useI18n({ useScope: 'global' });

    const vrhapi = new VRoidHubConnector();

    VFileHelper.setAppConf(mainData.appconf);

    /**
     * 
     * @param {String} filetype 
     * @param {String} accepts 
     * @param {Number} typeselection
     */
    const Sub_openfile = async (filetype,accepts,typeselection = 0) => {
        mainData.states.fileloadtype = filetype;

        VFileHelper.openFromDialog(FILEOPTION[accepts],typeselection,(files,cd,err)=>{
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

        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'ShowTargetObject',param: "0"},
            "",QD_INOUT.toUNITY,
            null
        ));
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
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'ShowTargetObject',param: mainData.appconf.confs.application.show_camera_target_object},
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
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetRecordingOtherMotion',param:1},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'PreparePreviewMarker'},
            "",QD_INOUT.toUNITY,
            null
        ));
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
    const chk_enablePasteButton = Vue.computed(() => {
        var clip = mainData.data.clipboard.frame;
        var ret = (clip != null);

        //---return !Boolean
        return !ret;
    });
    const chk_enableKeyframeButton = Vue.computed(() => {
        var ret = true;
        
        if (mainData.states.selectedTimeline) {
            //---if avatar of role of timeline is empty, disable
            if (mainData.states.selectedTimeline.target) {
                if (!mainData.states.selectedTimeline.target.avatar) ret = false;
            }else{
                ret = false;
            }
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
    const chkAppIsOSApp = Vue.computed(() => {
        return VFileHelper.flags.isElectron;
    });
    const chkTabSelectEffectORAudio = Vue.computed(() => {
        if ((ribbonData.elements.tab.selectIndex == 'effect') ||
            (ribbonData.elements.tab.selectIndex == 'audio')
        ) {
            return true;
        }else{
            return false;
        }
    });
    const chkEnableVRAR = Vue.computed(() => {
        return (!ribbonData.elements.vrar.disable.vr || !ribbonData.elements.vrar.disable.ar);
    });
    const chkDevicePlatform = () => {
        if (navigator.userAgent.indexOf(" VR ") > -1) {
            return "vr";
        }else if (navigator.userAgent.indexOf(" Mobile ") > -1) { 
            return "mobile";
        }else{
            return "pc";
        }
    }
    //===============================================================
    //  Main events judge
    //===============================================================
    const RibbonFuncHome = (ename) => {
        var is_closepanel = false;
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
           is_closepanel = true;
        }else if (ename == "clearcache") {
            
            appConfirm(t("msg_clearcache"),()=>{
                AppDB.clearAll();
                //AppDB.clearHistory();
                AppQueue.list.splice(0,AppQueue.list.length);
                AppQueue.isExecuting = false;
                is_closepanel = true;
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
        }else if (ename == "clearcachewebgl") {
            appConfirm(t("msg_clearcache"),()=>{
                AppQueue.list.splice(0,AppQueue.list.length);
                AppQueue.isExecuting = false;
                is_closepanel = true;
            });
        }else if (ename == "clearcachetemp") {
            appConfirm(t("msg_clearcache"),()=>{
                AppDB.clearAll();
                //AppDB.clearHistory();
                is_closepanel = true;
            });
        }else if (ename == "clearcacheconf") {
            appConfirm(t("msg_clearcache"),()=>{
                mainData.appconf.uninstall();
                is_closepanel = true;
            });
        }else if (ename == "vrminfo") {
            Sub_vrminfo();
            is_closepanel = true;
        }else if (ename == "openvrm") {
            Sub_openfile("v","VRM");
            is_closepanel = true;
        }else if (ename == "openvrm_gdrive_direct") {
            appPrompt(t("msg1_open_gdrive"),(val) => {
                mainData.elements.loading = true;
                VFileHelper.openFromGoogleDrive(val, "vrm")
                .then(file => {
                    if (file) {
                        file.encoding = "binary";
                        mainData.elements.loadingTypePercent = false;
                        modelLoader.OnChange_Common_AppFile(file,FILEOPTION["VRM"]);
                    }else{
                        appNotifyWarning("Load error of Google Drive...",{timeout:5000});
                    }
                    
                });
                is_closepanel = true;
            });
        }else if (ename == "openvrm_gdrive") {
            mainData.elements.loading = true;
            mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.GOOGLEDRIVE;
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.VRM.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.VRM;
            mainData.elements.projectSelector.selectType = FILEOPTION.VRM.types;
            modelOperator.enumerateFilesToProjectSelector("VRM");
            mainData.elements.projectSelector.show = true;
            is_closepanel = true;
        }else if (ename == "openvrm_appsample") {
            mainData.elements.loading = true;
            mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.APPLICATION;
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.VRM.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.VRM;
            mainData.elements.projectSelector.selectType = FILEOPTION.VRM.types;
            modelOperator.enumerateFilesToProjectSelector("VRM");
            mainData.elements.projectSelector.show = true;
            is_closepanel = true;
        }else if (ename == "openobject") {
            Sub_openfile("o","OBJECTS");
            is_closepanel = true;
        }else if (ename == "openobject_gdrive_direct") {
            appPrompt(t("msg1_open_gdrive"),(val) => {
                mainData.elements.loading = true;
                VFileHelper.openFromGoogleDrive(val, "obj") //representative extension
                .then(file => {
                    if (file) {
                        file.encoding = "binary";
                        mainData.elements.loadingTypePercent = false;
                        modelLoader.OnChange_Common_AppFile(file,FILEOPTION["OBJECTS"]);
                    }else{
                        appNotifyWarning("Load error of Google Drive...",{timeout:5000});
                    }
                    
                });
            });
            is_closepanel = true;
        }else if (ename == "openobject_gdrive") {
            mainData.elements.loading = true;
            mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.GOOGLEDRIVE;
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.OBJECTS.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.OBJECTS;
            mainData.elements.projectSelector.selectType = FILEOPTION.OBJECTS.types;
            modelOperator.enumerateFilesToProjectSelector("OBJECTS");
            mainData.elements.projectSelector.show = true;
            is_closepanel = true;
        }else if (ename == "openobject_appsample") {
            mainData.elements.loading = true;
            mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.APPLICATION;
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.OBJECTS.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.OBJECTS;
            mainData.elements.projectSelector.selectType = FILEOPTION.OBJECTS.types;
            modelOperator.enumerateFilesToProjectSelector("OBJECTS");
            mainData.elements.projectSelector.show = true;
            is_closepanel = true;
        }else if (ename == "recentvrm") {
            mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.INTERNAL;
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.VRM.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.VRM;
            mainData.elements.projectSelector.selectType = FILEOPTION.VRM.types;
            modelOperator.enumerateFilesToProjectSelector("VRM");
            mainData.elements.projectSelector.show = true;
            is_closepanel = true;
        }else if (ename == "recentobj") {
            mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.INTERNAL;
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.OBJECTS.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.OBJECTS;
            mainData.elements.projectSelector.selectType = FILEOPTION.OBJECTS.types;
            modelOperator.enumerateFilesToProjectSelector("OBJECTS");
            mainData.elements.projectSelector.show = true;
            is_closepanel = true;
        }else if (ename == "recentimg") {
            mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.INTERNAL;
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.IMAGES.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.IMAGES;
            mainData.elements.projectSelector.selectType = FILEOPTION.IMAGES.types;
            modelOperator.enumerateFilesToProjectSelector("IMAGES");
            mainData.elements.projectSelector.show = true;
            is_closepanel = true;
        }else if (ename == "recentuimg") {
            mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.INTERNAL;
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.IMAGES.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.IMAGES;
            mainData.elements.projectSelector.selectType = FILEOPTION.IMAGES.types;
            modelOperator.enumerateFilesToProjectSelector("IMAGES");
            mainData.elements.projectSelector.show = true;
            is_closepanel = true;
        }else if (ename == "getcapture") {
            Sub_getcapture();
            is_closepanel = true;
        }else if (ename == "config") {
            mainData.elements.configdlg.show = true;
            is_closepanel = true;
        }else if (ename == "vpad") {
            if (ID("uimode").value == "mobile") {
                if (Quasar.Screen.width > Quasar.Screen.height) {
                    mainData.elements.landvpad.show = !mainData.elements.landvpad.show;
                    return;
                }
            }
            mainData.elements.vpaddlg.show = !mainData.elements.vpaddlg.show;
        }else if (ename == "shownav") {
            mainData.elements.navigationdlg.show = !mainData.elements.navigationdlg.show;
            mainData.elements.navigationdlg.webglw = mainData.elements.canvas.width;
            mainData.elements.navigationdlg.webglh = mainData.elements.canvas.height;
            is_closepanel = true;
        }else if (ename == "enter_vr") {
            //AppQueue.canvas.Module.WebXR.toggleVR();
            var param = [
                mainData.appconf.confs.model.vrar_save_camerapos === true ? "1" : "0",
                [
                    mainData.appconf.confs.model.vrar_camera_initpos_x,
                    mainData.appconf.confs.model.vrar_camera_initpos_y,
                    mainData.appconf.confs.model.vrar_camera_initpos_z,                    
                ].join(":"),
                chkDevicePlatform(),
            ].join(",");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'EnterVR',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "enter_ar") {
            //AppQueue.canvas.Module.WebXR.toggleAR();
            var param = [
                mainData.appconf.confs.model.vrar_save_camerapos === true ? "1" : "0",
                [
                    mainData.appconf.confs.model.vrar_camera_initpos_x,
                    mainData.appconf.confs.model.vrar_camera_initpos_y,
                    mainData.appconf.confs.model.vrar_camera_initpos_z
                ].join(":"),
                chkDevicePlatform(),
            ].join(",");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'EnterAR',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }
        if (is_closepanel) close_tabpanel();
    }
    //==================================================
    const RibbonFuncScreen = (ename, options) => {
        var is_closepanel = false;
        if (ename == "applyscreen") {
            //mainData.elements.canvas.styles.width = `${options.width}px`;
            //mainData.elements.canvas.styles.height = `${options.height}px`;
            modelOperator.setScreenSize(options.width,options.height,false);
            is_closepanel = true;
        }else if (ename == "originalsize") {
            /*
            mainData.elements.canvas.styles.width = "100%";
            mainData.elements.canvas.styles.height = "100%";
            //elements.canvas.styles.width = elements.canvas.width;
            //elements.canvas.styles.height = elements.canvas.height;
            Vue.nextTick(() => {
                ribbonData.elements.scr_size.width = refs.unitycontainer.value.width; //document.getElementById("unity-canvas").width;
                ribbonData.elements.scr_size.height = refs.unitycontainer.value.height; //document.getElementById("unity-canvas").height;
                mainData.elements.canvas.width =  refs.unitycontainer.value.width;
                mainData.elements.canvas.height =  refs.unitycontainer.value.height;
                mainData.elements.navigationdlg.webglw = refs.unitycontainer.value.width;
                mainData.elements.navigationdlg.webglh = refs.unitycontainer.value.height;
            });*/
            modelOperator.setScreenSize(-1,-1,true);
            is_closepanel = true;
        }else if (ename == "resetcamera") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'ResetCameraFromOuter'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "getcapture") {
            Sub_getcapture(options.isTransparent);
            is_closepanel = true;
        }else if (ename == "listcapture") {
            if (mainData.appconf.confs.application.is_externalwin_capture === true) {
                sessionStorage.setItem("UseDarkTheme",mainData.appconf.confs.application.UseDarkTheme ? "1" : "0");

                if (mainData.elements.win_screenshot && !mainData.elements.win_screenshot.closed) {
    
                }else{
                    mainData.elements.win_screenshot = window.open("./static/win/capture/index.html","capturewindow",
                        `width=${parseInt(window.outerWidth * 0.7)},height=${parseInt(window.outerHeight * 0.7)},alwaysRaised=yes,resizable=yes,autoHideMenuBar=true`
                    );
                }
                    
                if (VFileHelper.checkNativeAPI) { 
                    var title = mainData.elements.win_screenshot.document.title
                    window.elecAPI.focusWindow(title);
                }else{
                    mainData.elements.win_screenshot.blur();
                    window.focus();
                    window.blur();
                    mainData.elements.win_screenshot.focus();
                }
            }else{
                mainData.elements.capturedlg.show = true;
            }
            
            is_closepanel = true;
        //}else if (ename == "settransparent") {
        }else if (ename == "beginrecord") {
            Sub_beginrecord();
            is_closepanel = true;
        }else if (ename == "endrecord") {
            ribbonData.elements.lnk_download.state = false;
            is_closepanel = true;
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
            is_closepanel = true;
        }else if (ename == "videoplayer") {
            sessionStorage.setItem("UseDarkTheme",mainData.appconf.confs.application.UseDarkTheme ? "1" : "0");

            if (mainData.elements.win_vplayer && !mainData.elements.win_vplayer.closed) {

            }else{
                mainData.elements.win_vplayer = window.open("./static/win/vplayer/index.html","playerwindow",
                    "width=1250,height=730,alwaysRaised=yes,resizable=yes,autoHideMenuBar=true"
                );
            }
            
            if (VFileHelper.checkNativeAPI) { 
                var title = mainData.elements.win_vplayer.document.title
                window.elecAPI.focusWindow(title);
            }else{
                mainData.elements.win_vplayer.blur();
                window.focus();
                window.blur();
                mainData.elements.win_vplayer.focus();
            }
            is_closepanel = true;
            
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
            is_closepanel = true;
        //}else if (ename == "rotatespeed") {
        }else if (ename == "antialias") {
            var param = "taa," + (options.isOn ? "1" : "0");
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'EnablePostProcessing',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "showikmarker") {
            var param = options.isOn ? 1 : 0;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'EnableHandleShowCamera',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            if (mainData.appconf.confs.application.show_camera_target_object) {
                //mainData.appconf.confs.application.show_camera_target_object = false;
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'ShowTargetObject',param:param.toString()},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }

            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "ikmarkersize") {
            var param = parseFloat(options.size);
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ChangeIKMarkerStyle',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }
        if (is_closepanel) close_tabpanel();
    }
    //==================================================
    const RibbonFuncModel = (ename, options) => {
        var is_closepanel = false;
        if (ename == "addtext") {
            var param = [
                "ABC",
                "tl",
                "2"
            ];
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'OpenText',param:param.join(",")},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ChangeIKMarkerStyle',param:parseFloat(ribbonData.elements.optionArea.ikmarkerSize)},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "addtext3d") {
            var param = [
                "ABC",
                "tl",
                "3"
            ];
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'OpenText',param:param.join(",")},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ChangeIKMarkerStyle',param:parseFloat(ribbonData.elements.optionArea.ikmarkerSize)},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "adduimage") {
            Sub_openfile("ui","IMAGES");
            is_closepanel = true;
        }else if (ename == "addcamera") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'CreateCameraObject',param:"0"},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ChangeIKMarkerStyle',param:parseFloat(ribbonData.elements.optionArea.ikmarkerSize)},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "addeffect") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'CreateSingleEffect'},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ChangeIKMarkerStyle',param:parseFloat(ribbonData.elements.optionArea.ikmarkerSize)},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "addspotlight") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'OpenSpotLight'},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ChangeIKMarkerStyle',param:parseFloat(ribbonData.elements.optionArea.ikmarkerSize)},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "addpointlight") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'OpenPointLight'},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ChangeIKMarkerStyle',param:parseFloat(ribbonData.elements.optionArea.ikmarkerSize)},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "addbasicshape") {
            var param = options.format;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'CreateBlankObject',param:param},
                "sendobjectinfo",QD_INOUT.returnJS,
                callback.sendObjectInfo,
                {callback}
            ));
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ChangeIKMarkerStyle',param:parseFloat(ribbonData.elements.optionArea.ikmarkerSize)},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "openvrm") {
            Sub_openfile("v","VRM");
            is_closepanel = true;
        }else if (ename == "openobject") {
            Sub_openfile("o","OBJECTS");
            is_closepanel = true;
        }else if (ename == "openimage") {
            Sub_openfile("img","IMAGES");
            is_closepanel = true;
        }else if (ename == "openimage_gdrive_direct") {
            appPrompt(t("msg1_open_gdrive"),(val) => {
                mainData.elements.loading = true;
                VFileHelper.openFromGoogleDrive(val, FILEEXTENSION_IMAGE.join(","))
                .then(file => {
                    if (file) {
                        file.encoding = "binary";
                        mainData.elements.loadingTypePercent = false;
                        modelLoader.OnChange_Common_AppFile(file,FILEOPTION["IMAGES"]);
                    }else{
                        appNotifyWarning("Load error of Google Drive...",{timeout:5000});
                    }
                    
                });
                is_closepanel = true;
            });
        }else if (ename == "openimage_gdrive") {
            mainData.elements.loading = true;
            mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.GOOGLEDRIVE;
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.IMAGES.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.IMAGES;
            mainData.elements.projectSelector.selectType = FILEOPTION.IMAGES.types;
            modelOperator.enumerateFilesToProjectSelector("IMAGES");
            mainData.elements.projectSelector.show = true;
            is_closepanel = true;
        }else if (ename == "openimage_appsample") {
            mainData.elements.loading = true;
            mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.APPLICATION;
            mainData.elements.projectSelector.selectTypeName = FILEOPTION.IMAGES.types[0].description;
            mainData.elements.projectSelector.selectDB = INTERNAL_FILE.IMAGES;
            mainData.elements.projectSelector.selectType = FILEOPTION.IMAGES.types;
            modelOperator.enumerateFilesToProjectSelector("IMAGES");
            mainData.elements.projectSelector.show = true;
            is_closepanel = true;
        }else if (ename == "vrminfo") {
            Sub_vrminfo();
            is_closepanel = true;
        }else if (ename == "savepose") {
            if (mainData.states.selectedAvatar == null) return;
            
            if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
                var msg = t("msg_pose_save_check1");
                appAlert(msg);
                is_closepanel = true;
                return;
            }

            appPrompt(t("msg_pose_sav"),(keyname)=>{
                AppQueue.add(new queueData(
                    {target:mainData.states.selectedAvatar.id,method:'BackupAvatarTransform',param:"vrm"},
                    "backupnowpose",QD_INOUT.returnJS,
                    callback.savepose,
                    {callback, filename: keyname, mode:"i"}
                ));
                AppQueue.start();
                is_closepanel = true;
            },"");
        }else if (ename == "savepose_direct") {
            if (mainData.states.selectedAvatar == null) return;
            
            if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
                var msg = t("msg_pose_save_check1");
                appAlert(msg);
                is_closepanel = true;
                return;
            }
            if (VFileHelper.checkNativeAPI) {
                AppQueue.add(new queueData(
                    {target:mainData.states.selectedAvatar.id,method:'BackupAvatarTransform',param:"vrm"},
                    "backupnowpose",QD_INOUT.returnJS,
                    callback.savepose,
                    {callback, filename: "posename", mode:"f"}
                ));
                AppQueue.start();
                is_closepanel = true;
            }else{
                appPrompt(t("msg_pose_sav"),(keyname)=>{
                    AppQueue.add(new queueData(
                        {target:mainData.states.selectedAvatar.id,method:'BackupAvatarTransform',param:"vrm"},
                        "backupnowpose",QD_INOUT.returnJS,
                        callback.savepose,
                        {callback, filename: keyname, mode:"f"}
                    ));
                    AppQueue.start();
                    is_closepanel = true;
                },"");
            }
            
        }else if (ename == "savepose_drive") {
            if (mainData.states.selectedAvatar == null) return;
            
            if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
                var msg = t("msg_pose_save_check1");
                appAlert(msg);
                is_closepanel = true;
                return;
            }

            appPrompt(t("msg_pose_sav"),(keyname)=>{
                AppQueue.add(new queueData(
                    {target:mainData.states.selectedAvatar.id,method:'BackupAvatarTransform',param:"vrm"},
                    "backupnowpose",QD_INOUT.returnJS,
                    callback.savepose,
                    {callback, filename: keyname, mode:"g"}
                ));
                AppQueue.start();
                is_closepanel = true;
            },"");
        }else if (ename == "poselist_pose") {
            if (ID("uimode").value == "mobile") {
                mainData.elements.posemotiondlg.mode = "p";
                mainData.elements.posemotiondlg.show = true;
            }else{
                if (mainData.appconf.confs.application.is_externalwin_pose) {
                    sessionStorage.setItem("UseDarkTheme",mainData.appconf.confs.application.UseDarkTheme ? "1" : "0");
            
                    if (mainData.elements.win_pose && !mainData.elements.win_pose.closed) {
                        //mainData.elements.win_pose.location.reload(true);
                    }else{
                        mainData.elements.win_pose = window.open("static/win/pose/index.html?mode=p","posewindow",
                            "width=780,height=700,alwaysRaised=yes,resizable=yes,autoHideMenuBar=true"
                        );
                    }
                    
                    if (VFileHelper.checkNativeAPI) { 
                        var title = mainData.elements.win_pose.document.title
                        window.elecAPI.focusWindow(title);
                    }else{
                        mainData.elements.win_pose.blur();
                        window.focus();
                        window.blur();
                        mainData.elements.win_pose.focus();
                    }
                    is_closepanel = true;
                }else{
                    mainData.elements.posemotiondlg.mode = "p";
                    mainData.elements.posemotiondlg.show = true;
                }
                
            }
            
            
        }else if (ename == "resetposition") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ResetParentHandlePosition'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "resetrotate") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ResetParentHandleRotation'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "modelremove") {
            appConfirm(t("msg_vrm_delconfirm"),() => {
                modelOperator.removeBodyObject(mainData.states.selectedAvatar);
                AppQueue.start();
                is_closepanel = true;
            });
        }else if (ename == "resetallbone") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.OperateActiveVRM,method:'ResetAllHandle'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "mediapipe") {
            if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
                appAlert(t("msg_error_mediapipe1"));
                return;
            }
            appConfirm(t("msg_start_mediapipe"),() => {
                
                if (mainData.elements.win_mediapipe && !mainData.elements.win_mediapipe.closed) {

                }else{
                    mainData.elements.win_mediapipe = window.open("./static/win/mp/index.html",
                        "_blank",
                        "width=1280,height=720,alwaysRaised=yes,resizable=yes,autoHideMenuBar=true"
                    );
                }
                
                
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

                if (VFileHelper.checkNativeAPI) { 
                    var title = mainData.elements.win_mediapipe.document.title
                    window.elecAPI.focusWindow(title);
                }else{
                    mainData.elements.win_mediapipe.blur();
                    window.focus();
                    window.blur();
                    mainData.elements.win_mediapipe.focus();
                }
                is_closepanel = true;
            });

        }else if (ename == "poselist_motion") {
            if (ID("uimode").value == "mobile") {
                mainData.elements.posemotiondlg.mode = "m";
                mainData.elements.posemotiondlg.show = true;
            }else{
                if (mainData.appconf.confs.application.is_externalwin_pose) {
                    sessionStorage.setItem("UseDarkTheme",mainData.appconf.confs.application.UseDarkTheme ? "1" : "0");
                
                    if (mainData.elements.win_pose && !mainData.elements.win_pose.closed) {
                        //mainData.elements.win_pose.location.reload(true);
                    }else{
                        mainData.elements.win_pose = window.open("static/win/pose/index.html?mode=m","posewindow",
                            "width=780,height=700,alwaysRaised=yes,resizable=yes,autoHideMenuBar=true"
                        );
                    }
                    
                    if (VFileHelper.checkNativeAPI) { 
                        var title = mainData.elements.win_pose.document.title
                        window.elecAPI.focusWindow(title);
                    }else{
                        mainData.elements.win_pose.blur();
                        window.focus();
                        window.blur();
                        mainData.elements.win_pose.focus();
                    }
                    is_closepanel = true;
                }else{
                    mainData.elements.posemotiondlg.mode = "m";
                    mainData.elements.posemotiondlg.show = true;
                }
            }
        }else if (ename == "openmotion") {
            if (options.type == "f") {
                Sub_openfile("mot","MOTION");
            }else if (options.type == "i") {
                mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.INTERNAL;
                mainData.elements.projectSelector.selectTypeName = FILEOPTION.MOTION.types[0].description;
                mainData.elements.projectSelector.selectDB = INTERNAL_FILE.MOTION;
                mainData.elements.projectSelector.selectType = FILEOPTION.MOTION.types;
                modelOperator.enumerateFilesToProjectSelector("MOTION");
                
                mainData.elements.projectSelector.show = true;
            }else if (options.type == "g") {
                mainData.elements.loading = true;
                mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.GOOGLEDRIVE;
                mainData.elements.projectSelector.selectTypeName = FILEOPTION.MOTION.types[0].description;
                mainData.elements.projectSelector.selectDB = INTERNAL_FILE.MOTION;
                mainData.elements.projectSelector.selectType = FILEOPTION.MOTION.types;
                modelOperator.enumerateFilesToProjectSelector("MOTION");
                mainData.elements.projectSelector.show = true;
            }
            is_closepanel = true;
        }else if (ename == "savemotion") {
            var tmpcast = modelOperator.getRole(mainData.states.selectedCast.roleName,"role");
            var param = tmpcast.roleName + "," + tmpcast.type;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SaveSingleMotion', param:param},
                "savemotion",QD_INOUT.returnJS,
                callback.savemotion,
                {callback, disktype : options.type, savetype : "overwrite"}
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "savemotion_anim") {
            if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
                appAlert(t("msg_error_mediapipe1"));
                return;
            }
            var tmpcast = mainData.states.selectedCast;
            var param = tmpcast.roleName + "," + tmpcast.type + ",m";
            //AppQueue.unity.ManageAnimation
            AppQueue.add(new queueData(
                {target:tmpcast.avatar.id,method:'GenerateAnimationCurve'},
                "savebvhmotion",QD_INOUT.returnJS,
                callback.saveanimmotion,
                {callback: callback, selRoleTitle: tmpcast.roleTitle}
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "savemotion_bvh") {
            if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
                appAlert(t("msg_error_mediapipe1"));
                return;
            }
            var tmpcast = mainData.states.selectedCast;
    
            var param = tmpcast.roleName + "," + tmpcast.type + ",m";
            //AppQueue.unity.ManageAnimation
            AppQueue.add(new queueData(
                {target:tmpcast.avatar.id,method:'ExportRecordedBVH'},
                "savebvhmotion",QD_INOUT.returnJS,
                callback.savebvhmotion,
                {callback: callback, selRoleTitle: tmpcast.roleTitle}
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "savevrma") {
            if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
                appAlert(t("msg_error_mediapipe1"));
                return;
            }
            var tmpcast = mainData.states.selectedCast;
            appPrompt(t("msg_input_motionname"),(motionname) => {                
                var param = tmpcast.roleName + "," + tmpcast.type + ",m";
                var svtype = "as";
                if (ename == "savevrma") {
                    svtype = "overwrite";
                }
                //AppQueue.unity.ManageAnimation
                AppQueue.add(new queueData(
                    {target:tmpcast.avatar.id,method:'ExportVRMA',param:motionname},
                    "savebvhmotion",QD_INOUT.returnJS,
                    callback.savevrmamotion,
                    {callback: callback, disktype : options.type, savetype : svtype, selRoleTitle: tmpcast.roleTitle}
                ));
                AppQueue.start();
                is_closepanel = true;
            });
        }else if (ename == "openvrma")  {
            if (options.type == "f") {
                Sub_openfile("vrma","VRMA", 0);
            }else if (options.type == "i") {
                mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.INTERNAL;
                mainData.elements.projectSelector.selectTypeName = FILEOPTION.VRMA.types[0].description;
                mainData.elements.projectSelector.selectDB = INTERNAL_FILE.VRMA;
                mainData.elements.projectSelector.selectType = FILEOPTION.MOTION.types;
                modelOperator.enumerateFilesToProjectSelector("VRMA");
                
                mainData.elements.projectSelector.show = true;
                
            }else if (options.type == "g") {
                mainData.elements.loading = true;
                mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.GOOGLEDRIVE;
                mainData.elements.projectSelector.selectTypeName = FILEOPTION.VRMA.types[0].description;
                mainData.elements.projectSelector.selectDB = INTERNAL_FILE.VRMA;
                mainData.elements.projectSelector.selectType = FILEOPTION.MOTION.types;
                modelOperator.enumerateFilesToProjectSelector("VRMA");
                mainData.elements.projectSelector.show = true;
            }
            is_closepanel = true;
        }else if (ename == "connect_vroidhub") {
            mainData.vroidhubapi.generateAuthLink();
            is_closepanel = true;
        }else if (ename == "list_vroidhub") {
            mainData.vroidhubapi.list_character_models({})
            .then(res => {
                console.log(res);
                is_closepanel = true;
            })
        }
        if (is_closepanel) close_tabpanel();
    }
    //==================================================
    const RibbonFuncAnimation = (ename, options) => {
        var is_closepanel = false;
        if (ename == "newproject") {
            appConfirm(t("msg_project_new"),() => {
                //---remove all timeline 

                //---reset and re-create project
                modelOperator.newProject();
                AppQueue.start();

                modelLoader.setupDefaultObject();
                modelOperator.destroy_materialFile(true);
                is_closepanel = true;
            });
        }else if (ename == "openproject") {
            if (options.type == "f") {
                Sub_openfile("ap","PROJECT");
            }else if (options.type == "i") {
                mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.INTERNAL;
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
            }else if (options.type == "g") {
                mainData.elements.loading = true;
                mainData.elements.projectSelector.selectStorageType = STORAGE_TYPE.GOOGLEDRIVE;
                mainData.elements.projectSelector.selectTypeName = FILEOPTION.PROJECT.types[0].description;
                mainData.elements.projectSelector.selectDB = INTERNAL_FILE.PROJECT;
                mainData.elements.projectSelector.selectType = FILEOPTION.PROJECT.types;
                modelOperator.enumerateFilesToProjectSelector("PROJECT");
                mainData.elements.projectSelector.show = true;
            }
            is_closepanel = true;
        }else if (ename == "saveproject") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SaveProject'},
                "saveproject",QD_INOUT.returnJS,
                callback.saveproject,
                {callback, disktype : options.type, savetype : "overwrite"}
            ));
            AppQueue.start();
            is_closepanel = true;
        }else if (ename == "saveasproject") {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SaveProject'},
                "saveproject",QD_INOUT.returnJS,
                callback.saveproject,
                {callback, disktype : options.type, savetype : "as"}
            ));
            AppQueue.start();
            is_closepanel = true;
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
            is_closepanel = true;
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
            is_closepanel = true;
        }else if (ename == "playnormal") {
            Sub_playframecommon();
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'PauseAllTimeline'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            mainData.states.animationPlaying = !mainData.states.animationPlaying;
            is_closepanel = true;
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
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'FinishPreviewMarker'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'FinishPreviewMarker2'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            mainData.states.animationPlaying = false;
            is_closepanel = true;
        }else if (ename == "setbaseduration") {
            var param = parseFloat(options.value);
            if (isNaN(param)) return;
            
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetBaseDuration', param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            is_closepanel = true;
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
            mainData.states.currentEditOperationCount++;
            
        }else if (ename == "addkeyframe") {
            //modelOperator.addKeyFrame(mainData.states.selectedAvatar, ribbonData.elements.frame.bonelist.selection, ribbonData.elements.frame.keylist.selection, "append");
        }else if (ename == "openkeyframedlg") {
            if (mainData.appconf.confs.animation.save_previous_value_in_keyframeregister !== true) {
                ribbonData.elements.frame.keylist.duration = 0;
                ribbonData.elements.frame.keylist.easing.selected = ribbonData.elements.frame.keylist.easing.options[0];
            }
            ribbonData.elements.frame.showdlg = true;
            is_closepanel = true;
        }else if (ename == "overwritekeyframe") {
            modelOperator.addKeyFrame(mainData.states.selectedAvatar, ribbonData.elements.frame.bonelist.selection, ribbonData.elements.frame.keylist.selection, "overwrite");
            is_closepanel = true;
        }else if (ename == "bone_select_alloff") {
            ribbonData.elements.frame.bonelist.selection.splice(0, ribbonData.elements.frame.bonelist.selection.length);
            is_closepanel = true;
        }else if (ename == "bone_select_all") {
            for (var i = IKBoneType.IKParent; i < IKBoneType.LeftHandPose; i++) {
                modelOperator.selectSpecifyBoneForRegister(i);
            }
            is_closepanel = true;
        }else if (ename == "bone_select_ikparent") {
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.IKParent);
        }else if (ename == "bone_select_body") {
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.EyeViewHandle);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.Head);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.LookAt);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.Chest);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.Aim);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.LeftShoulder);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.RightShoulder);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.LeftLowerArm);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.RightLowerArm);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.LeftHand);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.RightHand);
        }else if (ename == "bone_select_hips") {
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.Pelvis);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.LeftLowerLeg);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.RightLowerLeg);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.LeftLeg);
            modelOperator.selectSpecifyBoneForRegister(IKBoneType.RightLeg);
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
                roleName : mainData.states.selectedCast.roleName,
                roleType : mainData.states.selectedCast.type
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
                roleName : mainData.states.selectedCast.roleName,
                roleType : mainData.states.selectedCast.type
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
            /*  ---NOT USE
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
                {target:AppQueue.unity.ManageAnimation,method:'RegisterFrameFromOuter',param:JSON.stringify(aro)},
                "registernowpose",QD_INOUT.returnJS,
                callback.registernowpose,
                {callback}
            ));
            AppQueue.start();
            */
        }else if (ename == "delkeyframe") {
            appConfirm(t("msg_delframe_currentkey"),()=>{
                modelOperator.removeKeyframe(mainData.states.selectedAvatar, timelineData.states.currentcursor);
                is_closepanel = true;
            });
        }else if (ename == "delpropkeyframe") {
            appConfirm(t("msg_delframe_currentkey_prop"),()=>{
                modelOperator.removeKeyframe(mainData.states.selectedAvatar, timelineData.states.currentcursor, AF_MOVETYPE.AllProperties);
                is_closepanel = true;
            });
        }else if (ename == "delvrmakeyframe") {
            appConfirm(t("msg_delframe_currentkey_vrma"),()=>{
                AppQueue.add(new queueData(
                    {target:mainData.states.selectedAvatar,method:'ClearKeyFrameVRMA'},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
                Quasar.Notify.create({
                    message : t("msg_after_delframe_currentkey_vrma"), 
                    position : "top-right",
                    color : "info",
                    textColor : "black",
                    timeout : 1500, 
                    multiLine : true
                });
                is_closepanel = true;
            });
        }else if (ename == "delemptyline") {
        }
        if (is_closepanel) close_tabpanel();
    }
    //==================================================
    const RibbonFuncSystemEffect = (ename, options) => {
        var is_closepanel = false;
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
                {target:AppQueue.unity.ManageAnimation,method:'RegisterFrameFromOuter',param:JSON.stringify(aro)},
                "registernowpose",QD_INOUT.returnJS,
                callback.registernowpose,
                {callback, selectedTimeline: tl}
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
        }else if (ename == "depthov_focusdistance") {
            var param = "focusdistance," + ribbonData.elements.syseff.depthov.focusdistance;
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
        }else if (ename == "vignette_smoothness") {
            var param = "smoothness," + ribbonData.elements.syseff.vignette.smoothness;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'VignetteSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "vignette_roundness") {
            var param = "roundness," + ribbonData.elements.syseff.vignette.roundness;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'VignetteSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "vignette_center") {
            var param = "center," + 
                ribbonData.elements.syseff.vignette.center.x + "," + 
                ribbonData.elements.syseff.vignette.center.y;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageSystemEffect,method:'VignetteSetting',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }else if (ename == "vignette_color") {
            var param = "color," + ribbonData.elements.syseff.vignette.color;
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
        if (is_closepanel) close_tabpanel();
    }
    //==================================================
    const RibbonFuncAudio = (ename, options) => {
        var is_closepanel = false;
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
                {target:AppQueue.unity.ManageAnimation,method:'RegisterFrameFromOuter',param:JSON.stringify(aro)},
                "registernowpose",QD_INOUT.returnJS,
                callback.registernowpose,
                {callback: callback, selectedTimeline: tl}
            ));
            AppQueue.start();
            is_closepanel = true;
            
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
            is_closepanel = true;
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
                is_closepanel = true;
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
            is_closepanel = true;
        }else if (ename == "audiostop") {
            AppQueue.add(new queueData(
                {target:unityTarget,method:'StopAudio'},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            audioobj.playbtn_state = "play_circle";
            is_closepanel = true;
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
        close_tabpanel();
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
    const wa_tabSelectedIndex = Vue.watch(() => ribbonData.elements.tab.selectIndex, (newval,oldval) => {
        if (newval == "effect") {

        }else if (newval == "audio") {

        }else{
            
        }
        /*if (!ribbonData.elements.tab.check_show) {
            if (newval == oldval) {
                close_tabpanel();
            }else{
                ribbonData.elements.tabpanel.style.display = "block";
            }
            
        }*/
        
        //ribbonData.elements.tab.oldselectIndex = newval;
    });
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
    const getCurrentModeSize = (w, h) => {
        var tab = parseInt(ribbonData.elements.tab.style.height);
        var tabpanel = parseInt(ribbonData.elements.tabpanel.style.height);
        var ret = tab;
        if (ribbonData.elements.tab.check_show) {
            ret += tabpanel;
        }
        return ret;
    }
    const setupMobileSize = (w, h) => {
        if ((Quasar.Screen.name == "sm") ||
            (Quasar.Screen.name == "xs")
        ){
            ribbonData.elements.tab.check_show = false;
            check_show_changed(ribbonData.elements.tab.check_show);
        }
    }
    const close_tabpanel = () => {
        if (!ribbonData.elements.tab.check_show) {
            ribbonData.elements.tabpanel.style.display = "none";
        }
    }
    
    //===============================================================
    //  Trigger events
    //===============================================================
    const language_box_changed = (val) => {
        locale.value = val;
        localStorage.setItem("appLocale",val);
        //AppDB.app.setItem("appLocale",val);
    }
    const check_show_changed = (val) => {
        var h = parseInt(mainData.elements.canvas.scrollArea.height);
        if (val === true) {
            ribbonData.elements.tabpanel.style.display = "block";
            ribbonData.elements.tabpanel.style.position = "relative";
            mainData.elements.canvas.scrollArea.height = (h - 128) + "px";
            ribbonData.elements.tab.toggleIcon = "check_box";
        }else{
            ribbonData.elements.tabpanel.style.display = "none";
            ribbonData.elements.tabpanel.style.position = "fixed";
            mainData.elements.canvas.scrollArea.height = (h + 128) + "px";
            ribbonData.elements.tab.toggleIcon = "check_box_outline_blank";
        }
        
    }
    const btn_check_show_changed = () => {
        ribbonData.elements.tab.check_show = !ribbonData.elements.tab.check_show;
        check_show_changed(ribbonData.elements.tab.check_show);
    }
    const tabbar_onclick = () => {
        if (!ribbonData.elements.tab.check_show) {
            
            if (ribbonData.elements.tabpanel.style.display == "none") {
                ribbonData.elements.tabpanel.style.display = "block";
            }else{
                if (ribbonData.elements.tab.oldselectIndex == ribbonData.elements.tab.selectIndex) {
                    ribbonData.elements.tabpanel.style.display = "none";
                }
            }
            
            
        }
        ribbonData.elements.tab.oldselectIndex = ribbonData.elements.tab.selectIndex;
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
    const openmotion_file_onclick = (evt) => {
        RibbonFuncModel('openmotion',{
            type : "f"
        });
    }
    const openmotion_internal_onclick = (evt) => {
        RibbonFuncModel('openmotion',{
            type : "i"
        });
    }
    const openmotion_gdrive_onclick = (evt) => {
        RibbonFuncModel('openmotion',{
            type : "g"
        });
    }
    const savemotion_file_onclick = (evt) => {
        RibbonFuncModel('savemotion',{
            type : "f"
        });
    }
    const savemotion_internal_onclick = (evt) => {
        RibbonFuncModel('savemotion',{
            type : "i"
        });
    }
    const savemotion_gdrive_onclick = (evt) => {
        RibbonFuncModel('savemotion',{
            type : "g"
        });
    }
    const openvrma_file_onclick = (evt) => {
        RibbonFuncModel('openvrma',{
            type : "f"
        });
    }
    const openvrma_internal_onclick = (evt) => {
        RibbonFuncModel('openvrma',{
            type : "i"
        });
    }
    const openvrma_gdrive_onclick = (evt) => {
        RibbonFuncModel('openvrma',{
            type : "g"
        });
    }
    const savevrma_onclick = (disktype, savetype) => {
        RibbonFuncModel(savetype,{
            type : disktype,

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
    const openproject_gdrive_onclick = (evt) => {
        RibbonFuncAnimation('openproject',{
            type : "g"
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
    const saveproject_gdrive_onclick = (evt) => {
        RibbonFuncAnimation('saveproject',{
            type : "g"
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
    const saveasproject_gdrive_onclick = (evt) => {
        RibbonFuncAnimation('saveasproject',{
            type : "g"
        });
    }

    const setmaxframe_onchange = (evt) => {
        RibbonFuncAnimation("setmaxframe",{
            value: ribbonData.elements.frame.max
        });
    }
    const setbaseduration_onchange = (evt) => {
        RibbonFuncAnimation("setbaseduration",{
            value: mainData.elements.projdlg.pinfo.baseDuration //ribbonData.elements.frame.baseDuration
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
    const depthov_focusdistance_onchange = (value, evt) => {
        RibbonFuncSystemEffect("depthov_focusdistance",{
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
    const vignette_smooth_onchange = (value, evt) => {
        RibbonFuncSystemEffect("vignette_smoothness",{
            value:value
        });
    }
    const vignette_round_onchange = (value, evt) => {
        RibbonFuncSystemEffect("vignette_roundness",{
            value:value
        });
    }
    const vignette_center_onchange = (value, evt) => {
        RibbonFuncSystemEffect("vignette_center",{
            value: ribbonData.elements.syseff.vignette.center
        });
    }
    const vignette_color_onchange = (value, evt) => {
        RibbonFuncSystemEffect("vignette_color",{
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
    //--Context menu-----------------------------------
    const menu_addkeyframe_onclick = () => {
        if (ribbonData.elements.frame.showtarget == "object")  {
            RibbonFuncAnimation("overwritekeyframe");
        }else{
            if (ribbonData.elements.tab.selectIndex == "effect") {
                RibbonFuncSystemEffect("addkeyframe");
            }else if (ribbonData.elements.tab.selectIndex == "audio") { 
                RibbonFuncAudio("addkeyframe");
            }else{
                RibbonFuncAnimation("overwritekeyframe");
            }
        }
        
    }
    const menu_keyframe_onchange = (val) => {
        if (val === false) {
            ribbonData.elements.frame.showtarget = "";
        }else{
            if (mainData.appconf.confs.animation.save_previous_value_in_keyframeregister !== true) {
                ribbonData.elements.frame.keylist.duration = 0;
                ribbonData.elements.frame.keylist.easing.selected = ribbonData.elements.frame.keylist.easing.options[0];
            }
        }
    }

    Vue.onMounted(() => {
        changeStateLnkdownload("initial");
    });
    return Vue.reactive({
        RibbonFuncHome, RibbonFuncScreen, RibbonFuncModel, RibbonFuncAnimation,RibbonFuncSystemEffect, RibbonFuncAudio,

        //---computed
        chk_enableClipboardButton, chk_enableKeyframeButton,chk_enablePasteButton,
        chkAppIsOSApp,chkTabSelectEffectORAudio,

        //---watches
        wa_tabSelectedIndex,
        //wa_langbox_selected,
        wa_lnkdownload_onoff,
        changeStateLnkdownload,
        getCurrentModeSize,setupMobileSize,
        
        //---trigger events
        language_box_changed,check_show_changed,tabbar_onclick,
        btn_check_show_changed,
        applyScreen_onclick,originalSize_onclick,downloadVideo_onclick,getCapture_onclick,
        rotate360_onchange,rotateSpeed_onchange,useAntialias_onchange,showIKMarker_onchange,
        ikmarkerSize_onchange,
        menu_addkeyframe_onclick,menu_keyframe_onchange,

        basicshape_onclick,
        
        openproject_file_onclick,openproject_internal_onclick,openproject_gdrive_onclick,
        saveproject_file_onclick,saveproject_internal_onclick,saveproject_gdrive_onclick,
        saveasproject_file_onclick,saveasproject_internal_onclick,saveasproject_gdrive_onclick,
        setmaxframe_onchange,setbaseduration_onchange,setloop_onchange,setcurrentframe_onchange,
        openmotion_file_onclick,openmotion_internal_onclick,openmotion_gdrive_onclick,
        savemotion_file_onclick,savemotion_internal_onclick, savemotion_gdrive_onclick,
        openvrma_file_onclick,openvrma_internal_onclick,openvrma_gdrive_onclick,savevrma_onclick,

        bloom_checked_onchange, bloom_intensity_onchange,
        chroma_checked_onchange, chroma_intensity_onchange, 
        colorgrd_checked_onchange, colorgrd_filter_onchange, colorgrd_temperature_onchange, colorgrd_tint_onchange,
        depthov_checked_onchange, depthov_aperture_onchange, depthov_focallength_onchange, depthov_focusdistance_onchange,
        grain_checked_onchange, grain_intensity_onchange, grain_size_onchange,
        vignette_checked_onchange, vignette_intensity_onchange, vignette_smooth_onchange, vignette_round_onchange, vignette_center_onchange, vignette_color_onchange,
        moblur_checked_onchange, moblur_shutterangle_onchange, moblur_samplecount_onchange,
        
        operationtype_onchange,
        bgmselect_onchange, bgmplayflag_onchange, bgmseek_onchange, bgmloop_onchange, bgmvol_onchange, bgmpitch_onchange,
            
        chkbgmenable, chkseenable,
        chkEnableVRAR
    })
}
