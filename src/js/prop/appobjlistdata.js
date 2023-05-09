import { VVAvatar } from "./cls_vvavatar.js";
import { AF_TARGETTYPE } from "../../res/appconst.js";

export const defineAppObjlistData = (mainData) => {
    const tmpobjecttypes = [
        {value:AF_TARGETTYPE.Unknown, label:"All Objects"},
        {value:AF_TARGETTYPE.VRM, label:"VRM"},
        {value:AF_TARGETTYPE.OtherObject, label:"Other Object"},
        {value:AF_TARGETTYPE.Light, label:"Light"},
        {value:AF_TARGETTYPE.Camera, label:"Camera"},
        {value:AF_TARGETTYPE.Text, label:"Text UI"},
        {value:AF_TARGETTYPE.Image, label:"Image Object"},
        {value:AF_TARGETTYPE.UImage, label:"Image UI"},
        {value:AF_TARGETTYPE.Effect, label:"Effect"},
        {value:AF_TARGETTYPE.Stage, label:"Stage"},
    ];
    const objlistData = Vue.ref({
        elements : {
            drawer : {
                show : true,
                miniState : false,
                side : "left",
                width : 225,
                miniwidth : 60,
                breakpoint : 300
            },
            objecttypes : {
                selected : tmpobjecttypes[0],
                options : tmpobjecttypes
            },
            objectlist : {
                /**
                 * @type {VVAvatar}
                 */
                selected: null,
                /**
                 * @type {Array<VVAvatar>}
                 */
                options : [],
            },
            menu : false,
        }
    });
    
    return {
        objlistData,
        
    }
}