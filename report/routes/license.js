var express    = require('express');
var path       = require('path');
var log        = require('vc-admin/common/log').child ({ module : 'routes/license'});
var passport   = require('vc-admin/common/passport');
var license    = require('vc-admin/controllers/license');
var router     = express.Router();

/* 
 * We need the session configuration for auth (to send the auth->via options,
 * so we pre-load the session config here */

router.use    ('/',                          passport.ensure_authenticated);

router.get    ('/template',                  license.template_list_page);
router.get    ('/template/add-page',         license.template_list_page);
router.get    ('/template/detail/page/:id',  license.template_list_page);
router.get    ('/template/list',             license.template_list);
router.post   ('/template/add',              license.template_add);
router.get    ('/template/get/:_id',         license.template_get);

router.get    ('/instance',                  license.instance_list_page);
router.get    ('/instance/add-page',         license.instance_list_page);
router.get    ('/instance/detail/page/:id',  license.instance_list_page);
router.get    ('/instance/list',             license.instance_list);
router.get    ('/instance/detail/:id',       license.instance_detail_get);
router.get    ('/instance/active/:orgId',    license.instance_active);
router.post   ('/instance/add',              license.instance_add);
router.put    ('/instance/activate',         license.instance_activate);
router.put    ('/instance/invalidate',       license.instance_invalidate);

module.exports = router;

