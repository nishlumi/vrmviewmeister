
import { defineSetupLang } from "./setuplang.js";
import { ChildReturner } from "./cls_childreturner.js";
import { AF_TARGETTYPE, IKBoneType } from "../res/appconst.js";

class BaseApp{
    constructor(){
        this.appconf = {
            set_name : "_vvie_aco",
            confs : {},
        };
        this.mainwin = {
            cast: {},
            part: "",
            avatars: [],
        };
        this.lpID = null;
    }
}
class BaseData{
    constructor() {
        this.elements = {
            win : {
                styles : {
                    position : "absolute",
                    bottom : "0px",
                    right : "0px",
                    //top : "0px",
                    width : "320px",
                    height : "340px",
                    zIndex : 5005,
                    backgroundColor : "#FFFFFF"
                },
                position : {
                    x : 0,
                    y : 0
                },
            },
            panelCSS : {
                "q-dark" : false,
                "text-dark" : true,
            },
            avatarBox : {
                /**
                 * @type {{label:String, value:VVCast}[]}
                 */
                options: [],
                selected: { label: "---", value:null}
            },
            vrmParts : {
                /**
                 * @type {{label:String, cast:VVCast, value: String}}
                 */
                options: [],
                selected: { label: "---", cast: null, value:""}
            },
            rad_transformtype: "position",
            offset: {
                x: 0,
                y: 0,
                z: 0
            },
            chk_rotate_reverse: false,
        };
        this.data = {
            
        };
        this.states = {
            
            disable: false,
        };
    }
}

//import messages from "/static/locales";

const loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

