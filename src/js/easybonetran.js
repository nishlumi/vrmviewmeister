
import { AF_TARGETTYPE, IKBoneType } from "../res/appconst.js";
import { AvatarAllIKParts, AvatarSingleIKTransform, UnityVector3 } from "./prop/cls_unityrel.js";
import { EasySelectList, EasySelectRow, VVAvatar } from "./prop/cls_vvavatar.js";

/*

    
*/

const template = `
<div ref="btpdlg" v-show="show" :class="appdata.elements.panelCSS" class="rounded-borders shadow-2" :style="appdata.elements.win.styles">
    <div ref="btpdlg_bar" v-touch-pan.prevent.mouse="handlePan" class="basic-dialog-titlebar bg-primary text-grey-1 q-pa-xs">
        <div class="row">
            <div>{{ $t('title_easy_ikmode') }}</div>
            <q-space></q-space>
            <q-btn flat round dense size="md" icon="clear" @click="close_onclick"></q-btn>
        </div>
        
    </div>
    <div :class="appdata.elements.panelCSS" style="width:100%;height:calc(100% - 40px);">
        <div class="row basic-dialog-toolbar">
            <q-btn flat round dense icon="bookmark_added" @click="apply_onclick" :disabled="appdata.elements.header.btndisable">
                <q-tooltip v-text="$t('apply pose')"></q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="refresh" style="margin-left:1rem;" @click="defaultbtn_onclick" :disabled="appdata.elements.header.btndisable">
                <q-tooltip v-text="$t('to_default')"></q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="accessibility" style="margin-left:1rem;" @click="reload_onclick" :disabled="appdata.elements.header.btndisable">
                <q-tooltip v-text="$t('get_bonedata')"></q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="clear" style="margin-left:1rem;" @click="selclear_onclick" :disabled="appdata.elements.header.btndisable">
                <q-tooltip v-text="$t('easyik_selclear')"></q-tooltip>
            </q-btn>
            
            <q-space></q-space>
            <input type="file" ref="rfile" accept=".csv,.tsv" @change="rfile_onchange" class="common_ui_off">
            <q-btn flat round dense icon="upload" style="margin-left:1rem;" @click="openfile_onclick" :disabled="appdata.elements.header.btndisable">
                <q-tooltip v-text="$t('cons_open')"></q-tooltip>
            </q-btn>
            
            
        </div>
        
        <div class="basic-dialog-contentarea">
            
            <div :class="appdata.elements.sprPanelCSS.forVRM">
                <div class="row q-mb-sm">
                    <div class="col-12">
                        <q-checkbox v-model="appdata.elements.initialpose.useTPose"
                            :label="$t('UseTPose')"
                        ></q-checkbox>
                    </div>
                </div>
                <template v-if="cmp_is_screen_xs">
                    <q-tabs
                        v-model="appdata.elements.tab"
                    >
                        <q-tab name="gaze">
                            <img src="static/img/vvmtrans_eyeview.png" width="32" height="32">
                        </q-tab>
                    </q-tabs>
                    <q-tabs
                        v-model="appdata.elements.tab"
                    >
                        <q-tab name="rightarm">
                            <img src="static/img/vvmtrans_rightarm.png" width="32" height="32">
                        </q-tab>
                        <q-tab name="rightleg">
                            <img src="static/img/vvmtrans_rightleg.png" width="32" height="32">
                        </q-tab>

                        <q-tab name="posture">
                            <img src="static/img/vvmtrans_body.png" width="32" height="32">
                        </q-tab>
                        <q-tab name="leftleg">
                            <img src="static/img/vvmtrans_leftleg.png" width="32" height="32">
                        </q-tab>
                        <q-tab name="leftarm">
                            <img src="static/img/vvmtrans_leftarm.png" width="32" height="32">
                        </q-tab>
                    </q-tabs>
                    
                    <q-tab-panels v-model="appdata.elements.tab" animated>
                        <q-tab-panel name="posture">
                            <q-select v-model="appdata.elements.postureBox.selected" 
                                :options="appdata.elements.postureBox.options" 
                                :label="$t('posture')"
                                filled 
                                @update:model-value="posturebox_onchange"
                            ></q-select>
                        </q-tab-panel>
                        <q-tab-panel name="gaze">
                            <q-select v-model="appdata.elements.eyeBox.selected" 
                                :options="appdata.elements.eyeBox.options" 
                                :label="$t('gaze')"
                                filled 
                            ></q-select>
                        </q-tab-panel>
                        <q-tab-panel name="rightarm">
                            <q-select v-model="appdata.elements.rightArmBox.selected" 
                                :options="appdata.elements.rightArmBox.options" 
                                :label="$t('RightHand')"
                                filled 
                            ></q-select>
                        </q-tab-panel>
                        <q-tab-panel name="leftarm">
                            <q-select v-model="appdata.elements.armBox.selected" 
                                :options="appdata.elements.armBox.options" 
                                :label="$t('LeftHand')"
                                filled 
                            ></q-select>
                        </q-tab-panel>
                        <q-tab-panel name="rightleg">
                            <q-select v-model="appdata.elements.rightLegBox.selected" 
                                :options="appdata.elements.rightLegBox.options" 
                                :label="$t('RightFoot')"
                                filled
                            ></q-select>
                        </q-tab-panel>
                        <q-tab-panel name="leftleg">
                            <q-select v-model="appdata.elements.legBox.selected" 
                                :options="appdata.elements.legBox.options" 
                                :label="$t('LeftFoot')"
                                filled 
                            ></q-select>
                        </q-tab-panel>
                    </q-tab-panels>
                </template>
                <template v-else>
                    <div class="row q-mb-sm">
                        <div class="col-12">
                            <q-select v-model="appdata.elements.eyeBox.selected" 
                                :options="appdata.elements.eyeBox.options" 
                                :label="$t('gaze')"
                                filled 
                            ><template v-slot:prepend>
                                <img src="static/img/vvmtrans_eyeview.png" width="32" height="32">
                            </template></q-select>
                        </div>
                    </div>
                    <div class="row q-mb-sm">                        
                        <div class="col-12">
                            <q-select v-model="appdata.elements.postureBox.selected" 
                                :options="appdata.elements.postureBox.options" 
                                :label="$t('posture')"
                                filled 
                                @update:model-value="posturebox_onchange"
                            ><template v-slot:prepend>
                                <img src="static/img/vvmtrans_body.png" width="32" height="32">
                            </template></q-select>
                        </div>
                    </div>
                    <div class="row q-mb-sm">                        
                        <div class="col-12">
                            <q-select v-model="appdata.elements.rightArmBox.selected" 
                                :options="appdata.elements.rightArmBox.options" 
                                :label="$t('RightHand')"
                                filled 
                            ><template v-slot:prepend>
                                <img src="static/img/vvmtrans_rightarm.png" width="32" height="32">
                            </template></q-select>
                        </div>
                    </div>
                    <div class="row q-mb-sm">                        
                        <div class="col-12">
                            <q-select v-model="appdata.elements.armBox.selected" 
                                :options="appdata.elements.armBox.options" 
                                :label="$t('LeftHand')"
                                filled 
                            ><template v-slot:prepend>
                                <img src="static/img/vvmtrans_leftarm.png" width="32" height="32">
                            </template></q-select>
                        </div>
                    </div>
                    <div class="row q-mb-sm">                        
                        <div class="col-12">
                            <q-select v-model="appdata.elements.rightLegBox.selected" 
                                :options="appdata.elements.rightLegBox.options" 
                                :label="$t('RightFoot')"
                                filled 
                            ><template v-slot:prepend>
                                <img src="static/img/vvmtrans_rightleg.png" width="32" height="32">
                            </template></q-select>
                        </div>
                    </div>
                    <div class="row q-mb-sm">                        
                        <div class="col-12">
                            <q-select v-model="appdata.elements.legBox.selected" 
                                :options="appdata.elements.legBox.options" 
                                :label="$t('LeftFoot')"
                                filled 
                            ><template v-slot:prepend>
                                <img src="static/img/vvmtrans_leftleg.png" width="32" height="32">
                            </template></q-select>
                        </div>
                    </div>
                </template>
                
            </div>
            
            <div :class="appdata.elements.sprPanelCSS.forOther">
                <h1>Not VRM</h1>
            </div>
        </div>
    </div>
    
    
</div>
`;

