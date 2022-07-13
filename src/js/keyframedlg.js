import { AnimationRegisterOptions } from "./prop/cls_unityrel.js";
import { VVAvatar,  VVCast,  VVTimelineTarget } from "./prop/cls_vvavatar.js";
import { UserAnimationEase } from "../res/appconst.js";

const template = `
<div ref="kfdlg" v-show="show" class="rounded-borders shadow-2" :style="kfapp.elements.win.styles">
    <div ref="kfdlg_bar" class="basic-dialog-titlebar bg-primary text-grey-1 q-pa-xs">
        <div class="row">
            <div>{{ $t('edit keyframe') }}</div>
            <q-space></q-space>
            <q-btn flat round dense size="md" icon="clear" @click="close_onclick"></q-btn>
        </div>
    </div>
    <div style="width:100%;height:calc(100% - 40px);" :class="kfapp.elements.panelCSS" class="q-pa-sm">
        
        <div class="row">
            <div class="col-9">
                <div v-if="checkAvailableTimeline" class="ellipsis">
                    <q-avatar>
                        <img :src="showAvatarImage" alt="avatar">
                    </q-avatar>
                    {{ showAvatarName }}
                </div>
            </div>
            <div class="col-2 offset-1">
                <q-btn round icon="restart_alt" size="sm" 
                    @click="resetduration_onclick"
                    :disable="kfapp.states.disable"
                >
                    <q-tooltip>{{ $t('reset_duration') }}</q-tooltip>
                </q-btn>
            </div>
        </div>
        <div class="row">
            <div class="col-8">
                <q-input v-model="kfapp.elements.frameIndex" dense filled 
                    :label="$t('frame')" type="number"
                    :min="1" :max="maxframeNumber" :step="1"
                    @update:model-value="frameno_onchange"
                    :disable="kfapp.states.disable"
                ></q-input>
            </div>
            <div class="col-4 q-pl-md">
                <q-btn round icon="edit" size="sm"
                    @click="editframeno_onclick"
                    :disable="kfapp.states.disableFrameBtn"
                ></q-btn>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <q-select v-model="kfapp.elements.easing.selected"
                    :options="kfapp.elements.easing.options"
                    :label="$t('easing')" 
                    @update:model-value="easing_onchange"
                    :disable="kfapp.states.disable"
                ></q-select>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <q-input v-model="kfapp.elements.duration" type="number"
                    :min="0.00000001" :max="4.99999999" :step="0.00000001" 
                    :label="$t('duration')" filled
                    @update:model-value="duration_onchange"
                    :disable="kfapp.states.disable"
                ></q-input>
            </div>
        </div>
    </div>
</div>
`;

