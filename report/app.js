require('app-module-path').addPath(__dirname + '/../');

var express         = require('express');
var path            = require('path');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var redis           = require('connect-redis')(session);
//var express_winston = require('express-winston');
//var e_logger        = require('express-bunyan-logger');

var log             = require('common/log');
var args            = require('common/args');
var proxy           = require('common/proxy');
var user            = require('report/routes/user');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var sess = { 
	cookie: { 
		secure: true,
		proxy: true,
	},
	secret: '&^%Gbu45t;#tpxza12^%$',
	saveUninitialized: false,
	resave: true,
	name: 'app.vcad',
	store: new redis ({ ttl: 3600 }),
};

var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

if (process.env.NODE_ENV === 'production')
	app.set('view cache', 'true');

app.set('trust proxy', true);
sess.cookie.secure = true;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sess));
//app.use(passport.initialize());
//app.use(passport.session());
app.use('/vc-admin/edmin', express.static(__dirname + '/public/edmin'));
app.use('/vc-admin/gene', express.static(__dirname + '/public/genetelella'));

/*app.use(e_logger({
	genReqId: function (req) { return req.req_id; },
	format: "HTTP :incoming :status-code :method :url :remote-address :res-headers[cookie]",
	excludes : [ 'req' , 'res', 'req-headers', 'res-headers', 'user-agent',
		'body', 'short-body', 'response-hrtime', 'http-version',
		'incoming', 'remote-address', 'method', 'url', 'status-code', 'ip'
	],
	levelFn : function (status, err, meta) {
		if (meta.url === '/agent/node/v1/health')
			return 'debug';

		if (status >= 400)
			return 'error';
	},
	logger:log
}));
*/
//app.use('/vc-admin/?$',     (req, res, next) => { res.redirect('/vc-admin/dash'); } );
app.use('/',   user);

/*app.use(e_logger.errorLogger({
	showStack : true
}));*/

/*
 * Error handlers
 * --------------------
 * Development error handler - will print stacktrace
 */
app.use(function(__err, req, res, next) {
	if (req.xhr)
		return res.send (__err);

	var message;
	if (__err instanceof Error)
		message = __err.message;
	else
		message = JSON.stringify (__err);

	res.render('error', message);

	return;
});

module.exports = app;
