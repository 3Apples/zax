var minimist  = require('minimist');
var log       = require('./log').child({ module : 'arguments' });

var _argv = minimist(process.argv.slice(2));

log.debug ({ args : _argv}, 'command line arguments');
var args = {};

args.get = function (key) {
	return _argv[key];
};

module.exports = args;
