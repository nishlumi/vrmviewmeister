import { AnimationRegisterOptions, AnimationTransformRegisterOptions } from "./prop/cls_unityrel.js";
import { VVAvatar,  VVCast,  VVTimelineTarget } from "./prop/cls_vvavatar.js";
import { AF_TARGETTYPE, UserAnimationEase } from "../res/appconst.js";

/*
    KeyFrame Editing dialog
 
    Specification:
        decide way of operatable timeline avatar:
            frame index {Number}: NativeAnimationFrame.index is same to timelineData.states.currentcursor
            target timeline: mainData.states.selectedTimeline
 */
const template = `
<div ref="nvdlg" v-show="show" class="rounded-borders shadow-2" :style="nvapp.elements.win.styles">
    <div ref="nvdlg_bar" v-touch-pan.prevent.mouse="handlePan" class="basic-dialog-titlebar bg-primary text-grey-1 q-pa-xs">
        <div class="row">
            <div>{{ $t('navigation window') }}</div>
            <q-space></q-space>
            <q-btn flat round dense size="md" icon="clear" @click="close_onclick"></q-btn>
        </div>
    </div>
    <div style="width:100%;height:calc(100% - 40px);" :class="nvapp.elements.panelCSS" class="q-pa-sm">
        <div class="row q-pt-sm navwin-layerparent">
            <div class="col-12 navwin-layergrid">
                <div class="navwin-layer1">
                    <canvas ref="cvlay_bg"
                        :width="nvapp.elements.canvas.width" 
                        :height="nvapp.elements.canvas.height"
                    ></canvas>
                </div>
                <div class="navwin-layer2">
                    <canvas ref="cvlay_cursor"
                        :width="nvapp.elements.canvas.width" 
                        :height="nvapp.elements.canvas.height"
                        @pointerdown="canvas_cursor_pointerdown"
                        @pointermove="canvas_cursor_pointermove"
                    ></canvas>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <q-btn flat dense color="primary" :label="$t('ribbon_recover_screensize')" @click="originalsize_onclick" no-caps ></q-btn>
                <q-btn flat dense icon="restart_alt" color="primary" :label="$t('ribbon_screen_camerareset')" @click="resetcamera_onclick" no-caps ></q-btn>
            </div>
        </div>
             
    </div>
</div>
`;

class BaseData{
    constructor() {
        this.elements = {
            win : {
                styles : {
                    position : "absolute",
                    //bottom : "-9999px",
                    right : "0px",
                    top : "0px",
                    width : "320px",
                    height : "400px",
                    zIndex : 5006,
                    backgroundColor : "#FFFFFF"
                },
                position : {
                    x : 0,
                    y : 0
                },
            },
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

export function defineNavigationDlg(app, Quasar) {
    app.component("NavigationDlg",{
        template : template,
        props : {
            modelValue : Boolean,
            webglcan : HTMLCanvasElement,
            webglw : Number,
            webglh : Number,
            scrollTop : Number,
            scrollLeft : Number,
            selectrect : DOMRect,
        },
        emits : [
            "update:model-value",
            "movecursor",
            "originalsize",
            "resetcamera"
        ],
        setup(props, context) {
            const {modelValue, webglcan, webglw, webglh, scrollTop, scrollLeft, selectrect } = Vue.toRefs(props);
            const { t  } = VueI18n.useI18n({ useScope: 'global' });

            const show = Vue.ref(false);
            /**
             * @type {BaseData}
             */
            const nvapp = Vue.reactive(new BaseData());
            const nvdlg_bar = Vue.ref(null);
            const nvdlg = Vue.ref(null);

            const cvlay_bg = Vue.ref(null);
        
            const cvlay_cursor = Vue.ref(null);
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
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
                nvapp.elements.win.styles.bottom = "0px";
                nvapp.elements.win.styles.right = "0px";
            
                nvapp.elements.win.position.x = 0;
                nvapp.elements.win.position.y = 0;
                nvdlg.value.style.transform =
                    `translate(${nvapp.elements.win.position.x}px, ${nvapp.elements.win.position.y}px)`;

                if (newval === true) {
                    reloadWebGL();
                    nvapp.states.timeID = setInterval(loopPerform, 500);
                }else{
                    clearInterval(nvapp.states.timeID);
                }
            });
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

            const handlePan = ({ evt, ...newInfo }) => {
                var dx = newInfo.delta.x;
                var dy = newInfo.delta.y;
                nvapp.elements.win.position.x += dx;
                nvapp.elements.win.position.y += dy;
            
                nvdlg.value.style.transform =
                    `translate(${nvapp.elements.win.position.x}px, ${nvapp.elements.win.position.y}px)`;
            }

            //===lifecycle=================================================================
            Vue.onBeforeMount(() => {
            });
            Vue.onMounted(() => {
                /*
                interact(nvdlg_bar.value).draggable({
                    modifiers: [
                        interact.modifiers.restrict({
                            restriction: 'parent',
                            endOnly: true
                        })
                    ],
                    listeners : {
                        start(evt) {
                            //console.log("start",evt);
                        },
                        move (event) {
                            nvapp.elements.win.position.x += event.dx
                            nvapp.elements.win.position.y += event.dy
                      
                            nvdlg.value.style.transform =
                              `translate(${nvapp.elements.win.position.x}px, ${nvapp.elements.win.position.y}px)`;
                        },
                    },
                });
                */
                

                ctx.bg = cvlay_bg.value.getContext("2d");
                ctx.cur = cvlay_cursor.value.getContext("2d");

                //---always draw webgl to preview 
                nvapp.states.timeID = setInterval(loopPerform, 500);
            });
            Vue.onBeforeUnmount(() => {
                clearInterval(nvapp.states.timeID);
            });

            return {
                show, nvapp,
                nvdlg_bar, nvdlg,
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
                handlePan,
                close_onclick,originalsize_onclick,resetcamera_onclick,
                canvas_cursor_pointerdown,canvas_cursor_pointermove,
            }
        }
    });
}