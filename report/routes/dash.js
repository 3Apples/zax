var express    = require('express');
var path       = require('path');
var log        = require('vc-admin/common/log').child ({ module : 'routes/dash'});
var passport   = require('vc-admin/common/passport');
var dash       = require('vc-admin/controllers/dash');
var router     = express.Router();

/* 
 * We need the session configuration for auth (to send the auth->via options,
 * so we pre-load the session config here */

router.use    ('/',        passport.ensure_authenticated);

router.get    ('/',        dash.init_page);

module.exports = router;

