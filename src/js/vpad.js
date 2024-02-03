import { UnityVector3 } from "./prop/cls_unityrel";

const template = `
<div ref="vpdlg" v-show="show" class="rounded-borders shadow-2" :style="data.elements.win.styles">
    <div ref="vpdlg_bar" class="basic-dialog-titlebar bg-primary text-grey-1 q-pa-xs">
        <div class="row">
            <div>{{ $t('title_virtualpad') }}</div>
            <q-space></q-space>
            <q-btn flat round dense size="md" icon="clear" @click="close_onclick"></q-btn>
        </div>
        
    </div>
    <div :class="data.elements.panelCSS" style="width:100%;height:calc(100% - 40px);">
    <div class="row">
            <div class="col-5" style="text-align:center">{{ $t('rotation') }}</div>
            <div class="col-2" style="text-align:center">{{ $t('progress') }}</div>
            <div class="col-5" style="text-align:center">{{ $t('translate') }}</div>
        </div>
        <div class="row">
            <div class="col-5">
                <q-card
                    v-touch-pan.prevent.mouse="onswipe_rotation"
                    :class="data.elements.cpadCSS"
                    class="vpad_rotation cursor-pointer  shadow-1 relative-position row flex-center"
                >
                    <div class="text-center">
                        <div class="row items-center">
                        <q-icon :name="data.elements.rotation.icon" size="md"></q-icon>
                        </div>
                    </div>
                </q-card>
            </div>
            <div class="col-2">
                <q-card
                    v-touch-pan.prevent.mouse.up.down="onswipe_progress"
                    :class="data.elements.cpadCSS"
                    class="vpad_progress cursor-pointer shadow-1 relative-position row flex-center"
                >
                    <div class="text-center">
                        <div class="row items-center">
                        <q-icon :name="data.elements.progress.icon" size="md"></q-icon>
                        </div>
                    </div>
                </q-card>
            </div>
            <div class="col-5">
                <q-card
                    v-touch-pan.prevent.mouse="onswipe_translation"
                    :class="data.elements.cpadCSS"
                    class="vpad_translation cursor-pointer shadow-1 relative-position row flex-center"
                >
                    <div class="text-center">
                        <div class="row items-center">
                            <q-icon :name="data.elements.translation.icon" size="md"></q-icon>
                        </div>
                    </div>
                </q-card>
            </div>
        </div>
        <div class="row">
            <div class="col-10  q-pl-sm q-pr-sm">
                <q-btn flat round @click="onclick_reset_center_target">
                    <q-tooltip>{{ $t('reset_zaxis')}}</q-tooltip>
                    <q-icon name="flip_camera_android" size="md"></q-icon>
                </q-btn>
                <q-btn flat dense icon="restart_alt" 
                    :label="$t('ribbon_screen_camerareset')" 
                    @click="resetcamera_onclick" no-caps ></q-btn>
                <q-btn flat round v-touch-repeat.mouse="onrepeat_targetzoomin">
                    <q-tooltip>{{ $t('zoomin_camera_et_target')}}</q-tooltip>
                    <q-icon name="zoom_in_map" size="md"></q-icon>
                </q-btn>
                <q-btn flat round  v-touch-repeat.mouse="onrepeat_targetzoomout">
                    <q-tooltip>{{ $t('zoomout_camera_et_target')}}</q-tooltip>
                    <q-icon name="zoom_out_map" size="md"></q-icon>
                </q-btn>
                
            </div>
            
        </div>
    </div>
</div>
`;
const bkup = `
<q-slider v-model="data.elements.rotation.power" class="vpad_slider" label :min="0.5" :max="4" :step="0.1"></q-slider>
<q-slider v-model="data.elements.translation.power" class="vpad_slider" label :min="0.5" :max="4" :step="0.1"></q-slider>
    <div class="text-center">
        <q-btn flat round v-touch-repeat.mouse="onclick_rotation_up"><q-icon name="arrow_upward" size="md"></q-icon></q-btn>
        <div class="row items-center">
            <q-btn flat round v-touch-repeat.mouse="onclick_rotation_left"><q-icon name="arrow_back" size="md"></q-icon></q-btn>
            <q-btn flat round v-touch-repeat.mouse="onclick_rotation_zero"><q-icon name="radio_button_unchecked" size="md"></q-icon></q-btn>
            <q-btn flat round v-touch-repeat.mouse="onclick_rotation_right"><q-icon name="arrow_forward" size="md"></q-icon></q-btn>
        </div>
        <q-btn flat round v-touch-repeat.mouse="onclick_rotation_down"><q-icon name="arrow_downward" size="md"></q-icon></q-btn>
    </div>
    <div class="text-center">
        <q-btn flat round v-touch-repeat.mouse="onclick_translation_up"><q-icon name="arrow_upward" size="md"></q-icon></q-btn>
        <div class="row items-center">
            <q-btn flat round v-touch-repeat.mouse="onclick_translation_left"><q-icon name="arrow_back" size="md"></q-icon></q-btn>
            <q-icon :icon="data.value.elements.translation.icon"></q-icon>
            <q-btn flat round v-touch-repeat.mouse="onclick_translation_zero"><q-icon name="radio_button_unchecked" size="md"></q-icon></q-btn>
            <q-btn flat round v-touch-repeat.mouse="onclick_translation_right"><q-icon name="arrow_forward" size="md"></q-icon></q-btn>
        </div>
        <q-btn flat round v-touch-repeat.mouse="onclick_translation_down"><q-icon name="arrow_downward" size="md"></q-icon></q-btn>
    </div>
`;

