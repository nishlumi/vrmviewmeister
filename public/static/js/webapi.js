const AIManager = {
    options : {
        url : "",
        sd : {
            txt2img : {},
            img2img : {}
        }
    },
    setup : (appconf) => {
        AIManager.options.url = appconf.confs.aiapis.baseurl;
        AIManager.options.sd.txt2img = JSON.original(appconf.confs.aiapis.txt2img);
        AIManager.options.sd.img2img = JSON.original(appconf.confs.aiapis.img2img);
    },
    callcheck: () => {
        if (AIManager.options.url.trim() == "") return false;
        return true;
    },
    sdcall : async (func, method, mainparam) => {
        if (!AIManager.callcheck()) throw new Exception("error:URL not found");

        var finalurl = `${AIManager.options.url}/${func}`;
        var finalparam = AIManager.options.sd[func];
        for (var obj in mainparam) {
            finalparam[obj] = mainparam[obj]
        }
        return fetch(finalurl,{
            method: method,
            credentials : "same-origin",
            headers : {
                "Content-Type": "application/json",
                "accept" : "application/json"
            },
            body : JSON.stringify(finalparam)
        })
        .then(ret1 => {
            if (ret1.ok) {
                return ret1.arrayBuffer();
            }
            return null;
        });
    }
}