import { defineSetupLang } from "./setuplang.js";
//---Inlucde element
import { defineUcolorPicker } from "./ucolorpicker.js";
import { defineAppInfoDlg } from "./appinfodlg.js";
import { defineVrmInfoDlg } from "./vrminfodlg.js";
import { defineRibbonTab } from "./ribbontab.js";
import { defineObjlist } from "./objlist.js";
import { defineUnityCanvas } from "./unitycanvas.js";
import { defineTimeline } from "./timeline.js";
import { defineBonetranDlg } from "./bonetrans.js";
import { defineGravityboneDlg } from "./gravitybone.js";
import { defineConfigDlg } from "./configdlg.js";
import { defineVpadDlg } from "./vpad.js";
import { defineKeyframeDlg } from "./keyframedlg.js";
import { defineProjectSelector } from "./projselector.js";
//---Include data
import { defineAppMainData } from "./prop/appmaindata.js";
import { defineAppRibbonData } from "./prop/appribbondata.js";
import { defineAppObjlistData } from "./prop/appobjlistdata.js";
import { defineAppObjlistProp } from "./prop/appobjpropdata.js";
import { defineAppTimelineData } from "./prop/apptimelinedata.js";
//---Include functions
import { defineModelLoader } from "./model/loader.js";
import { defineModelOperator } from "./model/operator.js";
import { defineUnityCallback } from "./model/callback.js";
import { defineObjprop } from "./objprop.js";
import { defineProjectDialog } from "./projdlg.js";

import messages from "../locales";
import { defineChildManager } from "./model/childman.js";
import { defineMaterialPropertyUI } from "./prop/cls_matprop.js";
import { defineNavigationDlg } from "./navwin.js";
import { defineVroidhubSelector, VRoidHubConnector } from "./model/vroidhub.js";
import { defineMobileOperator } from "./model/mblope.js";
import { defineUswipeInput } from "../uswipeinput.js";
import { definePoseMotionDlg } from "./posedlg.js";
import { defineCaptureDlg } from "./capturedlg.js";
import { defineTearchManagerDlg } from "./teachman.js";
import { defineEasyBoneTranDlg } from "./easybonetran.js";
import { defineTransformRefDlg } from "./transformrefdlg.js";

var loc = localStorage.getItem("appLocale");
//loc = await AppDB.app.getItem("appLocale");

if (!loc) loc = "en-US";



