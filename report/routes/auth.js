var express   = require('express');
var log       = require('vc-admin/common/log');
var passport  = require('vc-admin/common/passport');
var router    = express.Router();

router.get('/login', passport.authenticate ('oauth2'));

router.get('/callback', function (req, res, next) {

	passport.authenticate ('oauth2', function (err, user, info) {

		if (err) {
			log.error ({ err }, 'authenticate error on /callback');
			next (err);
		}

		req.logIn (user, function (err) {
			if (err) {
				log.error ({ err:err, user:user }, 'error while logging in user');
				next (err);
			}

			res.redirect (req.session.return_to || '/vc-admin/error');
			delete req.session.return_to;

			return;
		});

	}) (req, res, next);
});

router.get('/logout', passport.ensure_authenticated, function (req, res, next) {
	var sess_config = req.body.sess_config;
	var user = req.user;

	req.logout ();

	var redirect_url = `/vc-admin/`;

	return res.redirect (redirect_url);
});

module.exports = router;
