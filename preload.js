const { app, BrowserWindow,  contextBridge, ipcRenderer  } = require('electron')

//const fs = require("fs")

contextBridge.exposeInMainWorld('elecAPI', {
    /**
     * save to file from dialog
     * @param {Object} param {
     *  suggestedName : String
     *  filters : FileFilters[]
     * }
     * @returns {path, name, size} or null (canceled)
     */
    saveFile :  async (param) => {
        var ret = await ipcRenderer.invoke("save",param);
        return ret;
    },
    /**
     * save to file directly (to path)
     * @param {Object} param {
     *  path : String
     * }
     * @returns {path, name, size}
     */
    saveDirect : async (param) => {
        var ret = await ipcRenderer.invoke("saveDirect",param);
        return param.path;
    },
    /**
     * open file(s) from dialog
     * @param {Object} param {
     *  suggestedName : String
     *  filters : FileFilters[]
     *  props : String[] - default is "openFile"
     *         (https://www.electronjs.org/docs/latest/api/dialog#dialogshowopendialogbrowserwindow-options)
     *  encoding : String - default is "utf-8"
     *  isBinary : Boolean - default is false
     *  mimetype : String
     * }
     * @returns {{path: String, encoding:String, data:Object}[]}
     */
    openFiles : async (param) => {
        var ret = await ipcRenderer.invoke("open",param);
        for (var i = 0; i < ret; i++) {
            if (ret[i].encoding == "binary") {
                //---if flag is BINARY, convert to Blob
                ret[i].data = new File(ret[i].data,ret[i].path); //,{ type: param.mimetype });
            }
        }
        
        return ret;
    },
    /**
     * open a file directly from path 
     * @param {Object} param {
     *  filepath : String
     *  encoding : String - default is "utf-8"
     *  isBinary : Boolean - default is false
     *  mimetype : String
     * }
     * @returns {String[]|Blob[]}
     */
    openDirect : async (param) => {
        const ret = await ipcRenderer.invoke("openDirect",param);
        for (var i = 0; i < ret; i++) {
            if (ret[i].encoding == "binary") {
                //---if flag is BINARY, convert to Blob
                ret[i].data = new File(ret[i].data,ret[i].path); //,{ type: param.mimetype });
            }
        }
        return ret;
    },
    /**
     * enumerate files in specified folder
     * @param {Object} param {
     *  dir : String
     *  filename : String
     *  extension : String
     * }
     * @returns {Object} [
     *  {name, fullpath, size, createDate, modDate}
     * ]
     */
    enumFiles : async (param) => {
        const ret = await ipcRenderer.invoke("enumFiles",param);
        return ret;
    },
    /**
     * check local disk file path
     * @param {Object} param {
     *  path : String
     * }
     * @returns {Boolean}
     */
    fileExist : async (param) => {
        const ret = await ipcRenderer.invoke("checkPath",param);
        return ret;
    },
    getWindows : async (param) => {
        const ret = await ipcRenderer.invoke("getwindows",param);
        return ret;
    },
    focusWindow : async (name) => {
        await ipcRenderer.invoke("focusWindow",name);
    }
});

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})