const app = Vue.createApp({
    
    setup() {
        /*const I18 = VueI18n.useI18n();
        */
        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        //---Data
        const { 
            mainData,
            //---ref for html
            fil_animproject,file_audio,fil_animmotion,hid_file,aud01_capture
        } = defineAppMainData();
        const { ribbonData,
            //---ref for html
            lnk_recdownload,lnk_saveproject
        } = defineAppRibbonData();
        const { objlistData } = defineAppObjlistData(mainData);
        const { objpropData } = defineAppObjlistProp();
        const { 
            timelineData,
            //---ref for html
            scroll_header_x,scroll_namebox_y,scroll_keyframe_xy,grid_scrollx,grid_scrolly 
        } = defineAppTimelineData();
        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        //---Method, Properties
        const { 
            unitycontainer,unityConfig, 
            setupUnity, setupRecordingConfig, setupFixUnityEvent, setupDefaultObject, 
            CanvasPointerEnter, CanvasPointerLeave
        } = defineUnityCanvas(app, Quasar, mainData, ribbonData, objlistData, objpropData, timelineData, {
            lnk_recdownload,
        });
        const { UnityCallback } = defineUnityCallback(mainData, ribbonData,objlistData,objpropData,timelineData, unityConfig.value,{
            lnk_saveproject
        });
        const { modelOperator,wa_selectedAvatar,wa_percentCurrent,cmp_percentLoad } = defineModelOperator(mainData,ribbonData,objlistData.value,objpropData,timelineData,UnityCallback,{
            unitycontainer
        });
        const { modelLoader, dnd } = defineModelLoader(app, Quasar, mainData, timelineData, modelOperator, UnityCallback, {
            fil_animproject,file_audio,fil_animmotion,hid_file,lnk_saveproject,lnk_recdownload
        },{ setupRecordingConfig });
        const { childman } = defineChildManager(modelOperator, mainData, UnityCallback);
        //===set up the other referrence

        UnityCallback.modelOperator = modelOperator;
        UnityCallback.modelLoader = modelLoader;
        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        //---Events
        /*
        const hidfile_onchange = (evt) => {
            //console.log(evt.target.files);
            modelLoader.OnChange_AppFile(evt.target.files);
        }*/

        const ribbonEvent = defineRibbonTab(app, Quasar, mainData, ribbonData, timelineData, modelLoader, modelOperator, UnityCallback, {
            fil_animproject,file_audio,fil_animmotion,hid_file,aud01_capture,unitycontainer,lnk_recdownload
        });
        const {objlistEvent, leftdrawer} = defineObjlist(app, Quasar, mainData, objlistData,modelOperator);
        const {objpropEvent, rightdrawer} = defineObjprop(app, Quasar, mainData, objpropData,UnityCallback,modelOperator);
        const { timelineEvent } = defineTimeline(app, Quasar, mainData, ribbonData, timelineData, UnityCallback, modelOperator, {
            scroll_header_x,scroll_namebox_y,scroll_keyframe_xy,grid_scrollx,grid_scrolly
        });
        const {projectdlgEvent, fil_animation, lnk_savemotion} = defineProjectDialog(app, Quasar, mainData, timelineData, modelOperator,UnityCallback);
        const { projectSelectorEvent,fil_projselector,cmp_projectSelectorStorageGDrive } = defineProjectSelector(app, Quasar, mainData, modelLoader, modelOperator, UnityCallback, {
            lnk_saveproject
        });
        const {mobilePadEvent } = defineMobileOperator(app, Quasar, mainData, ribbonData, timelineData, modelLoader, modelOperator, UnityCallback);

        const { 
            mat_realtoon,UIMaterials
        } = defineMaterialPropertyUI(app, Quasar, objpropData, objpropEvent);

        const {vroidhubSelectorEvent,vroidhubAuthorizerEvent} = defineVroidhubSelector(app, Quasar, mainData, ribbonData, modelLoader, modelOperator, UnityCallback);

        //===set up the other referrence
        UnityCallback.timelineEvent = timelineEvent;
        UnityCallback.refs["lnk_savemotion"] = lnk_savemotion;

        Vue.provide("UNITYCONFIG",unityConfig.value);
        Vue.provide("UNITYCALLBACK",UnityCallback);

        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        //---Life cycle
        const calcUnitySize = (w, h) => {
            objlistEvent.setupMobileSize(w, h);
            objpropEvent.setupMobileSize(w, h);
            ribbonEvent.setupMobileSize(w, h);
            timelineEvent.setupMobileSize(w, h);
            var left = objlistEvent.getCurrentModeSize(w, h);
            var right = objpropEvent.getCurrentModeSize(w, h);
            var tab = ribbonEvent.getCurrentModeSize(w, h);
            var tl = timelineEvent.getCurrentModeSize(w, h);
            if (ID("uimode").value == "mobile") {
                left = 0;
                right = 0;
            }
            mainData.elements.canvas.scrollArea.width = `${w - left - right}px`;
            mainData.elements.canvas.scrollArea.height = `${h - tab - tl}px`;
            //modelOperator.setScreenSize(w - left - right, h - tab - tl, false);

            if ((Quasar.Screen.name == "sm") ||
                (Quasar.Screen.name == "xs")
            ){
                mainData.elements.projdlg.fullwidth = true;
                mainData.elements.projdlg.fullheight = true;
                mainData.elements.projectSelector.fullwidth = true;
                mainData.elements.projectSelector.fullheight = true;
            }
        }
        const judgeDeviceResolution = () => {
            /**
             *  Quasar.Screen.name
             *  xs:
             *     width < height   = smartphone
             *     width*2 < height = smartphone
             *  sm:
             * 
             */
        }
        const judgeDeviceLandscape = Vue.computed(() => {
            if (Quasar.Screen.width > Quasar.Screen.height) {
                return true;
            }else{
                return false;
            }
        });
        Vue.onBeforeMount(() => {
            mainData.appconf.load()
            .then(res => {
                mainData.appconf.applyUnity(false);

                if (mainData.appconf.confs.application.use_gamepad === true) { 
                    if (mainData.appconf.confs.application.gamepad_using_html === true) {
                        mainData.states.inputman.enabled = true;
                    }else{
                        mainData.states.inputman.enabled = false;    
                    }
                }else{
                    mainData.states.inputman.enabled = false;
                }
            });

            ribbonData.elements.language_box.selected = loc;

            if ((mainData.appconf.confs.fileloader.gdrive.enabled === true) && (mainData.appconf.confs.fileloader.gdrive.url != "")) {
                mainData.states.googledrive_gas = true;
            }else{
                mainData.states.googledrive_gas = false;
            }
        });
        Vue.onMounted( async () => {
            const HasUnityCash = await modelLoader.checkCacheStorageUnity();
            if (HasUnityCash === true) {
                mainData.elements.loadmsg = "Now loading...";
            }else{
                mainData.elements.loadmsg = "First access. Now installing the WebApp...";
            }
            var vrhres = await mainData.vroidhubapi.load();
            mainData.states.vroidhub_api = vrhres;
            
            var ishit = Quasar.LocalStorage.getItem("callback_code");
            if (ishit) {
                var resjs = JSON.parse(ishit);
                if (resjs["code"]) {
                    var vrhreqres = await mainData.vroidhubapi.request_token(resjs.code)
                    Quasar.LocalStorage.remove("callback_code");
                    mainData.states.vroidhub_api = true;
                }
            }
            const res = await setupUnity();
            
            modelLoader.checkSWUpdate();
            setupFixUnityEvent(modelOperator,UnityCallback);
            Vue.nextTick(async () => {
                //---firstly set config to Unity, after each initial set up
                const confres = mainData.appconf.load();
                
                mainData.states.uimode = ID("uimode").value;

                mainData.appconf.applyUnity(false);
                //---test: moving to firstLoad_effectDirectory
                modelOperator.newProject(false);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'SetBaseDuration',param:parseFloat(mainData.appconf.confs.animation.base_duration)},
                    "",QD_INOUT.toUNITY,
                    null
                ));

                modelLoader.setupDefaultObject();

                calcUnitySize(Quasar.Screen.width, Quasar.Screen.height);
                if (Quasar.Screen.width >= Quasar.Screen.height) {
                    mainData.elements.initialOrientation = "landscape";
                }else{
                    mainData.elements.initialOrientation = "portrait";
                }
                
                //mainData.elements.canvas.scrollArea.width = `${Quasar.Screen.width - 300 - 225}px`;
                //mainData.elements.canvas.scrollArea.height = `${Quasar.Screen.height - 128 - 36 - 200}px`;
                ribbonData.elements.scr_size.width = unitycontainer.value.width; 
                ribbonData.elements.scr_size.height = unitycontainer.value.height;

                //---additional settings
                modelOperator.setDarkMode(mainData.appconf.confs.application.UseDarkTheme);
                
                //AppQueue.start();
                
                //---1st: load app material
                await modelOperator.load_materialFile(true)
                
                
                
                ID("splash").classList.add("fadeout");
                modelLoader.downloadAddressableAssetBundles();
                //modelLoader.onload_effectDirectory();


                AppQueue.start();
                mainData.states.currentEditOperationCount = 0;
                mainData.states.backupEditOperationCount = 0;
        
                modelLoader.schedulingBackup();
                
                //---load easy-ui data
                modelOperator.loadDefaultDataForEasyUI();

                
            });

            /**
             * Trigger event of Global to Vue. send-receive message.
             */
            window.addEventListener("message",(evt)=> {
                //console.log(evt);
                if (evt.origin != location.origin) return;

                if (evt.data && evt.data.isvvm) {
                    //console.log(evt.data);
                    //modelOperator.filteringFromChildWindow(evt.data);
                    childman.filteringFromChildWindow(evt.data);
                }
                
            });
            window.addEventListener("resize",(evt) => {
                if (mainData.states.turnOrientation) {
                    mainData.states.turnOrientation = false;
                    //return;
                }
                var w = evt.currentTarget;
                console.log(Quasar.Screen);
                Vue.nextTick(async () => {
                    calcUnitySize(w.innerWidth, w.innerHeight);
                });
            });
            window.addEventListener("orientationchange",(evt)=> {
                var w = evt.currentTarget;
                console.log(Quasar.Screen);
                console.log(screen);
                /*alert(screen.orientation.type+"\n"+
                    screen.availWidth + "\n" + 
                    screen.availHeight
                );*/
                if (ID("uimode").value == "mobile") {
                    //---after xs(portrait), off mini-mode
                    objpropData.elements.drawer.show = false;
                    objlistData.elements.drawer.show = false;
                    objpropData.elements.drawer.miniState = true;
                    objlistData.elements.drawer.miniState = true;
                }else{
                    objpropData.elements.drawer.show = true;
                    objlistData.elements.drawer.show = true;
                    objpropData.elements.drawer.miniState = true;
                    objlistData.elements.drawer.miniState = true;
                }
                //Vue.nextTick(async () => {
                    calcUnitySize(w.innerWidth, w.innerHeight);
                //});
                mainData.states.turnOrientation = true;
            });
            if (!window.elecAPI) {
                window.addEventListener("beforeunload",(evt) => {
                    if (this.mainData.states.currentEditOperationCount > 0) {
                        evt.preventDefault();
                        evt.returnValue = "End VRMViewMeister ?";
                    }
                    
                });
            }
            
            window.addEventListener("unload",(evt) => {
                window.clearInterval(mainData.states.inputstep.id);
                if (mainData.elements.win_bonetransform) mainData.elements.win_bonetransform.close();
                if (mainData.elements.win_mediapipe) mainData.elements.win_mediapipe.close();
                if (mainData.elements.win_pose) mainData.elements.win_pose.close();
                if (mainData.elements.win_screenshot) mainData.elements.win_screenshot.close();
                if (mainData.elements.win_vplayer) mainData.elements.win_vplayer.close();
                if (mainData.elements.win_keyframe) mainData.elements.win_keyframe.close();
                if (mainData.elements.win_gravitybone) mainData.elements.win_gravitybone.close();
            });


            
        
            //setTimeout(() => {
                //modelLoader.load_materialFile(true);
            //},500);
            
            
            /*
            window.addEventListener("beforeunload",(evt)=>{
                modelOperator.destroy();
                AppDB.clearAll();
            });
            */
        });
        const inputstep = (timestamp) => {
            /*
            if (!mainData.states.inputstep.start) {
                mainData.states.inputstep.start = timestamp;
            }
            const elapsed = timestamp - mainData.states.inputstep.start;
            if (mainData.states.inputstep.prevstamp !== timestamp) {
                

                //mainData.states.inputstep.done = true;
            }
            if (elapsed < 2000) {
                mainData.states.inputstep.prevstamp = timestamp;
                if (!mainData.states.inputstep.done) {
                    
                }
            }*/
            
            mainData.states.inputman.update();
            
            
            window.requestAnimationFrame(inputstep);
        }
        window.requestAnimationFrame(inputstep);
        /*mainData.states.inputstep.id = window.setInterval(()=> {
            mainData.states.inputman.update();
        },10);*/

        Vue.onUpdated(() => {
            
        });
        Vue.onBeforeUnmount(() => {
            
        });
        Vue.onUnmounted(() => {
            modelOperator.destroy();
            modelLoader.destroy_materialFile();
            AppDB.clearAll();
            mainData.appconf.save();

        });

        const chk_resolution_xs_and_portrait = Vue.computed(() => {
            var w = Quasar.Screen.width;
            var w2 = Quasar.Screen.width * 2;
            var h = Quasar.Screen.height;
            var ret = false;
            if (Quasar.Screen.name == "xs") {
                if (h <= w)  {
                    ret = false;
                }else if (h <= w2) {
                    ret = true;
                }else{
                    ret = true;
                }
            }
            
            return ret;
        });
        
        
        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        return {
            //---data
            mainData,ribbonData,objlistData,objpropData,unityConfig,timelineData,

            //---ref for HTML
            unitycontainer,
            leftdrawer,rightdrawer,
            hid_file,fil_animproject,file_audio,fil_animmotion,aud01_capture,
            scroll_header_x,scroll_namebox_y,scroll_keyframe_xy,grid_scrollx,grid_scrolly,
            fil_animation,lnk_savemotion,
            lnk_recdownload,lnk_saveproject,
            fil_projselector,

            //---event
            //hidfile_onchange,
            ribbonEvent,
            objlistEvent,
            mobilePadEvent,
            //filtered_objectlist: objlistEvent.filtered_objectlist,
            objpropEvent,
            setupUnity, setupRecordingConfig, setupFixUnityEvent, setupDefaultObject, CanvasPointerEnter, CanvasPointerLeave,
            timelineEvent,
            projectdlgEvent,
            projectSelectorEvent,
            vroidhubSelectorEvent,
            vroidhubAuthorizerEvent,

            //---method, properties
            modelLoader, modelOperator, dnd,UnityCallback, childman,
            wa_selectedAvatar,wa_percentCurrent,
            cmp_percentLoad,
            cmp_projectSelectorStorageGDrive,

            mat_realtoon,UIMaterials,
            chk_resolution_xs_and_portrait,
            judgeDeviceLandscape
        }
    }
})
window["_REFAPP"] = {
    original : app,
    childreturner : {},
}


