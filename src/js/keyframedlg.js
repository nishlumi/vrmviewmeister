import { AnimationRegisterOptions, AnimationTransformRegisterOptions } from "./prop/cls_unityrel.js";
import { VVAvatar,  VVCast,  VVTimelineTarget } from "./prop/cls_vvavatar.js";
import { AF_TARGETTYPE, UserAnimationEase } from "../res/appconst.js";

/*
    KeyFrame Editing dialog
 
    Specification:
        decide way of operatable timeline avatar:
            frame index {Number}: NativeAnimationFrame.index is same to timelineData.states.currentcursor
            target timeline: mainData.states.selectedTimeline
 */
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
            <div class="col-12">
                <div v-if="checkAvailableTimeline" class="ellipsis">
                    <q-avatar>
                        <img :src="showAvatarImage" alt="avatar">
                    </q-avatar>
                    {{ showAvatarName }}
                </div>
            </div>
            
        </div>
        <div class="row q-pt-sm">
            <div class="col-12">
                <span>{{ $t('target_frame') }}</span>
            </div>
            <div class="col-5">
                <q-input v-model="kfapp.elements.targetFrameIndexBegin" dense filled 
                    :label="$t('target_begin_frame')" type="number" 
                    :min="1" :max="maxframeNumber" :step="1"
                    @update:model-value="targetframebeginno_onchange"
                ></q-input>
            </div>
            <div class="col-5 offset-1">
                <q-input v-model="kfapp.elements.targetFrameIndexEnd" dense filled 
                    :label="$t('target_end_frame')" type="number" 
                    :min="kfapp.elements.targetFrameIndexBegin" :max="maxframeNumber" :step="1"
                    @update:model-value="targetframeendno_onchange"
                ></q-input>
            </div>
        </div>
        <div class="row q-pt-sm">
            <div class="col-2">
                <q-icon name="east" style="margin-left:25%;margin-top:25%;"></q-icon>
            </div>
            <div class="col-6">
                <q-input v-model="kfapp.elements.destinationFrameIndex" dense filled 
                    :label="$t('destination_frame')" type="number"
                    :min="1" :max="maxframeNumber" :step="1"
                    @update:model-value="frameno_onchange"
                    :disable="kfapp.states.disable"
                ></q-input>
            </div>
            <div class="col-4 q-pl-md">
                <q-btn round icon="move_down" size="md"
                    @click="editframeno_onclick"
                    :disable="kfapp.states.disableFrameBtn"
                ></q-btn>
            </div>
        </div>
        <q-tabs v-model="kfapp.elements.tab.selection"
            class="bg-white text-primary" no-caps
        >
            <q-tab name="easing" :label="$t('easing')"></q-tab>
            <q-tab name="duration" :label="$t('duration')"></q-tab>
            <q-tab name="transform" :label="$t('position')+','+$t('rotation')"></q-tab>
        </q-tabs>
        <q-tab-panels v-model="kfapp.elements.tab.selection">
            <q-tab-panel name="easing">
                <div class="row q-mt-md">
                    <div class="col-12">
                        <q-select v-model="kfapp.elements.easing.selected"
                            :options="kfapp.elements.easing.options"
                            :label="$t('easing')" 
                            @update:model-value="easing_onchange"
                            :disable="kfapp.states.disable"
                        ></q-select>
                    </div>
                </div>
            </q-tab-panel>
            <q-tab-panel name="duration">
                <div class="row">
                    <div class="col-8">
                        <q-input v-model="kfapp.elements.duration" type="number"
                            :min="0.00000001" :max="999.99999999" :step="0.00000001" 
                            :label="$t('duration')" filled dense
                            @update:model-value="duration_onchange"
                            :disable="kfapp.states.disable"
                        ></q-input>
                    </div>
                    <div class="col-3 offset-1">
                        <q-btn round icon="restart_alt" size="sm" 
                            @click="resetduration_onclick"
                            :disable="kfapp.states.disable"
                        >
                            <q-tooltip>{{ $t('reset_duration') }}</q-tooltip>
                        </q-btn>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 q-pb-sm">
                        <q-select v-model="kfapp.elements.copySrcVrm.selected"
                            :options="cmp_vrmlist"
                            :label="$t('copy_dur_from_avatar')" 
                            
                            :disable="kfapp.states.disable"
                        ></q-select>
                    </div>
                    <div class="col-4">
                        <q-input v-model="kfapp.elements.copySrcVrm.startFrame" type="number"
                            :min="1" :max="maxframeNumber" :step="1" 
                            :label="$t('start')" filled dense
                            :disable="kfapp.states.disable"
                        ></q-input>
                    </div>
                    <div class="col-1">
                        ~
                    </div>
                    <div class="col-4">
                        <q-input v-model="kfapp.elements.copySrcVrm.endFrame" type="number"
                            :min="1" :max="maxframeNumber" :step="1" 
                            :label="$t('end')" filled dense
                            :disable="kfapp.states.disable"
                        ></q-input>
                    </div>
                    <div class="col-3 q-pl-xs q-pt-xs">
                        <q-btn round icon="content_copy" size="md"
                            @click="copysumduration_onclick"
                            :disable="kfapp.states.disableFrameBtn"
                        >
                            <q-tooltip>
                                {{ $t('lab_btn_copy_start') }}
                            </q-tooltip>
                        </q-btn>
                    </div>
                </div>
            </q-tab-panel>
            <q-tab-panel name="transform">
                <div class="row">
                    <div class="col-6">{{ $t('position') }}</div>
                    <div class="col-6">
                        <q-checkbox v-model="kfapp.elements.isAbsolutePosition" :label="$t('absolute_speci')"></q-checkbox>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4 q-pr-sm">
                        <q-input v-model.number="kfapp.elements.position.x" @update:model-value="transform_onchange" type="number" label="X" dense :min="-99.9999999" :max="99.9999999" :step="0.01"></q-input>
                    </div>
                    <div class="col-4 q-pr-sm">
                        <q-input v-model.number="kfapp.elements.position.y" @update:model-value="transform_onchange" type="number" label="Y" dense :min="-99.9999999" :max="99.9999999" :step="0.01"></q-input>
                    </div>
                    <div class="col-4">
                        <q-input v-model.number="kfapp.elements.position.z" @update:model-value="transform_onchange" type="number" label="Z" dense :min="-99.9999999" :max="99.9999999" :step="0.01"></q-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">{{ $t('rotation') }}</div>
                    <div class="col-6">
                        <q-checkbox v-model="kfapp.elements.isAbsoluteRotation" :label="$t('absolute_speci')"></q-checkbox>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4 q-pr-sm">
                        <q-input v-model.number="kfapp.elements.rotation.x" @update:model-value="transform_onchange" type="number" label="X" dense :min="-180.0" :max="180.0" :step="1"></q-input>
                    </div>
                    <div class="col-4 q-pr-sm">
                        <q-input v-model.number="kfapp.elements.rotation.y" @update:model-value="transform_onchange" type="number" label="Y" dense :min="-180.0" :max="180.0" :step="1"></q-input>
                    </div>
                    <div class="col-4">
                        <q-input v-model.number="kfapp.elements.rotationz" @update:model-value="transform_onchange" type="number" label="Z" dense :min="-180.0" :max="180.0" :step="1"></q-input>
                    </div>
                </div>
            </q-tab-panel>
        </q-tab-panels>        
    </div>
