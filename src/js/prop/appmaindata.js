import { VVAvatar, VVCast,VVAnimationProject, VVTimelineTarget, VVProp, VVTimelineFrameData } from "./cls_vvavatar.js"
import { AppDBMeta, VVAppConfig } from "../appconf.js";
import { AF_TARGETTYPE, FILEOPTION, INTERNAL_FILE, STORAGE_TYPE, UserAnimationEase } from "../../res/appconst.js";
import { VOSFile } from "../../../public/static/js/filehelper.js";
import { VRoidHubConnector } from "../model/vroidhub.js";

export class appMainData {
    constructor(appName, appDesc) {
        const { t } = VueI18n.useI18n({ useScope: 'global' });

        
        this.appinfo = {
            name : appName,
            description : appDesc,
            version : "2.5.0",
            revision : "20240217-01",
            platform : `${Quasar.Platform.is.platform}(${Quasar.Platform.is.name})`
        };
        this.appconf = new VVAppConfig();
        this.vroidhubapi = new VRoidHubConnector();
        this.elements = {
            header : true,
            appinfodlg : false,
            loading : false,
            loadingTypePercent : false,
            percentLoad : {
                percent : 0,
                current : 0,                
            },
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
                    overflow : "hidden"
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
            bonetrandlg : {
                show : false,
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
                    { name: 'fullname', align: 'left', label: t('fullname'), field: 'fullname' },
                    { name: 'name', align: 'left', label: t('name'), field: 'name' },
                    { name: 'type', align: 'left', label: t('type'), field: 'type' },
                    { name: 'size', align: 'right', label: t('size'), field: 'size' },
                    { name: 'createdDate', align: 'left', label: t("created_date"), field: 'createdDate' },
                    { name: 'updatedDate', align: 'left', label: t("updated_date"), field: 'updatedDate' },

                ],
                visiblecCol : [
                    "fullname",  "size", "createdDate", "updatedDate"
                ],
                pagenation : {
                    rowsPerPage : 20
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
            win_screenshot : null,
            win_pose : null,
            win_vplayer : null,
            win_mediapipe : null,
            win_bonetransform : null,
            win_keyframe : null,
            footer : true
        };
        this.states = {
            /**
             * @type {VVAvatar}
             */
            selectedAvatar : null,
            
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
            EffectDirectory : {
                
            },
      
        };
    }
}
export const defineAppMainData = () => {
    const { t } = VueI18n.useI18n({ useScope: 'global' });

    /**
     * @type {appMainData}
     */
    const mainData = Vue.reactive(new appMainData(t("appName"), t("appDescription")));
    
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