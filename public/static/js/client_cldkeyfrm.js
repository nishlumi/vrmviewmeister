import { defineSetupLang } from "./setuplang.js";
import { ChildReturner } from "./cls_childreturner.js";
import { AF_TARGETTYPE, FILEOPTION, IKBoneType, UserAnimationEase } from "../res/appconst.js";
import { VFileHelper, VFileOptions } from "./filehelper.js";
import {defineUcolorPicker} from "./ucolorpicker.js";

const loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

const app = Vue.createApp({
    setup() {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });


        const kfapp = Vue.ref({
            header : {
                show : true,
                url : null,
                btndisable : false
            },
            appconf : {
                set_name : "_vvie_aco",
                confs : {},
            },
            mainwin : {
                avatar : {
                    id : "",
                    title : "",
                    type : "",
                }
            },
            lpID : null,
        });
        const data = Vue.ref({
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
                frameIndex : 1,

                targetFrameIndexBegin : 1,
                targetFrameIndexEnd : 1,
                targetDuringFrames : [],
                destinationFrameIndex : 1,
                duration : 0.01,
                easing : {
                    options : [],
                    selected : UserAnimationEase.Unset
                },
                memo : {
                    text: ""
                },
                cell : {
                    color : "#ff4545",
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
                timeline : null,
                vrms : [],
                maxframeNumber : 0,
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
            var arr = data.value.elements.targetDuringFrames;
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
                if (data.value.elements.targetDuringFrames.length > 0) {
                    ret = data.value.elements.targetDuringFrames[index];
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
            return data.value.elements.targetDuringFrames.length;
        }

        //---watch-----------------------------------
        /*
        const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
            data.value.elements.panelCSS["q-dark"] = newval;
            data.value.elements.panelCSS["text-dark"] = !newval;
        });
        */
        /**
         * 
         * @param {VVCast} cast 
         * @param {Number} frameKey
         * @returns 
         */
        const common_loadUnityConfig = (cast, frameKey) => {
            var aro = {}; //new AnimationRegisterOptions();
            aro["targetRole"] = cast.roleName;
            aro["targetType"] = cast.type;
            aro["index"] = frameKey;
            /*
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
            */
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "get_ease_duration";
            js.data = JSON.stringify({
                param : (aro)
            });
            opener.postMessage(js);

        }

        //---------------------------------------------
        /**
         * change selection of frame index 
         */
        const wa_frameIndex = Vue.watch(() => data.value.elements.frameIndex, (newval) => {
            //data.value.elements.frameIndex = newval;
            data.value.elements.targetFrameIndexBegin = newval;
            data.value.elements.targetFrameIndexEnd = newval;
            data.value.elements.destinationFrameIndex = newval;

            parseTargetFrameIndexString(newval);

            data.value.states.oldFrameIndex = newval;
            //kfapp.value.states.oldTargetFrameIndexString = newval.toString();

            if ((data.value.states.timeline) &&  (data.value.elements.targetFrameIndexBegin > 0)) {
                //---connect the Unity only when dialog opened
                var fkey = getFrameByKey(data.value.states.timeline,newval);
                if (fkey) {
                    data.value.states.disable = false;
                    data.value.states.disableFrameBtn = false;
                    if (true) {
                        common_loadUnityConfig(data.value.states.timeline.target, data.value.elements.targetFrameIndexBegin);
                    }
                }else{
                    data.value.states.disable = true;
                    data.value.states.disableFrameBtn = true;
                }
                
            }
        });
        /**
         * selection changed a timeline (change avatar)
         */
        const wa_timeline = Vue.watch(() => data.value.states.timeline, (newval) => {
            //if ((newval) && (kfapp.value.elements.frameIndex > 0)) {
            if ((newval) && (checkSingleTargetFrameIndex() === true)) {
                /**
                 * @type {Number}
                 */
                const frameindex_one = getSingleTargetFrameIndex(0);

                //---connect the Unity only when dialog opened
                if (true) {
                    common_loadUnityConfig(newval.target, frameindex_one); //kfapp.value.elements.frameIndex);
                }
                //---connect the Unity only when dialog opened
                var fkey = getFrameByKey(newval, frameindex_one);
                if (fkey) {
                    data.value.states.disable = false;
                    data.value.states.disableFrameBtn = false;
                    if (true) {
                        common_loadUnityConfig(data.value.states.timeline.target, frameindex_one);
                    }
                }else{
                    data.value.states.disable = true;
                    data.value.states.disableFrameBtn = true;
                }
            }
            
        });
        /**
         * change selection of frame index (string list)
         */
        const parseTargetFrameIndexString = (newval) => {
            var arr = String(newval).split(",");
            //---string list to Numbered array
            data.value.elements.targetDuringFrames.splice(0,data.value.elements.targetDuringFrames.length);
            arr.forEach( itm => {
                var itms = parseInt(itm);
                if (!isNaN(itms)) {
                    data.value.elements.targetDuringFrames.push(itms);
                }
            });
            //---always sort ascending
            data.value.elements.targetDuringFrames = data.value.elements.targetDuringFrames.sort();

            return data.value.elements.targetDuringFrames;
        }
        const getFrameByKey = (timeline, key) => {
            var ret = timeline.frames.find(item=>{
                if (item.key == key) return true;
                return false;
            });
    
            return ret;
        }

        //---computed-------------------------------
        const checkAvailableTimeline = Vue.computed(() => {
            return data.value.states.timeline && data.value.states.timeline.target && data.value.states.timeline.target.avatar;
        });
        const showAvatarName = Vue.computed(() => {
            return (data.value.states.timeline.target.avatar != null) ? data.value.states.timeline.target.avatar.title : "";
        });
        const showAvatarImage = Vue.computed(() => {
            var thumbnail = data.value.states.timeline.target.avatar.thumbnail;
            if (data.value.states.timeline.target.avatar.type != AF_TARGETTYPE.VRM) {
                thumbnail = "/" + thumbnail;
            }
            return thumbnail;
        });
        const cmp_vrmlist = Vue.computed(() => {
            var ret = [ { label: "---", value:null}];
            //console.log(vrms.value);
            for (var i = 0; i < data.value.states.vrms.length; i++) {
                var obj = data.value.states.vrms[i];
                if (obj.avatar) {
                    if ((obj.type != AF_TARGETTYPE.SystemEffect) && 
                        (obj.type != AF_TARGETTYPE.Audio) &&
                        (obj.type != AF_TARGETTYPE.Stage) 
                    ) {
                        if (obj.avatar.id != data.value.states.timeline.target.avatar.id) {
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
            if (data.value.states.timeline.target.avatar == null) return;

            var params = [];
            var cnt = TargetFrameLength();
            for (var i = 0; i < cnt; i++) {
                var frameIndex = getSingleTargetFrameIndex(i);

                var aro = {}; //new AnimationRegisterOptions();
                aro["targetId"] = data.value.states.timeline.target.avatarId;
                aro["targetRole"] = data.value.states.timeline.target.roleName;
                aro["targetType"] = data.value.states.timeline.target.type;
                aro["index"] = frameIndex;
        
                var param = (aro);

                params.push(param);
            }
    
            /*
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'ResetAutoDuration',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            
            AppQueue.start();
            */
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "resetduration_onclick";
            js.data = JSON.stringify({
                params
            });
            opener.postMessage(js);
        }
        const memo_onchange = (val) => {
            var newval = val;

            const timeline = data.value.states.timeline;
            if (timeline == null) return;

            var params = [];
            var cnt = TargetFrameLength();
            for (var i = 0; i < cnt; i++) {
                var frameIndex = getSingleTargetFrameIndex(i);

                var aro = {}; //new AnimationRegisterOptions();
                aro["targetId"] = data.value.states.timeline.target.avatarId;
                aro["targetRole"] = data.value.states.timeline.target.roleName;
                aro["targetType"] = data.value.states.timeline.target.type;
                aro["index"] = frameIndex;
                aro["memo"] = newval;
    
                var param = (aro);

                params.push(param);
                /*
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'SetEase',param:JSON.stringify(aro)},
                    "setease",QD_INOUT.returnJS,
                    (val)=>{
                        var js = JSON.parse(val);
                        //console.log(js);
                    }
                ));
                */
            }
            //AppQueue.start();

            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "memo_onchange";
            js.data = JSON.stringify({
                params
            });
            opener.postMessage(js);
        }
        const easing_onchange = (val) => {
            var newval = val.value;

            const timeline = data.value.states.timeline;
            if (timeline == null) return;

            var params = [];
            var cnt = TargetFrameLength();
            for (var i = 0; i < cnt; i++) {
                var frameIndex = getSingleTargetFrameIndex(i);

                var aro = {}; //new AnimationRegisterOptions();
                aro["targetId"] = data.value.states.timeline.target.avatarId;
                aro["targetRole"] = data.value.states.timeline.target.roleName;
                aro["targetType"] = data.value.states.timeline.target.type;
                aro["index"] = frameIndex;
                aro["ease"] = newval;
    
                var param = (aro);

                params.push(param);
                /*
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'SetEase',param:JSON.stringify(aro)},
                    "setease",QD_INOUT.returnJS,
                    (val)=>{
                        var js = JSON.parse(val);
                        //console.log(js);
                    }
                ));
                */
            }
            //AppQueue.start();

            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "easing_onchange";
            js.data = JSON.stringify({
                params
            });
            opener.postMessage(js);
        }
        const duration_onchange = (val) => {
            const timeline = data.value.states.timeline;
            if (timeline == null) return;

            var params = [];
            var cnt = TargetFrameLength();
            for (var i = 0; i < cnt; i++) {
                var frameIndex = getSingleTargetFrameIndex(i);

                var aro = {}; //new AnimationRegisterOptions();
                aro["targetId"] = timeline.target.avatarId;
                aro["targetRole"] = timeline.target.roleName;
                aro["targetType"] = timeline.target.type;
                aro["index"] = frameIndex;
                aro["duration"] = parseFloat(val);
        
                var param = (aro);
                params.push(param);
                /*AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'SetDuration',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));*/
            }
            
            //AppQueue.start();
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "duration_onchange";
            js.data = JSON.stringify({
                params
            });
            opener.postMessage(js);
        }
        const cellcolor_onchange = (val,evt) => {
            const timeline = data.value.states.timeline;
            if (timeline == null) return;

            var params = [];
            var cnt = TargetFrameLength();
            for (var i = 0; i < cnt; i++) {
                var frameIndex = getSingleTargetFrameIndex(i);
        
                var aro = {}; //new AnimationRegisterOptions();
                aro["targetId"] = timeline.target.avatarId;
                aro["targetRole"] = timeline.target.roleName;
                aro["targetType"] = timeline.target.type;
                aro["index"] = frameIndex;
                aro["keycolor"] = MUtility.toHexaColor(val);
                
                var param = (aro);
                params.push(param);
            }                    

            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "keycolor_onchange";
            js.data = JSON.stringify({
                params
            });
            opener.postMessage(js);
        }
        const transform_onchange = (evt) => {
            const timeline = data.value.states.timeline;
            /**
             * @type {AF_TARGETTYPE}
             */
            const ttype = timeline.target.type;
            if (timeline == null) return;

            if ((ttype == AF_TARGETTYPE.Audio) ||
                (ttype == AF_TARGETTYPE.Stage) ||
                (ttype == AF_TARGETTYPE.SystemEffect) ||
                (ttype == AF_TARGETTYPE.Unknown) 
            ) {
                return;
            }

            var params = [];
            var cnt = TargetFrameLength();
            for (var i = 0; i < cnt; i++) {
                var frameIndex = getSingleTargetFrameIndex(i);

                var aro = {}; //new AnimationTransformRegisterOptions();
                aro["targetId"] = timeline.target.avatarId;
                aro["targetRole"] = timeline.target.roleName;
                aro["targetType"] = timeline.target.type;
                aro["index"] = frameIndex;
                aro["posx"] = data.value.elements.position.x;
                aro["posy"] = data.value.elements.position.y;
                aro["posz"] = data.value.elements.position.z;
                aro["rotx"] = data.value.elements.rotation.x;
                aro["roty"] = data.value.elements.rotation.y;
                aro["rotz"] = data.value.elements.rotation.z;
                aro["isAbsolutePosition"] = data.value.elements.isAbsolutePosition === true ? 1 : 0;
                aro["isAbsoluteRotation"] = data.value.elements.isAbsoluteRotation === true ? 1 : 0;
    
                var param = (aro);
                params.push(param);
                /*
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'SetGlobalTransform',param:JSON.stringify(aro)},
                    "",QD_INOUT.toUNITY,null
                ));
                */
            }
            //AppQueue.start();

            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "transform_onchange";
            js.data = JSON.stringify({
                params
            });
            opener.postMessage(js);
        }

        //-------------------------------------------------------------
        const body_targetframeno = (param) => {
            /*AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'CheckTargetFrameIndexList',param:param},
                "checktargetframe",QD_INOUT.returnJS,
                (val, options) => {
                    if (val != "") {
                        //kfapp.value.elements.targetDuringFrames
                        //---get existed frame index during begin and end.
                        parseTargetFrameIndexString(val);
                    }
                },
                {oldindex: parseInt(data.value.states.oldFrameIndex)}
            ));
            
            AppQueue.start();*/

            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "body_targetframeno";
            js.data = JSON.stringify({param});
            opener.postMessage(js);
        }
        const targetframebeginno_onchange = (value) => {
            const timeline = data.value.states.timeline;
            //---start check frame exists.
            var param = [
                timeline.target.roleName,
                timeline.target.type,
                value,
                data.value.elements.targetFrameIndexEnd
            ].join("\t");
            body_targetframeno(param);
        }
        const targetframeendno_onchange = (value) => {
            const timeline = data.value.states.timeline;
            //---start check frame exists.
            var param = [
                timeline.target.roleName,
                timeline.target.type,
                data.value.elements.targetFrameIndexBegin,
                value
            ].join("\t");
            body_targetframeno(param);
        }
        //--------------------------

        const frameno_onchange = (value) => {
            const timeline = data.value.states.timeline;
            //---calculate future begin ~ end
            var fut_begin = value;
            var fut_end = (parseInt(data.value.elements.targetFrameIndexEnd) - parseInt(data.value.elements.targetFrameIndexBegin)) + parseInt(value);
            //---check frame range
            var param = [
                timeline.target.roleName,
                timeline.target.type,
                fut_begin,
                fut_end
            ].join("\t");
            /*
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
            */
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "frameno_onchange";
            js.data = JSON.stringify({param});
            opener.postMessage(js);

            
        }
        const editframeno_onclick = () => {
            const timeline = data.value.states.timeline;
            //---calculate future begin ~ end
            var tbegin = parseInt(data.value.elements.targetFrameIndexBegin);
            var tend = parseInt(data.value.elements.targetFrameIndexEnd);
            var fut_begin = parseInt(data.value.elements.destinationFrameIndex);
            var fut_end = (tend - tbegin) + parseInt(data.value.elements.destinationFrameIndex);

            const funcbody = (cur_frame, fut_frame) => {
                var param = `${timeline.target.avatarId},${timeline.target.type},${cur_frame},${fut_frame}`;
                /*AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'ChangeFramePosition',param:param},
                    "changeframepos",QD_INOUT.returnJS,
                    (val, options) => {
                        if (val > -1) {
                            timeline.value.exchangeFrame(options.oldindex, options.newindex);
                            //kfapp.value.states.oldFrameIndex = kfapp.value.elements.frameIndex;
                        }
                        
                    },
                    {oldindex: parseInt(cur_frame), newindex: parseInt(fut_frame)}
                ));*/
                return {param, oldindex: parseInt(cur_frame), newindex: parseInt(fut_frame) };
            }

            var params = [];
            var cnt = TargetFrameLength();
            if (tbegin < fut_begin) {
                for (var i = cnt-1; i >= 0; i--) {
                    var cur_frame = getSingleTargetFrameIndex(i);
                    // 1 ~ 10 ... 1 3 5 7
                    // to 11
                    // 1 - 1 + 11 = 11
                    // 7 - 1 + 11 = 17
                    var fut_frame = cur_frame - tbegin + fut_begin;
                    params.push(funcbody(cur_frame, fut_frame));
                } 
            }else{
                for (var i = 0; i < cnt; i++) {
                    var cur_frame = getSingleTargetFrameIndex(i);
                    var fut_frame = cur_frame - tbegin + fut_begin;
                    params.push(funcbody(cur_frame, fut_frame));
                }
            }
                            
            //AppQueue.start();
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "editframeno_onclick";
            js.data = JSON.stringify({
                params
            });
            opener.postMessage(js);
            
        }
        const duplicatekeyframes_onclick = () => {
            const timeline = data.value.states.timeline;
            //---calculate future begin ~ end
            var tbegin = parseInt(data.value.elements.targetFrameIndexBegin);
            var tend = parseInt(data.value.elements.targetFrameIndexEnd);
            var fut_begin = parseInt(data.value.elements.destinationFrameIndex);
            var fut_end = (tend - tbegin) + parseInt(data.value.elements.destinationFrameIndex);

            const funcbody = (cur_frame, fut_frame) => {
                //var param = `${timeline.target.roleName},${timeline.target.type},${cur_frame},${fut_frame}`;
                
                return {roleName: timeline.target.roleName, 
                    type: timeline.target.type,
                    oldindex: parseInt(cur_frame), newindex: parseInt(fut_frame) 
                };
            }

            var params = [];
            var cnt = TargetFrameLength();
            if (tbegin < fut_begin) {
                for (var i = cnt-1; i >= 0; i--) {
                    var cur_frame = getSingleTargetFrameIndex(i);
                    // 1 ~ 10 ... 1 3 5 7
                    // to 11
                    // 1 - 1 + 11 = 11
                    // 7 - 1 + 11 = 17
                    var fut_frame = cur_frame - tbegin + fut_begin;
                    params.push(funcbody(cur_frame, fut_frame));
                } 
            }else{
                for (var i = 0; i < cnt; i++) {
                    var cur_frame = getSingleTargetFrameIndex(i);
                    var fut_frame = cur_frame - tbegin + fut_begin;
                    params.push(funcbody(cur_frame, fut_frame));
                }
            }
                            
            //AppQueue.start();
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "duplicatekeyframes_onclick";
            js.data = JSON.stringify({
                params
            });
            opener.postMessage(js);
        }
        const removekeyframes_onclick = () => {
            const timeline = data.value.states.timeline;
            //---calculate future begin ~ end
            var tbegin = parseInt(data.value.elements.targetFrameIndexBegin);
            var tend = parseInt(data.value.elements.targetFrameIndexEnd);
            var fut_begin = parseInt(data.value.elements.destinationFrameIndex);
            var fut_end = (tend - tbegin) + parseInt(data.value.elements.destinationFrameIndex);

            const funcbody = (cur_frame, fut_frame) => {
                //var param = `${timeline.target.roleName},${timeline.target.type},${cur_frame},${fut_frame}`;
                
                return {roleName: timeline.target.avatarId, 
                    type: timeline.target.type,
                    oldindex: parseInt(cur_frame), newindex: parseInt(fut_frame) 
                };
            }

            var params = [];
            var cnt = TargetFrameLength();
            if (tbegin < fut_begin) {
                for (var i = cnt-1; i >= 0; i--) {
                    var cur_frame = getSingleTargetFrameIndex(i);
                    // 1 ~ 10 ... 1 3 5 7
                    // to 11
                    // 1 - 1 + 11 = 11
                    // 7 - 1 + 11 = 17
                    var fut_frame = cur_frame - tbegin + fut_begin;
                    params.push(funcbody(cur_frame, fut_frame));
                } 
            }else{
                for (var i = 0; i < cnt; i++) {
                    var cur_frame = getSingleTargetFrameIndex(i);
                    var fut_frame = cur_frame - tbegin + fut_begin;
                    params.push(funcbody(cur_frame, fut_frame));
                }
            }

            appConfirm(_T("msg_delframe_keyinrange"),()=>{
                //AppQueue.start();
                var js = new ChildReturner();
                js.origin = location.origin;
                js.windowName = "keyframe";
                js.funcName = "removekeyframes_onclick";
                js.data = JSON.stringify({
                    params
                });
                opener.postMessage(js);
            });
        }
        const copysumduration_onclick = () => {
            var param = `${data.value.elements.copySrcVrm.selected.value},${data.value.elements.copySrcVrm.startFrame},${data.value.elements.copySrcVrm.endFrame}`;

            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "keyframe";
            js.funcName = "copysumduration_onclick";
            js.data = JSON.stringify({
                param
            });
            opener.postMessage(js);

            /*
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
            */
        }
        //====================================================================
        Vue.onBeforeMount(() => {
            var darktheme = sessionStorage.getItem("UseDarkTheme");
            if (darktheme) {
                if (darktheme == "1") {
                    Quasar.Dark.set(true);
                }else{
                    Quasar.Dark.set(false);
                }
            }
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
            for (var obj in UserAnimationEase) {
                data.value.elements.easing.options.push({
                    label : GetEnumName(UserAnimationEase, UserAnimationEase[obj]),
                    value : UserAnimationEase[obj]
                });
            }
            data.value.elements.easing.selected = data.value.elements.easing.options[0];

            //---function returned from parent AppQueue function
            kfapp.value.lpID = setInterval(async () => {
                //Returned value
                /*
                    Input: 
                        kfa_cast : Object like VVCast
                        kfa_avatar : Object like VVAvatar

                        kfa_frameIndex : Number
                        kfa_timeline : Object like VVMTimelineTarget
                        kfa_maxframeNumber : Number
                        kfa_vrms : Object[] like VVCast[]
                        kfa_getease : Ease
                        kfa_getduration : float
                        kfa_targetFrameIndex : string
                        kfa_frameno_frameIndex : string
                        kfa_getsumduration : number
                    Output:
                        kfapp_get_ease
                        kfapp_get_duration
                        get_ease_duration : 
                        ResetAutoDuration
                        SetEase
                        SetDuration
                        SetGlobalTransform
                        CheckTargetFrameIndexList
                        ChangeFramePosition
                        GetAvatarDurationBetween
                */
                AppDB.temp.getItem("kfa_set_timeline")
                .then(hitval => {
                    if (hitval != null) {
                        if (("timeline" in hitval) && ("frameIndex" in hitval) && ("maxframeNumber" in hitval)) {
                            data.value.states.timeline = hitval.timeline;
                            data.value.elements.frameIndex = parseInt(hitval.frameIndex);
                            data.value.states.maxframeNumber = parseInt(hitval.maxframeNumber);
                            data.value.elements.targetFrameIndexBegin = data.value.elements.frameIndex;
                            data.value.elements.targetFrameIndexEnd = data.value.elements.frameIndex;
                            common_loadUnityConfig(hitval.timeline.target,hitval.frameIndex);
                            parseTargetFrameIndexString(data.value.elements.frameIndex);
                        }
                        AppDB.temp.removeItem("kfa_set_timeline");
                    }
                });
                AppDB.temp.getItem("kfa_set_vrms")
                .then(hitval => {
                    if (hitval != null) {
                        if ("vrms" in hitval) {
                            data.value.states.vrms.splice(0, data.value.states.vrms.length);
                            for (var i = 0; i < hitval.vrms.length; i++) {
                                data.value.states.vrms.push(hitval.vrms[i]);
                            }
                        }
                        AppDB.temp.removeItem("kfa_set_vrms");
                    }
                });
                AppDB.temp.getItem("kfa_getease")
                .then(hitval => {
                    if (hitval != null) {
                        var ishit = data.value.elements.easing.options.find(item => {
                            if (item.value == hitval) return true;
                            return false;
                        })
                        if (ishit) {
                            data.value.elements.easing.selected = ishit;
                        }
                        AppDB.temp.removeItem("kfa_getease");
                    }
                    
                });
                AppDB.temp.getItem("kfa_getduration")
                .then(hitval => {
                    if (hitval != null) {
                        data.value.elements.duration = Math.floor(parseFloat(hitval) * 10000000) / 10000000;
                        AppDB.temp.removeItem("kfa_getduration");
                    }
                    
                });
                AppDB.temp.getItem("kfa_getmemo")
                .then(hitval => {
                    if (hitval != null) {
                        data.value.elements.memo.text = hitval;
                        AppDB.temp.removeItem("kfa_getmemo");
                    }
                    
                });
                AppDB.temp.getItem("kfa_getkeycolor")
                .then(hitval => {
                    if (hitval != null) {
                        data.value.elements.cell.color = hitval;
                        AppDB.temp.removeItem("kfa_getkeycolor");
                    }
                    
                });
                AppDB.temp.getItem("kfa_targetFrameIndex")
                .then(hitval => {
                    if (hitval != null) {
                        //kfapp.value.elements.targetDuringFrames
                        //---get existed frame index during begin and end.
                        parseTargetFrameIndexString(hitval);
                        AppDB.temp.removeItem("kfa_targetFrameIndex");
                    }
                    
                });
                AppDB.temp.getItem("kfa_frameno_frameIndex")
                .then(hitval => {
                    if (hitval != null) {
                        if (hitval != "-1") {
                            if (hitval == "") {
                                data.value.states.disableFrameBtn = false;
                            }else{
                                var arr = String(hitval).split(",");
                                if (arr.length > 0) {
                                    //---if already exist key-frame, disable edit button
                                    data.value.states.disableFrameBtn = true;
                                }else{
                                    data.value.states.disableFrameBtn = false;
                                }
                            }
                        }
                        AppDB.temp.removeItem("kfa_frameno_frameIndex");
                    }
                    
                });
                AppDB.temp.getItem("kfa_getsumduration")
                .then (hitval => {
                    if (hitval != null) {
                        if (hitval > -1) {
                            data.value.elements.duration = hitval;
                        }
                        AppDB.temp.removeItem("kfa_getsumduration");
                    }
                    
                });
            },200);
        });

        return {

            kfapp,data,
            kfdlg_bar,kfdlg,
            //---watch---
            wa_frameIndex,wa_timeline,
            //---computed---
            checkAvailableTimeline,showAvatarName,showAvatarImage,cmp_vrmlist,
            //---method---
            getFrameByKey,
            //---events
            close_onclick,resetduration_onclick,
            memo_onchange,easing_onchange,duration_onchange,cellcolor_onchange,
            transform_onchange,
            frameno_onchange,targetframebeginno_onchange,targetframeendno_onchange,editframeno_onclick,
            copysumduration_onclick,
            duplicatekeyframes_onclick,
            removekeyframes_onclick,
        }
    }
});


const i18n = VueI18n.createI18n({
    legacy : false,
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
defineUcolorPicker(app,Quasar);


app.use(i18n);
//---Start app
app.mount('#q-app');
