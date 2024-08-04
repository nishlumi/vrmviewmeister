import { AF_TARGETTYPE, AF_MOVETYPE, CNS_BODYBONES, UserAnimationState, StageType } from "../res/appconst.js";
import { VVAvatar, VVProp, VVBlendShape, VVAvatarEquipSaveClass } from "./prop/cls_vvavatar.js";
import { definePropertyClipboard } from "./cls_clipboard.js";
import { appModelOperator } from "./model/operator.js";
import { UnityRect, UnityVector3, AvatarPunchEffect,AvatarShakeEffect } from "./prop/cls_unityrel.js";
import { UnityCallbackFunctioner } from "./model/callback.js";
import { appMainData } from "./prop/appmaindata.js";
import { appDataObjectProp } from "./prop/appobjpropdata.js";
import { VFileHelper } from "../../public/static/js/filehelper.js";

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {appMainData} mainData 
 * @param {appDataObjectProp} objpropData 
 * @param {UnityCallbackFunctioner} UnityCallback
 * @param {appModelOperator} modelOperator 
 * @returns 
 */
export function defineObjprop (app,Quasar,mainData,objpropData,UnityCallback,modelOperator) {
    const { t } = VueI18n.useI18n({ useScope: 'global' });
//---computed-------------------------------------------------------
    /**
     * To check the dimension type of selected avatar
     */
    const checkDimension = Vue.computed(() => {
        return objpropData.states.dimension;
    });
    const curprop = Vue.computed(()=>{
        return objpropData.elements;
    });
    const checkVRM =  Vue.computed(()=>{
        if (!mainData.states.selectedAvatar) return false;
        return (objpropData.states.dimension == '3d') && (mainData.states.selectedAvatar.type == AF_TARGETTYPE.VRM);
    });
    const checkOObject = Vue.computed(()=> {
        if (!mainData.states.selectedAvatar) return false;
        return ((objpropData.states.dimension == "3d") && (mainData.states.selectedAvatar.type == AF_TARGETTYPE.OtherObject));
    });
    const checkLight = Vue.computed(()=> {
        if (!mainData.states.selectedAvatar) return false;
        return ((objpropData.states.dimension == "3d") && (mainData.states.selectedAvatar.type == AF_TARGETTYPE.Light));
    });
    const checkCamera = Vue.computed(()=> {
        if (!mainData.states.selectedAvatar) return false;
        return ((objpropData.states.dimension == "3d") && (mainData.states.selectedAvatar.type == AF_TARGETTYPE.Camera));
    });
    const checkImage = Vue.computed(()=> {
        if (!mainData.states.selectedAvatar) return false;
        return ((objpropData.states.dimension == "3d") && (mainData.states.selectedAvatar.type == AF_TARGETTYPE.Image));
    });
    const checkEffect = Vue.computed(()=> {
        if (!mainData.states.selectedAvatar) return false;
        return ((objpropData.states.dimension == "3d") && (mainData.states.selectedAvatar.type == AF_TARGETTYPE.Effect));
    });
    const checkStage = Vue.computed(()=> {
        if (!mainData.states.selectedAvatar) return false;
        return ((objpropData.states.dimension == "3d") && (mainData.states.selectedAvatar.type == AF_TARGETTYPE.Stage));
    });
    const checkStageType = Vue.computed(() => {
        if (objpropData.elements.stageui.typeselected.value == StageType.User) return true;
        return false;
    });
    const checkStageTypeWater = Vue.computed(() => {
        if (
            (objpropData.elements.stageui.typeselected.value == StageType.BasicSeaLevel)
            
        )  {
            return "basicsea";
        }else if (
            (objpropData.elements.stageui.typeselected.value == StageType.SeaDaytime) ||
            (objpropData.elements.stageui.typeselected.value == StageType.SeaNight)
        ) {
            return "seatime"
        }
        return "";
    });
    const checkSkyMode = Vue.computed(() => {
        if (objpropData.elements.stageui.skymodeselected.value == 1) return true;
        return false;
    });
    const checkSkyShaderProcedural = Vue.computed(() => {
        if (objpropData.elements.stageui.skyshaderselected.value == "procedural") return true;
        return false;
    });
    const checkSkyShader6sided = Vue.computed(() => {
        if (objpropData.elements.stageui.skyshaderselected.value == "procedural") return true;
        return false;
    });
    const checkText = Vue.computed(()=> {
        if (!mainData.states.selectedAvatar) return false;
        return ((mainData.states.selectedAvatar.type == AF_TARGETTYPE.Text));
    });
    const checkText3D = Vue.computed(() => {
        if (!mainData.states.selectedAvatar) return false;
        return ((objpropData.states.dimension == "3d") && (mainData.states.selectedAvatar.type == AF_TARGETTYPE.Text3D));
    });
    const checkUImage = Vue.computed(()=> {
        if (!mainData.states.selectedAvatar) return false;
        return ((objpropData.states.dimension == "2d") && (mainData.states.selectedAvatar.type == AF_TARGETTYPE.UImage));
    });
    const checkVRMEquipItemChecked = Vue.computed(() => {
        return objpropData.elements.vrmui.equip.dialogSelected == "" ? true : false;
    });
    const showEquipedItemBodypart = Vue.computed(() => {
        return (bodyname) => {
            return t(GetEnumName(CNS_BODYBONES, bodyname))
        }
    });
    const checkMaterialShaderVRMMToon = Vue.computed(() => {
        if (objpropData.elements.objectui.matopt.shaderselected == null) return false;
        return (
            (objpropData.elements.objectui.matopt.shaderselected.value == 'VRM/MToon')
            ||
            (objpropData.elements.objectui.matopt.shaderselected.value == 'VRM10/MToon10')
        );
    });
    const checkMaterialShaderStandard = Vue.computed(() => {
        if (objpropData.elements.objectui.matopt.shaderselected == null) return false;
        return objpropData.elements.objectui.matopt.shaderselected.value == 'Standard';
    });
    const checkMaterialShaderWater = Vue.computed(() => {
        if (objpropData.elements.objectui.matopt.shaderselected == null) return false;
        return (
            (objpropData.elements.objectui.matopt.shaderselected.value == "FX/Water4")
            ||
            (objpropData.elements.objectui.matopt.shaderselected.value == "FX/SimpleWater4")
        );
    });
    const checkMaterialShaderSketchShader = Vue.computed(() => {
        if (objpropData.elements.objectui.matopt.shaderselected == null) return false;
        return (
            (objpropData.elements.objectui.matopt.shaderselected.value.toLowerCase() == "pencilshader/sketchshader")
        );
    });
    const checkMaterialShaderPostSketchShader = Vue.computed(() => {
        if (objpropData.elements.objectui.matopt.shaderselected == null) return false;
        return (
            (objpropData.elements.objectui.matopt.shaderselected.value.toLowerCase() == "pencilshader/postsketchshader")
        );
    });
    const checkMaterialShaderRealToon = Vue.computed(() => {
        if (objpropData.elements.objectui.matopt.shaderselected == null) return false;
        return (
            (objpropData.elements.objectui.matopt.shaderselected.value.toLowerCase() == "realtoon/version 5/lite/default")
        );
    });
    const checkMaterialShaderComic = Vue.computed(() => {
        if (objpropData.elements.objectui.matopt.shaderselected == null) return false;
        return (
            (objpropData.elements.objectui.matopt.shaderselected.value.toLowerCase() == "custom/comicshader")
        );
    });
    const checkMaterialShaderIce = Vue.computed(() => {
        if (objpropData.elements.objectui.matopt.shaderselected == null) return false;
        return (
            (objpropData.elements.objectui.matopt.shaderselected.value.toLowerCase() == "custom/iceshader")
        );
    });
    const checkEnumMaterialTexture = Vue.computed(() => {
        var arr = [{
            label : "---",
            value : "",
        }];
        for (var obj in mainData.elements.projdlg.materialLoadedRows) {
            var loaded = mainData.elements.projdlg.materialLoadedRows[obj];
            for (var i = 0; i < loaded.length; i++) {
                var mat = loaded[i];
                if (mat.type == "Texture") {
                    arr.push({
                        label : mat.name,
                        value : mat.name
                    });
                }
            }
        }
        return arr;
    });
    const checkEnumRTCamera = Vue.computed(() => {
        var arr = [{
            label : "---",
            value : null,
        }];
        for (var i = 0; i < mainData.data.project.casts.length; i++) {
            var cast = mainData.data.project.casts[i];
            if (cast.type == AF_TARGETTYPE.Camera) {
                arr.push({
                    label : cast.roleTitle,
                    value : cast.roleName
                });
            }
        }
        return arr;
    });
    const checkEnumVRM = Vue.computed(() => {
        var arr = [{
            label : "---",
            value : null,
        }];
        for (var i = 0; i < mainData.data.project.casts.length; i++) {
            var cast = mainData.data.project.casts[i];
            if (cast.type == AF_TARGETTYPE.VRM) {
                arr.push({
                    label : cast.roleTitle,
                    value : cast.roleName
                });
            }
        }
        return arr; 
    });
    const checkEnumAssignObjectOfIKHandles = Vue.computed(() => {
        var arr = [
            {label : "Self", value : "self"},
            {label : "Main Camera", value: "maincamera"}
        ];
        for (var i = 0; i < mainData.data.project.casts.length; i++) {
            var cast = mainData.data.project.casts[i];
            if ((cast.avatar) &&
                (
                    (cast.type == AF_TARGETTYPE.VRM) ||
                    (cast.type == AF_TARGETTYPE.OtherObject) ||
                    (cast.type == AF_TARGETTYPE.Light) ||
                    (cast.type == AF_TARGETTYPE.Camera) ||
                    (cast.type == AF_TARGETTYPE.Image) ||
                    (cast.type == AF_TARGETTYPE.Effect) ||
                    (cast.type == AF_TARGETTYPE.Text3D)
                )
            ) {
                if (cast.avatar.id != mainData.states.selectedAvatar.id) {
                    arr.push({
                        label : cast.roleTitle,
                        value : cast.roleTitle
                    });
                }
            }
        }
        return arr;
    });
    const checkRightHandPoseType = Vue.computed(() => {
        return objpropData.elements.vrmui.righthand.poseSelected.value < 0;
    });
    const checkLeftHandPoseType = Vue.computed(() => {
        return objpropData.elements.vrmui.lefthand.poseSelected.value < 0;
    });

//---events, watchtes-------------------------------------------------------
    //===commonly====================================
    const rightdrawer_minimize = () => {
        if (ID("uimode").value == "mobile") {
            objpropData.elements.drawer.show = false;
            return;
        }
        objpropData.elements.drawer.miniState = !objpropData.elements.drawer.miniState;

        var qw = Quasar.Screen.width;
        var qh = Quasar.Screen.height;
        var qn = Quasar.Screen.name;
        var w = parseInt(mainData.elements.canvas.scrollArea.width);

        var dw = objpropData.elements.drawer.width;
        var dmw = objpropData.elements.drawer.miniwidth;
        //console.log(rightdrawer.value);
        //---judge
        if (qn != "xs") {
            if (qn == "sm") {
                if (qh > qw) {
                    dw = 0;
                    dmw = 0;
                }
            }
            if (objpropData.elements.drawer.miniState) {
                mainData.elements.canvas.scrollArea.width = `${w + dw - dmw}px`;
            }else{
                mainData.elements.canvas.scrollArea.width = `${w + dmw - dw}px`;
            }
        }
        
    }
    const getCurrentModeSize = (w, h) => {
        if ((Quasar.Screen.name == "sm") ||
            (Quasar.Screen.name == "xs")
        ){
            if (objpropData.elements.drawer.miniState) {
                if (h <= w) {
                    return objpropData.elements.drawer.miniwidth;
                }else{
                    return 0;
                }
            }else{
                if (objpropData.elements.drawer.show) {
                    if (ID("uimode").value == "mobile") {
                        return 0;
                    }else{
                        return objpropData.elements.drawer.width;
                    }
                }else{
                    return 0;
                }
            }
        }else{
            if (objpropData.elements.drawer.show) {
                return (objpropData.elements.drawer.miniState) ? objpropData.elements.drawer.miniwidth : objpropData.elements.drawer.width;
            }else{
                return (objpropData.elements.drawer.miniState) ? objpropData.elements.drawer.miniwidth : 0;
            }
            
            
        }
    }
    const setupMobileSize = (w, h) => {
        var w2 = w * 2;
        if (Quasar.Screen.name == "sm") {
            //objpropData.elements.drawer.behavior = "mobile";
            /*if (h <= w) { //---landscape
                objpropData.elements.drawer.show = true;
                objpropData.elements.drawer.miniState = true;
            }else if (h <= w2) { //---landscape by double width ?
                objpropData.elements.drawer.show = true;
                objpropData.elements.drawer.miniState = true;
                if (Quasar.Screen.name == "xs") objpropData.elements.drawer.show = false;
            }else{
                objpropData.elements.drawer.show = false;
                objpropData.elements.drawer.miniState = false;
            }*/
            if (ID("uimode").value == "mobile") {
                objpropData.elements.drawer.show = false;
                objpropData.elements.drawer.miniState = false;
            }else{
                objpropData.elements.drawer.show = true;
                objpropData.elements.drawer.miniState = true;
            }
            
        }
        else if (Quasar.Screen.name == "xs") {
            objpropData.elements.drawer.show = false;
            objpropData.elements.drawer.miniState = false;
        }else{
            if (ID("uimode").value == "mobile") {
                objpropData.elements.drawer.show = false;
                //objpropData.elements.drawer.miniState = false;
            }
        }
    }

    const onclick_contextcopy = (evt) => {
        
    }

    const OnChange_Position3D = (newval) => {
        //if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;
        //console.log(objpropData.elements.common.position3d.x, objpropData.elements.common.position3d.y, objpropData.elements.common.position3d.z);
        var x = parseFloat(objpropData.elements.common.position3d.x);
        var y = parseFloat(objpropData.elements.common.position3d.y);
        var z = parseFloat(objpropData.elements.common.position3d.z);
        if (isNaN(x) || isNaN(y) || isNaN(z)) return;
        
        objpropData.states.isEditingFromUI = true;
        var param = `${x},${y},${z},1`;

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetPositionFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        return true;
    }
    const OnChange_Rotation3D = (newval) => {
        //var sel = modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id);
        //if (!sel) return false;
        var x = parseFloat(objpropData.elements.common.rotation3d.x);
        var y = parseFloat(objpropData.elements.common.rotation3d.y);
        var z = parseFloat(objpropData.elements.common.rotation3d.z);
        if (isNaN(x) || isNaN(y) || isNaN(z)) return;

        objpropData.states.isEditingFromUI = true;
        var param = `${x},${y},${z},1`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetRotationFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_Scale3D = (newval) => {
        //var sel = modelOperator.getSelected_objectItem();
        //if (!sel) return false;
        var x = parseFloat(objpropData.elements.common.scale3d.x);
        var y = parseFloat(objpropData.elements.common.scale3d.y);
        var z = parseFloat(objpropData.elements.common.scale3d.z);
        if (isNaN(x) || isNaN(y) || isNaN(z)) return;

        
        var scaleIsOnlyX = objpropData.elements.common.scaleIsOnlyX;
        objpropData.states.isEditingFromUI = true;
        var fl = x / 100.0;
        var fly= y / 100.0;
        var flz = z / 100.0;

        var vec = new UnityVector3(0,0,0);
        if (mainData.states.selectedAvatar.type == AF_TARGETTYPE.Stage) {
            vec.x = fl;
            vec.y = 1;
            vec.z = scaleIsOnlyX === true ? fl : flz;
        }else{
            vec.x = fl;
            vec.y = scaleIsOnlyX === true ? fl : fly;
            vec.z = scaleIsOnlyX === true ? fl : flz;
        }
        var param = `${vec.x},${vec.y},${vec.z}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetScale',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_Position2D = () => {
        //if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;
        var x = parseFloat(objpropData.elements.common.position2d.x);
        var y = parseFloat(objpropData.elements.common.position2d.y);
        if (isNaN(x) || isNaN(y)) return;
        
        objpropData.states.isEditingFromUI = true;

        var valueY = y * -1;

        var param = `${x},${valueY},1`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetPositionFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        return true;
    }
    const OnChange_Rotation2D = () => {
        //if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;
        var z = parseFloat(objpropData.elements.common.rotation2d.z);
        if (isNaN(z)) return;

        objpropData.states.isEditingFromUI = true;
        var param = z;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetRotationZFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        return true;
    }
    const OnChange_Size2D = () => {
        //if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;
        var x = parseFloat(objpropData.elements.common.size2d.x);
        var y = parseFloat(objpropData.elements.common.size2d.y);
        if (isNaN(x) || isNaN(y)) return;

        var param = `${x},${y}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetSizeFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        return true;
    }
    const OnChange_Scale2D = () => {
        //if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;
        var x = parseFloat(objpropData.elements.common.scale2d.x);
        var y = parseFloat(objpropData.elements.common.scale2d.y);
        if (isNaN(x) || isNaN(y)) return;

        var param = `${x},${y}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetScaleFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        return true;
    }
    const OnChange_RigidDrag = () => {
        //if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;
        var x = parseFloat(objpropData.elements.common.drag);
        var y = parseFloat(objpropData.elements.common.angularDrag);
        if (isNaN(x) || isNaN(y)) return;

        var param = `${x},${y}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetDragFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        return true;
    }
    const OnChange_UseCollision = (val) => {
        var param = (val === true) ? 1 : 0;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetEasyCollision',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_UseGravity = (val) => {
        var param = (val === true) ? 1 : 0;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUseGravity',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_JumpNum = (val) => {
        var jp = parseFloat(objpropData.elements.common.jumpPower);
        var num = parseInt(objpropData.elements.common.jumpNum);
        if (isNaN(jp) || isNaN(num)) return;
        var param = `${jp},${num}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetJump',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_JumpPower = (val) => {
        OnChange_JumpNum();
    }
    const OnChange_PunchColumn = (val) => {
        objpropData.elements.common.punch_edited = true;
        /*
        var param = new AvatarPunchEffect();
        param.copyFrom(objpropData.elements.common.punch);
        param.isEnable = param.isEnable == true ? 1 : 0;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetPunchFromOuter',param:JSON.stringify(param)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();*/
    }
    const OnChange_ShakeColumn = (val) => {
        objpropData.elements.common.shake_edited = true;
        /*
        var param = new AvatarShakeEffect();
        param.copyFrom(objpropData.elements.common.shake);
        param.isEnable = param.isEnable == true ? 1 : 0;
        param.fadeOut = param.fadeOut == true ? 1 : 0;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetShakeFromOuter',param:JSON.stringify(param)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        */
    }
    //===VRM========================================
    const wa_propVRMMoveMode = Vue.watch(() => objpropData.elements.vrmui.movemode,(newval) => {
        if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) return false;
        if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;
        
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'ChangeToggleAvatarMoveFromOuter',param:newval ? 1 : 0},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        return true;
    },{deep:true});
    const OnChange_NaturalRotationBody = (flag, bonename) => {
        if (mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) return false;
        if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;

        var param = `${flag == true ? 1 : 0},${bonename}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetIKGoalRotation2NaturalFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
    }
    const OnChange_NaturalRotation_LeftHand = (val) => {
        OnChange_NaturalRotationBody(val, "leftarm");
        if (!val) {
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'ApplyRotationHuman2IK',param:"leftarm"},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        
        AppQueue.start();
    }
    const OnChange_NaturalRotation_RightHand = (val) => {
        OnChange_NaturalRotationBody(val, "rightarm");
        if (!val) {
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'ApplyRotationHuman2IK',param:"rightarm"},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        
        AppQueue.start();
    }
    const OnChange_NaturalRotation_LeftFoot = (val) => {
        OnChange_NaturalRotationBody(val, "leftleg");
        if (!val) {
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'ApplyRotationHuman2IK',param:"leftleg"},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        
        AppQueue.start();
    }
    const OnChange_NaturalRotation_RightFoot = (val) => {
        OnChange_NaturalRotationBody(val, "rightleg");
        if (!val) {
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'ApplyRotationHuman2IK',param:"rightleg"},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        
        AppQueue.start();
    }
    const OnClick_ApplyNaturalRotation = () => {
        if (objpropData.elements.vrmui.ikGoalNaruralRotation.leftHand) {
        }
        if (objpropData.elements.vrmui.ikGoalNaruralRotation.rightHand) {
        }
        if (objpropData.elements.vrmui.ikGoalNaruralRotation.leftFoot) {
        }
        if (objpropData.elements.vrmui.ikGoalNaruralRotation.rightFoot) {
        }
        AppQueue.start();
    }

    const OnClicked_editIKPosition = async () => {        

        if (mainData.appconf.confs.application.is_externalwin_bonetran === true) {
            modelOperator.returnBoneTransformReloadBtn({avatarId: mainData.states.selectedAvatar.id});

            if (mainData.elements.win_bonetransform && !mainData.elements.win_bonetransform.closed) {
    
            }else{
                mainData.elements.win_bonetransform = window.open("./static/win/bonetran/index.html",
                    "bonetran",
                    "width=865,height=500,alwaysRaised=yes,resizable=yes,autoHideMenuBar=true"
                );
            }
    
            if (VFileHelper.checkNativeAPI) { 
                var title = mainData.elements.win_bonetransform.document.title
                await window.elecAPI.focusWindow(title);
            }else{
                mainData.elements.win_bonetransform.blur();
                window.focus();
                window.blur();
                mainData.elements.win_bonetransform.focus();
            }
        }else{
            mainData.elements.bonetrandlg.show = true;
        }
        
    
        
    }
    const OnClicked_editGravity = async () => {

        if (mainData.appconf.confs.application.is_externaiwin_gravitybone === true) {
            modelOperator.returnGravityBoneReloadBtn({avatarId: mainData.states.selectedAvatar.id});

            if (mainData.elements.win_gravitybone && !mainData.elements.win_gravitybone.closed) {
    
            }else{
                mainData.elements.win_gravitybone = window.open("./static/win/gravitybone/index.html",
                    "gravitybone",
                    "width=865,height=500,alwaysRaised=yes,resizable=yes,autoHideMenuBar=true"
                );
            }
    
            if (VFileHelper.checkNativeAPI) { 
                var title = mainData.elements.win_gravitybone.document.title
                await window.elecAPI.focusWindow(title);
            }else{
                mainData.elements.win_gravitybone.blur();
                window.focus();
                window.blur();
                mainData.elements.win_gravitybone.focus();
            }
        }else{
            mainData.elements.gravitybonedlg.show = true;
        }
        
    }
    const OnChanged_IKHandleSelected = (val) => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'GetIKTargetFromOuter',param:val.value},
            "getikhandletarget",QD_INOUT.returnJS,
            (val2) => {
                
                var arr = checkEnumAssignObjectOfIKHandles.value;
                var ishit = arr.find(item => {
                    if (item.value == val2) return true;
                    return false;
                });
                if (ishit) {
                    objpropData.elements.vrmui.ikhandles.assignSelected = ishit;
                }
            }
        ));
        AppQueue.start();
    }
    const OnChanged_IKHandleAssigning = (val) => {
        var param = `${objpropData.elements.vrmui.ikhandles.partSelected.value},${val.value}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetIKTargetFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnClick_IKHandleReset = () => {
        var param = objpropData.elements.vrmui.ikhandles.partSelected.value;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'ResetIKMappingByBodyParts',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();

        //---reset view also
        var arr = checkEnumAssignObjectOfIKHandles.value;
        var ishit = arr.find(item => {
            if (item.value == "self") return true;
            return false;
        });
        if (ishit) {
            objpropData.elements.vrmui.ikhandles.assignSelected = ishit;
        }
    }
    const OnChange_HeadLock = (val) => {
        var param = parseInt(val);
        if (isNaN(param)) return;

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetHeadLock', param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnClicked_MirrorPose = () => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'MirrorPose'},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //------Hand---
    const _HandWatchBody = (leftright,newval)=>{
        if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;
        var poseval = parseFloat(newval.poseValue);
        if (isNaN(poseval)) return;

        var handdirection = leftright;
        const param = `${handdirection},${newval.poseSelected.value},${poseval / 100.0}`;

        AppQueue.add(new queueData(
            {target:AppQueue.unity.OperateActiveVRM,method:'PosingHandFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'ListFingerPoseClass'},
            "getfingerposeclass",QD_INOUT.returnJS,
            UnityCallback.getfingerposeclass,
            {avatar: mainData.states.selectedAvatar, callback : UnityCallback}
            
        ));
        AppQueue.start();
        return true;
    }
    const OnChange_LeftHand = () => {
        return _HandWatchBody("l",objpropData.elements.vrmui.lefthand);
    }
    const OnChange_RightHand = () => {
        return _HandWatchBody("r",objpropData.elements.vrmui.righthand);
    }
    /**
     * 
     * @param {String} hand 
     * @param {String} finger 
     * @param {Array<float>} values 
     * @returns 
     */
    const _FingerIandL_Body = (hand, finger, values) => {
        if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;
        //var poseval = parseFloat(newval.poseValue);

        const param = `${hand},${finger},${values.join("&")}`;

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'RotateFingerFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        return true;
    }
    const OnChange_FingerStretch = (rl, fingertype) => {
        const finger = rl == "r" ? 
            objpropData.elements.vrmui.righthand.finger[fingertype]
            :
            objpropData.elements.vrmui.lefthand.finger[fingertype]
        ;
        var values = [
            finger.spread,
            finger.roll,
            finger.stretched1,
            finger.stretched2,
            finger.stretched2,
        ];
        if (fingertype == "thumbs") {
            values.push(finger.roll1);
            values.push(finger.roll2);
            values.push(finger.roll3);
        }
        _FingerIandL_Body(rl,fingertype.substr(0,1),values);
    }
    //------Blendshape---
    const onchange_expression_searchstr = (val) => {
        const cval = val.toLowerCase();
        for (var i = 0; i < objpropData.elements.vrmui.proxyBlendshapes.length; i++) {
            if (val == "") {
                objpropData.elements.vrmui.proxyBlendshapes[i].visibility = true;
            }else{
                if (objpropData.elements.vrmui.proxyBlendshapes[i].title.toLowerCase().indexOf(cval) > -1) {
                    objpropData.elements.vrmui.proxyBlendshapes[i].visibility = true;
                }else{
                    objpropData.elements.vrmui.proxyBlendshapes[i].visibility = false;
                }
            }
            
        }
        
    }
    const onchange_bs_searchstr = (val) => {
        const cval = val.toLowerCase();
        for (var i = 0; i < objpropData.elements.vrmui.blendshapes.length; i++) {
            if (val == "") {
                objpropData.elements.vrmui.blendshapes[i].visibility = true;
            }else{
                if (objpropData.elements.vrmui.blendshapes[i].title.toLowerCase().indexOf(cval) > -1) {
                    objpropData.elements.vrmui.blendshapes[i].visibility = true;
                }else{
                    objpropData.elements.vrmui.blendshapes[i].visibility = false;
                }
            }
            
        }
        
    }
    /**
     * On change blendshape isChanged
     * @param {Boolean} value 
     * @param {VVBlendShape} evt 
     */
    const OnChange_BlendShape_Checked = (value, evt) => {
        mainData.states.selectedAvatar.setBlendShape(evt.id, evt.value, value);
    }
    /**
     * On change blendshape slider
     * @param {Number} value 
     * @param {VVBlendShape} evt 
     * @returns 
     */
    const OnChange_BlendShape = (value,evt) => {
        //---if changed slider, always states "CHANGED".
        evt.isChanged = true;
        var bs = parseFloat(value);
        if (isNaN(bs)) return;

        var methodname = "changeAvatarBlendShapeByName";
        if (evt.id.startsWith("PROX:")) {
            methodname = "changeProxyBlendShapeByName";
            bs = bs * 0.01;
        }
        var param = `${evt.id},${bs}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:methodname, param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        mainData.states.selectedAvatar.setBlendShape(evt.id, value, evt.isChanged);
    }
    //------Blink---
    const OnChange_Blink_enable = (val) => {
        var param = val === true ? 1 : 0;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetBlinkFlag', param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_Blink_interval = (val) => {
        var param = parseFloat(val);
        if (isNaN(param)) return;

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetBlinkInterval', param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_Blink_opening = (val) => {
        var param = parseFloat(val);
        if (isNaN(param)) return;

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetBlinkOpeningSeconds', param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_Blink_closing = (val) => {
        var param = parseFloat(val);
        if (isNaN(param)) return;

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetBlinkCloseSeconds', param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_Blink_closeTime = (val) => {
        var param = parseFloat(val);
        if (isNaN(param)) return;

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetBlinkClosingTime', param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //------Lip sync (Auto Blendshape) ---
    const OnChange_Lipsync_enable = (val) => {
        var param = val === true ? 1 : 0;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetPlayFlagAutoBlendShape', param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        if (val === true) {
            /*AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'AutoBlendShape', param:0},
                "",QD_INOUT.toUNITY,
                null
            ));*/
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'PlayAutoBlendShape'},
                "",QD_INOUT.toUNITY,
                null
            ));
        }else{
            /*AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'PauseAutoBlendShape'},
                "",QD_INOUT.toUNITY,
                null
            ));*/
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'StopAutoBlendShape'},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        AppQueue.start();
    }
    const OnChange_Lipsync_interval = (val) => {
        var param = parseFloat(val);
        if (isNaN(param)) return;

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetAutoBlendShapeInterval', param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_Lipsync_opening = (val) => {
        var param = parseFloat(val);
        if (isNaN(param)) return;

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetAutoBlendShapeOpeningSeconds', param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_Lipsync_closing = (val) => {
        var param = parseFloat(val);
        if (isNaN(param)) return;

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetAutoBlendShapeCloseSeconds', param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //------Equip---
    const equiptarget_addbox_onclick = () => {
        objpropData.elements.vrmui.equip.dialogOptions.splice(0, objpropData.elements.vrmui.equip.dialogOptions.length);
        objpropData.elements.vrmui.equip.dialogOptions.push({
            id : "none",
            title : "NULL",
            type : GetEnumName(AF_TARGETTYPE,AF_TARGETTYPE.Unknown)
        });
        for (var i = 0; i < mainData.data.project.casts.length; i++) {
            var cast = mainData.data.project.casts[i];
            if (
                (cast.type == AF_TARGETTYPE.OtherObject) || 
                (cast.type == AF_TARGETTYPE.Light) || 
                (cast.type == AF_TARGETTYPE.Camera) || 
                (cast.type == AF_TARGETTYPE.Image) ||
                (cast.type == AF_TARGETTYPE.Effect) ||
                (cast.type == AF_TARGETTYPE.Text3D) 
            ) {
                var chkret = modelOperator.checkEnumurateEquipping(cast);
                if (chkret.avatar == null) {
                    //---enumurate equippable objects (no another equipped)
                    objpropData.elements.vrmui.equip.dialogOptions.push({
                        id : cast.avatar.id,
                        title : cast.avatar.title,
                        type : GetEnumName(AF_TARGETTYPE,cast.type)
                    });
                }
            }
        }

        objpropData.elements.vrmui.equip.showDialog = true;
    }

    const equipparts_onclicked = (item) => {
        appConfirm(t("msg_unequip_confirm"),() => {
            //---unequip
            mainData.states.selectedAvatar.unequip(true,item.bodybonename,item.avatar);
            //delete equipui.value.selected[equipui.value.dialogSelected.value];
            var equiped = objpropData.elements.vrmui.equip.equipments.findIndex(item2 => {
                if (
                    (item2.equipitem == item.equipitem) &&
                    (item2.bodybonename == item.bodybonename)
                ) return true;
                return false;
            });
            if (equiped > -1) {
                objpropData.elements.vrmui.equip.equipments.splice(equiped,1);
            }
        });
    }
    const equipDialog_OK_OnClick = () => {
        const sel = objpropData.elements.vrmui.equip.dialogSelected;
        const bodypart = objpropData.elements.vrmui.equip.targetPartsBox.value;

        //---equip
        //exchange avatar to the cast
        var equipitem = modelOperator.getRoleFromAvatar(sel);
        //console.log("equipitem=",equipitem);
        if (equipitem) {
            var newequip = mainData.states.selectedAvatar.equip(true,bodypart,equipitem);
            objpropData.elements.vrmui.equip.equipments.push(newequip);
        }
        
        objpropData.elements.vrmui.equip.showDialog = false;
    }
    const equipDialog_Cancel_OnClick = () => {
        objpropData.elements.vrmui.equip.showDialog = false;
    }
    //===OtherObject=====================================
    const objectMaterial_onselected = (val) => {
        //console.log(val);
        var ishit = objpropData.elements.objectui.materialnames.findIndex(m => {
            if (m == val) return true;
            return false;
        });
        if (ishit > -1) {
            objpropData.elements.objectui.matopt.isChanged = objpropData.elements.objectui.materialIsChanges[ishit];
        }
    }
    const objectMaterialIsChange_onchanged = (val) => {
        var ishit = objpropData.elements.objectui.materialnames.findIndex(m => {
            if (m == objpropData.elements.objectui.materialnameSelected) return true;
            return false;
        });
        if (ishit > -1) {
            objpropData.elements.objectui.materialIsChanges[ishit] = val;
        }
    }
    /**
     * Watch for materialNameSelected event 
     */
    const wa_materialNameSelected = Vue.watch(() => objpropData.elements.objectui.materialnameSelected, (newval, oldval) => {
        if (newval == "") return;

        var param  = newval;
        if (param != null) {
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'ListGetOneUserMaterialFromOuter', param:param},
                "listoneusermaterial",QD_INOUT.returnJS,
                UnityCallback.apply_selectedMaterial,
                {callback: UnityCallback}
            ));
            AppQueue.start();
        }
        

        /*
        var arr = objpropData.elements.objectui.materials.find(item => {
            if (item[0] == newval) return true;
            return false;
        });
        if (arr) {
            console.log(arr);
            objpropData.elements.objectui.materialSelected = arr;

        }*/
    });

    //---OtherObject material method----------------------------------=======================
    const commoncall_objectMaterial = (param) => {
        if (objpropData.elements.objectui.is_apply_allparts) {
            for (var i = 0; i < objpropData.elements.objectui.materialnames.length; i++) {
                var matobj = objpropData.elements.objectui.materialnames[i];
                
                var ishit = objpropData.elements.objectui.materialnames.findIndex(m => {
                    if (m == matobj) return true;
                    return false;
                });
                if (ishit > -1) {
                    objpropData.elements.objectui.materialIsChanges[ishit] = true;
                }

                var newparam = [
                    matobj,
                    param[1],
                    param[2]
                ]
                AppQueue.add(new queueData(
                    {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:newparam.join(",")},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }
            AppQueue.start();
        }else{
            objectMaterialIsChange_onchanged(true);
            objpropData.elements.objectui.matopt.isChanged = true;
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        }
    }
    const objectShader_onchange = (val) => {
        //if (modelOperator.getSelected_objectItem() == null) return;

        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "shader",
            val.value
        ];
        commoncall_objectMaterial(param);
    }
    const objectShaderColor_onchange = (val) => {
        //if (modelOperator.getSelected_objectItem() == null) return;

        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "color",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectCullmode_onchange = (val) => {

        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "cullmode",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectCutOff_onchange = (val) => {

        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "alphacutoff",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectBlendmode_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "renderingtype",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectMetallic_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "metallic",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectGlossiness_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "glossiness",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectEmissionColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "emissioncolor",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectShadetexColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "shadetexcolor",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectShadingToony_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "shadingtoony",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectShadingShift_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "shadingshift",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectReceiveShadow_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "receiveshadow",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectShadingGrade_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "shadinggrade",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectLightColorAttenuation_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "lightcolorattenuation",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectRimColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "rimcolor",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectRimFresnel_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "rimfresnel",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectSrcblend_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "srcblend",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectDstblend_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "dstblend",
            val
        ];
        commoncall_objectMaterial(param);
    }

    /*const objectTexture_onchange = (val) => {
        console.log(val);
        var filepath = URL.createObjectURL(val);
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "maintex",
            val.name + "\t" + filepath
        ];

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterial', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        URL.revokeObjectURL(filepath);
    }*/
    const objectTextureFilelabel_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "maintex",
            val.value
        ];
        commoncall_objectMaterial(param);
    }
    const objectTextureRole_onchange = (val) => {
        if (val.value == null) return;
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "maintex",
            "#Camera" + val.value
        ];
        //console.log(param);

        commoncall_objectMaterial(param);
    }
    const objectFresnelScale_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "fresnelscale",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectReflectionColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "reflectioncolor",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectSpecularColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "specularcolor",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectVector4MaterialSend = (matname, matval) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            matname,
            `${matval.x}\t${matval.y}\t${matval.z}\t${matval.w}`
        ];
        commoncall_objectMaterial(param);
    }
    const objectWaveAmplitude_onchange = (val) => {
        objectVector4MaterialSend("waveamplitude",objpropData.elements.objectui.matopt.waveAmplitude);
    }
    const objectWaveFrequency_onchange = (val) => {
        objectVector4MaterialSend("wavefrequency",objpropData.elements.objectui.matopt.waveFrequency);
    }
    const objectWaveSteepness_onchange = (val) => {
        objectVector4MaterialSend("wavesteepness",objpropData.elements.objectui.matopt.waveSteepness);
    }
    const objectWaveSpeed_onchange = (val) => {
        objectVector4MaterialSend("wavespeed",objpropData.elements.objectui.matopt.waveSpeed);
    }
    const objectWaveDirectionAB_onchange = (val) => {
        objectVector4MaterialSend("wavedirectionab",objpropData.elements.objectui.matopt.waveDirectionAB);
    }
    const objectWaveDirectionCD_onchange = (val) => {
        objectVector4MaterialSend("wavedirectioncd",objpropData.elements.objectui.matopt.waveDirectionCD);
    }
    //---SketchShader
    const objectOutlineWidth_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "outlinewidth",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectStrokeDensity_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "strokedensity",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectAddBrightness_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "addbrightness",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectMultBrightness_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "multbrightness",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectShadowBrightness_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "shadowbrightness",
            val
        ];
        commoncall_objectMaterial(param);
    }
    //---RealToon
    const objectEnableTexTransparent_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "enabletextransparent",
            val //=== true ? 2: 0
        ];
        commoncall_objectMaterial(param);
    }
    const objectMCIALO_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "maincolorinambientlightonly",
            val //=== true ? 2 : 0
        ];
        commoncall_objectMaterial(param);
    }
    const objectDoubleSided_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "doublesided",
            val //=== true ? 2 : 0
        ];
        commoncall_objectMaterial(param);
    }
    const objectOutlineZPosCam_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "outlinezposcam",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectThresHold_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "threshold",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectShadowHardness_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "shadowhardness",
            val
        ];
        commoncall_objectMaterial(param);
    }
    //---ComicShader
    const objectLineWidth_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "linewidth",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectLineColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "linecolor",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectTone1Threshold_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "tone1threshold",
            val
        ];
        commoncall_objectMaterial(param);
    }
    //---IceShader
    const objectIceColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "icecolor",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectTransparency_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "transparency",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectBaseTransparency_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "basetransparency",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectIceRoughness_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "iceroughness",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectDistortion_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "distortion",
            val
        ];
        commoncall_objectMaterial(param);
    }
    const objectPixelSize_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "pixelsize",
            val
        ];
        commoncall_objectMaterial(param);
    }

    //---until here--------------------
    const objectAnimationClip_onselected = (val) => {
        var param = val;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetTargetClip',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'GetSeekPosAnimationFromOuter' },
            "getseekanim",QD_INOUT.returnJS,
            (val) => {
                objpropData.elements.objectui.animation.seek = parseFloat(val);
            }
        ));
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'GetMaxPosAnimationFromOuter'},
            "getmaxposanim",QD_INOUT.returnJS,
            (val) => {
                objpropData.elements.objectui.animation.maxPosition = parseFloat(val);
            }
        ));
        AppQueue.start();
    }
    const objectVRMAnimation_onselected = (val) => {
        var param = (val);
        if (param == "---") {
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'ClearVRMA',param:0},
                "setvrma",QD_INOUT.toUNITY,
                null
            ));
            objpropData.elements.vrmui.vrmanim.isenable = false;
            objpropData.elements.objectui.animation.cliplist = [];
            objpropData.elements.objectui.animation.isenable = false;
        }else{
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'SetVRMAnimation',param:param},
                "setvrma",QD_INOUT.returnJS,
                UnityCallback.after_setvrma,
                {callback: UnityCallback}
            ));
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'AdjustVRMAInitialRotation'},
                "",QD_INOUT.toUNITY,
                null
            ));
            
            //URL.revokeObjectURL(val);
            objpropData.elements.vrmui.vrmanim.isenable = true;
            objpropData.elements.objectui.animation.isenable = true;

            //---to list animation clip
            var cur = mainData.elements.projdlg.vrmaList.find(v => {
                if (v.filename == val) return true;
                return false;
            });
            if (cur) {
                objpropData.elements.objectui.animation.cliplist = cur.data.clips.map(v => v.name);
            }else{
                objpropData.elements.objectui.animation.cliplist = [];
            }
            
             
        }
        AppQueue.start();
    }
    const objectVRMAnimationClear = () => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'DisableVRMA'},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        objpropData.elements.vrmui.vrmanim.file = null;
    }
    const objectVRMAnimationToggleEnable = (val) => {
        var methodname = "EnableVRMA";
        if (val === false) {
            /*AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:"ApplyBoneTransformToIKTransform"},
                "",QD_INOUT.toUNITY,
                null
            )); */
            methodname = "DisableVRMA";
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:methodname,param:0},
                "",QD_INOUT.toUNITY,
                null
            ));
        }else{
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:methodname},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        
        AppQueue.start();
    }
    const objectAnimation_onplay = () => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:"PauseAnimationFromOuter"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();

        if (objpropData.elements.objectui.animation.play_icon == "play_circle") {
            objpropData.elements.objectui.animation.play_icon = "pause";
        }else{
            objpropData.elements.objectui.animation.play_icon = "play_circle";
        }
    }
    const objectAnimation_onstop = () => {        
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:"StopAnimation"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        objpropData.elements.objectui.animation.play_icon = "play_circle";
    }
    const objectAnimationSeek_onseek = (val) => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SeekPlayAnimation',param:parseFloat(val)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectAnimationSpeed_onseek = (val) => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetSpeedAnimation',param:parseFloat(val)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectAnimationLoop_onchange = (val) => {
        var param = val.value;
        //console.log(param);
        if (isNaN(param)) return;
        
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetWrapMode',param:parseInt(param)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectAnimationRegister_onchange = (val) => {
        var param = parseInt(val.value);
        if (isNaN(param)) return;
        
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetPlayFlagAnimationFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //===Light=====================================
    const lightRendermode_onchange = (val) => {
        var param = parseInt(val.value);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetRenderMode',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const base_lightPower_onchange = (avatarId, val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:avatarId,method:'SetPower',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const lightPower_onchange = (val) => {
        base_lightPower_onchange(mainData.states.selectedAvatar.id, val);
    }
    const lightRange_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetRange',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const base_lightColor_onchange = (avatarId, val) => {
        var param = MUtility.toHexaColor(val);
        AppQueue.add(new queueData(
            {target:avatarId,method:'SetColorFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const lightColor_onchange = (val) => {
        base_lightColor_onchange(mainData.states.selectedAvatar.id, val);
    }
    const lightSpotangle_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetSpotAngle',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const base_lightFlareType_onchange = (avatarId, val) => {
        var param = val.value;
        AppQueue.add(new queueData(
            {target:avatarId,method:'SetFlare',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const base_lightFlareColor_onchange = (avatarId, val) => {
        var param = MUtility.toHexaColor(val);
        AppQueue.add(new queueData(
            {target:avatarId,method:'SetFlareColorFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const base_lightFlareBrightness_onchange = (avatarId, val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:avatarId,method:'SetFlareBrightness',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const base_lightFlareFade_onchange = (avatarId, val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:avatarId,method:'SetFlareFade',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const lightFlareType_onchange = (val) => {
        base_lightFlareType_onchange(mainData.states.selectedAvatar.id, val);
    }
    const lightFlareColor_onchange = (val) => {
        base_lightFlareColor_onchange(mainData.states.selectedAvatar.id, val);
    }
    const lightFlareBrightness_onchange = (val) => {
        base_lightFlareBrightness_onchange(mainData.states.selectedAvatar.id, val);
    }
    const lightFlareFade_onchange = (val) => {
        base_lightFlareFade_onchange(mainData.states.selectedAvatar.id, val);
    }
    //===Camera=====================================
    const cameraShowRegister_onchange = (val) => {
        var param = parseInt(val.value);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetCameraPlayingFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const cameraPreview_onclick = () => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:"PreviewCameraFromOuter"},
            "previewcamera",QD_INOUT.returnJS,
            (val) => {
                objpropData.elements.cameraui.previewBtnEnabled = val;
            }
        ));
        AppQueue.start();
    }
    const cameraPreviewStop_onclick = () => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:"EndPreviewFromOuter"},
            "previewendcamera",QD_INOUT.returnJS,
            (val) => {
                objpropData.elements.cameraui.previewBtnEnabled = val;
            }
        ));
        AppQueue.start();
    }
    const cameraFov_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetFoV',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const cameraDepth_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetDepth',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const cameraViewport_onchange = (val) => {
        var rect = new UnityRect(0,0,0,0);
        const vp = objpropData.elements.cameraui.vp;
        rect.x = parseFloat(vp.position.x);
        rect.y = parseFloat(vp.position.y);
        rect.width = parseFloat(vp.size.x);
        rect.height = parseFloat(vp.size.y);
        var param = `${rect.x},${rect.y},${rect.width},${rect.height}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetViewportFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const cameraRenderTextureFlag_onchange = (val) => {
        
        var param = val === true ? 1 : 0;
    
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetCameraRenderFlag',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        
    }
    const cameraRenderTexture_resize = () => {
        const rt = objpropData.elements.cameraui.renderTexture;
        var param =  rt.x + "," + rt.y;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetRenderTexture',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const cameraRenderTextureEnable_onclick = () => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'ApplyRenderTexture'},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const cameraRenderTextureDisable_onclick = () => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'DestroyRenderTexture'},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //===Image======================================
    const imageColor_onchange = (val) => {
        var param = MUtility.toHexaColor(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetBaseColorFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //===Effect=====================================
    const effectPreview_onclick = () => {
        var param = objpropData.elements.effectui.loop ? 1 : 0;
        
        var method = "";
        if (objpropData.elements.effectui.previewBtnIcon == "play_circle") {
            objpropData.elements.effectui.previewBtnIcon = "pause";
            method = "PreviewEffect";
        }else{
            objpropData.elements.effectui.previewBtnIcon = "play_circle";
            method = "PauseEffect";
        }

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:method,param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const effectPreviewOff_onclick = () => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'StopEffect',param:1},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();

        objpropData.elements.effectui.previewBtnIcon = "play_circle";
    }
    const effectGenre_onchange = (val) => {
        var arr = mainData.data.EffectDirectory[val];
        if (arr) {
            objpropData.elements.effectui.effectoptions.splice(0, objpropData.elements.effectui.effectoptions.length);
            arr.forEach(item=> {
                objpropData.elements.effectui.effectoptions.push({label:item, value:item});
            });
        }
    }
    const effectEffect_onchange = (val) => {
        var param = `Effects/${objpropData.elements.effectui.genre}/${val.value}`;
        mainData.states.selectedAvatar.effects =  {
            genre : objpropData.elements.effectui.genre,
            effectName : val.value
        };
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetEffectRef',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const effectAnimationRegister_onclick = (val) => {
        var param = parseInt(val.value);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetPlayFlagEffectFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const effectColliderFlag_onchange = (val) => {
        var param = val ? 1 : 0;
        
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetIsVRMColliderFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const effectColliderSize_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetVRMColliderSize',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const colliderSelector_addbox_onclick = () => {
        var param = objpropData.elements.effectui.colliderTargetSelected.value;

        if (param == null) return;

        var ishit = objpropData.elements.effectui.colliderReigsters.find(item => {
            if (item.roleName == param) return true;
            return false;
        });
        if (ishit) {
            appAlert(t("msg_already_added_collider"));
            return;
        }
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'AddColliderTarget',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        var role = modelOperator.getRole(param, "role");
        if (role) {
            objpropData.elements.effectui.colliderReigsters.push(role);
        }
        
    }
    const colliderTarget_remove_onclick = (item,index) => {
        var param = item.roleName;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'DelColliderTarget',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        objpropData.elements.effectui.colliderReigsters.splice(index,1);
    }
    //===Stage=====================================
    /*const wa_typeoptions = Vue.watch(() => objpropData.elements.stageui.listStageType, (newval, oldval) => {
        stageui.value.typeoptions = newval; 
        stageui.value.typeselected = newval[0];
    });*/
    const wa_typeselected = Vue.watch(() => objpropData.elements.stageui.typeselected, (newval) => {
        if (newval.value == null) return;
        var param = newval.value;
        
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SelectStageFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        if (param == StageType.User) {
            //---first only load materials
            if (!mainData.elements.projdlg.mat_firstload) {
                modelOperator.load_materialFileBody();
            }
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Stage,method:'GetMaterialUserStageFromOuter'},
                "getustg_materialfloat",QD_INOUT.returnJS,
                UnityCallback.getustg_materialfloat,
                {callback: UnityCallback}
            ));
        }else if (
            (param == StageType.BasicSeaLevel) ||
            (param == StageType.SeaDaytime) ||
            (param == StageType.SeaNight)
        ) {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Stage,method:'ListUserMaterialFromOuter',param:"1"},
                "getseastage_material",QD_INOUT.returnJS,
                UnityCallback.getseastage_material,
                {callback: UnityCallback}
            ));
        }
        AppQueue.start();
    });
    const ustg_maintex_onchange = (val) => {
        //var filepath = URL.createObjectURL(val); objpropData.elements.stageui.ustg_maintex
        var param = "main," + val.value;

        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetTextureToUserStage',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        //URL.revokeObjectURL(filepath);
    }
    const ustg_bumpmap_onchange = (val) => {
        //var filepath = URL.createObjectURL(val);
        var param = "normal," + objpropData.elements.stageui.ustg_bumpmap.name;

        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetTextureToUserStage',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        //URL.revokeObjectURL(filepath);
    }
    const ustg_Color_onchange = (val) => {
        //if (modelOperator.getSelected_objectItem() == null) return;

        var param = [
            "color",
            MUtility.toHexaColor(val)
        ];
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetMaterialToUserStage', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const ustg_Blendmode_onchange = (val) => {
        var param = [
            "renderingtype",
            val
        ];
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetMaterialToUserStage', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const ustg_metallic_onchange = (val) => {
        var param = "metallic," + val; 
    
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetMaterialToUserStage',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const ustg_glossiness_onchange = (val) => {
        var param = "glossiness," + val; 
    
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetMaterialToUserStage',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const ustg_emissioncolor_onchange = (val) => {
        var param = "emissioncolor," + MUtility.toHexaColor(val);
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetMaterialToUserStage',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //=== BasicSeaLevel, Sea***** methods
    const seastg_WaveScale_onchange = (val) => {
        var param = [
            "wavescale",
            val
        ];
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const seastg_FresnelScale_onchange = (val) => {
        var param = [
            "fresnelscale",
            val
        ];
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const seastg_BaseColor_onchange = (val) => {
        var param = [
            "basecolor",
            val
        ];
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const seastg_ReflectionColor_onchange = (val) => {
        var param = [
            "reflectioncolor",
            val
        ];
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const seastg_SpecularColor_onchange = (val) => {
        var param = [
            "specularcolor",
            val
        ];
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const seastg_Vector4MaterialSend = (matname, matval) => {
        var param = [
            matname,
            `${matval.x}\t${matval.y}\t${matval.z}\t${matval.w}`
        ];
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Stage,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const seastg_WaveAmplitude_onchange = (val) => {
        seastg_Vector4MaterialSend("waveamplitude",objpropData.elements.stageui.stage_sea.waveAmplitude);
    }
    const seastg_WaveFrequency_onchange = (val) => {
        seastg_Vector4MaterialSend("wavefrequency",objpropData.elements.stageui.stage_sea.waveFrequency);
    }
    const seastg_WaveSteepness_onchange = (val) => {
        seastg_Vector4MaterialSend("wavesteepness",objpropData.elements.stageui.stage_sea.waveSteepness);
    }
    const seastg_WaveSpeed_onchange = (val) => {
        seastg_Vector4MaterialSend("wavespeed",objpropData.elements.stageui.stage_sea.waveSpeed);
    }
    const seastg_WaveDirectionAB_onchange = (val) => {
        seastg_Vector4MaterialSend("wavedirectionab",objpropData.elements.stageui.stage_sea.waveDirectionAB);
    }
    const seastg_WaveDirectionCD_onchange = (val) => {
        seastg_Vector4MaterialSend("wavedirectioncd",objpropData.elements.stageui.stage_sea.waveDirectionCD);
    }

    //---sky properties--------------------------------------------
    const skyMode_onchange = (val) => {
        var param = val.value;
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetClearFlagFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const skyColor_onchange = (val) => {
        var param = val;
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetSkyColorFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const skyShader_onchange = (val) => {
        var param = val.value;
        
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetSkyShader',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const skySunsize_onchange = (val) => {
        var param = "sunsize," + val; 
    
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetSkyMaterial',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const skySunsizeConvergence_onchange = (val) => {
        var param = "sunconvergence," + val; 
    
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetSkyMaterial',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const skyAtmosphere_onchange = (val) => {
        var param = "atmosphere," + val;
    
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'SetSkyMaterial',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
    }
    const skyExposure_onchange = (val) => {
        var param = "exposure," + val;
    
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetSkyMaterial',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const skyRotation_onchange = (val) => {
        var param = "rotation," + val;
    
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetSkyMaterial',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const skyTint_onchange = (val) => {
        var param = "skytint," + MUtility.toHexaColor(val);
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetSkyMaterial',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const skyGroundColor_onchange = (val) => {
        var param = "groundcolor," + MUtility.toHexaColor(val);
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetSkyMaterial',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //---dlight properties--------------------------------------------
    const dlightColor_onchange = (item,evt) => {
        base_lightColor_onchange(AppQueue.unity.DLight, item);        
    }
    const dlightRotation_onchange = (val) => {
        const stageui = objpropData.elements.stageui;
        var param = `${stageui.dlight_rotation.x},${stageui.dlight_rotation.y},${stageui.dlight_rotation.z},1`;
    
        AppQueue.add(new queueData(
            {target:AppQueue.unity.DLight,method:'SetRotationFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const dlightPower_onchange = (val) => {
        base_lightPower_onchange(AppQueue.unity.DLight,val);
    }
    const dlightStrength_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:AppQueue.unity.DLight,method:'SetShadowPower',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const dlightHalo_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:AppQueue.unity.DLight,method:'SetHalo',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const dlightFlareType_onchange = (val) => {
        base_lightFlareType_onchange(AppQueue.unity.DLight, val);
    }
    const dlightFlareColor_onchange = (val) => {
        base_lightFlareColor_onchange(AppQueue.unity.DLight, val);
    }
    const dlightFlareBrightness_onchange = (val) => {
        base_lightFlareBrightness_onchange(AppQueue.unity.DLight, val);
    }
    const dlightFlareFade_onchange = (val) => {
        base_lightFlareFade_onchange(AppQueue.unity.DLight, val);
    }
    //---wind properties--------------------------------------------
    const windDirectionXZ_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Windzone,method:'SetWindDirHorizontal',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const windDirectionY_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Windzone,method:'SetWindDirVertical',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const windPower_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Windzone,method:'SetWindPowerFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const windFrequency_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Windzone,method:'SetWindFrequency',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const windDuration_onchange = (val) => {
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Windzone,method:'SetWindDurationMin',param:val.min},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Windzone,method:'SetWindDurationMax',param:val.max},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //===Text======================================
    const textFontsize_onchange = (val) => {
        var param = parseInt(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetFontSize',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const textColor_onchange = (val) => {
        var param = MUtility.toHexaColor(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetFontColorFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const textStyle_onchange = (val) => {
        var param = parseInt(val.value);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetFontStyle',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const textStyleRich_onchange = (val) => {
        var param = ["-","-","-","-","-","-"];
        if (objpropData.elements.textui.fontstylesRich.b === true) param[0] = "b";
        if (objpropData.elements.textui.fontstylesRich.i === true) param[1] = "i";
        if (objpropData.elements.textui.fontstylesRich.u === true) param[2] = "u";
        if (objpropData.elements.textui.fontstylesRich.s === true) param[3] = "s";
        if (objpropData.elements.textui.fontstylesRich.UL == "U") {
            param[5] = "U";
        }else if (objpropData.elements.textui.fontstylesRich.UL == "L") {
            param[4] = "L";
        }
        console.log(param,param.join(""));
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetFontStyles',param:param.join("")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const textAnchorPos_onchange = (val) => {
        var param = val.value;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetTextAlignment',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const textText_startEdit_onclick = () => {
        appPrompt(t("Text"),(val) => {
            var param = val;
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'SetVVMText',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
            objpropData.elements.textui.text = val;
        },objpropData.elements.textui.text);
    }
    const textText_onchange = (val) => {
        var param = val;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetVVMText',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const textcolortype_onchange = (val) => {
        /*if (val == "g") {
            var param = MUtility.toHexaColor("FFFFFF");
            AppQueue.add(new queueData(
                {target:mainData.states.selectedAvatar.id,method:'SetFontColorFromOuter',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
        }*/
        var param = "";
        if (objpropData.elements.textui.colortype == "s") {
            param = "0";
        }else if (objpropData.elements.textui.colortype = "g") {
            param = "1";
        }
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetEnableColorGradientFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        
        
    }
    const textOverflow_onchange = (val) => {
        var param = val.value;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetTextOverflow',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const textcolorGradient_onchange = (val, dir) => {
        
        var param = `${dir},${MUtility.toHexaColor(val)}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetColorGradientFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        
    }
    const textAreasize_onchange = () => {
        //if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;
        var x = parseFloat(objpropData.elements.textui.area_size.x);
        var y = parseFloat(objpropData.elements.textui.area_size.y);
        if (isNaN(x) || isNaN(y)) return;

        var param = `${x},${y}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetTextAreaSizeFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        return true;
    }
    const textOutlineWidth_onchange = (val) => {
        var param = `${val}`;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetFontOutlineWidthFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const textOutlineColor_onchange = (val) => {
        var param = MUtility.toHexaColor(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetFontOutlineColorFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    
    //===UImage====================================
    const uimageColor_onchange = (val) => {
        var param = MUtility.toHexaColor(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetImageBaseColorFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }

    //---clipboard operator------------------------
    const clipboard = definePropertyClipboard(app, Quasar, mainData,objpropData, modelOperator);

    //---element reference---------------------------
    const rightdrawer = Vue.ref(null);

    Vue.onMounted(() => {
        //objpropData.elements.vrmui.lefthand.poseSelected = objpropData.elements.vrmui.lefthand.poseOptions[0];
        //objpropData.elements.vrmui.righthand.poseSelected = objpropData.elements.vrmui.righthand.poseOptions[0];
    });
    return {
        objpropEvent : Vue.reactive({
            //---computed-----------------------
            checkDimension, curprop,
            checkVRM,checkOObject,checkLight,checkCamera,checkImage,checkEffect,
            checkStage,checkStageType,checkStageTypeWater,checkSkyMode,checkSkyShaderProcedural,checkSkyShader6sided,
            checkText,checkUImage,checkText3D,
            checkVRMEquipItemChecked,showEquipedItemBodypart,
            checkMaterialShaderVRMMToon,checkMaterialShaderStandard,checkMaterialShaderWater,
            checkMaterialShaderSketchShader,checkMaterialShaderPostSketchShader,
            checkMaterialShaderRealToon,checkMaterialShaderComic,checkMaterialShaderIce,
            checkEnumMaterialTexture,checkEnumRTCamera,checkEnumVRM,checkEnumAssignObjectOfIKHandles,
            checkRightHandPoseType, checkLeftHandPoseType,
            //---watch--------------------------
            wa_materialNameSelected,
            //---events-------------------------
            rightdrawer_minimize,getCurrentModeSize,setupMobileSize,
            OnChange_Position3D,OnChange_Rotation3D,OnChange_Scale3D,
            OnChange_Position2D,OnChange_Rotation2D,OnChange_Scale2D,OnChange_Size2D,
            OnChange_JumpNum,OnChange_JumpPower,OnChange_PunchColumn,OnChange_ShakeColumn,
            OnChange_RigidDrag,OnChange_UseCollision,OnChange_UseGravity,

            wa_propVRMMoveMode,
            OnChange_NaturalRotation_LeftHand,OnChange_NaturalRotation_RightHand,OnChange_NaturalRotation_LeftFoot,OnChange_NaturalRotation_RightFoot,
            OnClick_ApplyNaturalRotation,
            OnClicked_editIKPosition,OnClicked_editGravity,OnClicked_MirrorPose,
            OnChange_LeftHand,OnChange_RightHand,OnChange_FingerStretch,
            onchange_expression_searchstr,onchange_bs_searchstr,OnChange_BlendShape, OnChange_BlendShape_Checked,
            OnChange_Blink_enable,OnChange_Blink_interval,OnChange_Blink_opening,OnChange_Blink_closing,OnChange_Blink_closeTime,
            OnChange_Lipsync_enable,OnChange_Lipsync_interval,OnChange_Lipsync_opening,OnChange_Lipsync_closing,
            equiptarget_addbox_onclick,equipparts_onclicked,equipDialog_OK_OnClick,equipDialog_Cancel_OnClick,
            OnChanged_IKHandleSelected,OnChanged_IKHandleAssigning,OnClick_IKHandleReset,
            OnChange_HeadLock,
            
            objectMaterial_onselected,objectMaterialIsChange_onchanged,
            objectShader_onchange,objectShaderColor_onchange,objectCullmode_onchange,objectCutOff_onchange,objectBlendmode_onchange,
            objectMetallic_onchange,objectGlossiness_onchange,objectEmissionColor_onchange,objectShadetexColor_onchange,
            objectShadingToony_onchange,objectShadingShift_onchange,objectReceiveShadow_onchange,objectShadingGrade_onchange,objectLightColorAttenuation_onchange,
            objectRimColor_onchange,objectRimFresnel_onchange,
            objectSrcblend_onchange,objectDstblend_onchange,
            objectFresnelScale_onchange,objectReflectionColor_onchange,objectSpecularColor_onchange,
            objectWaveAmplitude_onchange,objectWaveFrequency_onchange,
            objectWaveSteepness_onchange,objectWaveSpeed_onchange,
            objectWaveDirectionAB_onchange,objectWaveDirectionCD_onchange,
            objectOutlineWidth_onchange,objectStrokeDensity_onchange,
            objectAddBrightness_onchange,objectMultBrightness_onchange,objectShadowBrightness_onchange,
            objectEnableTexTransparent_onchange,objectMCIALO_onchange,objectDoubleSided_onchange,
            objectOutlineZPosCam_onchange,objectThresHold_onchange,objectShadowHardness_onchange,
            objectLineWidth_onchange,objectLineColor_onchange,objectTone1Threshold_onchange,
            objectIceColor_onchange,objectTransparency_onchange,objectBaseTransparency_onchange,objectIceRoughness_onchange,
            objectDistortion_onchange,objectPixelSize_onchange,

                //objectTexture_onchange,
                objectTextureFilelabel_onchange,objectTextureRole_onchange,
            objectAnimationClip_onselected,objectAnimation_onplay,objectAnimationLoop_onchange,
                objectAnimation_onstop,objectAnimationSeek_onseek,objectAnimationSpeed_onseek,objectAnimationRegister_onchange,
                objectVRMAnimation_onselected,objectVRMAnimationClear,objectVRMAnimationToggleEnable,

            lightRendermode_onchange,lightColor_onchange,lightPower_onchange,
            lightRange_onchange,lightSpotangle_onchange,
            lightFlareType_onchange,lightFlareColor_onchange,lightFlareBrightness_onchange,lightFlareFade_onchange,
            cameraShowRegister_onchange,cameraPreview_onclick,cameraPreviewStop_onclick,
            cameraFov_onchange,cameraDepth_onchange,cameraViewport_onchange,
            cameraRenderTextureFlag_onchange,cameraRenderTexture_resize,
            cameraRenderTextureEnable_onclick,cameraRenderTextureDisable_onclick,

            imageColor_onchange,

            effectPreview_onclick,effectPreviewOff_onclick,effectGenre_onchange,effectEffect_onchange,
            effectAnimationRegister_onclick,effectColliderFlag_onchange,effectColliderSize_onchange,
            colliderSelector_addbox_onclick,colliderTarget_remove_onclick,

            wa_typeselected, 
            seastg_WaveScale_onchange, seastg_FresnelScale_onchange,seastg_BaseColor_onchange,seastg_ReflectionColor_onchange,
            seastg_SpecularColor_onchange,seastg_Vector4MaterialSend,seastg_WaveAmplitude_onchange,
            seastg_WaveFrequency_onchange,seastg_WaveSteepness_onchange,seastg_WaveSpeed_onchange,
            seastg_WaveDirectionAB_onchange, seastg_WaveDirectionCD_onchange,

            ustg_maintex_onchange,ustg_bumpmap_onchange,
            ustg_Color_onchange,ustg_Blendmode_onchange,
            ustg_metallic_onchange,ustg_glossiness_onchange,ustg_emissioncolor_onchange,

            dlightColor_onchange,dlightRotation_onchange,dlightPower_onchange,dlightStrength_onchange,dlightHalo_onchange,
            dlightFlareType_onchange,dlightFlareColor_onchange,dlightFlareBrightness_onchange,dlightFlareFade_onchange,
            skyMode_onchange,skyColor_onchange,skyShader_onchange,skySunsize_onchange,skySunsizeConvergence_onchange,skyAtmosphere_onchange,
            skyExposure_onchange,skyRotation_onchange,
            skyTint_onchange,skyGroundColor_onchange,
            windDirectionXZ_onchange,windDirectionY_onchange,windPower_onchange,windFrequency_onchange,windDuration_onchange,

            textFontsize_onchange,textColor_onchange,textStyle_onchange,
            textStyleRich_onchange,textOverflow_onchange,
            textAnchorPos_onchange,textText_startEdit_onclick,textText_onchange,textAreasize_onchange,
            textcolortype_onchange,textOutlineWidth_onchange,textOutlineColor_onchange,textcolorGradient_onchange,

            uimageColor_onchange,

            clipboard,
        }),
        rightdrawer
    }
}