import { AF_TARGETTYPE, AF_MOVETYPE, CNS_BODYBONES, IKBoneType, INTERNAL_FILE, FILEEXTENSION_ANIMATION} from "../../res/appconst.js"
import { appModelOperator } from "./operator";
import { AnimationParsingOptions, AnimationRegisterOptions, BvhData, BvhNode, UnityVector3 } from "../prop/cls_unityrel.js";
import { ChildReturner } from "../../../public/static/js/cls_childreturner.js";
import { AppDBMeta } from "../appconf.js";
import { appMainData } from "../prop/appmaindata.js";
import { UnityCallbackFunctioner } from "./callback.js";


export class ChildManager {
    /**
     * child window functions class
     * @param {appModelOperator} parent 
     * @param {appMainData} mainData 
     * @param {UnityCallbackFunctioner} unitycallback
     */
    constructor(parent, mainData, unitycallback) {
        this.modelOperator = parent;
        this.mainData = mainData;
        this.UnityCallback = unitycallback;

        const { t   } = VueI18n.useI18n({ useScope: 'global' });
        this._t = t;

    }
    //==============================================================
    //
    //  child window functions
    //
    //==============================================================

    /**
     * filtering function of the data from child dialog
     * @param {ChildReturner} data 
     */
    filteringFromChildWindow(data) {
        if (data.windowName == "pose") { //---pose dialog
            if (data.funcName == "apply_pose") {
                var js = JSON.parse(data.data);
                this.returnPoseDialogValue(js);
            }else if (data.funcName == "apply_motion") {
                var js = JSON.parse(data.data);
                this.returnMotionDialogValue(js);
            }else if (data.funcName == "savebvhmotion") {
                var js = JSON.parse(data.data);
                this.saveBVHMotion(js);
            }else if (data.funcName == "saveanimmotion") {
                var js = JSON.parse(data.data);
                this.saveAnimMotion(js);
            }else if (data.funcName == "savevrmamotion") {
                var js = JSON.parse(data.data);
                this.saveVRMAMotion(js);
            }
        }else if (data.windowName == "mediapipe") {
            if (data.funcName == "apply_pose") {
                var js = JSON.parse(data.data);
                this.returnMediaPipePose(js);
            }else if (data.funcName == "autoapply_pose") {
                var js = JSON.parse(data.data);
                this.autoApplyMediaPipe(js);
            }
        }else if (data.windowName == "bonetransform") {
            if (data.funcName == "apply_pose") {
                var js = JSON.parse(data.data);
                this.returnBoneTransformApply(js);
            }else if (data.funcName == "call_getikvalue") {
                var js = JSON.parse(data.data);
                this.returnBoneTransformReloadBtn(js);
            }
        }else if (data.windowName == "keyframe") {
            var js = JSON.parse(data.data);
            this.keyframeFiltering(data.funcName,js);
        }else if (data.windowName == "gravitybone") {
            if (data.funcName == "on_afterchange") {
                var js = JSON.parse(data.data);
                this.gravitybone_on_afterchange(js);
            }else if (data.funcName == "reload_onclick") {
                var js = JSON.parse(data.data);
                this.gravitybone_reload_onclick(js);
            }
        }else if (data.windowName == "transref") {
            var js = JSON.parse(data.data);
            if (data.funcName == "call_setpositionikmarker") {
                this.transref_position_onchange(js);
            }else if (data.funcName == "call_setrotationikmarker") {
                this.transref_rotation_onchange(js);
            }
        }else if (data.windowName == "easyik") {
            var js = JSON.parse(data.data);
            if (data.funcName == "easyik_apply_curpose") {
                this.easyik_apply_onclick_curpose(js);
            }else if (data.funcName == "easyik_apply_apply") {
                this.easyik_apply_onclick_applybody(js);
            }else if (data.funcName == "easyik_reload_onclick") {
                this.easyik_reload_onclick(js);
            }
        }
    }
    //----------------------------------------------------------------------------------------------------
    // opener function for PoseDialog
    //----------------------------------------------------------------------------------------------------
    returnPoseDialogValue(pose) {
        if (!this.mainData.states.selectedAvatar) {
            appAlert(this._t("msg_pose_noselectmodel"));
            return;
        }
        if (this.mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
            appAlert(this._t("msg_pose_noselectmodel"));
            return;
        }
        if (!this.mainData.appconf.confs.model.apply_pose_global_position) {
            //---apply global position of pose data or not apply
            for (var i = pose.frameData.frames[0].movingData.length-1; i >= 0; i--) {
                var ln = pose.frameData.frames[0].movingData[i];
                var arr = ln.split(",");
                if (arr[0] == "0") {
                    pose.frameData.frames[0].movingData.splice(i,1);
                }
            }
        }
        AppQueue.add(new queueData(
            {target:this.mainData.states.selectedAvatar.id,method:'AnimateAvatarTransform',param:JSON.stringify(pose)},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
        this.mainData.states.currentEditOperationCount++;
    }
    /**
     * 
     * @param {*} motion motion data
     * @returns 
     */
    returnMotionDialogValue(motion) {
        if (this.mainData.states.selectedAvatar.type != motion.targetType) {
            appAlert(this._t("msg_openmotion_error2"));
            return;
        }
        var tmpcast = this.mainData.states.selectedCast;
        var motiondata = JSON.stringify(motion);

        //---Firstly, set target.
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetLoadTargetSingleMotion',param:tmpcast.roleName},
            "",QD_INOUT.toUNITY,
            null
        ));
        //---Second load a motion data.
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'LoadSingleMotionDirect',param:motiondata},
            "openmotionresult",QD_INOUT.returnJS,
            this.UnityCallback.openmotionresult,
            {callback:this.UnityCallback}
        ));
        {
            var param = new AnimationParsingOptions();
            param.index = 1;
            param.isCameraPreviewing = 0;
            
            param.isExecuteForDOTween = 1;
            param.targetRole = tmpcast.roleName;
            param.targetType = tmpcast.type.toString();

            var js = JSON.stringify(param);

            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'PreviewSingleFrame',param:js},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        AppQueue.start();
        this.mainData.states.currentEditOperationCount++;
    }
    saveBVHMotion (data) {
        if (this.mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
            appAlert(t("msg_error_mediapipe1"));
            return;
        }
        var tmpcast = this.mainData.states.selectedCast;

        var param = tmpcast.roleName + "," + tmpcast.type + ",m";
        //AppQueue.unity.ManageAnimation
        AppQueue.add(new queueData(
            {target:tmpcast.avatar.id,method:'ExportRecordedBVH'},
            "savebvhmotion",QD_INOUT.returnJS,
            this.UnityCallback.savebvhmotion,
            {callback: this.UnityCallback, selRoleTitle: tmpcast.roleTitle}
        ));
        AppQueue.start();
    }
    saveAnimMotion (data) {
        if (this.mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
            appAlert(t("msg_error_mediapipe1"));
            return;
        }
        var tmpcast = this.mainData.states.selectedCast;
        var param = tmpcast.roleName + "," + tmpcast.type + ",m";
        //AppQueue.unity.ManageAnimation
        AppQueue.add(new queueData(
            {target:tmpcast.avatar.id,method:'GenerateAnimationCurve'},
            "savebvhmotion",QD_INOUT.returnJS,
            this.UnityCallback.saveanimmotion,
            {callback: this.UnityCallback, selRoleTitle: tmpcast.roleTitle}
        ));
        AppQueue.start();
    }
    saveVRMAMotion (data) {
        if (this.mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
            appAlert(t("msg_error_mediapipe1"));
            return;
        }
        var tmpcast = this.mainData.states.selectedCast;
        var param = tmpcast.roleName + "," + tmpcast.type + ",m";
        //AppQueue.unity.ManageAnimation
        AppQueue.add(new queueData(
            {target:tmpcast.avatar.id,method:'ExportVRMA'},
            "savebvhmotion",QD_INOUT.returnJS,
            this.UnityCallback.savevrmamotion,
            {callback: this.UnityCallback, selRoleTitle: tmpcast.roleTitle}
        ));
        AppQueue.start();
    }
    //----------------------------------------------------------------------------------------------------
    // Mediapipe window
    //----------------------------------------------------------------------------------------------------
    returnMediaPipePose (pose) {
        if (this.mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
            appAlert(t("msg_error_mediapipe1"));
            return;
        }
        AppQueue.add(new queueData(
            {target:this.mainData.states.selectedAvatar.id,method:'GetIKTransformAll'},
            "saveTPoseInfo",QD_INOUT.returnJS,
            this.UnityCallback.saveTPoseInfo,
            {pose : pose, callback : this.UnityCallback}
        ));
        AppQueue.start();
    }
    applyMediaPipe(pose) {
        //console.log(pose);
        var TwoPoint2CenterCalc = (left, right) => {
            var le2 = parseFloat(Math.abs(left));
            var ri2 = parseFloat(Math.abs(right));

            var calc = (le2 - ri2) * 0.5;

            var dir = 0;
            if (le2 > ri2) {
                dir = -1;
            }else{
                dir = 1;
            }
            return calc * dir;
        }

        var height = parseFloat(this.mainData.states.selectedAvatar.height.replace("cm","").trim());
        var pelvisY = !this.mainData.states.selectedAvatar.TPoseInfo ? 
            parseFloat((height/100.0) * 0.55) 
            : parseFloat(this.mainData.states.selectedAvatar.TPoseInfo.list[6].position.y);
            //: parseFloat(this.states.selectedAvatar.TPoseInfo.y);
        var posx = 1; var posy = 2; var posz = 3; var rotx = 4; var roty = 5; var rotz = 6;
        var pelvis = 6;
        var leftshoulder = IKBoneType.LeftShoulder; var rightshoulder = IKBoneType.RightShoulder; 
        var leftlowerarm = IKBoneType.LeftLowerArm; var rightlowerarm = IKBoneType.RightLowerArm; 
        var lefthand = IKBoneType.LeftHand; var righthand = IKBoneType.RightHand;
        var leftlowerleg = IKBoneType.LeftLowerLeg; var rightlowerleg = IKBoneType.RightLowerLeg; 
        var leftfoot = IKBoneType.LeftLeg; var rightfoot = IKBoneType.RightLeg;

        var poseland = pose.poseWorldLandmarks;
        var unitylist = [];
        //Head ~ Pelvis
        var ss = this.mainData.states.selectedAvatar.TPoseInfo;

        /*
        //---generate ikname array.
        var iknames = [];
        for (var obj in IKBoneType) {
            iknames.push(obj);
        }
        var ikix = 0;


        //---IKParent
        unitylist.push({
            ikname : iknames[IKBoneType.IKParent],
            position : ss.list[0].position,
            rotation : new UnityVector3(180,180,180)
        });

        //---EyeviewHandle
        unitylist.push({
            ikname : iknames[IKBoneType.EyeViewHandle],
            position : new UnityVector3(
                TwoPoint2CenterCalc(poseland[2].x,poseland[5].x),
                ss.list[1].position.y,ss.list[1].position.z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Nose 2 Head
        unitylist.push({
            ikname : iknames[IKBoneType.Head],
            position : new UnityVector3(
                poseland[0].x, pelvisY + Math.abs(poseland[0].y),
                ss.list[2].position.z
            ),
            rotation : new UnityVector3(180,0,180)
        });

        //---Nose 2 LookAt
        unitylist.push({
            ikname : iknames[IKBoneType.LookAt],
            position : new UnityVector3(
                poseland[0].x, pelvisY + Math.abs(poseland[0].y),
                ss.list[3].position.z
            ),
            rotation : new UnityVector3(180,180,180)
        });
        ikix++;

        //---Left Shoulder + Right Shoulder 2 Aim
        var newx = TwoPoint2CenterCalc(poseland[11].x, poseland[12].x);
        var newy = pelvisY + ((Math.abs(poseland[11].y) + Math.abs(poseland[12].y)) * 0.5);
        var newz = TwoPoint2CenterCalc(poseland[11].z, poseland[12].z);
        unitylist.push({
            ikname : iknames[IKBoneType.Aim],
            position : new UnityVector3(
                newz, ss.list[4].position.y,
                ss.list[4].position.z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---2 Chest
        unitylist.push({
            ikname : iknames[IKBoneType.Chest],
            position : new UnityVector3(newx,newy,newz),
            rotation : new UnityVector3(180,0,180)
        });

        //hip 2 Pelvis
        unitylist.push({
            ikname : iknames[IKBoneType.Pelvis],
            position : new UnityVector3(
                TwoPoint2CenterCalc(poseland[23].x, poseland[24].x),
                pelvisY + ((Math.abs(poseland[23].y) + Math.abs(poseland[24].y)) * 0.5) ,
                TwoPoint2CenterCalc(poseland[23].z, poseland[24].z)
            ),
            rotation : new UnityVector3(180,0,180)
        });

        //---Left shoulder
        unitylist.push({
            ikname : iknames[IKBoneType.LeftShoulder],
            position : new UnityVector3(
                poseland[11].x,
                Math.abs(poseland[11].y), //pelvisY + 
                poseland[11].z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Right shoulder
        unitylist.push({
            ikname : iknames[IKBoneType.RightShoulder],
            position : new UnityVector3(
                poseland[12].x,
                Math.abs(poseland[12].y), //pelvisY + 
                poseland[12].z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Left elbow 2 Left Lower Arm
        unitylist.push({
            ikname : iknames[IKBoneType.LeftLowerArm],
            position : new UnityVector3(
                poseland[13].x,
                pelvisY + Math.abs(poseland[13].y),
                poseland[13].z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Right elbow 2 Right Lower Arm
        unitylist.push({
            ikname : iknames[IKBoneType.RightLowerArm],
            position : new UnityVector3(
                poseland[14].x,
                pelvisY + Math.abs(poseland[14].y),
                poseland[14].z
            ),
            rotation : new UnityVector3(180,180,180)
        });
        //---Left wrist 2 left Hand
        unitylist.push({
            ikname : iknames[IKBoneType.LeftHand],
            position : new UnityVector3(
                poseland[15].x,
                pelvisY + Math.abs(poseland[15].y),
                poseland[15].z
            ),
            rotation : new UnityVector3(180,0,180)
        });
        //---Right wrist 2 right Hand
        unitylist.push({
            ikname : iknames[IKBoneType.RightHand],
            position : new UnityVector3(
                poseland[16].x,
                pelvisY + Math.abs(poseland[16].y),
                poseland[16].z
            ),
            rotation : new UnityVector3(180,0,180)
        });


        //---Pelvis ~ Foot
        //---Left knee 2 Left Lower leg
        unitylist.push({
            ikname : iknames[IKBoneType.LeftLowerLeg],
            position : new UnityVector3(
                poseland[25].x,
                pelvisY - Math.abs(poseland[25].y),
                poseland[25].z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Right knee 2 Right Lower leg
        unitylist.push({
            ikname : iknames[IKBoneType.RightLowerLeg],
            position : new UnityVector3(
                poseland[26].x,
                pelvisY - Math.abs(poseland[26].y),
                poseland[26].z
            ),
            rotation : new UnityVector3(180,180,180)
        });

        //---Left ankle 2 Left foot
        unitylist.push({
            ikname : iknames[IKBoneType.LeftLeg],
            position : new UnityVector3(
                poseland[27].x,
                pelvisY - Math.abs(poseland[27].y),
                poseland[27].z
            ),
            rotation : new UnityVector3(180,0,180)
        });

        //---Right ankle 2 Right foot
        unitylist.push({
            ikname : iknames[IKBoneType.RightLeg],
            position : new UnityVector3(
                poseland[28].x,
                pelvisY - Math.abs(poseland[28].y),
                poseland[28].z
            ),
            rotation : new UnityVector3(180,0,180)
        });
        */
        //---newcode---
        unitylist = [];
        poseland.forEach((item, index, arr) => {
            unitylist.push({
                ikname : index.toString(),
                position : new UnityVector3(item.x, item.y, item.z),
                rotation : new UnityVector3(0, 0, 0)
            });
        });
        //---end---
        var param = JSON.stringify({
            list : unitylist
        });
        console.log(param);
        
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:0},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:this.mainData.states.selectedAvatar.id,method:'SetIKTransformAll2',param:param},
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
    autoApplyMediaPipe(pose) {
        var poseland = pose.poseWorldLandmarks;
        var unitylist = [];
        poseland.forEach((item, index, arr) => {
            unitylist.push({
                ikname : index.toString(),
                position : new UnityVector3(item.x, item.y, item.z),
                rotation : new UnityVector3(0, 0, 0)
            });
        });
        //---end---
        var param = JSON.stringify({
            list : unitylist
        });
        
        AppQueue.canvas.SendMessage(AppQueue.unity.ManageAnimation, "SetBoneLimited", 0);
        AppQueue.canvas.SendMessage(this.mainData.states.selectedAvatar.id, "SetIKTransformAll2", param);
        AppQueue.canvas.SendMessage(AppQueue.unity.ManageAnimation, "SetBoneLimited", 1);
        
    }
    //----------------------------------------------------------------------------------------------------
    // bonetransform window
    //----------------------------------------------------------------------------------------------------
    returnBoneTransformApply(data) {
        if (!this.mainData.states.selectedAvatar) {
            appAlert(this._t("msg_pose_noselectmodel"));
            return;
        }
        if (this.mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) {
            appAlert(this._t("msg_pose_noselectmodel"));
            return;
        }
        
        var param = JSON.stringify({
            list : data.list
        });
        if (this.mainData.states.selectedAvatar.type == AF_TARGETTYPE.VRM) {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:0},
                "",QD_INOUT.toUNITY,
                null
            ));
            AppQueue.add(new queueData(
                {target:data.avatarId,method:'SetIKTransformAll',param:param},
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
    returnBoneTransformReloadBtn(data) {
        if (this.mainData.states.selectedAvatar.id != data.avatarId) return;
        if (this.mainData.states.selectedAvatar.type != AF_TARGETTYPE.VRM) return;

        AppQueue.add(new queueData(
            {target:this.mainData.states.selectedAvatar.id,method:'GetIKTransformAll'},
            "alliktransform",QD_INOUT.returnJS,
            (val) => {
                var js = JSON.parse(val);

                var clsdata = {
                    //avatarId : this.mainData.states.selectedAvatar.id,
                    //avatarType: this.mainData.states.selectedAvatar.type,
                    data : js
                };
                AppDB.temp.setItem("btapp_call_getikvalue",clsdata);
                AppDB.temp.setItem("bonetran_avatar_id",this.mainData.states.selectedAvatar.id);
                AppDB.temp.setItem("bonetran_avatar_title",this.mainData.states.selectedAvatar.title);
                AppDB.temp.setItem("bonetran_avatar_type",this.mainData.states.selectedAvatar.type);
        
            }
        ));
        AppQueue.start();
    }

    analyzeBVH (text) {
        var filearr = text.split(/\r|\n|\r\n/);
        if (filearr[0] !== "HIERARCHY") {
            console.error("BVH file error.");
            return;
        }
        var nodeList = [];
        var motionList = [];
        var rootNode = new BvhNode();
        /**
         * @type {BvhNode}
         */
        var isCurrentJoint = null;
        var isMotionPhase = false;
        for (var ln of filearr) {
            var childNode = new BvhNode();
            var tokens = ln.trim().split(/[\s]+/);
            if (isMotionPhase) {
                //---analyze motion
                if (!isNaN(parseFloat(tokens[0]))) {
                    var flist = [];
                    for (var i = 0; i < tokens.length; i++) {
                        var fv = parseFloat(tokens[i]);
                        if (!isNaN(fv)) {
                            flist.push(fv);
                        }
                    }
                    motionList.push(flist);
                }
            }else{
                //---analyze bone
                if (tokens[0].toUpperCase() == "ROOT") {
                    rootNode.joint = tokens[1];
                    isCurrentJoint = rootNode;
                }
                if (tokens[0].toUpperCase() == "JOINT") {
                    //---finish previous node
                    nodeList.push(isCurrentJoint);
                    isCurrentJoint = null;
    
                    //---start node
                    childNode.joint = tokens[1];
                    isCurrentJoint = childNode;
                }
                if (tokens[0].toUpperCase() == "OFFSET") {
                    isCurrentJoint.offset = tokens.filter(item => {
                        if (!isNaN(parseFloat(item))) return true; 
                        return false;
                    });   
                }
                if (tokens[0].toUpperCase() == "CHANNELS") {
                    for (var cha = 2; cha < tokens.length; cha++) {
                        isCurrentJoint.channels.push(tokens[cha]);
                    }
                }
                if ((tokens[0].toUpperCase() == "END") && (tokens[0].toUpperCase() == "SITE")) {
                    childNode.endsite = true;
                }
            }
            if (tokens[0].toUpperCase() == "MOTION") isMotionPhase = true;
            
        }
        var rowIndex = 0;
        var motionTL = [];
        //---packing as vector
        for (var ml of motionList) {
            var mtline = {};
            for (var nd = 0; nd < nodeList.length; nd++) {
                rowIndex = (nd * nodeList[nd].channels.length);
                var vpos = new UnityVector3(0, 0, 0);
                var vrot = new UnityVector3(0, 0, 0);
                for (var cha = 0; cha < nodeList[nd].channels.length; cha++) {
                    var chastr = nodeList[nd].channels[cha];
                    if (chastr.toLowerCase() == "xposition") {
                        vpos.x = ml[rowIndex + cha];
                    }else if (chastr.toLowerCase() == "yposition") {
                        vpos.y = ml[rowIndex + cha];
                    }else if (chastr.toLowerCase() == "zposition") {
                        vpos.z = ml[rowIndex + cha];
                    }else if (chastr.toLowerCase() == "xrotation") {
                        vrot.x = ml[rowIndex + cha];
                    }else if (chastr.toLowerCase() == "yrotation") {
                        vrot.y = ml[rowIndex + cha];
                    }else if (chastr.toLowerCase() == "zrotation") {
                        vrot.z = ml[rowIndex + cha];
                    }
                }
                var mtdata = {
                    "bone" : nodeList[nd].joint,
                    "position" : vpos,
                    "rotation" : vrot
                };
                mtline[nodeList[nd].joint] = mtdata;
            }
            motionTL.push(mtline);
        }

        var bdata = new BvhData();
        bdata.bones = nodeList;
        bdata.motions = motionTL;
        return bdata;
    }
    //----------------------------------------------------------------------------------------------------
    // KeyFrame window
    //----------------------------------------------------------------------------------------------------
    keyframeFiltering (funcName, data) {
        const dt = (data);
        switch (funcName) {
            case "get_ease_duration":
                this.keyframe_common_loadUnityConfig(dt.param);
                break;
            case "resetduration_onclick":
                this.keyframe_resetduration_onclick(dt.param);
                break;
            case "memo_onchange":
                this.keyframe_memo_onchange(dt.params);
                break;
            case "easing_onchange":
                this.keyframe_easing_onchange(dt.params);
                break;
            case "duration_onchange":
                this.keyframe_duration_onchange(dt.params);
                break;
            case "transform_onchange":
                this.keyframe_transform_onchange(dt.params);
                break;
            case "body_targetframeno":
                this.keyframe_body_targetframeno(dt.param);
            case "frameno_onchange":
                this.keyframe_frameno_onchange(dt.param);
                break;
            case "editframeno_onclick":
                this.keyframe_editframeno_onclick(dt.params);
                break;
            case "duplicatekeyframes_onclick":
                this.keyframe_duplicatekeyframes_onclick(dt.params);
                break;
            case "removekeyframes_onclick":
                this.keyframe_removekeyframes_onclick(dt.params);
                break;
            case "copysumduration_onclick":
                this.keyframe_copysumduration_onclick(dt.param);
                break;
        }
    }
    keyframe_common_loadUnityConfig (aro) {
        var straro = JSON.stringify(aro);
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetEaseFromOuter',param:straro},
            "getease",QD_INOUT.returnJS,
            (val) => {
                AppDB.temp.setItem("kfa_getease",val);
            }
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetDurationFromOuter',param:straro},
            "getduration",QD_INOUT.returnJS,
            (val) => {
                AppDB.temp.setItem("kfa_getduration",val);
            }
        ));
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetMemoFromOuter',param:straro},
            "getmemo",QD_INOUT.returnJS,
            (val) => {
                AppDB.temp.setItem("kfa_getmemo",val);
            }
        ));
        AppQueue.start();
    }
    keyframe_resetduration_onclick(params) {
        for (var i = 0; i < params.length; i++) {
            var param = JSON.stringify(params[i]);
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'ResetAutoDuration',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        
        AppQueue.start();
        this.mainData.states.currentEditOperationCount++;
    }
    keyframe_memo_onchange (params) {
        for (var i = 0; i < params.length; i++) {
            var param = JSON.stringify(params[i]);
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetMemo',param:param},
                "setmemo",QD_INOUT.returnJS,
                (val)=>{
                    var js = JSON.parse(val);
                    //console.log(js);
                }
            ));
        }
        AppQueue.start();
        this.mainData.states.currentEditOperationCount++;
    }
    keyframe_easing_onchange (params) {
        for (var i = 0; i < params.length; i++) {
            var param = JSON.stringify(params[i]);
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetEase',param:param},
                "setease",QD_INOUT.returnJS,
                (val)=>{
                    var js = JSON.parse(val);
                    //console.log(js);
                }
            ));
        }
        AppQueue.start();
        this.mainData.states.currentEditOperationCount++;
    }
    keyframe_duration_onchange (params) {
        for (var i = 0; i < params.length; i++) {
            var param = JSON.stringify(params[i]);
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetDuration',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        AppQueue.start();
        this.mainData.states.currentEditOperationCount++;
    }
    keyframe_transform_onchange (params) {
        for (var i = 0; i < params.length; i++) {
            var param = JSON.stringify(params[i]);
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'SetGlobalTransform',param:param},
                "",QD_INOUT.toUNITY,null
            ));
        }
        AppQueue.start();
        this.mainData.states.currentEditOperationCount++;
    }
    keyframe_body_targetframeno(param) {
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'CheckTargetFrameIndexList',param:param},
            "checktargetframe",QD_INOUT.returnJS,
            (val, options) => {
                AppDB.temp.setItem("kfa_targetFrameIndex",val);
            },
            {oldindex: -1}
        ));
        
        AppQueue.start();
    }
    keyframe_frameno_onchange(param) {
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'CheckTargetFrameIndexList',param:param},
            "checktargetframe",QD_INOUT.returnJS,
            (val, options) => {
                AppDB.temp.setItem("kfa_frameno_frameIndex",val);
            },
            {oldindex: -1}
        ));
        
        AppQueue.start();
    }
    keyframe_editframeno_onclick(params) {
        for (var i = 0; i < params.length; i++) {
            
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'ChangeFramePosition',param:params[i].param},
                "changeframepos",QD_INOUT.returnJS,
                (val, options) => {
                    if (val > -1) {
                        this.mainData.states.selectedTimeline.exchangeFrame(options.oldindex, options.newindex);
                    }
                    
                },
                {oldindex: parseInt(params[i].oldindex), newindex: parseInt(params[i].newindex)}
            ));
        }
        AppQueue.start();
        this.mainData.states.currentEditOperationCount++;
    }
    keyframe_duplicatekeyframes_onclick(params) {
        for (var i = 0; i < params.length; i++) {
            var param = `${params[i].roleName},${params[i].type},${params[i].oldindex},0`;
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'CopyFrame',param:param},
                "",QD_INOUT.toUNITY,
                null
            ));
            var param2 = `${params[i].roleName},${params[i].type},${params[i].newindex}`;
            var clipboard = {
                mode : "copy",
                index : params[i].oldindex,
                roleName : params[i].roleName,
                roleType : params[i].type
            };
            AppQueue.add(new queueData(
                {target:AppQueue.unity.ManageAnimation,method:'PasteFrame',param:param2},
                "paste_keyframe",QD_INOUT.returnJS,
                this.UnityCallback.paste_keyframe,
                {callback:this.UnityCallback,clipboard}
            ));            
        }
        AppQueue.start();
        this.mainData.states.currentEditOperationCount++;
    }
    keyframe_removekeyframes_onclick(params) {
        for (var i = 0; i < params.length; i++) {
            var avatarId = params[i].roleName;
            var avatarType = params[i].type;
            var cur_frame = params[i].oldindex;
            this.modelOperator.removeKeyframes(avatarId, avatarType, cur_frame, {
                movetype: AF_MOVETYPE.Rest,
                isBatch: true
            });
        }
        AppQueue.start();
        this.mainData.states.currentEditOperationCount++;
    }
    keyframe_copysumduration_onclick(param) {
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'GetAvatarDurationBetween',param:param},
            "getsumduration",QD_INOUT.returnJS,
            (val, options) => {
                if (val > -1) {
                    //kfapp.value.elements.duration = val;
                    AppDB.temp.setItem("kfa_getsumduration",val);
                }
                
            },
            {oldindex: -1}
        ));
        AppQueue.start();
    }
    //----------------------------------------------------------------------------------------------------
    // Gravity bone window
    //----------------------------------------------------------------------------------------------------
    gravitybone_on_afterchange(param) {
        for (var i = 0; i < param.powerlist.length; i++) {
            AppQueue.add(new queueData(
                {target:param.avatarId,method:'SetGravityPower',param:param.powerlist[i]},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        for (var i = 0; i < param.dirlist.length; i++) {
            AppQueue.add(new queueData(
                {target:param.avatarId,method:'SetGravityDirFromOuter',param:param.dirlist[i]},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        AppQueue.start();
    }
    gravitybone_reload_onclick(param) {
        AppQueue.add(new queueData(
            {target:param.avatarId,method:'ListGravityInfoFromOuter'},
            "list_gravitybone",QD_INOUT.returnJS,
            (val) => {
                var js = JSON.parse(val);
                AppDB.temp.setItem("grapp_list_gravitybone",js);
            }
        ));
        AppQueue.start();
    }
    //----------------------------------------------------------------------------------------------------
    // Position/Rotation Refernce window
    //----------------------------------------------------------------------------------------------------
    transref_position_onchange(param) {
        AppQueue.add(new queueData(
            {target:param.avatarId,method:'SetPositionIKMarkerFromOuter',param:param.param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    transref_rotation_onchange(param) {
        AppQueue.add(new queueData(
            {target:param.avatarId,method:'SetRotationIKMarkerFromOuter',param:param.param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();
    }
    //----------------------------------------------------------------------------------------------------
    // Easy IK mode window
    //----------------------------------------------------------------------------------------------------
    easyik_apply_onclick_curpose(param) {
        AppQueue.add(new queueData(
            {target:param.avatarId,method:'GetIKTransformAll'},
            "alliktransform",QD_INOUT.returnJS,
            (val) => {
                /**
                 * @type {AvatarAllIKParts}
                 */
                var js = JSON.parse(val);

                AppDB.temp.setItem("easyik_return_allikparts",js);
            }
        ));
        AppQueue.start();
    }
    easyik_apply_onclick_applybody(param) {
        AppQueue.add(new queueData(
            {target:AppQueue.unity.ManageAnimation,method:'SetBoneLimited',param:0},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.add(new queueData(
            {target:param.avatarId,method:'SetIKTransformAll',param:param.param},
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
    easyik_reload_onclick(param) {
        AppQueue.add(new queueData(
            {target:param.avatarId,method:'GetIKTransformAll'},
            "alliktransform",QD_INOUT.returnJS,
            (val) => {
                /**
                 * @type {AvatarAllIKParts}
                 */
                var js = JSON.parse(val);

                AppDB.temp.setItem("easyik_return_reloadikparts",js);

                
                
            }
        ));
        //---default T-pose data
        AppQueue.add(new queueData(
            {target:param.avatarId,method:'GetTPoseIKTransformAll'},
            "tposetransform",QD_INOUT.returnJS,
            (val) => {
                /**
                 * @type {AvatarAllIKParts}
                 */
                var js = JSON.parse(val);
                AppDB.temp.setItem("easyik_return_reload_tposeikparts",js);

                appdata.data.TPose = js;

                //---set scope data for math.js
                //   {"Pelvis_pos_x" : 0.5, ...}
                //reloadMathScope(appdata.data.bodyList.list);
                
            }
        ));
        AppQueue.start();
    }
}
/**
 * 
 * @param {appModelOperator} modelOperator 
 * @param {appMainData} mainData
 * @param {UnityCallbackFunctioner} unitycallback
 */
export const defineChildManager = (modelOperator, mainData, unitycallback) => {

    const childman = new ChildManager(modelOperator, mainData, unitycallback);

    return {
        childman
    }
}