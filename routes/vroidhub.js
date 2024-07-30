var express = require('express');
var router = express.Router();
require('dotenv').config()

/**
 * 
 * @param {Request} req 
 */
const collectHubHeaders = (req) => {
    var ret = {};
    if ("x-api-version" in req.headers) {
        ret["X-Api-Version"] = req.headers["x-api-version"];
    }
    if ("authorization" in req.headers) {
        ret["Authorization"] = req.headers["authorization"];
    }
    return ret;
}

router.get("/authorize", async function (req, res) {
    var url = `https://hub.vroid.com/oauth/authorize`;
    var urlprm = `response_type=code&client_id=${process.env.VRH_CLIENT_ID}&redirect_uri=${req.query.redirect_uri}&scope=default`;
    var finalurl = `${url}?${urlprm}`;
    //console.log(finalurl);
    res.send({url:finalurl, cd:0});
    /*
    const result = await fetch(finalurl,{
        method: "GET",
        headers: {
            "X-Api-Version" : 11
        }
    });
    if (result.ok) {
        var restext = await result.text();
        res.send({url:restext, cd:0});
    }else{
        console.log(result.statusText);
        res.send({url:"", cd:9});
    }*/
});
/**
 * generate token url for OAuth.
 */
router.post("/request-token",async function(req,res){
    var url = `https://hub.vroid.com/oauth/token`;
    var grant_type = req.query.grant_type;
    var reftoken = "";
    if (req.query.refresh_token) {
        reftoken = req.query.refresh_token;
    }
    
    var urlprm = {
        client_id : process.env.VRH_CLIENT_ID,
        client_secret : process.env.VRH_CLIENT_SECRET,
        redirect_uri : req.query.redirect_uri,
        grant_type : grant_type,
        code : req.query.code,
    };
    if (grant_type == "refresh_token") {
        urlprm[`refresh_token`] = reftoken;
    }
    //console.log("urlprm",urlprm);
    var finalurl = url; //`${url}?${urlprm.join("&")}`;
    //console.log(finalurl);
    //res.send({url: url, prm: urlprm, appid: process.env.VRH_CLIENT_ID, cd:0});
    
    fetch(finalurl,{
        method: "POST",
        headers: {
            "X-Api-Version" : 11,
            "Content-Type" : "application/json"
        },
        mode: "no-cors",
        body : JSON.stringify(urlprm)
    })
    .then(result => {
        //console.log(result);
        if (result.ok) {
            result.json()
            .then(js => {
                res.send({cd:0, msg: "", appid: process.env.VRH_CLIENT_ID, data: js});
            });
        }else{
            res.send({cd: 9, msg: result.status + ":" + result.statusText, appid:"", data:null});
        }
    });
    
});
router.get("/account",async function(req,res){
    var ret = {
    }
    var uparams = new URLSearchParams();
    //console.log("reqheader=", req.headers);
    var headers = collectHubHeaders(req);
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
        res.send({cd:0, msg:"", 
            data:ret
        });
    }else{
        res.statusCode = result.status;
        res.statusMessage = result.statusText;
        res.send({cd:result.status, msg:result.statusText, data:null})
    }
});
router.get("/account/character_models",async function(req,res){
    
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

    //console.log(finalurl);
    //console.log("paramheader=",headers);
    var url = `https://hub.vroid.com/api/account/character_models`;
    var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
    var result = await fetch(finalurl,{
        method:"GET",
        headers: headers,
    });
    if (result.ok) {
        var ret = await result.json();
        res.send({cd:0, msg:"", 
            data:ret
        });
    }else{
        res.statusCode = result.status;
        res.statusMessage = result.statusText;
        res.send({cd:result.status, msg:result.statusText, data:null})
    }
});
router.get("/hearts",async function(req,res){
    
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
        res.send({cd:0, msg:"", 
            data:ret
        });
    }else{
        res.statusCode = result.status;
        res.statusMessage = result.statusText;
        res.send({cd:result.status, msg:result.statusText, data:null})
    }
});
router.get("/staff_picks",async function(req,res){
    
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
        res.send({cd:0, msg:"", 
            data:ret
        });
    }else{
        res.statusCode = result.status;
        res.statusMessage = result.statusText;
        res.send({cd:result.status, msg:result.statusText, data:null})
    }
});
router.get("/character_models/:id",async function(req,res){
    
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
        res.send({cd:0, msg:"", 
            data:ret
        });
    }else{
        res.statusCode = result.status;
        res.statusMessage = result.statusText;
        res.send({cd:result.status, msg:result.statusText, data:null})
    }
});


//================================================================
router.get("/download_licenses/publish",async function(req,res){
    
    var uparams = new URLSearchParams();
    
    //console.log("reqheader=", req.headers);
    var headers = collectHubHeaders(req);
    headers["Content-Type"] = "application/json";

    //console.log(finalurl);
    //console.log("paramheader=",headers);
    //console.log("req.query=",req.query.character_model_id);
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
        //console.log("ret=",JSON.stringify(ret));
        res.send({cd:0, msg:"", 
            data:ret
        });
    }else{
        //console.log("error=",result.status, result.statusText);
        res.statusCode = result.status;
        res.statusMessage = result.statusText;
        res.send({cd:result.status, msg:result.statusText, data:null})
    }
});
router.get("/download_licenses",async function(req,res){
    
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
        method:"GET",
        headers: headers,
        
    });
    if (result.ok) {
        var ret = await result.json();
        res.send({cd:0, msg:"", 
            data:ret
        });
    }else{
        res.statusCode = result.status;
        res.statusMessage = result.statusText;
        res.send({cd:result.status, msg:result.statusText, data:null})
    }
});
router.get("/download_licenses/delete",async function(req,res){
    
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
        res.send({cd:0, msg:"", 
            data:ret
        });
    }else{
        res.statusCode = result.status;
        res.statusMessage = result.statusText;
        res.send({cd:result.status, msg:result.statusText, data:null})
    }
});
router.get("/download_licenses/:id/download",async function(req,res){
    
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
        res.send({cd:0, msg:"", 
            location: result.headers.get("location")
        });
    }else{
        //console.log("error=",result.status, result.statusText);
        //console.log("url=",result.headers.get("location"));
        if (result.status == 302) {
            res.statusCode = 200;
            res.statusMessage = "";
            res.send({cd:0, msg:"", 
                location: result.headers.get("location")
            });
        }else{
            res.statusCode = result.status;
            res.statusMessage = result.statusText;
            res.send({cd:result.status, msg:result.statusText, data:null})
        }
        
    }
});

module.exports = router;
