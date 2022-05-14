const { app, BrowserWindow,  contextBridge, ipcRenderer  } = require('electron')

const fs = require("fs")

contextBridge.exposeInMainWorld('elecAPI', {
    saveFile :  async (param) => {
        var ret = await ipcRenderer.invoke("save",param);
        return ret;
    },
    saveDirect : async (param) => {
        var ret = await ipcRenderer.invoke("saveDirect",param);
        return ret;
    },
    openFiles : async (param) => {
        var ret = await ipcRenderer.invoke("open",param);
        return ret;
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
