var moment       = require('moment');
var m_install    = require('m-install-path');
var UserClass    = require(`${m_install}/apps/common/lib/user/class`);
var license_api  = require(`${m_install}/apps/common/lib/license/api`);
var org_api      = require(`${m_install}/apps/common/lib/org/api`);
var log          = require('vc-admin/common/log').child ({ module : 'controllers/license'});

controller = {};

controller.template_list_page = async function (req, res, next) {
	var user    = req.user;

	try {
		res.render ('genetelella/license/template', {
			user    : new UserClass (user),
		});
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'license instance list page render error');

		res.render ('error', {
			message : 'license list list page render failed' + JSON.stringify (err)
		});
	}
};

controller.instance_list_page = async function (req, res, next) {
	var user    = req.user;

	try {
		res.render ('genetelella/license/instance', {
			user    : new UserClass (user),
		});
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'license instance page render error');

		res.render ('error', {
			message : 'license instance page render failed' + JSON.stringify (err)
		});
	}
};

controller.template_list = async function (req, res, next) {
	var license = req.license;

	try {
		var result = await license_api.list ();
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'license list retrieval error');

		res.status(500).send (`error : ${err.message}`);
	}
};

controller.instance_list = async function (req, res, next) {
	var license = req.license;

	try {
		var template_list  = await license_api.list ();
		var instance_list  = await license_api.list_instances ();

		var template_map = template_list.reduce (function (map, obj) {
		    map[obj._id] = obj.name;
		    return map;
		}, {});
		
		var result = [];

		instance_list.forEach(instance => {
			let template_id = instance.masterId;
			let org_id      = instance.orgId;
			instance.masterName = template_map[template_id];
			result.push (instance);
		});
		
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'license list retrieval error');

		res.status(500).send (`error : ${err.message}`);
	}
};

controller.template_get = async function(req, res, next) {
	var params = req.params;
	var _id = req.params._id;

	try {
		var result = await license_api.get (_id);
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'license template get retrieval error');

		res.status(500).send (`error : ${err.message}`);
	}
};

controller.instance_detail_get = async function(req, res, next) {
	var params = req.params;
	var id = req.params.id;
	var result = {};

	try {
		var instance    = await license_api.get_instance (id);
		result.template = await license_api.get (instance.masterId);
		result.org      = await org_api.get (instance.orgId);
		result.instance = instance;

		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'license instance detail get retrieval error');

		res.status(500).send (`error : ${err.message}`);
	}
};

controller.instance_active = async function(req, res, next) {
	var params = req.params;
	var id = req.params.orgId;

	try {
		var [lic]     = await license_api.get_active_instance (id, { archetype: true });
		var result    = lic;
		result.server_ts = moment().toISOString();

		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'active license get retrieval error');

		res.status(500).send (`error : ${err.message}`);
	}
};

controller.template_add = async function (req, res, next) {
	var user     = req.user;
	var license  = req.body;

	try {
		var data = {
			name            : license.name,
			maxHours        : license.maxHours,
			maxConcurrency  : license.maxConcurrency,
			maxAttendees    : license.maxAttendees,
			licenseDuration : license.licenseDuration,
			createdBy       : `${user.id}:${user.auth_via}`,
		};

		var result = await license_api.add (data);
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'license template add error');

		res.status(500).send(`error : ${err.message}`);
	}
};

controller.instance_add = async function (req, res, next) {
	var user     = req.user;
	var body     = req.body;

	try {
		var data = {
			masterId        : body.template,
			orgId           : body.org,
			createdBy       : `${user.id}:${user.auth_via}`,
		};

		var result = await license_api.add_instance (data);
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'Instance add error');

		res.status(500).send(`error : ${err.message}`);
	}
};

controller.instance_activate = async function (req, res, next) {
	var user     = req.user;
	var body     = req.body;

	try {
		var data = {
			id                : body.id,
			activatedBy       : `${user.id}:${user.auth_via}`,
		};

		var result = await license_api.activate_instance (data);
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'Instance activate error');

		res.status(500).send(`error : ${err.message}`);
	}
};

controller.instance_invalidate = async function (req, res, next) {
	var user     = req.user;
	var body     = req.body;

	try {
		var data = {
			id                : body.id,
			deactivatedBy       : `${user.id}:${user.auth_via}`,
		};

		var result = await license_api.invalidate_instance (data);
		res.send (result);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'Instance invaldiate error');

		res.status(500).send(`error : ${err.message}`);
	}
};

module.exports = controller;
