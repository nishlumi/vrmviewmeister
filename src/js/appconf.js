import { VFileHelper } from "../../public/static/js/filehelper";

export class VVConfigTemplate {
    constructor() {
        this.application = {
            UseMemory : 2.0,
            MouseWheelSpeed : 2.0,
            CameraKeymoveSpeed : 0.1,
            UseHTMLCanvasForScreenShot : false,
            UseDarkTheme : false,
            focus_camera_onselect :false,
            distance_camera_viewpoint : 2.5,
            stock_opened_file_history : true,
            shortcut_vrminfo_from_history : false,
            use_fsaa_for_history : false,
            not_autoload_over_mb : 50,
            enable_backup : true,
            backup_project_interval : 1
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
            interlock_body_pelvis : true,
            interlock_body_arms : false,
            interlock_body_legs : true,
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
        for (var obj in this.confs.application) {
            cp.confs.application[obj] = this.confs.application[obj]
        }
        for (var obj in this.confs.model) {
            cp.confs.model[obj] = this.confs.model[obj]
        }
        for (var obj in this.confs.animation) {
            cp.confs.animation[obj] = this.confs.animation[obj]
        }
        return cp;
    }
    save() {
        let textdata = JSON.stringify(this.confs);
    
        localStorage.setItem(this._info.setname,textdata);

        localStorage.setItem(this._info.setcloudname,JSON.stringify(this.clouds));
    }
    load() {
        var textdata = localStorage.getItem(this._info.setname);
        if (textdata) {
            var tmp = JSON.parse(textdata);

            //---config (probably add after)
            for (var obj in this.confs) { //---category
                var category = this.confs[obj];
                if (obj in tmp) { //---has saved category ?
                    var fileCategory = tmp[obj];
                    for (var setone in fileCategory) {
                        var so = fileCategory[setone];  //each config in the category
                        if (setone in category) {
                            category[setone] = so;
                        }
                    }
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
            {target:AppQueue.unity.Canvas,method:'SetValFromOuter',param:
                `float,${"camera_keymove_speed"},${this.confs.application.CameraKeymoveSpeed ? 1 : 0}`
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
            {target:AppQueue.unity.Canvas,method:'SetValFromOuter',param:
                `int,${"distance_camera_viewpoint"},${this.confs.application.distance_camera_viewpoint}`
            },
            "",QD_INOUT.toUNITY,
            null
        ));

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
            {target:AppQueue.unity.Canvas,method:'SetValFromOuter',param:
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

        //AppQueue.start();

        VFileHelper.flags.isHistoryFSAA = this.confs.application.use_fsaa_for_history;
       
    }
    openFormTemplate() {

    }
}

export class AppDBMeta {
    /**
     * 
     * @param {String} f fullname
     * @param {String} n name
     * @param {Number} s size
     * @param {String} t type
     * @param {Date} c created date
     * @param {Date} u updated date
     */
    constructor(f, n, s, t, c, u) {
        /**
         * @type {String}
         */
        this.fullname = f || "";
        /**
         * @type {String}
         */
        this.name = n || "";
        /**
         * @type {Number}
         */
        this.size = s || 0;
        /**
         * @type {String}
         */
        this.type = t || "";
        /**
         * @type {Date}
         */
        this.createdDate = c || new Date();
        /**
         * @type {Date}
         */
        this.updatedDate = u || new Date();
    }
}