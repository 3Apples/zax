var jwt  = require('jsonwebtoken');
var fs   = require('fs');
var log  = require('./log').sub_module ('jwt');

var __pub_cert_file  = __dirname + '/../certs/auth-gw-public-cert.pem';
var public_key       = fs.readFileSync (__pub_cert_file);

var jsonwebtoken = {};

jsonwebtoken.verify_signature = function (token, options, cb) {

	if (!token || !cb) {
		return cb ('insufficient arguments', null);
	}

	if (!options)
		options = {};

	options.algorithms = [ 'RS256' ];
	options.issuer     = 'heimdallr.auth.com';

	jwt.verify (token, public_key,  options, function (err, decoded) {
		if (err) {
			return cb (err, null);
		}

		return cb (err, decoded);
	});
};

module.exports = jsonwebtoken;
