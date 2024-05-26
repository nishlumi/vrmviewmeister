
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

        const grapp = Vue.ref({
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
                        width : "870px",
                        height : "500px",
                        zIndex : 5001,
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
        const gbdlg_bar = Vue.ref(null);
        const gbdlg = Vue.ref(null);
        const gspr = Vue.ref(null);

        //---computed--------------------------------------
        const chk_objtype = Vue.computed(() => {
            if (grapp.value.mainwin.avatar.type == AF_TARGETTYPE.VRM) {
                return true;
            }else{
                return false;
            }
        });
        //---watch ----------------------------------------
        const wa_avatar_type = Vue.watch(() => grapp.value.mainwin.avatar.type,(newval,oldval) => {
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
        });

        /*const wa_show = Vue.watch(() => show.value, (newval) => {
            reload_onclick();
        });
        const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
            data.value.elements.panelCSS["q-dark"] = newval;
            data.value.elements.panelCSS["text-dark"] = !newval;
        });

        const close_onclick = () => {
            show.value = false;
            context.emit("update:model-value",show.value);
        }*/
        const reload_func = (js) => {
            var arr = [];
            js.list.forEach(item => {
                var newname = item.rootBoneName;
                var hjpos = newname.indexOf("HairJoint");
                newname = newname.substr(hjpos < 0 ? 0 : hjpos,newname.length);

                arr.push([
                    item.comment,
                    item.rootBoneName,
                    newname,
                    item.power,
                    item.dir.x,item.dir.y,item.dir.z
                ]);
            });
            
            data.value.elements.spreadsheet.setData(arr);
        }
        const reload_onclick = () => {
            if (!avatar.value) return;

            /*
            AppQueue.add(new queueData(
                {target:avatar.value.id,method:'ListGravityInfoFromOuter'},
                "list_gravitybone",QD_INOUT.returnJS,
                (val) => {
                    var js = JSON.parse(val);
                    var arr = [];
                    js.list.forEach(item => {
                        var newname = item.rootBoneName;
                        var hjpos = newname.indexOf("HairJoint");
                        newname = newname.substr(hjpos < 0 ? 0 : hjpos,newname.length);

                        arr.push([
                            item.comment,
                            item.rootBoneName,
                            newname,
                            item.power,
                            item.dir.x,item.dir.y,item.dir.z
                        ]);
                    });
                    
                    data.value.elements.spreadsheet.setData(arr);
                }
            ));
            AppQueue.start();
            */

            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "gravitybone";
            js.funcName = "reload_onclick";
            js.data = JSON.stringify({
                avatarId: grapp.value.mainwin.avatar.id,
            });
            opener.postMessage(js);
        }
        const apply_onclick = () => {
            /*
            var data = data.value.elements.spreadsheet.getData();
            var lists = [];
            for (var i = 0; i < data.length; i++) {
                var ln = data[i];
                var param_power = `${ln[0]},${ln[1]},${parseFloat(ln[3])}`;
                var param_dir   = `${ln[0]},${ln[1]},${parseFloat(ln[4])},${parseFloat(ln[5])},${parseFloat(ln[6])}`;
                AppQueue.add(new queueData(
                    {target:avatar.id,method:'SetGravityDirFromOuter',param:param_dir},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.add(new queueData(
                    {target:avatar.id,method:'SetGravityPower',param:param_power},
                    "",QD_INOUT.toUNITY,
                    null
                ));
            }
            AppQueue.start();
            */
        }
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
            AppDB.temp.getItem("grapp_avatar_id")
            .then(val => {
                if (val) grapp.value.mainwin.avatar.id = val;

                AppDB.temp.removeItem("grapp_avatar_id");
            });
            AppDB.temp.getItem("grapp_avatar_title")
            .then(val => {
                if (val) grapp.value.mainwin.avatar.title = val;

                AppDB.temp.removeItem("grapp_avatar_title");
            });
            AppDB.temp.getItem("grapp_avatar_type")
            .then(val => {
                if (val != null) {
                    grapp.value.mainwin.avatar.type = val;
                    grapp.value.header.btndisable = (val != AF_TARGETTYPE.VRM);
                        
                }

                AppDB.temp.removeItem("grapp_avatar_type");
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
            data.value.elements.spreadsheet = jspreadsheet(gspr.value, {
                width : "100%",
                height : "100%",
                data: null,
                freezeColumns : 2,
                columns: [
                    { type: 'text', title: 'Comment', width: 150, align : "left", readOnly : true },
                    { type: 'hidden', title: 'Bone key', width: 0, readOnly : true },
                    { type: 'text', title: 'Root bone name', width: 250, align : "left", readOnly : true },
                    { type: 'number', title: 'Power', width: 100, align : "right" },
                    { type: 'number', title: 'Direction X', width: 100, align : "right" },
                    { type: 'number', title: 'Direction Y', width: 100, align : "right" },
                    { type: 'number', title: 'Direction Z', width: 100, align : "right"  },
        
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
                },
                onchange : (el,  cell,  ox,  oy, newValue, oldValue) => {
                    //console.log(cell, ox, oy, newValue);
                },
                onafterchanges : (el, records) => {
                    //console.log(records);
                    var list_power = [];
                    var list_dir = [];

                    for (var i = 0; i < records.length; i++) {
                        var x = parseInt(records[i].x);
                        var y = parseInt(records[i].y);
                        var newval = parseFloat(records[i].newValue);
                        var comment = data.value.elements.spreadsheet.getValueFromCoords(0,y);
                        var rootBoneName = data.value.elements.spreadsheet.getValueFromCoords(1,y);
                        if (x == 3) {
                            var param_power = `${comment},${rootBoneName},${newval}`;
                            /*AppQueue.add(new queueData(
                                {target:avatar.value.id,method:'SetGravityPower',param:param_power},
                                "",QD_INOUT.toUNITY,
                                null
                            ));*/
                            list_power.push(param_power);
                        }else if ((4 <= x) && (x <= 6)) {
                            var ox = data.value.elements.spreadsheet.getValueFromCoords(4,y);
                            var oy = data.value.elements.spreadsheet.getValueFromCoords(5,y);
                            var oz = data.value.elements.spreadsheet.getValueFromCoords(6,y);
                            var param_dir = `${comment},${rootBoneName},${ox},${oy},${oz}`;
                            /*AppQueue.add(new queueData(
                                {target:avatar.value.id,method:'SetGravityDirFromOuter',param:param_dir},
                                "",QD_INOUT.toUNITY,
                                null
                            ));*/
                            list_dir.push(param_dir);
                        }
                    }
                    //AppQueue.start();

                    var js = new ChildReturner();
                    js.origin = location.origin;
                    js.windowName = "gravitybone";
                    js.funcName = "on_afterchange";
                    js.data = JSON.stringify({
                        avatarId: grapp.value.mainwin.avatar.id,
                        powerlist : list_power,
                        dirlist : list_dir
                    });
                    opener.postMessage(js);
                }
            });

            loadSetting();

            grapp.value.lpID = setInterval(async () => {
                var call_grapp_list_gravitybone = await AppDB.temp.getItem("grapp_list_gravitybone");
                if (call_grapp_list_gravitybone) {
                    var js = call_grapp_list_gravitybone;
                    if (js) reload_func(js);

                    AppDB.temp.removeItem("grapp_list_gravitybone");
                }
                loadAvatarInfo();
            },200);

            window.addEventListener("unload",(evt)=>{
                clearInterval(grapp.value.lpID);
            });

        });


        return {
            show,grapp,data,
            //close_onclick,
            reload_onclick,
            //apply_onclick,
            loadSetting,loadAvatarInfo,
            //element--------------
            gbdlg,gbdlg_bar,gspr,
            //computed-------------
            chk_objtype,
            //watch----------------
            //wa_modelValue,wa_show,wa_dark,
            wa_avatar_type
        }
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