</div>
`;
/*
:min="1" :max="maxframeNumber" :step="1"
@update:model-value="frameno_onchange"
*/
export function defineKeyframeDlg(app, Quasar) {
    app.component("KeyframeDlg",{
        template : template,
        props : {
            modelValue : Boolean,
            frameIndex : Number,
            timeline : VVTimelineTarget,
            maxframeNumber : Number,
            vrms: Array
        },
        emits : [
            "update:model-value",
        ],
        setup(props, context) {
            const {modelValue, frameIndex, timeline,maxframeNumber,vrms } = Vue.toRefs(props);
            const { t  } = VueI18n.useI18n({ useScope: 'global' });

            const show = Vue.ref(false);
            const kfapp = Vue.ref({
                elements : {
                    win : {
                        styles : {
                            position : "absolute",
                            bottom : "-9999px",
                            right : "-9999px",
                            width : "350px",
                            height : "480px",
                            zIndex : 5004,
                            backgroundColor : "#FFFFFF"
                        },
                        position : {
                            x : 0,
                            y : 0
                        },
                    },
                    tab : {
                        selection : "easing"
                    },
                    panelCSS : {
                        "q-dark" : false,
                        "text-dark" : true,
                    },
                    target : null,
                    frameIndex : 0,

                    targetFrameIndexBegin : 1,
                    targetFrameIndexEnd : 1,
                    targetDuringFrames : [],
                    destinationFrameIndex : 0,
                    duration : 0.01,
                    easing : {
                        options : [],
                        selected : UserAnimationEase.Unset
                    },
                    copySrcVrm: {
                        selected : { label: "---", value:null},
                        startFrame: 1,
                        endFrame: 1,
                    },
                    position : {
                        x : 0,
                        y : 0,
                        z : 0
                    },
                    rotation : {
                        x : 0,
                        y : 0,
                        z : 0
                    },
                    isAbsolutePosition : false,
                    isAbsoluteRotation : false,
                },
                states : {
                    oldFrameIndex : -1,
                    oldTargetFrameIndexString : "-1",
                    disable : false,
                    disableFrameBtn : false,
                }
                
            });
            const kfdlg_bar = Vue.ref(null);
            const kfdlg = Vue.ref(null);

            //---functions-------------------------------
            const checkNumberTargetFrameIndex = () => {
                /**
                 * @type {Array<Number>}
                 */
                var arr = kfapp.value.elements.targetDuringFrames;
                
                //---string list to Numbered array
                var intlist = [];
                var is_number = true;
                
                if (arr.length > 0) {
                    var isnanhit = arr.find( itm => {
                        var itms = parseInt(itm);
                        if (isNaN(itms)) {
                            return true;
                        }else{
                            return false;
                        }
                    });
                    if (isnanhit) {
                        is_number = false;
                    }
                }else{
                    is_number = false;
                }
                
                return is_number;
            }
            /**
             * whether the array has one value
             * @returns {Boolean}
             */
            const checkSingleTargetFrameIndex = () => {
                var arr = kfapp.value.elements.targetDuringFrames;
                var is_single_number = false;
                if (arr.length > 1) {
                    is_single_number = false;
                }else{
                    if (!isNaN(arr[0])) {
                        is_single_number = true;
                    }else{
                        is_single_number = false;
                    }
                }
                return is_single_number;
            }
            /**
             * get number value after checkSingleTargetFrameIndex()
             * @returns {Number} first array number value
             */
            const getSingleTargetFrameIndex = (index) => {
                var ret = -1;
                try {
                    if (kfapp.value.elements.targetDuringFrames.length > 0) {
                        ret = kfapp.value.elements.targetDuringFrames[index];
                    }
                }catch(e) {
                    ret = -1;
                }
                
                return ret;
            }
            /**
             * get length of targetFrameIndex.
             * @returns {Number}
             */
            const TargetFrameLength = () => {
                return kfapp.value.elements.targetDuringFrames.length;
            }

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

                    parseTargetFrameIndexString(kfapp.value.elements.frameIndex);
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
            /**
             * change selection of frame index 
             */
            const wa_frameIndex = Vue.watch(() => frameIndex.value, (newval) => {
                kfapp.value.elements.frameIndex = newval;
                kfapp.value.elements.targetFrameIndexBegin = newval;
                kfapp.value.elements.targetFrameIndexEnd = newval;
                kfapp.value.elements.destinationFrameIndex = newval;

                parseTargetFrameIndexString(newval);

                kfapp.value.states.oldFrameIndex = newval;
                //kfapp.value.states.oldTargetFrameIndexString = newval.toString();

                if ((timeline.value) &&  (kfapp.value.elements.targetFrameIndexBegin > 0)) {
                    //---connect the Unity only when dialog opened
                    var fkey = timeline.value.getFrameByKey(newval);
                    if (fkey) {
                        kfapp.value.states.disable = false;
                        kfapp.value.states.disableFrameBtn = false;
                        if (show.value === true) {
                            common_loadUnityConfig(timeline.value.target, kfapp.value.elements.targetFrameIndexBegin);
                        }
                    }else{
                        kfapp.value.states.disable = true;
                        kfapp.value.states.disableFrameBtn = true;
                    }
                    
                }
            });
            /**
             * selection changed a timeline (change avatar)
             */
            const wa_timeline = Vue.watch(() => timeline.value, (newval) => {
                //if ((newval) && (kfapp.value.elements.frameIndex > 0)) {
                if ((newval) && (checkSingleTargetFrameIndex() === true)) {
                    /**
                     * @type {Number}
                     */
                    const frameindex_one = getSingleTargetFrameIndex(0);

                    //---connect the Unity only when dialog opened
                    if (show.value === true) {
                        common_loadUnityConfig(newval.target, frameindex_one); //kfapp.value.elements.frameIndex);
                    }
                    //---connect the Unity only when dialog opened
                    var fkey = newval.getFrameByKey(frameindex_one);
                    if (fkey) {
                        kfapp.value.states.disable = false;
                        kfapp.value.states.disableFrameBtn = false;
                        if (show.value === true) {
                            common_loadUnityConfig(timeline.value.target, frameindex_one);
                        }
                    }else{
                        kfapp.value.states.disable = true;
                        kfapp.value.states.disableFrameBtn = true;
                    }
                }
                
            });
            /**
             * change selection of frame index (string list)
             */
            const parseTargetFrameIndexString = (newval) => {
                var arr = String(newval).split(",");
                //---string list to Numbered array
                kfapp.value.elements.targetDuringFrames.splice(0,kfapp.value.elements.targetDuringFrames.length);
                arr.forEach( itm => {
                    var itms = parseInt(itm);
                    if (!isNaN(itms)) {
                        kfapp.value.elements.targetDuringFrames.push(itms);
                    }
                });
                //---always sort ascending
                kfapp.value.elements.targetDuringFrames = kfapp.value.elements.targetDuringFrames.sort();

                return kfapp.value.elements.targetDuringFrames;
            }

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
            const cmp_vrmlist = Vue.computed(() => {
                var ret = [ { label: "---", value:null}];
                //console.log(vrms.value);
                for (var i = 0; i < vrms.value.length; i++) {
                    var obj = vrms.value[i];
                    if (obj.avatar) {
                        if ((obj.type != AF_TARGETTYPE.SystemEffect) && 
                            (obj.type != AF_TARGETTYPE.Audio) &&
                            (obj.type != AF_TARGETTYPE.Stage) 
                        ) {
                            if (obj.avatar.id != timeline.value.target.avatar.id) {
                                ret.push({
                                    label : obj.roleTitle,
                                    value: obj.roleName
                                });
                            }
                        }
                    }
                    
                }
                return ret;
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

                var cnt = TargetFrameLength();
                for (var i = 0; i < cnt; i++) {
                    var frameIndex = getSingleTargetFrameIndex(i);

                    var aro = new AnimationRegisterOptions();
                    aro.targetId = timeline.value.target.avatarId;
                    aro.targetRole = timeline.value.target.roleName;
                    aro.targetType = timeline.value.target.type;
                    aro.index = frameIndex;
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
                }
                AppQueue.start();
            }
            const duration_onchange = (val) => {
                if (timeline.value == null) return;
    
                var cnt = TargetFrameLength();
                for (var i = 0; i < cnt; i++) {
                    var frameIndex = getSingleTargetFrameIndex(i);

                    var aro = new AnimationRegisterOptions();
                    aro.targetId = timeline.value.target.avatarId;
                    aro.targetRole = timeline.value.target.roleName;
                    aro.targetType = timeline.value.target.type;
                    aro.index = frameIndex;
                    aro.duration = parseFloat(val);
            
                    var param = JSON.stringify(aro);
            
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.ManageAnimation,method:'SetDuration',param:param},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                }
                
                AppQueue.start();
            }
            const transform_onchange = (evt) => {
                /**
                 * @type {AF_TARGETTYPE}
                 */
                const ttype = timeline.value.target.type;
                if (timeline.value == null) return;

                if ((ttype == AF_TARGETTYPE.Audio) ||
                    (ttype == AF_TARGETTYPE.Stage) ||
                    (ttype == AF_TARGETTYPE.SystemEffect) ||
                    (ttype == AF_TARGETTYPE.Unknown) 
                ) {
                    return;
                }

                var cnt = TargetFrameLength();
                for (var i = 0; i < cnt; i++) {
                    var frameIndex = getSingleTargetFrameIndex(i);

                    var aro = new AnimationTransformRegisterOptions();
                    aro.targetId = timeline.value.target.avatarId;
                    aro.targetRole = timeline.value.target.roleName;
                    aro.targetType = timeline.value.target.type;
                    aro.index = frameIndex;
                    aro.posx = kfapp.value.elements.position.x;
                    aro.posy = kfapp.value.elements.position.y;
                    aro.posz = kfapp.value.elements.position.z;
                    aro.rotx = kfapp.value.elements.rotation.x;
                    aro.roty = kfapp.value.elements.rotation.y;
                    aro.rotz = kfapp.value.elements.rotation.z;
                    aro.isAbsolutePosition = kfapp.value.elements.isAbsolutePosition === true ? 1 : 0;
                    aro.isAbsoluteRotation = kfapp.value.elements.isAbsoluteRotation === true ? 1 : 0;
        
                    var param = JSON.stringify(aro);
                    
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.ManageAnimation,method:'SetGlobalTransform',param:JSON.stringify(aro)},
                        "",QD_INOUT.toUNITY,null
                    ));
                }
                AppQueue.start();
            }

            //-------------------------------------------------------------
            const body_targetframeno = (param) => {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'CheckTargetFrameIndexList',param:param},
                    "checktargetframe",QD_INOUT.returnJS,
                    (val, options) => {
                        if (val != "") {
                            //kfapp.value.elements.targetDuringFrames
                            //---get existed frame index during begin and end.
                            parseTargetFrameIndexString(val);
                        }
                    },
                    {oldindex: parseInt(kfapp.value.states.oldFrameIndex)}
                ));
                
                AppQueue.start();
            }
            const targetframebeginno_onchange = (value) => {
                //---start check frame exists.
                var param = [
                    timeline.value.target.roleName,
                    timeline.value.target.type,
                    value,
                    kfapp.value.elements.targetFrameIndexEnd
                ].join("\t");
                body_targetframeno(param);
            }
            const targetframeendno_onchange = (value) => {
                //---start check frame exists.
                var param = [
                    timeline.value.target.roleName,
                    timeline.value.target.type,
                    kfapp.value.elements.targetFrameIndexBegin,
                    value
                ].join("\t");
                body_targetframeno(param);
            }
            //--------------------------

            const frameno_onchange = (value) => {
                //---calculate future begin ~ end
                var fut_begin = value;
                var fut_end = (parseInt(kfapp.value.elements.targetFrameIndexEnd) - parseInt(kfapp.value.elements.targetFrameIndexBegin)) + parseInt(value);
                //---check frame range
                var param = [
                    timeline.value.target.roleName,
                    timeline.value.target.type,
                    fut_begin,
                    fut_end
                ].join("\t");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'CheckTargetFrameIndexList',param:param},
                    "checktargetframe",QD_INOUT.returnJS,
                    (val, options) => {
                        if (val != "-1") {
                            if (val == "") {
                                kfapp.value.states.disableFrameBtn = false;
                            }else{
                                var arr = String(val).split(",");
                                if (arr.length > 0) {
                                    //---if already exist key-frame, disable edit button
                                    kfapp.value.states.disableFrameBtn = true;
                                }else{
                                    kfapp.value.states.disableFrameBtn = false;
                                }
                            }
                            
                        }
                    },
                    {oldindex: parseInt(kfapp.value.states.oldFrameIndex)}
                ));
                
                AppQueue.start();

                /*
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
                */
            }
            const editframeno_onclick = () => {
                //---calculate future begin ~ end
                var tbegin = parseInt(kfapp.value.elements.targetFrameIndexBegin);
                var tend = parseInt(kfapp.value.elements.targetFrameIndexEnd);
                var fut_begin = parseInt(kfapp.value.elements.destinationFrameIndex);
                var fut_end = (tend - tbegin) + parseInt(kfapp.value.elements.destinationFrameIndex);

                const funcbody = (cur_frame, fut_frame) => {
                    var param = `${timeline.value.target.avatarId},${timeline.value.target.type},${cur_frame},${fut_frame}`;
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.ManageAnimation,method:'ChangeFramePosition',param:param},
                        "changeframepos",QD_INOUT.returnJS,
                        (val, options) => {
                            if (val > -1) {
                                timeline.value.exchangeFrame(options.oldindex, options.newindex);
                                //kfapp.value.states.oldFrameIndex = kfapp.value.elements.frameIndex;
                            }
                            
                        },
                        {oldindex: parseInt(cur_frame), newindex: parseInt(fut_frame)}
                    ));
                }
                var cnt = TargetFrameLength();
                if (tbegin < fut_begin) {
                    for (var i = cnt-1; i >= 0; i--) {
                        var cur_frame = getSingleTargetFrameIndex(i);
                        // 1 ~ 10 ... 1 3 5 7
                        // to 11
                        // 1 - 1 + 11 = 11
                        // 7 - 1 + 11 = 17
                        var fut_frame = cur_frame - tbegin + fut_begin;
                        funcbody(cur_frame, fut_frame);
                    } 
                }else{
                    for (var i = 0; i < cnt; i++) {
                        var cur_frame = getSingleTargetFrameIndex(i);
                        var fut_frame = cur_frame - tbegin + fut_begin;
                        funcbody(cur_frame, fut_frame);
                    }
                }
                              
                AppQueue.start();
                
            }
            const copysumduration_onclick = () => {
                var param = `${kfapp.value.elements.copySrcVrm.selected.value},${kfapp.value.elements.copySrcVrm.startFrame},${kfapp.value.elements.copySrcVrm.endFrame}`;
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'GetAvatarDurationBetween',param:param},
                    "getsumduration",QD_INOUT.returnJS,
                    (val, options) => {
                        if (val > -1) {
                            kfapp.value.elements.duration = val;
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
                checkAvailableTimeline,showAvatarName,showAvatarImage,cmp_vrmlist,
                //---method---
                close_onclick,resetduration_onclick,
                easing_onchange,duration_onchange,
                transform_onchange,
                frameno_onchange,targetframebeginno_onchange,targetframeendno_onchange,editframeno_onclick,
                copysumduration_onclick
            }
        }
    });
}