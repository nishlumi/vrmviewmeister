import { defineSetupLang } from "../js/setuplang.js";
import { ChildReturner } from "../js/cls_childreturner.js";

//import messages from "/static/locales";
const controls = window;
//const LandmarkGrid = window.LandmarkGrid;
const drawingUtils = window;
const mpPose = window;

var loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

class PoseTracking {
    constructor() {
        this.elements = {
            controls : null,
            srcPicker : null,
        };
        this.ctx = null;
        this.pose = null;
        this.poseOptions = {
            selfieMode: true,
            modelComplexity: 0,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            effect: 'background',
        };
        this.states = {
            activeEffect : "mask",
            currentsrc : "video",
            result : null,
        };
    }
}
const mediaapp = new PoseTracking();

const app = Vue.createApp({
    setup() {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });

        const mpapp = Vue.ref({
            drawer : {
                show : true,
                camera : {
                    show : true
                },
                timer : {
                    seconds : 3
                },
                srcpicker : null,
            },
            progress : false,
            appconf : {
                set_name : "_vvie_aco",
                confs : {},
            },
            data : {
                pose : null
            },
            ctx : null,
            states : {
                poseOptions : {
                    selfieMode: true,
                    modelComplexity: 0,
                    smoothLandmarks: true,
                    enableSegmentation: false,
                    smoothSegmentation: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                    effect: 'background',
                },
                activeEffect : "mask",
                currentsrc : "video",
                result : null,
            }
            
        });
        const srcpicker = Vue.ref(null);
        const ivid = Vue.ref(null);
        const ocan = Vue.ref(null);
        const aud01_capture = Vue.ref(null);

        const loadSetting = () => {
            var textdata = localStorage.getItem(mpapp.value.appconf.set_name);
            if (textdata) {
                var tmp = JSON.parse(textdata);
                mpapp.value.appconf.confs = tmp;
            }
        }
        //---event---------------------------------------------
        const wa_camerashow = Vue.watch(() => mpapp.value.drawer.camera.show, (newval)=>{
            if (mpapp.value.states.currentsrc == "video") {
                mediaapp.elements.srcPicker.m.getVideoTracks()[0].enabled = newval;
            }
        });
        const wa_selfie = Vue.watch(() => mpapp.value.states.poseOptions.selfieMode,(newval)=>{
            ivid.value.classList.toggle('selfie', newval);
            mediaapp.poseOptions.selfieMode = newval;
            mediaapp.pose.setOptions(mediaapp.poseOptions);
        });
        const wa_minDetect = Vue.watch(() => mpapp.value.states.poseOptions.minDetectionConfidence, (newval)=>{
            mediaapp.poseOptions.minDetectionConfidence = newval;
            mediaapp.pose.setOptions(mediaapp.poseOptions);
        });
        const wa_minTrack = Vue.watch(() => mpapp.value.states.poseOptions.minTrackingConfidence, (newval)=>{
            mediaapp.poseOptions.minTrackingConfidence = newval;
            mediaapp.pose.setOptions(mediaapp.poseOptions);
        });

        const takeshot_onclick = () => {
            if (mpapp.value.drawer.timer.seconds == 0) {
                var js = new ChildReturner();
                js.origin = location.origin;
                js.windowName = "mediapipe";
                js.funcName = "apply_pose";
                js.data = JSON.stringify(mediaapp.states.result);
                opener.postMessage(js);
            }else{
                mpapp.value.progress = true;
                setTimeout(()=>{
                    aud01_capture.value.play();
                    mpapp.value.progress = false;
                    var js = new ChildReturner();
                    js.origin = location.origin;
                    js.windowName = "mediapipe";
                    js.funcName = "apply_pose";
                    js.data = JSON.stringify(mediaapp.states.result);
                    opener.postMessage(js);
                },parseInt(mpapp.value.drawer.timer.seconds)*1000);
            }
            
        }

        const pose_onresult = (results) => {
            mediaapp.states.result = results;

            mediaapp.ctx.save();
            mediaapp.ctx.clearRect(0, 0, ocan.value.window, ocan.value.height);
            if (results.segmentationMask) {
                mediaapp.ctx.drawImage(results.segmentationMask, 0, 0, ocan.value.width, ocan.value.height);
                // Only overwrite existing pixels.
                if (mediaapp.states.activeEffect === 'mask' || mediaapp.states.activeEffect === 'both') {
                    mediaapp.ctx.globalCompositeOperation = 'source-in';
                    // This can be a color or a texture or whatever...
                    mediaapp.ctx.fillStyle = '#00FF007F';
                    mediaapp.ctx.fillRect(0, 0, ocan.value.width, ocan.value.height);
                }
                else {
                    mediaapp.ctx.globalCompositeOperation = 'source-out';
                    mediaapp.ctx.fillStyle = '#0000FF7F';
                    mediaapp.ctx.fillRect(0, 0, ocan.value.width, ocan.value.height);
                }
                // Only overwrite missing pixels.
                mediaapp.ctx.globalCompositeOperation = 'destination-atop';
                mediaapp.ctx.drawImage(results.image, 0, 0, ocan.value.width, ocan.value.height);
                mediaapp.ctx.globalCompositeOperation = 'source-over';
            }
            else {
                mediaapp.ctx.drawImage(results.image, 0, 0, ocan.value.width, ocan.value.height);
            }
            if (results.poseLandmarks) {
                drawingUtils.drawConnectors(mediaapp.ctx, results.poseLandmarks, mpPose.POSE_CONNECTIONS, { visibilityMin: 0.65, color: 'white' });
                drawingUtils.drawLandmarks(mediaapp.ctx, Object.values(mpPose.POSE_LANDMARKS_LEFT)
                    .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(255,138,0)' });
                drawingUtils.drawLandmarks(mediaapp.ctx, Object.values(mpPose.POSE_LANDMARKS_RIGHT)
                    .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)' });
                drawingUtils.drawLandmarks(mediaapp.ctx, Object.values(mpPose.POSE_LANDMARKS_NEUTRAL)
                    .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'white' });
            }
            mediaapp.ctx.restore();
            if (results.poseWorldLandmarks) {
                /*
                grid.updateLandmarks(results.poseWorldLandmarks, mpPose.POSE_CONNECTIONS, [
                  {list: Object.values(mpPose.POSE_LANDMARKS_LEFT), color: 'LEFT'},
                  {list: Object.values(mpPose.POSE_LANDMARKS_RIGHT), color: 'RIGHT'},
                ]);
                */
            }
            else {
                //grid.updateLandmarks([]);
            }
        }
        
        Vue.onBeforeMount(() => {
            var qloc = [
                loc.replace("-",""),    //en-US -> enUS
                loc.split("-")[0]       //en-US -> en
            ];
            var qlang = Quasar.lang[qloc[0]] || Quasar.lang[qloc[1]];
            if (qlang) {
                Quasar.lang.set(qlang);
            }else{
                Quasar.lang.set(Quasar.lang.enUS);
            }
        });
        Vue.onMounted(() => {
            mediaapp.ctx = ocan.value.getContext("2d");
            mediaapp.pose = new Pose({
                localteFile : (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
                    //return `/static/lib/mediapipe/pose/${file}`;
                }
            });
            mediaapp.pose.onResults(pose_onresult);
            mediaapp.elements.srcPicker = new controls.SourcePicker({
                onSourceChanged: (name, type) => {
                    // Resets because this model gives better results when reset between
                    // source changes.
                    mediaapp.states.currentsrc = type;
                    mediaapp.pose.reset();
                },
                onFrame: async (input, size) => {
                    const aspect = size.height / size.width;
                    if (size.width > size.height) {
                        ivid.value.classList.add("output_canvas");
                        ivid.value.classList.remove("output_canvas_h");
            
                    }else{
                        ivid.value.classList.remove("output_canvas");
                        ivid.value.classList.add("output_canvas_h");
            
                    }
                    let width, height;
                    if (window.innerWidth > window.innerHeight) {
                        height = window.innerHeight;
                        width = height / aspect;
                    }
                    else {
                        width = window.innerWidth;
                        height = width * aspect;
                    }
                    ivid.value.width = width;
                    ivid.value.height = height;
                    await mediaapp.pose.send({ image: input });
                },
            });
            mediaapp.elements.controls = new controls.ControlPanel(ID("srcpicker"), mediaapp.poseOptions)
            .add([
                mediaapp.elements.srcPicker
            ])
            .on(x => {
                mediaapp.poseOptions = x;
                mediaapp.states.activeEffect = x['effect'];
                mediaapp.pose.setOptions(mediaapp.poseOptions);
            });
            
            loadSetting();
            //console.log(opener);
        });

        return {
            mpapp,
            srcpicker,ivid,ocan,aud01_capture,
            //---event---
            wa_camerashow,wa_selfie,wa_minDetect,wa_minTrack,
            takeshot_onclick,
            //---computed---
            //---other method---
            loadSetting,
        };
    }
});


const i18n = VueI18n.createI18n({
    locale : loc,
    //messages
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


app.use(i18n);
//---Start app
app.mount('#q-app');
