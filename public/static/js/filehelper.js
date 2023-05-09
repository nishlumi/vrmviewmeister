
export class VFileType {
    constructor() {
        this.description = "";
        /**
         * @type {JSON} mimetype: [extension]
         */
        this.accept = {};
    }
}
export class VOSFile {
    constructor(obj) {
        /**
         * @type {String} file path
         */
        this.path = obj.path || "";
        /**
         * @type {String}
         */
        this.name = obj.name || obj.path || "";
        /**
         * @type {String} file encoding
         */
        this.encoding = obj.encoding || "";
        /**
         * @type {String} file mime type
         */
        this.type = obj.type || "";
        /**
         * @type {Date}
         */
        this.lastModified = obj.lastModified || new Date();
        /**
         * @type {Number}
         */
        this.size = obj.size || 0;
        /**
         * @type {String|Blob}
         */
        this.data = obj.data || null;
    }
}
export class VFileOptions {
    constructor() {
        /**
         * @type {Boolean}
         */
        this.multiple = false;
        /**
         * @type {Array<VFileType>}
         */
        this.types = [];

        /**
         * @type {String}
         */
        this.suggestedName = "";

        /**
         * @type {String} encoding(utf-8, binary, etc...)
         */
        this.encoding = "binary";
    }
    get openOptions() {
        return {
            multiple : this.multiple,
            types : this.types
        }
    }
    get saveOptions() {
        return {
            types : this.types,
            suggestedName : this.suggestedName
        }
    }
    get saveElectronFilters() {
        var arr = [];
        for (var i = 0; i < this.types.length; i++) {
            var v = this.types[i];

            var ext = null;
            for (var obj in v.accept) {
                ext = v.accept[obj];
            }
            for (var e = 0; e < ext.length; e++) {
                ext[e] = ext[e].replace(".","");
            }

            arr.push({
                name: v.description,
                extensions : ext
            });
        }
        return arr;
    }
}
export class VFileOperator {
    constructor() {
        this.flags = {
            //Is enable File System Access API ?
            isEnableFSAA : false, //("showOpenFilePicker" in window) ? true : false,
            //It is FileSystemFileHandle, save to the history.(Chromium, Electron only)
            isHistoryFSAA : false,

            isElectron : false
        }

        this.elements = {
            uploader : null,
            downloader : null,
            upload_fileoptions : {}
        }
        this.callbacks = {
            open : null,
            save : null
        };

        this.elements.uploader = document.createElement("input");
        this.elements.uploader.type = "file";
        this.elements.uploader.style.display = "none";
        this.elements.uploader.addEventListener("change",this._onchange_uploader.bind(this));

        this.elements.downloader = document.createElement("a");
        this.elements.downloader.style.display = "none";

        if (window.elecAPI) {
            this.flags.isElectron = true;
        }
    }
    //==========================================================================
    // Open functions
    //==========================================================================
    /**
     * To open a file from file dialog
     * @param {VFileOptions} fileoption file type options
     * @param {Function} callback (files,cd,err) => {}
     */
    async openFromDialog(fileoption, callback) {
        this.callbacks.open = null;
        this.callbacks.open = callback;
        try {
            if (this.flags.isEnableFSAA) {
                var vfopt = new VFileOptions();
                vfopt.types = fileoption.types;
                var files = await window.showOpenFilePicker(vfopt.openOptions);
                if (files) {
                    this.common_open(files);
                }
            }else if (this.flags.isElectron) {
                var acceptExtension = [];
                for (var obj in fileoption.types[0].accept) {
                    acceptExtension = fileoption.types[0].accept[obj].map(o => o.replace(".",""));
                }
                var vfopt = {
                    name : fileoption.types[0].description,
                    extensions : acceptExtension
                }
                var files = await elecAPI.openFiles({
                    filters : [vfopt],
                    encoding : fileoption.encoding,
                    isBinary : fileoption.encoding == "binary" ? true : false
                });
                if (files) {
                    this.common_open(files);
                }
            }else{
                var arr = [];
                for (var obj in fileoption.types[0].accept) {
                    arr = fileoption.types[0].accept[obj];
                    break;
                }
                this.elements.upload_fileoptions = fileoption;
                this.elements.uploader.value = null;
                this.elements.uploader.accept = arr.join(",");
                this.elements.uploader.click();
            }
        }catch(e) {
            if (this.callbacks.open) (this.callbacks.open)([],9,e);
        }
        
    }
    /**
     * To open a file from saved File or FileSystemFileHandle
     * @param {*} fileOrHandle existed File or FileSystemFileHandle
     * @param {JSON} options 
     * @param {Function} callback (files,cd,err) => {}
     */
    async openOnefile(fileOrHandle, options, callback) {
        var mode = ("mode" in options) ? options.mode : {mode: "read"};
        this.callbacks.open = null;
        this.callbacks.open = callback;

        try {
            if (this.flags.isEnableFSAA) {
                var flag = false;
                flag = await this.checkFilePermission(fileOrHandle, mode);
                if (flag !== true) {
                    flag = await this.verifyFilePermission(fileOrHandle, mode);
                }
                if (flag === true) {
                    //---if FileSystemAccess API, get File from FileSystemFileHandle
                    const file = await fileOrHandle.getFile();
                    await this.common_open([file],0,"");
                }
            }else{
                //---if File API, return directly
                await this.common_open([fileOrHandle],0,"");
            }
        }catch(e) {
            if (this.callbacks.open) (this.callbacks.open)([],9,e);
        }
    }
    /**
     * To open a file from specified path (For Electron)
     * @param {String} path 
     * @param {Object} options
     * @returns 
     */
    async openFromPath(path,options) {
        this.callbacks.open = null;
        const files = await elecAPI.openDirect({
            filepath:path,
            mimetype : options.mimetype || "",
            encoding : options.encoding || "utf8",
            isBinary : options.isBinary || false
        });
        /**
         * @type {VOSFile[]}
         */
        var ret = [];
        if (files) {
            ret = await this.common_open(files);
        }
        return ret;
    }
    /**
     * Event function for input element
     * @param {Event} evt 
     */
    async _onchange_uploader(evt) {
        if (evt.target.files) this.common_open(evt.target.files);
    }
    /**
     * Common function to open a file
     * @param {Array<File> | Array(FileSystemFileHandle)} files 
     * @returns {VOSFile[]}
     */
    async common_open (files) {
        var ret = [];
        if (this.flags.isEnableFSAA) {
            for (var i = 0; i < files.length; i++) {
                if (this.flags.isHistoryFSAA) {
                    ret.push(await files[i]);
                }else{
                    ret.push(await files[i].getFile());
                }
                
            }
        }else if (this.flags.isElectron) {
            for (var i = 0; i < files.length; i++) {
                ret.push(new VOSFile(files[i]));
            }
        }else{
            //---web (File)
            for (var i = 0; i < files.length; i++) {
                /**
                 * @type {File}
                 */
                const f = files[i];
                var fl = new VOSFile({});
                fl.path = f.name;
                fl.name = f.name;
                if ("encoding" in this.elements.upload_fileoptions) {
                    fl.encoding = this.elements.upload_fileoptions.encoding;
                }else{
                    fl.encoding = this.checkEncoding(f.type);
                }
                
                fl.type = f.type;
                fl.size = f.size;
                fl.data = f;
                ret.push(fl);
            }
        }
        if (this.callbacks.open) (this.callbacks.open)(ret,0,"");
        return ret;
    }
    //==========================================================================
    // Save functions
    //==========================================================================
    /**
     * 
     * @param {*} content 
     * @param {VFileOptions} options  
     */
    async saveUsingDialog(content, options, useHTMLSaving = false) {
        const ret = {
            value : "",
            name : "",
            path : "",
            cd : 0,
            err : ""
        };
        try {
            if (this.flags.isElectron) {
                var filters = options.saveElectronFilters;
                var saved = await elecAPI.saveFile({
                    suggestedName : options.suggestedName,
                    filters : filters,
                    data : content
                });
                //console.log(ret);
                if (saved == null) {
                    ret.cd = 1;
                }else{
                    ret.path = saved.path;
                    ret.name = saved.name;
                    ret.value = saved.size;    
                }

            }else{
                if (
                    ((useHTMLSaving == undefined) && (this.flags.isEnableFSAA))
                    ||
                    ((useHTMLSaving != undefined) && (useHTMLSaving === false) && (this.flags.isEnableFSAA))
                ) {
                    //---NOT USE
                    /*const savehandle = await window.showSaveFilePicker(options.saveOptions);
                    if (savehandle) {
                        var flag = false;
                        var mode = {"mode": "readwrite"};
                        flag = await this.checkFilePermission(savehandle, mode);
                        if (flag !== true) {
                            flag = await this.verifyFilePermission(savehandle, mode);
                        }
    
                        if (flag === true) {
                            //---begin to write file
                            const writer = await savehandle.createWritable();
                            writer.write(content);
                            await writer.close();
                            //return {value: tmpcontent.length, cd:0, err:""};
                            ret.value = tmpcontent.length;

                        }else{
                            throw "FileSystemFileHandle write permission error!";
                        }
                    }*/
                }else{
                    //---webapp
                    var fullname = options.suggestedName;

                    var acckey = "";
                    var accval = "";
                    for (var obj in options.types[0].accept) {
                        acckey = obj;
                        accval = options.types[0].accept[obj];
                        break;
                    }

    
                    //var bb = new Blob([content], {type : acckey});
                    //var burl = URL.createObjectURL(bb);
    
                    this.elements.downloader.accept = accval;
                    this.elements.downloader.href = content;
                    this.elements.downloader.download = fullname;
                    this.elements.downloader.click(); 
                    //URL.revokeObjectURL(burl);
                    //return {value: fullname, cd:0, err:""};
                    ret.value = fullname;
                    ret.name = fullname;
                    ret.path = fullname;
                }
            }

            
        }catch(e) {
            AppDB.writeLog("fileHelper.saveUsingDialog","error",{
                err:e,
                data: {value : null, cd:9, err:e}
            });
            //return {value : null, cd:9, err:e};
            ret.value = null;
            ret.cd = 9;
            ret.err = e;
        }
        return ret;
    }
    /**
     * 
     * @param {*} fileOrHandle file path
     * @param {*} content file data
     * @param {VFileOptions} options 
     * @returns 
     */
    async saveOnefile(fileOrHandle, content, options, useHTMLSaving) {
        const ret = {
            value : "",
            name : "",
            path : "",
            cd : 0,
            err : ""
        };
        try {
            if (this.flags.isElectron) {
                var filters = options.saveElectronFilters;
                var saved = await elecAPI.saveDirect({
                    path : fileOrHandle,
                    data : content
                });
                //console.log(ret);
                ret.path = saved.path;
                ret.name = saved.name;
                ret.value = saved.size;
            }else{
                if (
                    ((useHTMLSaving == undefined) && (this.flags.isEnableFSAA))
                    ||
                    ((useHTMLSaving != undefined) && (useHTMLSaving === false) && (this.flags.isEnableFSAA))
                ) {
                    //---if FileSystemFileHandle, save directly : NOT USE
                    /*var flag = false;
                    var mode = {"mode": "readwrite"};
                    flag = await this.checkFilePermission(fileOrHandle, mode);
                    if (flag !== true) {
                        flag = await this.verifyFilePermission(fileOrHandle, mode);
                    }

                    if (flag === true) {
                        const writer = await fileOrHandle.createWritable();
                        writer.write(content);
                        await writer.close();
                        return {value: content.length, cd:0, err:""};
                    }else{
                        throw "FileSystemFileHandle write permission error!";
                    }*/
                }else{
                    //---webapp: if File, download a content to Download directory
                    var fullname = options.suggestedName;

                    var acckey = "";
                    var accval = "";
                    for (var obj in options.types[0].accept) {
                        acckey = obj;
                        accval = options.types[0].accept[obj];
                        break;
                    }

                    var bb = new Blob([content], {type : acckey});
                    var burl = URL.createObjectURL(bb);

                    this.elements.downloader.accept = accval[0];
                    this.elements.downloader.href = burl;
                    this.elements.downloader.download = fullname.replace(accval[0],"");
                    this.elements.downloader.click(); 
                    URL.revokeObjectURL(burl);
                    //return {value: bb.size, cd:0, err:""};
                    ret.value = bb.size;
                    ret.name = fullname;
                    ret.path = fullname;
                }
            }
            
        }catch(e) {
            AppDB.writeLog("fileHelper.saveOnefile","error",{
                err:e,
                data: {value : null, cd:9, err:e}
            });
            //return {value : null, cd:9, err:e};
            ret.value = null;
            ret.cd = 9;
            ret.err = e;
        }
        return ret;
    }
    //==========================================================================
    // Check functions
    //==========================================================================
    /**
     * wheather available API is File System Access API
     */
    get checkNativeAPI() {
        //return this.flags.isEnableFSAA;
        return this.flags.isElectron;
    }
    /**
     * To check permission to access a file
     * @param {*} target File or FileSystemFileHandle
     * @param {JSON} options 
     * @returns 
     */
    async checkFilePermission (target,options) {
        if (this.flags.isEnableFSAA) {
            if (await target.requestPermission(options) === "granted"){
                return true;
            }
        }else{
            return true;
        }
    }
    async checkFilepath (path) {
        return await elecAPI.fileExist({path});
    }
    checkEncoding (type) {
        if (
            (type.indexOf("json") > -1) ||
            (type.indexOf("text") > -1)
        ) {
            return  "utf8";
        }else{
            return  "binary";
        }
    }
    /**
     * To get permission to access a file
     * @param {*} target File or FileSystemFileHandle
     * @param {JSON} options 
     * @returns 
     */
    async verifyFilePermission (target,options) {
        if (this.flags.isEnableFSAA) {
            if (await target.requestPermission(options) === 'granted') {
                return true;
            }
        }else{
            return true;
        }
    }
    async getProperDropItems (transferItems, isgetHandle = true) {
        /**
         * @type {File[]}
         */
        var ret = [];
        if (this.flags.isEnableFSAA) {
            if (isgetHandle) {
                ret = [...transferItems]
                .filter(item => item.kind === "file")
                .map(async item => await item.getAsFileSystemHandle());
            }else{
                ret = [...transferItems]
                .filter(item => item.kind === "file")
                .map(async item => await item.getAsFile());
            }
        }else{
            ret = [...transferItems]
            .filter(item => item.kind === "file")
            .map(async item => await item.getAsFile());
        }
        return ret;
    }
}

export const VFileHelper = new VFileOperator();