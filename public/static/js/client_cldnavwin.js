import { defineSetupLang } from "./setuplang.js";
import { ChildReturner } from "./cls_childreturner.js";
import { AF_TARGETTYPE, FILEOPTION, IKBoneType, UserAnimationEase } from "../res/appconst.js";
import { VFileHelper, VFileOptions } from "./filehelper.js";


const loc = localStorage.getItem("appLocale");
if (!loc) loc = "en-US";

class BaseData{
    constructor() {
        this.elements = {
            canvas : {
                width : 300,
                height : 300,
            },
            panelCSS : {
                "q-dark" : false,
                "text-dark" : true,
            }
        };
        this.data = {
            menseki : {
                preview : 0,
                webgl : 0,
                sa : 0,
            },
            rect : {
                preview : null,
                webgl : null,
                select : null,
            }
        };
        this.states = {
            svrect : new DOMRect(),
            timeID : null,
        };
    }
}
const app = Vue.createApp({
    setup() {
        const { t  } = VueI18n.useI18n({ useScope: 'global' });

        const show = Vue.ref(false);
        /**
         * @type {BaseData}
         */
        const nvapp = Vue.reactive(new BaseData());
        
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
        const ctx = Vue.reactive({
            /**
             * @type {CanvasRenderingContext2D}
             */
            bg : null,
            /**
             * @type {CanvasRenderingContext2D}
             */
            cur : null
        });
        //===watch=================================================================
        const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
            nvapp.elements.panelCSS["q-dark"] = newval;
            nvapp.elements.panelCSS["text-dark"] = !newval;
        });
        const wa_webglw = Vue.watch(() => webglw.value, newval => {
            if (show.value === true) reloadWebGL();
        });
        const wa_webglh = Vue.watch(() => webglh.value, newval => {
            if (show.value === true) reloadWebGL();
        });
        const wa_scrollTop = Vue.watch(() => scrollTop.value, newval => {
            if (show.value !== true) return;
            var selrect = setupSelectRect();
            draw_selectRect(cvlay_cursor.value, ctx.cur, selrect, nvapp.data.menseki.sa);
        });
        const wa_scrollLeft = Vue.watch(() => scrollLeft.value, newval => {
            if (show.value !== true) return;
            var selrect = setupSelectRect();
            draw_selectRect(cvlay_cursor.value, ctx.cur, selrect, nvapp.data.menseki.sa);
        });
        const loopPerform = async () => {
            if (webglcan.value && cvlay_bg.value && ctx.bg)
                draw_preview(webglcan.value, cvlay_bg.value, ctx.bg);
        };
        //===computed=================================================================
        //===method=================================================================
        const reloadWebGL = () => {
            if (webglcan.value) {
                nvapp.data.rect.select = webglcan.value.parentElement.getBoundingClientRect();
                nvapp.data.rect.webgl = webglcan.value.parentElement.getBoundingClientRect();
                nvapp.data.rect.webgl.width = webglw.value;
                nvapp.data.rect.webgl.height = webglh.value;
                nvapp.data.menseki.webgl = getMenseki(webglcan.value);
                var res = checkResolution(nvapp.data.rect.webgl.width, nvapp.data.rect.webgl.height);
                //---change navigation thumbnail size
                if (res.type == "landscape") {
                    nvapp.elements.canvas.width = 300;
                    nvapp.elements.canvas.height = nvapp.elements.canvas.width * res.rate;
                }else{
                    nvapp.elements.canvas.height = 300;
                    nvapp.elements.canvas.width = nvapp.elements.canvas.height * res.rate;
                }
                Vue.nextTick(() => {
                    nvapp.data.menseki.preview = getMenseki(cvlay_bg.value);
                    nvapp.data.menseki.sa = Math.round(nvapp.data.menseki.preview / nvapp.data.menseki.webgl * 1000) / 1000;
                    nvapp.data.rect.preview = cvlay_bg.value.getBoundingClientRect();

                    draw_preview(webglcan.value, cvlay_bg.value, ctx.bg);
                });
                
            }                
        }
        const setupSelectRect = () => {
            var chk = checkResolution(nvapp.data.rect.select.width, nvapp.data.rect.select.height);

            var ret = {
                x : scrollLeft.value,
                y : scrollTop.value,
                width : nvapp.data.rect.select.width,
                height : nvapp.data.rect.select.height,
                sa : chk.rate
            };
            return ret;
        }
        /**
         * 
         * @param {HTMLCanvasElement} can 
         */
        const getMenseki = (can) => {
            var rect = can.getBoundingClientRect();
            if (rect.width > rect.height) {
                return rect.width;
            }else{
                return rect.height;
            }
        }
        /**
         * 
         * @param {Number} w width
         * @param {Number} h height
         * @returns 
         */
        const checkResolution = (w, h) => {
            if (w > h) {
                return {type : "landscape", rate: h / w};
            }else{
                return {type: "portrait", rate: w / h};
            }
        }
        /**
         * 
         * @param {Event} evt 
         * @param {*} rect 
         */
        const calculateNewScrollPos = (evt, rect) => {
            var newx = evt.offsetX - rect.width / 2;
            var newy= evt.offsetY - rect.height / 2;
            
            if (newx < 0) newx = 0;
            if (newy < 0) newy = 0;
    
            var glx = newx / nvapp.data.menseki.sa;
            var gly = newy / nvapp.data.menseki.sa;
    
            return {
                x : glx,
                y : gly
            };    
        }
        /**
         * 
         * @param {HTMLCanvasElement} srccan
         * @param {HTMLCanvasElement} targetcan
         * @param {CanvasRenderingContext2D} ctx
         */
        const draw_preview = (srccan, targetcan, ctx) => {
            const bnd = targetcan.getBoundingClientRect();
            const srcbnd = srccan.getBoundingClientRect();

            ctx.clearRect(0,0,bnd.width,bnd.height);

            ctx.drawImage(srccan,
                0,0,srcbnd.width, srcbnd.height,
                0,0,bnd.width, bnd.height 
            );
        }
        /**
         * To draw a rectangle for selection area
         * @param {HTMLCanvasElement} can 
         * @param {CanvasRenderingContext2D} ctx
         * @param {*} scrollrect 
         * @param {Number} sa 
         */
        const draw_selectRect = (can, ctx, scrollrect, sa) => {
            var bnd = can.getBoundingClientRect();
            ctx.fillStyle = "#FF000022";
            ctx.clearRect(0,0,bnd.width,bnd.height);
            
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "#FF0000FF";

            //---save effective selection rect
            nvapp.states.svrect.x = Math.floor(scrollrect.x * sa);
            nvapp.states.svrect.y = Math.floor(scrollrect.y * sa);
            nvapp.states.svrect.width = Math.floor(scrollrect.width * (sa));
            nvapp.states.svrect.height = Math.floor(nvapp.states.svrect.width * scrollrect.sa);

            ctx.fillRect(nvapp.states.svrect.x, nvapp.states.svrect.y, nvapp.states.svrect.width, nvapp.states.svrect.height);
            ctx.strokeRect(nvapp.states.svrect.x, nvapp.states.svrect.y, nvapp.states.svrect.width, nvapp.states.svrect.height);
        }
        //===events=================================================================
        const close_onclick = () => {
            show.value = false;
            context.emit("update:model-value",show.value);
        }
        const originalsize_onclick = () => {
            context.emit("originalsize","originalsize");
        }
        const resetcamera_onclick = () => {
            context.emit("resetcamera","resetcamera");
        }
        const canvas_cursor_pointerdown = (evt) => {
            var pos = calculateNewScrollPos(evt, nvapp.states.svrect);

            context.emit("movecursor",pos);

            var selrect = setupSelectRect();
            draw_selectRect(cvlay_cursor.value, ctx.cur, selrect, nvapp.data.menseki.sa);
        }
        const canvas_cursor_pointermove = (evt) => {
            if (evt.pressure > 0) {
                var pos = calculateNewScrollPos(evt, nvapp.states.svrect);
                context.emit("movecursor",pos);

                var selrect = setupSelectRect();
                draw_selectRect(cvlay_cursor.value, ctx.cur, selrect, nvapp.data.menseki.sa);
            }
        }
        //===lifecycle=================================================================
        Vue.onBeforeMount(() => {
        });
        Vue.onMounted(() => {
            ctxbg = cvlay_bg.value.getContext("2d");
            ctxcur = cvlay_cursor.value.getContext("2d");
        });

        return {
            show, nvapp,             
            cvlay_bg, cvlay_cursor,
            ctx,
            //---watch---
            wa_modelValue,wa_dark,wa_webglw,wa_webglh,wa_scrollTop,wa_scrollLeft,
            loopPerform,
            //---computed---
            //---method---
            reloadWebGL,setupSelectRect,getMenseki,checkResolution,
            draw_preview,draw_selectRect,
            //---event---            
            close_onclick,originalsize_onclick,resetcamera_onclick,
            canvas_cursor_pointerdown,canvas_cursor_pointermove,
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