const app = Vue.createApp({
    setup() {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });

        //const {modelValue, currentCast, currentParts, avatars } = Vue.toRefs(props);
        const currentCast = Vue.ref(null);
        const currentParts = Vue.ref("")
        const avatars = Vue.ref([]);

        const show = Vue.ref(false);
        /**
         * @type {BaseData}
         */
        const trapp = Vue.reactive(new BaseData());
        /**
         * @type {BaseApp}
         */
        const btapp = Vue.reactive(new BaseApp());
        const trdlg_bar = Vue.ref(null);
        const trdlg = Vue.ref(null);

        

        //===watch=================================================================
        
        const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
            trapp.elements.panelCSS["q-dark"] = newval;
            trapp.elements.panelCSS["text-dark"] = !newval;
        });
        const wa_cast = Vue.watch(() => currentCast.value, (newval, oldval) => {
            if (newval.avatar.type == AF_TARGETTYPE.Stage) {
                trapp.states.disable = true;
            }else{
                trapp.states.disable = false;
            }
        });

        //===computed=================================================================
        const cmp_current_avatar_title = Vue.computed(() => {
            var ret = "";
            /**
             * type {VVCast}
             */
            var cast = currentCast.value;
            if (cast) {
                ret = cast.avatar.title;
            }
            return ret;
        });
        const cmp_current_avatar_icon = Vue.computed(() => {
            var ret = "";
            /**
             * type {VVCast}
             */
            var cast = currentCast.value;
            if (cast) {
                ret = cast.avatar.thumbnail;
                if (cast.avatar.type != AF_TARGETTYPE.VRM) {
                    ret = cmp_webelectron_path(cast.avatar.thumbnail);
                }
            }
            return ret;
        });
        const cmp_current_parts = Vue.computed(() => {
            var ret = "";

            ret = currentParts.value;
            if (ret.indexOf("trueikparent") > -1) {
                ret = "All"
            }
            return ret;
        });
        const cmp_avatar_is_vrm = Vue.computed(() => {
            var ret = false;
            if (trapp.elements.avatarBox.selected) {
                if (trapp.elements.avatarBox.selected.value != null) {
                    /**
                     * type {VVCast}
                     */
                    var cast = trapp.elements.avatarBox.selected.value;
                    if (cast.type == AF_TARGETTYPE.VRM) {
                        ret = true;
                    }
                }
            }
            return ret;
        });
        const cmp_avatarlist = Vue.computed(() => {
            var ret = [ { label: "---", value:null}, { label: "MainCamera", thumbnail: cmp_webelectron_path("static/img/pic_camera.png"), value:"maincamera"}];
            //console.log(vrms.value);
            for (var i = 0; i < avatars.value.length; i++) {
                /**
                 * type {VVCast}
                 */
                var obj = avatars.value[i];
                if (obj.avatar) {
                    if ((obj.type != AF_TARGETTYPE.SystemEffect) && 
                        (obj.type != AF_TARGETTYPE.Audio) &&
                        (obj.type != AF_TARGETTYPE.Stage) &&
                        (obj.type != AF_TARGETTYPE.Text)  &&
                        (obj.type != AF_TARGETTYPE.UImage) 
                    ) {
                        var thumb = "";
                        if (obj.type == AF_TARGETTYPE.VRM) {
                            thumb = obj.avatar.thumbnail;
                        }else{
                            thumb = cmp_webelectron_path(obj.avatar.thumbnail);
                            console.log(thumb);
                        }
                        if (obj.avatar.id != currentCast.value.avatar.id) {
                            ret.push({
                                label : obj.roleTitle,
                                thumbnail : thumb,
                                value: obj
                            });
                        }
                    }
                }
                
            }
            return ret;
        });
        const cmp_vrmpartslist = Vue.computed(() => {
            return reloadVRMParts();
        });
        const cmp_webelectron_path = (iconname) => {
            var locpath = "";
            if (location.pathname.indexOf("static/win/") > -1) {
                locpath = "../../../";
            }else{
                locpath = "";
            }
            
            return locpath + iconname;
        }

        //===method=================================================================
        
        const reloadVRMParts = () => {
            var ret = [{ label: "---", cast:null, value:""}];
            if (trapp.elements.avatarBox.selected) {
                if (trapp.elements.avatarBox.selected.value != null) {
                    /**
                     * type {VVCast}
                     */
                    var cast = trapp.elements.avatarBox.selected.value;
                    if (cast.avatar.type == AF_TARGETTYPE.VRM) {
                        for (var obj in IKBoneType) {
                            if ((obj != "None") && (obj != "IKParent") && (obj != "Unknown")) {
                                ret.push({
                                    label: obj,
                                    cast: cast,
                                    icon : (cast.value == "" ? cast.value : "/static/img/vvmico_bn_" + obj.toLocaleLowerCase() + ".png"),
                                    value: obj
                                });
                            }
                        }
                    }
                }
            }
            return ret;
        }
        //===events=================================================================
        
        const avatarbox_selected = () => {
            trapp.elements.vrmParts.options = reloadVRMParts();
            trapp.elements.vrmParts.selected = trapp.elements.vrmParts.options[0];
        }
        const transform_onchange = (transformtype) => {

            /**
             * type {VVCast}
             */
            let cast = trapp.elements.avatarBox.selected.value;
            let parts = trapp.elements.vrmParts.selected.value;
            let vec = trapp.elements.offset;
            var avatarid = (cast == "maincamera") ? cast : cast.avatarId;
            var isrev = trapp.elements.chk_rotate_reverse ? "1" : "0";

            var param = `${avatarid},${parts},${currentParts.value},${vec.x},${vec.y},${vec.z},${isrev}`;

            var js = new ChildReturner();
            js.origin = location.origin;
            js.windowName = "transref";            
            
            if (transformtype == "position") {
                /*AppQueue.add(new queueData(
                    {target:currentCast.value.avatarId,method:'SetPositionIKMarkerFromOuter',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));*/

                js.funcName = "call_setpositionikmarker";
                js.data = JSON.stringify({
                    avatarId : currentCast.value.avatarId,
                    param: param
                });
            }
            else if (transformtype == "rotation") {
                /*AppQueue.add(new queueData(
                    {target:currentCast.value.avatarId,method:'SetRotationIKMarkerFromOuter',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));*/
                js.funcName = "call_setrotationikmarker";
                js.data = JSON.stringify({
                    avatarId : currentCast.value.avatarId,
                    param: param
                });
            }
            
            
            //AppQueue.start();
            opener.postMessage(js);
        }
        
        const loadAvatarInfo = (is_avatars = true) => {
            AppDB.temp.getItem("transref_cast")
            .then(val => {
                if (val) currentCast.value = val;

                AppDB.temp.removeItem("transref_cast");
            });
            AppDB.temp.getItem("transref_part")
            .then(val => {
                if (val) currentParts.value = val;

                AppDB.temp.removeItem("transref_part");
            });
            if (is_avatars) {
                AppDB.temp.getItem("transref_avatars")
                .then(val => {
                    if (val != null) {
                        avatars.value = val.list;
                            
                    }
                    AppDB.temp.removeItem("transref_avatars");
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
                loadAvatarInfo(false);
            },200);

            window.addEventListener("unload",(evt)=>{
                clearInterval(btapp.lpID);
            });
        });
        Vue.onBeforeUnmount(() => {
            
        });

        return {
            show, btapp, trapp, trdlg_bar, trdlg,
            currentCast, currentParts, avatars,
            //---watch---
            wa_dark,
            //---computed---
            cmp_current_avatar_title, cmp_current_avatar_icon, cmp_current_parts,
            cmp_avatar_is_vrm, cmp_avatarlist, cmp_vrmpartslist,
            cmp_webelectron_path,
            //---method---
            
            //---event---
            transform_onchange,avatarbox_selected,
            
        }
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
