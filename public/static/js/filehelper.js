
export class VFileType {
    constructor() {
        this.description = "";
        /**
         * @type {JSON} mimetype: [extension]
         */
        this.accept = {};
    }
}
export class VFileOptions {
    constructor() {
        /**
         * @type {Boolean}
         */
        this.multiple = false;
        /**
         * @type {Array<VFileType}
         */
        this.types = [];

        /**
         * @type {String}
         */
        this.suggestedName = "";
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
            isEnableFSAA : ("showOpenFilePicker" in window) ? true : false,
            //It is FileSystemFileHandle, save to the history.(Chromium, Electron only)
            isHistoryFSAA : false,

            isElectron : false
        }

        this.elements = {
            uploader : null,
            downloader : null,
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
                var files = await window.showOpenFilePicker(fileoption.openOptions);
                if (files) {
                    this.common_open(files);
                }
            }else{
                var arr = [];
                for (var obj in fileoption.types[0].accept) {
                    arr = fileoption.types[0].accept[obj];
                    break;
                }
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
     * @param {*} path 
     */
    openFromPath(path) {
        
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
     * @returns 
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
        }else{
            for (var i = 0; i < files.length; i++) {
                ret.push(files[i]);
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
    async saveUsingDialog(content, options, useHTMLSaving) {
        try {
            if (this.flags.isElectron) {
                var filters = options.saveElectronFilters;
                var ret = await elecAPI.saveFile({
                    suggestedName : options.suggestedName,
                    filters : filters,
                    data : content
                });
                console.log(ret);
            }else{
                if (
                    ((useHTMLSaving == undefined) && (this.flags.isEnableFSAA))
                    ||
                    ((useHTMLSaving != undefined) && (useHTMLSaving === false) && (this.flags.isEnableFSAA))
                ) {
                    //---NOT USE
                    const savehandle = await window.showSaveFilePicker(options.saveOptions);
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
                            return {value: tmpcontent.length, cd:0, err:""};
                        }else{
                            throw "FileSystemFileHandle write permission error!";
                        }
                    }
                }else{
                    var fullname = options.suggestedName;
    
                    var bb = new Blob([content], {type : "application/json"});
                    var burl = URL.createObjectURL(bb);
    
                    this.elements.downloader.href = burl;
                    this.elements.downloader.download = fullname;
                    this.elements.downloader.click(); 
                    URL.revokeObjectURL(burl);
                    return {value: bb.size, cd:0, err:""};
                }
            }

            
        }catch(e) {
            AppDB.writeLog("fileHelper.saveUsingDialog","error",{
                err:e,
                data: {value : null, cd:9, err:e}
            });
            return {value : null, cd:9, err:e};
        }
    }
    /**
     * 
     * @param {*} fileOrHandle 
     * @param {*} content 
     * @param {VFileOptions} options 
     * @returns 
     */
    async saveOnefile(fileOrHandle, content, options, useHTMLSaving) {
        try {
            if (this.flags.isElectron) {
                var filters = options.saveElectronFilters;
                var ret = await elecAPI.saveDirect({
                    path : fileOrHandle,
                    data : content
                });
                console.log(ret);
            }
            if (
                ((useHTMLSaving == undefined) && (this.flags.isEnableFSAA))
                ||
                ((useHTMLSaving != undefined) && (useHTMLSaving === false) && (this.flags.isEnableFSAA))
            ) {
                //---if FileSystemFileHandle, save directly : NOT USE
                var flag = false;
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
                }
            }else{
                //---if File, download a content to Download directory
                var fullname = options.suggestedName;

                var bb = new Blob([content], {type : "application/json"});
                var burl = URL.createObjectURL(bb);

                this.elements.downloader.href = burl;
                this.elements.downloader.download = fullname;
                this.elements.downloader.click(); 
                URL.revokeObjectURL(burl);
                return {value: bb.size, cd:0, err:""};
            }
        }catch(e) {
            AppDB.writeLog("fileHelper.saveOnefile","error",{
                err:e,
                data: {value : null, cd:9, err:e}
            });
            return {value : null, cd:9, err:e};
        }
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