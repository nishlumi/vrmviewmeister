
import { defineSetupLang } from "./setuplang.js";
import { ChildReturner } from "./cls_childreturner.js";
import { FILEOPTION } from "../res/appconst.js";
import { VFileHelper, VFileOptions } from "./filehelper.js";

//import messages from "/static/locales";

const loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

const app = Vue.createApp({
    setup() {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });

        const capapp = Vue.ref({
            header : {
                show : true,
                download : "pose.json",
                url : null
            },
            appconf : {
                set_name : "_vvie_aco",
                confs : {},
            },
            left : {
                show : true,
                filter_date : new Date().toFormatText(true,false),
                date_options: [],
                list : {
                    options : [],
                    selected : null
                }
            },
            imagepanel : {
                src : null
            }
            
        });
        const lnk_capturedownload = Vue.ref(null);
        const fileoption = {
            types: [
                {
                    description : "PNG file",
                    accept : {"application/image": [".png"]}
                },
                {
                    description : "JPEG file",
                    accept : {"application/image": [".jpg"]}
                }
            ]
        };

        /**
         * Initially set up file list and date filter 
         */
        const loadDateFilter = () => {
            capapp.value.left.list.options.splice(0, capapp.value.left.list.options.length);
            capapp.value.left.date_options.splice(0,capapp.value.left.date_options.length);
            AppDB.capture.keys().then(result => {
                for (var i = 0; i < result.length; i++) {
                    var target_date = new Date(parseInt(result[i]));
                    capapp.value.left.list.options.push({
                        text : target_date.toFormatText(true,true),
                        key : result[i],
                        value : ""
                    });
                    var onlydate = target_date.toFormatText(true,false);
                    const finx = capapp.value.left.date_options.findIndex(item => {
                        if (item == onlydate) return true;
                        return false;
                    });
                    if (finx == -1) {
                        capapp.value.left.date_options.push(onlydate);
                    }
                }
                loadData(new Date().toFormatText(true,false));
                return true;
            });
        }
        const loadData = (target) => {
            capapp.value.left.list.options.splice(0, capapp.value.left.list.options.length);
            return AppDB.capture.keys().then(result => {
                for (var i = 0; i < result.length; i++) {
                    var target_date = new Date(parseInt(result[i]));
                    if ((target == null) ||
                        (target_date.toFormatText(true,false) == target)
                    ) {
                        capapp.value.left.list.options.push({
                            text : target_date.toFormatText(true,true),
                            key : result[i],
                            value : ""
                        });
                    }
                }
                return capapp.value.left.list;
            })
        }
        const loadSetting = () => {
            var textdata = localStorage.getItem(capapp.value.appconf.set_name);
            if (textdata) {
                var tmp = JSON.parse(textdata);
                capapp.value.appconf.confs = tmp;
                VFileHelper.setAppConf(capapp.value.appconf);
            }
        }
        //---event---------------------------------------------
        const datefilter_onchange = () => {
            console.log(capapp.value.left.filter_date);
            loadData(capapp.value.left.filter_date);
        }
        const refresh_onclick = () => {
            loadData(capapp.value.left.filter_date)
            
        }
        const delete_onclick = () => {
            appConfirm(_T("msg_img_delconfirm"),()=>{
                if (capapp.value.left.list.selected) {
                    AppDB.capture.removeItem(capapp.value.left.list.selected.key).then(result=>{
                        refresh_onclick();
                    });
                }
            });
        }
        const download_onclick = async () => {
            if (capapp.value.left.list.selected) {
                var opt = new VFileOptions();
                opt.suggestedName = new Date(parseInt(capapp.value.left.list.selected.key)).toFullText() + ".png";
                for (var i = 0; i < FILEOPTION.IMAGES.types.length; i++) {
                    opt.types.push(FILEOPTION.IMAGES.types[i]);
                    //opt.types[opt.types.length-1].accept["image/*"] = [["jpg","png","gif"]]
                }

                var content = capapp.value.imagepanel.src;

                /*
                if (VFileHelper.checkNativeAPI) {
                    //---convert to binary data
                    var burl = window.atob(capapp.value.imagepanel.src.split(",")[1]);
                    var mimetype = capapp.value.imagepanel.src.match(/(:)([a-z\/]+)(;)/)[2];
                    for( var i=0, l=burl.length, content=new Uint8Array( l ); l>i; i++ ) {
                        content[i] = burl.charCodeAt( i ) ;
                    }
                    //content = new Blob([content], {type : mimetype});
                }
                VFileHelper.saveUsingDialog(content, opt, true)
                .then((value,cd,err) => {
                    
                });
                */
               
                lnk_capturedownload.value.accept = "png";
                lnk_capturedownload.value.href = capapp.value.imagepanel.src; //burl;
                lnk_capturedownload.value.download = new Date(parseInt(capapp.value.left.list.selected.key)).toFullText();// + ".png";
                lnk_capturedownload.value.click();
            }
        }
        const share_onclick = async (evt) => {
            try {
                if (capapp.value.left.list.selected) { 
                    
                    var bb = toBlob(capapp.value.imagepanel.src);
                    /*var arb = await bb.arrayBuffer();
                    var bytes = capapp.value.imagepanel.src; //new Uint8Array(arb);
                    VFileHelper.saveToGoogleDrive(true,{
                        name: new Date(parseInt(capapp.value.left.list.selected.key)).toFullText() + ".png",
                        extension : "png"
                    },bytes);
                    */

                    //----
                    var shares = {
                        title: new Date(parseInt(capapp.value.left.list.selected.key)).toFullText() + ".png",
                        files : [
                            new File([bb],new Date(parseInt(capapp.value.left.list.selected.key)).toFullText() + ".png",{type:"image/png"})
                        ],
                    }
                    await navigator.share(shares);
                }
            }catch(e) {
                console.error(e);
                appNotifyWarning(e,{timeout:3000});
            }
        }

        const selectListItem = (item) => {
            capapp.value.left.list.selected = item;
            AppDB.capture.getItem(capapp.value.left.list.selected.key)
            .then(res=>{
                capapp.value.imagepanel.src = res;
                capapp.value.imagepanel.alt = capapp.value.left.list.selected.text;               
            });
        }
        const list_actived = Vue.computed(() => {
            return (item) => {
                if (!capapp.value.left.list.selected) return false;
                return (capapp.value.left.list.selected.key == item.key);
            }
        });
        const chkShareNavigator = Vue.computed(() => {
            return ("share" in navigator);
        });
        const chkMobile = Vue.computed(() => {
            if (Quasar.Screen.name == "xs") {
                return true;
            }else{
                return false;
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

            loadDateFilter();
            loadSetting();
        });

        return {
            capapp,
            lnk_capturedownload,
            //---event---
            refresh_onclick,delete_onclick,download_onclick,share_onclick,
            selectListItem,
            datefilter_onchange,
            //---computed---
            list_actived,chkShareNavigator,chkMobile,
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
