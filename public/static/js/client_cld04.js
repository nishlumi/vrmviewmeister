var CAPP;


class TimelineDialog {
    constructor() {
        this.elements = {
            timeline : null
        };

        this.generate_ui();
    }
    generate_ui() {
        this.elements.timeline = new VVTimeline(ID("timeline-area"),{
            frameCount : 60,
            showFrameResizeBox : false,
            toolbar : null
            /*[
                {id : "utl_addempty", type: "button", label: _T("Add an empty VRM timeline"), labelAlign:"", title: "", icon:"add_task",
                    callback:()=>{
                        var param = AF_TARGETTYPE.VRM + ", ";
                        AppQueue.add(new queueData(
                            {target:AppQueue.unity.ManageAnimation,method:'CreateEmptyCast', param:param},
                            "createemptyrole",QD_INOUT.returnJS,
                            this.callbackDB.createemptyrole
                        ));
                        AppQueue.start();
                    }
                },
                {id: "utl_deltl", type: "button", label:_T("Remove an empty timeline"), labelAlign:"right",title:"", icon: "delete",
                    callback:() => {
                        console.log("remove the selected timeline!", this.states.selectedTimeline);
                    }
                }
            ]*/
                /*[
                {id : "utl_play", type: "button", label: "", labelAlign:"", title: _T("tl_utl_play_title"), icon:"play_arrow",
                    callback:()=>{
                        this.elements.timeline.playReset();
                        this.elements.timeline.Play();
                    }
                },
                {id : "utl_pause", type: "button", label: "", labelAlign:"", title: _T("tl_utl_pause_title"), icon:"pause",
                    callback:()=>{
                        this.elements.timeline.playPauseResume(this.elements.timeline.states.playing.isPause);
                    }
                },
                {id : "utl_stop", type: "button", label: "", labelAlign:"", title: _T("tl_utl_stop_title"), icon:"stop",
                    callback:()=>{
                        this.elements.timeline.Stop();
                    }
                },
                {id : "utl_div1", type: "divider"},
                {id : "utl_reg1", type: "button", label: _T("tl_utl_reg1"), labelAlign:"right", title:_T("tl_utl_reg1_title"), icon:"add_task",
                    callback:()=>{
                        var aro = new AnimationRegisterOptions();
                        aro.targetId = this.states.selectedAvatar.id;
                        aro.targetType = this.states.selectedAvatar.type;
                        aro.index = this.elements.timeline.states.frame.current;
                        DEBUGLOG(aro);
                        
                        //this.setEventName("backupnowpose");
                        //this.continueEvent(false);
                        //this.callUnitySpecify(this.states.selectedAvatar.id,"BackupAvatarTransform");
                        AppQueue.add(new queueData(
                            {target:AppQueue.unity.ManageAnimation,method:'RegisterFrame',param:JSON.stringify(aro)},
                            "registernowpose",QD_INOUT.returnJS,
                            this.callbackDB.registernowpose
                        ));
                        AppQueue.start();
                    }
                },
                {id : "utl_reg2", type: "button", label: "", labelAlign:"right", title: _T("tl_utl_reg2_title"), icon:"group_add",
                    callback:()=>{
                        //this.setEventName("backupnowpose");
                        //this.continueEvent(false);
                        //this.callUnitySpecify(this.states.selectedAvatar.id,"BackupAvatarTransform");
                        AppQueue.add(new queueData(
                            {target:this.states.selectedAvatar.id,method:'BackupAvatarTransform'},
                            "registernowpose",QD_INOUT.returnJS,
                            this.callbackDB.registernowpose
                        ));
                        AppQueue.start();
                    }
                },
                {id : "utl_del", type: "button", label: "", labelAlign:"right", title: _T("tl_utl_del_title"), icon:"delete",callback:()=>{}},
            ]*/
        });
    
        //===EVENT=======================================================================
        
        this.elements.timeline.on("SelectFrame",(frameNo,frames)=>{
            if (opener.MYAPP.states.animationPlaying) return;
    
            var param = new AnimationParsingOptions();
            param.index = frameNo;
            
            param.isExecuteForDOTween = 1;
            /*
            if (this.states.selectedAvatar) {
                param.targetId = this.states.selectedAvatar.id;
                param.targetRole = this.states.selectedAvatar.role.roleName;
                param.targetType = this.states.selectedAvatar.type;
            }
            */
    
            var js = JSON.stringify(param);
            DEBUGLOG(param,js);
            if (opener.MYAPP.appconf.confs.animation.recover_pose_whenselected.value === true) {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.ManageAnimation,method:'PreviewSingleFrame',param:js},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                //AppQueue.start();
            }
           //---apply object information
           opener.MYAPP.select_objectItem(opener.MYAPP.states.selectedAvatar.id);
        });
        this.elements.timeline.on("SelectTarget",(id)=>{
            //console.log("timeline id=",id);
            opener.MYAPP.states.selectedTimeline = id;
            var ju = ["SystemEffect","BGM","SE","Stage"];
            var ishit = ju.findIndex(m => {
                if (m == id) return true;
                return false;
            })
            if (ishit > -1) {
                $("#utl_deltl").linkbutton("disable");
            }else{
                $("#utl_deltl").linkbutton("enable");
            }
        });
        this.elements.timeline.on("Drag",(timeline,oldval,newval)=>{
            if (oldval == newval) return;
    
            var param = `${opener.MYAPP.states.selectedAvatar.id},${opener.MYAPP.states.selectedAvatar.type},${oldval},${newval}`;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'ChangeFramePosition',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.start();
        });
        /*
        this.elements.timeline.on("Animation",(frameNo,frames)=>{
            for (var obj in frames) {
                if (frames[obj].data) {
                    //this.continueEvent(false);
                    //this.callUnitySpecify(frames[obj].target.id,"RestoreAvatarTransform",JSON.stringify(frames[obj].data.data));
                    AppQueue.add(new queueData(
                        {target:frames[obj].target.id,method:'AnimateAvatarTransform',param:JSON.stringify(frames[obj].data.data)},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                }
            }
            AppQueue.start();
        });
        */

        this.apply_settings();
    }
    loadData() {
        var casts = opener.MYAPP.data.project.casts;

        casts.forEach(item => {
            this.elements.timeline.appendTimeline(item);
        });
    }
    apply_settings() {
        var confs = opener.MYAPP.appconf.confs.application;
        var path = ID("thm_app").href;
        if (confs.UseDarkTheme.value) {
            ID("thm_app").href = path.replace("material-blue","black");
        }else{
            ID("thm_app").href = path.replace("black","material-blue");
        }
    }
}

window.addEventListener('load', function () {
    setupLocale({})
    .then(res => {
        translate_UI();
        CAPP = new TimelineDialog();
        CAPP.loadData();
    });

});
window.addEventListener("beforeunload",function(e){

    return true;
});