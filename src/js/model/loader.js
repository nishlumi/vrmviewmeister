import { AF_TARGETTYPE, AF_MOVETYPE, FILEEXTENSION_VRM,
    FILEEXTENSION_OTHEROBJECT, FILEEXTENSION_IMAGE,
    FILEEXTENSION_ANIMATION, FILEEXTENSION_DEFAULT, FILEOPTION, 
    FILEEXTENSION_MOTION, INTERNAL_FILE, StageType, EFFECTLIST, FILEEXTENSION_POSE
} from "../../res/appconst.js"
import { AppDBMeta } from "../appconf.js";
import {  VVAvatar, VVCast,VVAnimationProject, VVTimelineFrameData, VVTimelineTarget } from '../prop/cls_vvavatar.js';
import { VFileHelper, VOSFile } from "../../../public/static/js/filehelper.js";
import { appModelOperator } from "./operator.js";
import { AnimationParsingOptions } from "../prop/cls_unityrel.js";
import { appDataTimeline } from "../prop/apptimelinedata.js";
import { appMainData } from "../prop/appmaindata.js";

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {appMainData} mainData 
 * @param {appDataTimeline} timelineData
 * @param {appModelOperator} modelOperator 
 * @param {*} callback 
 * @param {*} refs 
 * @returns 
 */
