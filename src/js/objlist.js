import { appModelOperator } from "./model/operator.js";
import { AF_TARGETTYPE } from "../res/appconst.js";


/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {*} mainData 
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
        objlistData.elements.drawer.miniState = !objlistData.elements.drawer.miniState;

        var w = parseInt(mainData.elements.canvas.scrollArea.width);
        if (objlistData.elements.drawer.miniState) {
            mainData.elements.canvas.scrollArea.width = `${w + objlistData.elements.drawer.width - objlistData.elements.drawer.miniwidth}px`;
        }else{
            mainData.elements.canvas.scrollArea.width = `${w + objlistData.elements.drawer.miniwidth - objlistData.elements.drawer.width}px`;
        }
    }
    const getCurrentModeSize = () => {
        return (objlistData.elements.drawer.miniState) ? objlistData.elements.drawer.miniwidth : objlistData.elements.drawer.width;
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
        modelOperator.addKeyFrame(mainData.states.selectedAvatar);
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
            leftdrawer_minimize,getCurrentModeSize,
            objectlist_onclicked,
            //---context menu---
            listmenu_rename_onclick,listmenu_info_onclick,listmenu_focus_onclick,
            listmenu_addkeyframe_onclick,listmenu_allbonereset_onclick,listmenu_removeobj_onclick,listmenu_removerole_onclick,
        }),
        leftdrawer
    }
}