export function defineKeyframeDlg(app, Quasar) {
    app.component("KeyframeDlg",{
        template : template,
        props : {
            modelValue : Boolean,
            frameIndex : Number,
            timeline : VVTimelineTarget,
            maxframeNumber : Number
        },
        emits : [
            "update:model-value",
        ],
        setup(props, context) {
            const {modelValue, frameIndex, timeline,maxframeNumber } = Vue.toRefs(props);
            const { t  } = VueI18n.useI18n({ useScope: 'global' });

            const show = Vue.ref(false);
            const kfapp = Vue.ref({
                elements : {
                    win : {
                        styles : {
                            position : "absolute",
                            bottom : "-9999px",
                            right : "-9999px",
                            width : "250px",
                            height : "270px",
                            zIndex : 5004,
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
                    target : null,
                    frameIndex : 0,
                    duration : 0.01,
                    easing : {
                        options : [],
                        selected : UserAnimationEase.Unset
                    }
                },
                states : {
                    oldFrameIndex : -1,
                    disable : false,
                    disableFrameBtn : false,
                }
                
            });
            const kfdlg_bar = Vue.ref(null);
            const kfdlg = Vue.ref(null);


            //---watch-----------------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
                kfapp.value.elements.win.styles.bottom = "0px";
                kfapp.value.elements.win.styles.right = "0px";
            
                kfapp.value.elements.win.position.x = 0;
                kfapp.value.elements.win.position.y = 0;
                kfdlg.value.style.transform =
                    `translate(${kfapp.value.elements.win.position.x}px, ${kfapp.value.elements.win.position.y}px)`;

                var fkey = timeline.value.getFrameByKey(frameIndex.value);
                if (fkey) {
                    kfapp.value.states.disable = false;
                    kfapp.value.states.disableFrameBtn = false;
                }else{
                    kfapp.value.states.disable = true;
                    kfapp.value.states.disableFrameBtn = true;
                }

                if (newval === true) {
                    common_loadUnityConfig(timeline.value.target, kfapp.value.elements.frameIndex);
                }
            });
            const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
                kfapp.value.elements.panelCSS["q-dark"] = newval;
                kfapp.value.elements.panelCSS["text-dark"] = !newval;
            }); 
            /**
             * 
             * @param {VVCast} cast 
             * @param {Number} frameKey
             * @returns 
             */
            const common_loadUnityConfig = (cast, frameKey) => {
                var aro = new AnimationRegisterOptions();
                aro.targetRole = cast.roleName;
                aro.targetType = cast.type;
                aro.index = frameKey;

                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'GetEaseFromOuter',param:JSON.stringify(aro)},
                    "getease",QD_INOUT.returnJS,
                    (val) => {
                        var ishit = kfapp.value.elements.easing.options.find(item => {
                            if (item.value == val) return true;
                            return false;
                        })
                        if (ishit) {
                            kfapp.value.elements.easing.selected = ishit;
                        }
                    }
                ));
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'GetDurationFromOuter',param:JSON.stringify(aro)},
                    "getduration",QD_INOUT.returnJS,
                    (val) => {
                        //console.log(val);
                        kfapp.value.elements.duration = Math.floor(parseFloat(val) * 10000000) / 10000000;
                    }
                ));
                AppQueue.start();
            }

            //---------------------------------------------
            //  change selection of frame index 
            const wa_frameIndex = Vue.watch(() => frameIndex.value, (newval) => {
                kfapp.value.elements.frameIndex = newval;
                kfapp.value.states.oldFrameIndex = newval;
                if ((timeline.value) &&  (kfapp.value.elements.frameIndex > 0)) {
                    //---connect the Unity only when dialog opened
                    var fkey = timeline.value.getFrameByKey(newval);
                    if (fkey) {
                        kfapp.value.states.disable = false;
                        kfapp.value.states.disableFrameBtn = false;
                        if (show.value === true) {
                            common_loadUnityConfig(timeline.value.target, kfapp.value.elements.frameIndex);
                        }
                    }else{
                        kfapp.value.states.disable = true;
                        kfapp.value.states.disableFrameBtn = true;
                    }
                    
                }
            });
            const wa_timeline = Vue.watch(() => timeline.value, (newval) => {
                if ((newval) && (kfapp.value.elements.frameIndex > 0)) {
                    //---connect the Unity only when dialog opened
                    if (show.value === true) {
                        common_loadUnityConfig(newval.target, kfapp.value.elements.frameIndex);
                    }
                    //---connect the Unity only when dialog opened
                    var fkey = newval.getFrameByKey(frameIndex.value);
                    if (fkey) {
                        kfapp.value.states.disable = false;
                        kfapp.value.states.disableFrameBtn = false;
                        if (show.value === true) {
                            common_loadUnityConfig(timeline.value.target, kfapp.value.elements.frameIndex);
                        }
                    }else{
                        kfapp.value.states.disable = true;
                        kfapp.value.states.disableFrameBtn = true;
                    }
                }
                
            });

            //---computed-------------------------------
            const checkAvailableTimeline = Vue.computed(() => {
                return timeline.value && timeline.value.target && timeline.value.target.avatar;
            });
            const showAvatarName = Vue.computed(() => {
                return (timeline.value.target.avatar != null) ? timeline.value.target.avatar.title : "";
            });
            const showAvatarImage = Vue.computed(() => {
                return (timeline.value.target.avatar.thumbnail != "") ? timeline.value.target.avatar.thumbnail : "";
            });

            //---method----------------------------------
            const close_onclick = () => {
                show.value = false;
                context.emit("update:model-value",show.value);
            }
            const resetduration_onclick = () => {
                if (timeline.value.target.avatar == null) return;
    
                var aro = new AnimationRegisterOptions();
                aro.targetId = timeline.value.target.avatarId;
                aro.targetRole = timeline.value.target.roleName;
                aro.targetType = timeline.value.target.type;
                aro.index = kfapp.value.elements.frameIndex;
        
                var param = JSON.stringify(aro);
        
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'ResetAutoDuration',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                
                AppQueue.start();
            }
            const easing_onchange = (val) => {
                var newval = val.value;
    
                if (timeline.value == null) return;
    
                var aro = new AnimationRegisterOptions();
                aro.targetId = timeline.value.target.avatarId;
                aro.targetRole = timeline.value.target.roleName;
                aro.targetType = timeline.value.target.type;
                aro.index = kfapp.value.elements.frameIndex;
                aro.ease = newval;
    
                var param = JSON.stringify(aro);
                
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'SetEase',param:JSON.stringify(aro)},
                    "setease",QD_INOUT.returnJS,
                    (val)=>{
                        var js = JSON.parse(val);
                        //console.log(js);
                    }
                ));
                
                AppQueue.start();
            }
            const duration_onchange = (val) => {
                if (timeline.value == null) return;
    
                var aro = new AnimationRegisterOptions();
                aro.targetId = timeline.value.target.avatarId;
                aro.targetRole = timeline.value.target.roleName;
                aro.targetType = timeline.value.target.type;
                aro.index = kfapp.value.elements.frameIndex;
                aro.duration = parseFloat(val);
        
                var param = JSON.stringify(aro);
        
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'SetDuration',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                
                AppQueue.start();
            }
            const frameno_onchange = (value) => {
                var param = `${timeline.value.target.roleName},${timeline.value.target.type},${value}`;
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'GetFrameFromOuter',param:param},
                    "getframedata",QD_INOUT.returnJS,
                    (val, options) => {
                        if (val == "") {
                            kfapp.value.states.disableFrameBtn = false;
                        }else{
                            //---if already exist key-frame, disable edit button
                            kfapp.value.states.disableFrameBtn = true;
                        }
                    },
                    {oldindex: parseInt(kfapp.value.states.oldFrameIndex)}
                ));
                AppQueue.start();
            }
            const editframeno_onclick = () => {
                var param = `${timeline.value.target.avatarId},${timeline.value.target.type},${kfapp.value.states.oldFrameIndex},${kfapp.value.elements.frameIndex}`;
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'ChangeFramePosition',param:param},
                    "changeframepos",QD_INOUT.returnJS,
                    (val, options) => {
                        if (val > -1) {
                            timeline.value.exchangeFrame(options.oldindex, kfapp.value.elements.frameIndex);
                            kfapp.value.states.oldFrameIndex = kfapp.value.elements.frameIndex;
                        }
                        
                    },
                    {oldindex: parseInt(kfapp.value.states.oldFrameIndex)}
                ));
                AppQueue.start();
                
            }

            Vue.onMounted(() => {
                for (var obj in UserAnimationEase) {
                    kfapp.value.elements.easing.options.push({
                        label : GetEnumName(UserAnimationEase, UserAnimationEase[obj]),
                        value : UserAnimationEase[obj]
                    });
                }
                kfapp.value.elements.easing.selected = kfapp.value.elements.easing.options[0];

                interact(kfdlg_bar.value).draggable({
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
                            kfapp.value.elements.win.position.x += event.dx
                            kfapp.value.elements.win.position.y += event.dy
                      
                            kfdlg.value.style.transform =
                              `translate(${kfapp.value.elements.win.position.x}px, ${kfapp.value.elements.win.position.y}px)`;
                        },
                    },
                });
            });

            return {
                show,   kfapp,
                kfdlg_bar,kfdlg,
                //---watch---
                wa_modelValue,wa_frameIndex,wa_timeline,
                //---computed---
                checkAvailableTimeline,showAvatarName,showAvatarImage,
                //---method---
                close_onclick,resetduration_onclick,
                easing_onchange,duration_onchange,frameno_onchange,editframeno_onclick
            }
        }
    });
}