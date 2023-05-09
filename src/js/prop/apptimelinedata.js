import { UserAnimationEase } from '../../res/appconst.js';
import { VVAnimationProject, VVAvatar, VVCast,VVTimelineTarget } from './cls_vvavatar.js';

export class appDataTimeline {
    constructor() {
        
        this.elements = {
            seekbar : 1,
            boxStyle : {
                height : "250px",
            },
            isExpand : true,
            toggleIcon : "expand_more",
            childKey : {
                val : -1,
                max : -1,
                isEnable : true,
                disable_remove : true,
            }
        };
        this.states = {
            //frameCurrent : 1,
            currentcursor : 1,
            zoomin : true,
            toppanelCSS : {
                "q-dark" : false,
                "text-dark" : true,
            },
            popup : {
                show : false,
                duration : 0,
                easing : GetEnumName(UserAnimationEase, UserAnimationEase.Linear),
                ikmarkers : [],
            }
        };
        this.data = {
            /**
             * VVTimelineTarget is equal to mainData.data.project.casts
             * @type {Array<VVTimelineTarget>}
             */
            timelines : [],
            /**
             * zero-based array index
             * child.text : 1-based index string
             * child.vclass : css
             */
            headercounts : [],
        };
        
    }
}
export const defineAppTimelineData = () => {
    /**
     * @type {appDataTimeline}
     */
    const timelineData = Vue.reactive(new appDataTimeline());
    
    const scroll_header_x = Vue.ref(null);
    const scroll_namebox_y = Vue.ref(null);
    const scroll_keyframe_xy = Vue.ref(null);
    const grid_scrollx = Vue.ref(null);
    const grid_scrolly = Vue.ref(null);


    return {
        timelineData,
        scroll_header_x,scroll_namebox_y,scroll_keyframe_xy,grid_scrollx,grid_scrolly
    }
}