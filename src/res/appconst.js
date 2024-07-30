
export const CNSOPTION_NAME = {
    FIRSTLOGIN_ONLY : "isfinishfirst",  //value: 1, 0
    RELOAD_TIMING : "reload_timing",    //value: Number
    LASTCHECK_MASTER : "master_lastchecked", //value: Date
    LASTCHECK_DATE : "lastchecked"      //value: Date
};
export const DEFAULTMEM = 268435456;

export const LimitOfCallbackObjectProperty = 10;

export const FILEEXTENSION_VRM = ".vrm";
export const FILEEXTENSION_VRMA = ".vrma";
export const FILEEXTENSION_POSE = ".vvmpose";
export const FILEEXTENSION_MOTION = ".vvmmot";
export const FILEEXTENSION_MOTION_GENERAL = [".bvh",".anim"];
export const FILEEXTENSION_ANIMATION = ".vvmproj";
export const FILEEXTENSION_DEFAULT = ".json";
export const FILEEXTENSION_OTHEROBJECT = [".obj",".fbx",".zip",".gltf",".glb",".ply",".stl",".3mf"];
export const FILEEXTENSION_IMAGE = [".jpg",".png",".gif"];
export const FILEEXTENSION_AUDIO = [".wav",".mp3"];
export const FILEOPTION = {
    VRM : {
        types: [
            {
                description : "VRM file",
                accept : {"application/x-VRMl": [".vrm"]}
            }
        ],
        encoding : "binary"
    },
    POSE : {
        types: [
            {
                description : "VVM pose file",
                accept : {"application/json": [".vvmpose",".json"]}
            }
        ],
        encoding : "utf8"
    },
    MOTION : {
        types: [
            {
                description : "VVM motion file",
                accept : {"application/json": [".vvmmot",".json",".bvh",".anim"]}
            },
            /*{
                description : "VRM Animation file",
                accept : {"application/octet-stream": [".vrma"]}
            }*/
        ],
        encoding : "utf8"
    },
    VRMA : {
        types: [
            {
                description : "VRM Animation file",
                accept : {"application/octet-stream": [".vrma"]}
            }
        ],
        encoding : "binary"
    },
    PROJECT : {
        types: [
            {
                description : "VVM project file",
                accept : {"application/json": [".vvmproj",".json"]}
            }
        ],
        encoding : "utf8"
    },
    OBJECTS : {
        types : [
            {
                description : "3D object file",
                accept : {"application/octet-stream": [".obj",".fbx",".zip",".gltf",".glb",".ply",".stl",".3mf"]}
            }
        ],
        encoding : "binary"
    },
    IMAGES : {
        types : [
            {
                description : "Image file",
                accept : {"image/*" : [".jpg",".png",".gif"]}
            }
        ],
        encoding : "binary"
    },
    AUDIOS : {
        types : [
            {
                description : "Audio file",
                accept : {"audio/*" : [".wav",".mp3"]}
            }
        ],
        encoding : "binary"
    }
}
/**
 * Storage type
 */
export const STORAGE_TYPE = {
    HISTORY: "hist",
    INTERNAL : "int",
    LOCAL : "loc",
    GOOGLEDRIVE : "ggd",
    APPLICATION : "appggd",
    VROIDHUB: "vhub",
    WEB: "web",
}
/**
 * DB name of AppDB
 */
export const INTERNAL_FILE = {
    AMETA : "avatar_meta",
    SMETA : "scene_meta",
    VRM : "vrm",
    OBJECTS : "obj",
    IMAGES : "image",
    PROJECT : "scene",
    MOTION : "motion",
    POSE : "pose",
    VRMA : "vrma",
}

export const CNS_BODYBONES = {
    Hips : 0,
    LeftUpperLeg : 1,
    RightUpperLeg : 2,
    LeftLowerLeg : 3,
    RightLowerLeg : 4,
    LeftFoot : 5,
    RightFoot : 6,
    Spine : 7,
    Chest : 8,
    Neck : 9,
    Head : 10,
    LeftShoulder : 11,
    RightShoulder : 12,
    LeftUpperArm : 13,
    RightUpperArm : 14,
    LeftLowerArm : 15,
    RightLowerArm : 16,
    LeftHand : 17,
    RightHand : 18,
    UpperChest : 54,
};

