import { appModelOperator } from "./model/operator.js";
import { AF_MOVETYPE, AF_TARGETTYPE } from "../res/appconst.js";
import { appMainData } from "./prop/appmaindata.js";


/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {appMainData} mainData 
 * @param {*} objlistData 
 * @param {appModelOperator} modelOperator 
 * @returns 
 */
export function defineObjlist (app,Quasar,mainData,objlistData,modelOperator) {
    const { t   } = VueI18n.useI18n({ useScope: 'global' });

    //---computed-----------------------------------------------------
    /**
     * To return List of VVAvatar filtererd by objecttype
     */
     const filtered_objectlist = Vue.computed(() => {
        var arr = [];
        //console.log(objlistData.elements.objecttypes.selected);
        //console.log(mainData.data.vrms);
        //objlistData.elements.objectlist.options.splice(0, objlistData.elements.objectlist.options.length);
        for (var i = 0; i < mainData.data.vrms.length; i++) {
            var obj = mainData.data.vrms[i];
            if ((obj.type != AF_TARGETTYPE.SystemEffect) && 
                (obj.type != AF_TARGETTYPE.Audio) 
            ) {
                if (objlistData.elements.objecttypes.selected.value == AF_TARGETTYPE.Unknown) {
                    arr.push(obj);
                    //objlistData.elements.objectlist.options.push(obj);
                }else{
                    if (obj.type == objlistData.elements.objecttypes.selected.value) {
                        arr.push(obj);
                        //objlistData.elements.objectlist.options.push(obj);
                    }
                }
            }
            
        }
        //console.log(arr);
        return arr;
        //return objlistData.elements.objectlist.options;
    });
    const objectlist_typename = (item) => {
        return GetEnumName(AF_TARGETTYPE, item.type);
    }
    const objectlist_selectedclass = (flag) => {
        return { "list-item-selected" : flag }
    }
    const checkListSelStage = Vue.computed(() => {
        if (!mainData.states.selectedAvatar) return false;
        return mainData.states.selectedAvatar.type == AF_TARGETTYPE.Stage ? true : false;
    });

    //---method-------------------------------------------------------
    const filtered_activecheck = Vue.computed(() => {

    });
    const leftdrawer_minimize = () => {
        if (ID("uimode").value == "mobile") {
            objlistData.elements.drawer.show = false;
            return;
        }
        objlistData.elements.drawer.miniState = !objlistData.elements.drawer.miniState;

        var qw = Quasar.Screen.width;
        var qh = Quasar.Screen.height;
        var qn = Quasar.Screen.name;

        var w = parseInt(mainData.elements.canvas.scrollArea.width);
        var dw = objlistData.elements.drawer.width;
        var dmw = objlistData.elements.drawer.miniwidth;

        
        if (qn != "xs") {
            if (qn == "sm") {
                if (qh > qw) {
                    dw = 0;
                    dmw = 0;
                }
            }
            if (objlistData.elements.drawer.miniState) {
                mainData.elements.canvas.scrollArea.width = `${w + dw - dmw}px`;
            }else{
                mainData.elements.canvas.scrollArea.width = `${w + dmw - dw}px`;
            }
        }

        //---new version
        //objlistData.elements.drawer.show = false;
        //objlistData.elements.minidrawer.show = true;

        //mainData.elements.canvas.scrollArea.width = `${w - dw + dmw}px`;
    }
    const leftminidrawer_minimize = () => {
        objlistData.elements.drawer.show = true;
        objlistData.elements.minidrawer.show = false;

        var w = parseInt(mainData.elements.canvas.scrollArea.width);
        var dw = objlistData.elements.drawer.width;
        var dmw = objlistData.elements.drawer.miniwidth;

        //---canvas width 
        mainData.elements.canvas.scrollArea.width = `${w - dmw + dw}px`;
    }
    const timeline_leftdrawer_minimize = () => {
        objlistData.elements.drawer.show = true;
        objlistData.elements.minidrawer.show = true;
    }
    const getCurrentModeSize = (w, h) => {
        if ((Quasar.Screen.name == "sm") ||
            (Quasar.Screen.name == "xs")
        ){
            if (objlistData.elements.drawer.miniState) {
                if (h <= w) {
                    return objlistData.elements.drawer.miniwidth;
                }else{
                    return 0;
                }
            }else{
                if (objlistData.elements.drawer.show) {
                    if (ID("uimode").value == "mobile") {
                        return 0;
                    }else{
                        return objlistData.elements.drawer.width;
                    }
                    
                }else{
                    return 0;
                }
            }
        }else{
            if (objlistData.elements.drawer.show) {
                return (objlistData.elements.drawer.miniState) ? objlistData.elements.drawer.miniwidth : objlistData.elements.drawer.width;
            }else{
                return (objlistData.elements.drawer.miniState) ? objlistData.elements.drawer.miniwidth : 0;
                //return objlistData.elements.drawer.width;
            }

            //else if (objlistData.elements.minidrawer.show) {
            //    return objlistData.elements.drawer.miniwidth;
            //}
            
        }
    }
    const setupMobileSize = (w, h) => {
        var w2 = w * 2;
        if (Quasar.Screen.name == "sm"){
            //objlistData.elements.drawer.behavior = "mobile";
            /*
            if (h <= w) { //---landscape
                objlistData.elements.drawer.show = true;
                objlistData.elements.drawer.miniState = true;
            }else if (h <= w2) { //---landscape by double width ?
                objlistData.elements.drawer.show = true;
                objlistData.elements.drawer.miniState = true;
                if (Quasar.Screen.name == "xs") objlistData.elements.drawer.show = false;
            }else{ //---real portrait
                objlistData.elements.drawer.show = false;
                objlistData.elements.drawer.miniState = false;
            }*/
            if (ID("uimode").value == "mobile") {
                objlistData.elements.drawer.show = false;
                objlistData.elements.drawer.miniState = false;
            }else{
                objlistData.elements.drawer.show = true;
                objlistData.elements.drawer.miniState = true;
            }
        }
        else if (Quasar.Screen.name == "xs") {
            objlistData.elements.drawer.show = false;
            objlistData.elements.drawer.miniState = false;
        }else{
            if (ID("uimode").value == "mobile") {
                objlistData.elements.drawer.show = false;
                //objlistData.elements.drawer.miniState = false;
            }
        }
    }
    /**
     * objectlist clicked = <object-list> v-model changed
     * @returns {String} item's id
     */
    const objectlist_onclicked = (item) => {
        if (item != null) {
            //---send information to Unity
            //console.log(item);
            //---fire watch event of <object-list> = METHOD: select_objectItem    
            mainData.states.selectedAvatar = item;
        }
    }
    const listmenu_rename_onclick = () => {
        appPrompt(t("mm_objlist_rename_msg"),(value) => {
            mainData.states.selectedAvatar.title = value;
        },mainData.states.selectedAvatar.title);
    }
    const listmenu_info_onclick = () => {
        modelOperator.getVRMInfo(mainData.states.selectedAvatar,true);
    }
    const listmenu_focus_onclick = () => {
        var sel = mainData.states.selectedAvatar;
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'CenteringCameraForAvatar',param:sel.id},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const listmenu_addkeyframe_onclick = () => {
        var movearr = [AF_MOVETYPE.Translate, AF_MOVETYPE.NormalTransform, AF_MOVETYPE.AllProperties];
        var bonearr = modelOperator.selectInitialTargetBones(mainData.states.selectedAvatar.type);
        modelOperator.addKeyFrame(
            mainData.states.selectedAvatar,
            bonearr,
            movearr,
            "append"
        );
    }
    const listmenu_overwritekeyframe_onclick = () => {
        modelOperator.ribbonData.elements.frame.showtarget = "object";
        modelOperator.ribbonData.elements.frame.showdlg = true;
        return;
        var movearr = [AF_MOVETYPE.Translate, AF_MOVETYPE.NormalTransform, AF_MOVETYPE.AllProperties];
        var bonearr = modelOperator.selectInitialTargetBones(mainData.states.selectedAvatar.type);
        modelOperator.addKeyFrame(
            mainData.states.selectedAvatar,
            bonearr,
            movearr,
            "overwrite"
        );
    }
    const listmenu_allbonereset_onclick = () => {
        AppQueue.add(new queueData(
            {target:AppQueue.unity.OperateActiveVRM,method:'ResetAllHandle'},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    const listmenu_removeobj_onclick = () => {
        appConfirm(t("msg_vrm_delconfirm"),() => {
            modelOperator.removeBodyObject(mainData.states.selectedAvatar);
            AppQueue.start();
        });
    }
    const listmenu_removerole_onclick = () => {
        appConfirm(t("msg_vrm_delconfirm2"),()=>{
            //---delete role and timeline
            modelOperator.del_roleAndTimelilne(mainData.states.selectedCast,mainData.states.selectedCast.type);
            //---delete cast (object)
            modelOperator.removeBodyObject(mainData.states.selectedAvatar);
            AppQueue.start();
        });
    }    

    Vue.onMounted(() => {
        //objlistData.elements.drawer.width = Quasar.Screen.width * 0.25;
        //objlistData.elements.drawer.breakpoint = objlistData.elements.drawer.width * 2;

        //objlistData.elements.drawer.side = side.value;
    });

    const leftdrawer = Vue.ref(null);

    return {
        objlistEvent : Vue.reactive({
            filtered_objectlist,objectlist_typename,objectlist_selectedclass,checkListSelStage,
            leftdrawer_minimize,getCurrentModeSize,setupMobileSize,
            leftminidrawer_minimize,timeline_leftdrawer_minimize,
            objectlist_onclicked,
            //---context menu---
            listmenu_rename_onclick,listmenu_info_onclick,listmenu_focus_onclick,
            listmenu_addkeyframe_onclick,listmenu_overwritekeyframe_onclick,
            listmenu_allbonereset_onclick,listmenu_removeobj_onclick,listmenu_removerole_onclick,
        }),
        leftdrawer
    }
}