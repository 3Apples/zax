var express    = require('express');
var path       = require('path');
var url        = require('url');
var log        = require('vc-admin/common/log');
var passport   = require('vc-admin/common/passport');
var controller = require('vc-admin/controllers/home');
var router     = express.Router();

/* 
 * We need the session configuration for auth (to send the auth->via options,
 * so we pre-load the session config here */
router.use ('/', passport.ensure_authenticated);
router.get ('/', controller.home);

module.exports = router;

