import { defineSetupLang } from "./setuplang.js";

var loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

/*
Example kicking off the UI. Obviously, adapt this to your specific needs.
Assumes you have a <div id="q-app"></div> in your <body> above
*/
const app = Vue.createApp({
    setup () {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });

        const myapp = Vue.ref({
            loadedVideoName : _T("No video"),
            files : null,
            videourl : "",
            videoratio : 1,

            showmsg : false,
            msgcontent : "",
            appconf : {
                set_name : "_vvie_aco",
                confs : {},
            },
        });
        const loadSetting = () => {
            var textdata = localStorage.getItem(capapp.value.appconf.set_name);
            if (textdata) {
                var tmp = JSON.parse(textdata);
                capapp.value.appconf.confs = tmp;
            }
        }

        const hidfile = Vue.ref(null);
        const hidfile_onchange = (evt) => {
            myapp.value.files = evt.target.files[0];
            myapp.value.loadedVideoName = myapp.value.files.name;
            upload_body();
        };

        const vplayer = Vue.ref(null);

        const cmp_canUpload = Vue.computed(() => myapp.value.files !== null);
        const cleanUp = () => {
            window.URL.revokeObjectURL(myapp.value.videourl);
        }
        const cancelFile = () => {
            myapp.value.files = null;
            cleanUp();
        }
        const updateFiles = (targetfiles) => {
            myapp.value.files = targetfiles;
           
        }
        const upload_body = () => {
            cleanUp();

            myapp.value.videourl = window.URL.createObjectURL(myapp.value.files);
            Vue.nextTick(()=> {
                //if (myapp.value.videourl != "")
                //vplayer.value.play();
            });
        }
        const open_fromapp = () => {
            cleanUp();
            let url = sessionStorage.getItem("tempvideo");
            if (url) {
                myapp.value.videourl = url;
                myapp.value.loadedVideoName = _T("Recorded video by VRMViewMeister");
            }else{
                myapp.value.msgcontent = _T("msg_error_allfile");
                myapp.value.showmsg = true;
            }
        }
        const open_fromlocal = () => {
            cleanUp();
            hidfile.value.click();
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
        Vue.onBeforeUnmount(() => {
            
        });
        return {
            myapp,
            hidfile,vplayer,
            cmp_canUpload,
            
            hidfile_onchange,
            updateFiles,
            open_fromapp,
            open_fromlocal,
            cleanUp, upload_body, cancelFile,
            loadSetting,
            
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
});
defineSetupLang(Quasar);

app.use(i18n);
//---Start app
app.mount('#q-app');
