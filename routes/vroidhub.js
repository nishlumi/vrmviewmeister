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
    console.log(finalurl);
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
    console.log("urlprm",urlprm);
    var finalurl = url; //`${url}?${urlprm.join("&")}`;
    console.log(finalurl);
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
        console.log(result);
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
router.get("/account/character_models",async function(req,res){
    var ret = {
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
    console.log("reqheader=", req.headers);
    var headers = collectHubHeaders(req);
    headers["Content-Type"] = "application/json";

    console.log(finalurl);
    console.log("paramheader=",headers);
    var url = `https://hub.vroid.com/api/account/character_models`;
    var finalurl = uparams.size > 0 ? `${url}?${uparams.toString()}` : url;
    var result = await fetch(finalurl,{
        method:"GET",
        headers: headers,
    });
    if (result.ok) {
        ret = await result.json();
        res.send({cd:0, msg:"", data:ret});
    }else{
        res.statusCode = result.status;
        res.statusMessage = result.statusText;
        res.send({cd:result.status, msg:result.statusText, data:null})
    }
});

module.exports = router;
