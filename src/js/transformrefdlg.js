import { AnimationRegisterOptions, AnimationTransformRegisterOptions, UnityVector3 } from "./prop/cls_unityrel.js";
import { VVAvatar,  VVCast,  VVTimelineTarget } from "./prop/cls_vvavatar.js";
import { AF_TARGETTYPE, IKBoneType, UserAnimationEase } from "../res/appconst.js";

/*
    KeyFrame Editing dialog
 
    Specification:
        decide way of operatable timeline avatar:
            frame index {Number}: NativeAnimationFrame.index is same to timelineData.states.currentcursor
            target timeline: mainData.states.selectedTimeline
 */
const template = `
<div ref="trdlg" v-show="show" class="rounded-borders shadow-2" :style="trapp.elements.win.styles">
    <div ref="trdlg_bar" v-touch-pan.prevent.mouse="handlePan" class="basic-dialog-titlebar bg-primary text-grey-1 q-pa-xs">
        <div class="row">
            <div>{{ $t('transform refer window') }}</div>
            <q-space></q-space>
            <q-btn flat round dense size="md" icon="clear" @click="close_onclick"></q-btn>
        </div>
    </div>
    <div style="width:100%;height:calc(100% - 40px);overflow:auto;" :class="trapp.elements.panelCSS" class="q-pa-sm">
        <div class="row">
            <div class="col-12">
                <q-list>
                    <q-item>
                        <q-item-section avatar>
                            <q-img :src="cmp_current_avatar_icon"></q-img>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>{{ cmp_current_avatar_title }}</q-item-label>
                            <q-item-label caption>{{ cmp_current_parts }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <q-select v-model="trapp.elements.avatarBox.selected"
                    :options="cmp_avatarlist"
                    :label="$t('refer_avatar')" 
                    
                    :disable="trapp.states.disable"
                    @update:model-value="avatarbox_selected"
                >
                    <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                            <q-item-section avatar>
                                <template v-if="scope.opt.thumbnail != ''">
                                    <q-img :src="scope.opt.thumbnail"></q-img>
                                </template>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>{{ scope.opt.label }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
            </div>
            <div class="col-12" v-if="cmp_avatar_is_vrm">
                <q-select v-model="trapp.elements.vrmParts.selected"
                    :options="cmp_vrmpartslist"
                    :label="$t('refer_parts')" 
                    
                    :disable="trapp.states.disable"
                >
                    <template v-slot:selected-item="scope">
                        <q-item dense>
                            <q-item-section avatar>
                                <template v-if="scope.opt.value == ''">
                                    <div style="width:24px;height:24px"></div>
                                </template>
                                <template v-else>
                                    <img :src="scope.opt.icon" width="24" height="24">
                                </template>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>{{ scope.opt.label }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                            <q-item-section avatar>
                                <template v-if="scope.opt.value == ''">
                                    <div style="width:24px;height:24px"></div>
                                </template>
                                <template v-else>
                                    <img :src="scope.opt.icon" width="24" height="24">
                                </template>
                            </q-item-section>
                            <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
            </div>
        </div>
        <div class="row">
            <div class="col-2">
                <span>Offset</span>
            </div>
            <div class="col-3 q-pr-xs">
                <q-input v-model.number="trapp.elements.offset.x"  type="number" label="X" dense :min="-99.9999999" :max="99.9999999" :step="0.01"></q-input>
            </div>
            <div class="col-3 q-pr-xs">
                <q-input v-model.number="trapp.elements.offset.y"  type="number" label="Y" dense :min="-99.9999999" :max="99.9999999" :step="0.01"></q-input>
            </div>
            <div class="col-3">
                <q-input v-model.number="trapp.elements.offset.z" type="number" label="Z" dense :min="-99.9999999" :max="99.9999999" :step="0.01"></q-input>
            </div>
        </div>
        <div class="row">
            <div class="col-4">
                <q-btn icon="control_camera" size="md" :label="$t('position')"
                    @click="transform_onchange('position')"
                    :disable="trapp.states.disable"
                >
                    <q-tooltip>
                        {{ $t('position') }}
                    </q-tooltip>
                </q-btn>
            </div>
            <div class="col-4">
                <q-checkbox v-model="trapp.elements.chk_rotate_reverse">
                    <q-icon name="360" size="sm"></q-icon>
                    <q-tooltip>{{ $t("reverse pose") }}</q-tooltip>
                </q-checkbox>
            </div>
            <div class="col-4">
                <q-btn icon="follow_the_signs" size="md" :label="$t('refer_direction')"
                    @click="transform_onchange('rotation')"
                    :disable="trapp.states.disable"
                >
                    <q-tooltip>
                        {{ $t('refer_direction') }}
                    </q-tooltip>
                </q-btn>
            </div>
        </div>

    </div>
</div>
`;

