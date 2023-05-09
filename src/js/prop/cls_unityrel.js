import { AF_MOVETYPE, AF_TARGETTYPE, CameraClearFlags, IKBoneType } from "../../res/appconst";

export class AnimationRegisterOptions
{
    constructor() {
        this.index = -1;
        this.duration = 0.1;
        this.targetId = "";
        this.targetRole = "";
        this.targetType = AF_TARGETTYPE.Unknown;
        this.isTransformOnly = 0;
        this.isHandOnly = 0;
        this.isBlendShapeOnly = 0;
        this.isPropertyOnly = 0;
        this.isDefineOnly = 0;
        this.isAnimationSeekOnly = 0;
        this.isSystemEffectOnly = 0;

        this.isRotate360 = 0;
        
        this.isCompileAnimation = 0;

        this.ease = 1;
        //this.registerBone = IKBoneType.None;
        //this.registerMove = AF_MOVETYPE.Rest;
        /**
         * @type {Array<Number>}
         */
        this.registerBoneTypes = [];
        /**
         * @type {Array<Number>}
         */
        this.registerMoveTypes = [];
        /**
         * to append registration a motion to same key-frame
         */
        this.isRegisterAppend = 0;
        /**
         * Index to execute DOPath for "Translate"
         */
        this.addTranslateExecuteIndex = -1;

    }
}
export class AnimationTransformRegisterOptions
{
    constructor() {
        this.index = -1;
        this.duration = 0.1;
        this.targetId = "";
        this.targetRole = "";
        this.targetType = AF_TARGETTYPE.Unknown;
        this.posx = 0;
        this.posy = 0;
        this.posz = 0;
        this.rotx = 0;
        this.roty = 0;
        this.rotz = 0;
        this.isAbsolutePosition = 0;
        this.isAbsoluteRotation = 0;
        
    }
}
export class AnimationParsingOptions
{
    constructor() {
        //priority: finalizeIndex > 0 ? finalizeIndex : index > 0 ? index : ERROR
        this.index = -1;
        this.finalizeIndex = -1;
        this.endIndex = -1;

        this.targetId = "";
        this.targetRole = "";
        this.targetType = AF_TARGETTYPE.Unknown;
        /**
         * execute an animation by DOTween / manually
         */
        this.isExecuteForDOTween = 1;
        this.isSystemEffectOnly = 0;
        this.isCameraPreviewing = 1;
        /**
         * build DOTween-sequence for the animation / recover frame-configuration
         */
        this.isBuildDoTween = 0;
        //this.isBuildAnimation = 0;
        /**
         * compile an animation (DOTween to manually: future library)
         */
        this.isCompileAnimation = 0;
        this.isRebuildAnimation = 0;
        this.isShowIK = 0;

        /**
         * Index to execute DOPath for "Translate"
         */
        this.addTranslateExecuteIndex = -1;

        this.endDelay = 0.0;
    }
}
export class AnimationTargetParts
{
    constructor() {
        /**
         * @type {IKBoneType}
         */
        this.vrmBone = "";

        /**
         * @type {AF_MOVETYPE}
         */
        this.animationType;

        /**
         * @type {UnityVector3}
         */
        this.position = new UnityVector3(0,0,0);
        /**
         * @type {UnityVector3}
         */
        this.rotation = new UnityVector3(0,0,0);
        /**
         * @type {UnityVector3}
         */
        this.scale = new UnityVector3(0,0,0);

        /**
         * @type {AvatarPunchEffect}
         */
        this.effectPunch = new AvatarPunchEffect();
        /**
         * @type {AvatarShakeEffect}
         */
        this.effectShake = new AvatarShakeEffect();
        this.jumpNum = 0;
        this.jumpPower = 1.0;

        //---vrm options
        this.isHandPose = 0;
        this.handpose = [];
        this.isBlendShape;
        this.blendshapes = {};
        this.equipType = 0;
        /**
         * @type {VVAvatarEquipSaveClass[]}
         */
        this.equipDestinations = [];
        /**
         * @type {AvatarGravityClass}
         */
        this.gravity = {};
        this.viewHandle = "";
        /**
         * @type {Array<AvatarIKMappingClass>}
         */
        this.handleList = [];

        this.animPlaying = 0;
        this.animSpeed = 0.0;
        this.animSeek = 0.0;
        this.animLoop = 0;

        this.renderTextureId = "";
        this.isEquip = 0;
        this.equippedRoleName = "";

        //---light options
        /**
         * @type {LightType}
         */
        this.lightType = 0;
        this.range;
        /**
         * @type {UnityColor}
         */
        this.color = new UnityColor(0,0,0,0);
        this.power = 0;
        this.spotAngle = 0;
        this.lightRenderMode = 0;
        this.shadowStrength = 0;

        //---camera options
        this.cameraPlaying = 0;
        this.clearFlag = 0;
        this.fov;
        this.depth;
        /**
         * @type {UnityRect}
         */
        this.viewport = new UnityRect(0,0,1,1);
        this.renderFlag = 0;
        this.renderTex = new UnityVector3(0,0,0);

        //---text options
        this.text = "";
        this.fontSize = 0;
        this.fontStyle = 0;
        this.textAlignment = 0;

        //---image options
        //---audio
        this.audioName = "";
        this.isSE = 0;
        this.isLoop = 0;
        this.isMute = 0;
        this.volume = 0.0;
        this.pitch = 0.0;
        this.seekTime = 0.0;

        //---effect
        this.effectGenre = "";
        this.isVRMCollider = 0;
        this.VRMColliderSize = 0.1;
        /**
         * @type {Array<String>}
         */
        this.VRMColliderTarget = [];

        //---system effect
        this.effectName = "";
        this.effectValues = [];

        //---stage
        this.stageType = 0;
        this.wavespeed = new UnityVector4(0,0,0,0);
        this.wavescale = 0;
        this.windDurationMin = 0.01;
        this.windDurationMax = 0.02;
        this.windPower = 0;
        this.windFrequency = 0.01;
        this.userStageMetallic = 0;
        this.userStageGlossiness = 0;
        this.userStageEmissionColor = new UnityColor(0,0,0,0);
        this.skyType = CameraClearFlags.SolidColor;
        this.skyColor = new UnityColor(0,0,255,1);
        this.skyShaderName = "";
        this.skyShaderFloat = [];
        this.skyShaderColor = [];
    }
}
export class AnimationTargetAudio {
    constructor() {
        this.animPlaying = 0;

        //---audio
        this.audioName = "";
        this.isSE = 0;
        this.isLoop = 0;
        this.isMute = 0;
        this.volume = 0.0;
        this.pitch = 0.0;
        this.seekTime = 0.0;
    }
}
export class AnimationAvatar {
    constructor(avatar) {
        this.roleName = "";
        this.roleTitle = "";
        this.avatarId = avatar.id;
        this.target = avatar;
    }
}
export class AnimationFrameActor {
    constructor(param) {
        this.targetId = param["targetId"] || "";
        this.targetRole = param["targetRole"] || "";
        this.targetType = param["targetType"] || AF_TARGETTYPE.Unknown;
        this.enabled = param["enabled"] || 1;
        this.bodyHeight = param["bodyHeight"] || [];
        this.bodyInfoList = param["bodyInfoList"] || [];
        this.blendShapeList = param["blendShapeList"] || [];
        this.frames = param["frames"] || [];
        this.frameIndexMarker = param["frameIndexMarker"] || 1;
    }
}
export class AvatarAttachedNativeAnimationFrame {
    constructor(params = null) {
        this.id = params["id"] || "";
        this.role = params["role"] || "";
        this.type = params["type"] || AF_TARGETTYPE.Unknown;
        this.frame = params["frame"] || null;
    }
}
export class ConfirmedNativeAnimationFrame {
    constructor() {
        this.frames = [];
    }
}

