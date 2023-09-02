import { defineSetupLang } from "./setuplang.js";
import { ChildReturner } from "./cls_childreturner.js";
import { VFileHelper,VFileOptions } from "./filehelper.js";

//import messages from "/static/locales";

var loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

const app = Vue.createApp({
    setup() {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });

        const poseapp = Vue.ref({
            header : {
                show : true,
                download : "pose.json",
                url : null
            },
            appconf : {
                set_name : "_vvie_aco",
                confs : {},
            },
            search_str: "",
            list : {
                options : [],
                selected : null
            }
        });
        const fileoption = {
            types: [
                {
                    description : "VVM pose file",
                    accept : {"application/json": [".vvmpose",".json"]}
                }
            ]
        };

        const loadData = () => {
            poseapp.value.list.options.splice(0, poseapp.value.list.options.length);
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
            });
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
            loadData();
        }
        const apply_onclick = () => {
            if (poseapp.value.list.selected) {
                if (poseapp.value.list.selected) {
                    //opener._REFMYAPP.returnPoseDialogValue(sel.data);
                    var js = new ChildReturner();
                    js.origin = location.origin;
                    js.windowName = "pose";
                    js.funcName = "apply_pose";
                    js.data = JSON.stringify(poseapp.value.list.selected.data);
                    opener.postMessage(js);
                }
            }
        }
        const delete_onclick = () => {
            appConfirm(_T("msg_pose_delconfirm"),()=>{
                if (poseapp.value.list.selected) {
                    AppDB.pose.removeItem(poseapp.value.list.selected.name).then(result=>{
                        refresh_onclick();
                    });
                }
            });
        }
        const download_onclick = async () => {
            if (poseapp.value.list.selected) {
                var opt = new VFileOptions();
                opt.types = fileoption.types;
                opt.suggestedName = poseapp.value.list.selected.name + ".vvmpose";

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
            VFileHelper.openFromDialog(fileoption,async (files,cd,err)=>{
                if (files) {
                    var data = null;
                    if (files[0].data instanceof File) {
                        data = await files[0].data.text();
                    }else{
                        data = files[0].data;
                    }
                    if (data) {
                        var js = JSON.parse(data);
                        if ((!js) || 
                            !("frameData" in js)
                        ) {
                            appAlert(_T("msg_pose_erroropen"));
                            return;
                        }
                        //---for security
                        if ("thumbnail" in js) js.thumbnail = ""
                        else js["thumbnail"] = "";

                        var filename = files[0].name.split(".")[0];
                        AppDB.pose.setItem(filename,js)
                        .then(data => {
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
        });
        Vue.onMounted(() => {

            loadData();
            loadSetting();
            //console.log(opener);
            //VFileHelper.flags.isEnableFSAA = false;
        });

        return {
            poseapp,
            //---event---
            refresh_onclick,
            apply_onclick,delete_onclick,download_onclick,upload_onclick,
            selectListItem,onchange_searchstr,
            //---computed---
            list_actived,listitem_height,
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
