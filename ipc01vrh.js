// Modules to control application life and create native browser window
const fs = require('fs')
//const { app, BrowserWindow, ipcMain, dialog, session } = require('electron')
const path = require('path')
const mime = require("mime-types")

/**
 * 
 * @param {Electron.IpcMain} ipcMain 
 */
exports.defineIPC4VRoidHub = function (ipcMain, vid, vsec) {
    const VRH_CLIENT_ID = vid;
    const VRH_CLIENT_SECRET = vsec;
    const FIXEDREDIRECT = "urn:ietf:wg:oauth:2.0:oob";

    /**
     * 
     * @param {Request} req 
     */
    const collectHubHeaders = (req) => {
        var ret = {};
        if ("x-api-version" in req.headers) {
            ret["X-Api-Version"] = req.headers["x-api-version"];
        }
        if ("X-Api-Version" in req.headers) {
            ret["X-Api-Version"] = req.headers["X-Api-Version"];
        }
        if ("authorization" in req.headers) {
            ret["Authorization"] = req.headers["authorization"];
        }
        if ("Authorization" in req.headers) {
            ret["Authorization"] = req.headers["Authorization"];
        }
        return ret;
    }

    ipcMain.handle("/vroidhub/authorize", async (event, param) => {
        var url = `https://hub.vroid.com/oauth/authorize`;
        var urlprm = `response_type=code&client_id=${VRH_CLIENT_ID}&redirect_uri=${FIXEDREDIRECT}&scope=default`;
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
            client_id : VRH_CLIENT_ID,
            client_secret : VRH_CLIENT_SECRET,
            redirect_uri : FIXEDREDIRECT,
            grant_type : grant_type,
            code : param.code,
        };
        if (grant_type == "refresh_token") {
            urlprm[`refresh_token`] = reftoken;
        }
        var finalurl = url; //`${url}?${urlprm.join("&")}`;
        //console.log(finalurl);
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
        
        //console.log(result);
        if (result.ok) {
            const js = await result.json();
            res = {cd:0, msg: "", appid: VRH_CLIENT_ID, data: js};
        }else{
            res = {cd: 9, msg: result.status + ":" + result.statusText, appid:"", data:null};
        }
        return res;
        
    });
    ipcMain.handle("/vroidhub/account", async (event, param) => {
        var res = {
        }
        var uparams = new URLSearchParams();
        //console.log("reqheader=", param.headers);
        var headers = collectHubHeaders(param);
        headers["Content-Type"] = "application/json";
    
        //console.log(finalurl);
        //console.log("paramheader=",headers);
        var url = `https://hub.vroid.com/api/account`;
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        var result = await fetch(finalurl,{
            method:"GET",
            headers: headers,
        });
        if (result.ok) {
            ret = await result.json();
            res = {cd:0, msg:"", 
                data:ret
            };
        }else{
            res = {cd:result.status, msg:result.statusText, data:null};
        }
        return res;
    });
    ipcMain.handle("/vroidhub/account/character_models", async (event, req) => {
        var res = {
        }
        var uparams = new URLSearchParams();
        if ("max_id" in req.query) {
            uparams.append("max_id",req.query.max_id);
        }
        if ("count" in req.query) {
            uparams.append("count",req.query.count);
        }
        if ("publication" in req.query) {
            uparams.append("publication",req.query.publication);
        }
        //console.log("reqheader=", req.headers);
        var headers = collectHubHeaders(req);
        headers["Content-Type"] = "application/json";
    
        //console.log("paramheader=",headers);
        var url = `https://hub.vroid.com/api/account/character_models`;
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        //console.log(finalurl);
        var result = await fetch(finalurl,{
            method:"GET",
            headers: headers,
        });
        if (result.ok) {
            ret = await result.json();
            res = {cd:0, msg:"", 
                data:ret
            };
        }else{
            
            res = {cd:result.status, msg:result.statusText, data:null};
        }
        return res;
    });
    ipcMain.handle("/vroidhub/hearts", async (event, req) => {
        var res = {
        }
        var uparams = new URLSearchParams();
        uparams.append("application_id",process.env.VRH_CLIENT_ID);
    
        if ("max_id" in req.query) {
            uparams.append("max_id",req.query.max_id);
        }
        if ("count" in req.query) {
            uparams.append("count",req.query.count);
        }
        if ("publication" in req.query) {
            uparams.append("publication",req.query.publication);
        }
        if ("is_downloadable" in req.query) {
            uparams.append("is_downloadable",req.query.is_downloadable);
        }
        if ("characterization_allowed_user" in req.query) {
            uparams.append("characterization_allowed_user",req.query.characterization_allowed_user);
        }
        if ("violent_expression" in req.query) {
            uparams.append("violent_expression",req.query.violent_expression);
        }
        if ("sexual_expression" in req.query) {
            uparams.append("sexual_expression",req.query.sexual_expression);
        }
        if ("corporate_commercial_use" in req.query) {
            uparams.append("corporate_commercial_use",req.query.corporate_commercial_use);
        }
        if ("personal_commercial_use" in req.query) {
            uparams.append("personal_commercial_use",req.query.personal_commercial_use);
        }
        if ("political_or_religious_usage" in req.query) {
            uparams.append("political_or_religious_usage",req.query.political_or_religious_usage);
        }
        if ("antisocial_or_hate_usage" in req.query) {
            uparams.append("antisocial_or_hate_usage",req.query.antisocial_or_hate_usage);
        }
        if ("modification" in req.query) {
            uparams.append("modification",req.query.modification);
        }
        if ("redistribution" in req.query) {
            uparams.append("redistribution",req.query.redistribution);
        }
        if ("credit" in req.query) {
            uparams.append("credit",req.query.credit);
        }
        if ("has_booth_items" in req.query) {
            uparams.append("has_booth_items",req.query.has_booth_items);
        }
        //console.log("reqheader=", req.headers);
        var headers = collectHubHeaders(req);
        headers["Content-Type"] = "application/json";
    
        //console.log(finalurl);
        //console.log("paramheader=",headers);
        var url = `https://hub.vroid.com/api/hearts`;
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        var result = await fetch(finalurl,{
            method:"GET",
            headers: headers,
        });
        if (result.ok) {
            var ret = await result.json();
            res = {cd:0, msg:"", 
                data:ret
            };
        }else{
            
            res = {cd:result.status, msg:result.statusText, data:null};
        }
        return res;
    });
    ipcMain.handle("/vroidhub/staff_picks", async (event, req) => {
        var res = {
        }
        var uparams = new URLSearchParams();
        if ("max_id" in req.query) {
            uparams.append("max_id",req.query.max_id);
        }
        if ("count" in req.query) {
            uparams.append("count",req.query.count);
        }
        //console.log("reqheader=", req.headers);
        var headers = collectHubHeaders(req);
        headers["Content-Type"] = "application/json";
    
        //console.log(finalurl);
        //console.log("paramheader=",headers);
        var url = `https://hub.vroid.com/api/staff_picks`;
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        var result = await fetch(finalurl,{
            method:"GET",
            headers: headers,
        });
        if (result.ok) {
            var ret = await result.json();
            res = {cd:0, msg:"", 
                data:ret
            };
        }else{
            
            res = {cd:result.status, msg:result.statusText, data:null};
        }
        return res;
    });
    ipcMain.handle("/vroidhub/character_models", async (event, req) => {
        var res = {
        }
        var uparams = new URLSearchParams();
        //console.log("reqheader=", req.headers);
        var headers = collectHubHeaders(req);
        headers["Content-Type"] = "application/json";
    
        //console.log(finalurl);
        //console.log("paramheader=",headers);
        var url = `https://hub.vroid.com/api/character_models/${req.params.id}`;
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        var result = await fetch(finalurl,{
            method:"GET",
            headers: headers,
        });
        if (result.ok) {
            var ret = await result.json();
            res = {cd:0, msg:"", 
                data:ret
            };
        }else{
            res = {cd:result.status, msg:result.statusText, data:null};
        }
        return res;
    });
    ipcMain.handle("/vroidhub/download_licenses/publish", async (event, req) => {
        var res = {
        }
        var uparams = new URLSearchParams();
        
        var headers = collectHubHeaders(req);
        headers["Content-Type"] = "application/json";
    
        var url = `https://hub.vroid.com/api/download_licenses`;
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        var result = await fetch(finalurl,{
            method:"POST",
            headers: headers,
            body: JSON.stringify({
                character_model_id: req.query.character_model_id
            })
        });
        if (result.ok) {
            var ret = await result.json();
            console.log("ret=",JSON.stringify(ret));
            res = {cd:0, msg:"", 
                data:ret
            };
        }else{
            
            res = {cd:result.status, msg:result.statusText, data:null};
        }
        return res;
    });
    ipcMain.handle("/vroidhub/download_licenses", async (event, req) => {
        var res = {
        }
        var uparams = new URLSearchParams();
        if ("id" in req.query) {
            uparams.append("id",req.query.id);
        }
        var headers = collectHubHeaders(req);
        headers["Content-Type"] = "application/json";
    
        var url = `https://hub.vroid.com/api/download_licenses`;
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        var result = await fetch(finalurl,{
            method:"GET",
            headers: headers,
            
        });
        if (result.ok) {
            var ret = await result.json();
            res = {cd:0, msg:"", 
                data:ret
            };
        }else{
            res = {cd:result.status, msg:result.statusText, data:null};
        }
        return res;
    });
    ipcMain.handle("/vroidhub/download_licenses/delete", async (event, req) => {
        var res = {
        }
        var uparams = new URLSearchParams();
        if ("id" in req.query) {
            uparams.append("id",req.query.id);
        }
        //console.log("reqheader=", req.headers);
        var headers = collectHubHeaders(req);
        headers["Content-Type"] = "application/json";
    
        //console.log(finalurl);
        //console.log("paramheader=",headers);
        var url = `https://hub.vroid.com/api/download_licenses`;
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        var result = await fetch(finalurl,{
            method:"DELETE",
            headers: headers,
            
        });
        if (result.ok) {
            var ret = await result.json();
            res = {cd:0, msg:"", 
                data:ret
            };
        }else{
            res = {cd:result.status, msg:result.statusText, data:null};
        }
    });
    ipcMain.handle("/vroidhub/download_licenses/download", async (event, req) => {
        var res = {
        }
        var uparams = new URLSearchParams();
        
        //console.log("reqheader=", req.headers);
        var headers = collectHubHeaders(req);
        //headers["Content-Type"] = "application/json";
        headers["Accept-Encoding"] = "gzip";
    
        //console.log(finalurl);
        //console.log("paramheader=",headers);
        //console.log("req.params.id=",req.params.id);
        var url = `https://hub.vroid.com/api/download_licenses/${req.params.id}/download`;
        var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
        var result = await fetch(finalurl,{
            method:"GET",
            headers: headers,
            redirect: "manual",
        });
        if (result.ok) {
            //ret = await result.json();
            res = {cd:0, msg:"", 
                location: result.headers.get("location")
            };
        }else{
            //console.log("error=",result.status, result.statusText);
            //console.log("url=",result.headers.get("location"));
            if (result.status == 302) {
                res.statusCode = 200;
                res.statusMessage = "";
                res = {cd:0, msg:"", 
                    location: result.headers.get("location")
                };
            }else{
                
                res = {cd:result.status, msg:result.statusText, data:null};
            }
            
        }
        return res;
    });
}