export const defineModelLoader = (app, Quasar, mainData, timelineData, modelOperator, callback, refs) => {
    const { t } = VueI18n.useI18n({ useScope: 'global' });

    
    /**
     * Load body of the file (connect Unity)
     * @param {String} fdata Object URL of a file
     * @param {String} fileloadname file name
     * @param {String} ext file extension
     * @param {String} fileloadtype file type character
     * @param {VOSFile} tmpfile effective file object
     */
    const _appfileLoader = async (fdata, fileloadname, ext, fileloadtype, tmpfile) => {
        if (fileloadtype == "ap") {
            //---For Animation Project
            var data = "";
            try {
                if (tmpfile.data instanceof File) {
                    data = await tmpfile.data.text();
                }else{
                    //---Electron and vvmproj file is Text file only!!
                    data = tmpfile.data;
                }
                
            
                var js = JSON.parse(data);
                if (("mkey" in js) && ("casts" in js) && ("timeline" in js)) {
                    modelOperator.newProject(false);
                    
                    var proj = new VVAnimationProject(js);
                    mainData.states.currentProjectFilename = tmpfile.name;
                    mainData.states.currentProjectFilepath = tmpfile.path;
                    mainData.states.currentProjectHandle = mainData.states.loadingfileHandle;
                    mainData.states.currentProjectFromFile = true;
                    mainData.states.currentProjectFromStorageType = "f";
                    
                    //---Secondary load for Visual only.
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.ManageAnimation,method:'LoadProject',param:data},
                        "openproject",QD_INOUT.returnJS,
                        callback.openproject,
                        {callback}
                    ));
                    AppQueue.start();
                }else{
                    appAlert(t("msg_error_allfile"));
                    mainData.states.currentProjectFilename = "";
                    mainData.states.currentProjectHandle = null;
                }
            
            }catch(err) {
                console.error(err);
                appAlert(t("msg_error_allfile"));
                mainData.states.currentProjectFilename = "";
                mainData.states.currentProjectHandle = null;
            }
        }else if (fileloadtype == "mot") {
            const callbody = (fdata) => {
                //---Firstly, set target.
                var tmpcast = mainData.states.selectedCast;
                if (tmpcast) {
                    if (!tmpcast.avatar) {
                        appAlert(t("msg_openmotion_error4"));
                        callback.mainData.elements.loading = false;
                        return;
                    }
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.ManageAnimation,method:'SetLoadTargetSingleMotion',param:tmpcast.roleName},
                        "",QD_INOUT.toUNITY,
                        null
                    ));
                    //---Second load a motion data.
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.ManageAnimation,method:'LoadSingleMotion',param:fdata},
                        "openmotionresult",QD_INOUT.returnJS,
                        callback.openmotionresult,
                        {callback}
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
                }
                
            }
            var text = "";
            if (tmpfile.data instanceof File) {
                text = await tmpfile.data.text();
                
            }else{
                text = tmpfile.data;
            }
            var jsdata = JSON.parse(text);
            var msgadd = `${jsdata.frames[jsdata.frames.length-1].index}`;
            if (mainData.data.project.timelineFrameLength < jsdata.frames[jsdata.frames.length-1].index) {
                appConfirm(t("msg_openmotion_error3")+msgadd,() => {
                    callbody(fdata);
                });
            }else{
                callbody(fdata);
            }
        }else if (fileloadtype == "pos") {
            var text = "";
            if (tmpfile.data instanceof File) {
                text = await tmpfile.data.text();
                
            }else{
                text = tmpfile.data;
            }
            var jsdata = JSON.parse(text);
            modelOperator.returnPoseDialogValue(jsdata);
            callback.mainData.elements.loading = false;
        }else{
            //---below is BINARY files 
            var dbtype = "";
            if (fileloadtype == "v") {
                //---For VRM(VRoid)
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'LoadVRMURI',param:fdata},
                    "firstload_vrm",QD_INOUT.returnJS,
                    callback.sendObjectInfo,
                    {callback,objectURL:fdata,filename:fileloadname,
                        fileloadtype: fileloadtype,
                        loadingfileHandle : tmpfile}
                ));
            }else if (fileloadtype == "o") {
                //---For VBX, Obj, etc...
                var param = [fdata,fileloadname,ext].join("\t");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'LoadOtherObjectURI',param:param},
                    "sendobjectinfo",QD_INOUT.returnJS,
                    callback.sendObjectInfo,
                    {callback,objectURL:fdata,filename:fileloadname,
                        fileloadtype: fileloadtype,
                        loadingfileHandle : tmpfile}
                ));
                dbtype = "OBJECTS";
            }else if (fileloadtype == "bgm") {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'OpenBGM',param:fdata+"\t"+fileloadname},
                    "firstload_audio",QD_INOUT.returnJS,
                    callback.firstload_audio,
                    {callback,objectURL:fdata}
                ));
            }else if (fileloadtype == "se") {
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'OpenSE',param:fdata+"\t"+fileloadname},
                    "firstload_audio",QD_INOUT.returnJS,
                    callback.firstload_audio,
                    {callback,objectURL:fdata}
                ));
            }else if (fileloadtype == "img") {
                var param = [fdata,fileloadname].join("\t");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'ImageFileSelected',param:param},
                    "sendobjectinfo",QD_INOUT.returnJS,
                    callback.sendObjectInfo,
                    {callback,objectURL:fdata,filename:fileloadname,
                        fileloadtype: fileloadtype,
                        loadingfileHandle : tmpfile}
                ));
                dbtype = "IMAGES";
            }else if (fileloadtype == "ui") {                
                var param = [fdata,fileloadname].join("\t");
                AppQueue.add(new queueData(
                    {target:AppQueue.unity.FileMenuCommands,method:'UIImageFileSelected',param:param},
                    "sendobjectinfo",QD_INOUT.returnJS,
                    callback.sendObjectInfo,
                    {callback,objectURL:fdata,filename:fileloadname,
                        fileloadtype: fileloadtype,
                        loadingfileHandle : tmpfile}
                ));
                dbtype = "IMAGES";
            }

            AppQueue.start();

            //---save to recently history
            if (mainData.appconf.confs.application.stock_opened_file_history === true) {
                //---This timing is PROJECT,OBJECTS only (VRM and IMAGES is after)
                if (["OBJECTS","IMAGES"].indexOf(dbtype) > -1) {
                    saveToInternalStorage(dbtype, tmpfile);
                }
                
            }
        }

        
    }
    const dragover_evt = (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        //+++MYAPP.states.fileloadtype = "v";
    };
    const dragenter_evt = (event) => {
        //console.log("drag enter=>");
        //console.log(event);
        
    };
    const dragleave_evt = (event) => {
        mainData.states.fileloadtype = "";
        event.stopPropagation();
        event.preventDefault();
    };
    const drop_evt = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        mainData.states.fileloadtype = "";

        //const fileHandles = [...event.dataTransfer.items]
        //.filter(item => item.kind === "file")
        //.map(item => item.getAsFileSystemHandle());
        
        const fileHandles = await VFileHelper.getProperDropItems(event.dataTransfer.items,
            (VFileHelper.flags.isHistoryFSAA && VFileHelper.flags.isEnableFSAA)
        );


        if (fileHandles.length > 0) {
            if (fileHandles.length == 0) {
                return;
            }
            
            //############################
            // WebApp: normal drop item
            // Electron: extended drop item (with local fullpath)
            //############################
            //for (var i = 0; i < fileHandles.length; i++) {
            for await (const handle of fileHandles) {
                //console.log(handle);
                /**
                 * @type {VOSFile}
                 */
                var tmpfile = new VOSFile({});
                tmpfile.name = handle.name; //await handle.getFile();
                tmpfile.path = handle.path || handle.name;
                tmpfile.encoding = VFileHelper.checkEncoding(handle.type);
                tmpfile.lastModified = handle.lastModified;
                tmpfile.type = handle.type;
                tmpfile.size = handle.size;
                /**
                 * @type {File} tmpfile.data
                 */
                tmpfile.data = handle;
                if (VFileHelper.flags.isHistoryFSAA && VFileHelper.flags.isEnableFSAA) {
                    tmpfile = await handle.getFile();
                }
                //var tmpfile = event.dataTransfer.files[0];
                var fdata = URL.createObjectURL(tmpfile.data);
                mainData.data.objectUrl.vrm = fdata;
                mainData.states.fileloadname = tmpfile.name;

                var filearr =  mainData.states.fileloadname.split(".");
                var ext = filearr[filearr.length-1];
                var filetype = "";

                //---check each file type
                var isHitOO = FILEEXTENSION_OTHEROBJECT.find(item => {
                    if (tmpfile.name.toLowerCase().indexOf(item) > -1) return true;
                    return false;
                });
                var isHitIMG = FILEEXTENSION_IMAGE.find(item => {
                    if (tmpfile.name.toLowerCase().indexOf(item) > -1) return true;
                    return false;
                });

                if (tmpfile.name.toLowerCase().indexOf(FILEEXTENSION_VRM) > -1) {
                    //---if VRM: Binary
                    mainData.states.fileloadtype = "v";
                    mainData.states.loadingfileHandle = tmpfile;
                    filetype = "VRM";
                }else if (isHitOO) {
                    //---if OtherObject: Binary
                    mainData.states.fileloadtype = "o";
                    filetype = "OBJECTS";
                }else if (isHitIMG) {
                    //---if Image and UImage: Binary
                    mainData.states.fileloadname = tmpfile.name;
                    mainData.states.loadingfile = fdata;
                    mainData.states.loadingfileHandle = tmpfile;
                    
                    mainData.elements.imageSelector.show = true;

                    //---final decide is after.
                    return;
                }else{
                    //---other file is probably a text format ???
                    if (
                        (tmpfile.name.toLowerCase().indexOf(FILEEXTENSION_ANIMATION) > -1)
                    ) {
                        //---if Animation Project: Text file
                        mainData.states.fileloadtype = "ap";
                        filetype = "PROJECT";                        
                    }else if (tmpfile.name.toLowerCase().indexOf(FILEEXTENSION_MOTION) > -1) {
                        //---if AnimationSingleMotion file: Text file (neccesary .vvmmot, don't .json)
                        mainData.states.fileloadtype = "mot";
                        filetype = "MOTION";
                    }else if (tmpfile.name.toLowerCase().indexOf(FILEEXTENSION_POSE) > -1) {
                        //---if Pose file: Text file
                        mainData.states.fileloadtype = "pos";
                        filetype = "POSE";
                    }
                }

                if (mainData.states.fileloadtype == "") {
                    appAlert(t("msg_error_allfile"));
                    return;
                }

                mainData.elements.loading = true;
                mainData.elements.loadingTypePercent = false;
                //---load file body
                await _appfileLoader(fdata,
                    mainData.states.fileloadname, 
                    ext, 
                    mainData.states.fileloadtype, 
                    tmpfile
                );

                //---save to recently history
                if (mainData.appconf.confs.application.stock_opened_file_history === true) {
                    //---This timing is PROJECT,OBJECTS only (VRM and IMAGES is after)
                    if (["OBJECTS","IMAGES"].indexOf(filetype) > -1) {
                        await saveToInternalStorage(filetype, tmpfile);
                    }
                    
                }
            }
            
            
        }
    }


    //====================================================================================
    //---methods to return parent reactive object
    const setupDefaultObject = () => {
        var syse = new VVAvatar("SystemEffect",{
            id : "SystemEffect",
            Title : "SystemEffect"
        });
        syse.isFixed = true;
        mainData.data.vrms.push(syse);
        var role_syse = new VVCast("SystemEffect","SystemEffect");
        role_syse.avatarId = syse.id;
        role_syse.avatar = syse;
        role_syse.type = AF_TARGETTYPE.SystemEffect;
        mainData.data.project.casts.push(role_syse);
        //+++this.elements.timeline.appendTimeline(role_syse);
        var TLsyse = new VVTimelineTarget(role_syse);
        TLsyse.fixed = true;
        timelineData.data.timelines.push(TLsyse);
    
        var bgm = new VVAvatar("Audio",{
            id : "BGM",
            Title : "BGM"
        });
        bgm.isFixed = true;
        mainData.data.vrms.push(bgm);
        var role_bgm = new VVCast("BGM","BGM");
        role_bgm.avatarId = bgm.id;
        role_bgm.avatar = bgm;
        role_bgm.type = AF_TARGETTYPE.Audio;
        mainData.data.project.casts.push(role_bgm);
        //+++this.elements.timeline.appendTimeline(role_bgm);
        var TLbgm = new VVTimelineTarget(role_bgm);
        TLbgm.fixed = true;
        timelineData.data.timelines.push(TLbgm);
    
        var se = new VVAvatar("Audio",{
            id : "SE",
            Title : "SE"
        });
        se.isFixed = true;
        mainData.data.vrms.push(se);
        var role_se = new VVCast("SE","SE");
        role_se.avatarId = se.id;
        role_se.avatar = se;
        role_se.type = AF_TARGETTYPE.Audio;
        mainData.data.project.casts.push(role_se);
        //+++this.elements.timeline.appendTimeline(role_se);
        var TLse = new VVTimelineTarget(role_se);
        TLse.fixed = true;
        timelineData.data.timelines.push(TLse);
    
        var ret = modelOperator.addObject("Stage",{
            id : "Stage",
            Title : "Stage",
            roleName : "Stage",
            roleTitle : "Stage"
        });
        StageType.isFixed = true;
        //elements.objectlist.selected = ret.avatar.id;
        //modelOperator.select_objectItem("Stage");
        ret.role.type = AF_TARGETTYPE.Stage;
        var TLstage = new VVTimelineTarget(ret.role);
        TLstage.fixed = true;
        timelineData.data.timelines.push(TLstage);
        mainData.states.selectedAvatar = ret.avatar;
        
        //console.log(mainData.data);
    }

    /**
     * Common function for Model object file
     * @param {VOSFile} originalfile 
     * @param {*} filetype 
     */
    const OnChange_Common_AppFile = async (originalfile, filetype) => {
        var file = null;
        if (VFileHelper.flags.isHistoryFSAA && VFileHelper.flags.isEnableFSAA) {
            //file = await originalfile.getFile();
        }else if (VFileHelper.flags.isElectron) {
            file = originalfile;
            if (file.encoding === "binary") {
                file.data = new Blob([originalfile.data]);
            }
            
        }else{
            file = originalfile;
        }
        var fdata = file.encoding === "binary" ? URL.createObjectURL(file.data) : file.data;
        mainData.data.objectUrl.vrm = fdata;
        mainData.states.fileloadname = file.name;
        mainData.states.loadingfileHandle = originalfile;

        var filearr =  mainData.states.fileloadname.split(".");
        var ext = filearr[filearr.length-1];

        //console.log(mainData.states.fileloadtype);

        await _appfileLoader(fdata, 
            mainData.states.fileloadname,ext, 
            mainData.states.fileloadtype,
            file
        );

        //---save to recently history
        if (mainData.appconf.confs.application.stock_opened_file_history === true) {
            //---exclude VRM, because it cancelable.
            if (["OBJECTS","IMAGES"].indexOf(filetype) > -1) {
                await saveToInternalStorage(filetype, originalfile);
            }
        }
    }
    /**
     * On click "hid_file" element (Legacy use) : NOT USE
     * @param {Array<File>} targetfiles 
     * @returns 
     */
    const OnChange_AppFile = async (targetfiles) => {
        if (targetfiles.length == 0) {
            return;
        }
        mainData.elements.loading = true;
        mainData.elements.loadingTypePercent = false;
        var filetype = mainData.states.fileloadtype;

        OnChange_Common_AppFile(targetfiles[0], filetype);
        /*
        var fdata = URL.createObjectURL(targetfiles[0]);
        mainData.data.objectUrl.vrm = fdata;
        mainData.states.fileloadname = targetfiles[0].name;

        var filearr =  mainData.states.fileloadname.split(".");
        var ext = filearr[filearr.length-1];

        console.log(mainData.states.fileloadtype);

        _appfileLoader(fdata, mainData.states.fileloadname,ext, mainData.states.fileloadtype,targetfiles[0]);

        //---save to recently history
        if (mainData.appconf.confs.application.stock_opened_file_history === true) {
            //---exclude VRM, because it cancelable.
            if (["OBJECTS","IMAGES"].indexOf(filetype) > -1) {
                await saveToInternalStorage(filetype, targetfiles[0]);
            }
        }
        */
    }
    /**
     * Open any file using File Sytem Access API : NOT USE
     * @param {String} filetype appconst.FILEOPTION or appconst.INERNAL_FILE
     */
    const OnChange_AppFilePicker = async (filetype) => {
        mainData.elements.loading = true;
        mainData.elements.loadingTypePercent = false;
        //File Sytem Access API
        if (filetype in FILEOPTION) {
            if ("showOpenFilePicker" in window) {
                try {
                    var files = await window.showOpenFilePicker(FILEOPTION[filetype]);
                    if (files) {
                        if (files.length > 0) {
                            /**
                             * @type {FileSystemFileHandle}
                             */
                            var f0 = files[0];
                            var file = await f0.getFile();

                            OnChange_Common_AppFile(file,filetype);
                            /*
                            var fdata = URL.createObjectURL(file);
                            mainData.data.objectUrl.vrm = fdata;
                            mainData.states.fileloadname = file.name;
                            mainData.states.loadingfileHandle = file;

                            var filearr =  mainData.states.fileloadname.split(".");
                            var ext = filearr[filearr.length-1];

                            console.log(mainData.states.fileloadtype);

                            _appfileLoader(fdata, mainData.states.fileloadname,ext, mainData.states.fileloadtype,file);

                            //---save to recently history
                            if (mainData.appconf.confs.application.stock_opened_file_history === true) {
                                //---exclude VRM, because it cancelable.
                                if (["OBJECTS","IMAGES"].indexOf(filetype) > -1) {
                                    await saveToInternalStorage(filetype, file);
                                }
                            }
                            */
                        }else{
                            mainData.elements.loading = false;
                        }
                    }else{
                        mainData.elements.loading = false;
                    }
                }catch(e) {
                    mainData.elements.loading = false;
                }
            }else{
                console.error("Not found window.showOpenFilePicker...");
            }
        }
        
    }
    /**
     * Open any file from IndexedDB
     * @param {String} dbname
     * @param {String} filename 
     * @return {Promise<File>} recently stocked file handle
     */
    const OnSelect_InternalStoragePicker = async (dbname,filename) => {
        var ret = null;
        var datadb = AppDB[INTERNAL_FILE[dbname]];
        if (datadb) {
            /**
             * @type {FileSystemFileHandle}
             */
            var result = await datadb.getItem(filename);
            if (result) {
                ret = await result.getFile();   
            }
        }
        return ret;
    }
    /**
     * save "AVATAR"-object into IndexedDB (exclude project file)
     * @param {String} dbname
     * @param {VOSFile} fileHandle 
     */
    const saveToInternalStorage = async (dbname, fileHandle) => {
        var metadb = (dbname == INTERNAL_FILE.PROJECT) ? AppDB.scene_meta : AppDB.avatar_meta;
        var datadb = AppDB[INTERNAL_FILE[dbname]];
        if (metadb && datadb) {
            var tmpfile = Vue.toRaw(fileHandle); // new VOSFile({});
            /*tmpfile.name = fileHandle.name; //await fileHandle.getFile();
            tmpfile.path = fileHandle.path;
            tmpfile.encoding = fileHandle.encoding;
            tmpfile.lastModified = fileHandle.lastModified;
            tmpfile.data = fileHandle.data;*/

            if (VFileHelper.flags.isHistoryFSAA && VFileHelper.flags.isEnableFSAA) {
                tmpfile = await fileHandle.getFile();
            }
            var names = tmpfile.name.split(".");
            var meta = new AppDBMeta(
                tmpfile.path,
                tmpfile.name,
                tmpfile.size,
                dbname, //appconst.INTERNAL_FILE
                new Date(tmpfile.lastModified),
                new Date(tmpfile.lastModified)
            );
            await metadb.setItem(tmpfile.name,meta);
            if (VFileHelper.flags.isElectron) {
                //---When Electron, no save to IndexedDB. Instead to local disk
                await datadb.setItem(tmpfile.name,tmpfile);
            }else{
                await datadb.setItem(tmpfile.name,tmpfile);
            }
            
            return true;
        }else{
            return false;
        }
    }
    /**
     * On click OK-button for VRM info dialog
     */
    const OnOk_VrminfoDlg = async (evt) => {
        var ischeck = modelOperator.getVRMFromTitle(mainData.elements.vrminfodlg.selectedAvatar.title);
        if (ischeck == null) {
            //---save to recently history
            if (mainData.appconf.confs.application.stock_opened_file_history === true) {
                await saveToInternalStorage("VRM", mainData.states.loadingfileHandle);            
            }
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'AcceptLoadVRM'},
                "firstload_vrm",QD_INOUT.returnJS,
                callback.firstload_vrm,
                {callback,filename:mainData.states.loadingfile,
                    fileloadtype: "v",
                    loadingfileHandle : mainData.states.loadingfileHandle}
            ));
            AppQueue.start();
        }else{
            appAlert(t("msg_already_added_collider"));
        }
        
    }
    const onclick_imageSelectorImage = async (evt) => {
        mainData.states.fileloadtype = "img";
        //---save to recently history
        if (mainData.appconf.confs.application.stock_opened_file_history === true) {
            await saveToInternalStorage("IMAGES", mainData.states.loadingfileHandle);            
        }

        var param = [mainData.states.loadingfile,mainData.states.fileloadname].join("\t");
        AppQueue.add(new queueData(
            {target:AppQueue.unity.FileMenuCommands,method:'ImageFileSelected',param:param},
            "sendobjectinfo",QD_INOUT.returnJS,
            callback.sendObjectInfo,
            {callback,
                objectURL:mainData.states.loadingfile,
                filename:mainData.states.fileloadname,
                fileloadtype: "img",
                loadingfileHandle : mainData.states.loadingfileHandle
            }
        ));
        AppQueue.start();
        mainData.elements.imageSelector.show = false;
    }
    const onclick_imageSelectorUImage = async (evt) => {
        mainData.states.fileloadtype = "ui";
        //---save to recently history
        if (mainData.appconf.confs.application.stock_opened_file_history === true) {
            await saveToInternalStorage("IMAGES", mainData.states.loadingfileHandle);            
        }
        var param = [mainData.states.loadingfile,mainData.states.fileloadname].join("\t");
        AppQueue.add(new queueData(
            {target:AppQueue.unity.FileMenuCommands,method:'UIImageFileSelected',param:param},
            "sendobjectinfo",QD_INOUT.returnJS,
            callback.sendObjectInfo,
            {callback,
                objectURL:mainData.states.loadingfile,
                filename:mainData.states.fileloadname,
                fileloadtype: "ui",
                loadingfileHandle : mainData.states.loadingfileHandle
            }
        ));
        AppQueue.start();
        mainData.elements.imageSelector.show = false;
    }
    const onload_effectDirectory = () => {
        var param = "effect";
        
        AppQueue.add(new queueData(
            {target:AppQueue.unity.FileMenuCommands,method:'ListGetAAS',param:param},
            "listgetaas",QD_INOUT.returnJS,
            callback.firstLoad_effectDirectory,
            {callback}
        ));
        
        //AppQueue.start();
    }
    const onchange_configdlg = (val) => {
        //console.log(val);
        //---Change states of FileSystemAccess API
        /*
        if (mainData.appconf.confs.application.use_fsaa_for_history != val.confs.application.use_fsaa_for_history) {
            if (val.confs.application.use_fsaa_for_history) {
                AppDB.clearHistory();
            }
        }*/
        //---copy lastest configuration
        mainData.appconf = val.copy();

        //---apply Unity and finally save
        mainData.appconf.applyUnity();
        AppQueue.start();
        mainData.appconf.save();

        modelOperator.setDarkMode(mainData.appconf.confs.application.UseDarkTheme);

        if (mainData.appconf.confs.fileloader.gdrive.enabled && (mainData.appconf.confs.fileloader.gdrive.url != "")) {
            mainData.states.googledrive_gas = true;
        }else{
            mainData.states.googledrive_gas = false;
        }

        //---backup functions
        schedulingBackup();
    }
    const schedulingBackup = () => {
        if (mainData.appconf.confs.application.enable_backup === true) {
            if (mainData.appconf.data.backupID) clearInterval(mainData.appconf.data.backupID);
            mainData.appconf.data.backupID = setInterval(() => {
                if (mainData.states.currentEditOperationCount != mainData.states.backupEditOperationCount) {
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.ManageAnimation,method:'SaveProject'},
                        "saveproject",QD_INOUT.returnJS,
                        callback.saveproject,
                        {callback, disktype : "bkup", savetype : "overwrite"}
                    ));
                    AppQueue.start();
                }
                mainData.states.backupEditOperationCount = mainData.states.currentEditOperationCount;
            },parseInt(mainData.appconf.confs.application.backup_project_interval) * 60 * 1000)
        }else{
            if (mainData.appconf.data.backupID) clearInterval(mainData.appconf.data.backupID);
        }
    }


    const checkSWUpdate = () => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistration()
            .then(reg => {
                if (reg) {
                    reg.onupdatefound = function () {
                        console.log('update found');
                        //alertify.warning("update found. Please reload this app.");
                        Quasar.Notify.create({
                            message : t("msg_found_update"), 
                            position : "top-right",
                            color : "warning",
                            textColor : "black",
                            timeout : 15000, 
                            multiLine : true,
                            actions : [
                                {label:"reload",color:"black",handler:() => {
                                    location.reload();
                                }}
                            ]
                        });
                        reg.update();
                    }
                }
        
            });
        }
    }
    const downloadAddressableAssetBundles = () => {
        var assets = ["default","effect"];
        for (var o of assets) {
            AppQueue.add(new queueData(
                {target:AppQueue.unity.FileMenuCommands,method:'DownloadAAS',param:o},
                "",QD_INOUT.toUNITY,
                null
            ));
        }
        
    }

    /**
     * 
     * @param {Event} evt 
     */
    const canvasdiv_scroll = (evt) => {
        mainData.elements.navigationdlg.scrollTop = evt.target.scrollTop;
        mainData.elements.navigationdlg.scrollLeft = evt.target.scrollLeft;
        mainData.elements.navigationdlg.selectRect = evt.target.getBoundingClientRect();
    }
    const navigationdlg_onmovecursor = (pos) => {
        document.getElementById("unity-container").scroll({top: pos.y, left: pos.x, behavior: "smooth"});
    }
    

    //---finalize-------------------------------------
    return {
        modelLoader : {
            setupDefaultObject,
            OnChange_Common_AppFile,OnChange_AppFile,OnChange_AppFilePicker,
            OnSelect_InternalStoragePicker,
            OnOk_VrminfoDlg,
            onclick_imageSelectorImage,onclick_imageSelectorUImage,
            onload_effectDirectory,onchange_configdlg,
            schedulingBackup,
            checkSWUpdate,
            downloadAddressableAssetBundles,
            //load_materialFile,destroy_materialFile,
            canvasdiv_scroll,navigationdlg_onmovecursor,
            saveToInternalStorage
        },
        dnd : {
            drop_evt,dragleave_evt,dragenter_evt,dragover_evt
        }
    };
}