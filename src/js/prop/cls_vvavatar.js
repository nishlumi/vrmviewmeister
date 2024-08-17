import { AnimationTargetParts, UnityVector3, AnimationFrameActor } from  "./cls_unityrel.js"
import { AF_TARGETTYPE, AF_MOVETYPE, UserAnimationEase, STORAGE_TYPE } from "../../res/appconst.js";

export class VVBlendShape {
    constructor(id, title, value) {
        this.id = id || "";
        this.title = title || "";
        this.value = value || 0;
        this.visibility = true;
        this.isChanged = false;
    }
}
export class VVAudio {
    constructor(name, fileobj) {
        this.name = name;
        this.fileObject = fileobj;
        this.objectURL = (fileobj != null) ? URL.createObjectURL(fileobj) : "";
    }
    destroy() {
        this.fileObject = null;
        URL.revokeObjectURL(this.objectURL);
        this.objectURL = null;
    }
}
export class VVAvatarEquipSaveClass {
    constructor(id,name,obj) {
        this.bodybonename = id || 0;
        /**
         * @type {String} name is roleName
         */
        this.equipitem = name || "";
        /**
         * @type {VVCast}
         */
        this.avatar = obj || null;
    }
}
export class VVObjectMaterialProp {
    constructor() {
        this.shaderselected = null;
        this.colorselected = "#FFFFFF";
        this.cullmodeselected = null;
        this.blendmodeselected = null;
        this.metallic = 0;
        this.glossiness = 0;
        this.emissioncolor = "#FFFFFF";
        this.shadetexcolor = "#FFFFFF";
        this.shadingtoony = 0;
        this.rimcolor = "#FFFFFF";
        this.rimfresnel = 0;
        this.textureSeltypeselected = 0;
    }
}
export class VVAvatar {
    constructor(type,json) {
        this.isFixed = false;
        /**
         * @type {STORAGE_TYPE}
         */
        this.comeFrom = STORAGE_TYPE.LOCAL;
        /**
         * example: VRoidHub's model data, etc...
         * @type {Any}
         */
        this.additionalData = {};
        /**
         * @type {AF_TARGETTYPE}
         */
        this.type = type;
        this.typeString = GetEnumName(AF_TARGETTYPE,type);
        this.id = "";
        this.title = "";
        this.version = "";
        this.size = new UnityVector3(1,1,1);
        this.author = "";
        this.contactInformation = "";
        this.reference = "";
        this.licenseType = "";
        this.thumbnail = null;
        this.allowedUser = false;
        this.violentUssage = false;
        this.sexualUssage = false;
        this.commercialUssage = false;
        this.otherPermissionUrl = "";
        this.exportedVersion = "";
        this.creditNotation = false;
        this.potilicalUssage = false;
        this.antisocialUssage = false;
        this.allowRedistribution = false;
        this.allowModification = false;

        /**
         * Same as Unity: 0-left pose, 1-left pose value, 2-right pose, 3-right pose value
         */
        this.handPoseList = [];

        /**
         * @type {String} Raw string for BlendShape list
         */
        this.blendShapes = "";
        /**
         * @type {VVBlendShape[]}
         */
        this.blendShapeList = [];
        
        /**
         * @type {VVAvatarEquipSaveClass[]}
         */
        this.equipList = [];

        /**
         * @type {Array<VVAvatarGravity>}
         */
        this.gravityList = []

        this.animations = {
            name : "",
            length : 0,
            wrapMode : 0,
        };
        this.materials = [];

        /**
         * @type {AnimationTargetParts}
         */
        this.motion = new AnimationTargetParts();

        /**
         * @type {VVAudio[]}
         */
        this.audio = [];

        //this.role = new AnimationAvatar(this);

        // genre, effectName
        this.effects = {};

        if (json) {
            this.load(type,json);
        }
    }
    destroy() {
        this.size = null;
        this.thumbnail = null;
        this.handPoseList.splice(0,this.handPoseList.length);
        this.blendShapeList.splice(0,this.blendShapeList.length);
        this.equipList.splice(0,this.equipList.length);
        this.materials.splice(0,this.materials.length);
        for (var i = 0; i < this.audio.length; i++){ 
            this.audio.destroy();
        }
        this.audio.splice(0,this.audio.length);
    }
    load(type,js) {
        var locpath = "";
        if (location.pathname.indexOf("static/win/") > -1) {
            locpath = "../";
        }else{
            locpath = "static/";
        }
        this.type = AF_TARGETTYPE[type];
        this.typeString = GetEnumName(AF_TARGETTYPE,this.type);
        this.id = js.id;
        this.title = js.Title;
        if (this.type == AF_TARGETTYPE.VRM) {
            this.version = js.Version;
            this.thumbnail = js.thumbnail;
            this.author = js.Author;
            this.contactInformation = js.ContactInformation;
            this.reference = js.Reference;
            this.licenseType = js.license;
            this.allowedUser = js.AllowedUser;
            this.violentUssage = js.ViolentUssage;
            this.sexualUssage = js.SexualUssage;
            this.commercialUssage = js.CommercialUssage;
            this.otherPermissionUrl = js.OtherPermissionUrl;
            this.exportedVersion = js.ExporterVersion;

            //---for 1.x
            this.potilicalUssage = js.PoliticalUssage;
            this.antisocialUssage = js.AntiSocialUssage;
            this.creditNotation = js.useCreditNotation;
            this.allowRedistribution = js.AllowRedistribution;
            this.allowModification = js.AllowModification;

            this.height = js.height;
            this.blendShapes = js.blendshape;
        }else if (this.type == AF_TARGETTYPE.OtherObject){
            this.thumbnail = locpath + "img/pic_otherobject.png";
        }else if (this.type == AF_TARGETTYPE.Light) {
            this.thumbnail = locpath + "img/pic_light.png";
        }else if (this.type == AF_TARGETTYPE.Camera) {
            this.thumbnail = locpath + "img/pic_camera.png";
        }else if (this.type == AF_TARGETTYPE.Text) {
            this.thumbnail = locpath + "img/pic_text.png";
        }else if (this.type == AF_TARGETTYPE.Image) {
            this.thumbnail = locpath + "img/pic_image.png";
        }else if (this.type == AF_TARGETTYPE.UImage) {
            this.thumbnail = locpath + "img/pic_uimage.png";
        }else if (this.type == AF_TARGETTYPE.Effect) {
            this.thumbnail = locpath + "img/pic_effect.png";
        }else if (this.type == AF_TARGETTYPE.Audio) {
            this.thumbnail = locpath + "img/pic_audio.png";
        }else if (this.type == AF_TARGETTYPE.Stage) {
            this.thumbnail = locpath + "img/pic_stage.png";
        }else if (this.type == AF_TARGETTYPE.Text3D) {
            this.thumbnail = locpath + "img/pic_text.png";
        }
        this.animations.name = js.animationName || "";
        this.animations.length = js.animationLength ? parseFloat(js.animationLength) : 0;
        this.animations.wrapMode = js.animationWrapMode || js.animationWrapMode;

        this.motion = js.motion || "";
    }
    getBlendShape (name) {
        var ret = null;
        for (var i = 0; i < this.blendShapeList.length; i++) {
            if (this.blendShapeList[i].id == name) {
                ret = this.blendShapeList[i];
                break;
            }
        }
        return ret;
    }
    setBlendShape(name,value,enabled = true) {
        var bs = this.getBlendShape(name);
        bs.value = value;
        bs.isChanged = enabled;
    }
    /**
     * Equip an Other Object
     * @param {Object} unity Unity object
     * @param {Number} bodyPart Body part for equipment
     * @param {VVCast} equipObject 
     * @return {VVAvatarEquipSaveClass}
     */
    equip(unity, bodyPart, equipObject) {
        var param = `${bodyPart},${equipObject.roleName},1`;
        
        var newequip = new VVAvatarEquipSaveClass(bodyPart,equipObject.roleName,equipObject);
        this.equipList.push(newequip);
        //unity.SendMessage(this.id,"EquipObjectFromOuter",param);

        AppQueue.add(new queueData(
            {target:this.id,method:'EquipObjectFromOuter',param:param},
            "",QD_INOUT.toUNITY,
            null
        ));
        AppQueue.start();

        return newequip;
    }
    /**
     * Unequip an Other Object
     * @param {Object} unity Unity object
     * @param {Number} bodyPart Body part for equipment
     * @param {VVAvatar} equipObject 
     * @returns {String} paramater string to the Unity
     */
    unequip(unity, bodyPart, equipObject) {
        var isHit = this.equipList.findIndex(match=>{
            if ((match.bodybonename == bodyPart) && (match.equipitem == equipObject.roleName)) 
                return true;
            return false;
        })
        var param = "";
        if (isHit > -1) {
            var delitem = this.equipList.splice(isHit,1);
            var eid = delitem[0].equipitem;
            var param = `${bodyPart},${eid}`;
    
            //unity.SendMessage(this.id,"UnequipObjectFromOuter",param);
            if (unity) {
                AppQueue.add(new queueData(
                    {target:this.id,method:'UnequipObjectFromOuter',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                AppQueue.start();
            }
        }
        

        return param;
    }
    /**
     * Unequip all body part (add AppQueue only)
     * @param {Object} unity Unity object
     */
    UnequipAll(unity) {
        for (var i = 0; i < this.equipList.length; i++) {
            var param = `${this.equipList[i].bodybonename},${this.equipList[i].equipitem}`;
            if (unity) {
                AppQueue.add(new queueData(
                    {target:this.id,method:'UnequipObjectFromOuter',param:param},
                    "",QD_INOUT.toUNITY,
                    null
                ));
                
            }
        }
        this.equipList.splice(0, this.equipList.length);
    }
    /**
     * Check this avatar is equipping the param's object
     * @param {VVCast} equipObject 
     * @returns {Object}
     */
    isEquipping(equipObject) {
        var ret = {
            /**
             * @type {VVAvatar}
             */
            avatar : null,
            /**
             * {String}
             */
            parts : null
        };
        var isHit = this.equipList.find(match => {
            if (match.equipitem == equipObject.roleName) return true;
            return false;
        });
        if (isHit) {
            ret.avatar = this;
            ret.parts = isHit;
        }
        
        return ret;
    }
};
export class VVSelectedObjectItem {
    constructor(index, data,html) {
        /**
         * @type {Number}
         */
        this.index = index;
        /**
         * @type {VVAvatar}
         */
        this.avatar = data;
        /**
         * @type {HTMLElement}
         */
        this.html = html;
    }
};

export class VVPoseConfig {
    constructor(key,params) {
        this.name = "";
        
        this.unity = {
            sampleavatar : params.sampleavatar,
            thumbnail : params.thumbnail,
            frameData : new AnimationFrameActor(params.frameData)
        };
    }
}
export class VVObjectTimelineConfig {
    /**
     * 
     * @param {VVAvatar} avatar 
     * @param {Object} params 
     */
    constructor(avatar, params) {
        this.avatarID = avatar.id;
        this.avatarName = avatar.title;
        this.frames = [];
        this.enabled = true;
        this.readonly = false;
    }
}
export class VVCast {
    /**
     * Cast avatar in the Project
     * @param {String} name cast id
     * @param {String} title cast title
     */
    constructor(name,title) {
        this.roleName = name || "";
        this.roleTitle = title || "";
        this.avatarId = "";
        this.avatarTitle = "";
        this.type = AF_TARGETTYPE.Unknown;
        this.bodyHeight = [];
        this.bodyInfoList = [];
        /**
         * @type {String} path to search a history (NOT real path!)
         */
        this.path = "";
        this.ext = "";
        /**
         * @type {VVAvatar}
         */
        this.avatar = null;
    }
    destroy() {
        this.avatar = null;
    }
}
export class VVAnimationFrame {
    constructor() {
        this.index = 0;
        this.finalizeIndex = 0;
        this.key = "";
        this.duration = 0.0;
        /**
         * @type {UserAnimationEase}
         */
        this.ease = UserAnimationEase.Linear;
        /**
         * @type {Array<String>}
         */
        this.movingData = [];
    }
}
export class VVAnimationFrameActor {
    constructor() {
        this.targetId = "";
        this.targetRole = "";
        /**
         * @type {AF_TARGETTYPE}
         */
        this.targetType = AF_TARGETTYPE.Unknown;
        this.enabled = 1;
        this.compiled = 0;
        this.bodyHeight = [];
        this.bodyInfoList = [];
        this.blendShapeList = [];
        this.gravityBoneList = [];
        /**
         * @type {Array<VVAnimationFrame>}
         */
        this.frames = [];
        this.frameIndexMarker = 0;
    }
}
export class VVAnimationMotionTimeline {
    constructor() {
        /**
         * @type {Array<VVAnimationFrameActor>}
         */
        this.characters = [];
    }
}
export class VVAP_OneMaterial {
    constructor() {
        this.name = "";
        this.group = "";
        this.path = "";
        this.materialType = "";
        this.size = {x:0, y:0};
    }
}
export class VVAnimationProjectMaterialPackage {
    constructor() {
        /**
         * @type {Array<VVAP_OneMaterial>}
         */
        this.materials = [];
    }
}
export class AnimationProjectPreloadFiles {
    constructor() {
        /**
         * @type {String} file URI
         */
        this.fileuri = "";

        /**
         * @type {String} file name
         */
        this.filename = "";
        /**
         * @type {String} File URI type : int - Internal Storage, loc - Local, 
         * ggd - Google Drive, appggd - Application, web - web url
         */
        this.uritype = "";
        /**
         * @type {String} Option string for file
         */
        this.options = "";

        /**
         * @type {String} File type
         */
        this.filetype = "";
    }
}
export class VVAnimationProject {
    constructor(param) {
        //---when saving, count up 
        this.mkey = 0;
        this.version = 2;
        /**
         * @type {VVCast[]}
         */
        this.casts = [];
        /**
         * @type {VVAnimationMotionTimeline}
         */
        this.timeline = new VVAnimationMotionTimeline();
        this.timelineFrameLength = 60.0;
        this.fps = 60;
        this.baseDuration = this.fps / 6000.0;
        this.meta = {
            name : "",
            license : "",
            description : "",
            coverImage : "",
            referurl : "",
        };
        this.fixedProp = {};
        /**
         * @type {VVAnimationProjectMaterialPackage}
         */
        this.materialManager = new VVAnimationProjectMaterialPackage();
        /**
         * @type {AnimationProjectPreloadFiles[]}
         */
        this.preloadFiles = [];
        this.isSharing = false;
        this.isReadonly = false;
        //this.isNew = true;
        //this.isOpenAndEdit = false;
        if (param) {
            if ("mkey" in param) this.mkey = param.mkey;
            if ("version" in param) this.version = param.version;
            if ("casts" in param) {
                param.casts.forEach(item => {
                    var ishit = this.casts.findIndex(match => {
                        if (match.roleName == item.roleName) return true;
                        return false;
                    });
                    if (ishit == -1) {
                        var vv = new VVCast(item.roleName, item.roleTitle);
                        vv.avatar = item.avatar || "";
                        vv.avatarId = item.avatarId || "";
                        vv.avatarTitle = item.avatarTitle || "";
                        vv.type = item.type;
                        vv.path = item.path || "";
                        vv.ext = item.ext || "";
                        vv.bodyHeight = item.bodyHeight;
                        vv.bodyInfoList = item.bodyInfoList;
                        this.casts.push(vv);
                    }                    
                });
                
            }
            if ("timeline" in param) this.timeline = param.timeline;
            if ("timelineFrameLength" in param) this.timelineFrameLength = param.timelineFrameLength;
            if ("baseDuration" in param) this.baseDuration = param.baseDuration;
            if ("fps" in param) this.fps = param.fps;
            if ("meta" in param) this.meta = param.meta;
            if ("isSharing" in param) this.isSharing = param.isSharing;
            if ("isReadonly" in param) this.isReadonly = param.isReadonly;
            //if ("isNew" in param) this.isNew = param.isNew;
            //if ("isOpenAndEdit" in param) this.isOpenAndEdit = param.isOpenAndEdit;
            if ("fixedProp" in param) this.fixedProp = param.fixedProp;
            if ("materialManager" in param) this.materialManager = param.materialManager;
            if ("preloadFiles" in param) this.preloadFiles = param.preloadFiles;
        }

        /*this.htmlOnly = {
            casts : {
                BGM : {
                    audioNames : []
                },
                SE : {
                    audioNames : []
                }
            },
            timeline : {
                BGM : [],
                SE : []
            }
        }*/
    }
    /**
     * To set JSON data from opended in Unity 
     * @param {VVAnimationProject} param 
     */
    setFromUnity(param) {
        if ("mkey" in param) this.mkey = param.mkey;
        if ("version" in param) this.version = param.version;
        if ("casts" in param) {
            param.casts.forEach(item => {
                //---Fixed cast is excluded.
                if (
                    (item.roleName != "SystemEffect") && 
                    (item.roleName != "BGM") && 
                    (item.roleName != "SE") && 
                    (item.roleName != "Stage")
                ) {
                    //[creation point] VVCast
                    var vv = new VVCast(item.roleName, item.roleTitle);
                    vv.avatar = item.avatar || null;
                    vv.avatarId = item.avatarId;
                    vv.avatarTitle = item.avatarTitle || "";
                    vv.type = item.type;
                    vv.bodyHeight = item.bodyHeight;
                    vv.bodyInfoList = item.bodyInfoList;
                    vv.path = item.path || "";
                    vv.ext = item.ext || "";
                    this.casts.push(vv);
                }
            });
            
        }
        if ("timeline" in param) this.timeline = param.timeline;
        if ("timelineFrameLength" in param) this.timelineFrameLength = param.timelineFrameLength;
        if ("fixedProp" in param) this.fixedProp = param.fixedProp;
        if ("materialManager" in param) this.materialManager = param.materialManager;
        if ("baseDuration" in param) this.baseDuration = param.baseDuration;
        if ("fps" in param) this.fps = param.fps;
        if ("meta" in param) this.meta = param.meta;
        if ("isSharing" in param) this.isSharing = param.isSharing;
        if ("isReadonly" in param) this.isReadonly = param.isReadonly;
        //if ("isNew" in param) this.isNew = param.isNew;
        //if ("isOpenAndEdit" in param) this.isOpenAndEdit = param.isOpenAndEdit;
    }
}

export class VVTimelineFrameData {
    constructor(index, data) {
        /**
         * 1-based frame index
         * @type {Number}
         */
        this.key = index || 0;
        /**
         * AvatarAttachedNativeAnimationFrame
         * id, role, type, frme,
         * translateMoving
         * MovingTypes
         */
        this.data = data || {};
        this.vclass = {
            "showsize-normal" : true,
            "showsize-small" : false,
            "framerow-scale-one" : true,
            "framerow-scale-every10" : false
        };
        this.tooltip = false;
    }
}
export class VVTimelineTarget {
    /**
     * VVTimelineTarget has deep connection to VVCast
     * @param {VVCast} avatar
     */
    constructor(avatar) {
        /**
         * @type {VVCast}
         */
        this.target = avatar || null;
        /**
         * @type {Array<VVTimelineFrameData>}
         */
        this.frames = [];

        this.selected = {
            currentcursor : false
        }

        this.enabled = true;
        this.enableIcon = "lock_open";
        this.readonly = false;
        this.readonlyIcon = "visibility";
        this.fixed = false;
        //this.thumbnail = (avatar && avatar["avatar"]) ? avatar.avatar.thumbnail : "static/img/pic_undefined.png";
        //this.label = (avatar && avatar["avatar"]) ? avatar.avatar.title :  "";
        
    }
    /**
     * set and connect timeline and VVCast
     * @param {VVCast} target target avatar object
     */
    setTarget(target) {
        this.target = target;
        
        //--re-connect value to element.
        if ((this.target.avatar != null) && this.target.avatar.thumbnail) {
            if (this.target.avatar.thumbnail != null) {
                this.thumbnail = this.target.avatar.thumbnail; 
            }   
        }
        if (this.target.avatar) {
            this.label = `(${this.target.avatar.typeString}) ${this.target.roleName == this.target.roleTitle ? this.target.avatar.title : this.target.roleTitle}`;
        }else{
            this.label = this.target.roleTitle;
        }   
    }
    /**
     * To detach VVCast from timeline
     * @param {Boolean} is_uionly detach UI-show only(default: true)
     */
    detachTarget(is_uionly = true) {
        if (this.target) {
            this.thumbnail = "static/img/pic_undefined.png";
            this.label = "";
        }
        if (!is_uionly) {
            this.target = null;
        }
    }
    setEnable(flag) {
        this.enabled = flag;
        if (flag) {
            this.enableIcon = "visibility";
        }else{
            this.enableIcon = "visibility_off";
        }
    }
    setReadOnly(flag) {
        this.readonly = flag;
        if (flag) {
            this.readonlyIcon = "lock";
        }else{
            this.readonlyIcon = "lock_open";
        }
    }
    getFrame(index) {
        return this.frames[index];
    }
    getFrameByKey(key) {
        var ret = this.frames.find(item=>{
            if (item.key == key) return true;
            return false;
        });

        return ret;
    }
    getFrameIndexByKey(key) {
        var ret = this.frames.findIndex(item=>{
            if (item.key == key) return true;
            return false;
        });

        return ret;
    }
    /**
     * @param {Number} index count for Array-type.
     * @param {VVTimelineFrameData} data
     */
    setFrame(index,data) {
        this.frames[index] = data;
    }
    /**
     * @param {Number} key index as parent frame count
     * @param {VVTimelineFrameData} data
     */
    setFrameByKey(key,data) {
        var index = this.getFrameIndexByKey(key);
        if (index > -1) {
            this.frames[index] = data;
        }
    }
    /**
     * 
     * @param {Boolean} is_asc 
     */
    sortFrame(is_asc = true) {
        this.frames.sort((a, b) => {
            if (is_asc === true) {
                if (a.key < b.key) return -1;
                if (a.key > b.key) return 1;
            }else{
                if (a.key < b.key) return 1;
                if (a.key > b.key) return -1;
            }
            
            return 0;
        })
    }
    /**
     * exchange old position and new position of frame
     * @param {Number} oldkey 
     * @param {Number} newkey 
     */
    exchangeFrame(oldkey,newkey) {
        var item = this.getFrameByKey(oldkey);
        if (item) {
            item.key = newkey;
            this.sortFrame();
        }
    }
    /**
     * @param {Number} index count for Array-type.
     * @param {VVTimelineFrameData} data
     */
    insertFrame(index,data) {
        if (this.readonly) return; //throw new Exception("dontedit");
        //this.generate_keyobject(data,index);
        this.frames.push(data);
    }
    insertFrameDuring(index, count = 1) {
        if (this.readonly) return;
        //this.frames.splice(index,0,data);
        for (var i = 0; i < this.frames.length; i++) {
            if (this.frames[i].key >= index) {
                this.frames[i].key += count;
            }
        }
    }
    removeFrame(index) {
        if (this.readonly) return; //throw new Exception("dontedit");
        
        return this.frames.splice(index,1);
    }
    removeFrameByKey(key) {
        if (this.readonly) return; //throw new Exception("dontedit");
        for (var i = 0; i < this.frames.length; i++) {
            if (key == this.frames[i].key) {
                var item = this.frames.splice(i,1);
                break;
            }
        }
        return item;
    }
    /**
     * 
     * @param {Number} key 
     * @param {AF_MOVETYPE} cleartype remove is all(REST), properties(AllProperties)
     * @returns 
     */
    clearFrame(key, cleartype = AF_MOVETYPE.Rest) {
        if (this.readonly) return; //throw new Exception("dontedit");
        var ishit = -1;
        for (var i = 0; i < this.frames.length; i++) {
            if (key == this.frames[i].key) {
                ishit = i;
                break;
                
            }
        }
        if (ishit > -1) {
            if (cleartype == AF_MOVETYPE.Rest) {
                //---directly remove
                this.frames.splice(ishit,1);
            }else if (cleartype == AF_MOVETYPE.AllProperties) {
                //---remove properties ONLY
                var ishitprop = this.frames[ishit].data.frame.movingData.findIndex(v => {
                    if (
                        (v.indexOf("position") == -1) &&
                        (v.indexOf("rotation") == -1) &&
                        (v.indexOf("scale") == -1) &&
                        (v.indexOf("normaltransform") == -1)
                    ) {
                        return true;
                    }
                    return false;
                });
                if (ishitprop > -1) {
                    this.frames[ishit].data.frame.movingData.splice(ishitprop,1);
                }
            }
            
        }
    }
    deleteFrameDuring(index, count = 1) {
        if (this.readonly) return;
        //---pysically
        this.removeFrameByKey(index);
        //---logically and 
        for (var i = 0; i < this.frames.length; i++) {
            if (this.frames[i].key >= index) {
                this.frames[i].key -= count;
            }
        }
    }
    clearAll() {
        if (this.readonly) return;
        var item = this.frames.splice(0,this.frames.length);
    }
}
export class VVProp {
    constructor() {
        this.dimension = "3d";
        this.prop3D = {
            position : {x:0, y:0, z:0},
            rotation : {x:0, y:0, z:0},
            scale : 0
        };
        this.prop2D = {
            position : {x:0, y:0, z:0},
            rotation : {x:0, y:0, z:0},
            size : {x:0, y:0},
            scale : {x:0, y:0},
        };
        this.VRM = {
            moveMode : false,
            hands : {
                left : {
                    poseSelected : 0,
                    poseValue : 0.0
                },
                right : {
                    poseSelected : 0,
                    poseValue : 0.0
                }
            },
            /**
             * @type {Array<VVBlendShape>}
             */
            blendShapeList : [],
            /**
             * @type {Array<VVAvatarEquipSaveClass>}
             */
            equipments : []
        };
        this.OtherObject = {
            materials : [],
            animation : {
                selectedState : "",
                seekPosition : 0,
                seekMax : 0,
                flag : "",
            }
        };
        this.Light = {
            renderMode : "",
            power : 1,
            range : 1,
            selectedColor : "",
            spotAngle : 1
        };
        this.Camera = {
            flag : "",
            fov : 0.25,
            depth : 11,
            vp : {
                position : {x:0, y:0},
                size : {x:1, y:1}
            }
        };
        this.Image = {
            colorSelected : "",
        };
        this.Effect = {
            genre : [""],
            effect : "",
            loop : false,
            flag : "",
        };
        this.Stage = {
            listStageType : [],
            selectedType : "",
            selectedSkycolor : "#314D79",
            ustg_maintex : null,
            ustg_bumpmap : null,
            dlightRotation : {x:0, y:0, z:0},
            dlightPower : 1,
            dlightStrength : 0.27,
            dlightColor : "#FFF",
            skymode : 2,
            skyshader : "procedural",
            skyparam : {
                sunsize : 0.04,
                sunsize_convergence : 5,
                atmosphere_thickness : 1,
                exposure : 1.3,
                rotation : 0,
                tint : "#FFFFFF",
                ground_color : "#FFFFFF",
            },
            windpower : 0,
            windfrequency : 0.01,
            windduration : {min:0.01, max:0.03}
        };
        this.Text = {
            text : "",
            anchorPosition : "",
            size : 12,
            selectedColor : "#000",
            selectedFontStyle : "",
        };
        this.UImage = {
            selectedColor : "#FFF"
        }
    }
}