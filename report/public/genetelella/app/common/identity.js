import $     from 'jquery';
import xhr   from './xhr';
import User  from 'm_install/apps/common/lib/user/class';

var identity = {};
var cached = null, raw = null;

identity.fetch = function () {
	var p = $.Deferred ();

	xhr.get ('/vc-admin/user/detail')
		.then (
			(result) => { 
				raw    = result;
				cached = new User (result);
				p.resolve (cached);
			},
			(error ) => { p.reject (error); }
		);

	return p.promise ();
};

identity.cached = () => cached;
identity.raw    = () => raw;
identity.id     = () => cached.user.id;

export default identity;
