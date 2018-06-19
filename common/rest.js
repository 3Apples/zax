var restler        = require ('restler');
var m_install_top  = require('m-install-path');
var Error_3A       = require(`${m_install_top}/common/3a-error`);

var rest = {};

rest.get = (url, options) => {
	return new Promise ((resolve, reject) => {
		var r = restler.get (url, options);

		r.on ('success', function (data, response) {
			return resolve (data);
		});

		r.on ('fail', function (data, response) {
			var status_code = response.statusCode || 500;
			var message     = data.message || data || response.statusMessage;
			var key         = data.name || 'ERR_WTF';

			var e = new Error_3A (key, status_code, message);
			reject (e);
		});

		r.on ('error', function (err, response) {
			var code = err.code || 'ERR_UNKNOWN';

			var e = new Error_3A (code, 500, `error for ${url}: ${code}`);
			reject (e);
		});

		r.on ('timeout', function (ms) {
			var e = new Error_3A ('ERR_TIMEOUT', 500, `timeout for ${url}`);
			reject (e);
		});
	});
};

rest.putJson = (url, data, options) => {
	return new Promise ((resolve, reject) => {
		var r = restler.putJson (url, data, options);

		r.on ('success', function (data, response) {
			return resolve (data);
		});

		r.on ('fail', function (data, response) {
			var status_code = response.statusCode || 500;
			var message     = data.message || data || response.statusMessage;
			var key         = data.name || 'ERR_WTF';

			var e = new Error_3A (key, status_code, message);
			reject (e);
		});

		r.on ('error', function (err, response) {
			var code = err.code || 'ERR_UNKNOWN';

			var e = new Error_3A (code, 500, `error for ${url}: ${code}`);
			reject (e);
		});

		r.on ('timeout', function (ms) {
			var e = new Error_3A ('ERR_TIMEOUT', 500, `timeout for ${url}`);
			reject (e);
		});
	});
};

rest.postJson = (url, data, options) => {
	return new Promise ((resolve, reject) => {
		var r = restler.postJson (url, data, options);

		r.on ('success', function (data, response) {
			return resolve (data);
		});

		r.on ('fail', function (data, response) {

			var status_code = response.statusCode || 500;
			var message     = data.message || data || response.statusMessage;
			var key         = data.name || 'ERR_WTF';

			var e = new Error_3A (key, status_code, message);
			reject (e);
		});

		r.on ('error', function (err, response) {
			var code = err.code || 'ERR_UNKNOWN';

			var e = new Error_3A (code, 500, `error for ${url}: ${code}`);
			reject (e);
		});

		r.on ('timeout', function (ms) {
			var e = new Error_3A ('ERR_TIMEOUT', 500, `timeout for ${url}`);
			reject (e);
		});
	});
};

rest.del = (url, options) => {
	return new Promise ((resolve, reject) => {
		var r = restler.del (url, options);

		r.on ('success', function (data, response) {
			return resolve (data);
		});

		r.on ('fail', function (data, response) {
			var status_code = response.statusCode || 500;
			var message     = data.message || data || response.statusMessage;
			var key         = data.name || 'ERR_WTF';

			var e = new Error_3A (key, status_code, message);
			reject (e);
		});

		r.on ('error', function (err, response) {
			var code = err.code || 'ERR_UNKNOWN';

			var e = new Error_3A (code, 500, `error for ${url}: ${code}`);
			reject (e);
		});

		r.on ('timeout', function (ms) {
			var e = new Error_3A ('ERR_TIMEOUT', 500, `timeout for ${url}`);
			reject (e);
		});
	});
};

module.exports = rest;
