import { AF_TARGETTYPE } from "../res/appconst.js"
import { UnityVector3 } from "./prop/cls_unityrel.js";
import { VVBlendShape } from "./prop/cls_vvavatar";

export function definePropertyClipboard(app,Quasar,mainData,objpropData,modelOperator) {

    /**
     * 
     * @param {String} typename 
     * @param {String} propname 
     */
    const copy = (typename, propname) => {
        var type = AF_TARGETTYPE[typename];
        if (!type) return;
        const ui = objpropData.elements;
        var clip = objpropData.data.clipboard[type];
        if (!clip) clip = {};

        if (type == AF_TARGETTYPE.VRM) {
            if (propname == "hand") {
                clip["hand"] = {
                    lefthandpose : ui.vrmui.lefthand.poseSelected,
                    righthandpose : ui.vrmui.righthand.poseSelected,
                    lefthandposeValue : ui.vrmui.lefthand.poseValue,
                    righthandposeValue : ui.vrmui.righthand.poseValue
                }
            }else if (propname == "blendshape") {
                clip["blendshape"] = null;
                clip["blendshape"] = [];
                for (var i = 0; i < mainData.states.selectedAvatar.blendShapeList.length; i++) {
                    var bs = mainData.states.selectedAvatar.blendShapeList[i];
                    var cls = new VVBlendShape();
                    cls.id = bs.id;
                    cls.title = bs.title;
                    cls.value = bs.value;
                    clip["blendshape"].push(cls);
                }
            }
        }else if (type == AF_TARGETTYPE.OtherObject) {
            if (propname == "textureprop") {

            }else if (propname == "animprop") {
                clip["animation"] = {
                    seek : ui.objectui.animation.seek,
                    speed : ui.objectui.animation.speed,
                    flagSelected : ui.objectui.animation.flagSelected
                }
            }
        }else if (type == AF_TARGETTYPE.Light) {
            if (propname == "lightprop") {
                clip["light"] = {
                    color : ui.lightui.colorselected,
                    power : ui.lightui.power,
                    range : ui.lightui.range,
                    spotangle : ui.lightui.spotangle,
                    rendermode : ui.lightui.rendermodeselected
                };
            }
        }else if (type == AF_TARGETTYPE.Camera) {
            if (propname == "cameraprop") {
                clip["camera"] = {
                    flagSelected : ui.cameraui.animation.flagSelected,
                    fov : ui.cameraui.fov,
                    depth : ui.cameraui.depth,
                    vp : {
                        position : new UnityVector3(ui.cameraui.vp.position.x,ui.cameraui.vp.position.y,0),
                        size : new UnityVector3(ui.cameraui.vp.size.x, ui.cameraui.vp.size.y, 0)
                    },
                    renderTexture : {
                        isOn : ui.cameraui.renderTexture.isOn,
                        x : ui.cameraui.renderTexture.x,
                        y : ui.cameraui.renderTexture.y,
                    }
                };
            }
        }else if (type == AF_TARGETTYPE.Image) {
            if (propname == "imageprop") {
                clip["image"] = {
                    color : ui.imageui.colorselected
                }
            }
        }else if (type == AF_TARGETTYPE.Effect) {
            if (propname == "effectprop") {
                clip["effect"] = {
                    genre : ui.effectui.genre,
                    effect : ui.effectui.effect,
                    loop : ui.effectui.loop,
                    flagSelected : ui.effectui.animation.flagSelected,
                }
            }else if (propname == "effectcolliderprop") {
                var arr = [];
                ui.effectui.colliderRegisters.forEach(item => {
                    arr.push(item);
                });
                clip["collider"] = {
                    on : ui.effectui.colliderOn,
                    size : ui.effectui.colliderSize,
                    targetSelected : ui.effectui.colliderTargetSelected,
                    registers : arr
                }
            }
        }else if (type == AF_TARGETTYPE.Stage) {
            if (propname == "stageprop") {
                clip["stage"] = {
                    type : ui.stageui.typeselected,
                    ustg_metallic : ui.stageui.ustg_metallic,
                    ustg_glossiness : ui.stageui.ustg_glossiness,
                    ustg_emissioncolor : ui.stageui.ustg_emissioncolor,
                }
            }else if (propname == "skyprop") {
                clip["sky"] = {
                    type : ui.stageui.skymodeselected,
                    shaderselected : ui.stageui.skyshaderselected,
                    color : ui.stageui.skycolorselected,
                    param : {
                        sunsize : ui.stageui.skyparam.sunsize,
                        sunsize_convergence : ui.stageui.skyparam.sunsize_convergence,
                        atmosphere_thickness : ui.stageui.skyparam.atmosphere_thickness,
                        exposure : ui.stageui.skyparam.exposure,
                        rotation : ui.stageui.skyparam.rotation,
                        tint : ui.stageui.skyparam.tint,
                        ground_color : ui.stageui.skyparam.ground_color,
                    }
                    
                }
            }else if (propname == "dlightprop") {
                clip["dlight"] = {
                    rotation : ui.stageui.dlight_rotation,
                    power : ui.stageui.dlight_power,
                    strength : ui.stageui.dlight_strength,
                    color : ui.stageui.dlight_color,
                }
            }else if (propname == "windprop") {
                clip["wind"] = {
                    direction : {
                        xz : ui.stageui.winddirection.xz,
                        y : ui.stageui.winddirection.y
                    },
                    power : ui.stageui.windpower,
                    frequency : ui.stageui.windfrequency,
                    duration : {
                        min : ui.stageui.windduration.min,
                        max : ui.stageui.windduration.max
                    }
                }
            }
        }else if (type == AF_TARGETTYPE.Text) {
            if (propname == "textprop") {
                clip["text"] = {
                    text : ui.textui.text,
                    anchor_position : ui.textui.anchor_position,
                    size : ui.textui.size,
                    colorselected : ui.textui.colorselected,
                    fontstyleselected : ui.textui.fontstyleselected,
                }
            }
        }else if (type == AF_TARGETTYPE.UImage) {
            if (propname == "uimageprop") {
                clip["uimage"] = {
                    colorselected : ui.uimageui.colorselected
                }
            }
        }

        console.log(clip);
    }
    /**
     * 
     * @param {String} typename 
     * @param {String} propname 
     */
    const paste = (typename, propname) => {
        var type = AF_TARGETTYPE[typename];
        if (!type) return;
        var clip = objpropData.data.clipboard[type];
        console.log(clip);
        if (type == AF_TARGETTYPE.VRM) {
            var ui = objpropData.elements.vrmui;
            if (propname == "hand") {
                if (clip["hand"]) {
                    ui.lefthand.poseSelected = clip.hand.lefthandpose;
                    ui.righthand.poseSelected = clip.hand.righthandpose;
                    ui.lefthand.poseSelected = clip.hand.lefthandposeValue;
                    ui.righthand.poseSelected = clip.hand.righthandposeValue;
                }
            }
        }else if (type == AF_TARGETTYPE.OtherObject) {
        }else if (type == AF_TARGETTYPE.Light) {
        }
    }
    return {
        copy,paste
    }
}