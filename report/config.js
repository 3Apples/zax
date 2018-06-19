var fs  		= require('fs');
var os  		= require('os');
var log 		= require('./common/log').child({ module : 'config' });
var args 		= require('./common/args');

var config 		= {};

config.port = '2178';
config.do_auth = true;
config.job_server = {};
config.job_server.url = 'http://localhost:4000';
config.pub = '/pub';
config.pdf_server = 'http://localhost:3000';
config.cookie = {};
config.cookie.session_ttl = 24*60*60*1000; /* a day */

config.host = args.get('listen-addr');
if (!config.host)
	config.host = 'localhost';

config.site_addr = 'https://' + site_addr ();

log.info ({ boot_time : (new Date()).toISOString(), config : config }, 'App booting');

function site_addr () {
	var sys_host_name = os.hostname ();

	switch (sys_host_name) {

		case 'production-1':
			return 'app.useimpact.com';

		case 'jas01.3apples.co':
			return 'jas01.3apples.co';

		default :
			if (process.env.NODE_ENV === 'production') {
				log.error ({ sys_host_name : sys_host_name}, 'fatal error : system not configured correctly for the host');
				process.exit (-1);
			}
			log.warn ({ sys_host_name : sys_host_name }, 'site_addr');
			return sys_host_name;
	}
}

/*
 * Google recaptcha keys */

config.recaptcha = {
	data_sitekey : "6Ldn4yETAAAAAEmoAdYm0KXlyH22fHx9294H2Kyu",
	secret       : "6Ldn4yETAAAAAAbKkSlWq-Fl2Pll1RlX8r7O33aw"
};

module.exports = config;
