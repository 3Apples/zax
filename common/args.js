var minimist  = require('minimist');
var log = require('common/log').sub_app('common').child({ "module" : "args" });

var _argv = minimist(process.argv.slice(2));

var args = {};

var all = [ 'backend', 'landing', 'prov', 'agent' ];
args.get = function (key) {
	if (all.indexOf(key) != -1 && _argv.all)
		return true;

	return _argv[key];
};

module.exports = args;