export function defineVpadDlg(app, Quasar) {
    app.component("VpadDlg",{
        template : template,
        props : {
            modelValue : Boolean,
            rotateRate : {
                type: Number,
                default : 0.1
            },
            translateRate : {
                type: Number,
                default : 1
            },
        },
        emits : [
            "update:model-value",
            "resetcamera"
        ],
        setup(props, context) {
            const { t  } = VueI18n.useI18n({ useScope: 'global' });

            const {modelValue, rotateRate, translateRate } = Vue.toRefs(props);
            const data = Vue.ref({
                elements : {
                    win : {
                        styles : {
                            position : "absolute",
                            bottom : "-9999px",
                            right : "-9999px",
                            width : "420px",
                            height : "270px",
                            zIndex : 5003,
                            backgroundColor : "#FFFFFF"
                        },
                        position : {
                            x : 0,
                            y : 0
                        },
                    },
                    rotation : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0,0,0)
                    },
                    progress : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0, 0, 0)
                    },
                    translation : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0,0,0)
                    },
                    panelCSS : {
                        "q-dark" : false,
                        "text-dark" : true,
                    },
                    cpadCSS : {
                        "bg-grey-9" : false,
                        "text-white" : false,
                        "bg-grey-1" : true,
                        "text-dark" : true,
                    }
                }
            });
            const show = Vue.ref(false);
            const vpdlg_bar = Vue.ref(null);
            const vpdlg = Vue.ref(null);

            //---watch ----------------------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
                data.value.elements.win.styles.bottom = "0px";
                data.value.elements.win.styles.right = "0px";
            
                data.value.elements.win.position.x = 0;
                data.value.elements.win.position.y = 0;
                vpdlg.value.style.transform =
                    `translate(${data.value.elements.win.position.x}px, ${data.value.elements.win.position.y}px)`;

                //---get current rotation and position of MainCamera
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'GetLastMousePositionFromOuter'},
                    "camerarotation",QD_INOUT.returnJS,
                    (val) => {
                        var js = val.split(",");
                        if (js.length >= 3) {
                            data.value.elements.rotation.current.x = parseFloat(js[0]);
                            data.value.elements.rotation.current.y = parseFloat(js[1]);
                            data.value.elements.rotation.current.z = parseFloat(js[2]);
                            data.value.elements.translation.current.x = parseFloat(js[0]);
                            data.value.elements.translation.current.y = parseFloat(js[1]);
                            data.value.elements.translation.current.z = parseFloat(js[2]);
                            data.value.elements.progress.current.z = parseFloat(js[2]);
                        }
                    }
                ));
                currentValueZero();
                
                /*AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'GetTranslationCameraFromOuter'},
                    "cameraposition",QD_INOUT.returnJS,
                    (val) => {
                        var js = val.split(",");
                        if (js.length >= 3) {
                            data.value.elements.translation.current.x = parseFloat(js[0]);
                            data.value.elements.translation.current.y = parseFloat(js[1]);
                            data.value.elements.translation.current.z = parseFloat(js[2]);
                        }
                    }
                ));
                AppQueue.start();
                */
            });
            const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
                data.value.elements.panelCSS["q-dark"] = newval;
                data.value.elements.panelCSS["text-dark"] = !newval;

                data.value.elements.cpadCSS["bg-grey-9"] = newval;
                data.value.elements.cpadCSS["text-white"] = newval;
                data.value.elements.cpadCSS["bg-grey-1"] = !newval;
                data.value.elements.cpadCSS["text-dark"] = !newval;
            }); 


            //---------------------------------------------------------------------
            //---event
            const close_onclick = () => {
                show.value = false;
                context.emit("update:model-value",show.value);
            }
            const onswipe_rotation = ({evt, ...newInfo}) => {
                //console.log(evt, newInfo);
                data.value.elements.rotation.info = newInfo;
                //data.value.elements.rotation.power = newInfo.duration;

                var moveVal = newInfo.offset;
                moveVal.x = moveVal.x * parseFloat(rotateRate.value);
                moveVal.y = moveVal.y * parseFloat(rotateRate.value);
                //data.value.elements.rotation.current.x = 0;
                //data.value.elements.rotation.current.y = 0;
                var relpos = {x: 0, y: 0};

                if (newInfo.direction == "up") {
                    data.value.elements.rotation.icon = "arrow_upward";
                    data.value.elements.rotation.current.y -= moveVal.y;
                    //relpos.y = -0.5;
                }else if (newInfo.direction == "down") {
                    data.value.elements.rotation.icon = "arrow_downward";
                    data.value.elements.rotation.current.y += moveVal.y;
                    //relpos.y = 0.5;
                }else if (newInfo.direction == "left") {
                    data.value.elements.rotation.icon = "arrow_back";
                    data.value.elements.rotation.current.x -= moveVal.x;
                    //relpos.x = 0.5;
                }else if (newInfo.direction == "right") {
                    data.value.elements.rotation.icon = "arrow_forward";
                    data.value.elements.rotation.current.x += moveVal.x;
                    //relpos.x = -0.5;
                }else{
                    data.value.elements.rotation.icon = "radio_button_unchecked";
                }
                relpos.x = moveVal.x;
                relpos.y = moveVal.y;

                //var param = data.value.elements.rotation.current.x + "," + (data.value.elements.rotation.current.y * -1);
                var param = relpos.x + "," + (relpos.y * -1);
                
                //console.log(param);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'RotateCameraPosFromOuter',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            }
            const onswipe_progress = ({evt, ...newInfo}) => {
                data.value.elements.progress.info = newInfo;

                var moveVal = newInfo.distance;
                moveVal.x = moveVal.x * 0.1;
                moveVal.y = moveVal.y * 0.1;

                var relpos = {x: 0, y: 0, z:0};
                //data.value.elements.translation.current.x = 0;
                //data.value.elements.translation.current.y = 0;
                if (newInfo.direction == "up") {
                    data.value.elements.progress.icon = "arrow_downward";
                    data.value.elements.progress.current.z += moveVal.y;
                    relpos.z = -1 * parseFloat(translateRate.value);
                }else if (newInfo.direction == "down") {
                    data.value.elements.progress.icon = "arrow_upward";
                    data.value.elements.progress.current.z -= moveVal.y;
                    relpos.z = 1 * parseFloat(translateRate.value);
                }else{
                    data.value.elements.progress.icon = "radio_button_unchecked";
                }

                //var param = data.value.elements.translation.current.x + "," + data.value.elements.translation.current.y + "," + data.value.elements.progress.current.z;
                var param = [relpos.x, relpos.y, relpos.z].join(",");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.XR,method:'TranslateCameraPosFromOuter',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            }
            const onswipe_translation = ({evt, ...newInfo}) => {
                
                data.value.elements.translation.info = newInfo;
                //data.value.elements.translation.power = newInfo.duration;
                
                var moveVal = newInfo.distance;
                moveVal.x = moveVal.x * 0.1;
                moveVal.y = moveVal.y * 0.1;

                var relpos = {x: 0, y: 0, z:0};
                //data.value.elements.translation.current.x = 0;
                //data.value.elements.translation.current.y = 0;
                if (newInfo.direction == "up") {
                    data.value.elements.translation.icon = "arrow_downward";
                    data.value.elements.translation.current.y += moveVal.y;
                    relpos.y = -1 * parseFloat(translateRate.value);
                }else if (newInfo.direction == "down") {
                    data.value.elements.translation.icon = "arrow_upward";
                    data.value.elements.translation.current.y -= moveVal.y;
                    relpos.y = 1 * parseFloat(translateRate.value);
                }else if (newInfo.direction == "left") {
                    data.value.elements.translation.icon = "arrow_forward";
                    data.value.elements.translation.current.x -= moveVal.x;
                    relpos.x = 1 * parseFloat(translateRate.value);
                }else if (newInfo.direction == "right") {
                    data.value.elements.translation.icon = "arrow_back";
                    data.value.elements.translation.current.x += moveVal.x;
                    relpos.x = -1 * parseFloat(translateRate.value);
                }else{
                    data.value.elements.translation.icon = "radio_button_unchecked";
                }

                //var param = data.value.elements.translation.current.x + "," + data.value.elements.translation.current.y + "," + data.value.elements.progress.current.z;
                var param = [relpos.x, relpos.y, relpos.z].join(",");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.XR,method:'TranslateCameraPosFromOuter',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            }
            /*
            const onclick_rotation_up = ({evt, ...newInfo}) => {
                onclick_rotation({x:0, y:data.value.elements.rotation.power * 1},newInfo);
            }
            const onclick_rotation_down = ({evt, ...newInfo}) => {
                onclick_rotation({x:0, y:data.value.elements.rotation.power * -1},newInfo);
            }
            const onclick_rotation_left = ({evt, ...newInfo}) => {
                onclick_rotation({x:data.value.elements.rotation.power * -1, y:0},newInfo);
            }
            const onclick_rotation_right = ({evt, ...newInfo}) => {
                onclick_rotation({x:data.value.elements.rotation.power * 1, y:0},newInfo);
            }
            */
           /*
            const onclick_rotation_getmouse = (evt) => {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'GetLastMousePositionFromOuter'},
                    "camerarotation",QD_INOUT.returnJS,
                    (val) => {
                        var js = val.split(",");
                        if (js.length >= 3) {
                            data.value.elements.rotation.current.x = parseFloat(js[0]);
                            data.value.elements.rotation.current.y = parseFloat(js[1]) * -1;
                            data.value.elements.rotation.current.z = parseFloat(js[2]);
                        }
                    }
                ));
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'GetLastMousePositionFromOuter'},
                    "cameraposition",QD_INOUT.returnJS,
                    (val) => {
                        var js = val.split(",");
                        if (js.length >= 3) {
                            data.value.elements.translation.current.x = parseFloat(js[0]);
                            data.value.elements.translation.current.y = parseFloat(js[1]);
                            data.value.elements.translation.current.z = parseFloat(js[2]);
                        }
                    }
                ));
                AppQueue.start();
            }
            const onclick_rotation_zero = ({evt, ...newInfo}) => {
                //onclick_rotation({x:0, y:0},newInfo);
                currentValueZero();
            }
            */
            const onclick_reset_center_target = (evt) => {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'ResetCenterTargetFromOuter'},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            }
            const onrepeat_targetzoomin = ({ evt, ...newInfo }) => {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'MoveCamera2TargetDistance',param:1},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            }
            const onrepeat_targetzoomout = ({ evt, ...newInfo }) => {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'MoveCamera2TargetDistance',param:-1},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            }
            const resetcamera_onclick = () => {
                context.emit("resetcamera","resetcamera");
            }

            //-------------------------------------------------------------------
            //---method
            const currentValueZero = () => {
                data.value.elements.rotation.current.x = 0;
                data.value.elements.rotation.current.y = 0;

                data.value.elements.translation.current.x = 0;
                data.value.elements.translation.current.y = 0;

                data.value.elements.progress.current.z = 0;
            }
            /*
            const onclick_rotation = (vec,newInfo) => {
                if ((vec.x == 0) && (vec.y == 0)) {
                    data.value.elements.rotation.current.x = 0;
                    data.value.elements.rotation.current.y = 0;
                }
                data.value.elements.rotation.current.x += vec.x;
                data.value.elements.rotation.current.y += vec.y;
                var param = data.value.elements.rotation.current.x + "," + (data.value.elements.rotation.current.y * -1);
                console.log(param);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'RotateCameraPosFromOuter',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            }*/
            /*
            const onclick_translation_up = ({evt, ...newInfo}) => {
                onclick_translation({x:0, y:data.value.elements.translation.power * 1},newInfo);
            }
            const onclick_translation_down = ({evt, ...newInfo}) => {
                onclick_translation({x:0, y:data.value.elements.translation.power * -1},newInfo);
            }
            const onclick_translation_left = ({evt, ...newInfo}) => {
                onclick_translation({x:data.value.elements.translation.power * -1, y:0},newInfo);
            }
            const onclick_translation_right = ({evt, ...newInfo}) => {
                onclick_translation({x:data.value.elements.translation.power * 1, y:0},newInfo);
            }
            */
           /*
            const onclick_translation_getmouse = (evt) => {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'GetLastMousePositionFromOuter'},
                    "cameraposition",QD_INOUT.returnJS,
                    (val) => {
                        var js = val.split(",");
                        if (js.length >= 3) {
                            data.value.elements.translation.current.x = parseFloat(js[0]);
                            data.value.elements.translation.current.y = parseFloat(js[1]);
                            data.value.elements.translation.current.z = parseFloat(js[2]);
                        }
                    }
                ));
                AppQueue.start();
            }
            const onclick_translation_zero = ({evt, ...newInfo}) => {
                //onclick_translation({x:0, y:0},newInfo);
                data.value.elements.translation.current.x = 0;
                data.value.elements.translation.current.y = 0;
            }
            */
            /*
            const onclick_translation = (vec,newInfo) => {
                if ((vec.x == 0) && (vec.y == 0)) {
                    
                }
                data.value.elements.translation.current.x -= (vec.x * 4);
                data.value.elements.translation.current.y -= (vec.y * 4);
                var param = data.value.elements.translation.current.x + "," + data.value.elements.translation.current.y;
                console.log(param);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'TranslateCameraPosFromOuter',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            }
            */

            Vue.onMounted(() => {
                interact(vpdlg_bar.value).draggable({
                    modifiers: [
                        interact.modifiers.restrict({
                            restriction: 'parent',
                            endOnly: true
                        })
                    ],
                    listeners : {
                        start(evt) {
                            //console.log("start",evt);
                        },
                        move (event) {
                            data.value.elements.win.position.x += event.dx
                            data.value.elements.win.position.y += event.dy
                      
                            vpdlg.value.style.transform =
                              `translate(${data.value.elements.win.position.x}px, ${data.value.elements.win.position.y}px)`;
                        },
                    },
                });
            });


            return {
                show,data,
                close_onclick,
                onswipe_rotation,onswipe_translation,onswipe_progress,
                //onclick_rotation,
                //onclick_rotation_zero,
                //onclick_rotation_getmouse,
                onclick_reset_center_target,
                onrepeat_targetzoomin, onrepeat_targetzoomout,
                resetcamera_onclick,

                //onclick_translation,
                //onclick_translation_zero,
                //onclick_translation_getmouse,

                //element--------------
                vpdlg,vpdlg_bar,
                //watch----------------
                wa_modelValue,wa_dark,
            }
        }
    });
}