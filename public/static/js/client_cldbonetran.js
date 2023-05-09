
import { defineSetupLang } from "./setuplang.js";
import { ChildReturner } from "./cls_childreturner.js";
import { AF_TARGETTYPE, FILEOPTION, IKBoneType } from "../res/appconst.js";
import { VFileHelper, VFileOptions } from "./filehelper.js";

class UnityVector3 {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor (x, y, z) {
        if (typeof(x) == "number") {
            this.x = x ? x : 0;
            this.y = y ? y : 0;
            this.z = z ? z : 0;
        }else{
            var vec = x;
            this.x = "x" in vec ? vec.x : 0;
            this.y = "y" in vec ? vec.y : 0;
            this.z = "z" in vec ? vec.z : 0;    
        }
    }
}

//import messages from "/static/locales";

const loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

const app = Vue.createApp({
    setup() {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });

        const btapp = Vue.ref({
            header : {
                show : true,
                url : null,
                btndisable : false
            },
            appconf : {
                set_name : "_vvie_aco",
                confs : {},
            },
            mainwin : {
                avatar : {
                    id : "",
                    title : "",
                    type : "",
                }
            },
            lpID : null
            
        });
        const data = Vue.ref({
            elements : {
                win : {
                    styles : {
                        position : "absolute",
                        bottom : "-9999px",
                        right : "-9999px",
                        width : "865px",
                        height : "500px",
                        zIndex : 5000,
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
                spreadsheet : null,
                sprPanelCSS : {
                    forVRM : {
                        "spr-panel-top" : true,
                        "spr-panel-back" : false
                    },
                    forOther : {
                        "spr-panel-top" : false,
                        "spr-panel-back" : true
                    }
                }
            }
        });
        const show = Vue.ref(false);
        const btpdlg_bar = Vue.ref(null);
        const spr = Vue.ref(null);

        //---computed--------------------------------------
        const chk_objtype = Vue.computed(() => {
            if (btapp.value.mainwin.avatar.type == AF_TARGETTYPE.VRM) {
                return true;
            }else{
                return false;
            }
        });
        //---watch ----------------------------------------
        const wa_avatar_type = Vue.watch(() => btapp.value.mainwin.avatar.type,(newval,oldval) => {
            if (newval != oldval) {
                if (newval == AF_TARGETTYPE.VRM) {
                    data.value.elements.sprPanelCSS.forVRM["spr-panel-top"] = true;
                    data.value.elements.sprPanelCSS.forVRM["spr-panel-back"] = false;
                    data.value.elements.sprPanelCSS.forOther["spr-panel-top"] = false;
                    data.value.elements.sprPanelCSS.forOther["spr-panel-back"] = true;
                }else{
                    data.value.elements.sprPanelCSS.forVRM["spr-panel-top"] = false;
                    data.value.elements.sprPanelCSS.forVRM["spr-panel-back"] = true;
                    data.value.elements.sprPanelCSS.forOther["spr-panel-top"] = true;
                    data.value.elements.sprPanelCSS.forOther["spr-panel-back"] = false;
                }
                
            }
        })
        const reload_func = (js) => {
            //var js = JSON.parse(val);
            const floatDown = (v,multiply) => {
                return Math.ceil(v * multiply) / multiply;
            }

            for (var i = 0; i < js.list.length; i++) {
                data.value.elements.spreadsheet.setValueFromCoords(
                    1, i,
                    floatDown(js.list[i].position.x,10000)
                );
                data.value.elements.spreadsheet.setValueFromCoords(
                    2, i,
                    floatDown(js.list[i].position.y,10000)
                );
                data.value.elements.spreadsheet.setValueFromCoords(
                    3, i,
                    floatDown(js.list[i].position.z,10000)
                );
                data.value.elements.spreadsheet.setValueFromCoords(
                    4, i,
                    js.list[i].rotation.x
                );
                data.value.elements.spreadsheet.setValueFromCoords(
                    5, i,
                    js.list[i].rotation.y
                );
                data.value.elements.spreadsheet.setValueFromCoords(
                    6, i,
                    js.list[i].rotation.z
                );
            }
        }
        const reload_onclick = () => {
            if (btapp.value.mainwin.avatar.id == "") return;

            /*AppQueue.add(new queueData(
                {target:btapp.value.mainwin.avatar.id,method:'GetIKTransformAll'},
                "alliktransform",QD_INOUT.returnJS,
                (val) => {
                    reload_func();
                }
            ));
            AppQueue.start();*/

            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "bonetransform";
            js.funcName = "call_getikvalue";
            js.data = JSON.stringify({
                avatarId : btapp.value.mainwin.avatar.id,
            });
            opener.postMessage(js);
        }
        const apply_onclick = () => {
            var ldata = data.value.elements.spreadsheet.getData();
            var lists = [];
            for (var i = 0; i < ldata.length; i++) {
                var ln = ldata[i];
                lists.push({
                    ikname : ln[0],
                    position : new UnityVector3(parseFloat(ln[1]),parseFloat(ln[2]),parseFloat(ln[3])),
                    rotation : new UnityVector3(parseFloat(ln[4]),parseFloat(ln[5]),parseFloat(ln[6]))
                });
            }
            var param = JSON.stringify({
                list : lists
            });
            /*
            if (btapp.value.mainwin.avatar.type == AF_TARGETTYPE.VRM) {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:0},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.add(new queueData(
                    {target:btapp.value.mainwin.avatar.id,method:'SetIKTransformAll',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:1},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            }
            */
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "bonetransform";
            js.funcName = "apply_pose";
            js.data = JSON.stringify({
                avatarId : btapp.value.mainwin.avatar.id,
                list : lists
            });
            opener.postMessage(js);
        }
        const mirrorpose_onclick = () => {
            var sdata = data.value.elements.spreadsheet.getData();
            var posx = 1; var posy = 2; var posz = 3; var rotx = 4; var roty = 5; var rotz = 6;

            const setCell = (x, y, val) => {
                data.value.elements.spreadsheet.setValueFromCoords(x, y, val);
            }
            const mirrorLR = (tleft, tright) => {
                setCell(posx, tleft, sdata[tright][posx] * -1);
                setCell(posy, tleft, sdata[tright][posy]);
                setCell(posz, tleft, sdata[tright][posz]);
                setCell(rotx, tleft, sdata[tright][rotx]);
                setCell(roty, tleft, sdata[tright][roty] * -1);
                setCell(rotz, tleft, sdata[tright][rotz] * -1);
            }
            
            //---EyeviewHandle
            //setCell(posx, IKBoneType.EyeViewHandle, sdata[1][posx] * -1);
            mirrorLR(IKBoneType.EyeViewHandle, IKBoneType.EyeViewHandle);
            
            //---Head
            //setCell(posx, IKBoneType.Head, sdata[2][posx] * -1);
            mirrorLR(IKBoneType.Head, IKBoneType.Head);
    
            //---LookAt
            //setCell(posx, IKBoneType.LookAt, sdata[3][posx] * -1);
            mirrorLR(IKBoneType.LookAt, IKBoneType.LookAt);
    
            //---Aim
            //setCell(posx, IKBoneType.Aim, sdata[4][posx] * -1);
            mirrorLR(IKBoneType.Aim, IKBoneType.Aim);
    
            //---Chest
            //setCell(posx, IKBoneType.Chest, sdata[5][posx] * -1);
            mirrorLR(IKBoneType.Chest, IKBoneType.Chest);
    
            //---Pelvis
            //setCell(posx, IKBoneType.Pelvis, sdata[6][posx] * -1);
            mirrorLR(IKBoneType.Pelvis, IKBoneType.Pelvis);

            //---Right Shouloder from Left
            mirrorLR(IKBoneType.LeftShoulder, IKBoneType.RightShoulder);

            //---Right Lower Arm from Left
            mirrorLR(IKBoneType.LeftLowerArm, IKBoneType.RightLowerArm);
    
            //---Right Hand from Left
            mirrorLR(IKBoneType.LeftHand, IKBoneType.RightHand);
    
            //---Left Shouloder from Right
            mirrorLR(IKBoneType.RightShoulder, IKBoneType.LeftShoulder);

            //---Left Lower Arm from Right
            mirrorLR(IKBoneType.RightLowerArm, IKBoneType.LeftLowerArm);
    
            //---Left Hand from Right
            mirrorLR(IKBoneType.RightHand, IKBoneType.LeftHand);
    
            //---------------------------------------------------------
            //---Left Lower Leg from Right
            mirrorLR(IKBoneType.LeftLowerLeg, IKBoneType.RightLowerLeg);
    
            //---Left Foot from Right
            mirrorLR(IKBoneType.LeftLeg, IKBoneType.RightLeg);
    
            //---Right Lower Leg from Right
            mirrorLR(IKBoneType.RightLowerLeg, IKBoneType.LeftLowerLeg);
    
            //---Right Foot from Right
            mirrorLR(IKBoneType.RightLeg, IKBoneType.LeftLeg);
        }

        //----------------------------------
        const loadSetting = () => {
            /*
            var textdata = localStorage.getItem(poseapp.value.appconf.set_name);
            if (textdata) {
                var tmp = JSON.parse(textdata);
                poseapp.value.appconf.confs = tmp;
            }
            */
        }
        const loadAvatarInfo = () => {
            AppDB.temp.getItem("bonetran_avatar_id")
            .then(val => {
                if (val) btapp.value.mainwin.avatar.id = val;

                AppDB.temp.removeItem("bonetran_avatar_id");
            });
            AppDB.temp.getItem("bonetran_avatar_title")
            .then(val => {
                if (val) btapp.value.mainwin.avatar.title = val;

                AppDB.temp.removeItem("bonetran_avatar_title");
            });
            AppDB.temp.getItem("bonetran_avatar_type")
            .then(val => {
                if (val != null) {
                    btapp.value.mainwin.avatar.type = val;
                    btapp.value.header.btndisable = (val != AF_TARGETTYPE.VRM);
                        
                }

                AppDB.temp.removeItem("bonetran_avatar_type");
            });

        }


        //----------------------------------        
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
            //---spreadsheet
            var bonedata = [];
            for (var obj in IKBoneType) {
                if ((IKBoneType[obj] >= IKBoneType.IKParent) && (IKBoneType[obj] <= IKBoneType.RightLeg)) {
                    bonedata.push([obj,0,0,0,0,0,0]);
                }
            }
            data.value.elements.spreadsheet = jspreadsheet(spr.value, {
                width : "100%",
                height : "100%",
                data: bonedata,
                columns: [
                    { type: 'text', title: 'Name', width: 200, readOnly : true },
                    { type: 'number', title: 'Position X', width: 100, align : "right" },
                    { type: 'number', title: 'Position Y', width: 100, align : "right" },
                    { type: 'number', title: 'Position Z', width: 100, align : "right"  },
                    { type: 'number', title: 'Rotation X', width: 100, align : "right" },
                    { type: 'number', title: 'Rotation Y', width: 100, align : "right" },
                    { type: 'number', title: 'Rotation Z', width: 100, align : "right"  },
        
                ],
                /**
                 * 
                 * @param {DOMElement} el 
                 * @param {DOMElement} cell 
                 * @param {Number} ox 
                 * @param {Number} oy 
                 * @param {Object} newValue 
                 * @param {Object} oldValue
                 */
                 onbeforechange: ( el,  cell,  ox,  oy, newValue, oldValue) => {
                    
                    if (isNaN(parseFloat(newValue))) {
                        newValue = data.value.elements.spreadsheet.getValueFromCoords(ox,oy);
                    }
                    return newValue;
                },
                onbeforeinsertrow : (el, rowNumber, numOfRows, insertBefore) => {
                    return false;
                },
                onbeforedeleterow( el,  rowNumber,  numOfRows) {
                    return false;
                }
            });

            //loadData();
            loadSetting();

            btapp.value.lpID = setInterval(async () => {
                var call_getikvalue = await AppDB.temp.getItem("btapp_call_getikvalue");
                if (call_getikvalue) {
                    var js = call_getikvalue;
                    if (js.data) reload_func(js.data);

                    AppDB.temp.removeItem("btapp_call_getikvalue");
                }
                loadAvatarInfo();
            },200);

            window.addEventListener("unload",(evt)=>{
                clearInterval(btapp.value.lpID);
            });
        });

        return {
            btapp, data,
            //---event---
            reload_func,
            reload_onclick,apply_onclick,mirrorpose_onclick,
            //element--------------
            btpdlg_bar,spr,
            //computed-------------
            chk_objtype,
            //watch----------------
            wa_avatar_type,
            //---other method---
            loadSetting,loadAvatarInfo
        };
    }
});


const i18n = VueI18n.createI18n({
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