const i18n = VueI18n.createI18n({
    legacy : false,
    locale : loc,
    messages
});


app.use(Quasar, {
    config: {
        /*
        brand: {
          // primary: '#e46262',
          // ... or all other brand colors
        },
        notify: {...}, // default set of options for Notify Quasar plugin
        loading: {...}, // default set of options for Loading Quasar plugin
        loadingBar: { ... }, // settings for LoadingBar Quasar plugin
        // ..and many more (check Installation card on each Quasar component/directive/plugin)
        */
    }
})

defineSetupLang(Quasar);
//Quasar.lang.set(Quasar.lang.ja);

//---define element
defineUswipeInput(app,Quasar);
defineUcolorPicker(app,Quasar);
defineAppInfoDlg(app,Quasar);
defineVrmInfoDlg(app,Quasar);
defineBonetranDlg(app,Quasar);
defineGravityboneDlg(app,Quasar);
defineConfigDlg(app,Quasar);
defineVpadDlg(app,Quasar);
defineKeyframeDlg(app,Quasar);
defineNavigationDlg(app, Quasar);
definePoseMotionDlg(app, Quasar);
defineCaptureDlg(app, Quasar);
defineTearchManagerDlg(app, Quasar);
defineEasyBoneTranDlg(app, Quasar);
defineTransformRefDlg(app, Quasar);

app.use(i18n);
//---Start app
app.mount('#q-app')