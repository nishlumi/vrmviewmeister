var express = require('express');
var router = express.Router();

const appgas = "https://script.google.com/macros/s/AKfycbygqD5g0BGFy-d1A6Xf0y5e9uXGZvr4HlDVMsGQSQ3IwDa1m-HsT1icTWXnPrsau5XXmg/exec";
const appapikey = "fFk3r430awp";

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get("/enumsample",function(req, res, next){
    var uparams = new URLSearchParams();
    if ("enumtype" in req.query) {
        uparams.append("enumtype",req.query.enumtype);
    }
    var finalurl = uparams.size > 0 ? `${appgas}?${uparams.toString()}` : appgas;
    fetch(finalurl,{
        method:"GET",
    })
    .then(result => {
        if (result.ok) {
            result.json(js => {
                res.send(js);
            });
        }
    });
});

module.exports = router;
