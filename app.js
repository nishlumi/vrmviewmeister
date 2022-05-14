var debug = require('debug');
const compression = require('compression');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nunjucks = require("nunjucks");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var buildRouter = require("./routes/build");

const staticdir = process.env.staticdir || path.join(__dirname, "public");

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
app.use(cookieParser());
app.use(express.static(staticdir));
app.set('views', ".");
app.set('view engine', 'html');
app.enable('view cache');

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/Build', buildRouter);
/*app.get('.*.js', (req, res, next) => {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	next();
});*/

//module.exports = app;


const finalport = (process.env.PORT || 3000);
app.set('port', finalport);
console.log(`Node.js + express starting following port: ${finalport} => http://localhost:${finalport}`);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
