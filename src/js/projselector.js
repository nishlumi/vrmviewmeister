import { appModelOperator } from "./model/operator.js";
import { UnityCallbackFunctioner } from "./model/callback.js";
import { FILEEXTENSION_ANIMATION, FILEOPTION, INTERNAL_FILE, AF_TARGETTYPE, STORAGE_TYPE, SAMPLEURL, SAMPLEKEY, FILEEXTENSION_VRMA } from "../res/appconst.js";
import { VVAnimationProject } from "./prop/cls_vvavatar.js";
import { AppDBMeta } from "./appconf.js";
import { VFileHelper, VFileOptions, VFileType, VOSFile } from "../../public/static/js/filehelper.js";
import { appMainData } from "./prop/appmaindata.js";
import { ManagedVRMA } from "./prop/cls_unityrel.js";

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {appMainData} mainData 
 * @param {defineModelLoader.modelLoader} modelLoader
 * @param {appModelOperator} modelOperator
 * @param {UnityCallbackFunctioner} callback 
 * @returns 
 */
export function defineProjectSelector(app, Quasar, mainData, modelLoader, modelOperator, callback, refs) {
    const { t  } = VueI18n.useI18n({ useScope: 'global' });

    //===watch-----------------------------------------
    const wa_projectSelector_show = Vue.watch( () => mainData.elements.projectSelector.show, (newval) => {
        mainData.elements.projectSelector.searchstr = "";
    });

    //===computed--------------------------------------
    const cmp_projectSelectorStorageGDrive = Vue.computed(() => {
        return mainData.elements.projectSelector.selectStorageType == STORAGE_TYPE.GOOGLEDRIVE;
    });


    //===event=-------------------------------------------
    /**
     * recover data path from history DB
     * @param {object} db
     * @param {String} rawpath 
     * @param {AF_TARGETTYPE} objtype 
     */
    const inputDatapathFromHistory = async (db, rawpath, objtype) => {
        var result = await db.getItem(rawpath);
        if (result) {

        }
        return result;
    }
    /**
     * Push OK(decide) from internal storage/Google Drive/internal history
     * @returns 
     */
    const onclick_ok_projectSelector = async () => {
        var datadb = AppDB[mainData.elements.projectSelector.selectDB];
        const DBname = mainData.elements.projectSelector.selectDBName;

        try {            
            var originalresult = null;
            mainData.elements.loading = true;
            //---load by each storage type
            if (mainData.elements.projectSelector.selectStorageType == STORAGE_TYPE.INTERNAL) {
                originalresult = await datadb.getItem(mainData.elements.projectSelector.selected);
                mainData.states.currentProjectFromStorageType = "i";
            }else if (
                (mainData.elements.projectSelector.selectStorageType == STORAGE_TYPE.GOOGLEDRIVE) ||
                (mainData.elements.projectSelector.selectStorageType == STORAGE_TYPE.APPLICATION)
            ) {
                mainData.states.currentProjectFromStorageType = "g";

                const filegd = mainData.appconf.confs.fileloader.gdrive;
                var baseurl = filegd.url;
                var apikey = filegd.apikey;
                var urlparams = new URLSearchParams();

                if (mainData.elements.projectSelector.selectStorageType == STORAGE_TYPE.APPLICATION) {
                    baseurl = SAMPLEURL;
                    apikey = SAMPLEKEY;
                }

                var ishit = mainData.elements.projectSelector.files.find(v => {
                    if (v.id == mainData.elements.projectSelector.selected) return true;
                    return false;
                });
                var finalurl = "";                
                if (ishit) {
                    var filenamearr = ishit.fullname.split(".");
                    var fext = filenamearr[filenamearr.length-1];

                    /*if (baseurl.indexOf("https://script.google.com/macros/s/") < 0) {
                        baseurl = "https://script.google.com/macros/s/" + baseurl;
                    }
                    if (baseurl.lastIndexOf("/exec") < 0) {
                        baseurl = baseurl + "/exec";
                    }*/

                    //---setting URL parameters
                    urlparams.append("mode","load");
                    urlparams.append("apikey",apikey);
                    urlparams.append("fileid",mainData.elements.projectSelector.selected);
                    urlparams.append("extension",fext);

                    //finalurl = `${baseurl}?mode=load&apikey=${apikey}&fileid=${mainData.elements.projectSelector.selected}&extension=${fext}`;
                    finalurl = baseurl;
                    finalurl += "?" + urlparams.toString();

                    var fetchret = await fetch(finalurl);
                    if (fetchret.ok) {
                        var js = await fetchret.json();
                        if (
                            (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.PROJECT) ||
                            (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.POSE) ||
                            (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.MOTION)
                        ) {
                            originalresult = js.data;

                            modelOperator.newProject(false);
                            mainData.states.currentProjectFileID = js.id;
                            mainData.states.currentProjectFilename = js.name;
                            mainData.states.currentProjectFilepath = js.name;
                            mainData.states.currentProjectHandle = js.name;

                        }else{
                            if (js.cd != 0) {
                                throw new Exception(js.msg);
                            }
                            var retfile = new VOSFile({});
                            retfile.name = js.name;
                            retfile.path = js.name;
                            retfile.id = js.id;
                            retfile.size = js.size;
                            retfile.type = js.mimeType;
                            retfile.encoding = "binary";
                            retfile.storageType = "ggd";

                            var barr = new Uint8Array(js.data);
                            var bb = new Blob([barr.buffer]); //,"application/octet-stream"
                            retfile.data = new File([bb], js.name);

                            originalresult = retfile;
                        }
                    }
                }
                

            }
            
            //---main body to load
            if (originalresult) {
                var options = {
                    mode : "read"
                };
                if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.PROJECT) {

                    if (mainData.elements.projectSelector.selectStorageType != STORAGE_TYPE.GOOGLEDRIVE) {
                        modelOperator.newProject(false);
                        mainData.states.currentProjectFilename = mainData.elements.projectSelector.selected;
                        mainData.states.currentProjectFilepath = mainData.elements.projectSelector.selected;
                        mainData.states.currentProjectHandle = mainData.elements.projectSelector.selected;
                    }
                    mainData.states.currentProjectFromFile = false;

                    //mainData.elements.loading = true;
                    mainData.elements.loadingTypePercent = true;
                    //---recover File object
                    /**
                     * @type {Array<VVCast>}
                     */
                    var casts = originalresult.casts;
                    var fullCount = 0;
                    for (var c = 0; c < casts.length; c++) {
                        var INTF = "";
                        var path = "";
                        if (casts[c].type == AF_TARGETTYPE.VRM) {
                            INTF = INTERNAL_FILE.VRM;
                            fullCount++;
                        }else if (casts[c].type == AF_TARGETTYPE.OtherObject) { 
                            INTF = INTERNAL_FILE.OBJECTS;
                            var castfile = await inputDatapathFromHistory(AppDB[INTF],casts[c].path,casts[c].type);
                            if (castfile) {
                                fullCount++;
                            }
                        }else if (casts[c].type == AF_TARGETTYPE.Image) {
                            INTF = INTERNAL_FILE.IMAGES;
                            fullCount++;
                        }else if (casts[c].type == AF_TARGETTYPE.UImage) {
                            INTF = INTERNAL_FILE.IMAGES;
                            fullCount++;
                        }
                    }
                    if (fullCount == 0) {
                        mainData.elements.percentLoad.percent = 0;
                    }else{
                        mainData.elements.percentLoad.percent = (100.0 / parseFloat(fullCount)) / 100;
                    }

                    //---call Unity
                    //---execute new project from HTML
                    //modelOperator.newProject();

                    //modelLoader.setupDefaultObject();
                    //modelOperator.destroy_materialFile(true);
                    //---execute from Unity at here
                    modelOperator.newProjectAndOpenProject(originalresult);
                    mainData.elements.projectSelector.show = false;
                    /*then((nppret) => {
                        AppQueue.add(new queueData(
                            {target:AppQueue.unity.ManageAnimation,method:'LoadProject',param:JSON.stringify(originalresult)},
                            "openproject",QD_INOUT.returnJS,
                            callback.openproject,
                            {callback, preload: originalresult.preloadFiles}
                        ));
                        AppQueue.start();
                        
                    });*/
                    
                }else{
                    var isJudge = true;
                    if (VFileHelper.flags.isHistoryFSAA && VFileHelper.flags.isEnableFSAA) {
                        isJudge = await modelOperator.verifyFileHandlePermission(originalresult,options);
                    }
                    //---get mimetype
                    var mimetype = "";
                    if (DBname == "VRMA") {
                        for (var obj in FILEOPTION["VRMA"].types[0].accept) {
                            mimetype = obj;
                        }
                    }else{
                        for (var obj in FILEOPTION[DBname].types[0].accept) {
                            mimetype = obj;
                        }
                    }
                    

                    //if (await modelOperator.verifyFileHandlePermission(result,options) === true) {
                    if (isJudge) {
                        var originalvos = new VOSFile(originalresult);
                        originalvos.storageType = originalresult.storageType || mainData.elements.projectSelector.selectStorageType || "";

                        var result = null;
                        if (VFileHelper.flags.isHistoryFSAA) {
                            result = await originalresult.getFile();
                        }else if (VFileHelper.flags.isElectron) {
                            //---For Electron build
                            /**
                             * @type {VOSFile}
                             */
                            var vos = originalresult;
                            if (originalresult instanceof File) {
                                //---old version is File object
                                result = originalresult;

                                originalvos.data = originalresult;
                                originalvos.encoding = VFileHelper.checkEncoding(originalresult.type);
                            }else{
                                //---new version is VOSFile.data
                                if (
                                    (mainData.elements.projectSelector.selectStorageType == STORAGE_TYPE.GOOGLEDRIVE) ||
                                    (mainData.elements.projectSelector.selectStorageType == STORAGE_TYPE.APPLICATION)
                                 ) {
                                    //---from google drive (already loaded)
                                    result = originalresult.data;
                                }else{
                                    //---from local disk
                                    var ishit_local = false;
                                    if (vos["storageType"]) {
                                        if (vos.storageType == STORAGE_TYPE.LOCAL) {
                                            ishit_local = true;
                                        }else if (vos.storageType == STORAGE_TYPE.INTERNAL) {
                                            ishit_local = false;
                                        }else if (vos.storageType == STORAGE_TYPE.VROIDHUB) {
                                            ishit_local = false;
                                        }
                                    }else{
                                        ishit_local = true;
                                    }
                                    if (ishit_local) {
                                        var chk = await VFileHelper.checkFilepath(vos.path,vos.storageType);
                                        if (chk === true) {
                                            var files = await VFileHelper.openFromPath(vos.path,{
                                                isBinary : true,
                                                mimetype : mimetype
                                            });
                                            if (files.length > 0) {
                                                result = new Blob([files[0].data]);
        
                                                originalvos = files[0];
                                            }
                                        }else{
                                            appAlert(t("msg_error_allfile"));
                                            throw new Error(t("msg_error_allfile"));
                                        }
                                    }else{
                                        result = vos.data;
                                        originalresult = vos;
                                    }
                                    
                                }
                                
                            }
                            
                            
                        }else{
                            //---File
                            if (originalresult instanceof File) {
                                //---old version is File object
                                result = originalresult;
                                originalvos.data = originalresult;
                                originalvos.encoding = VFileHelper.checkEncoding(originalresult.type);
                            }else{
                                //---new version is VOSFile.data
                                result = originalresult.data;
                            }
                        }
                        
                        //---start to load each file type selected.
                        mainData.elements.loadingTypePercent = false;
                        if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.VRM) {
                            var f = result; //await result.getFile();
                            var fdata = URL.createObjectURL(f);
                            mainData.data.objectUrl.vrm = fdata;
                            mainData.states.fileloadname = originalresult.name;
                            mainData.states.fileloadtype = "v";
                            mainData.states.loadingfileHandle = originalvos;
                            if (
                                (mainData.elements.projectSelector.selectStorageType == STORAGE_TYPE.GOOGLEDRIVE)
                                ||
                                (mainData.elements.projectSelector.selectStorageType == STORAGE_TYPE.APPLICATION)
                             ) {
                                AppQueue.add(new queueData(
                                    {target:AppQueue.unity.FileMenuCommands,method:'LoadVRMURI',param:fdata},
                                    "firstload_vrm",QD_INOUT.returnJS,
                                    callback.sendObjectInfo,
                                    {callback,objectURL:fdata,filename:originalresult.name,
                                        fileloadtype: mainData.states.fileloadtype,
                                        loadingfileHandle : originalresult}
                                ));
                            }else{
                                //---projectselector type INTERNAL is same as HISTORY
                                AppQueue.add(new queueData(
                                    {target:AppQueue.unity.FileMenuCommands,method:'LoadVRMURI',param:fdata},
                                    "firstload_vrm",QD_INOUT.returnJS,
                                    callback.historySendObjectInfo,
                                    {callback,objectURL:fdata}
                                ));
                                if (mainData.appconf.confs.application.shortcut_vrminfo_from_history) {
                                    AppQueue.add(new queueData(
                                        {target:AppQueue.unity.FileMenuCommands,method:'AcceptLoadVRM'},
                                        "accept_vrm",QD_INOUT.returnJS,
                                        callback.firstload_vrm,
                                        {callback,filename:originalresult.name,
                                            fileloadtype: "v",
                                            loadingfileHandle : originalvos}
                                    ));
                                }
                            }
                            
                        }else if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.OBJECTS) {
                            //---For VBX, Obj, etc...
                            var f = result; //await result.getFile();
                            var fdata = URL.createObjectURL(f);
                            mainData.data.objectUrl.vrm = fdata;
                            mainData.states.fileloadname = originalresult.name;
                            mainData.states.fileloadtype = "o";
                            mainData.states.loadingfileHandle = originalvos;
                            var filearr =  mainData.states.fileloadname.split(".");
                            var ext = filearr[filearr.length-1];
                            
                            var param = [fdata,mainData.states.fileloadname,ext].join("\t");
                            AppQueue.add(new queueData(
                                {target:AppQueue.unity.FileMenuCommands,method:'LoadOtherObjectURI',param:param},
                                "sendobjectinfo",QD_INOUT.returnJS,
                                callback.sendObjectInfo,
                                {callback,objectURL:fdata,filename:originalresult.name,
                                    fileloadtype: "o",
                                    loadingfileHandle : originalvos}
                            ));
                        }else if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.IMAGES) {
                            var f = result; //await result.getFile();
                            var fdata = URL.createObjectURL(f);
                            mainData.states.fileloadname = originalresult.name;
                            mainData.states.loadingfile = fdata;
                            mainData.states.loadingfileHandle = originalvos;
                            
                            mainData.elements.projectSelector.show = false;
                            mainData.elements.imageSelector.show = true;
            
                            //---final decide is after.
                            return;
                        }else if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.VRMA) {
                            var ishit = mainData.elements.projdlg.vrmaList.findIndex(v => {
                                if (v.filepath == originalvos.path) {
                                    return true;
                                }
                                return false;
                            });

                            if (ishit == -1) {
                                //---For VRMAnimation
                                var f = result; 
                                var fdata = URL.createObjectURL(f);
                                mainData.data.objectUrl.vrm = fdata;
                                mainData.states.fileloadname = originalresult.name || originalresult.filename;
                                mainData.states.fileloadtype = "vrma";
                                mainData.states.loadingfileHandle = originalvos;
                                var filearr =  mainData.states.fileloadname.split(".");
                                var ext = filearr[filearr.length-1];
                                
                                var param = JSON.stringify(new ManagedVRMA(fdata, mainData.states.fileloadname));
                                AppQueue.add(new queueData(
                                    {target:AppQueue.unity.ManageAnimation,method:'OpenVRMA',param:param},
                                    "openvrma",QD_INOUT.returnJS,
                                    callback.loadAfterVRMA,
                                    {callback,objectURL:fdata,filename:mainData.states.fileloadname,
                                        fileloadtype: "vrma",
                                        loadingfileHandle : originalvos,
                                        saveInProject:false}
                                ));
                            }else{
                                if (fdata) URL.revokeObjectURL(fdata);
                                appAlert(t("msg_opened_samfile"));
                                callback.mainData.elements.loading = false;
                                
                            }

                            
                        }
                        
                        AppQueue.start();
                        mainData.elements.projectSelector.show = false;

                        //---save to recently history
                        if (mainData.appconf.confs.application.stock_opened_file_history === true) {
                            //---This timing is PROJECT,OBJECTS only (VRM and IMAGES is after)
                            if (
                                (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.OBJECTS) ||
                                (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.IMAGES)
                            ) {
                                var histdbtype = "";
                                if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.OBJECTS) histdbtype = "OBJECTS";
                                if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.IMAGES) histdbtype = "IMAGES";
                                modelLoader.saveToInternalStorage(histdbtype, originalvos);
                            }
                            
                        }
                    }
                }
                
            }
        }catch(e) {
            appNotifyWarning(e,{timeout:3000});
            console.error(e);
            mainData.elements.loading = false;
        }
        
        
    }
    const onclick_rename_projectSelector = async () => {
        appPrompt(t("mm_objlist_rename_msg"),async (newname)=>{
            var metaDB = mainData.elements.projectSelector.selectDB == INTERNAL_FILE.PROJECT ? AppDB.scene_meta : AppDB.avatar_meta;
            var dataDB = AppDB[mainData.elements.projectSelector.selectDB];

            var v = await metaDB.getItem(mainData.elements.projectSelector.selected)
            if (v) {
                v.name = newname;
                if (newname.indexOf(FILEEXTENSION_ANIMATION) > -1) {
                    v.fullname = newname;
                }else{
                    v.fullname = newname + FILEEXTENSION_ANIMATION;
                }
                
                await metaDB.setItem(v.fullname,v);
                await metaDB.removeItem(mainData.elements.projectSelector.selected);

                var v2 = await dataDB.getItem(mainData.elements.projectSelector.selected)
                if (v2) {
                    await dataDB.setItem(v.fullname,v2);
                    await dataDB.removeItem(mainData.elements.projectSelector.selected);
    
                    onclick_refresh_projectSelector();
                    modelOperator.setTitle(v.fullname);
                }
            }
        },mainData.elements.projectSelector.selected);
    }
    const onclick_delete_projectSelector = () => {
        appConfirm(t('msg_proj_delconfirm'),async () => {
            var metaDB = mainData.elements.projectSelector.selectDB == INTERNAL_FILE.PROJECT ? AppDB.scene_meta : AppDB.avatar_meta;
            var dataDB = AppDB[mainData.elements.projectSelector.selectDB];

            var v = await metaDB.getItem(mainData.elements.projectSelector.selected)
            if (v) {
                await metaDB.removeItem(mainData.elements.projectSelector.selected);

                var v2 = await dataDB.getItem(mainData.elements.projectSelector.selected)
                if (v2) {
                    await dataDB.removeItem(mainData.elements.projectSelector.selected);
                    onclick_refresh_projectSelector();

                    //---remove materials in project
                    var keys = await AppDB.materials.keys();
                    for (var i = 0; i < keys.length; i++) {
                        var js = await AppDB.materials.getItem(keys[i]);
                        if (js.projectName == mainData.elements.projectSelector.selected) {
                            await AppDB.materials.removeItem(keys[i]);
                        }
                    }
                }
            }
        });
    }
    const onclick_refresh_projectSelector = () => {
        for (var obj in INTERNAL_FILE) {
            if (INTERNAL_FILE[obj] == mainData.elements.projectSelector.selectDB) {
                modelOperator.enumerateFilesToProjectSelector(obj);
                break;
            }
        }
        
    }
    const onclick_download_projectSelector = async () => {
        var DBNAME = mainData.elements.projectSelector.selectDB;
        if (mainData.elements.projectSelector.selectStorageType == STORAGE_TYPE.GOOGLEDRIVE) {

            const filegd = mainData.appconf.confs.fileloader.gdrive;
            var apikey = filegd.apikey;
            var ishit = mainData.elements.projectSelector.files.find(v => {
                if (v.id == mainData.elements.projectSelector.selected) return true;
                return false;
            });
            var finalurl = "";                
            if (ishit) {
                var filenamearr = ishit.fullname.split(".");
                var fext = filenamearr[filenamearr.length-1];
                finalurl = `${filegd.url}?mode=load&apikey=${apikey}&fileid=${mainData.elements.projectSelector.selected}&extension=${fext}`;
                var fetchret = await fetch(finalurl);
                if (fetchret.ok) {
                    var js = await fetchret.json();
                    if (
                        (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.PROJECT)
                    ) {
                        var fullname = js.name;
                        if (fullname.indexOf(FILEEXTENSION_ANIMATION) == -1) {
                            fullname = mainData.elements.projectSelector.selected + FILEEXTENSION_ANIMATION;
                        }
                        var vopt = new VFileType();
                        vopt.accept = FILEOPTION.PROJECT.types[0].accept;
                        vopt.description = FILEOPTION.PROJECT.types[0].description;
                        var vf = new VFileOptions();
                        vf.types.push(vopt);
                        vf.suggestedName = fullname;
                        

                        if (VFileHelper.flags.isElectron) {
                            VFileHelper.saveUsingDialog(JSON.stringify(v),vf,true);
                        }else{
                            var acckey = "";
                            var accval = "";
                            for (var obj in vopt.accept) {
                                acckey = obj;
                                accval = vopt.accept[obj];
                                break;
                            }
                            var content = new Blob([JSON.stringify(js.data)], {type : acckey});
                            var burl = URL.createObjectURL(content);
                            VFileHelper.saveUsingDialog(burl,vf,true)
                            .then(ret => {
                                URL.revokeObjectURL(burl);
                            });
                        }
                    }
                }
            }
        }else if (mainData.elements.projectSelector.selectStorageType == STORAGE_TYPE.INTERNAL) {
            var metaDB = mainData.elements.projectSelector.selectDB == INTERNAL_FILE.PROJECT ? AppDB.scene_meta : AppDB.avatar_meta;
            var dataDB = AppDB[mainData.elements.projectSelector.selectDB];

            dataDB.getItem(mainData.elements.projectSelector.selected)
            .then(async v => {
                var fullname = mainData.elements.projectSelector.selected;
                if ((DBNAME == INTERNAL_FILE.PROJECT) && (fullname.indexOf(FILEEXTENSION_ANIMATION) == -1)) {
                    fullname = mainData.elements.projectSelector.selected + FILEEXTENSION_ANIMATION;
                }else if ((DBNAME == INTERNAL_FILE.VRMA) && (fullname.indexOf(FILEEXTENSION_VRMA) == -1)) {
                    fullname = mainData.elements.projectSelector.selected + FILEEXTENSION_VRMA;
                }

                var vopt = new VFileType();
                if (DBNAME == INTERNAL_FILE.PROJECT) {
                    vopt.accept = FILEOPTION.PROJECT.types[0].accept;
                    vopt.description = FILEOPTION.PROJECT.types[0].description;
                }else if (DBNAME == INTERNAL_FILE.VRMA) {
                    vopt.accept = FILEOPTION.VRMA.types[0].accept;
                    vopt.description = FILEOPTION.VRMA.types[0].description;
                }
                
                var vf = new VFileOptions();
                vf.types.push(vopt);
                vf.suggestedName = fullname;
                

                if (VFileHelper.flags.isElectron) {
                    VFileHelper.saveUsingDialog(JSON.stringify(v),vf,true);
                }else{
                    var acckey = "";
                    var accval = "";
                    for (var obj in vopt.accept) {
                        acckey = obj;
                        accval = vopt.accept[obj];
                        break;
                    }
                    if (DBNAME == INTERNAL_FILE.VRMA) {
                        var content = new Blob([v.data], {type : acckey});
                        var burl = URL.createObjectURL(content);
                        VFileHelper.saveUsingDialog(burl,vf,true)
                        .then(ret => {
                            URL.revokeObjectURL(burl);
                        });
                    }else{
                        var content = new Blob([JSON.stringify(v)], {type : acckey});
                        var burl = URL.createObjectURL(content);
                        VFileHelper.saveUsingDialog(burl,vf,true)
                        .then(ret => {
                            URL.revokeObjectURL(burl);
                        });
                    }
                    
                }
                
            });
        }
        
    }
    /**
     * change event for opening vvmproj-file (input-element)
     * @param {Array<File>} files 
     */
    const onchange_fil_projselector = async (files) => {
        if (files.length > 0) {
            var file = files[0];

            var f = file ;//await file.getFile();
            var textdata = "";
            var js = null;
            if (f.text) {
                textdata = await f.text();
                js = JSON.parse(textdata);
            }
            if (f.data.text) {
                textdata = await f.data.text();
                js = JSON.parse(textdata);
            }            
            

            if (("mkey" in js) && ("casts" in js) && ("timeline" in js)) {
                var curdate = new Date(file.lastModified);
                var meta = new AppDBMeta(
                    file.name + (file.name.indexOf(FILEEXTENSION_ANIMATION) == -1 ? FILEEXTENSION_ANIMATION : ""),
                    file.name,
                    textdata.length,
                    "PROJECT",
                    curdate,
                    curdate,
                );
                
                var proj = new VVAnimationProject(js);

                await AppDB.scene_meta.setItem(meta.fullname,meta);
                await AppDB.scene.setItem(meta.fullname,proj);
                onclick_refresh_projectSelector();
            }else{
                appAlert(t("msg_error_allfile"));
                return;
            }
        }
    }
    /**
     * click event for opening vvmproj-file (File System Access API)
     */
    const onclick_upload_projectSelector = async () => {
        const fopt = new VFileOptions();
        fopt.types = FILEOPTION.PROJECT.types;
        VFileHelper.openFromDialog(fopt, 0, (files,cd,err)=>{
            if (cd == 0) onchange_fil_projselector(files);
        });
        
    }
    const onchange_searchstr = (val) => {
        var arr = [];
        for (var i = 0; i < mainData.elements.projectSelector.searchedFiles.length; i++) {
            var v = mainData.elements.projectSelector.searchedFiles[i];
            if (v.fullname.toLowerCase().indexOf(val.toLowerCase()) > -1)  {
                arr.push(v);
            }
        }
        mainData.elements.projectSelector.files = arr;
        /*modelOperator.enumerateFilesToProjectSelector(
            mainData.elements.projectSelector.selectDBName,
            val
        );*/
    }

    const fil_projselector = Vue.ref(null);

    return {
        projectSelectorEvent : Vue.reactive({
            onclick_ok_projectSelector,onclick_rename_projectSelector,
            onclick_delete_projectSelector,onclick_download_projectSelector,
            onclick_upload_projectSelector,
            onchange_fil_projselector,onchange_searchstr
        }),
        wa_projectSelector_show,
        cmp_projectSelectorStorageGDrive,
        fil_projselector
    }
}