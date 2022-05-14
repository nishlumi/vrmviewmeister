import { UserAnimationState } from "../../res/appconst.js";

export const defineAppRibbonData = () => {
    const { t } = VueI18n.useI18n({ useScope: 'global' });

    const langlist = [
        {label:"Japanese",value:"ja-JP"},
        {label:"English",value:"en-US"},
        {label:"Esperanto",value:"eo"}
    ];
    
    const ribbonData = Vue.ref({
        elements : {
            tab : {
                selectIndex : ("home"),
                style : {
                    height : "36px",
                }
            },
            tabpanel : {
                style : {
                    height : "128px"
                }
            },
            //---Home
            language_box : {
                options : langlist,
                selected : langlist[0]
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
                t("sphere"),t("capsule"),t("cylinder"),t("cube"),t("plane"),t("quad")
            ],
            //---Animation
            frame : {
                play_normal : {
                    icon : "play_arrow"
                },
                fps : 60,
                isloop : false,
                current : 1,
                max : 60
            },
            //---System effect
            syseff : {
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
                    focallength : 50
                },
                grain : {
                    checked : false,
                    intensity : 1,
                    size : 1
                },
                vignette : {
                    checked : false,
                    intensity : 0
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
        },
        states : {
            
        },
        data : {

        }
    });

    const lnk_recdownload = Vue.ref(null);
    const lnk_saveproject = Vue.ref(null);
    return {
        ribbonData,
        lnk_recdownload,lnk_saveproject
    }
}