class BaseData{
    constructor() {
        this.elements = {
            win : {
                styles : {
                    position : "absolute",
                    bottom : "0px",
                    right : "0px",
                    //top : "0px",
                    width : "320px",
                    height : "340px",
                    zIndex : 5005,
                    backgroundColor : "#FFFFFF"
                },
                position : {
                    x : 0,
                    y : 0
                },
            },
            panelCSS : {
                "q-dark" : false,
                "text-dark" : true,
            },
            avatarBox : {
                /**
                 * @type {{label:String, value:VVCast}[]}
                 */
                options: [],
                selected: { label: "---", value:null}
            },
            vrmParts : {
                /**
                 * @type {{label:String, cast:VVCast, value: String}}
                 */
                options: [],
                selected: { label: "---", cast: null, value:""}
            },
            rad_transformtype: "position",
            offset: {
                x: 0,
                y: 0,
                z: 0
            },
            chk_rotate_reverse: false,
        };
        this.data = {
            
        };
        this.states = {
            
            disable: false,
        };
    }
}

export function defineTransformRefDlg(app, Quasar) {
    app.component("TransformrefDlg",{
        template : template,
        props : {
            modelValue : Boolean,
            currentCast: VVCast,
            currentParts : String,
            avatars: Array,
        },
        emits : [
            "update:model-value"
        ],
        setup(props, context) {
            const {modelValue, currentCast, currentParts, avatars } = Vue.toRefs(props);
            const { t  } = VueI18n.useI18n({ useScope: 'global' });

            const show = Vue.ref(false);
            /**
             * @type {BaseData}
             */
            const trapp = Vue.reactive(new BaseData());

            const trdlg_bar = Vue.ref(null);
            const trdlg = Vue.ref(null);

            

            //===watch=================================================================
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
                if (Quasar.Screen.xs || (ID("uimode").value == "mobile")) {
                    trapp.elements.win.styles.top = `${Quasar.Screen.height * 0.1}px`;
                    trapp.elements.win.styles["max-height"] = `${Quasar.Screen.height * 0.95}px`;
                    //---size
                    if (Quasar.Screen.xs) {
                        trapp.elements.win.styles.width = `${Quasar.Screen.width * 0.95}px`;
                    }else{
                        trapp.elements.win.styles.width = "320px";
                    }

                }else{
                    trapp.elements.win.styles.bottom = "0px";
                    delete trapp.elements.win.styles["top"];
                }
                
                trapp.elements.win.styles.right = "0px";
            
                trapp.elements.win.position.x = 0;
                trapp.elements.win.position.y = 0;
                trdlg.value.style.transform =
                    `translate(${trapp.elements.win.position.x}px, ${trapp.elements.win.position.y}px)`;


                if (newval === true) {
                    common_loadUnityConfig(currentCast.value, currentParts.value);

                }
            });
            const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
                trapp.elements.panelCSS["q-dark"] = newval;
                trapp.elements.panelCSS["text-dark"] = !newval;
            });
            const wa_cast = Vue.watch(() => currentCast.value, (newval, oldval) => {
                if (newval.avatar.type == AF_TARGETTYPE.Stage) {
                    trapp.states.disable = true;
                }else{
                    trapp.states.disable = false;
                }
            });
            /**
             * 
             * @param {VVCast} cast 
             * @param {String} parts
             * @returns 
             */
            const common_loadUnityConfig = (cast, parts) => {
                
            }
            //===computed=================================================================
            const cmp_current_avatar_title = Vue.computed(() => {
                var ret = "";
                /**
                 * @type {VVCast}
                 */
                var cast = currentCast.value;
                if (cast) {
                    ret = cast.avatar.title;
                }
                return ret;
            });
            const cmp_current_avatar_icon = Vue.computed(() => {
                var ret = "";
                /**
                 * @type {VVCast}
                 */
                var cast = currentCast.value;
                if (cast) {
                    ret = cast.avatar.thumbnail;
                }
                return ret;
            });
            const cmp_current_parts = Vue.computed(() => {
                var ret = "";

                ret = currentParts.value;
                if (ret.indexOf("trueikparent") > -1) {
                    ret = "All"
                }
                return ret;
            });
            const cmp_avatar_is_vrm = Vue.computed(() => {
                var ret = false;
                if (trapp.elements.avatarBox.selected) {
                    if (trapp.elements.avatarBox.selected.value != null) {
                        /**
                         * @type {VVCast}
                         */
                        var cast = trapp.elements.avatarBox.selected.value;
                        if (cast.type == AF_TARGETTYPE.VRM) {
                            ret = true;
                        }
                    }
                }
                return ret;
            });
            const cmp_avatarlist = Vue.computed(() => {
                var ret = [ { label: "---", value:null}, { label: "MainCamera", thumbnail: "static/img/pic_camera.png", value:"maincamera"}];
                //console.log(vrms.value);
                for (var i = 0; i < avatars.value.length; i++) {
                    /**
                     * @type {VVCast}
                     */
                    var obj = avatars.value[i];
                    if (obj.avatar) {
                        if ((obj.type != AF_TARGETTYPE.SystemEffect) && 
                            (obj.type != AF_TARGETTYPE.Audio) &&
                            (obj.type != AF_TARGETTYPE.Stage) &&
                            (obj.type != AF_TARGETTYPE.Text)  &&
                            (obj.type != AF_TARGETTYPE.UImage) 
                        ) {
                            if (obj.avatar.id != currentCast.value.avatar.id) {
                                ret.push({
                                    label : obj.roleTitle,
                                    thumbnail : obj.avatar.thumbnail,
                                    value: obj
                                });
                            }
                        }
                    }
                    
                }
                return ret;
            });
            const cmp_vrmpartslist = Vue.computed(() => {
                return reloadVRMParts();
            });
            //===method=================================================================
            const handlePan = ({ evt, ...newInfo }) => {
                var dx = newInfo.delta.x;
                var dy = newInfo.delta.y;
                trapp.elements.win.position.x += dx;
                trapp.elements.win.position.y += dy;
            
                trdlg.value.style.transform =
                    `translate(${trapp.elements.win.position.x}px, ${trapp.elements.win.position.y}px)`;
            }
            const reloadVRMParts = () => {
                var ret = [{ label: "---", cast:null, value:""}];
                if (trapp.elements.avatarBox.selected) {
                    if (trapp.elements.avatarBox.selected.value != null) {
                        /**
                         * @type {VVCast}
                         */
                        var cast = trapp.elements.avatarBox.selected.value;
                        if (cast.avatar.type == AF_TARGETTYPE.VRM) {
                            for (var obj in IKBoneType) {
                                if ((obj != "None") && (obj != "IKParent") && (obj != "Unknown")) {
                                    ret.push({
                                        label: obj,
                                        cast: cast,
                                        icon : (cast.value == "" ? cast.value : "static/img/vvmico_bn_" + obj.toLocaleLowerCase() + ".png"),
                                        value: obj
                                    });
                                }
                            }
                        }
                    }
                }
                return ret;
            }
            //===events=================================================================
            const close_onclick = () => {
                show.value = false;
                context.emit("update:model-value",show.value);
            }
            const avatarbox_selected = () => {
                trapp.elements.vrmParts.options = reloadVRMParts();
                trapp.elements.vrmParts.selected = trapp.elements.vrmParts.options[0];
            }
            const transform_onchange = (transformtype) => {

                /**
                 * @type {VVCast}
                 */
                let cast = trapp.elements.avatarBox.selected.value;
                let parts = trapp.elements.vrmParts.selected.value;
                let vec = trapp.elements.offset;
                var avatarid = (cast == "maincamera") ? cast : cast.avatarId;
                var isrev = trapp.elements.chk_rotate_reverse ? "1" : "0";

                var param = `${avatarid},${parts},${currentParts.value},${vec.x},${vec.y},${vec.z},${isrev}`;
                if (transformtype == "position") {
                    AppQueue.add(new queueData(
                        {target:currentCast.value.avatarId,method:'SetPositionIKMarkerFromOuter',param:param},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                }
                else if (transformtype == "rotation") {
                    AppQueue.add(new queueData(
                        {target:currentCast.value.avatarId,method:'SetRotationIKMarkerFromOuter',param:param},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                }
                
                
                AppQueue.start();
            }
            

            //===lifecycle=================================================================
            Vue.onBeforeMount(() => {
            });
            Vue.onMounted(() => {
                
            });
            Vue.onBeforeUnmount(() => {
                
            });

            return {
                show, trapp, trdlg_bar, trdlg,
                //---watch---
                wa_modelValue,wa_dark,
                //---computed---
                cmp_current_avatar_title, cmp_current_avatar_icon, cmp_current_parts,
                cmp_avatar_is_vrm, cmp_avatarlist, cmp_vrmpartslist,
                //---method---
                
                //---event---
                close_onclick, transform_onchange,avatarbox_selected,
                handlePan
            }
        }
    });
}