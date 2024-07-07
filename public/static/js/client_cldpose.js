import { defineSetupLang } from "./setuplang.js";
import { ChildReturner } from "./cls_childreturner.js";
import { VFileHelper,VFileOptions } from "./filehelper.js";
import { SAMPLEURL, SAMPLEKEY } from "../res/appconst.js";

//import messages from "/static/locales";

var loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

const app = Vue.createApp({
    setup() {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });

        var cns_list_origin = [
            {label:t("Internal Storage"),value:"mystorage"},
        ];
        const poseapp = Vue.ref({
            header : {
                show : true,
                loading : false,
                download : "pose.json",
                url : null,
                list_origin : cns_list_origin,
                list_selected : cns_list_origin[0],
            },
            appconf : {
                set_name : "_vvie_aco",
                /**
                 * @type {VVConfigTemplate}
                 */
                confs : {},
            },
            search_str: "",
            list : {
                options : [],
                selected : null,
                tbl : {
                    columns : [
                        {name:"frameCount",label:t("framecount"), field:"frameCount"},
                        {name:"startFrame",label:t("target_begin_frame"), field:"startFrame"},
                        {name:"endFrame",label:t("target_end_frame"), field:"endFrame"},
                    ]
                }
            },
            states : {
                item_mode : "pose", //pose, motion
            },
            constant : {
                poseurl : "1cJkuegzP0FBVJ0XE4uyhu4qF32WZAME7",
                motionurl : "11Atv_WPyrh892VKZL7o0ZZgulvFQ1ECq"
            }
        });
        const fileoption = {
            POSE: {
                types: [
                    {
                        description : "VVM pose file",
                        accept : {"application/json": [".vvmpose",".json"]}
                    }
                ]
            },
            MOTION : {
                types: [
                    {
                        description : "VVM motion file",
                        accept : {"application/json": [".vvmmot",".json"]}
                    }
                ]
            }
            
        };

        const loadData = () => {
            poseapp.value.header.loading = true;
            poseapp.value.list.options.splice(0, poseapp.value.list.options.length);
            if (poseapp.value.states.item_mode == "pose") {
                AppDB.pose.iterate((value,key,index)=>{
                    poseapp.value.list.options.push({
                        thumbnail : value.thumbnail,
                        name : key,
                        bodyinfo : value.frameData.bodyHeight,
                        sample : value.sampleavatar,
                        visibility : true,
                        styleclass : {
                            "list-item-selected" : false
                        },
                        data : value
                    });
                }).then(()=>{
                    //console.log(opener._REFMYAPP.states.selectedAvatar);
                    poseapp.value.header.loading = false;
                });
            }else if (poseapp.value.states.item_mode == "motion") {
                AppDB.motion.iterate((value,key,index)=>{
                    poseapp.value.list.options.push({
                        name: key,
                        type: value.targetType,
                        version : value.version,
                        height : Math.round(value.bodyHeight[1] * 1000) / 1000,
                        
                        frameCount : value.frames.length,
                        startFrame : value.frames[0].index,
                        endFrame : value.frames[value.frames.length-1].index,
                          
                        visibility : true,
                        styleclass : {
                            "list-item-selected" : false
                        },
                        data: value
                    });
                }).then(()=>{
                    poseapp.value.header.loading = false;
                });
            }
            
        }
        const loadSetting = () => {
            var textdata = localStorage.getItem(poseapp.value.appconf.set_name);
            if (textdata) {
                var tmp = JSON.parse(textdata);
                poseapp.value.appconf.confs = tmp;
            }
        }
        //---event---------------------------------------------
        const refresh_onclick = () => {
            listorigin_onchange(poseapp.value.header.list_selected);
        }
        const apply_onclick = () => {
            if (poseapp.value.list.selected) {
                
                //opener._REFMYAPP.returnPoseDialogValue(sel.data);
                var js = new ChildReturner();
                js.origin = location.origin;
                js.windowName = "pose";
                if (poseapp.value.states.item_mode == "pose") {
                    js.funcName = "apply_pose";
                }else if (poseapp.value.states.item_mode == "motion") {
                    js.funcName = "apply_motion";
                }
                
                js.data = JSON.stringify(poseapp.value.list.selected.data);
                opener.postMessage(js);
                
            }
        }
        const delete_onclick = () => {
            if (poseapp.value.states.item_mode == "pose") {
                appConfirm(_T("msg_pose_delconfirm"),()=>{
                    if (poseapp.value.list.selected) {
                        AppDB.pose.removeItem(poseapp.value.list.selected.name).then(result=>{
                            refresh_onclick();
                        });
                    }
                });
            }else if (poseapp.value.states.item_mode == "motion") {
                appConfirm(_T("msg_motion_delconfirm"),()=>{
                    if (poseapp.value.list.selected) {
                        AppDB.motion.removeItem(poseapp.value.list.selected.name).then(result=>{
                            refresh_onclick();
                        });
                    }
                });
            }
        }
        const download_onclick = async () => {
            if (poseapp.value.list.selected) {
                var opt = new VFileOptions();
                
                if (poseapp.value.states.item_mode == "pose") {
                    opt.types = fileoption.POSE.types;
                    opt.suggestedName = poseapp.value.list.selected.name + (poseapp.value.list.selected.name.toLowerCase().indexOf(".vvmpose") > 0? "" : ".vvmpose");
                }else if (poseapp.value.states.item_mode == "motion") {
                    opt.types = fileoption.MOTION.types;
                    opt.suggestedName = poseapp.value.list.selected.name + (poseapp.value.list.selected.name.toLowerCase().indexOf(".vvmmot") > 0 ? "" : ".vvmmot");
                }
                

                var content = null;
                var useHTMLSaving = false;

                //---for security
                const tmpjs = JSON.original(poseapp.value.list.selected.data);
                //tmpjs.thumbnail = "";

                if (VFileHelper.checkNativeAPI) {
                    content = JSON.stringify(tmpjs);

                    VFileHelper.saveUsingDialog(
                        content,
                        opt,
                        useHTMLSaving
                    );
                }else{
                    /*var bb = new Blob([JSON.stringify(poseapp.value.list.selected.data)], { type: "application/json" });
                    if (poseapp.value.header.url) window.URL.revokeObjectURL(poseapp.value.header.url);
    
                    poseapp.value.header.url = window.URL.createObjectURL(bb);
                    content = poseapp.value.header.url;
                    */
                    var tmpcontent = JSON.stringify(tmpjs);

                    var acckey = "";
                    var accval = "";
                    for (var obj in opt.types[0].accept) {
                        acckey = obj;
                        accval = opt.types[0].accept[obj];
                        break;
                    }
                    content = new Blob([tmpcontent], {type : acckey});
                    var burl = URL.createObjectURL(content);

                    var ret = await VFileHelper.saveUsingDialog(
                        burl,
                        opt,
                        useHTMLSaving
                    );
                    if (ret.cd == 0) {

                    }else{

                    }
                    URL.revokeObjectURL(burl);
                
                }
                
                
            }
        }
        const upload_onclick = async () => {
            //fl_openpose.value.click();
            var lfileoption = null;
            if (poseapp.value.states.item_mode == "pose") lfileoption = fileoption.POSE;
            if (poseapp.value.states.item_mode == "motion") lfileoption = fileoption.MOTION;


            VFileHelper.openFromDialog(lfileoption, 0, async (files,cd,err)=>{
                if (files) {
                    var data = null;
                    if (files[0].data instanceof File) {
                        data = await files[0].data.text();
                    }else{
                        data = files[0].data;
                    }
                    if (data) {
                        var js = JSON.parse(data);
                        if (poseapp.value.states.item_mode == "pose") {
                            if ((!js) || 
                                !("frameData" in js)
                            ) {
                                appAlert(_T("msg_pose_erroropen"));
                                return;
                            }
                            //---for security
                            if ("thumbnail" in js) js.thumbnail = ""
                            else js["thumbnail"] = "";

                        }else if (poseapp.value.states.item_mode == "motion") {
                            if ((!js) || 
                                !("frames" in js)
                            ) {
                                appAlert(_T("msg_motion_erroropen"));
                                return;
                            }
                        }
                        
                        var filename = files[0].name.split(".")[0];
                        var reff = null;
                        if (poseapp.value.states.item_mode == "pose") {
                            reff = AppDB.pose.setItem(filename,js);
                        }else if (poseapp.value.states.item_mode == "motion") {
                            reff = AppDB.motion.setItem(filename,js);
                        }
                        reff.then(data => {
                            //console.log(data);
                            refresh_onclick();
                        })
                        .catch(err => {
                            console.error(err);
                        });
                        
                    }
                }
            });
        }

        const selectListItem = (item) => {
            poseapp.value.list.selected = item;

            poseapp.value.list.options.forEach(v => {
                v.styleclass["list-item-selected"] = false;
            });
            item.styleclass["list-item-selected"] = true;
        }
        const modetab_change = (val) => {
            refresh_onclick();
        }

        //---computed---------------------------------------------
        const list_actived = Vue.computed(() => {
            return (item) => {
                if (!poseapp.value.list.selected) return false;
                return (poseapp.value.list.selected.name == item.name);
            }
        });
        const listitem_height = Vue.computed(() => {
            return (item) => {
                return Math.round(parseFloat(item.bodyinfo[1]) * 100);
            }
        });
        const targetTypeName = (targetType) => {
            const TYPENAME = ["VRM","OtherObject","Light","Camera",
                "Text","Image","UImage","Audio","Effect","SystemEffect","Stage"
            ];

            return TYPENAME[targetType];
        }

        const onchange_searchstr = (val) => {
            const cval = val.toLowerCase();
            for (var i = 0; i < poseapp.value.list.options.length; i++) {
                if (val == "") {
                    poseapp.value.list.options[i].visibility = true;
                }else{
                    if (poseapp.value.list.options[i].name.toLowerCase().indexOf(cval) > -1) {
                        poseapp.value.list.options[i].visibility = true;
                    }else{
                        poseapp.value.list.options[i].visibility = false;
                    }
                }
                
            }
            
        }

        const listorigin_onchange = (val) =>  {
            var remoteload = (url) => {
                fetch(url)
                .then(async ret => {
                    if (ret.ok) {
                        var js = await ret.json();
                        if (js.cd == 0) {
                            for (var obj of js.data) {
                                let posedata = (typeof obj.data == "string" ? JSON.parse(obj.data) : obj.data);
                                if (poseapp.value.states.item_mode == "pose") {
                                    poseapp.value.list.options.push({
                                        thumbnail : posedata.thumbnail,
                                        name : obj.name,
                                        bodyinfo : posedata.frameData.bodyHeight,
                                        sample : posedata.sampleavatar,
                                        visibility : true,
                                        styleclass : {
                                            "list-item-selected" : false
                                        },
                                        data : posedata
                                    });
                                }else if (poseapp.value.states.item_mode == "motion") {
                                    poseapp.value.list.options.push({
                                        name: obj.name,
                                        type: posedata.targetType,
                                        version : posedata.version,
                                        height: Math.round(posedata.bodyHeight[1] * 1000) / 1000,
                                        
                                        frameCount : posedata.frames.length,
                                        startFrame : posedata.frames[0].index,
                                        endFrame : posedata.frames[posedata.frames.length-1].index,
                                          
                                        visibility : true,
                                        styleclass : {
                                            "list-item-selected" : false
                                        },
                                        data: posedata
                                    });
                                }
                                
                            }
                        }else{
                            alert(js.msg);
                        }
                    }
                })
                .finally(() => {
                    poseapp.value.header.loading = false;
                });
            }
            console.log(val);
            if (
                (val.value == "appserver") ||
                (val.value == "gdrive")
            ) {
                var baseurl = poseapp.value.appconf.confs.fileloader.gdrive.url;
                var apikey = poseapp.value.appconf.confs.fileloader.gdrive.apikey;
                var urlparams = new URLSearchParams();

                //---decide URL
                if (val.value == "appserver") {
                    baseurl = SAMPLEURL;
                    apikey = SAMPLEKEY;
                }
                
                /*if (baseurl.indexOf("https://script.google.com/macros/s/") < 0) {
                    baseurl = "https://script.google.com/macros/s/" + baseurl;
                }
                if (baseurl.lastIndexOf("/exec") < 0) {
                    baseurl = baseurl + "/exec";
                }*/            
                
                //---setting URL parameters
                urlparams.append("mode","enumdir");
                urlparams.append("apikey",apikey);
                urlparams.append("withdata","1");

                if (poseapp.value.states.item_mode == "pose") {
                    urlparams.append("extension","vvmpose");

                    //extension = "vvmpose";
                    if (val.value == "appserver") {
                        //---app server id
                        urlparams.append("enumtype","pose");
                    }else if (val.value == "gdrive") {
                        //---user folder id
                        urlparams.append("dirid",poseapp.value.appconf.confs.fileloader.gdrive.user.pose);
                    }
                }else if (poseapp.value.states.item_mode == "motion") {
                    urlparams.append("extension","vvmmot");

                    //extension = "vvmmot";
                    if (val.value == "appserver") {
                        //---app server id
                        urlparams.append("enumtype","motion");
                    }else if (val.value == "gdrive") {
                        //---user folder id
                        urlparams.append("dirid", poseapp.value.appconf.confs.fileloader.gdrive.user.motion);
                    }
                }

                poseapp.value.header.loading = true;
                poseapp.value.list.options.splice(0, poseapp.value.list.options.length);
                //---application google drive
                //var finalurl = `${baseurl}?mode=enumdir&apikey=${apikey}&extension=${extension}&withdata=1`;
                var finalurl = baseurl;
                finalurl += "?" + urlparams.toString();
                /*if  (dirid != "") {
                    //---specified google drive id
                    finalurl += `&dirid=${dirid}`;
                }*/
                remoteload(finalurl);

            }else if (val.value == "mystorage") {
                loadData();
            }
        }
        const checkSelectVRMObject = () => {
            var sinfo = opener._REFAPP.childreturner["select_info"];
            if (sinfo) {
                console.log(sinfo);
                if (sinfo.type == 0) {
                    return false;
                }else{
                    return true;
                }
            }else{
                return true;
            }
        }
        const btn_savebvhmotion_onclick = () => {
            
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "pose";
            js.funcName = "savebvhmotion";
            
            
            js.data = JSON.stringify(poseapp.value.list.selected.data);
            opener.postMessage(js);
        }
        const btn_saveanimmotion_onclick = () => {
            var sinfo = opener._REFAPP.childreturner["select_info"];
            if (sinfo) {
                console.log(sinfo);
                //return;
            }
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "pose";
            js.funcName = "saveanimmotion";
            
            
            js.data = JSON.stringify({});
            opener.postMessage(js);
        }
        const btn_savevrmamotion_onclick = () => {
            var sinfo = opener._REFAPP.childreturner["select_info"];
            if (sinfo) {
                console.log(sinfo);
                //return;
            }
            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "pose";
            js.funcName = "savevrmamotion";
            
            
            js.data = JSON.stringify({});
            opener.postMessage(js);
        }
        
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
            if (location.search != "") {
                var s = location.search.replace("?","").split("&");
                var svobj = {};
                for (var si = 0; si < s.length; si++) {
                    var item = s[si].split("=");
                    svobj[item[0]] = item[1];
                }
                console.log(svobj);

                if ("mode" in svobj) {
                    if (svobj["mode"] == "p") {
                        poseapp.value.states.item_mode = "pose";
                    }
                    else if (svobj["mode"] == "m") {
                        poseapp.value.states.item_mode = "motion";
                    }
                }
            }
        });
        Vue.onMounted(() => {

            loadData();
            loadSetting();

            if (poseapp.value.appconf.confs.fileloader.gdrive.enabled && 
                (poseapp.value.appconf.confs.fileloader.gdrive.url != "")
            ) {
                poseapp.value.header.list_origin.push({label:t("Google Drive"),value:"gdrive"});
            }
            poseapp.value.header.list_origin.push({label:t("Application"),value:"appserver"});
            //console.log(opener);
            //VFileHelper.flags.isEnableFSAA = false;
        });

        return {
            poseapp,
            //---event---
            refresh_onclick,
            apply_onclick,delete_onclick,download_onclick,upload_onclick,
            selectListItem,onchange_searchstr,
            listorigin_onchange,modetab_change,
            btn_savebvhmotion_onclick,btn_saveanimmotion_onclick,btn_savevrmamotion_onclick,
            checkSelectVRMObject,
            //---computed---
            list_actived,listitem_height,targetTypeName,
            //---other method---
            loadData,loadSetting,
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
