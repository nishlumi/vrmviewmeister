
import { AF_TARGETTYPE, IKBoneType } from "../res/appconst.js";
import { UnityVector3 } from "./prop/cls_unityrel.js";
import { VVAvatar } from "./prop/cls_vvavatar.js";

const template = `
<div ref="btpdlg" v-show="show" :class="data.elements.panelCSS" class="rounded-borders shadow-2" :style="data.elements.win.styles">
    <div ref="btpdlg_bar" v-touch-pan.prevent.mouse="handlePan" class="basic-dialog-titlebar bg-primary text-grey-1 q-pa-xs">
        <div class="row">
            <div>{{ $t('title_bonetransform') }}</div>
            <q-space></q-space>
            <q-btn flat round dense size="md" icon="clear" @click="close_onclick"></q-btn>
        </div>
        
    </div>
    <div :class="data.elements.panelCSS" style="width:100%;height:calc(100% - 40px);">
        <div class="row basic-dialog-toolbar">
            <q-btn flat round dense icon="bookmark_added" @click="apply_onclick" :disabled="data.elements.header.btndisable">
                <q-tooltip v-text="$t('apply pose')"></q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="refresh" style="margin-left:1rem;" @click="reload_onclick" :disabled="data.elements.header.btndisable">
                <q-tooltip v-text="$t('refresh')"></q-tooltip>
            </q-btn>
            <q-separator spaced inset vertical dark></q-separator>
            <q-btn flat round dense icon="mdi-mirror" style="margin-left:1rem;" @click="mirrorpose_onclick" :disabled="data.elements.header.btndisable">
                <q-tooltip v-text="$t('reverse pose')"></q-tooltip>
            </q-btn>
        </div>
        
        <div class="basic-dialog-contentarea">
            <div :class="data.elements.sprPanelCSS.forVRM">
                <div id="spreadsheet_bone" ref="spr"></div>
            </div>
            <div :class="data.elements.sprPanelCSS.forOther">
                <h1>Not VRM</h1>
            </div>
        </div>
    </div>
</div>
`;

