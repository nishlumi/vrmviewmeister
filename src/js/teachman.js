import { VVMTMWebCam } from "./model/tmvvmcam";

const template = `
<div ref="tmpnl" v-show="show" class="rounded-borders shadow-2" :style="appdata.elements.win.styles">
    <div ref="nvdlg_bar" v-touch-pan.prevent.mouse="handlePan" class="basic-dialog-titlebar bg-primary text-grey-1 q-pa-xs">
        <div class="row">
            <div>{{ $t('navigation window') }}</div>
            <q-space></q-space>
            <q-btn flat round dense size="md" icon="clear" @click="close_onclick"></q-btn>
        </div>
    </div>
    <div style="width:100%;height:calc(100% - 40px);" :class="appdata.elements.panelCSS" class="q-pa-sm">
        <div class="row">
            <div class="col-4">
                <div ref="tmref_webcam"></div>
            </div>
            <div class="col-8">
                <q-select v-model="appdata.elements.camselector.selected"
                    :options="appdata.elements.camselector.options"
                    dense
                    @update:model-value="onchange_camselector"
                ></q-select>
                
                <div>
                    <b v-text="appdata.elements.predict.label"></b>:<br>
                    <b style="padding-left:1rem;" v-text="appdata.elements.predict.value"></b>
                </div>
            </div>
        </div>
    </div>
</div>
`;

class BaseData {
    constructor() {
        this.elements = {
            win : {
                styles : {
                    position : "absolute",
                    //bottom : "-9999px",
                    right : "0px",
                    top : "0px",
                    width : "320px",
                    height : "180px",
                    zIndex : 5004,
                    transform : "",
                    backgroundColor : "#FFFFFF"
                },
                position : {
                    x : 0,
                    y : 0
                },
            },
            canvas : {
                width : 300,
                height : 300,
            },
            panelCSS : {
                "q-dark" : false,
                "text-dark" : true,
            },
            camselector : {
                selected : null,
                options : []
            },
            predict : {
                label : "",
                value : "",
            }
        };
        this.data = {
            tm_model : null,
            tm_maxPredictions : null,
            camsize : 200,
        };
        this.states = {
            /**
             * @type {VVMTMWebCam}
             */
            cam : null,
        };
    }
}

export function defineTearchManagerDlg(app, Quasar) {
    app.component("TearchManageDlg",{
        template : template,
        props: {
            modelValue : Boolean,
            tearchingName: {
                type: String,
                default: "rot"
            }
        },
        emits: [
            "update:model-value",
            "predict",
        ],
        setup (props, context) {
            const { modelValue, tearchingName } = Vue.toRefs(props);
            const { t  } = VueI18n.useI18n({ useScope: 'global' });

            /**
             * @type {BaseData}
             */
            const appdata = Vue.reactive(new BaseData());

            const show = Vue.ref(false);

            const tmpnl = Vue.ref(null);
            const tmref_webcam = Vue.ref(null);

            var model = null;
            var maxPredictions = 0;


            //===watch=================================================================
            const wa_modelValue = Vue.watch(() => modelValue.value, async (newval) => {
                show.value = newval;
                appdata.elements.win.styles.bottom = "0px";
                appdata.elements.win.styles.right = "0px";

                appdata.elements.win.position.x = 0;
                appdata.elements.win.position.y = 0;
                
                appdata.elements.win.styles.transform =
                    `translate(${appdata.elements.win.position.x}px, ${appdata.elements.win.position.y}px)`;

                if (newval === true) {
                    await camsetup();
                }else{
                    appdata.states.cam.stop();
                }
            });
            const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
                appdata.elements.panelCSS["q-dark"] = newval;
                appdata.elements.panelCSS["text-dark"] = !newval;
            });
            //===method===============================================
            const camsetup = async () => {
                //---select target model
                const URL = `/static/res/tmmodel/${tearchingName.value}/`;
                model = await tmImage.load(URL+"model.json", URL+"metadata.json");
                maxPredictions = model.getTotalClasses();

                //---set up camera
                appdata.states.cam = new VVMTMWebCam(appdata.data.camsize, appdata.data.camsize, false);
                await appdata.states.cam.setup({facingMode:"environment"});
                await appdata.states.cam.play();

                window.requestAnimationFrame(camloop);
                if (!document.getElementById("vvmwebcam-canvas")) {
                    tmref_webcam.value.appendChild(appdata.states.cam.canvas);
                }
                
            }
            const camloop = async () => {
                appdata.states.cam.update(); // update the webcam frame
                await predict();
                window.requestAnimationFrame(camloop);
            }
            const predict = async () => {
                const prediction = await model.predict(appdata.states.cam.canvas);
                for (var i = 0; i < maxPredictions; i++) {
                    if (prediction[i].probability > 0.85) {
                        context.emit("predict",{
                            className: prediction[i].className,
                            value: prediction[i].probability
                        });
                        appdata.elements.predict.label = prediction[i].className
                        appdata.elements.predict.value = prediction[i].probability.toFixed(3);
                    }else{
                        //appdata.elements.predict.label = "";
                    }
                }
            }
            //===event=========================================================
            const handlePan = ({ evt, ...newInfo }) => {
                var dx = newInfo.delta.x;
                var dy = newInfo.delta.y;
                appdata.elements.win.position.x += dx;
                appdata.elements.win.position.y += dy;
            
                appdata.elements.win.styles.transform =
                    `translate(${appdata.elements.win.position.x}px, ${appdata.elements.win.position.y}px)`;
            }
            const onchange_camselector = (val) => {
                if (val != "") {
                    appdata.states.cam.changeCamera(val)
                    .then(flg => {
                        appdata.states.cam.play();
                    });
                    
                }
            }
            const close_onclick = () => {
                show.value = false;
                context.emit("update:model-value",show.value);

            }
            //===lifecycle=================================================================
            Vue.onBeforeMount(() => {

            });
            Vue.onMounted(async () => {
                const devices = await navigator.mediaDevices.enumerateDevices();
                appdata.elements.camselector.options.splice(0, appdata.elements.camselector.options.length);
                for (var d of devices) {
                    if (d.kind == "videoinput") {
                        appdata.elements.camselector.options.push({
                            label: d.label,
                            value: d.deviceId, 
                        });
                    }                    
                }

                
                
            });
            Vue.onBeforeUnmount(() => {
                
            });

            return {
                appdata,
                show,
                tmpnl,
                tmref_webcam,

                //---watch---
                wa_modelValue,wa_dark,

                //---method
                camsetup,
                camloop,

                //---event
                onchange_camselector,
                handlePan,
                close_onclick,
            }
        }
    })
}