export class UnityVector3 {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor (x, y, z) {
        if (typeof(x) == "number") {
            this.x = x ? x : 0;
            this.y = y ? y : 0;
            this.z = z ? z : 0;
        }else{
            var vec = x;
            this.x = "x" in vec ? vec.x : 0;
            this.y = "y" in vec ? vec.y : 0;
            this.z = "z" in vec ? vec.z : 0;    
        }
    }
}
export class UnityVector4 {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} w
     */
    constructor (x, y, z, w) {
        if (typeof(x) == "number") {
            this.x = x ? x : 0;
            this.y = y ? y : 0;
            this.z = z ? z : 0;
            this.w = w ? w : 0;
        }else{
            var vec = x;
            this.x = "x" in vec ? vec.x : 0;
            this.y = "y" in vec ? vec.y : 0;
            this.z = "z" in vec ? vec.z : 0;
            this.w = "w" in vec ? vec.w : 0;
        }
    }
}
export class UnityColor {
    /**
     * 
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     * @param {Number} a 
     */
    constructor (r,g,b,a) {
        if (typeof(r) == "number") {
            this.r = r ? r : 0;
            this.g = g ? g : 0;
            this.b = b ? b : 0;
            this.a = a ? a : 0;
        }else{
            var col = r;
            this.r = ("r" in col) ? col.r : 0;
            this.g = ("g" in col) ? col.g : 0;
            this.b = ("b" in col) ? col.b : 0;
            this.a = ("a" in col) ? col.a : 0;
        }
        
    }
    toHexaColor() {
        return "#" + Math.ceil(255 * this.r).toString(16) + 
        Math.ceil(255 * this.g).toString(16) + 
        Math.ceil(255 * this.b).toString(16) + 
        Math.ceil(255 * this.a).toString(16);
    }
}
export class UnityRect {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} w 
     * @param {Number} h 
     */
    constructor (x, y, w, h) {
        if (typeof(x) == "number") {
            this.x = x ? x : 0;
            this.y = y ? y : 0;
            this.width = w ? w : 0;
            this.height = h ? h : 0;
        }else{
            var rect = x;
            this.x = "x" in rect ? rect.x : 0;
            this.y = "y" in rect ? rect.y : 0;
            this.width = "width" in rect ? rect.width : 0;
            this.height = "height" in rect ? rect.height : 0;
        }
    }

}
export class HTMLConnectByteData {
    constructor(){
         this.filename = "";
         this.data = [];
         this.length = 0;
    }
}
export class AvatarShakeEffect{
    constructor() {
        this.isEnable = false;
        this.translationType = AF_MOVETYPE.Translate;
        this.strength = 1.0;
        this.vibrato = 10;
        this.randomness = 90;
        this.fadeOut = false;
    }
    copyFrom(orig) {
        this.isEnable = orig.isEnable;
        this.translationType = orig.translationType;
        this.strength = orig.strength;
        this.vibrato = orig.vibrato;
        this.randomness = orig.randomness;
        this.fadeOut = orig.fadeOut;
    }
}
export class AvatarPunchEffect {
    constructor() {
        this.isEnable = false;
        this.translationType = AF_MOVETYPE.Translate;
        this.punch = new UnityVector3(0,0,0);
        this.vibrato = 10;
        this.elasiticity = 1.0;
    }
    copyFrom(orig) {
        this.isEnable = orig.isEnable;
        this.translationType = orig.translationType;
        this.vibrato = orig.vibrato;
        this.punch = orig.punch;
        this.elasiticity = orig.elasiticity;
    }
}
export class VRMGravityInfo {
    constructor() {
        this.id = 0;
        this.power = 0;
        this.dir = new UnityVector3(0, -1, 0);
        this.comment = "";
        this.rootBoneName = "";
    }
}
export class AvatarGravityClass {
    constructor() {
        /**
         * @type {Array<VRMGravityInfo>}
         */
        this.list = [];
    }
}
export class AvatarIKMappingClass {
    constructor() {
        /**
         * @type {IKBoneType}
         */
        this.parts = IKBoneType.IKParent;
        /**
         * @type {String}
         */
        this.name = "self";
    }
}
export class FingerPoseThumb {
    constructor() {
        this.spread = 0;
        this.roll = -0.266;
        this.stretched1 = 0.19;
        this.stretched2 = -0.03;
        this.stretched3 = 0.63;
        this.roll1 = 0;
        this.roll2 = 0.26;
        this.roll3 = 0.01;
    }
}
export class FingerPose {
    constructor () {
        this.spread = 0;
        this.roll = 0;
        this.stretched1 = 0.53;
        this.stretched2 = 0.76;
        this.stretched3 = 0.82;
    }
}
export class BvhNode {
    constructor() {
        /**
         * @type {Array<Number>}
         */
        this.offset = [];
        /**
         * @type {Array<String>}
         */
        this.channels = [];
        /**
         * @type {String}
         */
        this.joint = "";
        /**
         * @type {Boolean}
         */
        this.endsite = false;
        /**
         * @type {BvhNode}
         */
        this.child = {};
    }
}
export class BvhData {
    constructor() {
        /**
         * @type {Array<BvhNode>}
         */
        this.bones = [];
        /**
         * @type {Array<Array<Number>>}
         */
        this.motions = [];
    }
    getSpecifyBoneMotion(lineIndex, joint, channel) {
        var ret = null;
        var boneIndex = this.bones.findIndex(item => {
            if (item.joint.toLowerCase() == joint.toLowerCase()) return true;
            return false;
        });
        if (boneIndex > -1) {
            var chaIndex = this.bones[boneIndex].channels.findIndex(cha => {
                if (cha.toLowerCase() == channel.toLowerCase()) return true;
                return false;
            });
            if (chaIndex > -1) {
                var finalIndex = (boneIndex * this.bones[boneIndex].channels.length) + chaIndex;
                ret = this.motions[lineIndex][finalIndex];
            }
        }
        return ret;
    }
}