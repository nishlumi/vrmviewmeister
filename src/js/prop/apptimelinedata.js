import { UserAnimationEase } from '../../res/appconst.js';
import { VVAnimationProject, VVAvatar, VVCast,VVTimelineTarget } from './cls_vvavatar.js';

export class appDataTimeline {
    constructor() {
        
        this.elements = {
            panel_styles : {
                height : "250px",
            },
            seekbar : 1,
            seekbar_styles : {
                height : "48px",
            },
            timeline_styles : {
                height : "calc(100% - 48px)",
                zIndex : "100",
            },
            boxStyle : {
                height : "250px",
            },
            isExpand : true,
            toggleIcon : "expand_more",
            mobile_toggleIcon : "keyboard_arrow_up",
            menu : false,
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
                memo : "",
                time : {
                    current : 0,
                    whole : 0,
                }
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
            cnshei : {
                pc : {
                    fold : 48,
                    expand : 250
                },
                mobile : {
                    fold : 96,
                    expand : 298
                }
            },
            oldhei : {
                is_expand : false,
                fold : 0,
                expand : 0
            }
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