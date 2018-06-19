var express    = require('express');
var path       = require('path');
var log        = require('vc-admin/common/log').child ({ module : 'routes/org'});
var passport   = require('vc-admin/common/passport');
var org        = require('vc-admin/controllers/org');
var router     = express.Router();

/* 
 * We need the session configuration for auth (to send the auth->via options,
 * so we pre-load the session config here */
router.use    ('/',                  passport.ensure_authenticated);

router.get    ('/',                  org.list_page);
router.get    ('/page/?$',           org.list_page);
router.get    ('/page/detail/?$',    org.list_page);
router.get    ('/page/detail/:id',   org.list_page);
router.get    ('/page/add',          org.list_page);

router.get    ('/list',              org.list);
router.get    ('/detail/?$',         org.details);
router.get    ('/detail/:id',        org.details);
router.post   ('/add',               org.add);

module.exports = router;

