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
import { VRoidHubConnector } from "./model/vroidhub.js";

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
            setupUnity, setupFixUnityEvent, setupDefaultObject, 
            CanvasPointerEnter, CanvasPointerLeave
        } = defineUnityCanvas(app, Quasar, mainData, ribbonData, objlistData.value, objpropData, timelineData, {
            lnk_recdownload,
        });
        const { UnityCallback } = defineUnityCallback(mainData, ribbonData,objlistData.value,objpropData,timelineData, unityConfig.value,{
            lnk_saveproject
        });
        const { modelOperator,wa_selectedAvatar,wa_percentCurrent,cmp_percentLoad } = defineModelOperator(mainData,ribbonData,objlistData.value,objpropData,timelineData,UnityCallback,{
            unitycontainer
        });
        const { modelLoader, dnd } = defineModelLoader(app, Quasar, mainData, timelineData, modelOperator, UnityCallback, {
            fil_animproject,file_audio,fil_animmotion,hid_file,lnk_saveproject
        });
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
        const {objlistEvent, leftdrawer} = defineObjlist(app, Quasar, mainData, objlistData.value,modelOperator);
        const {objpropEvent, rightdrawer} = defineObjprop(app, Quasar, mainData, objpropData,UnityCallback,modelOperator);
        const { timelineEvent } = defineTimeline(app, Quasar, mainData, ribbonData, timelineData, UnityCallback, modelOperator, {
            scroll_header_x,scroll_namebox_y,scroll_keyframe_xy,grid_scrollx,grid_scrolly
        });
        const {projectdlgEvent, fil_animation, lnk_savemotion} = defineProjectDialog(app, Quasar, mainData, timelineData, modelOperator,UnityCallback);
        const { projectSelectorEvent,fil_projselector,cmp_projectSelectorStorageGDrive } = defineProjectSelector(app, Quasar, mainData, modelLoader, modelOperator, UnityCallback, {
            lnk_saveproject
        });

        const { 
            mat_realtoon,UIMaterials
        } = defineMaterialPropertyUI(app, Quasar, objpropData, objpropEvent);

        //===set up the other referrence
        UnityCallback.timelineEvent = timelineEvent;
        UnityCallback.refs["lnk_savemotion"] = lnk_savemotion;

        Vue.provide("UNITYCONFIG",unityConfig.value);

        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        //---Life cycle
        const calcUnitySize = (w, h) => {
            var left = objlistEvent.getCurrentModeSize();
            var right = objpropEvent.getCurrentModeSize();
            var tab = ribbonEvent.getCurrentModeSize();
            var tl = timelineEvent.getCurrentModeSize();
            mainData.elements.canvas.scrollArea.width = `${w - left - right}px`;
            mainData.elements.canvas.scrollArea.height = `${h - tab - tl}px`;
            //modelOperator.setScreenSize(w - left - right, h - tab - tl, false);
        }
        Vue.onBeforeMount(() => {
            mainData.appconf.load()
            .then(res => {
                mainData.appconf.applyUnity(false);
            });

            ribbonData.elements.language_box.selected = loc;

            if ((mainData.appconf.confs.fileloader.gdrive.enabled === true) && (mainData.appconf.confs.fileloader.gdrive.url != "")) {
                mainData.states.googledrive_gas = true;
            }else{
                mainData.states.googledrive_gas = false;
            }
        });
        Vue.onMounted( async () => {
            mainData.vroidhubapi.load()
            .then(res => {
                mainData.states.vroidhub_api = res === true ? true : false;
            });
            var ishit = Quasar.LocalStorage.getItem("callback_code");
            if (ishit) {
                var resjs = JSON.parse(ishit);
                if (resjs["code"]) {
                    mainData.vroidhubapi.request_token(resjs.code)
                    .then(res => {
                        Quasar.LocalStorage.remove("callback_code");
                        mainData.states.vroidhub_api = true;
                    });
                }
            }
            setupUnity()
            .then(res => {
                modelLoader.checkSWUpdate();
                setupFixUnityEvent(modelOperator,UnityCallback);
                Vue.nextTick(async () => {
                    //---firstly set config to Unity, after each initial set up
                    mainData.appconf.load()
                    .then(confres => {
                        mainData.appconf.applyUnity(false);
                        modelOperator.newProject(false);
                        modelLoader.setupDefaultObject();

                        calcUnitySize(Quasar.Screen.width, Quasar.Screen.height);
                        //mainData.elements.canvas.scrollArea.width = `${Quasar.Screen.width - 300 - 225}px`;
                        //mainData.elements.canvas.scrollArea.height = `${Quasar.Screen.height - 128 - 36 - 200}px`;
                        ribbonData.elements.scr_size.width = unitycontainer.value.width; 
                        ribbonData.elements.scr_size.height = unitycontainer.value.height;
        
                        //---additional settings
                        modelOperator.setDarkMode(mainData.appconf.confs.application.UseDarkTheme);
                        
                        //AppQueue.start();
                        
                        //---1st: load app material
                        modelOperator.load_materialFile(true);
                        ID("splash").classList.add("fadeout");
                        modelLoader.downloadAddressableAssetBundles();
                        modelLoader.onload_effectDirectory();
                        AppQueue.start();
                        mainData.states.currentEditOperationCount = 0;
                        mainData.states.backupEditOperationCount = 0;
                
                        modelLoader.schedulingBackup();
                    });
                    
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
                    var w = evt.currentTarget;
                    calcUnitySize(w.innerWidth, w.innerHeight);
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
                    if (mainData.elements.win_bonetransform) mainData.elements.win_bonetransform.close();
                    if (mainData.elements.win_mediapipe) mainData.elements.win_mediapipe.close();
                    if (mainData.elements.win_pose) mainData.elements.win_pose.close();
                    if (mainData.elements.win_screenshot) mainData.elements.win_screenshot.close();
                    if (mainData.elements.win_vplayer) mainData.elements.win_vplayer.close();
                    if (mainData.elements.win_keyframe) mainData.elements.win_keyframe.close();
                });


                return true;
            })
            .then((val) => {
                //setTimeout(() => {
                    //modelLoader.load_materialFile(true);
                //},500);
            });
            
            /*
            window.addEventListener("beforeunload",(evt)=>{
                modelOperator.destroy();
                AppDB.clearAll();
            });
            */
        });
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
            //filtered_objectlist: objlistEvent.filtered_objectlist,
            objpropEvent,
            setupUnity, setupFixUnityEvent, setupDefaultObject, CanvasPointerEnter, CanvasPointerLeave,
            timelineEvent,
            projectdlgEvent,
            projectSelectorEvent,

            //---method, properties
            modelLoader, modelOperator, dnd,UnityCallback, childman,
            wa_selectedAvatar,wa_percentCurrent,
            cmp_percentLoad,
            cmp_projectSelectorStorageGDrive,

            mat_realtoon,UIMaterials
        }
    }
})
window["_REFAPP"] = {
    original : app,
    childreturner : {},
}


const i18n = VueI18n.createI18n({
    legacy : true,
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
defineUcolorPicker(app,Quasar);
defineAppInfoDlg(app,Quasar);
defineVrmInfoDlg(app,Quasar);
defineBonetranDlg(app,Quasar);
defineGravityboneDlg(app,Quasar);
defineConfigDlg(app,Quasar);
defineVpadDlg(app,Quasar);
defineKeyframeDlg(app,Quasar);
defineNavigationDlg(app, Quasar);

app.use(i18n);
//---Start app
app.mount('#q-app')