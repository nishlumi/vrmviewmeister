
import { AF_TARGETTYPE } from "../res/appconst.js";
import { UnityVector3 } from "./prop/cls_unityrel.js";
import { VVAvatar } from "./prop/cls_vvavatar.js";

const template = `
<div ref="gbdlg" v-show="show" :class="data.elements.panelCSS" class="rounded-borders shadow-2" :style="data.elements.win.styles">
    <div ref="gbdlg_bar" class="basic-dialog-titlebar bg-primary text-grey-1 q-pa-xs">
        <div class="row">
            <div>{{ $t('title_bonegravity') }}</div>
            <q-space></q-space>
            <q-btn flat round dense size="md" icon="clear" @click="close_onclick"></q-btn>
        </div>
        
    </div>
    <div :class="data.elements.panelCSS" style="width:100%;height:calc(100% - 40px);">
        <div class="row basic-dialog-toolbar">
            <q-btn flat round dense icon="bookmark_added" :label="$t('apply gravity')" @click="apply_onclick">
            </q-btn>
            <q-btn flat round dense icon="refresh" style="margin-left:1rem;" @click="reload_onclick">
                <q-tooltip v-text="$t('refresh')"></q-tooltip>
            </q-btn>
        </div>
        
        <div class="basic-dialog-contentarea">
            <div id="spreadsheet_gbone" ref="gspr"></div>
        </div>
    </div>
</div>
`;

export function defineGravityboneDlg(app, Quasar) {
    app.component("GravityboneDlg",{
        template : template,
        props : {
            modelValue : Boolean,
            avatar : VVAvatar,
        },
        emits : [
            "update:model-value"
        ],
        setup(props, context) {
            const {modelValue, avatar } = Vue.toRefs(props);
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
                    spreadsheet : null
                }
            });
            const show = Vue.ref(false);
            const gbdlg_bar = Vue.ref(null);
            const gbdlg = Vue.ref(null);
            const gspr = Vue.ref(null);

            //---watch ----------------------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
                data.value.elements.win.styles.bottom = "0px";
                data.value.elements.win.styles.right = "0px";
            });
            const wa_show = Vue.watch(() => show.value, (newval) => {
                reload_onclick();
            });
            const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
                data.value.elements.panelCSS["q-dark"] = newval;
                data.value.elements.panelCSS["text-dark"] = !newval;
            });

            const close_onclick = () => {
                show.value = false;
                context.emit("update:model-value",show.value);
            }
            const reload_onclick = () => {
                if (!avatar.value) return;

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
            }
            const apply_onclick = () => {
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
            }

            Vue.onMounted(() => {
                interact(gbdlg_bar.value).draggable({
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
                            data.value.elements.win.position.x += event.dx
                            data.value.elements.win.position.y += event.dy
                      
                            gbdlg.value.style.transform =
                              `translate(${data.value.elements.win.position.x}px, ${data.value.elements.win.position.y}px)`;
                        },
                    },
                });

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
                        for (var i = 0; i < records.length; i++) {
                            var x = parseInt(records[i].x);
                            var y = parseInt(records[i].y);
                            var newval = parseFloat(records[i].newValue);
                            var comment = data.value.elements.spreadsheet.getValueFromCoords(0,y);
                            var rootBoneName = data.value.elements.spreadsheet.getValueFromCoords(1,y);
                            if (x == 3) {
                                var param_power = `${comment},${rootBoneName},${newval}`;
                                AppQueue.add(new queueData(
                                    {target:avatar.value.id,method:'SetGravityPower',param:param_power},
                                    "",QD_INOUT.toUNITY,
                                    null
                                ));
                            }else if ((4 <= x) && (x <= 6)) {
                                var ox = data.value.elements.spreadsheet.getValueFromCoords(4,y);
                                var oy = data.value.elements.spreadsheet.getValueFromCoords(5,y);
                                var oz = data.value.elements.spreadsheet.getValueFromCoords(6,y);
                                var param_dir = `${comment},${rootBoneName},${ox},${oy},${oz}`;
                                AppQueue.add(new queueData(
                                    {target:avatar.value.id,method:'SetGravityDirFromOuter',param:param_dir},
                                    "",QD_INOUT.toUNITY,
                                    null
                                ));
                    
                            }
                        }
                        AppQueue.start();
                    }
                });
            });


            return {
                show,data,
                close_onclick,
                reload_onclick,apply_onclick,
                //element--------------
                gbdlg,gbdlg_bar,gspr,
                //watch----------------
                wa_modelValue,wa_show,wa_dark
            }
        }
    });
}