export function defineBonetranDlg(app, Quasar) {
    app.component("BonetranDlg",{
        template : template,
        props : {
            modelValue : Boolean,
            avatar : VVAvatar,
        },
        emits : [
            "update:model-value"
        ],
        setup(props, context) {
            const {modelValue, avatar, callback} = Vue.toRefs(props);
            const data = Vue.ref({
                elements : {
                    win : {
                        styles : {
                            position : "absolute",
                            bottom : "-9999px",
                            right : "-9999px",
                            width : "865px",
                            height : "500px",
                            zIndex : 5000,
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
                    spreadsheet : null,
                    header : {
                        btndisable : false
                    },
                    sprPanelCSS : {
                        forVRM : {
                            "spr-panel-top" : true,
                            "spr-panel-back" : false
                        },
                        forOther : {
                            "spr-panel-top" : false,
                            "spr-panel-back" : true
                        }
                    }
                }
            });
            const show = Vue.ref(false);
            const btpdlg_bar = Vue.ref(null);
            const btpdlg = Vue.ref(null);
            const spr = Vue.ref(null);

            //---watch ----------------------------------------
            const wa_modelValue = Vue.watch(() => modelValue.value, (newval) => {
                show.value = newval;
                if (ID("uimode").value == "mobile") {
                    data.value.elements.win.styles["top"] = `${Quasar.Screen.height * 0.1}px`;
                    delete data.value.elements.win.styles["bottom"];
                    data.value.elements.win.styles.width = `${Quasar.Screen.width * 0.95}px`;
                    data.value.elements.win.styles["max-height"] = `${Quasar.Screen.height * 0.95}px`;
                }else{
                    data.value.elements.win.styles.bottom = "0px";
                }
                data.value.elements.win.styles.right = "0px";
            
                data.value.elements.win.position.x = 0;
                data.value.elements.win.position.y = 0;
                btpdlg.value.style.transform =
                    `translate(${data.value.elements.win.position.x}px, ${data.value.elements.win.position.y}px)`;
            });
            const wa_show = Vue.watch(() => show.value, (newval) => {
                reload_onclick();
            });

            const wa_dark = Vue.watch(() => Quasar.Dark.isActive,(newval) => {
                data.value.elements.panelCSS["q-dark"] = newval;
                data.value.elements.panelCSS["text-dark"] = !newval;
            }); 
            const wa_avatar_type = Vue.watch(() => avatar.value,(newval,oldval) => {
                if (!newval) return;
                if (!oldval) return;

                if (newval.type != oldval.type) {
                    if (newval.type == AF_TARGETTYPE.VRM) {
                        data.value.elements.sprPanelCSS.forVRM["spr-panel-top"] = true;
                        data.value.elements.sprPanelCSS.forVRM["spr-panel-back"] = false;
                        data.value.elements.sprPanelCSS.forOther["spr-panel-top"] = false;
                        data.value.elements.sprPanelCSS.forOther["spr-panel-back"] = true;

                        data.value.elements.header.btndisable = false;
                    }else{
                        data.value.elements.sprPanelCSS.forVRM["spr-panel-top"] = false;
                        data.value.elements.sprPanelCSS.forVRM["spr-panel-back"] = true;
                        data.value.elements.sprPanelCSS.forOther["spr-panel-top"] = true;
                        data.value.elements.sprPanelCSS.forOther["spr-panel-back"] = false;

                        data.value.elements.header.btndisable = true;
                    }
                    
                }
            },{deep:true});

            //---event---------------------------------------------------------------
            const close_onclick = () => {
                show.value = false;
                context.emit("update:model-value",show.value);
            }
            const reload_onclick = () => {
                if (!avatar.value) return;

                AppQueue.add(new queueData(
                    {target:avatar.value.id,method:'GetIKTransformAll'},
                    "alliktransform",QD_INOUT.returnJS,
                    (val) => {
                        const mathr = (val) => {
                            const deci = 100000;
                            return Math.round(val * deci) / deci;
                        }
                        var js = JSON.parse(val);

                        for (var i = 0; i < js.list.length; i++) {
                            data.value.elements.spreadsheet.setValueFromCoords(
                                1, i,
                                mathr(js.list[i].position.x)
                            );
                            data.value.elements.spreadsheet.setValueFromCoords(
                                2, i,
                                mathr(js.list[i].position.y)
                            );
                            data.value.elements.spreadsheet.setValueFromCoords(
                                3, i,
                                mathr(js.list[i].position.z)
                            );
                            data.value.elements.spreadsheet.setValueFromCoords(
                                4, i,
                                js.list[i].rotation.x
                            );
                            data.value.elements.spreadsheet.setValueFromCoords(
                                5, i,
                                js.list[i].rotation.y
                            );
                            data.value.elements.spreadsheet.setValueFromCoords(
                                6, i,
                                js.list[i].rotation.z
                            );
                            data.value.elements.spreadsheet.setValueFromCoords(
                                7, i,
                                js.list[i].drag
                            );
                            data.value.elements.spreadsheet.setValueFromCoords(
                                8, i,
                                js.list[i].anglarDrag
                            );
            
                        }
                    }
                ));
                AppQueue.start();
            }
            const apply_onclick = () => {
                var ldata = data.value.elements.spreadsheet.getData();
                var lists = [];
                for (var i = 0; i < ldata.length; i++) {
                    var ln = ldata[i];
                    lists.push({
                        ikname : ln[0],
                        position : new UnityVector3(parseFloat(ln[1]),parseFloat(ln[2]),parseFloat(ln[3])),
                        rotation : new UnityVector3(parseFloat(ln[4]),parseFloat(ln[5]),parseFloat(ln[6])),
                        useCollision : 0, //ln[7] == 1 ? 1 : 0,
                        useGravity : 0, //ln[8] == 1 ? 1 : 0,
                        drag : isNaN(parseFloat(ln[7])) == false ? parseFloat(ln[8]) : 10,
                        anglarDrag : isNaN(parseFloat(ln[7])) == false ? parseFloat(ln[8]) : 10,
    
                    });
                }
                var param = JSON.stringify({
                    list : lists
                });
                if (avatar.value.type == AF_TARGETTYPE.VRM) {
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:0},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                    AppQueue.add(new queueData(
                        {target:avatar.value.id,method:'SetIKTransformAll',param:param},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:1},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                    AppQueue.start();
                }
            }
            const mirrorpose_onclick = () => {
                var setCell = (x, y, val) => {
                    data.value.elements.spreadsheet.setValueFromCoords(x, y, val);
                }
                var sdata = data.value.elements.spreadsheet.getData();
                var posx = 1; var posy = 2; var posz = 3; var rotx = 4; var roty = 5; var rotz = 6;
                
                //---EyeviewHandle
                setCell(posx, IKBoneType.EyeViewHandle, sdata[1][posx] * -1);
                
                //---Head
                setCell(posx, IKBoneType.Head, sdata[2][posx] * -1);
        
                //---LookAt
                setCell(posx, IKBoneType.LookAt, sdata[3][posx] * -1);
        
                //---Aim
                setCell(posx, IKBoneType.Aim, sdata[4][posx] * -1);
        
                //---Chest
                setCell(posx, IKBoneType.Chest, sdata[5][posx] * -1);
        
                //---Pelvis
                setCell(posx, IKBoneType.Pelvis, sdata[6][posx] * -1);
        
                var mirrorLR = function(tleft, tright)  {
                    setCell(posx, tleft, sdata[tright][posx] * -1);
                    setCell(posy, tleft, sdata[tright][posy]);
                    setCell(posz, tleft, sdata[tright][posz]);
                    setCell(rotx, tleft, sdata[tright][rotx]);
                    setCell(roty, tleft, sdata[tright][roty] * -1);
                    setCell(rotz, tleft, sdata[tright][rotz] * -1);
                }

                //---Right Shouloder from Left
                mirrorLR(IKBoneType.LeftShoulder, IKBoneType.RightShoulder);

                //---Right Lower Arm from Left
                mirrorLR(IKBoneType.LeftLowerArm, IKBoneType.RightLowerArm);
        
                //---Right Hand from Left
                mirrorLR(IKBoneType.LeftHand, IKBoneType.RightHand);
        
                //---Left Shouloder from Right
                mirrorLR(IKBoneType.RightShoulder, IKBoneType.LeftShoulder);

                //---Left Lower Arm from Right
                mirrorLR(IKBoneType.RightLowerArm, IKBoneType.LeftLowerArm);
        
                //---Left Hand from Right
                mirrorLR(IKBoneType.RightHand, IKBoneType.LeftHand);
        
                //---------------------------------------------------------
                //---Left Lower Leg from Right
                mirrorLR(IKBoneType.LeftLowerLeg, IKBoneType.RightLowerLeg);
        
                //---Left Foot from Right
                mirrorLR(IKBoneType.LeftLeg, IKBoneType.RightLeg);
        
                //---Right Lower Leg from Left
                mirrorLR(IKBoneType.RightLowerLeg, IKBoneType.LeftLowerLeg);
        
                //---Right Foot from Left
                mirrorLR(IKBoneType.RightLeg, IKBoneType.LeftLeg);

                //---Toes don't matter.
            }

            const handlePan = ({ evt, ...newInfo }) => {
                var dx = newInfo.delta.x;
                var dy = newInfo.delta.y;
                data.value.elements.win.position.x += dx;
                data.value.elements.win.position.y += dy;
            
                btpdlg.value.style.transform =
                    `translate(${data.value.elements.win.position.x}px, ${data.value.elements.win.position.y}px)`;
            }

            Vue.onMounted(() => {

                //---spreadsheet
                var bonedata = [];
                for (var obj in IKBoneType) {
                    if (
                        ((IKBoneType[obj] >= IKBoneType.IKParent) && (IKBoneType[obj] <= IKBoneType.RightLeg))
                        ||
                        (IKBoneType[obj] == IKBoneType.LeftToes)
                        ||
                        (IKBoneType[obj] == IKBoneType.RightToes)
                    ) {
                        
                        bonedata.push([obj,0,0,0,0,0,0]);
                    }
                }
                data.value.elements.spreadsheet = jspreadsheet(spr.value, {
                    width : "100%",
                    height : "100%",
                    data: bonedata,
                    columns: [
                        { type: 'text', title: 'Name', width: 200, readOnly : true },
                        { type: 'number', title: 'Position X', width: 100, align : "right" },
                        { type: 'number', title: 'Position Y', width: 100, align : "right" },
                        { type: 'number', title: 'Position Z', width: 100, align : "right"  },
                        { type: 'number', title: 'Rotation X', width: 100, align : "right" },
                        { type: 'number', title: 'Rotation Y', width: 100, align : "right" },
                        { type: 'number', title: 'Rotation Z', width: 100, align : "right"  },
                        { type: 'number', title: 'drag', width: 50, align : "right"  },
                        { type: 'number', title: 'anglarDrag', width: 50, align : "right"  },
    
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
                    }
                });
            });


            return {
                show,data,
                close_onclick,handlePan,
                reload_onclick,apply_onclick,mirrorpose_onclick,
                //element--------------
                btpdlg,btpdlg_bar,spr,
                //watch----------------
                wa_modelValue,wa_show,wa_dark,
                wa_avatar_type,
            }
        }
    });
}