/*
    {
        posture : number(0-3),
        name : string,
        calclist : [
            {
                parts : string,
                expression : string,
            }
        ]
    }
*/

var PARTS_LABEL = [
    /*1 - 6*/ "EyeViewHandle_pos_x",	"EyeViewHandle_pos_y",	"EyeViewHandle_pos_z",	"EyeViewHandle_rot_x",	"EyeViewHandle_rot_y",	"EyeViewHandle_rot_z",
    /*7 - 12*/ "Head_pos_x",	"Head_pos_y",	"Head_pos_z",	"Head_rot_x",	"Head_rot_y",	"Head_rot_z",
    /*13 - 18*/ "LookAt_pos_x",	"LookAt_pos_y",	"LookAt_pos_z",	"LookAt_rot_x",	"LookAt_rot_y",	"LookAt_rot_z",
    /*19 - 24*/ "Aim_pos_x",	"Aim_pos_y",	"Aim_pos_z",	"Aim_rot_x",	"Aim_rot_y",	"Aim_rot_z",
    /*25 - 30*/ "Chest_pos_x",	"Chest_pos_y",	"Chest_pos_z",	"Chest_rot_x",	"Chest_rot_y",	"Chest_rot_z",
    /*31 - 36*/ "Pelvis_pos_x",	"Pelvis_pos_y",	"Pelvis_pos_z",	"Pelvis_rot_x",	"Pelvis_rot_y",	"Pelvis_rot_z",
    /*37 - 42*/ "LeftShoulder_pos_x",	"LeftShoulder_pos_y",	"LeftShoulder_pos_z",	"LeftShoulder_rot_x",	"LeftShoulder_rot_y",	"LeftShoulder_rot_z",
    /*43 - 48*/ "LeftLowerArm_pos_x",	"LeftLowerArm_pos_y",	"LeftLowerArm_pos_z",	"LeftLowerArm_rot_x",	"LeftLowerArm_rot_y",	"LeftLowerArm_rot_z",
    /*49 - 54*/ "LeftHand_pos_x",	"LeftHand_pos_y",	"LeftHand_pos_z",	"LeftHand_rot_x",	"LeftHand_rot_y",	"LeftHand_rot_z",
    /*55 - 60*/ "RightShoulder_pos_x",	"RightShoulder_pos_y",	"RightShoulder_pos_z",	"RightShoulder_rot_x",	"RightShoulder_rot_y",	"RightShoulder_rot_z",
    /*61 - 66*/ "RightLowerArm_pos_x",	"RightLowerArm_pos_y",	"RightLowerArm_pos_z",	"RightLowerArm_rot_x",	"RightLowerArm_rot_y",	"RightLowerArm_rot_z",
    /*67 - 72*/ "RightHand_pos_x",	"RightHand_pos_y",	"RightHand_pos_z",	"RightHand_rot_x",	"RightHand_rot_y",	"RightHand_rot_z",
    /*73 - 78*/ "LeftLowerLeg_pos_x",	"LeftLowerLeg_pos_y",	"LeftLowerLeg_pos_z",	"LeftLowerLeg_rot_x",	"LeftLowerLeg_rot_y",	"LeftLowerLeg_rot_z",
    /*79 - 84*/ "LeftLeg_pos_x",	"LeftLeg_pos_y",	"LeftLeg_pos_z",	"LeftLeg_rot_x",	"LeftLeg_rot_y",	"LeftLeg_rot_z",
    /*85 - 90*/ "RightLowerLeg_pos_x",	"RightLowerLeg_pos_y",	"RightLowerLeg_pos_z",	"RightLowerLeg_rot_x",	"RightLowerLeg_rot_y",	"RightLowerLeg_rot_z",
    /*91 - 96*/ "RightLeg_pos_x",	"RightLeg_pos_y",	"RightLeg_pos_z",	"RightLeg_rot_x",	"RightLeg_rot_y",	"RightLeg_rot_z",
    /*97 - 102*/ "LeftToes_pos_x",	"LeftToes_pos_y",	"LeftToes_pos_z",	"LeftToes_rot_x",	"LeftToes_rot_y",	"LeftToes_rot_z",
    /*103 - 108*/ "RightToes_pos_x",	"RightToes_pos_y",	"RightToes_pos_z",	"RightToes_rot_x",	"RightToes_rot_y",	"RightToes_rot_z",
];

