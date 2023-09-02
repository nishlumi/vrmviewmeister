var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var jsenv = "";
  
  if (process.env.NODE_ENV == "production") {
    jsenv = "prod.";
  }
  var opt = { title: 'VRMViewMeister', jsenv : jsenv };
  res.render('toppage',opt );
});

router.get('/redirect', function(req, res, next) {
  var jsenv = "";
  
  if (process.env.NODE_ENV == "production") {
    jsenv = "prod.";
  }
  var opt = { title: 'VRMViewMeister'};
  res.render('redirect',opt );
});

module.exports = router;
