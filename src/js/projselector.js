import { appModelOperator } from "./model/operator.js";
import { UnityCallbackFunctioner } from "./model/callback.js";
import { FILEEXTENSION_ANIMATION, FILEOPTION, INTERNAL_FILE, AF_TARGETTYPE } from "../res/appconst.js";
import { VVAnimationProject } from "./prop/cls_vvavatar.js";
import { AppDBMeta } from "./appconf.js";
import { VFileHelper, VFileOptions, VFileType } from "../../public/static/js/filehelper.js";

/**
 * 
 * @param {*} app 
 * @param {*} Quasar 
 * @param {*} mainData 
 * @param {appModelOperator} modelOperator
 * @param {UnityCallbackFunctioner} callback 
 * @returns 
 */
export function defineProjectSelector(app, Quasar, mainData, modelOperator, callback, refs) {
    const { t  } = VueI18n.useI18n({ useScope: 'global' });

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
    const onclick_ok_projectSelector = async () => {
        var datadb = AppDB[mainData.elements.projectSelector.selectDB];

        console.log(datadb);
        try {            
            var originalresult = await datadb.getItem(mainData.elements.projectSelector.selected)
            if (originalresult) {
                var options = {
                    mode : "read"
                };
                console.log(originalresult);
                if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.PROJECT) {
                    modelOperator.newProject(false);

                    mainData.states.currentProjectFilename = mainData.elements.projectSelector.selected;
                    mainData.states.currentProjectHandle = mainData.elements.projectSelector.selected;
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
                    AppQueue.add(new queueData(
                        {target:AppQueue.unity.ManageAnimation,method:'LoadProject',param:JSON.stringify(originalresult)},
                        "openproject",QD_INOUT.returnJS,
                        callback.openproject,
                        {callback}
                    ));
                    AppQueue.start();
                    mainData.elements.projectSelector.show = false;
                }else{
                    var isJudge = true;
                    if (VFileHelper.flags.isHistoryFSAA && VFileHelper.flags.isEnableFSAA) {
                        isJudge = await modelOperator.verifyFileHandlePermission(originalresult,options);
                    }
                    //if (await modelOperator.verifyFileHandlePermission(result,options) === true) {
                    if (isJudge) {
                        var result = null;
                        if (VFileHelper.flags.isHistoryFSAA) {
                            result = await originalresult.getFile();
                        }else{
                            //---File
                            result = originalresult;
                        }
                        mainData.elements.loading = true;
                        mainData.elements.loadingTypePercent = false;
                        if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.VRM) {
                            var f = result; //await result.getFile();
                            var fdata = URL.createObjectURL(f);
                            //mainData.data.objectUrl.vrm = fdata;
                            //mainData.states.fileloadname = f.name;
                            //mainData.states.fileloadtype = "v";
                            //mainData.states.loadingfileHandle = result;
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
                                    {callback,filename:f.name,
                                        fileloadtype: "v",
                                        loadingfileHandle : f}
                                ));
                            }
                        }else if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.OBJECTS) {
                            //---For VBX, Obj, etc...
                            var f = result; //await result.getFile();
                            var fdata = URL.createObjectURL(f);
                            mainData.data.objectUrl.vrm = fdata;
                            mainData.states.fileloadname = f.name;
                            mainData.states.fileloadtype = "v";
                            mainData.states.loadingfileHandle = result;
                            var filearr =  mainData.states.fileloadname.split(".");
                            var ext = filearr[filearr.length-1];
                            
                            fdata += "," + mainData.states.fileloadname + "," + ext;
                            AppQueue.add(new queueData(
                                {target:AppQueue.unity.FileMenuCommands,method:'LoadOtherObjectURI',param:fdata},
                                "sendobjectinfo",QD_INOUT.returnJS,
                                callback.sendObjectInfo,
                                {callback,objectURL:fdata,filename:f.name,
                                    fileloadtype: "o",
                                    loadingfileHandle : f}
                            ));
                        }else if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.IMAGES) {
                            var f = result; //await result.getFile();
                            var fdata = URL.createObjectURL(f);
                            mainData.states.fileloadname = f.name;
                            mainData.states.loadingfile = fdata;
                            mainData.states.loadingfileHandle = originalresult;
                            
                            mainData.elements.projectSelector.show = false;
                            mainData.elements.imageSelector.show = true;
            
                            //---final decide is after.
                            return;
                        }
                        
                        AppQueue.start();
                        mainData.elements.projectSelector.show = false;
                    }
                }
                
            }
        }catch(e) {
            console.log(e);
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
        
        /*mainData.elements.projectSelector.files.splice(0,mainData.elements.projectSelector.files.length);
        AppDB.scene_meta.iterate((value,key,num)=>{
            console.log(key,value,num);
            mainData.elements.projectSelector.files.push({
                fullname : value.fullname,
                size : value.size,
                createdDate : value.createdDate.toLocaleString(),
                updatedDate : value.updatedDate.toLocaleString(),
            });
        });*/
    }
    const onclick_download_projectSelector = async () => {
        var metaDB = mainData.elements.projectSelector.selectDB == INTERNAL_FILE.PROJECT ? AppDB.scene_meta : AppDB.avatar_meta;
        var dataDB = AppDB[mainData.elements.projectSelector.selectDB];

        dataDB.getItem(mainData.elements.projectSelector.selected)
        .then(async v => {
            var fullname = mainData.elements.projectSelector.selected;
            if (fullname.indexOf(FILEEXTENSION_ANIMATION) == -1) {
                fullname = mainData.elements.projectSelector.selected + FILEEXTENSION_ANIMATION;
            }

            var vopt = new VFileType();
            vopt.accept = FILEOPTION.PROJECT.types[0].accept;
            vopt.description = FILEOPTION.PROJECT.types[0].description;
            var vf = new VFileOptions();
            vf.types.push(vopt);
            vf.suggestedName = fullname;
            VFileHelper.saveUsingDialog(JSON.stringify(v),vf,true);

            /*
            var bb = new Blob([JSON.stringify(v)], {type : "application/json"});
            if (refs.lnk_saveproject.value.href) window.URL.revokeObjectURL(refs.lnk_saveproject.value.href);
            var burl = URL.createObjectURL(bb);
            refs.lnk_saveproject.value.href = burl;
            refs.lnk_saveproject.value.download = fullname;
            refs.lnk_saveproject.value.click(); 
            */
            /*
            //File System Access API
            if ("showSaveFilePicker" in window) {
                const savepicker = await window.showSaveFilePicker({
                    suggestedName : mainData.elements.projectSelector.selected,
                    types: mainData.elements.projectSelector.selectType
                });
                if (savepicker) {
                    const writer = await savepicker.createWritable();
                    if (mainData.elements.projectSelector.selectDB == INTERNAL_FILE.PROJECT) {
                        writer.write(JSON.stringify(v));
                    }else{
                        writer.write(v);
                    }
                    await writer.close();
                }
            }else{
                console.log("Not found window.showSaveFilePicker...");
            }
            */
        });
    }
    /**
     * change event for opening vvmproj-file (input-element)
     * @param {Array<File>} files 
     */
    const onchange_fil_projselector = async (files) => {
        if (files.length > 0) {
            var file = files[0];

            var f = file ;//await file.getFile();
            var textdata = await f.text();
            var js = JSON.parse(textdata);

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
        VFileHelper.openFromDialog(fopt,(files,cd,err)=>{
            if (cd == 0) onchange_fil_projselector(files);
        });
        /*
        if ("showOpenFilePicker" in window) {
            try {
                var files = await window.showOpenFilePicker({
                    types: mainData.elements.projectSelector.selectType
                });
                if (files) {
                    if (files.length > 0) {
                        //**
                        // * @type {FileSystemFileHandle}
                        // *
                        var f0 = files[0];
                        var file = await f0.getFile();
                        var textdata = await file.text();
                        var js = JSON.parse(textdata);

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
            }catch(e) {
                console.log(e);
            }
        }else{
            console.log("Not found window.showOpenFilePicker...");
        }
        */
    }

    const fil_projselector = Vue.ref(null);

    return {
        projectSelectorEvent : Vue.reactive({
            onclick_ok_projectSelector,onclick_rename_projectSelector,
            onclick_delete_projectSelector,onclick_download_projectSelector,
            onclick_upload_projectSelector,
            onchange_fil_projselector
        }),
        fil_projselector
    }
}