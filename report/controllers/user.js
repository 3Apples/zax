var moment    = require('moment');
//var m_install = require('m-install-path');
//var user_api  = require(`${m_install}/apps/common/lib/user/api`);
//var UserClass = require(`${m_install}/apps/common/lib/user/class`);
var log       = require('report/common/log').child ({ module : 'controllers/user'});

controller = {};

controller.list_page = async function (req, res, next) {
	var user = req.user;

	try {
		res.render ('genetelella/user/list', {
			user    : "Test",
			//user    : new UserClass (user),
		});
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'user list page render error');

		res.render ('error', {
			message : 'user list list page render failed' + JSON.stringify (err)
		});
	}
};

module.exports = controller;
