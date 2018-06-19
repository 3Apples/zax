var express    = require('express');
var path       = require('path');
var url        = require('url');
var log        = require('vc-admin/common/log');
var passport   = require('vc-admin/common/passport');
var home       = require('vc-admin/controllers/home');
var backend    = require('vc-admin/lib/backend');
var router     = express.Router();

/* 
 * We need the session configuration for auth (to send the auth->via options,
 * so we pre-load the session config here */
router.use    ('/',                      passport.ensure_authenticated);
router.get    ('/list',                  backend.class_list);
router.get    ('/detail-page/:class_id', home.home);
router.get    ('/details/:class_id',     backend.get_class);
router.get    ('/create-page',           home.home);
router.get    ('/audit/:class_id',       backend.class_audit);
router.get    ('/get-urls/:class_id',    backend.class_urls);
router.post   ('/create',                backend.create);
router.delete ('/:class_id',             backend.remove_class);

module.exports = router;

