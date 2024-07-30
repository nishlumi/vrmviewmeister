import { AF_MOVETYPE, IKBoneType, UserAnimationEase, UserAnimationState } from "../../res/appconst.js";

export class appDataRibbon {
    constructor(t) {
        

        const langlist = [
            {label:"Japanese",value:"ja-JP"},
            {label:"English",value:"en-US"},
            {label:"Esperanto",value:"eo"}
        ];

        this.elements = {
            tab : {
                selectIndex : ("home"),
                oldselectIndex : "",
                style : {
                    height : "32px", //"36px",
                    width: "100%"
                },
                check_show : true,
                toggleIcon : "check_box",
            },
            tabpanel : {
                style : {
                    height : "128px",
                    display: "block",
                    //---closed panel style
                    position: "relative", //fixed
                    width : "100%",
                }
            },
            //---Home
            language_box : {
                options : langlist,
                selected : langlist[0]
            },
            vrar : {
                disable : {
                    vr : false,
                    ar : false
                }
            },
            //---Screen
            scr_size : {
                width : 0,
                height : 0,
            },
            capture : {
                isTransparent : false
            },
            lnk_download : {
                enabled : true,
                startEnable : false,
                stopEnable : true,
                href : "",
                state : false,
                obj : null,
                icon_mute : "volume_up",
            },
            optionArea : {
                rotate360 : false,
                rotateSpeed : 15,
                useAntialias : false,
                showIKMarker : true,
                ikmarkerSize : 0.1
            },
            //---Model
            basicshapes : [
                t("sphere"),t("capsule"),t("cylinder"),t("cube"),t("plane"),t("quad"),t("water surface")
            ],
            //---Animation
            frame : {
                play_normal : {
                    icon : "play_arrow"
                },
                fps : 60,
                baseDuration : 0.01,
                isloop : false,
                current : 1,
                max : 60,
                showdlg : false,
                showtarget : "",
                keylist : {
                    options : [
                        {id: AF_MOVETYPE.Translate, label: t('common') + "(" + t("key_only_pos") + ")"},
                        {id: AF_MOVETYPE.NormalTransform, label: t('common') + "(" + t("key_otherthan_pos") + ")"},
                        {id: AF_MOVETYPE.AllProperties, label: t("key_properties")}
                    ],
                    selection: [AF_MOVETYPE.Translate, AF_MOVETYPE.NormalTransform, AF_MOVETYPE.AllProperties],
                    duration : 0,
                    easing : {
                        options : [],
                        selected : UserAnimationEase.Unset
                    }
                },
                bonelist : {
                    options : [

                    ],
                    selection: [],
                    disable_bodyselect : true,
                }
            },
            //---System effect
            syseff : {
                splitter : 20,
                pagetab : 1,
                pagemax : 2,
                bloom : {
                    checked : false,
                    intensity : 0
                },
                chroma : {
                    checked : false,
                    intensity : 0
                },
                colorgrd : {
                    checked : false,
                    filter :"",
                    temperature : 0,
                    tint : 0
                },
                depthov : {
                    checked : false,
                    aperture : 5.6,
                    focallength : 50,
                    focusdistance : 10
                },
                grain : {
                    checked : false,
                    intensity : 1,
                    size : 1
                },
                vignette : {
                    checked : false,
                    intensity : 0,
                    smoothness : 0.2,
                    roundness : 1.0,
                    color : "#000",
                    center : {x: 0.5, y: 0.5}
                },
                moblur : {
                    checked : false,
                    shutterangle : 270,
                    samplecount : 10
                }
            },
            audio : {
                operatetype : "bgm",
                operatelist : [
                    { label : "BGM", value : "bgm" },
                    { label : "SE", value : "se" }
                ],
                bgm : {
                    selection : null,
                    list : [],
                    playflag : {label:t("animationflag_stop"), value:UserAnimationState.Stop},
                    playflag_options : [
                        {label:t("animationflag_play"), value:UserAnimationState.Play},
                        {label:t("animationflag_playing"), value:UserAnimationState.Playing},
                        {label:t("animationflag_pause"), value:UserAnimationState.Pause},
                        {label:t("animationflag_seek"), value:UserAnimationState.Seeking},
                        {label:t("animationflag_stop"), value:UserAnimationState.Stop},
                    ],
                    playbtn_state : "play_circle",
                    seek : 0,
                    maxLength : 1,
                    isloop : false,
                    vol : 100,
                    pitch : 100
                },
                se : {
                    selection : null,
                    list : [],
                    playflag : {label:t("animationflag_stop"), value:UserAnimationState.Stop},
                    playflag_options : [
                        {label:t("animationflag_play"), value:UserAnimationState.Play},
                        {label:t("animationflag_playing"), value:UserAnimationState.Playing},
                        {label:t("animationflag_pause"), value:UserAnimationState.Pause},
                        {label:t("animationflag_seek"), value:UserAnimationState.Seeking},
                        {label:t("animationflag_stop"), value:UserAnimationState.Stop},
                    ],
                    playbtn_state : "play_circle",
                    seek : 0,
                    maxLength : 0,
                    isloop : false,
                    vol : 100,
                    pitch : 100
                }
                
            }
        };
        this.states = {
            boneDisabled : false,
            boneForVRM : false,
        };
        this.data = {

        };
    }
}
export const defineAppRibbonData = () => {
    const { t } = VueI18n.useI18n({ useScope: 'global' });
    /**
     * @type {appDataRibbon}
     */
    const ribbonData = Vue.reactive(new appDataRibbon(t));

    for (var obj in UserAnimationEase) {
        ribbonData.elements.frame.keylist.easing.options.push({
            label : GetEnumName(UserAnimationEase, UserAnimationEase[obj]),
            value : UserAnimationEase[obj]
        });
    }
    ribbonData.elements.frame.keylist.easing.selected = ribbonData.elements.frame.keylist.easing.options[0];

    const lnk_recdownload = Vue.ref(null);
    const lnk_saveproject = Vue.ref(null);
    return {
        ribbonData,
        lnk_recdownload,lnk_saveproject
    }
}