import { AF_TARGETTYPE, AF_MOVETYPE, CNS_BODYBONES, UserAnimationState, StageType } from "../res/appconst.js";
import { VVAvatar, VVProp, VVBlendShape, VVAvatarEquipSaveClass } from "./prop/cls_vvavatar.js";
import { definePropertyClipboard } from "./cls_clipboard.js";
import { appModelOperator } from "./model/operator.js";
import { UnityRect, UnityVector3, AvatarPunchEffect,AvatarShakeEffect } from "./prop/cls_unityrel.js";
import { UnityCallbackFunctioner } from "./model/callback.js";

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {*} mainData 
 * @param {*} objpropData 
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
        return ((objpropData.states.dimension == "2d") && (mainData.states.selectedAvatar.type == AF_TARGETTYPE.Text));
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
        return objpropData.elements.objectui.matopt.shaderselected.value == 'VRM/MToon';
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
                    (cast.type == AF_TARGETTYPE.Effect)
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

//---events, watchtes-------------------------------------------------------
    //===commonly====================================
    const rightdrawer_minimize = () => {
        objpropData.elements.drawer.miniState = !objpropData.elements.drawer.miniState;

        var w = parseInt(mainData.elements.canvas.scrollArea.width);
        //console.log(rightdrawer.value);
        if (objpropData.elements.drawer.miniState) {
            mainData.elements.canvas.scrollArea.width = `${w + objpropData.elements.drawer.width - objpropData.elements.drawer.miniwidth}px`;
        }else{
            mainData.elements.canvas.scrollArea.width = `${w + objpropData.elements.drawer.miniwidth - objpropData.elements.drawer.width}px`;
        }
    }
    const getCurrentModeSize = () => {
        return (objpropData.elements.drawer.miniState) ? objpropData.elements.drawer.miniwidth : objpropData.elements.drawer.width;
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
        if (isNaN(x)) return;

        objpropData.states.isEditingFromUI = true;
        var fl = x / 100.0;

        var vec = new UnityVector3(0,0,0);
        if (mainData.states.selectedAvatar.type == AF_TARGETTYPE.Stage) {
            vec.x = fl;
            vec.y = 1;
            vec.z = fl;
        }else{
            vec.x = fl;
            vec.y = fl;
            vec.z = fl;
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
        var param = new AvatarPunchEffect();
        param.copyFrom(objpropData.elements.common.punch);
        param.isEnable = param.isEnable == true ? 1 : 0;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetPunchFromOuter',param:JSON.stringify(param)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const OnChange_ShakeColumn = (val) => {
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
    }
    //===VRM========================================
    const wa_propVRMMoveMode = Vue.watch(() => objpropData.elements.vrmui.movemode,(newval) => {
        
        if (!modelOperator.getSelected_objectItem(mainData.states.selectedAvatar.id)) return false;
        
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'ChangeToggleAvatarMoveFromOuter',param:newval ? 1 : 0},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        return true;
    },{deep:true});
    const OnClicked_editIKPosition = () => {
        //mainData.elements.bonetrandlg.show = true;

        modelOperator.returnBoneTransformReloadBtn({avatarId: mainData.states.selectedAvatar.id});

        mainData.elements.win_bonetransform = window.open("./static/win/bonetran/index.html",
            "_blank",
            "width=865,height=500,alwaysRaised=yes,resizable=yes,autoHideMenuBar=true"
        );
    }
    const OnClicked_editGravity = () => {
        mainData.elements.gravitybonedlg.show = true;
        /*AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'ListGravityInfoFromOuter'},
            "open_gravitywindow",QD_INOUT.returnJS,
            callback.open_gravitywindow,
            {callback}
        ));
        AppQueue.start();*/
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
        AppQueue.start();
        return true;
    }
    const OnChange_LeftHand = () => {
        return _HandWatchBody("l",objpropData.elements.vrmui.lefthand);
    }
    const OnChange_RightHand = () => {
        return _HandWatchBody("r",objpropData.elements.vrmui.righthand);
    }
    //------Blendshape---
    const OnChange_BlendShape = (value,evt) => {
        var bs = parseFloat(value);
        if (isNaN(bs)) return;

        var param = `${evt.id},${bs}`;
        AppQueue.add(new queueData(
            {target:AppQueue.unity.OperateActiveVRM,method:'changeAvatarBlendShapeByName', param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        mainData.states.selectedAvatar.setBlendShape(evt.id, value);
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
                (cast.type == AF_TARGETTYPE.Effect)
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
        
    }
    /**
     * Watch for materialNameSelected event 
     */
    const wa_materialNameSelected = Vue.watch(() => objpropData.elements.objectui.materialnameSelected, (newval) => {
        if (newval == "") return;

        var param  = newval;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'ListGetOneUserMaterialFromOuter', param:param},
            "listoneusermaterial",QD_INOUT.returnJS,
            (val) => {
                var arr = val.split("=");
                
                var el = objpropData.elements;

                el.objectui.matopt.shaderselected = el.objectui.matopt.shader.find(item => {
                    if (item.value == arr[1]) return true;
                    return false;
                });
                if ((arr[1] == "Standard") || (arr[1] == "VRM/MToon")){
                    el.objectui.matopt.colorselected = MUtility.toHexaColor(arr[2]);
                    var cullmode = el.objectui.matopt.cullmode.find(item => {
                        if (item.value == parseInt(arr[3])) return true;
                        return false;
                    });
                    if (cullmode) el.objectui.matopt.cullmodeselected =  cullmode.value;
                    el.objectui.matopt.blendmodeselected = el.objectui.matopt.blendmode.find(item => {
                        if (item.value == parseInt(arr[4])) return true;
                        return false;
                    });
                    if (arr[5].indexOf("#Camera") > -1) {
                        //---Camera object
                        el.objectui.matopt.textureSeltypeselected = el.objectui.matopt.textureSeltype[1];
                        var role = arr[5].replace("#Camera","");
                        el.objectui.matopt.textureCameraRender = 
                            el.objectui.matopt.textureCameraRenderOptions.find(match => {
                                if (match.value == role) return true;
                                return false;
                            });
                    }else{
                        //---Normal texture name
                        el.objectui.matopt.textureSeltypeselected = el.objectui.matopt.textureSeltype[0];
                        el.objectui.matopt.textureFilelabelSelected = arr[5];
                    }
                    
                    el.objectui.matopt.metallic = parseFloat(arr[6]);
                    el.objectui.matopt.glossiness = parseFloat(arr[7]);
                    el.objectui.matopt.emissioncolor = MUtility.toHexaColor(arr[8]);
                    el.objectui.matopt.shadetexcolor = MUtility.toHexaColor(arr[9]);
                    el.objectui.matopt.shaingtoony = parseFloat(arr[10]);
                    el.objectui.matopt.rimcolor = MUtility.toHexaColor(arr[11]);
                    el.objectui.matopt.rimfresnel = parseFloat(arr[12]);
                    el.objectui.matopt.srcblend = parseFloat(arr[13]);
                    el.objectui.matopt.dstblend = parseFloat(arr[14]);
                }else if (arr[1] == "FX/Water4") {
                    el.objectui.matopt.fresnelScale = parseFloat(arr[2]);
                    el.objectui.matopt.colorselected = MUtility.toHexaColor(arr[3]);
                    el.objectui.matopt.reflectionColor = MUtility.toHexaColor(arr[4]);
                    el.objectui.matopt.specularColor = MUtility.toHexaColor(arr[5]);

                    var wa = arr[6].split(",");
                    el.objectui.matopt.waveAmplitude.x = parseFloat(wa[0]);
                    el.objectui.matopt.waveAmplitude.y = parseFloat(wa[1]);
                    el.objectui.matopt.waveAmplitude.z = parseFloat(wa[2]);
                    el.objectui.matopt.waveAmplitude.w = parseFloat(wa[3]);

                    var wf = arr[7].split(",");
                    el.objectui.matopt.waveFrequency.x = parseFloat(wf[0]);
                    el.objectui.matopt.waveFrequency.y = parseFloat(wf[1]);
                    el.objectui.matopt.waveFrequency.z = parseFloat(wf[2]);
                    el.objectui.matopt.waveFrequency.w = parseFloat(wf[3]);

                    var wt = arr[8].split(",");
                    el.objectui.matopt.waveSteepness.x = parseFloat(wt[0]);
                    el.objectui.matopt.waveSteepness.y = parseFloat(wt[1]);
                    el.objectui.matopt.waveSteepness.z = parseFloat(wt[2]);
                    el.objectui.matopt.waveSteepness.w = parseFloat(wt[3]);

                    var ws = arr[9].split(",");
                    el.objectui.matopt.waveSpeed.x = parseFloat(ws[0]);
                    el.objectui.matopt.waveSpeed.y = parseFloat(ws[1]);
                    el.objectui.matopt.waveSpeed.z = parseFloat(ws[2]);
                    el.objectui.matopt.waveSpeed.w = parseFloat(ws[3]);

                    var wdab = arr[10].split(",");
                    el.objectui.matopt.waveDirectionAB.x = parseFloat(wdab[0]);
                    el.objectui.matopt.waveDirectionAB.y = parseFloat(wdab[1]);
                    el.objectui.matopt.waveDirectionAB.z = parseFloat(wdab[2]);
                    el.objectui.matopt.waveDirectionAB.w = parseFloat(wdab[3]);

                    var wdcd = arr[11].split(",");
                    el.objectui.matopt.waveDirectionCD.x = parseFloat(wdcd[0]);
                    el.objectui.matopt.waveDirectionCD.y = parseFloat(wdcd[1]);
                    el.objectui.matopt.waveDirectionCD.z = parseFloat(wdcd[2]);
                    el.objectui.matopt.waveDirectionCD.w = parseFloat(wdcd[3]);

                }

            }
        ));
        AppQueue.start();

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

    //---OtherObject material method---
    const objectShader_onchange = (val) => {
        //if (modelOperator.getSelected_objectItem() == null) return;

        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "shader",
            val.value
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectShaderColor_onchange = (val) => {
        //if (modelOperator.getSelected_objectItem() == null) return;

        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "color",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectCullmode_onchange = (val) => {

        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "cullmode",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectBlendmode_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "renderingtype",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectMetallic_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "metallic",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectGlossiness_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "glossiness",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectEmissionColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "emissioncolor",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectShadetexColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "shadetexcolor",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectShadingToony_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "shadingtoony",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectRimColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "rimcolor",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectRimFresnel_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "rimfresnel",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectSrcblend_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "srcblend",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectDstblend_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "dstblend",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
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
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectTextureRole_onchange = (val) => {
        if (val.value == null) return;
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "maintex",
            "#Camera" + val.value
        ];
        //console.log(param);

        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectFresnelScale_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "fresnelscale",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectReflectionColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "reflectioncolor",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectSpecularColor_onchange = (val) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            "specularcolor",
            val
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const objectVector4MaterialSend = (matname, matval) => {
        var param = [
            objpropData.elements.objectui.materialnameSelected,
            matname,
            `${matval.x}\t${matval.y}\t${matval.z}\t${matval.w}`
        ];
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetUserMaterialFromOuter', param:param.join(",")},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
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
    const objectAnimation_onplay = () => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'PauseAnimationFromOuter'},
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
            {target:mainData.states.selectedAvatar.id,method:'StopAnimation'},
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
        if (isNaN(param.value)) return;
        
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetWrapMode',param:parseInt(param.value)},
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
    const lightPower_onchange = (val) => {
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetPower',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
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
    const lightColor_onchange = (val) => {
        var param = MUtility.toHexaColor(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetColorFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
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
    //===Camera=====================================
    const cameraShowReginster_onchange = (val) => {
        var param = parseInt(val.value);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetCameraPlaying',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const cameraPreview_onclick = () => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:"PreviewCamera"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const cameraPreviewStop_onclick = () => {
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:"EndPreview"},
            "",QD_INOUT.toUNITY,
            null
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
        /*
        var param = val === true ? 1 : 0;
    
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetCameraRenderFlag',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        */
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
        var param = item;
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetColorFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
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
        var param = parseFloat(val);
        AppQueue.add(new queueData(
            {target:AppQueue.unity.DLight,method:'SetPower',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
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
            {target:mainData.states.selectedAvatar.id,method:'SetFontColor',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const textStyle_onchange = (val) => {
        var param = parseInt(val);
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetFontStyle',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const textAnchorPos_onchange = (val) => {
        var param = val;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetAnchorPos',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const textText_onchange = (val) => {
        var param = val;
        AppQueue.add(new queueData(
            {target:mainData.states.selectedAvatar.id,method:'SetText',param:param},
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
            checkText,checkUImage,
            checkVRMEquipItemChecked,showEquipedItemBodypart,
            checkMaterialShaderVRMMToon,checkMaterialShaderStandard,checkMaterialShaderWater,
            checkEnumMaterialTexture,checkEnumRTCamera,checkEnumVRM,checkEnumAssignObjectOfIKHandles,
            //---watch--------------------------
            wa_materialNameSelected,
            //---events-------------------------
            rightdrawer_minimize,getCurrentModeSize,
            OnChange_Position3D,OnChange_Rotation3D,OnChange_Scale3D,
            OnChange_Position2D,OnChange_Rotation2D,OnChange_Scale2D,OnChange_Size2D,
            OnChange_JumpNum,OnChange_JumpPower,OnChange_PunchColumn,OnChange_ShakeColumn,
            wa_propVRMMoveMode,OnClicked_editIKPosition,OnClicked_editGravity,OnChange_LeftHand,OnChange_RightHand,OnChange_BlendShape,
            OnChange_Blink_enable,OnChange_Blink_interval,OnChange_Blink_opening,OnChange_Blink_closing,OnChange_Blink_closeTime,
            equiptarget_addbox_onclick,equipparts_onclicked,equipDialog_OK_OnClick,equipDialog_Cancel_OnClick,
            OnChanged_IKHandleSelected,OnChanged_IKHandleAssigning,OnClick_IKHandleReset,
            OnChange_HeadLock,
            
            objectMaterial_onselected,
            objectShader_onchange,objectShaderColor_onchange,objectCullmode_onchange,objectBlendmode_onchange,
            objectMetallic_onchange,objectGlossiness_onchange,objectEmissionColor_onchange,objectShadetexColor_onchange,
            objectShadingToony_onchange,objectRimColor_onchange,objectRimFresnel_onchange,
            objectSrcblend_onchange,objectDstblend_onchange,
            objectFresnelScale_onchange,objectReflectionColor_onchange,objectSpecularColor_onchange,
            objectWaveAmplitude_onchange,objectWaveFrequency_onchange,
            objectWaveSteepness_onchange,objectWaveSpeed_onchange,
            objectWaveDirectionAB_onchange,objectWaveDirectionCD_onchange,

                //objectTexture_onchange,
                objectTextureFilelabel_onchange,objectTextureRole_onchange,
            objectAnimationClip_onselected,objectAnimation_onplay,objectAnimationLoop_onchange,
                objectAnimation_onstop,objectAnimationSeek_onseek,objectAnimationSpeed_onseek,objectAnimationRegister_onchange,

            lightRendermode_onchange,lightColor_onchange,lightPower_onchange,
            lightRange_onchange,lightSpotangle_onchange,
            cameraShowReginster_onchange,cameraPreview_onclick,cameraPreviewStop_onclick,
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

            dlightColor_onchange,dlightRotation_onchange,dlightPower_onchange,dlightStrength_onchange,
            skyMode_onchange,skyColor_onchange,skyShader_onchange,skySunsize_onchange,skySunsizeConvergence_onchange,skyAtmosphere_onchange,
            skyExposure_onchange,skyRotation_onchange,
            skyTint_onchange,skyGroundColor_onchange,
            windDirectionXZ_onchange,windDirectionY_onchange,windPower_onchange,windFrequency_onchange,windDuration_onchange,

            textFontsize_onchange,textColor_onchange,textStyle_onchange,textAnchorPos_onchange,textText_onchange,

            uimageColor_onchange,

            clipboard,
        }),
        rightdrawer
    }
}