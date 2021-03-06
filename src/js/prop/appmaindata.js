import { VVAvatar, VVCast,VVAnimationProject, VVTimelineTarget, VVProp, VVTimelineFrameData } from "./cls_vvavatar.js"
import { AppDBMeta, VVAppConfig } from "../appconf.js";
import { AF_TARGETTYPE, FILEOPTION, INTERNAL_FILE, UserAnimationEase } from "../../res/appconst.js";

export const defineAppMainData = () => {
    const { t } = VueI18n.useI18n({ useScope: 'global' });

    const mainData = Vue.ref({
        appinfo : {
            name : t("appName"),
            description : t("appDescription"),
            version : "1.0.2",
            revision : "20220718-01",
            platform : `${Quasar.Platform.is.platform}(${Quasar.Platform.is.name})`
        },
        appconf : new VVAppConfig(),
        elements : {
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
            keyframedlg : {
                target : null,
                frame : 1,
                easying : UserAnimationEase.Unset,
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
            keyframedlg : {
                show : false,
            },
            projectSelector : {
                show : false,
                maximized : false,
                fullwidth : false,
                fullheight : false,
                /**
                 * @type {FILEOPTION.*.types}
                 */
                selectType : FILEOPTION.PROJECT.types,
                /**
                 * @type {INTERNAL_FILE}
                 */
                selectDB : INTERNAL_FILE.PROJECT,
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
                selected : "",
                /**
                 * @type {AppDBMeta}
                 */
                files : [],
            },
            win_screenshot : null,
            win_pose : null,
            win_vplayer : null,
            win_mediapipe : null,
            win_bonetransform : null,
            footer : true
        },
        states : {
            /**
             * @type {VVAvatar}
             */
            selectedAvatar : null,
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
             * @type {FileSystemFileHandle}
             */
            loadingfileHandle : null,
            //avoidSetEvent : false,
            animationPlaying : false,
            currentProjectFromFile : true,
            currentProjectFilename : "project",
            /**
             * @type {FileSystemFileHandle or String}
             */
            currentProjectHandle : null,

            currentEditOperationCount : 0,
            backupEditOperationCount : 0,
        },
        data : {
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
      
        }
    });
    
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