var moment             = require('moment');
var url                = require('url');
var m_install_top      = require('m-install-path');
var safeJsonStringify  = require('safe-json-stringify');
var UserClass          = require(`${m_install_top}/apps/common/lib/user/class`);
var store              = require(`${m_install_top}/common/store`);
var network_info       = require(`${m_install_top}/apps/common/network-info`);
var rest               = require('common/rest');
var random_id          = require('vc-admin/lib/random-id');
var log                = require('vc-admin/common/log').child ({ module : 'lib/backend'});
var user_api           = require(`${m_install_top}/apps/common/lib/user/api`);
var license_api        = require(`${m_install_top}/apps/common/lib/license/api`);

var controller = {};
var backend_ep;

get_backend_ep ();

controller.create_class = async function (req, res, next) {
	var user = req.user;

	try {
		var backend_ep = backend.ep ();

		res.render ('genetelella/create-class', {
			user    : user,
			backend : backend_ep,
		});
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'class create error');

		res.render ('error', {
			message : 'class creation failed' + JSON.stringify (err)
		});
	}
};

controller.create = async function (req, res, next) {
	var params       = req.body;
	var user         = req.user;

	if (!user)
		return res.status(401).send ('session expired');

	var User         = new UserClass (user);
	var scope        = User.scopeAdd ('presentations');

	if (!scope)
		return res.status(403).send ('forbidden - no scope for class creation');

	var user_detail  = user.detail;
	var org_id       = user_detail.orgId;

	log.debug ({ params }, 'class create params');

	params.meta_info.created_via ={
		via    : "admin site",
		host   : req.headers['x-forwarded-for'] || req.connection.remoteAddress
	};

	params.meta_info.creator = {
		id       : req.user.id,
		auth_via : req.user.auth_via,
	};

	params.class_id = random_id ();
	params.org_id = org_id;

	try {
		var lic       = await license_api.get_active_instance (org_id);
		params.org_id = org_id;
		var response  = await rest.postJson (`${backend_ep}/v1/class/create`, params);

		send_notifications (params, user);

		return res.send (response);
	}
	catch (err) {
		log.error ({ err : err, stack : err.stack }, 'error creating class');
		res.status (err.status_code || 500).send (err.message || safeJsonStringify (err));
	}
};

function send_notifications (_class, user) {
}

controller.class_list = async function (req, res, next) {
	var query = req.query || {};
	var user  = req.user;

	try {
		var User         = new UserClass (user);
		var scope        = User.scopeView ('presentations');

		if (!scope)
			return res.status(403).send ('forbidden');

		query.scope      = JSON.stringify (scope);
		var query_string = new url.URLSearchParams(query || {});

		var response = await rest.get (`${backend_ep}/v1/class/list?${query_string}`);
		return res.send ({ classes : response });
	}
	catch (err) {
		var msg;

		if (typeof err === 'string')
			msg = err;
		else
			msg = err.message || 'internal error';

		log.error ({ err : err, stack : err.stack }, 'error getting live class list');
		res.status (500).send (msg);
	}
};

controller.get_class = async function (req, res, next) {
	var class_id = req.params.class_id;

	try {
		var response = await rest.get (`${backend_ep}/v1/class/${class_id}/config`);
		response.server_ts = moment().toISOString();
		return res.send (response);
	}
	catch (err) {
		var msg;

		if (typeof err === 'string')
			msg = err;
		else
			msg = err.message || 'internal error';

		log.error ({ err : err, stack : err.stack }, 'error getting class details');
		res.status (500).send (msg);
	}
};

controller.class_audit = async function (req, res, next) {
	var class_id = req.params.class_id;

	try {
		var response = await rest.get (`${backend_ep}/admin/audit/class/${class_id}`);
		return res.send (response);
	}
	catch (err) {
		var msg;

		if (typeof err === 'string')
			msg = err;
		else
			msg = err.message || 'internal error';

		log.error ({ err : err, stack : err.stack }, 'error getting live class list');
		res.status (500).send (msg);
	}
};

controller.class_urls = async function (req, res, next) {
	var class_id = req.params.class_id;

	try {
		var response = await rest.get (`${backend_ep}/v1/class/urls/${class_id}`);
		return res.send (response);
	}
	catch (err) {
		var msg;

		if (typeof err === 'string')
			msg = err;
		else
			msg = err.message || 'internal error';

		log.error ({ err : err, stack : err.stack }, 'error getting class url');
		res.status (500).send (msg);
	}
};

controller.remove_class = async function (req, res, next) {
	var class_id = req.params.class_id;

	var user = {
		id       : req.user.id,
		auth_via : req.user.auth_via,
	};

	try {
		var response = await rest.postJson (`${backend_ep}/v1/class/remove/${class_id}`, user);
		return res.send (response);
	}
	catch (err) {
		var msg;

		if (typeof err === 'string')
			msg = err;
		else
			msg = err.message || 'internal error';

		log.error ({ err : err, stack : err.stack }, 'error getting live class list');
		res.status (500).send (msg);
	}
};

controller.ep = function () {
	return backend_ep;
};

function get_backend_ep () {
	/*
	 * Try to get the backendisioning server address or fail
	 */
	try {
		backend_ep = network_info.network_ep ('app', `vc/backend`);
	}
	catch (err) { }
	/*
	 *  If a backend specific endpoint is not defined, then default to the
	 *  application endpoint
	 */
	if (!backend_ep) {
		try {
			backend_ep = network_info.network_ep ('app', `vc`);
			backend_ep += '/backend/';
		}
		catch (err) {
			log.fatal ({ err }, 'unable to determine backend endpoint. aborting.')
			process.exit (1);
		}
	}
}

module.exports = controller;
