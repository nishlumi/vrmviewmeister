import { AF_TARGETTYPE, AF_MOVETYPE, CNS_BODYBONES, UserAnimationState, StageType, IKBoneType } from "../../res/appconst.js";
import { AvatarPunchEffect, AvatarShakeEffect, FingerPose, FingerPoseThumb, UnityVector4 } from "./cls_unityrel.js";
import { VVAvatar, VVProp, VVBlendShape, VVAvatarEquipSaveClass } from "./cls_vvavatar.js";


export class appDataObjectProp {
    /**
     * 
     * @param {*} t translation array
     * @param {*} template list items of template
     */
    constructor(t,template) {
        this.elements = {
            drawer : {
                show : true,
                miniState : false,
                side : "right",
                width : 350,
                miniwidth : 60,
                breakpoint : 500,
                behavior : "normal",
            },
            contextmenu : {
                show :false,
                target : "",
            },
            common : {
                position3d : {x : 0,y : 0,z : 0},
                position2d : {x : 0,y : 0,z : 0},
                rotation3d : {x : 0,y : 0,z : 0},
                rotation2d : {x : 0,y : 0,z : 0},
                scale3d    : {x : 0,y : 0,z : 0},
                scale2d    : {x : 0,y : 0,z : 0},
                size2d     : {x : 0,y : 0,z : 0},
                scale : {
                    min : 1,
                    max : 5000,
                },
                drag : 10,
                angularDrag : 10,
                useCollision : false,
                useGravity : false,
                fastRotate360 : false,
                scaleIsOnlyX : false,
                jumpNum : 0,
                jumpPower : 1,
                effectTabSelected : "punch",
                punch : new AvatarPunchEffect(),
                punchTypeOptions : template.tmppunchshakeoptions,
                shake : new AvatarShakeEffect(),
                shakeTypeOptions : template.tmppunchshakeoptions,
            },
            //---VRM
            vrmui : {
                movemode : false,
                ikhandles : {
                    partSelected : template.tmpIKBoneType[0],
                    partOptions : template.tmpIKBoneType,
                    assignSelected : null
                },
                lefthand : {
                    poseOptions : template.templete_handpose,
                    poseSelected : template.templete_handpose[1],
                    poseValue : 0,
                    finger : {
                        thumbs : new FingerPoseThumb(),
                        index : new FingerPose(),
                        middle : new FingerPose(),
                        ring : new FingerPose(),
                        little : new FingerPose()
                    }
                },
                righthand : {
                    poseOptions : template.templete_handpose,
                    poseSelected : template.templete_handpose[1],
                    poseValue : 0,
                    finger : {
                        thumbs : new FingerPoseThumb(),
                        index : new FingerPose(),
                        middle : new FingerPose(),
                        ring : new FingerPose(),
                        little : new FingerPose()
                    }
                },
                /**
                 * @type {Array<VVBlendShape>}
                 */
                blendshapes : [],
                proxyBlendshapes : [],
                blendshapeTab : "proxy",
                blendShape_searchstr : "",
                expression_searchstr : "",
                blink : {
                    enable : false,
                    interval : 5,
                    opening : 0.03,
                    closing : 0.1,
                    closeTime : 0.06,
                },
                headLock : 1,
                equip : {
                    targetPartsBox : null,
                    targetPartsBoxOptions : template.arr_equiptargetbody,
                    selected : {},
                    /**
                     * @type {Array<VVAvatarEquipSaveClass>}
                     */
                    equipments : [],
                    //--equip item selection dialog---
                    showDialog : false,
                    dialogOptions : [],
                    dialogColumns : [
                        {name:"id", label:"ID", field:"id", align:"left"},
                        {name:"title", label:"Name", field:"title", align:"left", sortable:true},
                        {name:"type", label:"Type", field:"type", align:"left", sortable:true},
                    ],
                    dialogSelected : null
                },
                matopt : {
                    colorselected: "#FFFFFFFF",
                    cullmodeselected : null,
                    blendmodeselected : null,
                    srcblend : 1,
                    dstblend : 0,
                    emissioncolor : "#FFFFFFFF",
                    shadetexcolor : "#FFFFFFFF",
                    shadingtoony : 0,
                    rimcolor : "#FFFFFFFF",
                    rimfresnel : 1,
                },
                vrmanim : {
                    file : null,
                    isenable : false,
                }
            },
            objectui : {
                /**
                 * Array of userSharedMaterial
                 * @type {Object}
                 */
                materials : [],
                materialSelected : null,
                /**
                 * Array of SkinnedMeshRenderer GameObject name
                 * @type {Object}
                 */
                materialnames : [],
                materialnameSelected : null,
                old_materialnameSelected : null,
                /**
                 * @type {Boolean[]}
                 */
                materialIsChanges : [],
                is_apply_allparts : false,
                matopt : {
                    matname : "",
                    isChanged : false,
                    shader : [
                        {label : "Standard", value:"Standard"},
                        {label : "VRM/MToon", value:"VRM/MToon"},
                        {label : "VRM10/MToon10", value:"VRM10/MToon10"},
                        {label : "Water", value:"FX/SimpleWater4"},
                        {label : "Sketch", value:"PencilShader/SketchShader"},
                        {label : "PostSketch", value:"PencilShader/PostSketchShader"},
                        //{label : "RealToon", value: "RealToon/Version 5/Lite/Default"},
                        {label : "Comic", value : "Custom/ComicShader"},
                        {label : "Ice", value : "Custom/IceShader"},
                        {label : "Pixelize", value : "Custom/PixelizeTexture"},
                        {label : "Cutout", value : "Unlit/CustomCutout"}
                    ],
                    shaderselected : null,
                    colorselected: "#FFFFFFFF",
                    cullmode : [
                        {label : "Off", value: 0},
                        {label : "Front", value: 1},
                        {label : "Back", value: 2},
                    ],
                    cutoff : 0.5,
                    cullmodeselected : 0,
                    blendmode : [
                        {label : "Opaque", value: 0},
                        {label : "Cutout", value: 1},
                        {label : "Fade", value: 2},
                        //{label : "Transparent", value: 3}, disable for VRM1.x
                    ],
                    blendmodeselected : 0,
                    metallic : 0,
                    glossiness : 0,
                    emissioncolor : "#FFFFFFFF",
                    shadetexcolor : "#FFFFFFFF",
                    shadingtoony : 0,
                    shadingshift : 0,
                    receiveshadow : 1,
                    shadinggrade : 1,
                    lightcolorattenuation : 0,
                    rimcolor : "#FFFFFFFF",
                    rimfresnel : 1,
                    textureSeltype : template.tmptextureseltype,
                    textureSeltypeselected : template.tmptextureseltype[0],
                    texturefile : null,
                    textureCameraRender : null,
                    //textureCameraRenderOptions : []
                    srcblend : 1,
                    dstblend : 0,

                    //---water4
                    fresnelScale : 0.75,
                    reflectionColor : "#FFFFFFFF",
                    specularColor : "#FFFFFFFF",
                    waveAmplitude : new UnityVector4(0.3 ,0.35, 0.25, 0.25),
                    waveFrequency : new UnityVector4(1.3, 1.35, 1.25, 1.25),
                    waveSteepness : new UnityVector4(1.0, 1.0, 1.0, 1.0),
                    waveSpeed : new UnityVector4(1.2, 1.375, 1.1, 1.5),
                    waveDirectionAB : new UnityVector4(0.3 ,0.85, 0.85, 0.25),
                    waveDirectionCD : new UnityVector4(0.1 ,0.9, 0.5, 0.5),

                    //---SketchShader
                    outlineWidth : 0.1,
                    strokeDensity : 5,
                    addBrightness : 1,
                    multBrightness : 1,
                    shadowBrightness : 1,

                    //---RealToon
                    enableTexTransparent : 0,
                    mainColorInAmbientLightOnly : false,
                    doubleSided: false,
                    outlineZPosCam : 0,
                    thresHold : 0.85,
                    shadowHardness : 1,

                    //ComicShader
                    lineWidth : 0.01,
                    lineColor : "#101010FF",
                    tone1Threshold : 0.1,

                    //IceShader
                    iceColor : "#FFFFFFFF",
                    transparency : 1.5,
                    baseTransparency : 0.5,
                    iceRoughness : 0.005,
                    distortion : 1,

                    pixelSize : 0.01,
                },
                animation : {
                    isenable : false,
                    cliplist : [],
                    clipselected : "",
                    seek : 0,
                    speed : 1,
                    maxPosition : 0,
                    wrapmodeOptions : template.tmpanimationwrapmode,
                    wrapmodeSelected : template.tmpanimationwrapmode[0],
                    play_icon : "play_circle",
                    flagSelected : template.tmpanimationflag[0],
                    flagOptions : [
                        {label:t("animationflag_play"), value:UserAnimationState.Play},
                        {label:t("animationflag_playing"), value:UserAnimationState.Playing},
                        {label:t("animationflag_pause"), value:UserAnimationState.Pause},
                        {label:t("animationflag_seek"), value:UserAnimationState.Seeking},
                        {label:t("animationflag_stop"), value:UserAnimationState.Stop},
                    ]
                },
                
            },
            lightui : {
                rendermodeselected : {label: t("Auto"), value:0},
                rendermodeOptions : [
                    {label: t("Auto"), value:0},
                    {label: t("Important"), value:1},
                    {label: t("No important"), value:2}
                ],
                power : 1,
                range : 1,
                colorselected : "#FFFFFF",
                spotangle : 50,
                flare_type : {
                    selected : template.tmplightflaretype[1],
                    options : template.tmplightflaretype
                },
                flare_color : "#FFFFFFFF",
                flare_brightness : 0.1,
                flare_fade : 3,
            },
            cameraui : {
                animation : {
                    flagSelected : template.tmpanimationflag[0],
                    flagOptions : [template.tmpanimationflag[0],template.tmpanimationflag[1],template.tmpanimationflag[3]]
                },
                previewBtnIcon : "play_circle",
                previewBtnEnabled : false,
                fov : 0.25,
                depth : 11,
                vp : {
                    position : {x: 0, y:0},
                    size     : {x: 1, y:1}
                },
                renderTexture : {
                    isOn : false,
                    x : 200,
                    y : 200
                }
            },
            imageui : {
                colorselected : "#FFF",
            },
            effectui : {
                genre : "",
                genreoptions : [
                    //"Explosion","Smoke","Water","Action"
                ],
                effect : "",
                effectoptions : [],
                previewBtnIcon : "play_circle",
                loop : false,
                animation : {
                    flagSelected : template.tmpanimationflag[0],
                    flagOptions : template.tmpanimationflag,
                },
                colliderOn : false,
                colliderSize : 0.1,
                colliderTargetSelected : null,
                //colliderTargetOptions : [],
                /**
                 * @type {Array<VVCast>}
                 */
                colliderReigsters : [],
            },
            stageui : {
                /**
                 * @type {StageType}
                 */
                typeselected : template.tmpstageoptions[0], //{label:"DefaultStage", value:StageType.Default}
                typeoptions : template.tmpstageoptions,
                ustg_color : "#FFFFFFFF",
                ustg_blendmode : 0,
                ustg_maintex : null,
                ustg_bumpmap : null,
                ustg_metallic : 0,
                ustg_glossiness : 0,
                ustg_emissioncolor : "#FFFFFFFF",
                stage_sea : {
                    //---waterbasic
                    waveScale : 0.07,
                    //---simplewater
                    fresnelScale : 0.65714,
                    basecolor : "#EAEAEA",
                    reflectionColor : "#27444C",
                    specularColor : "#EAEAEA",
                    waveAmplitude : new UnityVector4(0.36 ,-0.05, 0, 0),
                    waveFrequency : new UnityVector4(0.5, 0.38, 0.59, 0.6),
                    waveSteepness : new UnityVector4(-12.8, 2, -1.62, -3.81),
                    waveSpeed : new UnityVector4(-4.84, -3.73, -6.92, -6.08),
                    waveDirectionAB : new UnityVector4(0.469 ,0.354, -0.2, 0.1),
                    waveDirectionCD : new UnityVector4(0.7033 ,-0.679, 0.7175, -0.2),
                },
                skymodeoptions : template.tmpskymodeoptions,
                skymodeselected :  template.tmpskymodeoptions[1],
                skyshaderoptions : template.tmpskyshaderoptions,
                skyshaderselected : template.tmpskyshaderoptions[0],
                skycolorselected : "#314D79",
                skyparam : {
                    sunsize : 0.04,
                    sunsize_convergence : 5,
                    atmosphere_thickness : 1,
                    exposure : 1.3,
                    rotation : 0,
                    tint : "#FFFFFFFF",
                    ground_color : "#FFFFFFFF",
                },
                dlight_rotation : {x:0, y:0, z:0},
                dlight_power : 1,
                dlight_strength : 0.27,
                dlight_color : "#808080FF",
                dlight_halo : 0.0,
                dlight_flare_type : {
                    selected : template.tmplightflaretype[1],
                    options : template.tmplightflaretype
                },
                dlight_flare_color : "#FFFFFFFF",
                dlight_flare_brightness : 0,
                dlight_flare_fade : 3,
                winddirection : {
                    xz : 0,
                    y : 0,
                },
                windpower : 0,
                windfrequency : 0.01,
                windduration : {min:0.01, max:0.03}
            },
            textui : {
                text : "",
                anchor_position : "",
                anchor_positionOptions : [
                    {label : t("TopLeft"), value:"tl"},{label : t("MiddleLeft"), value:"ml"},{label : t("BottomLeft"), value:"bl"},
                    {label : t("TopCenter"), value:"tm"},{label : t("MiddleCenter"), value:"mm"},{label : t("BottomCenter"), value:"bm"},
                    {label : t("TopRight"), value:"tr"},{label : t("MiddleRight"), value:"mr"},{label : t("BottomRight"), value:"br"}
                ],
                size : 12,
                colorselected : "#000",
                fontstyleselected : "",
                fontstyleOptions : [
                    {label: t("normal"), value:0},
                    {label: t("bold"), value:1},
                    {label: t("italic"), value:2},
                    {label: t("boldanditalic"), value:3},
                ],
                //---new fonstyles
                fontstylesRich : {
                    b : false, i : false, u : false, s : false,
                    UL : "",
                },
                area_size : {x: 20, y: 3},
                text_alignment : {},
                text_overflow_options : [
                    {label: t("to_overflow"), value:0},
                    {label: t("to_ellipsis"), value:1},
                    {label: t("to_masking"), value:2},
                    {label: t("to_truncate"), value:3},
                    {label: t("to_scrollrect"), value:4},
                    {label: t("to_page"), value:5},
                    {label: t("to_linked"), value:6},
                ],
                text_overflow : {label: t("to_overflow"), value:0},
                dimension : "2d",
                colorGradient : {
                    tl : "#000",tr : "#000",
                    bl : "#000",br : "#000",
                },
                colortype : "s", //s - simple, g - gradient
                outlineWidth : 0,
                outlineColor : "#000",
            },
            uimageui : {
                colorselected : "#FFF",
            },
        };
        this.states = {
            dimension : "3d",
            isEditingFromUI : false,
        };
        this.data = {
            clipboard : {}
        };
    }
}
export const defineAppObjlistProp = () => {
    const { t } = VueI18n.useI18n({ useScope: 'global' });

    var tmpIKBoneType = [{label:"---",value:IKBoneType.Unknown}];
    for (var obj in IKBoneType) {
        if ((IKBoneType[obj] != IKBoneType.IKParent) && (IKBoneType[obj] != IKBoneType.Head) && 
            (IKBoneType[obj] != IKBoneType.Unknown) && 
            (IKBoneType[obj] != IKBoneType.LeftShoulder) && (IKBoneType[obj] != IKBoneType.RightShoulder)
        ) {
            tmpIKBoneType.push({
                label : obj,
                value : IKBoneType[obj]
            });
        }
    }
    const templete_handpose = [
        {label:t("handManually"), value:-1},
        //{label:t("handNormal"), value:0},
        {label:t("handPose1"), value:0},{label:t("handPose2"), value:1},
        {label:t("handPose3"), value:2},{label:t("handPose4"), value:3},
        {label:t("handPose5"), value:4},{label:t("handPose6"), value:5},
    ];
    const tmpskymodeoptions = [
        {label : t("Sky box"), value:1},
        {label : t("Solid color"), value:2},
    ];
    const tmpskyshaderoptions = [
        {label : _T("sky daytime"), value:"procedural"},
        {label : _T("sky night blue"), value:"bluesky"},
        {label : _T("sky night purple"), value:"purplesky"},
    ];
    const tmpanimationflag = [
        {label:t("animationflag_play"), value:UserAnimationState.Play},
        {label:t("animationflag_playing"), value:UserAnimationState.Playing},
        {label:t("animationflag_pause"), value:UserAnimationState.Pause},
        {label:t("animationflag_stop"), value:UserAnimationState.Stop},
    ];
    const tmpstageoptions = [
        {label : ("Default"), value:StageType.Default},
        {label : ("SeaDaytime"), value:StageType.SeaDaytime},
        {label : ("SeaNight"), value:StageType.SeaNight},
        {label : ("DryGround"), value:StageType.DryGround},
        {label : ("Desert"), value:StageType.Desert},
        {label : ("Field1"), value:StageType.Field1},
        {label : ("Field2"), value:StageType.Field2},
        {label : ("Field3"), value:StageType.Field3},
        {label : ("Field4"), value:StageType.Field4},
        {label : ("User"), value:StageType.User}
    ];
    var arr_equiptargetbody = [];
    for (var obj in CNS_BODYBONES) {
        var name = t(obj);
        arr_equiptargetbody.push({
            label : name,
            value : CNS_BODYBONES[obj]
        })
    }
    const tmppunchshakeoptions = [
        {label : "Position", value:3},
        {label : "Rotation", value:4},
        {label : "Scale", value:5}
    ];
    const tmpanimationwrapmode = [
        {label : "Default", value:0},
        {label : "Loop", value:2},
        {label : "PingPong", value:4}
    ];
    const tmptextureseltype = [
        {label : t("from file"), value: 0},
        {label : t("from camera role"), value: 1},
    ];

    const tmplightflaretype = [
        {label : t("cons_none"), value: -1},
        {label : "50mmZoom", value: 0},
        {label : "FlareSmall", value: 1},
        {label : "Sun", value: 2},
    ]

    /**
     * @type {appDataObjectProp}
     */
    const objpropData = Vue.reactive(new appDataObjectProp(t,{
        tmpIKBoneType,templete_handpose,tmpskymodeoptions,
        tmpskyshaderoptions,tmpanimationflag,tmpstageoptions,
        arr_equiptargetbody,
        tmppunchshakeoptions,tmpanimationwrapmode,tmptextureseltype,
        tmplightflaretype
    }));
    return {
        objpropData
    }
}