export const AF_TARGETTYPE =
{
    VRM : 0,
    OtherObject : 1,
    Light : 2,
    Camera : 3,
    Text : 4,
    Image : 5,
    UImage : 6,
    Audio : 7,
    Effect : 8,
    SystemEffect : 9,
    Stage : 10,
    Text3D : 11,

    Unknown : 99
}
export const AF_MOVETYPE = {
    Rest : 0,
    Start : 1,
    NormalTransform : 2,
    Translate : 3,
    Rotate : 4,
    Scale : 5,
    BlendShape : 6,

    LookAt : 7,

    AnimStart : 8,
    AnimStop : 9,
    AnimSeek : 10,
    AnimProperty : 11,

    OtherObjectTexture : 12,

    Light : 20,
    LightProperty : 21,
    Camera : 22,
    CameraProperty : 23,
    CameraOn : 24,
    CameraOff : 25,
    Text : 26,
    TextProperty : 27,
    Image : 28,
    ImageProperty : 29,
    Audio : 30,
    AudioProperty : 31,

    SystemEffect : 32,
    SystemEffectOff : 33,

    Stage : 34,
    StageProperty : 35,

    Equipment : 36,

    AnimPause : 37,

    //---effect
    Punch : 40,
    Shake : 41,
    Jump : 42,
    Coloring : 43,
    Collider : 44,
    Rigid : 45,

    GravityProperty : 50,
    VRMIKProperty : 51,
    VRMBlink : 52,
    VRMAutoBlendShape : 53,

    //---reserved
    AppCommand : 60,
    Action : 61,

    AllProperties : 88,
    Stop : 99
};
export const  IKBoneType = 
{
    None : -1,
    IKParent : 0,
    EyeViewHandle : 1,
    Head : 2,
    LookAt : 3,
    Aim : 4,
    Chest : 5,
    Pelvis : 6,
    LeftShoulder : 7,
    LeftLowerArm : 8,
    LeftHand : 9,
    RightShoulder : 10,
    RightLowerArm : 11,
    RightHand : 12,
    LeftLowerLeg : 13,
    LeftLeg : 14,
    RightLowerLeg : 15,
    RightLeg : 16,
    //LeftHandPose : 17,
    //RightHandPose : 18,
    //BlendShape : 19,
    Unknown : 25
};
export const CameraClearFlags = {
    Skybox : 1,
    SolidColor : 2,
    Depth : 3,
    Nothing : 4
};
export const StageType = {
    Default : 0,
    BasicSeaLevel : 1,
    SeaDaytime : 2,
    SeaNight : 3,
    DryGround : 4,
    Desert : 5,
    Field1 : 6,
    Field2 : 7,
    Field3 : 8,
    Field4 : 9,
    User : 10
};
/*var  EffectDirectory = {
    "Explosion" : {

    },
    "Smoke" : {

    },
    "Water" : {

    },
    "Action" : {

    }
};*/
export const UserAnimationState =
{
    Stop : 0,
    Play : 1,
    PlayWithLoop : 2,
    Playing : 3,
    Seeking : 4,
    Pause : 5
};
export const  UserAnimationEase = 
{
    Unset : 0,
    Linear : 1,
    InSine : 2,
    OutSine : 3,
    InOutSine : 4,
    InQuad : 5,
    OutQuad : 6,
    InOutQuad : 7,
    InCubic : 8,
    OutCubic : 9,
    InOutCubic : 10,
    InQuart : 11,
    OutQuart : 12,
    InOutQuart : 13,
    InQuint : 14,
    OutQuint : 15,
    InOutQuint : 16,
    InExpo : 17,
    OutExpo : 18,
    InOutExpo : 19,
    InCirc : 20,
    OutCirc : 21,
    InOutCirc : 22,
    InElastic : 23,
    OutElastic : 24,
    InOutElastic : 25,
    InBack : 26,
    OutBack : 27,
    InOutBack : 28,
    InBounce : 29,
    OutBounce : 30,
    InOutBounce : 31,
    //---error occurs by 100%, do not use!
    //Flash : 32,
    //InFlash : 33,
    //OutFlash : 34,
    //InOutFlash : 35,
    //
    // 概要:
    //     Don't assign this! It's assigned automatically when creating 0 duration tweens
    //INTERNAL_Zero : 36,
    //
    // 概要:
    //     Don't assign this! It's assigned automatically when setting the ease to an AnimationCurve
    //     or to a custom ease function
    //INTERNAL_Custom : 37
};
export const EFFECTLIST = {
    "Action" : [
        "BubbleMissile",
        "BulletDirt",
        "BulletMetal",
        "MagicAuraBlue",
        "MagicAuraYellow",
        "MagicChargeYellow",
        "MagicCircleYellow",
        "MagicEnchantGreen",
        "MagicFieldBlue",
        "MuzzleFlash01",
        "RoundHit",
        "ShieldSoftBlue",
        "ShieldSoftPurple",
        "ShieldSoftYellow",
        "SwordHit",
        "SwordHitCritical",
        "SwordSlashMini",
        "SwordSlashThick",
        "SwordWaveYellow"
    ],
    "Explosion" : [
        "DustExplosion",
        "EnergyExplosionPink",
        "ExplosionFireballSoftFire",
        "FlashExplosionGreen",
        "FrostExplosion",
        "LightningExplosionYellow",
        "MagicSoftExplosionFire",
        "SmallExplosion",
        "StarExplosionOrange",
        "TinyExplosion",
        "TinyFlames"
    ],
    "Smoke" : [
        "DustMotesEffect",
        "DustStorm",
        "GroundFog",
        "Heat Distortion",
        "PressurisedSteam",
        "RisingSteam",
        "SandSwirlsEffect",
        "SmokeEffect",
        "SparksEffect",
        "Steam"
    ],
    "Water" : [
        "BigSplash",
        "RainEffect1",
        "Shower",
        "WaterLeak",
        "WaterWake"
    ]
};

export const SAMPLEKEY = "fFk3r430awp";
export const SAMPLEURL = "https://script.google.com/macros/s/AKfycbzin8LMURln98AG3ikAi33SS6F0vHyk1Gh7rGVfP00VKPqi_Z6d45_EB3TwIM_usdN5Hw/exec";