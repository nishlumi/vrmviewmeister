import { appMainData } from "../prop/appmaindata"
import { appDataObjectProp } from "../prop/appobjpropdata"
import { appDataRibbon } from "../prop/appribbondata"
import { appDataTimeline } from "../prop/apptimelinedata"
import { UnityCallbackFunctioner } from "./callback"

export class appMobileOperator {
    constructor() {

    }
    
}

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {appMainData} mainData 
 * @param {appDataRibbon} ribbonData 
 * @param {*} objlistData 
 * @param {appDataObjectProp} objpropData 
 * @param {appDataTimeline} timelineData 
 * @param {UnityCallbackFunctioner} UnityCallback 
 */
export const defineMobileOperator = (app,Quasar,mainData, ribbonData, objlistData, objpropData, timelineData, UnityCallback) => {
    
    const rotateRate = mainData.appconf.confs.application.vpad_rotaterate;
    const translateRate = mainData.appconf.confs.application.vpad_translaterate;

    const rotate_body = (direction, newInfo) => {
        var mpdir = mainData.elements.mobilepad[direction];
        mpdir.rotation.info = newInfo;

        var moveVal = newInfo.offset;
        moveVal.x = moveVal.x * parseFloat(mainData.appconf.confs.application.vpad_rotaterate);
        moveVal.y = moveVal.y * parseFloat(mainData.appconf.confs.application.vpad_rotaterate);
        var relpos = {x: 0, y: 0};

        if (newInfo.direction == "up") {
            mpdir.rotation.icon = "arrow_upward";
            mpdir.rotation.current.y -= moveVal.y;
            //relpos.y = -0.5;
        }else if (newInfo.direction == "down") {
            mpdir.rotation.icon = "arrow_downward";
            mpdir.rotation.current.y += moveVal.y;
            //relpos.y = 0.5;
        }else if (newInfo.direction == "left") {
            mpdir.rotation.icon = "arrow_back";
            mpdir.rotation.current.x -= moveVal.x;
            //relpos.x = 0.5;
        }else if (newInfo.direction == "right") {
            mpdir.rotation.icon = "arrow_forward";
            mpdir.rotation.current.x += moveVal.x;
            //relpos.x = -0.5;
        }else{
            mpdir.rotation.icon = "radio_button_unchecked";
        }
        relpos.x = moveVal.x;
        relpos.y = moveVal.y;

        //newly: synchronize with Gamepad (rotation) old:RotateCameraPosFromOuter
        var param = relpos.x + "," + (relpos.y * -1);        
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'VpadRightStickFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const rotate_onswipe_left = ({evt, ...newInfo}) => {
        rotate_body("left",newInfo);
    }
    const rotate_onswipe_right = ({evt, ...newInfo}) => {
        rotate_body("right",newInfo);
    }

    //============================================================
    const progress_body = (direction, newInfo) => {
        var mpdir = mainData.elements.mobilepad[direction];

        mpdir.progress.info = newInfo;

        var moveVal = newInfo.distance;
        moveVal.x = moveVal.x * 0.1;
        moveVal.y = moveVal.y * 0.1;

        var relpos = {x: 0, y: 0, z:0};

        if (newInfo.direction == "up") {
            mpdir.progress.icon = "arrow_upward";
            mpdir.progress.current.z += moveVal.y;
            relpos.y = 1 * parseFloat(mainData.appconf.confs.application.vpad_translaterate);
        }else if (newInfo.direction == "down") {
            mpdir.progress.icon = "arrow_downward";
            mpdir.progress.current.z -= moveVal.y;
            relpos.y = -1 * parseFloat(mainData.appconf.confs.application.vpad_translaterate);
        }else{
            mpdir.progress.icon = "radio_button_unchecked";
        }

        //newly: synchronize with Gamepad (top, down)
        var param = [relpos.x, relpos.y].join(",");
        AppQueue.add(new queueData(
            {target:AppQueue.unity.XR,method:'VpadDpadFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const progress_onswipe_left = ({evt, ...newInfo}) => {
        progress_body("left",newInfo);
    }
    const progress_onswipe_right = ({evt, ...newInfo}) => {
        progress_body("right",newInfo);
    }
    //============================================================
    const translation_body = (direction, newInfo) => {
        var mpdir = mainData.elements.mobilepad[direction];

        mpdir.translation.info = newInfo;
        //data.value.elements.translation.power = newInfo.duration;
        
        var moveVal = newInfo.distance;
        moveVal.x = moveVal.x * 0.1;
        moveVal.y = moveVal.y * 0.1;

        var relpos = {x: 0, y: 0, z:0};
        //data.value.elements.translation.current.x = 0;
        //data.value.elements.translation.current.y = 0;
        if (newInfo.direction == "up") {
            mpdir.translation.icon = "arrow_upward";
            mpdir.translation.current.y += moveVal.y;
            relpos.z = 1 * parseFloat(mainData.appconf.confs.application.vpad_translaterate);
        }else if (newInfo.direction == "down") {
            mpdir.translation.icon = "arrow_downward";
            mpdir.translation.current.y -= moveVal.y;
            relpos.z = -1 * parseFloat(mainData.appconf.confs.application.vpad_translaterate);
        }else if (newInfo.direction == "left") {
            mpdir.translation.icon = "arrow_back";
            mpdir.translation.current.x -= moveVal.x;
            relpos.x = -1 * parseFloat(mainData.appconf.confs.application.vpad_translaterate);
        }else if (newInfo.direction == "right") {
            mpdir.translation.icon = "arrow_forward";
            mpdir.translation.current.x += moveVal.x;
            relpos.x = 1 * parseFloat(mainData.appconf.confs.application.vpad_translaterate);
        }else{
            mpdir.translation.icon = "radio_button_unchecked";
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
    const translation_onswipe_left = ({evt, ...newInfo}) => {
        translation_body("left",newInfo);
    }
    const translation_onswipe_right = ({evt, ...newInfo}) => {
        translation_body("right",newInfo);
    }
    //============================================================
    const targetzoom_body = (direction, newInfo) => {
        var mpdir = mainData.elements.mobilepad[direction];

        mpdir.targetzoom.info = newInfo;

        var moveVal = newInfo.distance;
        moveVal.x = moveVal.x * 0.1;
        moveVal.y = moveVal.y * 0.1;

        var relpos = {x: 0, y: 0, z:0};

        if (newInfo.direction == "up") {
            mpdir.targetzoom.icon = "arrow_downward";
            mpdir.targetzoom.current.z += moveVal.y;
            relpos.z = -1 * parseFloat(translateRate);
        }else if (newInfo.direction == "down") {
            mpdir.targetzoom.icon = "arrow_upward";
            mpdir.targetzoom.current.z -= moveVal.y;
            relpos.z = 1 * parseFloat(translateRate);
        }else{
            mpdir.targetzoom.icon = "radio_button_unchecked";
        }

        var param = [relpos.x, relpos.y, relpos.z].join(",");
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'MoveCamera2TargetDistance',param:relpos.z},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const targetzoom_onswipe_left = ({evt, ...newInfo}) => {
        targetzoom_body("left",newInfo);
    }
    const targetzoom_onswipe_right = ({evt, ...newInfo}) => {
        targetzoom_body("right",newInfo);
    }

    const changetarget_onchange = (direction) => {

        const mpdir = mainData.elements.mobilepad[direction];        
        var val = mpdir.tgl_changetarget.selected;
        if (val == "o") { //---to main camera
            var param = "L1";
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'VpadKeyFromOuter',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            mpdir.tgl_changetarget.selected = "c";
            mpdir.tgl_changetarget.icon = "videocam";
            mpdir.tgl_changetarget.tooltip = "Main camera";
        }else if (val == "c") { //---to object
            var param = "R1";
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'VpadKeyFromOuter',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            mpdir.tgl_changetarget.selected = "o";
            mpdir.tgl_changetarget.icon = "dashboard_customize";
            mpdir.tgl_changetarget.tooltip = "Object";
        }
    }
    const changetarget_onchange_left = () => {
        changetarget_onchange("left");
    }
    const changetarget_onchange_right = () => {
        changetarget_onchange("right");
    }
    const changespace_onchange = (direction) => {
        const mpdir = mainData.elements.mobilepad[direction];

        var param = "select";
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'VpadKeyFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();

        var val = mpdir.tgl_changespace.selected;
        if (val == "w") { //---to local
            mpdir.tgl_changespace.selected = "l";
            mpdir.tgl_changespace.icon = "self_improvement";
            mpdir.tgl_changespace.tooltip = "Local";
        }else if (val == "l") { //---to world
            mpdir.tgl_changespace.selected = "w";
            mpdir.tgl_changespace.icon = "public";
            mpdir.tgl_changespace.tooltip = "World";
        }
    }
    const changespace_onchange_left = () => {
        changespace_onchange("left");
    }
    const changespace_onchange_right = () => {
        changespace_onchange("right");
    }
    

    return {
        mobilePadEvent : {
            rotate_onswipe_left,
            rotate_onswipe_right,
            progress_onswipe_left,
            progress_onswipe_right,
            translation_onswipe_left,
            translation_onswipe_right,
            targetzoom_onswipe_left,
            targetzoom_onswipe_right,
            changetarget_onchange,
            changetarget_onchange_left,changetarget_onchange_right,
            changespace_onchange,
            changespace_onchange_left,changespace_onchange_right,
        }
    }
}