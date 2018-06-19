var { URL, URLSearchParams } = require('url');
var UUID           = require('uuid/v4');
var passport       = require('passport');
var OAuth2Strategy = require('passport-oauth2');
var jwt_decode     = require('common/jwt-decode');
var m_install_top  = require('m-install-path');
var store          = require(`${m_install_top}/common/store`);
var network_info   = require(`${m_install_top}/apps/common/network-info`);
var log            = require('vc-admin/common/log').child ({ module : 'passport-wrap'});

var wrapper = {};
var name = store.get('name');
var auth_cid, auth_sec, my_ep, auth_ep;

try {
	auth_cid     = store.get (`config/app/${name}/auth/client_id`);

	if (!auth_cid)
		throw new Error (`undefined configuration "config/app/${name}/auth/client_id"`);

	auth_sec     = store.get (`config/app/${name}/auth/client_secret`);

	if (!auth_sec)
		throw new Error (`undefined configuration "config/app/${name}/auth/client_secret"`);

	my_ep        = network_info.network_ep ('app', name);
	auth_ep      = network_info.auth_network_ep ();

	log.trace ({ 
		auth_cid : auth_cid, 
		auth_sec : auth_sec,
		my_ep    : my_ep,
		auth_ep  : auth_ep,
	}, 'auth credentials');
}
catch (err) {
	log.fatal ({ err : err, stack : err.stack }, 'necessary configuration not found. aborting.');
	process.exit (1);
}

passport.use('oauth2', new OAuth2Strategy({
    clientID         : auth_cid,
    clientSecret     : auth_sec,
    callbackURL      : `${my_ep}/auth/callback`,
    authorizationURL : `${auth_ep}/login`,
    tokenURL         : `${auth_ep}/token/oauth2`,
},
    function (accessToken, refreshToken, params, profile, done) {
        if (accessToken) {
            return done (null, accessToken);
        }
    }
));

passport.serializeUser(function (user, done) {
    done (null, user);
});

passport.deserializeUser(function (token, done) {
    jwt_decode.verify_signature (token, {}, function (err, decoded) {
        if (err) {
            log.error ({ err }, 'error de-serializing user');
            return done (err, null);
        }

		/*
		 * The auth GW returns the 'id' field in the 'sub' property.
		 * Change this so that the rest of the stuff works properly.
		 */
		var __i = decoded.sub.split (':');
		decoded.id       = __i[0];
		decoded.auth_via = __i[1];

        done(null, decoded);
    });
});

passport.ensure_authenticated = function (req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

	if (req.xhr) {
		return res.status (401).send ('session expired, needs refresh');
	}

	/*
	 * Remember where to return to.
	 */
	req.session.return_to = req.originalUrl;;

	var redirect_url = '/vc-admin/auth/login';

    res.redirect (redirect_url);
}

function add_redirect_key (originalUrl, uuid) {

	if (!originalUrl)
		throw new Error ('null originalUrl');

	var __url = new URL (originalUrl);
	__url.searchParams.append ('rdk', uuid);

	return __url.toString ();
}

module.exports = passport;;