export class BaseData {
    constructor() {
        this.elements = {
            win : {
                styles : {
                    position : "absolute",
                    bottom : "-9999px",
                    right : "-9999px",
                    width : "280px",
                    height : "520px",
                    zIndex : 5003,
                    backgroundColor : "#FFFFFF"
                },
                position : {
                    x : 0,
                    y : 0
                }
            },
            panelCSS : {
                "q-dark" : false,
                "text-dark" : true,
            },
            header : {
                btndisable : false
            },
            sprPanelCSS : {
                forVRM : {
                    "spr-panel-top" : true,
                    "spr-panel-back" : false
                },
                forOther : {
                    "spr-panel-top" : false,
                    "spr-panel-back" : true
                }
            },
            tab : "posture",

            filebox : null,

            initialpose : {
                useTPose : false,
            },

            postureBox : {
                options : [{label:"---",value:null}],
                selected : null
            },
            eyeBox : {
                options : [{label:"---",value:null}],
                selected : null
            },
            armBox : {
                options : [{label:"---",value:null}],
                selected : null
            },
            legBox : {
                options : [{label:"---",value:null}],
                selected : null
            },
            rightArmBox : {
                options : [{label:"---",value:null}],
                selected : null
            },
            rightLegBox : {
                options : [{label:"---",value:null}],
                selected : null
            },
        }
        this.data = {
            easySelectList : new EasySelectList(),
            /**
             * @type {AvatarAllIKParts}
             */
            bodyList : {},
            /**
             * @type {AvatarAllIKParts}
             */
            TPose : {},
            defaultData : "",
            mathScope : {},
        };
    }
}

