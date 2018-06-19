var moment    = require('moment');
var m_install = require('m-install-path');
var UserClass = require(`${m_install}/apps/common/lib/user/class`);
var user_api  = require(`${m_install}/apps/common/lib/user/api`);
var log       = require('vc-admin/common/log').child ({ module : 'controllers/roles'});

controller = {};

controller.list_page = async function (req, res, next) {
	var user = req.user;

	try {
		res.render ('genetelella/roles/list', {
			user    : new UserClass (user),
		});
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'roles list page render error');

		res.render ('error', {
			message : 'roles list page render failed' + JSON.stringify (err)
		});
	}
};

controller.list = async function (req, res, next) {
	var user = req.user;

	try {
		var User   = new UserClass (user);
		var scope  = User.scopeView ('roles');
		/*
		 * Give unlimited scope to 3A Admins */
		if (User.permFlags.admin3a && !scope) scope = { _id : '*'};
		
		var result = await user_api.get_all_roles (scope);
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'roles list retrieval error');

		res.status(500).send (`error : ${err.message}`);
	}
};

controller.get_role = async function (req, res, next) {
	var user     = req.user;
	var roles_id = req.params.role_id;

	try {
		var result = await user_api.get_role_profile (roles_id);
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'roles detail get error');

		res.status(500).send (`error : ${err.message}`);
	}
};

controller.add = async function (req, res, next) {
	var user      = req.user;
	var role_info = req.body;

	try {
		if (!role_info)
			throw 'no role info';

		role_info.createdBy = user.id + ':' + user.auth_via;

		var result = await user_api.add_role (role_info);
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'roles add error');
		res.status(500).send(`error : ${err.message}`);
	}
};

controller.edit = async function (req, res, next) {
	var role_id   = req.params.role_id;
	var role_info = req.body;
	var user      = req.user;

	try {
		if (!role_info)
			throw 'no role info';

		role_info.modifiedBy = user.id + ':' + user.auth_via;

		var result = await user_api.edit_role (role_id, role_info);
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'roles add error');
		res.status(500).send(`error : ${err.message}`);
	}
};

module.exports = controller;
