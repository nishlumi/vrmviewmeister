const azlib = require("./routes/azure-lib.js");


exports.defineIPC4Azure = function(ipcMain, pid, pkey) {
    ipcMain.handle("/samplesv/enumdir",async (event, param) => {
        const uabm = new azlib.UserAzureBlobManager(pid, pkey);
        
        await uabm.SetContainer(param.container_name);
        var ret = await uabm.ListBlob(param.container_name,param.withdata == "1" ? true : false);
        return {cd : 0, msg: "",
            data : ret
        }
    });
    ipcMain.handle("/samplesv/load",async (event, param) => {
        const uabm = new azlib.UserAzureBlobManager(pid, pkey);
        await uabm.SetContainer(param.container_name);
        var ret = null;
        try {
            ret = await uabm.DownloadAs(param.download_type, param.filename,{});
            return {cd : 0, msg: "",
                data : ret
            }
        }catch(e) {
            return {cd : 9, msg: "msg_file_not_found",
                data : null
            }
        }
    });
}