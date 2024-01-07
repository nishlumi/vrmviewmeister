var express = require('express');
var router = express.Router();
var Buffer = require("buffer/").Buffer;

/* GET home page. */
router.get('/', function(req, res, next) {
  var jsenv = "";
  
  if (process.env.NODE_ENV == "production") {
    jsenv = "prod.";
  }
  
  var opt = { 
    hostname: req.hostname,
    title: 'VRMViewMeister', 
    uimode: "pc",
    jsenv : jsenv,
    csrfToken : req.secret
  };
  console.log(opt);
  res.render('toppage',opt );
});
/* GET home page. */
router.get('/mui', function(req, res, next) {
  var jsenv = "";
  
  if (process.env.NODE_ENV == "production") {
    jsenv = "prod.";
  }
  
  var opt = { 
    hostname: req.hostname,
    title: 'VRMViewMeister', 
    uimode: "mobile",
    jsenv : jsenv,
    csrfToken : req.secret
  };
  console.log(opt);
  res.render('mobilepage',opt );
});

router.get('/redirect', function(req, res, next) {
  var jsenv = "";
  
  if (process.env.NODE_ENV == "production") {
    jsenv = "prod.";
  }
  var opt = { title: 'VRMViewMeister'};
  res.render('redirect',opt );
});
router.get("/gdriveget",function(req,res,next){
  var gid = "";
  var uparams = new URLSearchParams();
  if ("id" in req.query) {
    uparams.append("id",req.query.id);
  }
  uparams.append("export","view");
  uparams.append("alt","media");
  var finalurl = "https://drive.google.com/uc?" + uparams.toString();
  console.log(finalurl);
  fetch(finalurl)
  .then(ret => {
    console.log(ret);
    if (ret.ok) {
      ret.arrayBuffer()
      .then(ab => {
        console.log("byte=",ab.byteLength);
        Buffer.alloc(ab.byteLength);
        const bab = Buffer.from(ab);
        const u8arr = new Uint8Array(bab);
        console.log("u8arr=",u8arr.slice(0,100));
        res.send({cd:0,msg:"OK from Google Drive",data:u8arr.slice(0,u8arr.byteLength)});
        //res.send(bab);

      });
    
    }else{
      res.send({cd:-1,msg:"load error",data:null});
    }
  });
  
});


module.exports = router;
