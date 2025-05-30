
import { defineSetupLang } from "./setuplang.js";
import { ChildReturner } from "./cls_childreturner.js";
import { AF_TARGETTYPE, FILEOPTION, IKBoneType } from "../res/appconst.js";


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

class BaseApp {
    constructor() {
        this.appconf = {
            set_name : "_vvie_aco",
            confs : {},
        };
        this.mainwin = {
            
        };
        this.lpID = null;
    }
}
class BaseData {
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
                options : [{label:"---",value:null,image:""}],
                selected : null
            },
            eyeBox : {
                options : [{label:"---",value:null,image:""}],
                selected : null
            },
            armBox : {
                options : [{label:"---",value:null,image:""}],
                selected : null
            },
            legBox : {
                options : [{label:"---",value:null,image:""}],
                selected : null
            },
            rightArmBox : {
                options : [{label:"---",value:null,image:""}],
                selected : null
            },
            rightLegBox : {
                options : [{label:"---",value:null,image:""}],
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

//import messages from "/static/locales";

const loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

const app = Vue.createApp({
    setup() {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });

        /**
         * @type {BaseData}
         */
        const appdata = Vue.reactive(new BaseData());
        /**
         * @type {BaseApp}
         */
        const btapp = Vue.reactive(new BaseApp());

        const avatar = Vue.ref(null);
        const sampleUrl = Vue.ref("");
        const defaultCsv = Vue.ref("");
        const uimode = Vue.ref("pc");

        const show = Vue.ref(false);
        const btpdlg_bar = Vue.ref(null);
        const btpdlg = Vue.ref(null);
        const rfile = Vue.ref(null);

        const locale = Vue.ref(loc);

        //---watch ----------------------------------------
        


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
        

        const cmp_is_screen_xs = Vue.computed(() => {
            /*if (Quasar.Screen.xs || (uimode.value == "mobile")) {
                return true;
            }else{
                return false;
            }*/
           return true;

        });
        const cmp_webelectron_path = (iconname) => {
            var locpath = "";
            if (location.pathname.indexOf("static/win/") > -1) {
                locpath = "../../img/";
            }else{
                locpath = "../../img/";
            }
            
            return locpath + iconname;
        }
        const cmp_select_eye_image = Vue.computed(() => {
            if (appdata.elements.eyeBox.selected) {
                if (appdata.elements.eyeBox.selected.image == "") {
                    return cmp_webelectron_path('vvmtrans_eyeview.png');    
                }else{
                    return appdata.elements.eyeBox.selected.image;
                }
            }else{
                return cmp_webelectron_path('vvmtrans_eyeview.png');
            }
        });
        const cmp_select_posture_image = Vue.computed(() => {
            if (appdata.elements.postureBox.selected) {
                if (appdata.elements.postureBox.selected.image == "") {
                    return cmp_webelectron_path('vvmtrans_body.png');    
                }else{
                    return appdata.elements.postureBox.selected.image;
                }
            }else{
                return cmp_webelectron_path('vvmtrans_body.png');
            }
        });
        const cmp_select_rightarm_image = Vue.computed(() => {
            if (appdata.elements.rightArmBox.selected) {
                if (appdata.elements.rightArmBox.selected.image == "") {
                    return cmp_webelectron_path('vvmtrans_rightarm.png');    
                }else{
                    return appdata.elements.rightArmBox.selected.image;
                }
            }else{
                return cmp_webelectron_path('vvmtrans_rightarm.png');
            }
        });
        const cmp_select_leftarm_image = Vue.computed(() => {
            if (appdata.elements.armBox.selected) {
                if (appdata.elements.armBox.selected.image == "") {
                    return cmp_webelectron_path('vvmtrans_leftarm.png');    
                }else{
                    return appdata.elements.armBox.selected.image;
                }
            }else{
                return cmp_webelectron_path('vvmtrans_leftarm.png');
            }
        });
        const cmp_select_rightleg_image = Vue.computed(() => {
            if (appdata.elements.rightLegBox.selected) {
                if (appdata.elements.rightLegBox.selected.image == "") {
                    return cmp_webelectron_path('vvmtrans_rightleg.png');    
                }else{
                    return appdata.elements.rightLegBox.selected.image;
                }
            }else{
                return cmp_webelectron_path('vvmtrans_rightleg.png');
            }
        });
        const cmp_select_leftleg_image = Vue.computed(() => {
            if (appdata.elements.legBox.selected) {
                if (appdata.elements.legBox.selected.image == "") {
                    return cmp_webelectron_path('vvmtrans_leftleg.png');
                }else{
                    return appdata.elements.legBox.selected.image;
                }
            }else{
                return cmp_webelectron_path('vvmtrans_leftleg.png');
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
                    for (var p = 4; p < line.length-1; p++) {
                        var partsarr = PARTS_LABEL[p-4].split("_");
                        area.calclist.push({
                            parts : partsarr[0],
                            transform : partsarr[1],
                            axis: partsarr[2],
                            expression : line[p],
                        });
                    }
                    //---last col: embedded image
                    area.image = line[line.length-1];
                    
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
            appdata.elements.postureBox.options.push({label:"---",value:null,image:""});
            for (var o of postures) {
                appdata.elements.postureBox.options.push( {
                    label: o.name,
                    value : o,
                    image: o.image,
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
            appdata.elements.eyeBox.options.push({label:"---",value:null,image:""});
            for (var o of eyeview) {
                appdata.elements.eyeBox.options.push( {
                    label: o.name,
                    value : o,
                    image: o.image,
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
            appdata.elements.armBox.options.push({label:"---",value:null,image:""});
            for (var o of arms) {
                appdata.elements.armBox.options.push( {
                    label: o.name,
                    value : o,
                    image: o.image,
                });
            }
            //---reload current select data
            if (appdata.elements.armBox.selected) {
                var ishit = appdata.elements.armBox.options.find(v => {
                    if (v.label == appdata.elements.armBox.selected.label) return true;
                    return false;
                });
                if(ishit) appdata.elements.armBox.selected.value = ishit.value;
               
                
            }
            //---right arm
            arms = appdata.data.easySelectList.arealist.filter(v => {
                if ((v.posture == 4) && ((locale.value.indexOf(v.lang) > -1) || (v.lang == ""))) return true;
                return false;
            });
            appdata.elements.rightArmBox.options.splice(0, appdata.elements.rightArmBox.options.length);
            appdata.elements.rightArmBox.options.push({label:"---",value:null,image:""});
            for (var o of arms) {
                appdata.elements.rightArmBox.options.push( {
                    label: o.name,
                    value : o,
                    image: o.image,
                });
            }
            //---reload current select data
            if (appdata.elements.rightArmBox.selected) {
                var ishit = appdata.elements.rightArmBox.options.find(v => {
                    if (v.label == appdata.elements.rightArmBox.selected.label) return true;
                    return false;
                });
                if(ishit) appdata.elements.rightArmBox.selected.value = ishit.value;
            
                
            }
            

            //---leg
            var legs = appdata.data.easySelectList.arealist.filter(v => {
                if ((v.posture == 3) && ((locale.value.indexOf(v.lang) > -1) || (v.lang == ""))) return true;
                return false;
            });
            appdata.elements.legBox.options.splice(0, appdata.elements.legBox.options.length);
            appdata.elements.legBox.options.push({label:"---",value:null,image:""});
            for (var o of legs) {
                appdata.elements.legBox.options.push( {
                    label: o.name,
                    value : o,
                    image: o.image,
                });
            }
            //---reload current select data
            if (appdata.elements.legBox.selected) {
                var ishit = appdata.elements.legBox.options.find(v => {
                    if (v.label == appdata.elements.legBox.selected.label) return true;
                    return false;
                });
                if (ishit) appdata.elements.legBox.selected.value = ishit.value;
            
                
            }
            //---right leg
            legs = appdata.data.easySelectList.arealist.filter(v => {
                if ((v.posture == 5) && ((locale.value.indexOf(v.lang) > -1) || (v.lang == ""))) return true;
                return false;
            });
            appdata.elements.rightLegBox.options.splice(0, appdata.elements.rightLegBox.options.length);
            appdata.elements.rightLegBox.options.push({label:"---",value:null,image:""});
            for (var o of legs) {
                appdata.elements.rightLegBox.options.push( {
                    label: o.name,
                    value : o,
                    image: o.image,
                });
            }
            //---reload current select data
            if (appdata.elements.rightLegBox.selected) {
                var ishit = appdata.elements.rightLegBox.options.find(v => {
                    if (v.label == appdata.elements.rightLegBox.selected.label) return true;
                    return false;
                });
                if (ishit) appdata.elements.rightLegBox.selected.value = ishit.value;
            
                
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


        const defaultbtn_onclick = async (is_notify = true) => {
            const notify = () => {
                Quasar.Notify.create({
                    message : _T("msg_reload_easyiksample"), 
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
                /*
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
                */

                var js = new ChildReturner();
                js.origin = location.origin;
                js.windowName = "easyik";
                js.funcName = "easyik_apply_apply";
                js.data = JSON.stringify({
                    avatarId : avatar.value.id,
                    param: param
                });
                opener.postMessage(js);
            }
        }
        const apply_onclick = () => {
            

            //---decide start pose data
            if (appdata.elements.initialpose.useTPose === true) {
                if (appdata.data.TPose) {
                    reloadMathScope(appdata.data.TPose.list);
                    apply_body();
                }else{
                    Quasar.Notify.create({
                        message : _T("msg_error_tposedata"), 
                        position : "top-right",
                        color : "info",
                        textColor : "black",
                        timeout : 1000, 
                        multiLine : true
                    });
                }
                
            }else{
                var js = new ChildReturner();
                js.origin = location.origin;
                js.windowName = "easyik";
                js.funcName = "easyik_apply_curpose";
                js.data = JSON.stringify({
                    avatarId : avatar.value.id,
                });
                opener.postMessage(js);

                /*
                AppQueue.add(new queueData(
                    {target:avatar.value.id,method:'GetIKTransformAll'},
                    "alliktransform",QD_INOUT.returnJS,
                    (val) => {
                        //
                        // @type {AvatarAllIKParts}
                        //
                        var js = JSON.parse(val);

                        appdata.data.bodyList = js;

                        //---set scope data for math.js
                        //   {"Pelvis_pos_x" : 0.5, ...}
                        reloadMathScope(appdata.data.bodyList.list);
                        
                        apply_body();
                    }
                ));*/
                
            }
            //AppQueue.start();
            

            
        }

        const reload_onclick = () => {
            if (!avatar.value) return;

            //---current pose data
            /*
            AppQueue.add(new queueData(
                {target:avatar.value.id,method:'GetIKTransformAll'},
                "alliktransform",QD_INOUT.returnJS,
                (val) => {
                    //
                    // @type {AvatarAllIKParts}
                    //
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
                    //
                    // @type {AvatarAllIKParts}
                    //
                    var js = JSON.parse(val);

                    appdata.data.TPose = js;

                    //---set scope data for math.js
                    //   {"Pelvis_pos_x" : 0.5, ...}
                    //reloadMathScope(appdata.data.bodyList.list);
                    
                }
            ));
            AppQueue.start();
            */
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "easyik";
            js.funcName = "easyik_reload_onclick";
            js.data = JSON.stringify({
                avatarId : avatar.value.id,
            });
            opener.postMessage(js);
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
            appdata.elements.postureBox.selected = appdata.elements.postureBox.options[0];
            appdata.elements.eyeBox.selected = appdata.elements.eyeBox.options[0];
            appdata.elements.armBox.selected = appdata.elements.armBox.options[0];
            appdata.elements.legBox.selected = appdata.elements.legBox.options[0];
            appdata.elements.rightArmBox.selected = appdata.elements.rightArmBox.options[0];
            appdata.elements.rightLegBox.selected = appdata.elements.rightLegBox.options[0];
    }
        const selrandom_onclick = () => {
            const getRandomInt = (min, max) => {
                min = Math.ceil(min)
                max = Math.floor(max)
                return Math.floor(Math.random() * (max - min + 1) + min)
            }
            //---posture
            var sel = getRandomInt(1,appdata.elements.postureBox.options.length-1);
            appdata.elements.postureBox.selected = appdata.elements.postureBox.options[sel];
            //---eyeview
            var sel = getRandomInt(1,appdata.elements.eyeBox.options.length-1);
            appdata.elements.eyeBox.selected = appdata.elements.eyeBox.options[sel];

            //---right arm
            var sel = getRandomInt(1,appdata.elements.rightArmBox.options.length-1);
            appdata.elements.rightArmBox.selected = appdata.elements.rightArmBox.options[sel];
            //---left arm
            var sel = getRandomInt(1,appdata.elements.armBox.options.length-1);
            appdata.elements.armBox.selected = appdata.elements.armBox.options[sel];

            //---right leg
            var sel = getRandomInt(1,appdata.elements.rightLegBox.options.length-1);
            appdata.elements.rightLegBox.selected = appdata.elements.rightLegBox.options[sel];
            //---left leg
            var sel = getRandomInt(1,appdata.elements.legBox.options.length-1);
            appdata.elements.legBox.selected = appdata.elements.legBox.options[sel];
        }


        const loadAvatarInfo = (is_csv = true) => {
            AppDB.temp.getItem("easyik_avatar")
            .then(val => {
                if (val) avatar.value = val;

                AppDB.temp.removeItem("easyik_avatar");
            });
            AppDB.temp.getItem("easyik_sampleurl")
            .then(val => {
                if (val) sampleUrl.value = val;

                AppDB.temp.removeItem("easyik_sampleurl");
            });
            if (is_csv) {
                AppDB.temp.getItem("easyik_defaultcsv")
                .then(val => {
                    if (val != null) {
                        defaultCsv.value = val;
                        reloadDefaultDataForFirst(defaultCsv.value);
                        reload_onclick();
                    }
                    AppDB.temp.removeItem("easyik_defaultcsv");
                });
            }            
        }

        //===lifecycle=================================================================
        Vue.onBeforeMount(() => {
            var darktheme = sessionStorage.getItem("UseDarkTheme");
            if (darktheme) {
                if (darktheme == "1") {
                    Quasar.Dark.set(true);
                }else{
                    Quasar.Dark.set(false);
                }
            }
            var qloc = [
                loc.replace("-",""),    //en-US -> enUS
                loc.split("-")[0]       //en-US -> en
            ];
            var qlang = Quasar.lang[qloc[0]] || Quasar.lang[qloc[1]];
            if (qlang) {
                Quasar.lang.set(qlang);
            }else{
                Quasar.lang.set(Quasar.lang.enUS);
            }
            loadAvatarInfo();
        });
        Vue.onMounted(() => {
            btapp.lpID = setInterval(async () => {
                var call_easyikvalue = await AppDB.temp.getItem("easyik_return_allikparts");
                if (call_easyikvalue) {
                    var js = call_easyikvalue;
                    if (js) {
                        appdata.data.bodyList = js;
                        reloadMathScope(appdata.data.bodyList.list);
                        apply_body();                        
                    }

                    AppDB.temp.removeItem("easyik_return_allikparts");
                }
                var tmp1 = await AppDB.temp.getItem("easyik_return_reloadikparts");
                if (tmp1) {
                    var js = tmp1;
                    if (js) {
                        appdata.data.bodyList = js;

                        //---set scope data for math.js
                        //   {"Pelvis_pos_x" : 0.5, ...}
                        reloadMathScope(appdata.data.bodyList.list);                   
                    }

                    AppDB.temp.removeItem("easyik_return_reloadikparts");
                }
                var tmp2 = await AppDB.temp.getItem("easyik_return_reload_tposeikparts");
                if (tmp2) {
                    var js = tmp2;
                    if (js) {
                        appdata.data.TPose = js;
                    }

                    AppDB.temp.removeItem("easyik_return_reload_tposeikparts");
                }
                loadAvatarInfo(false);
            },200);

            window.addEventListener("unload",(evt)=>{
                clearInterval(btapp.lpID);
            });
        });
        Vue.onBeforeUnmount(() => {
            
        });

        return {
            show,appdata,btapp,
            apply_body,
            //---event-------------
            defaultbtn_onclick,openfile_onclick,apply_onclick,reload_onclick,
            rfile_onchange,
            posturebox_onchange,selclear_onclick,selrandom_onclick,
            //element--------------
            btpdlg,btpdlg_bar,rfile,
            //watch----------------
            wa_dark,wa_avatar_type,
            cmp_is_screen_xs,
            cmp_webelectron_path,
            cmp_select_eye_image,cmp_select_posture_image,
            cmp_select_rightarm_image,cmp_select_leftarm_image,
            cmp_select_rightleg_image,cmp_select_leftleg_image,
        };
    }
});


const i18n = VueI18n.createI18n({
    legacy : false,
    locale : loc,
    //messages
});
app.use(Quasar, {
    config: {
        /*
        brand: {
        // primary: '#e46262',
        // ... or all other brand colors
        },
        notify: {...}, // default set of options for Notify Quasar plugin
        loading: {...}, // default set of options for Loading Quasar plugin
        loadingBar: { ... }, // settings for LoadingBar Quasar plugin
        // ..and many more (check Installation card on each Quasar component/directive/plugin)
        */
    }
})

defineSetupLang(Quasar);


app.use(i18n);
//---Start app
app.mount('#q-app');
