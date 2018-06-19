/*
 * Get all the needed network endpoints or die
 */
var m_install_top  = require('m-install-path');
var store          = require(`${m_install_top}/common/store`);
var network_info   = require(`${m_install_top}/apps/common/network-info`);
var log            = require('prov/app/common/log').child({ module: 'lib/network-eps' });

var name = store.get('name');
var vc_ep, landing_ep, backend_ep, prov_ep;
var eps = {};


/*--------------------------------------------------------
 *
 * Get the app endpoint
 *
 *-------------------------------------------------------*/

try { vc_ep = network_info.network_ep ('app', name); }
catch (err) {
    log.fatal ({ err : err, stack : err.stack }, 'main application network ep not configured. aborting.');
    process.exit (1);
}


/*--------------------------------------------------------
 *
 * Get the landing specific endpoint, if it exits
 *
 *-------------------------------------------------------*/

try { landing_ep = network_info.network_ep ('app', `${name}/landing`); }
catch (err) {
    log.info ('landing ep not configured. will fallback on main application ep');
}


/*--------------------------------------------------------
 *
 * Get the backend specific endpoint, if it exits
 *
 *-------------------------------------------------------*/

try { backend_ep = network_info.network_ep ('app', `${name}/backend`); }
catch (err) {
    log.info ('backend ep not configured. will fallback on main application ep');
}


/*--------------------------------------------------------
 *
 * Get the provisioning specific endpoint, if it exits
 *
 *-------------------------------------------------------*/

try { prov_ep = network_info.network_ep ('app', `${name}/prov`); }
catch (err) {
    log.info ('provisioning ep not configured. will fallback on main application ep');
}

eps.app     = function () { return vc_ep; };
eps.landing = function () { return landing_ep || vc_ep; };
eps.backend = function () { return backend_ep || vc_ep; };
eps.prov    = function () { return prov_ep    || vc_ep; };

module.exports = eps;
