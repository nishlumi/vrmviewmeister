import { defineSetupLang } from "./setuplang.js";
import { ChildReturner } from "./cls_childreturner.js";
import { AF_TARGETTYPE, FILEOPTION, IKBoneType, UserAnimationEase } from "../res/appconst.js";
import { VFileHelper, VFileOptions } from "./filehelper.js";


const loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

class BaseData{
    constructor() {
        this.elements = {

        };
        this.data = {

        };
        this.states = {

        };
    }
}
const app = Vue.createApp({
    setup() {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });

        /**
         * @type {BaseData}
         */
        const data = Vue.reactive(new BaseData());
        
        const cvlay_bg = Vue.ref(null);
        
        const cvlay_cursor = Vue.ref(null);
        /**
         * @type {CanvasRenderingContext2D}
         */
        var ctxbg = null;
        /**
         * @type {CanvasRenderingContext2D}
         */
        var ctxcur = null;
        //===watch=================================================================
        const loopPerform = async () => {
            
        };
        //===computed=================================================================
        //===method=================================================================
        /**
         * 
         * @param {HTMLCanvasElement} can 
         */
        const getMenseki = (can) => {
            var rect = can.getBoundingClientRect();
            return rect.width * rect.height / 2;
        }
        /**
         * 
         * @param {HTMLCanvasElement} can
         * @param {CanvasRenderingContext2D} ctx
         * @param {Number} sa
         */
        const draw_preview = (canctx, sa) => {
            const bnd = can.getBoundingClientRect();

            ctx2.clearRect(0,0,bnd.w,bnd.h);

            var imgdata = ctx.getImageData(0,0,bnd.width, bnd.height);
            ctx.drawImage(can1,0,0,bnd.width*sa, bnd.height*sa);
        }
        /**
         * 
         * @param {HTMLCanvasElement} can 
         * @param {*} scrollrect 
         * @param {Numbner} sa 
         */
        const draw_selectRect = (ctx2, scrollrect, sa) => {
            //const ctx2 = can.getContext("2d");

            ctx2.clearRect(0,0,999,999);

            ctx2.lineWidth = 0.5;
            ctx2.strokeStyle = "#FF0000FF";
            ctx2.strokeRect(scrollrect.x * sa, scrollrect.y * sa, scrollrect.w * sa, scrollrect.h * sa);
            ctx2.fillStyle = "#FFFFFF55";
            ctx2.fillRect(scrollrect.x * sa, scrollrect.y * sa, scrollrect.w * sa, scrollrect.h * sa);
        }
        //===events=================================================================
        //===lifecycle=================================================================
        Vue.onBeforeMount(() => {
        });
        Vue.onMounted(() => {
            ctxbg = cvlay_bg.value.getContext("2d");
            ctxcur = cvlay_cursor.value.getContext("2d");
        });

        return {
            data, cvlay_bg, cvlay_cursor
            //---watch---
            //---computed---
            //---method---
            //---events
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