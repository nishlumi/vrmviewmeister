import { VFileHelper } from "../../public/static/js/filehelper";
import { UnityVector3 } from "./prop/cls_unityrel";

export class VVConfigTemplate {
    constructor() {
        this.application = {
            UseMemory : 2.0,
            MouseWheelSpeed : 2.0,
            CameraKeymoveSpeed : 0.01,
            CameraKeyrotateSpeed : 0.5,
            UseHTMLCanvasForScreenShot : false,
            UseDarkTheme : false,
            focus_camera_onselect :false,
            distance_camera_viewpoint : 2.5,
            show_camera_target_object : true,
            stock_opened_file_history : true,
            shortcut_vrminfo_from_history : false,
            use_fsaa_for_history : false,
            not_autoload_over_mb : 50,
            enable_backup : true,
            backup_project_interval : 1,
            is_externalwin_capture: true,
            is_externalwin_keyframe : false,
            is_externalwin_pose : true,
            is_externalwin_bonetran : true,
            is_externalwin_gravitybone: false,
            is_externalwin_transref: false,
            is_externalwin_easyik: false,
            vpad_rotaterate : 0.1,
            vpad_translaterate : 1,
            vrar_moverate : 0.1,
            vrar_rotaterate : 1,
            use_gamepad: true,
            gamepad_using_html: false
        };
        this.model = {
            use_animation_generic_when_otherobject :false,
            ikbone_adjust_leg_x : 1.0,
            ikbone_adjust_leg_y : 1.0,
            ikbone_adjust_leg_z : 1.0,
            save_pose_thumbnail_also : true,
            apply_pose_global_position : true,
            enable_foot_autorotate : false,
            body_natural_limit : false,
            interlock_body_chest : true,
            interlock_body_aim : true,
            interlock_body_pelvis : true,
            interlock_body_arms : false,
            interlock_body_legs : true,
            vrarctrl_panel_left : 1,
            vrarctrl_panel_right : 0,
            vrar_save_camerapos : false,
            vrar_camera_initpos_x : 0,
            vrar_camera_initpos_y : 0,
            vrar_camera_initpos_z : 0,
            related_left_armhand : true,
            related_right_armhand : true
        };
        this.animation = {
            initial_framecount : 60,
            recover_firstpose_whenfinished : false,
            recover_firstpose_timeout : 0,
            base_duration : 0.01,
            recover_pose_whenselected : true,
            preview_onlyselected_whenselected : false,
            off_ikmarker_during_play_animation : false,
            /*NOT USE*/remove_emptytimeline_whensave : false,
            /*NOT USE*/with_compling : false,
            /*NOT USE*/play_with_record_movie : false,
            recover_tomax_overframe : true,
            enable_audio_record : false,
            save_previous_value_in_keyframeregister : false,
            onion_skin_color : "#FF0000",            
        };
        this.fileloader = {
            gdrive : {
                url: "",
                apikey: "",
                enabled : true,
                server : {
                    pose : "1cJkuegzP0FBVJ0XE4uyhu4qF32WZAME7",
                    motion : "11Atv_WPyrh892VKZL7o0ZZgulvFQ1ECq",
                    project : "16umkEygK1mkD_g1tisDzpTjoIOCsbmbe",
                },
                user : {
                    pose : "",
                    motion : "",
                    project : "",
                    vrm : "",
                    other : "",
                    image : "",
                },
                userByName : {
                    pose : false,
                    motion : false,
                    project : false,
                    vrm : false,
                    other : false,
                    image : false,
                }
            },
            easyik : {
                sampleurl : "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgPoXgJM4OC2CAWgvu2VXR-CDsKURfRevjQ8uklHWL5I9ARlZ7a9toycaNYvs4_ldh4Nd2I31m4xR_/pub?gid=0&single=true&output=tsv",
            }
        }
        this.aiapis = {
            baseurl : "",
            txt2img : {
                orig_width: 256,
                orig_height: 256,
                sampler_name: "k_euler_a",
                steps: 20,
                cfg_scale: 12.0,
                n_iter: 1,
                seed: -1,
                base_size: 512,
                max_size: 704,
                batch_count: 1,
                batch_size: 1,
                tiling: false,
                use_gfpgan: false,
            },
            img2img : {
                mode: 0, //0 - default, 1 - inpaint, 3 - upscale, 2 - loopback (unsupported)
                prompts: "",
                sampler_name: "k_euler_a",
                steps: 50,
                cfg_scale: 12.0,
                denoising_strength: 0.35,
                n_iter: 1,
                seed: -1,
                base_size: 512,
                max_size: 704,
                batch_size: 1,
                batch_count: 1,
                tiling: false,

                upscale_overlap: 64,
                upscaler_name: "None",// # None, Lanczos, RealESRGAN

                inpainting_fill: 0,
                inpaint_full_res: false,
                mask_blur: 0,

                use_gfpgan: false,
            }

        };
    }
    
}
export class VVCloudConfigTemplate {
    constructor() {
        this.gdrive = {
            logined : false,
            authinfo : {
                act : {},
                confid : "",
                ak : "",
                ci : "",
                pic_ak :"",
            },
            user : {
                name : "",
                mail : "",
                imageurl : ""
            }
        };
        this.dropbox = {
            logined : false,
            base_url : "",
            auth_url : "",
            authinfo : {
                ak : "",
                act : {},
            },
            user : {
                name : "",
                mail : "",
                imageurl : ""
            }
        };
        this.onedrive = {
            logined : false,
            authinfo : {},
            user : {
                name : "",
                mail : "",
                imageurl : ""
            }
        };
    }
}

