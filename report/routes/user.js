var express    = require('express');
var path       = require('path');
var log        = require('report/common/log').child ({ module : 'routes/user'});
//var passport   = require('vc-admin/common/passport');
var user       = require('report/controllers/user');
var router     = express.Router();

/* 
 * We need the session configuration for auth (to send the auth->via options,
 * so we pre-load the session config here */
router.get    ('/',        		           user.list_page);
/*
router.put    ('/remove',             user.remove);
*/

module.exports = router;

