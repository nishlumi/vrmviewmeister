import { VVAnimationProject, VVAvatar, VVCast, VVTimelineTarget } from './prop/cls_vvavatar.js';
import { AnimationParsingOptions, AnimationRegisterOptions } from './prop/cls_unityrel.js';
import { appModelOperator } from './model/operator.js';
import { AF_MOVETYPE, AF_TARGETTYPE, UserAnimationEase } from '../res/appconst.js';
import { UnityCallbackFunctioner } from './model/callback.js';
import { appDataTimeline } from './prop/apptimelinedata.js';
import { appMainData } from './prop/appmaindata.js';
import { VFileHelper } from '../../public/static/js/filehelper.js';

/*
    Specification

    keyframe on the timeline: 
        VVTimelineFrameData.key is same to timelineData.data.headercounts
        (NOT Array<VVTimelineFrameData>'s index)
*/

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {appMainData} mainData 
 * @param {appDataTimeline} timelineData 
 * @param {UnityCallbackFunctioner} callback
 * @param {appModelOperator} modelOperator 
 * @param {*} timelineRef 
 * @returns 
 */
export function defineTimeline(app,Quasar,mainData,ribbonData,timelineData,callback,modelOperator,timelineRef) {
    //---computed------------------------------------
    const chechAvatarThumbnail = Vue.computed(() => {
        /**
         * 
         * @param {VVTimelineTarget} tl
         */
        return (tl) => {
            var thumb = "static/img/pic_undefined.png";
            if (tl.target && tl.target.avatar) {
                thumb = tl.target.avatar.thumbnail;
            }
            return thumb;
        }
    });
    const checkAvatarLabel = Vue.computed(() => {
        /**
         * 
         * @param {VVTimelineTarget} tl
         */
        return (tl) => {
            if (tl.target) {
                return tl.target.roleTitle;
                /*if (tl.target.avatar) {
                    return tl.target.avatar.title;
                }else{
                    
                }*/
            } else{
                return "";
            }
        }
    });
    //---events, watch-------------------------------
    
    const wa_tlLength = Vue.watch(() => mainData.data.project.timelineFrameLength,(newval) => {
        ribbonData.elements.frame.max = newval;
        timelineData.data.headercounts.splice(0, timelineData.data.headercounts.length);
        for (var i = 0; i < newval; i++) {
            timelineData.data.headercounts.push({
                text : `${(i+1)}`,
                vclass : {
                    "showsize-normal" : true,
                    "showsize-small" : false,
                    "framerow-scale-one" : true,
                    "framerow-scale-every10" : false
                }
            });
        }
    });
    

    /**
     * Scroll Event of header number and x-dimension of timeline 
     */
    const gridscrollx_onscroll = (evt) => {
        if (timelineRef.scroll_header_x.value && 
            (evt.target != timelineRef.scroll_header_x.value)
        ) timelineRef.scroll_header_x.value.scrollLeft = evt.target.scrollLeft;
        if (timelineRef.scroll_keyframe_xy.value && 
            (evt.target != timelineRef.scroll_keyframe_xy.value)
        ) timelineRef.scroll_keyframe_xy.value.scrollLeft = evt.target.scrollLeft;
    }
    /**
     * Scroll Event of y-dimension of name box and timeline
     */
    const gridscrolly_onscroll = (evt) => {
        if (timelineRef.scroll_namebox_y.value &&
            (evt.target != timelineRef.scroll_namebox_y.value)
        ) timelineRef.scroll_namebox_y.value.scrollTop = evt.target.scrollTop;
        if (timelineRef.scroll_keyframe_xy.value &&
            (evt.target != timelineRef.scroll_keyframe_xy.value)
        ) timelineRef.scroll_keyframe_xy.value.scrollTop = evt.target.scrollTop;
    }
    const timelinebox_onwheel = (evt) => {
        timelineRef.grid_scrolly.value.scrollTop += evt.deltaY;
        timelineRef.scroll_namebox_y.value.scrollTop += evt.deltaY;
        timelineRef.scroll_keyframe_xy.value.scrollTop += evt.deltaY;
        
        //grid_scrolly.value.scrollLeft += evt.deltaX;
    }
    const namebox_onwheel = (evt) => {
        timelineRef.grid_scrolly.value.scrollTop += evt.deltaY;
        timelineRef.scroll_keyframe_xy.value.scrollTop += evt.deltaY;
        timelineRef.scroll_namebox_y.value.scrollTop += evt.deltaY;
        
        //grid_scrolly.value.scrollLeft += evt.deltaX;
    }
    //===toolbar===================================
    /*const common_loadFrame = (newval) => {
        
        for (var i = 0; i < mainData.data.project.casts.length; i++) {
            var item = mainData.data.project.casts[i];
            if ((item.avatar != null) && (item.avatar != "")) {
                var param = new AnimationParsingOptions();
                param.index = newval;
                param.isCameraPreviewing = 0;
                
                param.isExecuteForDOTween = 1;
                //param.isCompileAnimation = this.appconf.confs.animation.with_compling ? 1 : 0;
                //param.targetId = item.avatar.id;
                
                //if (this.appconf.confs.animation.preview_onlyselected_whenselected === true) {
                //}
                param.targetRole = item.roleName;
                param.targetType = item.avatar.type.toString();

                var js = JSON.stringify(param);

                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'PreviewSingleFrame',param:js},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }
            
        }
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'BackupPreviewMarker'},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'FinishPreviewMarker'},
            "",QD_INOUT.toUNITY,
            null
        ));

        //---fixed every call: SystemEffect, Audio
        AppQueue.add(new queueData(
            {target:AppQueue.unity.AudioBGM,method:'GetIndicatedPropertyFromOuter'},
            "getpropbgm",QD_INOUT.returnJS,
            callback.getPropertyAudio,
            {callback, AudioType:AppQueue.unity.AudioBGM}
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.AudioSE,method:'GetIndicatedPropertyFromOuter'},
            "getpropse",QD_INOUT.returnJS,
            callback.getPropertyAudio,
            {callback, AudioType:AppQueue.unity.AudioSE}
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageSystemEffect,method:'GetIndicatedPropertyFromOuter',param:1},
            "getpropsyse",QD_INOUT.returnJS,
            callback.getPropertySystemEffect,
            {callback}
        ));
        modelOperator.select_objectItem(mainData.states.selectedAvatar.id,true);
        //AppQueue.start();
    }*/
    const skip_previous_onclick = () => {
        if (timelineData.states.currentcursor > 1) {
            modelOperator.select_keyframePosition(timelineData.states.currentcursor - 1);
        }
        var param = new AnimationParsingOptions();
        param.index = timelineData.states.currentcursor;
        param.targetRole = mainData.states.selectedCast.roleName;
        param.targetType = mainData.states.selectedCast.type.toString();

        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetPreviousExistKeyframeFromOuter',param:JSON.stringify(param)},
            "getprevkeyframe",QD_INOUT.returnJS,
            (val) => {
                var inx = parseInt(val);
                if (isNaN(inx)) return;
                if (inx > 0) {
                    timelineData.states.currentcursor = inx;
                }
            }
        ));
        AppQueue.start();
    }
    const skip_next_onclick = () =>{
        if (timelineData.states.currentcursor <= mainData.data.project.timelineFrameLength) {
            modelOperator.select_keyframePosition(timelineData.states.currentcursor + 1);
        }
        var param = new AnimationParsingOptions();
        param.index = timelineData.states.currentcursor;
        param.targetRole = mainData.states.selectedCast.roleName;
        param.targetType = mainData.states.selectedCast.type.toString();

        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetNextExistKeyframeFromOuter',param:JSON.stringify(param)},
            "getprevkeyframe",QD_INOUT.returnJS,
            (val) => {
                var inx = parseInt(val);
                if (isNaN(inx)) return;
                if (inx > 0) {
                    timelineData.states.currentcursor = inx;
                }
            }
        ));
        AppQueue.start();
    }
    const zoom_in_onclick = () => {
        timelineData.states.zoomin = true;
    }
    const zoom_out_onclick = () => {
        timelineData.states.zoomin = false;
    }
    const seekbar_onchange = (evt) => {
        for (var obj of timelineData.data.headercounts) {
            obj.vclass.currentcursor = false;
        }
        //item.vclass.currentcursor = true;
        const newval = timelineData.elements.seekbar;
        ribbonData.elements.frame.current = newval;
        timelineData.states.currentcursor = newval;
    }
    const loadFrame_onclick = () => {
        if (!mainData.states.animationPlaying) {
            modelOperator.common_loadFrame(timelineData.states.currentcursor,{childkey:-1});
        }
    }
    const openProperty_onclick = () => {
        keyframebox_ondblclick();
    }

    const panelToggleBtn_onclick = () => {
        var h = parseInt(mainData.elements.canvas.scrollArea.height);
        var newhei = 0;
        if (timelineData.elements.isExpand) {
            timelineData.elements.toggleIcon = "expand_less";
            newhei = 48;
            mainData.elements.canvas.scrollArea.height = `${h - newhei + 250}px`;
        }else{
            timelineData.elements.toggleIcon = "expand_more";
            newhei = 250;
            mainData.elements.canvas.scrollArea.height = `${h - newhei + 48}px`;
        }
        timelineData.elements.boxStyle.height = newhei + "px";
        timelineData.elements.isExpand = !timelineData.elements.isExpand;

    }
    const insertFrame_onclick = () => {
        console.log(timelineData.states.currentcursor);

        var param = `${timelineData.states.currentcursor},1,r`;
        
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'InsertFrameDuring',param:param},
            "insertframeduring",QD_INOUT.returnJS,
            (val) => {
                var arr = val.split(",");
                var pos = parseInt(arr[0]);
                var count = parseInt(arr[1]);
                if (!isNaN(pos)) {
                    for (var obj = 0; obj <  timelineData.data.timelines.length; obj++) {
                        /**
                         * @type {VVTimelineTarget}
                         */
                        var tl = timelineData.data.timelines[obj];
                        if (tl && tl.target && tl.target.avatar) {
                            tl.insertFrameDuring(pos, count);
                        }
                    }
                    mainData.data.project.timelineFrameLength += count;
                    mainData.states.currentEditOperationCount++;
                }
            }
        ));
        AppQueue.start();
        
    }
    const deleteFrame_onclick = () => {
        var param = `${timelineData.states.currentcursor},1`;
        
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'DeleteFrame',param:param},
            "deleteframeduring",QD_INOUT.returnJS,
            (val) => {
                var arr = val.split(",");
                var pos = parseInt(arr[0]);
                var count = parseInt(arr[1]);
                if (!isNaN(pos)) {
                    for (var obj = 0; obj <  timelineData.data.timelines.length; obj++) {
                        /**
                         * @type {VVTimelineTarget}
                         */
                        var tl = timelineData.data.timelines[obj];
                        if (tl && tl.target && tl.target.avatar) {
                            tl.deleteFrameDuring(pos, count);
                        }
                    }
                    mainData.data.project.timelineFrameLength -= count;
                    this.mainData.states.currentEditOperationCount++;
                }
            }
        ));
        AppQueue.start();
    }
    const OnChange_childKeyVal = (val) => {
        if (val < 0) timelineData.elements.childKey.disable_remove = true;
        else timelineData.elements.childKey.disable_remove = false;
        
        modelOperator.common_loadFrame(timelineData.states.currentcursor,{childkey:parseInt(val)});
    }
    const addChildKey_onclick = () => {
        var movearr = [AF_MOVETYPE.Translate];
        var bonearr = modelOperator.selectInitialTargetBones(mainData.states.selectedAvatar.type);
        modelOperator.addKeyFrame(mainData.states.selectedAvatar, bonearr, movearr, "append");
    }
    const deleteChildKey_onclick = () => {
        modelOperator.removeChildKey(mainData.states.selectedAvatar, timelineData.states.currentcursor, timelineData.elements.childKey.val);
    }

    //===number line box==========================
    const frameheaderNumber_onclick = (item,index) => {
        //console.log(item,index);
        ribbonData.elements.frame.current = index+1;
        modelOperator.select_keyframePosition(index);
    }
    //---Instead of onSelectFrame event 
    const wa_frame_current = Vue.watch(() => timelineData.states.currentcursor, (newval) => {
        if (
            (!mainData.states.animationPlaying) &&
            (mainData.appconf.confs.animation.recover_pose_whenselected === true)
        ) {
            modelOperator.common_loadFrame(newval,{childkey:-1});
        }

        mainData.elements.keyframedlg.frame = newval;

    },{deep:true});

    //===name box ================================
    /**
     * 
     * @param {VVTimelineTarget} item 
     */
    const namebox_onclick = (item) => {
        for (var obj = 0; obj < timelineData.data.timelines.length; obj++) {
            timelineData.data.timelines[obj].selected.currentcursor = false;
        }
        item.selected.currentcursor = true;
        mainData.states.selectedTimeline = item;

        modelOperator.select_keyframePosition(ribbonData.elements.frame.current-1);
    }
    const wa_selectedTimeline = Vue.watch(() => mainData.states.selectedTimeline, (newval) => {
        if (newval.target.avatar != null) {
            //---if an avatar is attaching to role, select the avatar
            //---Fire watch event
            mainData.states.selectedAvatar = newval.target.avatar;
        }
    });
    const namebox_readonly_onclick = (tl) => {
        tl.readonly = !tl.readonly;
        
        if (tl.readonly) {
            //---read only
            tl.readonlyIcon = "visibility_off";
        }else{
            //---normal show
            tl.readonlyIcon = "visibility";
        }
        AppQueue.add(new queueData(
            {target:tl.target.avatar.id,method:'SetVisibleAvatar',param:tl.readonly ? 0 : 1},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }

    //===timeline box=============================
    const keyframebox_onclick = (item, frameitem) => {
        var index = parseInt(frameitem.text);
        if (isNaN(index) === false) {
            //---change target timeline
            for (var obj = 0; obj < timelineData.data.timelines.length; obj++) {
                timelineData.data.timelines[obj].selected.currentcursor = false;
            }
            item.selected.currentcursor = true;
            mainData.states.selectedTimeline = item;
            //-->  timeline.js.wa_selectedTimeline --> operator.js.wa_selectedAvatar
            
            //---change target frame number
            ribbonData.elements.frame.current = index;
            modelOperator.select_keyframePosition(index-1);
            Vue.nextTick(() => {
                modelOperator.returnKeyframeWindowChangeTimeline();
                modelOperator.returnKeyFrameWindowTemporaryCastArray();
            });
            
        }
        

    }
    const keyframebox_ondblclick = async (item, frameitem) => {
        if (mainData.appconf.confs.application.is_externalwin_keyframe) {
            if (mainData.elements.win_keyframe && !mainData.elements.win_keyframe.closed) {
        
            }else{
                mainData.elements.win_keyframe = window.open("./static/win/keyframe/index.html",
                    "keyframe",
                    "width=350,height=480,alwaysRaised=yes,resizable=false,autoHideMenuBar=true"
                );
            }
            
            
            if (VFileHelper.checkNativeAPI) { 
                var title = mainData.elements.win_keyframe.document.title
                await window.elecAPI.focusWindow(title);
            }else{
                mainData.elements.win_keyframe.blur();
                window.focus();
                window.blur();
                mainData.elements.win_keyframe.focus();
            }
        }else{
            mainData.elements.keyframedlg.show =  true;
        }

    }

    /**
     * 
     * @param {VVTimelineTarget} item 
     */
    const keyframebox_popuptip = (item, frameitem) => {
        var aro = new AnimationRegisterOptions();
        aro.targetRole = item.target.roleName;
        aro.targetType = item.target.type;
        aro.index = parseInt(frameitem.text);

        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetMemoFromOuter',param:JSON.stringify(aro)},
            "getease",QD_INOUT.returnJS,
            (val) => {
                timelineData.states.popup.memo = val;
            }
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetEaseFromOuter',param:JSON.stringify(aro)},
            "getease",QD_INOUT.returnJS,
            (val) => {
                if (val > -1) {
                    timelineData.states.popup.easing = GetEnumName(UserAnimationEase, val);
                }
            }
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetDurationFromOuter',param:JSON.stringify(aro)},
            "getduration",QD_INOUT.returnJS,
            (val) => {
                timelineData.states.popup.duration = parseFloat(val).toFixed(3);

                //item.getFrameByKey(frameitem).show = true;
            }
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetThisTimeFromOuter',param:JSON.stringify(aro)},
            "getthistime",QD_INOUT.returnJS,
            (val) => {
                var js = val.split(",");
                timelineData.states.popup.time.current = parseFloat(js[0]).toFixed(3);
                timelineData.states.popup.time.whole = parseFloat(js[1]).toFixed(3);

            }
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetRegisteredBonesFromOuter',param:JSON.stringify(aro)},
            "getregbones",QD_INOUT.returnJS,
            (val) => {
                timelineData.states.popup.ikmarkers.splice(0, timelineData.states.popup.ikmarkers.length);
                var arr = val.split(",");
                /*var res = [];
                for (var i = 0; i < arr.length; i += 3) {
                    var subarr = arr.slice(i, i += 3);
                    var substr = subarr.join(", ");
                    res.push(substr);
                }*/
                var result = arr.reduce((acc, curr, i) => {
                    return i % 3 === 2 ? `${acc}${curr},<br>` : `${acc}${curr},`;
                  }, "");

                for (var i = 0; i < arr.length; i++) {
                    var v = arr[i];
                    timelineData.states.popup.ikmarkers.push(v.toLowerCase());
                }
                console.log(timelineData.states.popup.ikmarkers);
                //timelineData.states.popup.ikmarkers = result.slice(0, -1);
            }
        ));
        AppQueue.start();
    }
    /**
     * show count of translate items in the frame
     */
    const keyframeHasTranslateCount = Vue.computed(()=>{
        /**
         * @param {VVTimelineTarget} item
         * @param {Number} frameitem
         */
        return (item, frameitem) => {
            var frameIndex = parseInt(frameitem.text);
            if (item && item['frames'] && item.getFrameByKey && !isNaN(frameIndex)) {
                var fr = item.getFrameByKey(frameIndex);
                return fr.data.translateMoving || " ";
            }else{
                return " ";
            }
        };
    });

    //===functions================================
    /**
     * Judge view style of keyframe number in the timeline header.
     * @param {VVTimelineTarget} item
     * @param {Number} count
     */
     const judgeVClass = Vue.computed(() => {
         return (item,count)=>{
            if (
                (count == 0) ||
                (((count+1) % 10) == 0)
            ) {
                item.vclass["framerow-scale-every10"] = true;
            }else{
                item.vclass["framerow-scale-one"] = true;
                if (timelineData.states.zoomin) {
                    item.vclass["showsize-normal"] = true;
                    item.vclass["showsize-small"] = false;
                }else{
                    item.vclass["showsize-normal"] = false;
                    item.vclass["showsize-small"] = true;
                }
            }            
            if (timelineData.states.currentcursor == (count+1)) {
                item.vclass["currentcursor"] = true;
            }else{
                item.vclass["currentcursor"] = false;
            }
            return item.vclass;
        }
    });
    /**
     * Check registered key frame on the timeline
     */
    const existsKeyFrame = Vue.computed(() => {
        /**
         * @param {VVTimelineTarget} item
         * @param {Number} frameIndex
         */
        return (item, frameIndex) => {
            if (item && item['frames'] && item.getFrameByKey) {
                return item.getFrameByKey(frameIndex) ? true : false;
            }else{
                return false;
            }
            
        }
    });
    /**
     * 
     * @returns {Nuumber} calculated UI height of the Timeline
     */
    const getCurrentModeSize = () => {
        return parseInt(timelineData.elements.boxStyle.height);
    }




    //===life cycle================================
    Vue.onBeforeMount(()=>{
        timelineData.data.timelines = [];
        //------setup
        for (var i = 0; i < mainData.data.project.timelineFrameLength; i++) {
            timelineData.data.headercounts.push({
                text : `${(i+1)}`,
                vclass : {
                    "showsize-normal" : true,
                    "showsize-small" : false,
                    "framerow-scale-one" : true,
                    "framerow-scale-every10" : false
                }
            });
        }
    });

    return {
        timelineEvent : Vue.reactive({
            //---computed--------------------------
            judgeVClass,existsKeyFrame,getCurrentModeSize,chechAvatarThumbnail,checkAvatarLabel,
            keyframeHasTranslateCount,
            //---events, watches-------------------
            wa_tlLength,
            //common_loadFrame,
            gridscrollx_onscroll,gridscrolly_onscroll,timelinebox_onwheel,namebox_onwheel,
            skip_previous_onclick,skip_next_onclick,zoom_in_onclick,zoom_out_onclick,seekbar_onchange,loadFrame_onclick,
            openProperty_onclick,panelToggleBtn_onclick,
            insertFrame_onclick, deleteFrame_onclick,OnChange_childKeyVal, addChildKey_onclick, deleteChildKey_onclick,

            frameheaderNumber_onclick,
            namebox_onclick,namebox_readonly_onclick,
            keyframebox_onclick,keyframebox_ondblclick,keyframebox_popuptip,
            wa_frame_current,wa_selectedTimeline,
            
        })
        
    }
}