export class VVAppConfig{
    constructor() {
        this._info = {
            setname : "_vvie_aco",
            setcloudname : "_vvie_clo",
        }
        
        /**
         * @type {VVConfigTemplate}
         */
        this.confs = new VVConfigTemplate();
        this.clouds = new VVCloudConfigTemplate();
       
        this.data = {
            lastfiles : [],
            backupID : null,
        }
    }
    uninstall() {        
        localStorage.removeItem(this._info.setname);
        
    }
    copy() {
        var cp = new VVAppConfig();
        /*for (var obj in this.confs.application) {
            cp.confs.application[obj] = this.confs.application[obj];
        }
        for (var obj in this.confs.model) {
            cp.confs.model[obj] = this.confs.model[obj];
        }
        for (var obj in this.confs.animation) {
            cp.confs.animation[obj] = this.confs.animation[obj];
        }        
        for (var obj in this.confs.fileloader) {
            cp.confs.fileloader[obj] = this.confs.fileloader[obj];
        }
        for (var obj in this.confs.aiapis) {
            cp.confs.aiapis[obj] = this.confs.aiapis[obj];
        }*/
        cp.confs.application = Vue.toRaw(this.confs.application);
        cp.confs.model = Vue.toRaw(this.confs.model);
        cp.confs.animation = Vue.toRaw(this.confs.animation);
        cp.confs.fileloader = Vue.toRaw(this.confs.fileloader);
        cp.confs.aiapis = Vue.toRaw(this.confs.aiapis);
        return cp;
    }
    save() {
        let textdata = JSON.stringify(this.confs);
    
        localStorage.setItem(this._info.setname,textdata);

        localStorage.setItem(this._info.setcloudname,JSON.stringify(this.clouds));
    }
    load() {
        var def = new Promise((resolve) => {
            var textdata = localStorage.getItem(this._info.setname);
            if (textdata) {
                var tmp = JSON.parse(textdata);
    
                //---config (probably add after)
                for (var obj in this.confs) { //---category
                    var category = this.confs[obj];
                    var rawcat = Vue.toRaw(this.confs[obj]);
                    if (obj in tmp) { //---has saved category ?
                        var fileCategory = tmp[obj];
                        var merged = this.mergeObjects(rawcat, fileCategory);
                        this.confs[obj] = merged;
    
                        /*
                        for (var setone in fileCategory) {
                            var so = fileCategory[setone];  //each config in the category
                            if (setone in category) {
                                category[setone] = so;
                            }
                        }
                        */
                    }
                }
                //this.data = tmp;
            }
    
            textdata = localStorage.getItem(this._info.setcloudname);
            if (textdata) {
                tmp = JSON.parse(textdata);
                for (var obj in this.clouds) {
                    if (obj in tmp) {
                        this.clouds[obj] = tmp[obj];
                    }
                }
            }
            resolve(this);
        });
        return def;        
    }
    mergeObjects(a, b) {
        if (a === null || a === undefined) {
            return b;
        }
    
        if (b === null || b === undefined) {
            return a;
        }
    
        const result = {};
        for (const key in a) {
            const valueA = a[key];
            const valueB = b[key];
        
            if (typeof valueA === "object" && typeof valueB === "object") {
                result[key] = this.mergeObjects(valueA, valueB);
            } else if (typeof valueA === "object" || typeof valueB === "object") {
                if (valueB === undefined) {
                    result[key] = valueA;
                }else{
                    // プリミティブな値とオブジェクトが混在している場合
                    if (valueA === valueB) {
                    // 値が同じ場合は、そのままマージする
                        result[key] = valueA;
                    } else {
                    // 値が異なる場合は、bの値を上書きする
                        result[key] = valueB;
                    }
                }
                
            } else {
                // プリミティブな値の場合
                if (valueA === valueB) {
                // 値が同じ場合は、そのままマージする
                    result[key] = valueA;
                }else if (valueB === undefined) {
                    result[key] = valueA;
                } else {
                // 値が異なる場合は、bの値を上書きする
                    result[key] = valueB;
                }
            }
        }
    
        for (const key in b) {
            const valueB = b[key];
        
            if (!result.hasOwnProperty(key)) {
                // bにのみ存在するキーの場合
                result[key] = valueB;
            }
        }
    
        return result;
    }
    applyUnity(isOperationFromDialog = true) {
        //---Apply to Unity
        /*
           bool - bool is int in Unity.
           send value as int to Unity.
        */
        
        //---Application tab
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetZoomSpeed',param:parseFloat(this.confs.application.MouseWheelSpeed)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetValFromOuter',param:
                `float,${"camera_keymove_speed"},${this.confs.application.CameraKeymoveSpeed}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetValFromOuter',param:
                `float,${"camera_keyrotate_speed"},${this.confs.application.CameraKeyrotateSpeed}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Canvas,method:'SetValFromOuter',param:
                `int,${"focus_camera_onselect"},${this.confs.application.focus_camera_onselect ? 1 : 0}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'SetTargetAndCameraDistance',param:parseFloat(this.confs.application.distance_camera_viewpoint)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetValFromOuter',param:
                `int,${"distance_camera_viewpoint"},${this.confs.application.distance_camera_viewpoint}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'ShowTargetObject',param:this.confs.application.show_camera_target_object ? "1" : "0"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetMoveRate',param:parseFloat(this.confs.application.vrar_moverate)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetRotateRate',param:parseFloat(this.confs.application.vrar_rotaterate)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Camera,method:'EnableGamePadFromOuter',param:this.confs.application.use_gamepad === true ? "1" : "0"},
            "",QD_INOUT.toUNITY,
            null
        ));

        //---File tab

        //---Model tab
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Canvas,method:'SetValFromOuter',param:
                `int,${"use_animation_generic_when_otherobject"},${this.confs.model.use_animation_generic_when_otherobject ? 1 : 0}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Canvas,method:'SetValFromOuter',param:
                `int,${"ikbone_adjust_leg_x"},${this.confs.model.ikbone_adjust_leg_x}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Canvas,method:'SetValFromOuter',param:
                `int,${"ikbone_adjust_leg_y"},${this.confs.model.ikbone_adjust_leg_y}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Canvas,method:'SetValFromOuter',param:
                `int,${"ikbone_adjust_leg_z"},${this.confs.model.ikbone_adjust_leg_z}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Canvas,method:'SetValFromOuter',param:
                `int,${"save_pose_thumbnail_also"},${this.confs.model.save_pose_thumbnail_also ? 1 : 0}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Canvas,method:'SetValFromOuter',param:
                `int,${"apply_pose_global_position"},${this.confs.model.apply_pose_global_position ? 1 : 0}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetValFromOuter',param:
                `int,${"enable_foot_autorotate"},${this.confs.model.enable_foot_autorotate ? 1 : 0}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetHingeLimited',param:this.confs.model.body_natural_limit ? 1 : 0},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetLimitedBones',param:this.confs.model.interlock_body_chest ? "c,1" : "c,0"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetLimitedBones',param:this.confs.model.interlock_body_aim ? "m,1" : "m,0"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetLimitedBones',param:this.confs.model.interlock_body_pelvis ? "p,1" : "p,0"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetLimitedBones',param:this.confs.model.interlock_body_arms ? "a,1" : "a,0"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetLimitedBones',param:this.confs.model.interlock_body_legs ? "l,1" : "l,0"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetValFromOuter',param:
                `int,${"vrarctrl_panel_left"},${this.confs.model.vrarctrl_panel_left}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetValFromOuter',param:
                `int,${"vrarctrl_panel_right"},${this.confs.model.vrarctrl_panel_right}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetValFromOuter',param:
                `int,${"vrar_save_camerapos"},${this.confs.model.vrar_save_camerapos === true ? 1 : 0}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        var vrarcamerapos = `${this.confs.model.vrar_camera_initpos_x}:${this.confs.model.vrar_camera_initpos_y}:${this.confs.model.vrar_camera_initpos_z}`;
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetValFromOuter',param:
                `str,${"vrar_camera_initpos"},${vrarcamerapos}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetRelatedArm2Hand',param:this.confs.model.related_left_armhand ? "l,1" : "l,0"},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetRelatedArm2Hand',param:this.confs.model.related_right_armhand ? "r,1" : "r,0"},
            "",QD_INOUT.toUNITY,
            null
        ));

        //---Animation tab
        AppQueue.add(new queueData(
            {target:AppQueue.unity.Canvas,method:'SetValFromOuter',param:
                `int,${"recover_tomax_overframe"},${this.confs.animation.recover_tomax_overframe ? 1 : 0}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetInitialTimelineLength',param:parseInt(this.confs.animation.initial_framecount)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetValFromOuter',param:
                `str,${"onion_skin_color"},${this.confs.animation.onion_skin_color}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));

        //AppQueue.start();

        VFileHelper.flags.isHistoryFSAA = this.confs.application.use_fsaa_for_history;
       
        AIManager.setup(this);
    }
    openFormTemplate() {

    }
}

export class AppDBMeta {
    /**
     * 
     * @param {String} fullname fullname
     * @param {String} name name
     * @param {Number} size size
     * @param {String} type type
     * @param {Date} createdate created date
     * @param {Date} updatedate updated date
     */
    constructor(fullname, name, size, type, createdate, updatedate) {
        /**
         * @type {String} file name or file path
         */
        this.fullname = fullname || "";
        /**
         * @type {String} file name
         */
        this.name = name || "";
        /**
         * @type {Number}
         */
        this.size = size || 0;
        /**
         * @type {String}
         */
        this.type = type || "";
        /**
         * @type {Date}
         */
        this.createdDate = createdate || new Date();
        /**
         * @type {Date}
         */
        this.updatedDate = updatedate || new Date();

        /**
         * @type {String} service id
         */
        this.id = "";
    }
}