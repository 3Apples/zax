var moment    = require('moment');
var m_install = require('m-install-path');
var UserClass = require(`${m_install}/apps/common/lib/user/class`);
var backend   = require('vc-admin/lib/backend');
var log       = require('vc-admin/common/log').child ({ module : 'controllers/home'});

controller = {};

controller.home = async function (req, res, next) {
	var user = req.user;

	try {
		var backend_ep = backend.ep ();

		res.render ('genetelella/class-list', {
			user    : new UserClass (user),
			backend : backend_ep,
		});
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'live class retrieval error');

		res.render ('error', {
			message : 'live class list fetch failed' + JSON.stringify (err)
		});
	}
};

module.exports = controller;
