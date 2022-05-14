import { VVAnimationProject, VVAvatar, VVCast,VVTimelineTarget } from './cls_vvavatar.js';


export const defineAppTimelineData = () => {
    const timelineData = Vue.ref({
        elements : {
            seekbar : 1,
            boxStyle : {
                height : "250px",
            },
            isExpand : true,
            toggleIcon : "expand_more",
        },
        states : {
            //frameCurrent : 1,
            currentcursor : 1,
            zoomin : true,
            toppanelCSS : {
                "q-dark" : false,
                "text-dark" : true,
            }
        },
        data : {
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
        }
    });
    
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