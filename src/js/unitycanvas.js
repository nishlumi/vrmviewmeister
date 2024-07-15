
import { VVAvatar, VVCast, VVTimelineTarget } from './prop/cls_vvavatar.js';
import { StageType, DEFAULTMEM } from '../res/appconst.js';
import { appModelOperator } from './model/operator.js';
import { UnityCallbackFunctioner } from './model/callback.js';


/**
 * 
 * @param {*} app app object
 * @param {*} Quasar Quasar object
 * @param {*} mainData mainDataData object
 * @param {*} ribbonData appRibbonData object
 * @returns 
 */
export const defineUnityCanvas = (app, Quasar, mainData, ribbonData, objlistData, objpropData, timelineData, refs) => {
    const buildUrl = document.getElementById("UnityBuildPath").value;
    const unitycontainer = Vue.ref(null);
    const unityConfig = Vue.ref({
        loaderUrl : buildUrl + "/Builds.loader.js",
        config : {
            TOTAL_MEMORY : DEFAULTMEM * mainData.appconf.confs.application.UseMemory,
            dataUrl: buildUrl + "/Builds.data.unityweb",
            frameworkUrl: buildUrl + "/Builds.framework.js.unityweb",
            codeUrl: buildUrl + "/Builds.wasm.unityweb",
            streamingAssetsUrl: "StreamingAssets",
            companyName: mainData.appinfo.author, //"DefaultCompany",
            productName: mainData.appinfo.name, //"VRMViewer",
            productVersion: mainData.appinfo.version //"0.1",
        },
        canvasID : "#unity-canvas",
        screen : {
            width : 0,
            height : 0,
            recordStream : new MediaStream(),
            recorder : null,
            downloadLink : "",
        },
        instance : null
    });

    //-----------------------------------------------------
    const setupUnity = async () => {
        var prom = new Promise((resolve,reject)=>{
            var container = document.querySelector("#unity-container");
            var canvas = document.querySelector("#unity-canvas");
            var loadingBar = document.querySelector("#unity-loading-bar");
            var progressBarFull = document.querySelector("#unity-progress-bar-full");
            var fullscreenButton = document.querySelector("#unity-fullscreen-button");
            var mobileWarning = document.querySelector("#unity-mobile-warning");
        
            // By default Unity keeps WebGL canvas render target size matched with
            // the DOM size of the canvas element (scaled by window.devicePixelRatio)
            // Set this to false if you want to decouple this synchronization from
            // happening inside the engine, and you would instead like to size up
            // the canvas DOM size and WebGL render target sizes yourself.
            // config.matchWebGLToCanvasSize = false;
        
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                container.className = "unity-mobile";
                // Avoid draining fillrate performance on mobile devices,
                // and default/override low DPI mode on mobile browsers.
                //config.devicePixelRatio = 1;
                unityConfig.value.config["devicePixelRatio"] = 1;
                mobileWarning.style.display = "block";
                setTimeout(() => {
                    mobileWarning.style.display = "none";
                }, 5000);
            } else {
                if (canvas) {
                    canvas.style.width = "100%"; //this.states.canvas.width;
                    canvas.style.height = "100%"; // this.states.canvas.height;
                }
                
            }
        
            loadingBar.style.display = "block";
        
            var script = document.createElement("script");
            script.src = unityConfig.value.loaderUrl;
            script.onload = async () => {
                unityConfig.value.config["webglContextAttributes"] = {"preserveDrawingBuffer":true};
                var unity_instance = await createUnityInstance(canvas, unityConfig.value.config,(progress) => {
                    progressBarFull.style.width = 100 * progress + "%";
                });
                unityConfig.value.instance = unity_instance;
                unityConfig.value.screen.width = document.getElementById("unity-canvas").width;
                unityConfig.value.screen.width = document.getElementById("unity-canvas").height;
    
                AppQueue.initialize(unity_instance);
    
                loadingBar.style.display = "none";
    
                var stream = canvas.captureStream();
                unityConfig.value.screen.recordStream.addTrack(stream.getTracks()[0]);
                if (mainData.appconf.confs.animation["enable_audio_record"] === true) {
                    var audioStream = await navigator.mediaDevices.getUserMedia({
                        audio : true,
                        video : false
                    });
                    unityConfig.value.screen.recordStream.addTrack(audioStream.getTracks()[0]);
                }
                
                unityConfig.value.screen.recorder = new MediaRecorder(unityConfig.value.screen.recordStream);
                unityConfig.value.screen.recorder.ondataavailable = (e) => {
                    var bb = new Blob([e.data], { type: e.data.type });
                    var burl = window.URL.createObjectURL(bb);
                    //this.recordLink = burl;
                    //ID("lnk_recdownload").href = burl;
                    sessionStorage.setItem("tempvideo",burl);
                    refs.lnk_recdownload.value.href = burl;
                    //$("#btn_rec_download").linkbutton("enable");
                };
                
                resolve(true);
            };
            document.body.appendChild(script);
            //resolve(true);
            document.addEventListener('onARSupportedCheck', (event) => {
                console.log("onARSupportedCheck=",event);
                ribbonData.elements.vrar.disable.ar = !event.detail.supported;
            }, false);
            document.addEventListener('onVRSupportedCheck', (event) => {
                console.log("onVRSupportedCheck=",event);
                ribbonData.elements.vrar.disable.vr = !event.detail.supported;
                
            }, false);

        });
        return prom;
        
    }
    //-----------------------------------------------------------------
    /**
     * 
     * @param {appModelOperator} modelOperator 
     * @param {UnityCallbackFunctioner} callback
     */
    const setupFixUnityEvent = async (modelOperator,callback) => {
        //---fixed setting for Unity call
        AppQueue.fixedList["selectavatar_unity2html"] = new queueData(
            null,
            "selectavatar_unity2html",QD_INOUT.returnJS,
            (val) => {
                objlistData.elements.objectlist.selected = val.name;
            }
        );
        AppQueue.fixedList["selectavatar_html2unity"] = new queueData(
            null,
            "selectavatar_html2unity",QD_INOUT.returnJS,
            (val) => {

            }
        );
        AppQueue.fixedList["transform_unity2html"] = new queueData(
            null,
            "transform_unity2html",QD_INOUT.returnJS,
            (val) => {
                //---transform on Unity, send information to HTML
                /*
                  {
                      id : "",
                      dimension : ""   2d, 3d
                      position : {}, rotation : {}, scale : {}
                  }
                */
                //console.log(val);
                
                if (!mainData.states.selectedAvatar) return;

                if (!objpropData.states.isEditingFromUI) {
                    //---This enter is only changing from Unity
                    if (mainData.states.selectedAvatar.id == val.id) {
                        if (val.dimension == "2d") {
                            objpropData.elements.common.position2d.x = Math.round(val.position.x * 10000) / 10000;
                            objpropData.elements.common.position2d.y = Math.round(val.position.y * 10000) / 10000;
                            objpropData.elements.common.rotation2d.x = Math.round(val.rotation.x);
                            objpropData.elements.common.rotation2d.y = Math.round(val.rotation.y);
                            //ID("inp_2dac_common_siz_x").value = val.scale.x;
                            //ID("inp_2dac_common_siz_y").value = val.scale.y;
            
                        }else if (val.dimension == "3d") {
                            objpropData.elements.common.position3d.x = Math.round(val.position.x * 10000) / 10000;
                            objpropData.elements.common.position3d.y = Math.round(val.position.y * 10000) / 10000;
                            objpropData.elements.common.position3d.z = Math.round(val.position.z * 10000) / 10000;
                            objpropData.elements.common.rotation3d.x = Math.round(val.rotation.x);
                            objpropData.elements.common.rotation3d.y = Math.round(val.rotation.y);
                            objpropData.elements.common.rotation3d.z = Math.round(val.rotation.z);
                            //ID("inp_allscale").value = parseFloat(val.scale.x) * 100;
                        }
                    }
                }
                objpropData.states.isEditingFromUI = false;
            },
        );
        AppQueue.fixedList["dlight_transform_unity2html"] = new queueData(
            null,
            "dlight_transform_unity2html",QD_INOUT.returnJS,
            (val) => {
                //---transform directional light on Unity, send information to HTML
                objpropData.elements.stageui.dlight_rotation.x = Math.round(val.rotation.x);
                objpropData.elements.stageui.dlight_rotation.y = Math.round(val.rotation.y);
                objpropData.elements.stageui.dlight_rotation.z = Math.round(val.rotation.z);
    
            }
        );
        AppQueue.fixedList["playinganima_unity2html"] = new queueData(
            null,
            "playinganima_unity2html",QD_INOUT.returnJS,
            (val) => {
                //---return information about current animation frame
                /**
                 * @type {AnimationParsingOptions}
                 */
                //console.log(val);
                var js = (val);
                //parent.elements.timeline.selectFrame(js.index);
                //console.log("    playinganimation:",js);
                //parent.onUpdate_Audio({ index : js});
                if (val >= mainData.data.project.timelineFrameLength) {
                    parent.animationPlaying = false;
                    if (mainData.appconf.confs.animation.off_ikmarker_during_play_animation === true) {
                        AppQueue.add(new queueData(
                            {target:AppQueue.unity.Camera,method:'EnableHandleShowCamera',param:1},
                            "",QD_INOUT.toUNITY,
                            null
                        ));
                    }
                }
            }
        );
        AppQueue.fixedList["previewend_otherobjectAnimation_unity2html"] = new queueData(
            null,
            "previewend_otherobjectAnimation_unity2html",QD_INOUT.returnJS,
            (val) => {
                var js = val.split(",");
                objpropData.elements.objectui.animation.play_icon = "play_circle";
            }
        );
        AppQueue.fixedList["previewend_effect_unity2html"] = new queueData(
            null,
            "previewend_effect_unity2html",QD_INOUT.returnJS,
            (val) => {
                var js = (val);
    
                objpropData.elements.effectui.previewBtnIcon = "play_circle";
            }
        );
        AppQueue.fixedList["finishPreviewFrame_unity2html"] = new queueData(
            null,
            "finishPreviewFrame_unity2html",QD_INOUT.returnJS,
            (val) => {
                //---apply object information
                //console.log(val);
                //modelOperator.select_objectItem(mainData.states.selectedAvatar.id);
                modelOperator.callVRM_limitedBoneOperation();
            }
        );
        AppQueue.fixedList["pauseanima_unity2html"] = new queueData(
            null,
            "pauseanima_unity2html",QD_INOUT.returnJS,
            (val) => {
                /*var el = ID("btn_anim_frame_play").querySelector(".material-icons");
                if (el.textContent == "play_arrow") {
                    el.textContent = "pause";
                }else{
                    el.textContent = "play_arrow";
                }
                */
            }
        );
        AppQueue.fixedList["completeanima_unity2html"] = new queueData(
            null,
            "completeanima_unity2html",QD_INOUT.returnJS,
            (val) => {
                //console.log(val);
                //timelineData.states.currentcursor = mainData.data.project.timelineFrameLength;
                modelOperator.select_keyframePosition(mainData.data.project.timelineFrameLength-1);
                Vue.nextTick(() => {
                    mainData.states.animationPlaying = false;
    
                    /*var el = ID("btn_anim_frame_play").querySelector(".material-icons");
                    el.textContent = "play_arrow";*/
                    ribbonData.elements.frame.play_normal.icon = "play_arrow";
        
                    if (mainData.appconf.confs.animation.play_with_record_movie === true) {
                        //$("#btn_rec_stop").click();
                        ribbonData.elements.lnk_download.state = false;
                    }
                    if (mainData.appconf.confs.animation.recover_firstpose_whenfinished === true) {
                        if (mainData.appconf.confs.animation.recover_firstpose_timeout == 0) {
                            //timelineData.states.currentcursor = 1;
                            modelOperator.select_keyframePosition(0);
                        }else{
                            setTimeout(() => {
                                //timelineData.states.currentcursor = 1;
                                modelOperator.select_keyframePosition(0);
                            },mainData.appconf.confs.animation.recover_firstpose_timeout);
                        }
                        
                    }
                    modelOperator.callVRM_limitedBoneOperation();
                });
                
            }
        );
        AppQueue.fixedList["finishAudio_unity2html"] = new queueData(
            null,
            "finishAudio_unity2html",QD_INOUT.returnJS,
            (val) => {
                var js = val.split("\t");
                //0 - s/b , 1 - name, 2 - time, 3 - length
                //console.log(js);
                if (js[0] == "b") {
                    ribbonData.elements.audio.bgm.playbtn_state = "play_circle";
                    ribbonData.elements.audio.bgm.seek = parseFloat(js[2]);
                }else if (js[0] == "s") {
                    ribbonData.elements.audio.se.playbtn_state = "play_circle";
                    ribbonData.elements.audio.se.seek = parseFloat(js[2]);
                }
            }
        );
        AppQueue.fixedList["intervalLoadingProject_unity2html"] = new queueData(
            null,
            "intervalLoadingProject_unity2html",QD_INOUT.returnJS,
            (val) => {
                mainData.elements.percentLoad.current = val;
            }
        );
        AppQueue.fixedList["endingVRAR_unity2html"] = new queueData(
            null,
            "endingVRAR_unity2html",QD_INOUT.returnJS,
            callback.endingVRAR,
            {callback}
        );
        AppQueue.fixedList["freecapture_unity2html"] = new queueData(
            null,
            "freecapture_unity2html",QD_INOUT.returnJS,
            callback.endingVRAR,
            {callback}
        );
    }
    /*
    const setupDefaultObject = (mainData,timelineData,modelOperator) => {
        var syse = new VVAvatar("SystemEffect",{
            id : "SystemEffect",
            Title : "SystemEffect"
        });
        syse.isFixed = true;
        mainData.data.vrms.push(syse);
        var role_syse = new VVCast("SystemEffect","SystemEffect");
        role_syse.avatarId = syse.id;
        role_syse.avatar = syse;
        mainData.data.project.casts.push(role_syse);
        //+++this.elements.timeline.appendTimeline(role_syse);
        var TLsyse = new VVTimelineTarget(role_syse);
        TLsyse.fixed = true;
        timelineData.data.timelines.push(TLsyse);
    
        var bgm = new VVAvatar("Audio",{
            id : "BGM",
            Title : "BGM"
        });
        bgm.isFixed = true;
        mainData.data.vrms.push(bgm);
        var role_bgm = new VVCast("BGM","BGM");
        role_bgm.avatarId = bgm.id;
        role_bgm.avatar = bgm;
        mainData.data.project.casts.push(role_bgm);
        //+++this.elements.timeline.appendTimeline(role_bgm);
        var TLbgm = new VVTimelineTarget(role_bgm);
        TLbgm.fixed = true;
        timelineData.data.timelines.push(TLbgm);
    
        var se = new VVAvatar("Audio",{
            id : "SE",
            Title : "SE"
        });
        se.isFixed = true;
        mainData.data.vrms.push(se);
        var role_se = new VVCast("SE","SE");
        role_se.avatarId = se.id;
        role_se.avatar = se;
        mainData.data.project.casts.push(role_se);
        //+++this.elements.timeline.appendTimeline(role_se);
        var TLse = new VVTimelineTarget(role_se);
        TLse.fixed = true;
        timelineData.data.timelines.push(TLse);
    
        var ret = modelOperator.addObject("Stage",{
            id : "Stage",
            Title : "Stage",
            roleName : "Stage",
            roleTitle : "Stage"
        });
        StageType.isFixed = true;
        //elements.objectlist.selected = ret.avatar.id;
        //modelOperator.select_objectItem("Stage");
        var TLstage = new VVTimelineTarget(ret.role);
        TLstage.fixed = true;
        timelineData.data.timelines.push(TLstage);
        mainData.states.selectedAvatar = ret.avatar;
        
        console.log(mainData.data);
    }
    */

    const CanvasPointerEnter = () => {
        if (unityConfig.value.instance) unityConfig.value.instance.SendMessage('Main Camera', "SetFlagWebGLInputFromOuter", "1");
    }
    const CanvasPointerLeave = () => {
        if (unityConfig.value.instance) unityConfig.value.instance.SendMessage('Main Camera', "SetFlagWebGLInputFromOuter", " ");
    }
    return {
        unitycontainer,
        unityConfig,
        setupUnity,
        setupFixUnityEvent,
        //setupDefaultObject,
        CanvasPointerEnter,
        CanvasPointerLeave
    }
    
}