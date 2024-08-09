var debug = require('debug');
const compression = require('compression');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nunjucks = require("nunjucks");
var session = require("express-session");
const { doubleCsrf } = require("csrf-csrf");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var vroidhubRouter = require('./routes/vroidhub');
var samplesvRouter = require('./routes/samplesv');
//var buildRouter = require("./routes/build");
var bodyParser = require('body-parser');

const staticdir = process.env.staticdir || path.join(__dirname, "public");
const CST_CSRF_SECRET = new Date().valueOf().toString();

const {
    invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
    generateToken, // Use this in your routes to provide a CSRF hash cookie and token.
    validateRequest, // Also a convenience if you plan on making your own middleware.
    doubleCsrfProtection, // This is the default CSRF protection middleware.
  } = doubleCsrf({
    getSecret: () => "Secret", // A function that optionally takes the request and returns a secret
    cookieName: "__vrmviewmeister.x-csrf-token", // The name of the cookie to be used, recommend using Host prefix.
    cookieOptions: {
      httpOnly : true,
      sameSite : "lax",  // Recommend you make this strict if posible
      path : "/",
      secure : true,
      // Additional options supported: domain, maxAge, expires
    },
    size: 64, // The size of the generated tokens in bits
    ignoredMethods: ["GET", "HEAD", "OPTIONS"], // A list of request methods that will not be protected.
    getTokenFromRequest: (req) => req.headers["x-csrf-token"], // A function that returns the token from the request
  });


var app = express();
nunjucks.configure(staticdir, {
    autoescape: true,
    express: app,
    watch: true,
    tags : {
        variableStart: "<$",
        variableEnd : "$>"
    }
});

const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
        // Will not compress responses, if this header is present
        return false;
    }
    // Resort to standard compression
    return compression.filter(req, res);
};
app.use(compression({
    filter : shouldCompress,
    threshold: 0,
    level: 9,
    memLevel: 9
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(String(new Date().valueOf())));
app.use(session({
    secret: String(new Date().valueOf()),
    resave: false,
    saveUninitialized : true
}));
app.use(express.static(staticdir));
app.set('views', ".");
app.set('view engine', 'html');
app.enable('view cache');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/vroidhub",vroidhubRouter);
app.use("/samplesv",samplesvRouter);
//app.use('/Build', buildRouter);
/*app.get('.*.js', (req, res, next) => {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	next();
});*/
app.get("/csrf-token",(req, res) => {
    const csrfToken = generateToken(res, req);
    res.json({
        token: csrfToken
    });
});
app.use(doubleCsrfProtection);


//module.exports = app;


const finalport = (process.env.PORT || 3000);
app.set('port', finalport);
console.log(`Node.js + express starting following port: ${finalport} => http://localhost:${finalport}`);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
