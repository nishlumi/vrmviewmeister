import { UnityVector3 } from "./prop/cls_unityrel";

const template = `
<div ref="vpdlg" v-show="show" class="rounded-borders shadow-2" :style="data.elements.win.styles">
    <div ref="vpdlg_bar" v-touch-pan.prevent.mouse="handlePan" class="basic-dialog-titlebar bg-primary text-grey-1 q-pa-xs" :style="data.elements.titlebar.styles">
        <div class="row">
            <div>{{ $t('title_virtualpad') }}</div>
            <q-space></q-space>
            <q-btn flat round dense size="md" icon="clear" @click="close_onclick"></q-btn>
        </div>
        
    </div>
    <div :class="data.elements.panelCSS" style="width:100%;height:calc(100% - 40px);">
    <div class="row">
            <div class="col-4 offset-1" style="text-align:center"><q-icon name="open_with" size="sm"></q-icon></div>
            <div class="col-2" style="text-align:center"><q-icon name="height" size="md"></q-icon></div>
            <!--<div class="col-2" style="text-align:center">{{ $t('targetzoom_camera') }}</div>-->
            <div class="col-4" style="text-align:center"><q-icon name="360" size="sm"></q-icon></div>
        </div>
        <div class="row">
            <div class="col-4 offset-1">
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
            <!--div class="col-2">
                <q-card
                    v-touch-pan.prevent.mouse.up.down="onswipe_targetzoom"
                    :class="data.elements.cpadCSS"
                    class="vpad_progress cursor-pointer shadow-1 relative-position row flex-center"
                >
                    <div class="text-center">
                        <div class="row items-center">
                        <q-icon :name="data.elements.targetzoom.icon" size="md"></q-icon>
                        </div>
                    </div>
                </q-card>
            </div-->
            <div class="col-4">
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
        </div>
        <div class="row">
            <div class="col-4 q-pl-sm">
                <q-btn flat round @click="onclick_reset_center_target">
                    <q-tooltip>{{ $t('reset_zaxis')}}</q-tooltip>
                    <q-icon name="flip_camera_android" size="md"></q-icon>
                </q-btn>
                <q-btn flat dense icon="restart_alt" 
                    label="Reset" 
                    @click="resetcamera_onclick" no-caps 
                    class="q-mr-sm"
                >
                    <q-tooltip>{{$t('ribbon_screen_camerareset')}}</q-tooltip>
                </q-btn>
            
            </div>
            <div class="col-4 q-pl-xs q-pr-sm">
                <q-btn  :icon="data.elements.tgl_changetarget.icon"
                    @click="changetarget_onchange(data.elements.tgl_changetarget.selected)">
                    <q-tooltip>{{ data.elements.tgl_changetarget.tooltip }}</q-tooltip>
                </q-btn>
                <q-field borderless label="Target" stack-label>
                    <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{ data.elements.tgl_changetarget.tooltip }}</div>
                    </template>
                </q-field>
            </div>
            <div class="col-4 q-pl-xs q-pr-sm">
                <template v-if="data.elements.tgl_changetarget.selected == 'o'">
                    <q-btn  :icon="data.elements.tgl_changespace.icon"
                        @click="changespace_onchange(data.elements.tgl_changespace.selected)">
                        <q-tooltip>{{ data.elements.tgl_changespace.tooltip }}</q-tooltip>
                    </q-btn>
                    <q-field borderless label="Space" stack-label>
                        <template v-slot:control>
                        <div class="self-center full-width no-outline" tabindex="0">{{ data.elements.tgl_changespace.tooltip }}</div>
                        </template>
                    </q-field>
                </template>

                <!--
                <q-btn-toggle
                    v-model="data.elements.tgl_changetarget.selected"
                    toggle-color="primary" no-caps
                    :options="data.elements.tgl_changetarget.options"
                    @update:model-value="changetarget_onchange"
                >
                    <template v-slot:one>
                        <div class="row items-center no-wrap">
                            <q-icon name="videocam">
                                <q-tooltip>Main camera</q-tooltip>
                            </q-icon>
                        </div>
                    </template>
            
                    <template v-slot:two>
                        <div class="row items-center no-wrap">
                            <q-icon name="dashboard_customize">
                                <q-tooltip>Object</q-tooltip>
                            </q-icon>
                        </div>
                    </template>
                </q-btn-toggle>
                <template v-if="data.elements.tgl_changetarget.selected == 'o'">
                    <q-btn-toggle class="q-ml-md"
                        v-model="data.elements.tgl_changespace.selected"
                        toggle-color="primary" no-caps
                        :options="data.elements.tgl_changespace.options"
                        @update:model-value="changespace_onchange"
                    >
                        <template v-slot:one>
                            <div class="row items-center no-wrap">
                                <q-icon name="public">
                                    <q-tooltip>World</q-tooltip>
                                </q-icon>
                            </div>
                        </template>
                
                        <template v-slot:two>
                            <div class="row items-center no-wrap">
                                <q-icon name="self_improvement">
                                    <q-tooltip>Local</q-tooltip>
                                </q-icon>
                            </div>
                        </template>
                    </q-btn-toggle>
                </template>
                -->

            </div>
            
            
        </div>
    </div>
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
            uimode : {
                type: String,
                default: "pc"
            },
            posbottom : {
                type: Number,
                default: 0
            },
            posright : {
                type: Number,
                default: 0
            },
            target : {
                type: Object,
                default: null
            },
            space : {
                type: Object,
                default: null
            }
        },
        emits : [
            "update:model-value",
            "resetcamera",
            "applychangeflags"
        ],
        setup(props, context) {
            const { t  } = VueI18n.useI18n({ useScope: 'global' });

            const {modelValue, rotateRate, translateRate,uimode,posbottom,posright,target,space } = Vue.toRefs(props);
            const data = Vue.ref({
                elements : {
                    win : {
                        styles : {
                            position : "absolute",
                            bottom : "-9999px",
                            right : "-9999px",
                            width : "420px",
                            height : "250px",
                            zIndex : 2900,
                            backgroundColor : "#FFFFFF"
                        },
                        position : {
                            x : 0,
                            y : 0
                        },
                    },
                    titlebar : {
                        styles : {
                            display : "block",
                        }
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
                    targetzoom : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0, 0, 0)
                    },
                    tgl_changetarget: {
                        options : [
                            {value:"c", slot:"one"},
                            {value:"o", slot:"two"}
                        ],
                        selected: "c",
                        icon : "videocam", //videocam, dashboard_customize
                        tooltip: "Main Camera", //Main camera Object
                    },
                    tgl_changespace: {
                        options : [
                            {value:"w", slot:"one"},
                            {value:"l", slot:"two"}
                        ],
                        selected: "w",
                        icon : "public", //public, self_improvement
                        tooltip: "World" //World, Local
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
                if (uimode.value == "mobile") {
                    data.value.elements.titlebar.styles.display = "none";
                    //data.value.elements.win.styles.bottom = `${posbottom.value}px`;
                    //data.value.elements.win.styles.right = `${posright.value}px`;
                    data.value.elements.win.styles.bottom = "0";
                    data.value.elements.win.styles.right = "0";

                    data.value.elements.win.styles.height = "max-content";
                    data.value.elements.win.styles["top"] = `${Quasar.Screen.height - 180 - 48 - 10}px`;
                    data.value.elements.win.styles["left"] = "0px";
                    data.value.elements.win.styles.width = "100%";
                }
            
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
            const wa_target = Vue.watch(() => target.value,(newval) => {
                if (newval != null) {
                    data.value.elements.tgl_changetarget.selected = newval.selected;
                    data.value.elements.tgl_changetarget.icon = newval.icon;
                    data.value.elements.tgl_changetarget.tooltip = newval.tooltip;

                }
            },{deep:true});
            const wa_space = Vue.watch(() => space.value,(newval) => {
                if (newval != null) {
                    data.value.elements.tgl_changespace.selected = newval.selected;
                    data.value.elements.tgl_changespace.icon = newval.icon;
                    data.value.elements.tgl_changespace.tooltip = newval.tooltip;

                }
            },{deep:true});


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
                //newly: synchronize with Gamepad (rotation) old:RotateCameraPosFromOuter
                var param = relpos.x + "," + (relpos.y * -1);
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'VpadRightStickFromOuter',param:param},
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
                    data.value.elements.progress.icon = "arrow_upward";
                    data.value.elements.progress.current.z += moveVal.y;
                    relpos.y = 1 * parseFloat(translateRate.value);
                }else if (newInfo.direction == "down") {
                    data.value.elements.progress.icon = "arrow_downward";
                    data.value.elements.progress.current.z -= moveVal.y;
                    relpos.y = -1 * parseFloat(translateRate.value);
                }else{
                    data.value.elements.progress.icon = "radio_button_unchecked";
                }

                //var param = data.value.elements.translation.current.x + "," + data.value.elements.translation.current.y + "," + data.value.elements.progress.current.z;
                //newly: synchronize with Gamepad (top, down)
                var param = [relpos.x, relpos.y].join(",");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.XR,method:'VpadDpadFromOuter',param:param},
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
                    data.value.elements.translation.icon = "arrow_upward";
                    data.value.elements.translation.current.y += moveVal.y;
                    relpos.z = 1 * parseFloat(translateRate.value);
                }else if (newInfo.direction == "down") {
                    data.value.elements.translation.icon = "arrow_downward";
                    data.value.elements.translation.current.y -= moveVal.y;
                    relpos.z = -1 * parseFloat(translateRate.value);
                }else if (newInfo.direction == "left") {
                    data.value.elements.translation.icon = "arrow_back";
                    data.value.elements.translation.current.x -= moveVal.x;
                    relpos.x = -1 * parseFloat(translateRate.value);
                }else if (newInfo.direction == "right") {
                    data.value.elements.translation.icon = "arrow_forward";
                    data.value.elements.translation.current.x += moveVal.x;
                    relpos.x = 1 * parseFloat(translateRate.value);
                }else{
                    data.value.elements.translation.icon = "radio_button_unchecked";
                }

                //var param = data.value.elements.translation.current.x + "," + data.value.elements.translation.current.y + "," + data.value.elements.progress.current.z;
                
                //---newly: synchronize with GamePad (front, back, left, right of translation)
                var param = [relpos.x, relpos.z].join(",");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.XR,method:'VpadLeftStickFromOuter',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            }
            const onswipe_targetzoom = ({evt, ...newInfo}) => {
                data.value.elements.targetzoom.info = newInfo;

                var moveVal = newInfo.distance;
                moveVal.x = moveVal.x * 0.1;
                moveVal.y = moveVal.y * 0.1;

                var relpos = {x: 0, y: 0, z:0};
                //data.value.elements.translation.current.x = 0;
                //data.value.elements.translation.current.y = 0;
                if (newInfo.direction == "up") {
                    data.value.elements.targetzoom.icon = "zoom_in_map";
                    data.value.elements.targetzoom.current.z += moveVal.y;
                    relpos.z = -1 * parseFloat(translateRate.value);
                }else if (newInfo.direction == "down") {
                    data.value.elements.targetzoom.icon = "zoom_out_map";
                    data.value.elements.targetzoom.current.z -= moveVal.y;
                    relpos.z = 1 * parseFloat(translateRate.value);
                }else{
                    data.value.elements.targetzoom.icon = "radio_button_unchecked";
                }

                //var param = data.value.elements.translation.current.x + "," + data.value.elements.translation.current.y + "," + data.value.elements.progress.current.z;

                var param = [relpos.x, relpos.y, relpos.z].join(",");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.XR,method:'MoveCamera2TargetDistance',param:relpos.z},
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
            const changetarget_onchange = (val) => {
                console.log(val);
                if (val == "o") {
                    var param = "L1";
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.Camera,method:'VpadKeyFromOuter',param:param},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                    AppQueue.start();
                    data.value.elements.tgl_changetarget.selected = "c";
                    data.value.elements.tgl_changetarget.icon = "videocam";
                    data.value.elements.tgl_changetarget.tooltip = "Main camera";
                }else if (val == "c") {
                    var param = "R1";
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.Camera,method:'VpadKeyFromOuter',param:param},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                    AppQueue.start();
                    data.value.elements.tgl_changetarget.selected = "o";
                    data.value.elements.tgl_changetarget.icon = "dashboard_customize";
                    data.value.elements.tgl_changetarget.tooltip = "Object";
                }
                context.emit("applychangeflags",{
                    "target":data.value.elements.tgl_changetarget,
                    "space" :data.value.elements.tgl_changespace
                });
            }
            const changespace_onchange = (val) => {
                var param = "select";
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.Camera,method:'VpadKeyFromOuter',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
                var val = data.value.elements.tgl_changespace.selected;
                if (val == "w") { //---to local
                    data.value.elements.tgl_changespace.selected = "l";
                    data.value.elements.tgl_changespace.icon = "self_improvement";
                    data.value.elements.tgl_changespace.tooltip = "Local";
                }else if (val == "l") { //---to world
                    data.value.elements.tgl_changespace.selected = "w";
                    data.value.elements.tgl_changespace.icon = "public";
                    data.value.elements.tgl_changespace.tooltip = "World";
                }
                context.emit("applychangeflags",{
                    "target":data.value.elements.tgl_changetarget,
                    "space" :data.value.elements.tgl_changespace
                });
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

            const handlePan = ({ evt, ...newInfo }) => {
                var dx = newInfo.delta.x;
                var dy = newInfo.delta.y;
                data.value.elements.win.position.x += dx;
                data.value.elements.win.position.y += dy;
            
                vpdlg.value.style.transform =
                    `translate(${data.value.elements.win.position.x}px, ${data.value.elements.win.position.y}px)`;
            }

            Vue.onMounted(() => {
                /*
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
                */
            });


            return {
                show,data,
                close_onclick,handlePan,
                onswipe_rotation,onswipe_translation,onswipe_progress,onswipe_targetzoom,
                //onclick_rotation,
                //onclick_rotation_zero,
                //onclick_rotation_getmouse,
                onclick_reset_center_target,
                onrepeat_targetzoomin, onrepeat_targetzoomout,
                resetcamera_onclick,

                changetarget_onchange,
                changespace_onchange,

                //onclick_translation,
                //onclick_translation_zero,
                //onclick_translation_getmouse,

                //element--------------
                vpdlg,vpdlg_bar,
                //watch----------------
                wa_modelValue,wa_dark,wa_target,wa_space,
            }
        }
    });
}