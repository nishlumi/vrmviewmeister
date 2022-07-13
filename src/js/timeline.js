import { VVAnimationProject, VVAvatar, VVCast } from './prop/cls_vvavatar.js';
import { AnimationParsingOptions } from './prop/cls_unityrel.js';
import { appModelOperator } from './model/operator.js';
import { AF_TARGETTYPE } from '../res/appconst.js';
import { UnityCallbackFunctioner } from './model/callback.js';

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {*} mainData 
 * @param {*} timelineData 
 * @param {UnityCallbackFunctioner} callback
 * @param {appModelOperator} modelOperator 
 * @param {*} timelineRef 
 * @returns 
 */
export function defineTimeline(app,Quasar,mainData,ribbonData,timelineData,callback,modelOperator,timelineRef) {
    //---computed------------------------------------
    const chechAvatarThumbnail = Vue.computed(() => {
        return (tl) => {
            var thumb = "static/img/pic_undefined.png";
            if (tl.target && tl.target.avatar) {
                thumb = tl.target.avatar.thumbnail;
            }
            return thumb;
        }
    });
    const checkAvatarLabel = Vue.computed(() => {
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
        //console.log(evt, timelineRef.scroll_header_x.value.value);
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
            modelOperator.common_loadFrame(timelineData.states.currentcursor);
        }
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
            modelOperator.common_loadFrame(newval);
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
            {target:mainData.states.selectedAvatar.id,method:'SetVisibleAvatar',param:tl.readonly ? 0 : 1},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }

    //===timeline box=============================
    const keyframebox_onclick = (item, frameitem) => {
        //console.log(JSON.original(item), JSON.original(frameitem));
        var index = parseInt(frameitem.text);
        if (isNaN(index) === false) {
            //---change target timeline
            for (var obj = 0; obj < timelineData.data.timelines.length; obj++) {
                timelineData.data.timelines[obj].selected.currentcursor = false;
            }
            item.selected.currentcursor = true;
            mainData.states.selectedTimeline = item;
            //---change target frame number
            ribbonData.elements.frame.current = index;
            modelOperator.select_keyframePosition(index-1);
        }
        

    }
    const keyframebox_ondblclick = (item, frameitem) => {
        mainData.elements.keyframedlg.show =  true;
    }

    //===functions================================
    /**
     * Judge view style of keyframe number in the timeline header.
     * @param {VVTimelineTarget} item
     * @param {Number} count
     */
     const judgeVClass = Vue.computed(() => {
         return (item,count)=>{
            //console.log("judge=",item,count);
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
            //---events, watches-------------------
            wa_tlLength,
            //common_loadFrame,
            gridscrollx_onscroll,gridscrolly_onscroll,timelinebox_onwheel,namebox_onwheel,
            skip_previous_onclick,skip_next_onclick,zoom_in_onclick,zoom_out_onclick,seekbar_onchange,loadFrame_onclick,panelToggleBtn_onclick,

            frameheaderNumber_onclick,
            namebox_onclick,namebox_readonly_onclick,
            keyframebox_onclick,keyframebox_ondblclick,
            wa_frame_current,wa_selectedTimeline,
            
        })
        
    }
}