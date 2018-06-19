var express    = require('express');
var path       = require('path');
var log        = require('vc-admin/common/log').child ({ module : 'routes/roles'});
var passport   = require('vc-admin/common/passport');
var roles      = require('vc-admin/controllers/roles');
var router     = express.Router();

/* 
 * We need the session configuration for auth (to send the auth->via options,
 * so we pre-load the session config here */
router.use    ('/',                        passport.ensure_authenticated);
router.get    ('/',        		           roles.list_page);
router.get    ('/list',                    roles.list);
router.get    ('/detail/:role_id',         roles.get_role);
router.get    ('/detail/page/:role_id',    roles.list_page);
router.post   ('/add',                     roles.add);
router.get    ('/add/page',                roles.list_page);
router.post   ('/edit/:role_id',           roles.edit);
router.get    ('/edit/page/:role_id',      roles.list_page);

module.exports = router;

