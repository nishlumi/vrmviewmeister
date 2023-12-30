// Modules to control application life and create native browser window
const fs = require('fs')
const { app, BrowserWindow, ipcMain, dialog, session } = require('electron')
const path = require('path')
const mime = require("mime-types")

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1450,
        height: 950,
        autoHideMenuBar : true,
        webPreferences: {
            //webPreferences: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.webContents.setWindowOpenHandler( ({url}) => {
        console.log(url);
        if (
            (url.indexOf("static/win/bonetran/") > -1) ||
            (url.indexOf("static/win/capture/") > -1) ||
            (url.indexOf("static/win/mp/") > -1) ||
            (url.indexOf("static/win/pose/") > -1) || 
            (url.indexOf("static/win/vplayer/") > -1) ||
            (url.indexOf("static/win/keyframe/") > -1)
        ) {
            return {
                action: "allow",
                overrideBrowserWindowOptions : {
                    frame: true,
                    fullscreenable: false,
                    webPreferences : {
                        preload: path.join(__dirname, 'preload.js')
                    }
                }
            }
        }
        return { action: "deny"};
    });
    // and load the index.html of the app.
    mainWindow.loadFile('public/_index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.commandLine.appendSwitch("disable-site-isolation-trials");
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
            callback({
              responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ['script-src \'unsafe-eval\''],
                "Content-Encoding": "gzip",
              }
            })
        });
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle("checkPath",(event, param) => {
    const path = param.path;

    return fs.existsSync(path);
});
ipcMain.handle('openfilefrompath', async (event, ...args) => {
    var path = args[0];
    var mode = "r";
    if (args.length > 1)  {
        if (args[1] == "read") {
            mode = "r";
        }else if (args[1] == "readwrite") {
            mode = "r+";
        }
    }
    var fid = fs.openSync(args[0],mode);
    if (fid) {

    }
});
ipcMain.handle("open", async (event, param) => {
    var defaultPath = param.suggestedName;
    var filters = param.filters || [];
    var props = param.props || ["openFile"];
    var encoding = param.encoding || "utf8";
    const isBinary = param.isBinary || false;
    console.log(JSON.stringify(filters));
    const { canceled, filePaths } = await dialog.showOpenDialog({
        filters: filters,
        defaultPath : defaultPath,
        properties : props
    });

    if (canceled) return null; //{ canceled, data: [] }

    var data = [];
    
    for (var i = 0; i < filePaths.length; i++) {
        var filePath = filePaths[i];
        var fileobj = {
            path : filePath,
            name : path.basename(filePath),
            encoding : "",
            type : "",
            lastModified : "",
            size : 0,
            data : null
        }
        
        const fsta = fs.statSync(filePath);
        fileobj.lastModified = fsta.mtime;
        fileobj.size = fsta.size;
        fileobj.type = mime.lookup(filePath);
        if (isBinary === true) {
            fileobj.encoding = "binary";
            fileobj.data = fs.readFileSync(filePath);
        }else{
            fileobj.encoding = encoding;
            fileobj.data = fs.readFileSync(filePath, { encoding: encoding });
        }
        data.push(fileobj);
    }
    if (filePaths.length == 0) data = null;

    return data;
});
ipcMain.handle("openDirect",async (event, param) => {
    var encoding = param.encoding || "utf8";
    var filePath = param.filepath || "";
    const isBinary = param.isBinary || false;

    var data = [];
    if (filePath != "") {
        var fileobj = {
            path : filePath,
            name : path.basename(filePath),
            encoding : "",
            type : "",
            lastModified : "",
            size : 0,
            data : null
        }
        
        const fsta = fs.statSync(filePath);
        fileobj.lastModified = fsta.mtime;
        fileobj.size = fsta.size;
        fileobj.type = mime.lookup(filePath);
        if (isBinary === true) {
            fileobj.encoding = "binary";
            fileobj.data = fs.readFileSync(filePath);
        }else{
            fileobj.encoding = encoding;
            fileobj.data = fs.readFileSync(filePath, { encoding: encoding });
        }
        data.push(fileobj);
    }
    return data;
});
ipcMain.handle("enumFiles",async (event, param) => {
    const targetDir = param.dir || "";
    const filterFile = param.filename || "";
    const filterExt = param.extension || "";

    var ret = [];
    if (targetDir != "") {
        const dirents = fs.readdirSync(targetDir, { withFileTypes: true});
        if (dirents) {
            for (const ent of dirents) {
                const name = ent.name;
                const type = ent.isFile() ? "file" : ent.isDirectory() ? "dir" : "other";
                if (type == "file") {
                    if (name.endsWith(filterExt)) { //---extension ?
                        if (name.indexOf(filterFile) > -1) { //---filename ?
                            const filesta = fs.statSync(path.join(targetDir,name));
                            ret.push({
                                name : ent.name,
                                fullpath : path.join(targetDir,ent.name),
                                size : filesta.size,
                                createDate : filesta.birthtime,
                                modDate : filesta.mtime
                            });
                        }
                    }
                }
            }
        }
    }
    return ret;
});
ipcMain.handle("save", async (event, param) => {
    var filters = param.filters;

    var defaultPath = param.suggestedName.split(".")[0];
    const {canceled, filePath } = await dialog.showSaveDialog({
        filters : filters,
        defaultPath : defaultPath,
    });
    console.log("canceled=",canceled);
    if (canceled) return null;

    fs.writeFileSync(filePath, param.data);
    var stat = fs.statSync(filePath);
    return {path: filePath, name : path.basename(filePath), size : stat.size};
});
/**
 * param.path - File path
 * param.data - File content
 */
ipcMain.handle("saveDirect", async (event, param) => {
    var filePath = param.path;
    try {
        fs.writeFileSync(filePath, param.data);
        var stat = fs.statSync(filePath);
        return {path: filePath, name : path.basename(filePath), size : stat.size };
    }catch(e) {
        return 0;
    }
});

ipcMain.on("ondragstart",(evt, filepath) => {
    evt.sender.startDrag({
        file: path.join(__dirname,filepath),
    });
});
ipcMain.handle("getwindows", async (event, param) => {
    var arr = [];
    BrowserWindow.getAllWindows().forEach(v => {
        arr.push({id:v.id, name:v.title});
    });
    
});
ipcMain.handle("focusWindow", async (event, name) => {
    var arr = BrowserWindow.getAllWindows();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].title.toLowerCase() == name.toLowerCase()) {
            arr[i].focus();
        }
    }
});