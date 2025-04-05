import { VVAvatar, VVCast,VVAnimationProject, VVTimelineTarget, VVProp, VVTimelineFrameData } from "./cls_vvavatar.js"
import { AppDBMeta, VVAppConfig } from "../appconf.js";
import { AF_TARGETTYPE, EFFECTLIST, FILEOPTION, INTERNAL_FILE, STORAGE_TYPE, UserAnimationEase } from "../../res/appconst.js";
import { VOSFile } from "../../../public/static/js/filehelper.js";
import { VRoidHubConnector } from "../model/vroidhub.js";
import { UnityVector3 } from "./cls_unityrel.js";
import { InputManageCallback, InputManager } from "../model/gamepadctrl.js";

export class appMainData {
    constructor(appName, appDesc) {
        const { t } = VueI18n.useI18n({ useScope: 'global' });

        
        this.appinfo = {
            name : appName,
            description : appDesc,
            version : "2.16.2",
            revision : "20250405-01",
            platform : `${Quasar.Platform.is.platform}(${Quasar.Platform.is.name})`
        };
        this.appconf = new VVAppConfig();
        this.vroidhubapi = new VRoidHubConnector();
        this.vroidhubdata = {};
        this.elements = {
            header : true,
            appinfodlg : false,
            loading : false,
            loadmsg : "",
            loadingTypePercent : false,
            percentLoad : {
                percent : 0,
                current : 0,                
            },
            landvpad : {
                showLeft : false,
                showRight: false
            },
            initialOrientation : "landscape", //portrait, landscape
            canvas : {
                width : 960,
                height: 480,
                styles : {
                    width : "100%",
                    height : "100%"
                },
                thumbStyle: {
                    right: '4px',
                    borderRadius: '5px',
                    backgroundColor: '#027be3',
                    width: '5px',
                    opacity: 0.75
                },
                barStyle: {
                    right: '2px',
                    borderRadius: '9px',
                    backgroundColor: '#027be3',
                    width: '9px',
                    opacity: 0.2
                },
                scrollArea : {
                    width : "calc(100% - 300px - 225px)",
                    height : "calc(100% - 165px - 250px)", //"calc(100% - 128px - 36px - 200px)",
                    overflow : "auto"
                },
                /*win_poselist : null,
                win_screenshot : null,
                win_vplayer : null,
                win_mediapipe : null,*/
            },
            vrminfodlg : {
                show : false,
                showmode : false,
                /**
                 * @type {VVAvatar}
                 */
                selectedAvatar : null
            },
            capturedlg : {
                show: false,
            },
            posemotiondlg : {
                show: false,
                mode : "p",
            },
            projdlg : {
                show : false,
                maximized : false,
                fullwidth : false,
                fullheight : false,
                tab : "pinfo", //pinfo, role, avatar
                pinfo : {
                    name: "",
                    description : "",
                    license : "",
                    url : "",
                    fps : 60,
                    oldfps : 60,
                    baseDuration : 0.01,
                    oldbaseDuration : 0.01,
                },
                //---table [editrole]-----------------
                editroleColumns : [
                    { name: 'name', align: 'left', label: t('name'), field: 'name' },
                    { name: 'type', align: 'left', label: t('type'), field: 'type' },
                    { name: 'typeId', align: 'left', label: 'type', field: 'typeId' },
                    { name: 'roleTitle', align: 'left', label: t('role'), field: 'roleTitle' },
                    { name: 'oldroleTitle', align: 'left', label: t('role'), field: 'oldroleTitle' },
                    { name: "id", align:"left", label:"id", field:"id"},
                    { name: "roleName", align:"left", label:"roleName", field:"roleName"},
                ],
                editroleVisiblecCol : [
                    "name", "type", "roleTitle"
                ],
                editrolePagenation : {
                    rowsPerPage : [10]
                },
                editroles : [],
                roleselection : null,
                //---table [selavatar]---------------
                selavatarColumns : [
                    { name: 'roleTitle', align: 'left', label: t('role'), field: 'roleTitle' },
                    { name: 'type', align: 'left', label: t('type'), field: 'type' },
                    { name: 'typeId', align: 'left', label: 'type', field: 'typeId' },
                    { name: 'name', align: 'left', label: t('cast'), field: 'name' },
                    { name: 'oldname', align: 'left', label: t('cast'), field: 'oldname' },
                    { name: "id", align:"left", label:"id", field:"id"},
                    { name: "roleName", align:"left", label:"roleName", field:"roleName"},
                ],
                selavatarVisiblecCol : [
                    "roleTitle", "type", "name"
                ],
                selavatarPagenation : {
                    rowsPerPage : [20]
                },
                selavatars : [],
                selavatarOptions : ["none"],
                avatarselection : null,
                //---table [material]-----------------------
                mat_materialTypeOptions : [
                    "Texture"
                ],
                sel_mat_materialType : "",
                mat_textureFile : null,
                mat_textureFileShow : "",
                mat_textureFileActionFrom : "n", //n - new, u - update(existed)
                mat_ActionFromPreviewRow : null,
                mat_textureLabel : "",
                mat_tabradio : "a",
                mat_firstload : false,
                materialLoadedRows : {
                    "a" : [],
                    "p" : []
                },
                materialrows : null,
                selmaterialColumns : [
                    { name: 'preview', align: 'left', label: t('preview'), field: 'preview' },
                    { name: 'name', align: 'left', label: t('mat_name'), field: 'name' },
                    { name: 'oldname', align: 'left', label: t('mat_name'), field: 'oldname' },
                    { name: 'type', align: 'left', label: t('mat_type'), field: 'type' },
                    { name: 'typeId', align: 'left', label: 'type', field: 'typeId' },
                    { name: 'path', align: 'left', label: t('fullname'), field: 'path' }
                ],
                materialVisiblecCol : [
                    "preview", "name", "type", "path"
                ],
                materialrowPagenation : {
                    rowsPerPage : [20],
                },
                materialselection : "",
                //---table [vrma store]------------------------------
                vrmaTableColumns : [
                    { name: 'filename', align: 'left', label: t('filename'), field: 'filename' },
                    { name: 'clipCount', align: 'right', label: t('clipCount'), field: 'clipCount' },
                    { name: 'filepath', align: 'left', label: t('file path'), field: 'filepath' },
                    { name: 'storageTypeId', align: 'left', label: 'storageTypeId', field: 'storageTypeId' },
                    { name: 'storageType', align: 'left', label: t('storageType'), field: 'storageType' },
                    { name: 'save', align: 'left', label: t('save in project'), field: 'save' },
                ],
                vrmaTableVisiblecCol : [
                    "filename", "clipCount", "filepath", "storageType", "save"
                ],
                vrmaTablePagenation : {
                    rowsPerPage : [10]
                },
                vrmaList :[],
                vrmaselection : "",
                vrmaSaveSelection: [],
            },
            materialadddlg : {
                show : false,
                textureFile : null,
                textureFileShow : "",
                textureLabel : "",
                addtype: "f", //f - file, sd - AI(Stable Diffusion)
                ai : {
                    prompt : "",
                    size : {x: 128, y: 128},
                    preview : null,
                    resultBlob : null,
                    loading : false,
                }
            },
            keyframedlg : {
                target : null,
                frame : 1,
                easying : UserAnimationEase.Unset,
                show : false,
            },
            transformrefdlg : {
                show : false
            },
            bonetrandlg : {
                show : false,
                
            },
            easybonetrandlg : {
                show : false,
                defaultCSV: "",
            },
            gravitybonedlg : {
                show : false
            },
            imageSelector : {
                show : false,
            },
            configdlg : {
                show : false,
            },
            vpaddlg : {
                show : false
            },
            mobilepad : {
                left : {
                    rotation : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0,0,0)
                    },
                    progress : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0, 0, 0)
                    },
                    translation : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0,0,0)
                    },
                    targetzoom : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0, 0, 0)
                    },
                    panelCSS : {
                        "q-dark" : false,
                        "text-dark" : true,
                    },
                    cpadCSS : {
                        "bg-grey-9" : false,
                        "text-white" : false,
                        "bg-grey-1" : true,
                        "text-dark" : true,
                    },
                    tgl_changetarget : {
                        selected: "c", //c, o
                        icon : "videocam", //videocam, dashboard_customize
                        tooltip: "Main Camera", //Main camera Object
                    },
                    tgl_changespace : {
                        selected: "w", //w, l
                        icon : "public", //public, self_improvement
                        tooltip: "World" //World, Local
                    }
                },
                right : {
                    rotation : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0,0,0)
                    },
                    progress : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0, 0, 0)
                    },
                    translation : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0,0,0)
                    },
                    targetzoom : {
                        icon : "radio_button_unchecked",
                        info : null,
                        power : 2,
                        current : new UnityVector3(0, 0, 0)
                    },
                    panelCSS : {
                        "q-dark" : false,
                        "text-dark" : true,
                    },
                    cpadCSS : {
                        "bg-grey-9" : false,
                        "text-white" : false,
                        "bg-grey-1" : true,
                        "text-dark" : true,
                    },
                    tgl_changetarget : {
                        selected: "c", //c, o
                        icon : "videocam", //videocam, dashboard_customize
                        tooltip: "Main Camera", //Main camera Object
                    },
                    tgl_changespace : {
                        selected: "w", //w, l
                        icon : "public", //public, self_improvement
                        tooltip: "World" //World, Local
                    }
                },
            },
            navigationdlg : {
                show : false,
                webglw : 0,
                webglh : 0,
                scrollTop : 0,
                scrollLeft : 0,
                selectRect : new DOMRect(),
            },
            projectSelector : {
                show : false,
                maximized : false,
                fullwidth : false,
                fullheight : false,
                /**
                 * @type {STORAGE_TYPE}
                 */
                selectStorageType : STORAGE_TYPE.INTERNAL,
                /**
                 * @type {FILEOPTION.*.types}
                 */
                selectType : FILEOPTION.PROJECT.types,
                /**
                 * @type {INTERNAL_FILE}
                 */
                selectDB : INTERNAL_FILE.PROJECT,
                selectDBName : "",
                selectTypeName : "",
                columns : [
                    { name: 'fullname', align: 'left', label: t('fullname'), field: 'fullname', sortable: true },
                    { name: 'name', align: 'left', label: t('name'), field: 'name', sortable: true  },
                    { name: 'type', align: 'left', label: t('type'), field: 'type' },
                    { name: 'size', align: 'right', label: t('size'), field: 'size', sortable: true  },
                    { name: 'createdDate', align: 'left', label: t("created_date"), field: 'createdDate', sortable: true  },
                    { name: 'updatedDate', align: 'left', label: t("updated_date"), field: 'updatedDate', sortable: true  },

                ],
                visiblecCol : [
                    "fullname",  "size", "createdDate", "updatedDate"
                ],
                pagenation : {
                    rowsPerPage : 40
                },
                /**
                 * Internal, File - name
                 * Google Drive - file ID
                 * @type {String}
                 */
                selected : "",
                /**
                 * @type {AppDBMeta[]}
                 */
                files : [],
                /**
                 * @type {AppDBMeta[]}
                 */
                searchedFiles : [],
                searchstr : "",
            },
            vroidhubSelector : {
                show : false,
                maximized : false,
                fullwidth : false,
                fullheight : false,
                style : {
                    width: "850px",
                    height: "550px",
                    overflow: "hidden"
                },

                loading : false,
                kind: "model", //models, hearts, staffpicks
                kindName : "My models",
                next: {maxid:"", previd:""},
                rand : "",

                selected: "",
                /**
                 * @type {{data:Object, selectStyle:String}[]}
                 */
                files : [],
                searchedFiles : [],
                searchstr : "",
            },
            vroidhubAuthorizer : {
                show : false,
                maximized : false,
                fullwidth : false,
                fullheight : false,
                style : {
                    width: "640px",
                    height: "280px",
                    overflow: "hidden"
                },


                url : "",
                progress_authorize : false,
                code_inputBox : "",
            },
            vroidhubSelectCondition : {
                show : false,
                maximized : false,
                fullwidth : false,
                fullheight : false,
                style : {
                    overflow: "hidden"
                },
                condition_accept : false,
                modelData : null,
            },
            tearchManager : {
                show : false,
                modelName : "rot",
            },
            win_screenshot : null,
            win_pose : null,
            win_vplayer : null,
            win_mediapipe : null,
            win_bonetransform : null,
            win_keyframe : null,
            win_gravitybone: null,
            win_transref: null,
            win_easyikmode: null,
            footer : true
        };
        this.states = {
            /**
             * @type {VVAvatar}
             */
            selectedAvatar : null,

            /**
             * VRM's body parts IK-Marker
             * @type {String}
             */
            selectedBodyParts: "",
            
            old_selectedAvatar : null,

            /**
             * @type {VVCast}
             */
            selectedCast : null,

            /**
             * @type {VVTimelineTarget}
             */
            selectedTimeline : null,

            /**
             * @type {Array<VVTimelineFrameData>}
             */
            selectedKeyframeTarget : {},
            /**
             * @type {VVProp}
             */
            selectedProp : null,

            /**
             * @type {String}
             */
            fileloadtype : "v",  //v - vrm, o - object
            /**
             * @type {String}
             */
            fileloadname : "",
            /**
             * @type {File}
             */
            loadingfile : null,
            /**
             * @type {VOSFile}
             */
            loadingfileHandle : null,
            //avoidSetEvent : false,
            animationPlaying : false,
            currentProjectFromFile : true,
            /**
             * Saved storage type.
             * "i"nternal, "f"ile, "g"oogleDrive
             * @type {String}
             */
            currentProjectFromStorageType : "i", // internal, file, googleDrive,
            currentProjectFilename : "project",
            currentProjectFilepath : "project",
            currentProjectFileID : "",
            /**
             * @type {FileSystemFileHandle or String}
             */
            currentProjectHandle : null,

            currentEditOperationCount : 0,
            backupEditOperationCount : 0,

            /**
             * Is enable access token and connect?
             * @type {Boolean}
             */
            vroidhub_api : false,

            googledrive_gas : false,

            /**
             * check orientation screen ?
             * @type {Boolean}
             */
            turnOrientation : false,

            uimode: "",

            inputstep: {
                id : null,
                start:null,
                prevstamp : null,
                done: false
            },
            inputman : new InputManager(),
        };
        this.data = {
            clipboard : {
                frame : null
            },
            /**
             * @type {VVAvatar}
             */
            preview : null,
            /**
             * @type {Array<VVAvatar>}
             */
            vrms : [],

            /**
             * @type {Array<VVTimelineTarget>}
             */
            timelineCasts : {},

            savingPoseName : "",

            /**
             * @type {VVAnimationProject}
             */
            project : new VVAnimationProject(),

            /**
             * @type {MediaStream}
             */
            recordStream : new MediaStream(),

            objectUrl : {
                vrm : null,
                audio : null
            },
            EffectDirectory : EFFECTLIST
            ,
      
        };
    }
}
export const defineAppMainData = () => {
    const { t } = VueI18n.useI18n({ useScope: 'global' });

    /**
     * @type {appMainData}
     */
    const mainData = Vue.reactive(new appMainData(t("appName"), t("appDescription")));
    
    //---setup gamepad events
    mainData.states.inputman.callbacks.push(
        new InputManageCallback({},true,false,(values) => {
            var param = `${values.x},${values.y * -1}`;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'GamepadLeftStickFromOuter',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        })
    );
    mainData.states.inputman.callbacks.push(
        new InputManageCallback({},false,true,(values) => {
            var param = `${values.x},${values.y * -1}`;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'GamepadRightStickFromOuter',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        })
    );
    mainData.states.inputman.callbacks.push(
        new InputManageCallback({Up:true},false,false,(values) => {
            var param = `0,1`;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'GamepadDpadFromOuter',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        })
    );
    mainData.states.inputman.callbacks.push(
        new InputManageCallback({Down:true},false,false,(values) => {
            var param = `0,-1`;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'GamepadDpadFromOuter',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        })
    );
    mainData.states.inputman.callbacks.push(
        new InputManageCallback({L1:true},false,false,(values) => {
            var param = "L1";
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'GamepadKeyFromOuter',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        })
    );
    mainData.states.inputman.callbacks.push(
        new InputManageCallback({R1:true},false,false,(values) => {
            var param = "R1";
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'GamepadKeyFromOuter',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        })
    );
    mainData.states.inputman.callbacks.push(
        new InputManageCallback({Select:true},false,false,(values) => {
            var param = "select";
            AppQueue.add(new queueData(
                {target:AppQueue.unity.Camera,method:'GamepadKeyFromOuter',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        })
    );

    const fil_animproject = Vue.ref(null);
    const file_audio = Vue.ref(null);
    const fil_animmotion = Vue.ref(null);
    const hid_file = Vue.ref(null);
    const aud01_capture = Vue.ref(null);
    
    return {
        mainData,
        fil_animproject,file_audio,fil_animmotion,hid_file,aud01_capture
    };
}