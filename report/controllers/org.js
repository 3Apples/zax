var moment       = require('moment');
var m_install    = require('m-install-path');
var UserClass    = require(`${m_install}/apps/common/lib/user/class`);
var org_api      = require(`${m_install}/apps/common/lib/org/api`);
var log          = require('vc-admin/common/log').child ({ module : 'controllers/org'});

controller = {};

controller.list_page = async function (req, res, next) {
	var user    = req.user;

	try {
		res.render ('genetelella/org/list', {
			user    : new UserClass (user),
		});
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'org list page render error');

		res.render ('error', {
			message : 'org list page render failed' + JSON.stringify (err)
		});
	}
};

controller.list = async function (req, res, next) {
	var user = req.user;

	try {
		var User   = new UserClass (user);
		var scope  = User.scopeView ('org');
		var result = await org_api.list (scope);

		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'org list retrieval error');

		res.status(500).send (`error : ${err.message}`);
	}
};

controller.details = async function (req, res, next) {
	var id   = req.params.id;
	var user = req.user;

	if (!id)
		id = user.detail.orgId;

	log.debug ('looking for id = ', id)
	try {
		var result = await org_api.get (id);
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'org get error');

		res.status(500).send (`error : ${err.message}`);
	}
};

controller.add = async function (req, res, next) {
	var user     = req.user;
	var org      = req.body;

	try {
		org.createdBy = `${user.id}:${user.auth_via}`;

		var result = await org_api.add (org);
		res.send (result);
	}
	catch (err) {
		res.status(500).send(`error : ${err.message}`);
	}
};

module.exports = controller;
