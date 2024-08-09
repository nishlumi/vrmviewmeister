var express = require('express');
const azlib = require("./azure-lib");
var router = express.Router();
require('dotenv').config()



router.get("/enumdir", async function (req, res) {
    const param = req.query;
    const uabm = new azlib.UserAzureBlobManager();
    await uabm.SetContainer(param.container_name);
    var ret = await uabm.ListBlob(param.container_name,param.withdata == "1" ? true : false);
    var finalret = {cd : 0, msg: "",
        data : ret
    }
    res.send(finalret);
    
});

router.get("/load", async function (req, res) {
    const param = req.query;
    const uabm = new azlib.UserAzureBlobManager();
    await uabm.SetContainer(param.container_name);
    var finalret = {};
    try {
        var ret = await uabm.DownloadAs(param.download_type, param.filename,{});
        finalret = {cd : 0, msg: "",
            data : ret
        }
    }catch(e) {
        finalret = {cd : 9, msg: "msg_file_not_found",
            data : null
        }
    }

    res.send(finalret);
    
});

module.exports = router;