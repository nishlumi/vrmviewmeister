import { AF_TARGETTYPE, AF_MOVETYPE, CNS_BODYBONES, UserAnimationState, StageType, IKBoneType } from "../../res/appconst.js";
import { AvatarPunchEffect, AvatarShakeEffect, UnityVector4 } from "./cls_unityrel.js";
import { VVAvatar, VVProp, VVBlendShape, VVAvatarEquipSaveClass } from "./cls_vvavatar.js";



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
        {label:t("handNormal"), value:0},
        {label:t("handPose1"), value:1},{label:t("handPose2"), value:2},
        {label:t("handPose3"), value:3},{label:t("handPose4"), value:4},
        {label:t("handPose5"), value:5},{label:t("handPose6"), value:6},
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

    const objpropData = Vue.ref({
        elements : {
            drawer : {
                show : true,
                miniState : false,
                side : "right",
                width : 330,
                miniwidth : 60,
                breakpoint : 500
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
                jumpNum : 0,
                jumpPower : 1,
                effectTabSelected : "punch",
                punch : new AvatarPunchEffect(),
                punchTypeOptions : tmppunchshakeoptions,
                shake : new AvatarShakeEffect(),
                shakeTypeOptions : tmppunchshakeoptions,
            },
            //---VRM
            vrmui : {
                movemode : false,
                ikhandles : {
                    partSelected : tmpIKBoneType[0],
                    partOptions : tmpIKBoneType,
                    assignSelected : null
                },
                lefthand : {
                    poseOptions : templete_handpose,
                    poseSelected : null,
                    poseValue : 0
                },
                righthand : {
                    poseOptions : templete_handpose,
                    poseSelected : null,
                    poseValue : 0
                },
                /**
                 * @type {Array<VVBlendShape>}
                 */
                blendshapes : [],
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
                    targetPartsBoxOptions : arr_equiptargetbody,
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
                    shaingtoony : 0,
                    rimcolor : "#FFFFFFFF",
                    rimfresnel : 1,
                }
            },
            objectui : {
                materials : [],
                materialSelected : null,
                materialnames : [],
                materialnameSelected : null,
                matopt : {
                    shader : [
                        {label : "Standard", value:"Standard"},
                        {label : "VRM/MToon", value:"VRM/MToon"},
                        {label : "Water", value:"FX/Water4"},
                        {label : "Water2", value:"FX/Water (Basic)"}
                    ],
                    shaderselected : null,
                    colorselected: "#FFFFFFFF",
                    cullmode : [
                        {label : "Off", value: 0},
                        {label : "Front", value: 1},
                        {label : "Back", value: 2},
                    ],
                    cullmodeselected : 0,
                    blendmode : [
                        {label : "Opaque", value: 0},
                        {label : "Cutout", value: 1},
                        {label : "Fade", value: 2},
                        {label : "Transparent", value: 3},
                    ],
                    blendmodeselected : 0,
                    metallic : 0,
                    glossiness : 0,
                    emissioncolor : "#FFFFFFFF",
                    shadetexcolor : "#FFFFFFFF",
                    shaingtoony : 0,
                    rimcolor : "#FFFFFFFF",
                    rimfresnel : 1,
                    textureSeltype : tmptextureseltype,
                    textureSeltypeselected : tmptextureseltype[0],
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
                },
                animation : {
                    cliplist : [],
                    clipselected : "",
                    seek : 0,
                    speed : 1,
                    maxPosition : 0,
                    wrapmodeOptions : tmpanimationwrapmode,
                    wrapmodeSelected : tmpanimationwrapmode[0],
                    play_icon : "play_circle",
                    flagSelected : tmpanimationflag[0],
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
            },
            cameraui : {
                animation : {
                    flagSelected : tmpanimationflag[0],
                    flagOptions : [tmpanimationflag[0],tmpanimationflag[1],tmpanimationflag[3]]
                },
                previewBtnIcon : "play_circle",
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
                    flagSelected : tmpanimationflag[0],
                    flagOptions : tmpanimationflag,
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
                typeselected : tmpstageoptions[0], //{label:"DefaultStage", value:StageType.Default}
                typeoptions : tmpstageoptions,
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
                skymodeoptions : tmpskymodeoptions,
                skymodeselected :  tmpskymodeoptions[1],
                skyshaderoptions : tmpskyshaderoptions,
                skyshaderselected : tmpskyshaderoptions[0],
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
                dlight_color : "#FFFFFFFF",
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
                    {label : _T("TopLeft"), value:"tl"},{label : _T("MiddleLeft"), value:"ml"},{label : _T("BottomLeft"), value:"bl"},
                    {label : _T("TopCenter"), value:"tm"},{label : _T("MiddleCenter"), value:"mm"},{label : _T("BottomCenter"), value:"bm"},
                    {label : _T("TopRight"), value:"tr"},{label : _T("MiddleRight"), value:"mr"},{label : _T("BottomRight"), value:"br"}
                ],
                size : 12,
                colorselected : "#000",
                fontstyleselected : "",
                fontstyleOptions : [
                    {label: _T("normal"), value:0},
                    {label: _T("bold"), value:1},
                    {label: _T("italic"), value:2},
                    {label: _T("boldanditalic"), value:3},
                ]
            },
            uimageui : {
                colorselected : "#FFF",
            },
        },
        states : {
            dimension : "3d",
            isEditingFromUI : false,
        },
        data : {
            clipboard : {}
        }
    });
    return {
        objpropData
    }
}