export function defineEasyBoneTranDlg(app, Quasar) {
    app.component("EasytranDlg",{
        template: template,
        props : {
            modelValue : Boolean,
            avatar: VVAvatar,
            sampleUrl : {
                type: String,
                default: ""
            },
            defaultCsv: {
                type: String,
                default: []
            }
        },
        emits : [
            "update:model-value"
        ],
        setup(props, context) {
            const {modelValue, avatar, sampleUrl, defaultCsv } = Vue.toRefs(props);
            const { t, locale  } = VueI18n.useI18n({ useScope: 'global' });


            /**
             * @type {BaseData}
             */
            const appdata = Vue.reactive(new BaseData());

            const show = Vue.ref(false);
            const btpdlg_bar = Vue.ref(null);
            const btpdlg = Vue.ref(null);
            const rfile = Vue.ref(null);

            //---watch ----------------------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
                if (Quasar.Screen.xs || (ID("uimode").value == "mobile")) {
                    //---real mobile or UI is mobile mode (real size nothing)

                    //---position
                    appdata.elements.win.styles["top"] = `${Quasar.Screen.height * 0.1}px`;
                    delete appdata.elements.win.styles["bottom"];
                    //---size
                    if (Quasar.Screen.xs) {
                        appdata.elements.win.styles.width = `${Quasar.Screen.width * 0.95}px`;
                    }else{
                        appdata.elements.win.styles.width = "370px";
                    }
                    appdata.elements.win.styles["max-height"] = `${Quasar.Screen.height * 0.95}px`;
                    //---UI is mobile mode, then window size fixed.
                    appdata.elements.win.styles.height = "330px";
                }else{
                    appdata.elements.win.styles.bottom = "0px";
                }
                appdata.elements.win.styles.right = "0px";

                

                appdata.elements.win.position.x = 0;
                appdata.elements.win.position.y = 0;
                btpdlg.value.style.transform =
                    `translate(${appdata.elements.win.position.x}px, ${appdata.elements.win.position.y}px)`;
                
                appdata.data.defaultData = "";
            });
            const wa_show = Vue.watch(() => show.value, (newval) => {
                if (newval) {
                    if (defaultCsv.value == "") {
                        //---if this windo only
                        defaultbtn_onclick();
                    }else{
                        //---load from app start
                        reloadDefaultDataForFirst(defaultCsv.value);
                    }
                    
                    reload_onclick();

                }
            });

            const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
                appdata.elements.panelCSS["q-dark"] = newval;
                appdata.elements.panelCSS["text-dark"] = !newval;
            }); 
            const wa_avatar_type = Vue.watch(() => avatar.value,(newval,oldval) => {
                if (!newval) return;
                if (!oldval) return;

                if (newval.type != oldval.type) {
                    if (newval.type == AF_TARGETTYPE.VRM) {
                        appdata.elements.sprPanelCSS.forVRM["spr-panel-top"] = true;
                        appdata.elements.sprPanelCSS.forVRM["spr-panel-back"] = false;
                        appdata.elements.sprPanelCSS.forOther["spr-panel-top"] = false;
                        appdata.elements.sprPanelCSS.forOther["spr-panel-back"] = true;

                        appdata.elements.header.btndisable = false;
                    }else{
                        appdata.elements.sprPanelCSS.forVRM["spr-panel-top"] = false;
                        appdata.elements.sprPanelCSS.forVRM["spr-panel-back"] = true;
                        appdata.elements.sprPanelCSS.forOther["spr-panel-top"] = true;
                        appdata.elements.sprPanelCSS.forOther["spr-panel-back"] = false;

                        appdata.elements.header.btndisable = true;
                    }
                }else{
                    if (newval.type == AF_TARGETTYPE.VRM) {
                        reload_onclick();
                    }
                }
            },{deep:true});
            const wa_locale = Vue.watch(() => locale.value, (newval, oldval) => {
                if (show.value === true) defaultbtn_onclick();
            });

            const cmp_is_screen_xs = Vue.computed(() => {
                if (Quasar.Screen.xs || (ID("uimode").value == "mobile")) {
                    return true;
                }else{
                    return false;
                }

            });


            //---functions---------------------------------------------------------
            /**
             * 
             * @param {String} data 
             */
            const loadData = (data) => {
                if (data == "") return;

                var arr = data.split(/[\r\n]+/g);
                try {
                    appdata.data.easySelectList.arealist.splice(0, appdata.data.easySelectList.arealist.length);
                    
                    for (var i = 1; i < arr.length; i++) {
                        if (arr[i].trim() == "") continue;
                        var line = arr[i].split("\t");
                        //---col 1 : kind,posture
                        var postureIndex = parseInt(line[0]);
                        if (isNaN(postureIndex)) throw new Error("posture,error,nan");
                        if ((postureIndex < 0) || (postureIndex > 5)) throw new Error("posture,error,range");

                        if (line.length < 110) throw new Error("parts,error,range");

                        var area = new EasySelectRow(postureIndex);
                        //---col 2 : posture name
                        area.name = line[1];

                        area.lang = line[2];

                        area.useTPose = line[3] == "1" ? true : false;

                        //appdata.data.easySelectList.arealist[postureIndex].name = line[1];
                        for (var p = 4; p < line.length; p++) {
                            var partsarr = PARTS_LABEL[p-4].split("_");
                            area.calclist.push({
                                parts : partsarr[0],
                                transform : partsarr[1],
                                axis: partsarr[2],
                                expression : line[p],
                            });
                        }
                        appdata.data.easySelectList.arealist.push(area);
                    }
                }catch(e) {
                    console.log(e);
                    if (e == "posture,error,nan") {
                        appAlert(t("msg_posture_error_nan"));
                    }else if (e == "posture,error,range") {
                        appAlert(t("msg_posture_error_range"));
                    }else if (e == "parts,error,range") {
                        appAlert(t("msg_parts_error_range"));
                    }
                }
            }
            const applyDataToUI = () => {
                //---posture
                var postures = appdata.data.easySelectList.arealist.filter(v => {
                    if ((v.posture == 0) && ((locale.value.indexOf(v.lang) > -1) || (v.lang == ""))) return true;
                    return false;
                });
                appdata.elements.postureBox.options.splice(0, appdata.elements.postureBox.options.length);
                appdata.elements.postureBox.options.push({label:"---",value:null});
                for (var o of postures) {
                    appdata.elements.postureBox.options.push( {
                        label: o.name,
                        value : o
                    });
                }
                //---reload current select data
                if (appdata.elements.postureBox.selected) {
                    var ishit = appdata.elements.postureBox.options.find(v => {
                        if (v.label == appdata.elements.postureBox.selected.label) return true;
                        return false;
                    });
                    if (ishit) appdata.elements.postureBox.selected.value = ishit.value;
                }
                

                //---eye view
                var eyeview = appdata.data.easySelectList.arealist.filter(v => {
                    if ((v.posture == 1) && ((locale.value.indexOf(v.lang) > -1) || (v.lang == ""))) return true;
                    return false;
                });
                appdata.elements.eyeBox.options.splice(0, appdata.elements.eyeBox.options.length);
                appdata.elements.eyeBox.options.push({label:"---",value:null});
                for (var o of eyeview) {
                    appdata.elements.eyeBox.options.push( {
                        label: o.name,
                        value : o
                    });
                }
                //---reload current select data
                if (appdata.elements.eyeBox.selected) {
                    var ishit = appdata.elements.eyeBox.options.find(v => {
                        if (v.label == appdata.elements.eyeBox.selected.label) return true;
                        return false;
                    });
                    if (ishit) appdata.elements.eyeBox.selected.value = ishit.value;
                }
                

                //---arm
                var arms = appdata.data.easySelectList.arealist.filter(v => {
                    if ((v.posture == 2) && ((locale.value.indexOf(v.lang) > -1) || (v.lang == ""))) return true;
                    return false;
                });
                appdata.elements.armBox.options.splice(0, appdata.elements.armBox.options.length);
                appdata.elements.armBox.options.push({label:"---",value:null});
                for (var o of arms) {
                    appdata.elements.armBox.options.push( {
                        label: o.name,
                        value : o
                    });
                }
                //---reload current select data
                if (appdata.elements.armBox.selected) {
                    for (var o = 0; o < appdata.elements.armBox.selected.length; o++) {
                        var ishit = appdata.elements.armBox.options.find(v => {
                            if (v.label == appdata.elements.armBox.selected[o].label) return true;
                            return false;
                        });
                        if(ishit) appdata.elements.armBox.selected[o].value = ishit.value;
                    }
                    
                }
                //---right arm
                arms = appdata.data.easySelectList.arealist.filter(v => {
                    if ((v.posture == 4) && ((locale.value.indexOf(v.lang) > -1) || (v.lang == ""))) return true;
                    return false;
                });
                appdata.elements.rightArmBox.options.splice(0, appdata.elements.rightArmBox.options.length);
                appdata.elements.rightArmBox.options.push({label:"---",value:null});
                for (var o of arms) {
                    appdata.elements.rightArmBox.options.push( {
                        label: o.name,
                        value : o
                    });
                }
                //---reload current select data
                if (appdata.elements.rightArmBox.selected) {
                    for (var o = 0; o < appdata.elements.rightArmBox.selected.length; o++) {
                        var ishit = appdata.elements.rightArmBox.options.find(v => {
                            if (v.label == appdata.elements.rightArmBox.selected[o].label) return true;
                            return false;
                        });
                        if(ishit) appdata.elements.rightArmBox.selected[o].value = ishit.value;
                    }
                    
                }
                

                //---leg
                var legs = appdata.data.easySelectList.arealist.filter(v => {
                    if ((v.posture == 3) && ((locale.value.indexOf(v.lang) > -1) || (v.lang == ""))) return true;
                    return false;
                });
                appdata.elements.legBox.options.splice(0, appdata.elements.legBox.options.length);
                appdata.elements.legBox.options.push({label:"---",value:null});
                for (var o of legs) {
                    appdata.elements.legBox.options.push( {
                        label: o.name,
                        value : o
                    });
                }
                //---reload current select data
                if (appdata.elements.legBox.selected) {
                    for (var o = 0; o < appdata.elements.legBox.selected.length; o++) {
                        var ishit = appdata.elements.legBox.options.find(v => {
                            if (v.label == appdata.elements.legBox.selected[o].label) return true;
                            return false;
                        });
                        if (ishit) appdata.elements.legBox.selected[o].value = ishit.value;
                    }
                    
                }
                //---right leg
                legs = appdata.data.easySelectList.arealist.filter(v => {
                    if ((v.posture == 5) && ((locale.value.indexOf(v.lang) > -1) || (v.lang == ""))) return true;
                    return false;
                });
                appdata.elements.rightLegBox.options.splice(0, appdata.elements.rightLegBox.options.length);
                appdata.elements.rightLegBox.options.push({label:"---",value:null});
                for (var o of legs) {
                    appdata.elements.rightLegBox.options.push( {
                        label: o.name,
                        value : o
                    });
                }
                //---reload current select data
                if (appdata.elements.rightLegBox.selected) {
                    for (var o = 0; o < appdata.elements.rightLegBox.selected.length; o++) {
                        var ishit = appdata.elements.rightLegBox.options.find(v => {
                            if (v.label == appdata.elements.rightLegBox.selected[o].label) return true;
                            return false;
                        });
                        if (ishit) appdata.elements.rightLegBox.selected[o].value = ishit.value;
                    }
                    
                }
                

            }
            /**
             * 
             * @param {AvatarSingleIKTransform[]} list reload data
             * @param {String[]} targets target bones to reload
             */
            const reloadMathScope = (list, targets = []) => {
                if (list.length > 0) {
                    appdata.data.mathScope = null;
                    appdata.data.mathScope = {};

                    for (var i = 0; i < PARTS_LABEL.length; i++) {
                        const PLABEL = PARTS_LABEL[i];

                        var ishit = true; //default is all bones
                        //---if receive target bones, reload target bones only.
                        if (targets.length > 0) {
                            ishit = targets.findIndex(PLABEL.split("_")[0]);
                        }

                        if (ishit) {
                            for (var v of list) {
                                if (PLABEL.toLowerCase().indexOf(v.ikname.toLowerCase()) > -1) {
                                    if (PLABEL.toLowerCase().indexOf("pos_x") > -1) {
                                        appdata.data.mathScope[PLABEL] = v.position.x;
                                    }
                                    else if (PLABEL.toLowerCase().indexOf("pos_y") > -1) {
                                        appdata.data.mathScope[PLABEL] = v.position.y;
                                    }
                                    else if (PLABEL.toLowerCase().indexOf("pos_z") > -1) {
                                        appdata.data.mathScope[PLABEL] = v.position.z;
                                    }
                                    else if (PLABEL.toLowerCase().indexOf("rot_x") > -1) {
                                        appdata.data.mathScope[PLABEL] = v.rotation.x;
                                    }
                                    else if (PLABEL.toLowerCase().indexOf("rot_y") > -1) {
                                        appdata.data.mathScope[PLABEL] = v.rotation.y;
                                    }
                                    else if (PLABEL.toLowerCase().indexOf("rot_z") > -1) {
                                        appdata.data.mathScope[PLABEL] = v.rotation.z;
                                    }
                                    
                                }   
                            }
                        }
                    }
                }
                
                
            }
            /**
             * 
             * @param {EasySelectRow} calcdata 
             * @returns {AvatarSingleIKTransform[]} new current transform data.
             */
            const analyzeCalculation = (calcdata) => {
                //---retrive T-pose data
                /**
                 * @type {AvatarSingleIKTransform[]}
                 */
                var lists = [];

                /**
                 * 
                 * @param {String} expr 
                 * @param {Object} dict 
                 */
                var convertVar = (expr, dict) => {
                    /**
                     * @type {String}
                     */
                    var tmpexpr = expr;
                    /*for (var o in dict) {
                        if (tmpexpr.indexOf(o) > -1) {
                            tmpexpr = tmpexpr.replaceAll(o, dict[o]);
                        }
                    }*/
                    return tmpexpr;
                }

                /*
                    Loop for each parts (0~5)
                  {parts:"", transform:"", axis:"", expression:""}
                  ->
                  {ikname:"", position:Vector3, rotation:Vector3}
                */
                var partsname = "";
                var expressionLabel = "";
                try {
                    for (var i = 0; i < calcdata.calclist.length; i = i + 6) {
                        partsname = calcdata.calclist[i].parts;
                        expressionLabel = `${partsname}_${calcdata.calclist[i].transform}_${calcdata.calclist[i].axis}`;
                        var position = new UnityVector3(0,0,0);
                        var rotation = new UnityVector3(0,0,0);
                        
                        var exprposx = convertVar(calcdata.calclist[i].expression, appdata.data.mathScope);
                        var exprposy = convertVar(calcdata.calclist[i+1].expression, appdata.data.mathScope);
                        var exprposz = convertVar(calcdata.calclist[i+2].expression, appdata.data.mathScope);
                        var exprrotx = convertVar(calcdata.calclist[i+3].expression, appdata.data.mathScope);
                        var exprroty = convertVar(calcdata.calclist[i+4].expression, appdata.data.mathScope);
                        var exprrotz = convertVar(calcdata.calclist[i+5].expression, appdata.data.mathScope);
    
                        position.x = math.evaluate(exprposx == "" 
                            ? expressionLabel 
                            : exprposx, appdata.data.mathScope);
    
                        expressionLabel = `${partsname}_${calcdata.calclist[i+1].transform}_${calcdata.calclist[i+1].axis}`;
                        position.y = math.evaluate(exprposy == ""
                            ? expressionLabel 
                            : exprposy, appdata.data.mathScope);
    
                        expressionLabel = `${partsname}_${calcdata.calclist[i+2].transform}_${calcdata.calclist[i+2].axis}`;
                        position.z = math.evaluate(exprposz == ""
                            ? expressionLabel 
                            : exprposz, appdata.data.mathScope);
    
                        expressionLabel = `${partsname}_${calcdata.calclist[i+3].transform}_${calcdata.calclist[i+3].axis}`;
                        rotation.x = math.evaluate(exprrotx == ""
                            ? expressionLabel 
                            : exprrotx, appdata.data.mathScope);
    
                        expressionLabel = `${partsname}_${calcdata.calclist[i+4].transform}_${calcdata.calclist[i+4].axis}`;
                        rotation.y = math.evaluate(exprroty == ""
                            ? expressionLabel 
                            : exprroty, appdata.data.mathScope);
    
                        expressionLabel = `${partsname}_${calcdata.calclist[i+5].transform}_${calcdata.calclist[i+5].axis}`;
                        rotation.z = math.evaluate(exprrotz == ""
                            ? expressionLabel 
                            : exprrotz, appdata.data.mathScope);
                        
                        lists.push({
                            ikname : partsname,
                            position,
                            rotation
                        });
                    }
                }catch(e) {
                    console.error(calcdata.name, expressionLabel, partsname);
                    console.error(e);
                    appAlert(t("msg_parts_analyzerror") + calcdata.name + ":" + partsname);
                }
                
                //---
                return lists;
            }
            /**
             * load default csv data at first.
             * @param {String} csvtext csv text data
             */
            const reloadDefaultDataForFirst = (csvtext) => {
                loadData(csvtext);
                applyDataToUI();
                appdata.elements.header.btndisable = false;
            }

            //---events--------------------------------------------------------------
            const close_onclick = () => {
                show.value = false;
                context.emit("update:model-value",show.value);
            }
            const handlePan = ({ evt, ...newInfo }) => {
                var dx = newInfo.delta.x;
                var dy = newInfo.delta.y;
                appdata.elements.win.position.x += dx;
                appdata.elements.win.position.y += dy;

                btpdlg.value.style.transform =
                    `translate(${appdata.elements.win.position.x}px, ${appdata.elements.win.position.y}px)`;
            }

            const defaultbtn_onclick = async (is_notify = true) => {
                const notify = () => {
                    Quasar.Notify.create({
                        message : t("msg_reload_easyiksample"), 
                        position : "top-right",
                        color : "info",
                        textColor : "black",
                        timeout : 1500, 
                        multiLine : true
                    });
                }
                if (appdata.data.defaultData == "") {   
                    appdata.elements.header.btndisable = true;
                    fetch(sampleUrl.value)
                    .then(res => {
                        if (res.ok) {
                            res.text().then(txt => {
                                //appdata.data.defaultData = txt;
                                loadData(txt);
                                applyDataToUI();
                                if (is_notify) notify();
                            });
                        }
                        appdata.elements.header.btndisable = false;
                    })
                    .catch(err => {
                        appdata.elements.header.btndisable = false;
                    });
                }
                
            }
            const openfile_onclick = () => {
                rfile.value.click();
            }
            const rfile_onchange = async (evt) => {
                console.log(evt);

                if (evt.target.files.length == 0) return;

                /**
                 * @type {File}
                 */
                var file = evt.target.files[0];

                var text = await file.text();

                //console.log(text);

                //---change current data
                loadData(text);
                applyDataToUI();

                rfile.value.value = "";
            }
            const apply_onclick = () => {
                const apply_body = () => {
                    var lists = [];
                    if (appdata.elements.postureBox.selected && (appdata.elements.postureBox.selected.value)) {
                        lists = analyzeCalculation(appdata.elements.postureBox.selected.value);
                        reloadMathScope(lists);
                    }
                    if (appdata.elements.eyeBox.selected && (appdata.elements.eyeBox.selected.value)) {
                        lists = analyzeCalculation(appdata.elements.eyeBox.selected.value);
                        reloadMathScope(lists);
                    }
                    
                    if (appdata.elements.armBox.selected && (appdata.elements.armBox.selected.value)) {
                        {
                            var o = appdata.elements.armBox.selected;
                            if (o.value) {
                                lists = analyzeCalculation(o.value);
                                reloadMathScope(lists);
                            }
                        }
                    }
                    if (appdata.elements.rightArmBox.selected && (appdata.elements.rightArmBox.selected.value)) {
                        {
                            var o = appdata.elements.rightArmBox.selected;
                            if (o.value) {
                                lists = analyzeCalculation(o.value);
                                reloadMathScope(lists);
                            }
                        }
                    }
                    if (appdata.elements.legBox.selected && (appdata.elements.legBox.selected.value)) {
                        {
                            var o = appdata.elements.legBox.selected;
                            if (o.value) {
                                lists = analyzeCalculation(o.value);
                                reloadMathScope(lists);
                            }
                            
                        }
                    }
                    if (appdata.elements.rightLegBox.selected && (appdata.elements.rightLegBox.selected.value)) {
                        {
                            var o = appdata.elements.rightLegBox.selected;
                            if (o.value) {
                                lists = analyzeCalculation(o.value);
                                reloadMathScope(lists);
                            }
                            
                        }
                    }
    
                    var param = JSON.stringify({
                        list : lists
                    });
                    if (avatar.value.type == AF_TARGETTYPE.VRM) {
                        AppQueue.add(new queueData(
                            {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:0},
                            "",QD_INOUT.toUNITY,
                            null
                        ));
                        AppQueue.add(new queueData(
                            {target:avatar.value.id,method:'SetIKTransformAll',param:param},
                            "",QD_INOUT.toUNITY,
                            null
                        ));
                        AppQueue.add(new queueData(
                            {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:1},
                            "",QD_INOUT.toUNITY,
                            null
                        ));                                                                        
                    }
                }

                //---decide start pose data
                if (appdata.elements.initialpose.useTPose === true) {
                    if (appdata.data.TPose) {
                        reloadMathScope(appdata.data.TPose.list);
                        apply_body();
                    }else{
                        Quasar.Notify.create({
                            message : t("msg_error_tposedata"), 
                            position : "top-right",
                            color : "info",
                            textColor : "black",
                            timeout : 1000, 
                            multiLine : true
                        });
                    }
                }else{
                    
                    AppQueue.add(new queueData(
                        {target:avatar.value.id,method:'GetIKTransformAll'},
                        "alliktransform",QD_INOUT.returnJS,
                        (val) => {
                            /**
                             * @type {AvatarAllIKParts}
                             */
                            var js = JSON.parse(val);
    
                            appdata.data.bodyList = js;
    
                            //---set scope data for math.js
                            //   {"Pelvis_pos_x" : 0.5, ...}
                            reloadMathScope(appdata.data.bodyList.list);
                            
                            apply_body();
                        }
                    ));
                    
                }
                AppQueue.start();

                
            }

            const reload_onclick = () => {
                if (!avatar.value) return;

                //---current pose data
                AppQueue.add(new queueData(
                    {target:avatar.value.id,method:'GetIKTransformAll'},
                    "alliktransform",QD_INOUT.returnJS,
                    (val) => {
                        /**
                         * @type {AvatarAllIKParts}
                         */
                        var js = JSON.parse(val);

                        appdata.data.bodyList = js;

                        //---set scope data for math.js
                        //   {"Pelvis_pos_x" : 0.5, ...}
                        reloadMathScope(appdata.data.bodyList.list);
                        
                    }
                ));
                //---default T-pose data
                AppQueue.add(new queueData(
                    {target:avatar.value.id,method:'GetTPoseIKTransformAll'},
                    "tposetransform",QD_INOUT.returnJS,
                    (val) => {
                        /**
                         * @type {AvatarAllIKParts}
                         */
                        var js = JSON.parse(val);

                        appdata.data.TPose = js;

                        //---set scope data for math.js
                        //   {"Pelvis_pos_x" : 0.5, ...}
                        //reloadMathScope(appdata.data.bodyList.list);
                        
                    }
                ));
                AppQueue.start();
            }
            const posturebox_onchange = (val) => {
                console.log(val);
                if (val.value) {
                    if (val.value.useTPose === true) {
                        appdata.elements.initialpose.useTPose = val.value.useTPose;
                    }
                }
            }
            const selclear_onclick = () => {
                appdata.elements.postureBox.selected = {label:"---",value:null};
                appdata.elements.eyeBox.selected = {label:"---",value:null};
                appdata.elements.armBox.selected = [];
                appdata.elements.legBox.selected = [];
                appdata.elements.rightArmBox.selected = [];
                appdata.elements.rightLegBox.selected = [];
            }

            return {
                show,appdata,
                close_onclick,handlePan,
                //---event-------------
                defaultbtn_onclick,openfile_onclick,apply_onclick,reload_onclick,
                rfile_onchange,
                posturebox_onchange,selclear_onclick,
                //element--------------
                btpdlg,btpdlg_bar,rfile,
                //watch----------------
                wa_modelValue,wa_show,wa_dark,wa_avatar_type,wa_locale,
                cmp_is_screen_xs,
            };
        }
    });
}