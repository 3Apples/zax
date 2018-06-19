var moment    = require('moment');
var m_install = require('m-install-path');
var UserClass = require(`${m_install}/apps/common/lib/user/class`);
var log       = require('vc-admin/common/log').child ({ module : 'controllers/dash'});

controller = {};

controller.init_page = async function (req, res, next) {
	var user = req.user;

	try {
		res.render ('genetelella/dashboard/dash', {
			user    : new UserClass (user),
		});
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'dashboard init page error');

		res.render ('error', {
			message : 'dashboard init page  failed' + JSON.stringify (err)
		});
	}
};

module.exports = controller;
