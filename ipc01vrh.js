// Modules to control application life and create native browser window
const fs = require('fs')
const { app, BrowserWindow, ipcMain, dialog, session } = require('electron')
const path = require('path')
const mime = require("mime-types")


exports.defineIPC4VRoidHub = function () {
    const VRH_CLIENT_ID="";
    const VRH_CLIENT_SECRET="";

    ipcMain.handle("/vroidhub/authorize", async (event, param) => {
        var url = `https://hub.vroid.com/oauth/authorize`;
        var urlprm = `response_type=code&client_id=${VRH_CLIENT_ID}&redirect_uri=${param.redirect_uri}&scope=default`;
        var finalurl = `${url}?${urlprm}`;
        return {url:finalurl, cd:0};
    });
    ipcMain.handle("/vroidhub/request-token", async (event, param) => {
        var url = `https://hub.vroid.com/oauth/token`;
        var grant_type = param.grant_type;
        var reftoken = "";
        if (param.refresh_token) {
            reftoken = param.refresh_token;
        }
        var res = {};
        
        var urlprm = {
            client_id : process.env.VRH_CLIENT_ID,
            client_secret : process.env.VRH_CLIENT_SECRET,
            redirect_uri : param.redirect_uri,
            grant_type : grant_type,
            code : param.code,
        };
        if (grant_type == "refresh_token") {
            urlprm[`refresh_token`] = reftoken;
        }
        var finalurl = url; //`${url}?${urlprm.join("&")}`;
        console.log(finalurl);
        //res = ({url: url, prm: urlprm, appid: process.env.VRH_CLIENT_ID, cd:0});
        
        const result = await fetch(finalurl,{
            method: "POST",
            headers: {
                "X-Api-Version" : 11,
                "Content-Type" : "application/json"
            },
            mode: "no-cors",
            body : JSON.stringify(urlprm)
        })
        
        console.log(result);
        if (result.ok) {
            const js = await result.json();
            res = {cd:0, msg: "", appid: process.env.VRH_CLIENT_ID, data: js};
        }else{
            res = {cd: 9, msg: result.status + ":" + result.statusText, appid:"", data:null};
        }
        
    });
}
