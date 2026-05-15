import { BlobWriter, TextReader, TextWriter, ZipReader, ZipWriter } from "@zip.js/zip.js";
import { appMainData } from "./appmaindata";

export class ConfigExporter {
    constructor(maindata) {
        /** @type {appMainData} */
        this.maindata = maindata;
    }
    /**
     * Compress DB File and download.
     * @param {String} zipfilename
     * @param {Object} options 
     * @param {Boolean} options.includePose
     * @param {Boolean} options.includeScene
     * @param {Boolean} options.includeMotion
     * @param {Boolean} options.includeSceneMeta
     * @param {Boolean} options.includeVRMA
     * @param {Boolean} options.includeAvatarMeta
     * @param {Boolean} options.includeImage
     * @param {Boolean} options.includeUImage
     * @param {Boolean} options.includeObj
     * @param {Boolean} options.includeVRM
     * @param {Boolean} options.includeCapture
     */
    async exportZip(zipfilename, options = {includePose:true,includeScene:true,includeMotion:true,includeSceneMeta:true,includeVRMA:true,includeAvatarMeta:true,includeImage:true,includeUImage:true,includeObj:true,includeVRM:true,includeCapture:true}) {
        const bwriter = new BlobWriter("application/zip");
        const writer = new ZipWriter(bwriter);
        const metafile = [];
        
        metafile.push(":title: VRMViewMeister export data");
        metafile.push(":version:" + this.maindata.appinfo.version + " - " + this.maindata.appinfo.revision);
        metafile.push(":date:" + new Date().toISOString());
        await this._exportOrigfile(writer,options);
        await this._exportHistoryfile(writer,options);

        //---finalize
        await writer.add("METADATA",new TextReader(metafile.join("\n")));
        await writer.close();
        const blob =  await bwriter.getData();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = zipfilename;
        a.click();
        URL.revokeObjectURL(url);
    }
    /**
     * 
     * @param {ZipWriter} writer 
     * @param {Object} options 
     * @param {Boolean} options.includePose
     * @param {Boolean} options.includeScene
     * @param {Boolean} options.includeMotion
     * @param {Boolean} options.includeSceneMeta
     * @param {Boolean} options.includeVRMA
     * @param {Boolean} options.includeAvatarMeta
     * @param {Boolean} options.includeImage
     * @param {Boolean} options.includeUImage
     * @param {Boolean} options.includeObj
     * @param {Boolean} options.includeVRM
     * @param {Boolean} options.includeCapture
     */
    async _exportLocalfile(writer, options) {
        if (options.includeCapture) {
            const keys = await AppDB.capture.keys();
            for (const key of keys) {
                const item = await AppDB.capture.getItem(key);
                if (item) {
                    await writer.add(`db/mylocal/capture/${key}`,new TextReader(JSON.stringify(item)));
                }
            }
        }
    }
    /**
     * 
     * @param {ZipWriter} writer 
     * @param {Object} options 
     * @param {Boolean} options.includePose
     * @param {Boolean} options.includeScene
     * @param {Boolean} options.includeMotion
     * @param {Boolean} options.includeSceneMeta
     * @param {Boolean} options.includeVRMA
     * @param {Boolean} options.includeAvatarMeta
     * @param {Boolean} options.includeImage
     * @param {Boolean} options.includeUImage
     * @param {Boolean} options.includeObj
     * @param {Boolean} options.includeVRM
     * @param {Boolean} options.includeCapture
     */
    async _exportOrigfile(writer, options) {
        if (options.includePose) {
            const keys = await AppDB.pose.keys();
            for (const key of keys) {
                const item = await AppDB.pose.getItem(key);
                if (item) {
                    await writer.add(`db/origfile/pose/${key}`,new TextReader(JSON.stringify(item)));
                }
            }
        }
        if (options.includeMotion) {
            const keys = await AppDB.motion.keys();
            for (const key of keys) {
                const item = await AppDB.motion.getItem(key);
                if (item) {
                    await writer.add(`db/origfile/motion/${key}`,new TextReader(JSON.stringify(item)));
                }
            }
        }
        /*if (options.includeVRMA) {
            const keys = await AppDB.vrma.keys();
            for (const key of keys) {
                const item = await AppDB.vrma.getItem(key);
                if (item) {
                    await writer.add(`db/origfile/vrma/${key}`,new TextReader(JSON.stringify(item)));
                }
            }
        }*/
        if (options.includeScene) {
            const keys = await AppDB.scene.keys();
            for (const key of keys) {
                const item = await AppDB.scene.getItem(key);
                if (item) {
                    await writer.add(`db/origfile/scene/${key}`,new TextReader(JSON.stringify(item)));
                }
            }
        }
        if (options.includeSceneMeta) {
            const keys = await AppDB.scene_meta.keys();
            for (const key of keys) {
                const item = await AppDB.scene_meta.getItem(key);
                if (item) {
                    await writer.add(`db/origfile/scene_meta/${key}`,new TextReader(JSON.stringify(item)));
                }
            }
        }
    }
    /**
     * 
     * @param {ZipWriter} writer 
     * @param {Object} options 
     * @param {Boolean} options.includePose
     * @param {Boolean} options.includeScene
     * @param {Boolean} options.includeMotion
     * @param {Boolean} options.includeSceneMeta
     * @param {Boolean} options.includeVRMA
     * @param {Boolean} options.includeAvatarMeta
     * @param {Boolean} options.includeImage
     * @param {Boolean} options.includeUImage
     * @param {Boolean} options.includeObj
     * @param {Boolean} options.includeVRM
     * @param {Boolean} options.includeCapture
     */
    async _exportHistoryfile(writer, options) {
        if (options.includeAvatarMeta) {
            const keys = await AppDB.avatar_meta.keys();
            for (const key of keys) {
                const item = await AppDB.avatar_meta.getItem(key);
                if (item) {
                    await writer.add(`db/history/avatar_meta/${key}`,new TextReader(JSON.stringify(item)));
                }
            }
        }
        if (options.includeVRM) {
            const keys = await AppDB.vrm.keys();
            for (const key of keys) {
                const item = await AppDB.vrm.getItem(key);
                if (item) {
                    await writer.add(`db/history/vrm/${key}`,new TextReader(JSON.stringify(item)));
                }
            }
        }
        if (options.includeObj) {
            const keys = await AppDB.obj.keys();
            for (const key of keys) {
                const item = await AppDB.obj.getItem(key);
                if (item) {
                    await writer.add(`db/history/obj/${key}`,new TextReader(JSON.stringify(item)));
                }
            }
        }
        if (options.includeImage) {
            const keys = await AppDB.image.keys();
            for (const key of keys) {
                const item = await AppDB.image.getItem(key);
                if (item) {
                    await writer.add(`db/history/image/${key}`,new TextReader(JSON.stringify(item)));
                }
            }
        }
        if (options.includeUImage) {
            const keys = await AppDB.uimage.keys();
            for (const key of keys) {
                const item = await AppDB.uimage.getItem(key);
                if (item) {
                    await writer.add(`db/history/uimage/${key}`,new TextReader(JSON.stringify(item)));
                }
            }
        }
    }
}
export class ConfigImporter {
    constructor(maindata) {
        /** @type {appMainData} */
        this.maindata = maindata;
    }
    /**
     * compress zip and export all application data.
     * @param {File} zipfile
     */
    async importZip(zipfile) {
        const reader = new ZipReader(new BlobReader(zipfile));
        const entries = await reader.getEntries();
        const ishit = entries.findIndex(v => v.filename == "METADATA");

        if ((ishit > -1) && entries && entries.length) {
            for (const entry of entries) {
                if (entry.filename.indexOf("db/mylocal/capture/") > -1) {
                    const text = await entry.getData(new TextWriter());
                    const data = (text);
                    const keyarr = entry.filename.split("/");
                    let okey = keyarr.pop();
                    await AppDB.capture.setItem(okey, data);
                }else if (entry.filename.indexOf("db/origfile/pose") > -1) {
                    const text = await entry.getData(new TextWriter());
                    const data = JSON.parse(text);
                    const keyarr = entry.filename.split("/");
                    let okey = keyarr.pop();
                    await AppDB.pose.setItem(okey, data);
                }else if (entry.filename.indexOf("db/origfile/motion") > -1) {
                    const text = await entry.getData(new TextWriter());
                    const data = JSON.parse(text);
                    const keyarr = entry.filename.split("/");
                    let okey = keyarr.pop();
                    await AppDB.motion.setItem(okey, data);
                }else if (entry.filename.indexOf("db/origfile/scene") > -1) {
                    const text = await entry.getData(new TextWriter());
                    const data = JSON.parse(text);
                    const keyarr = entry.filename.split("/");
                    let okey = keyarr.pop();
                    await AppDB.scene.setItem(okey, data);
                }else if (entry.filename.indexOf("db/origfile/scene_meta") > -1) {
                    const text = await entry.getData(new TextWriter());
                    const data = JSON.parse(text);
                    const keyarr = entry.filename.split("/");
                    let okey = keyarr.pop();
                    await AppDB.scene_meta.setItem(okey, data);
                }else if (entry.filename.indexOf("db/mylocal/capture") > -1) {
                    const text = await entry.getData(new TextWriter());
                    const data = (text);
                    const keyarr = entry.filename.split("/");
                    let okey = keyarr.pop();
                    await AppDB.capture.setItem(okey, data);
                }
            }
        }
    }
}