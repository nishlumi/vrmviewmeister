// Modules to control application life and create native browser window
const fs = require('fs')
const { app, BrowserWindow, ipcMain, dialog, session } = require('electron')
const path = require('path')


function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1450,
        height: 950,
        //autoHideMenuBar : true,
        webPreferences: {
            //webPreferences: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

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
                'Content-Security-Policy': ['script-src \'unsafe-eval\'']
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
    const { canceled, filePaths } = await dialog.showOpenDialog({
        filters: filters,
        defaultPath : defaultPath,
        properties : props
    });

    if (canceled) return { canceled, data: [] }

    var data = {};
    
    for (var i = 0; i < filePaths.length; i++) {
        var filePath = filePaths[i];
        
        data[filePath] = fs.readFileSync(filePath, { encoding: encoding });
    }
    return data;
});
ipcMain.handle("save", async (event, param) => {
    var filters = param.filters;

    var defaultPath = param.suggestedName.split(".")[0];
    const {canceled, filePath } = await dialog.showSaveDialog({
        filters : filters,
        defaultPath : defaultPath,
    });
    if (canceled) return "";

    fs.writeFileSync(filePath, param.data);
    return filePath;
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
        return stat.size;
    }catch(e) {
        return 0;
    }
    
});