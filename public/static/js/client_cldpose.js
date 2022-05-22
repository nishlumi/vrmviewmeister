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
                
                if (VFileHelper.checkNativeAPI) {
                    content = JSON.stringify(poseapp.value.list.selected.data);
                }else{
                    /*var bb = new Blob([JSON.stringify(poseapp.value.list.selected.data)], { type: "application/json" });
                    if (poseapp.value.header.url) window.URL.revokeObjectURL(poseapp.value.header.url);
    
                    poseapp.value.header.url = window.URL.createObjectURL(bb);
                    content = poseapp.value.header.url;
                    */
                    content = JSON.stringify(poseapp.value.list.selected.data);
                }
                VFileHelper.saveUsingDialog(
                    content,
                    opt,
                    true
                )
                .then(ret => {
                    if (ret.cd == 0) {

                    }else{

                    }
                });
                /*
                var bb = new Blob([JSON.stringify(poseapp.value.list.selected.data)], { type: "application/json" });
                if (poseapp.value.header.url) window.URL.revokeObjectURL(poseapp.value.header.url);

                var burl = window.URL.createObjectURL(bb);
                lnk_posedownload.value.href  = burl;
                lnk_posedownload.value.download = poseapp.value.list.selected.name + ".vvmpose";
                lnk_posedownload.value.click();
                */

                //---File System Access API
                /*
                if ("showSaveFilePicker" in window) {
                    const savepicker = await window.showSaveFilePicker(fileoption);
                    if (savepicker) {
                        const writer = await savepicker.createWritable();
                        writer.write(JSON.stringify(poseapp.value.list.selected.data));
                        await writer.close();
                    }
                    
                }else{
                    console.log("Not found window.showSaveFilePicker...");
                }
                */
            }
        }
        const upload_onclick = async () => {
            //fl_openpose.value.click();
            VFileHelper.openFromDialog(fileoption,async (files,cd,err)=>{
                if (files) {
                    var data = await files[0].text();
                    if (data) {
                        var js = JSON.parse(data);
                        if ((!js) || 
                            !("frameData" in js)
                        ) {
                            appAlert(_T("msg_pose_erroropen"));
                            return;
                        }
                        var filename = files[0].name.split(".")[0];
                        AppDB.pose.setItem(filename,js)
                        .then(data => {
                            console.log(data);
                            refresh_onclick();
                        })
                        .catch(err => {
                            console.log(err);
                        });
                        
                    }
                }
            });
            /*
            if ("showOpenFilePicker" in window) {
                var files = await window.showOpenFilePicker(fileoption);
                if (files) {
                    if (files.length > 0) {
                        var f0 = files[0];
                        var f = await f0.getFile();
                        var data = await f.text();
                        if (data) {
                            var js = JSON.parse(data);
                            if ((!js) || 
                                !("frameData" in js)
                            ) {
                                appAlert(_T("msg_pose_erroropen"));
                                return;
                            }
                            var filename = f.name.split(".")[0];
                            AppDB.pose.setItem(filename,js)
                            .then(data => {
                                console.log(data);
                                refresh_onclick();
                            })
                            .catch(err => {
                                console.log(err);
                            });
                            
                        }
                    }
                }
            }else{
                console.log("Not found window.showOpenFilePicker...");
            }
            */
        }

        const selectListItem = (item) => {
            poseapp.value.list.selected = item;
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
            VFileHelper.flags.isEnableFSAA = false;
        });

        return {
            poseapp,
            //---event---
            apply_onclick,delete_onclick,download_onclick,upload_onclick,
            selectListItem,
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
