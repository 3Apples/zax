var promise        = require('bluebird');
var log            = require('common/log').sub_module('keeper').child ({ module : 'keeper' });
var rest           = require('common/rest');
var network_eps    = require('common/network-eps');

var keeper = {};

var backend = network_eps.backend();

if (!backend) {
	var err = new Error ('unable to get backend endpoint - aborting');
	log.fatal ({ err : err.message, stack : err.stack }, 'unable to get backend endpoint');
	process.exit (1);
}

var url_backend = `${backend}/backend`;
var url_keeper  = `${backend}/backend/keeper/`;

keeper.get_class = function (class_id) {
    var p = promise.pending();

    if (!class_id) {
        p.reject(new Error ('no class id found'));
        return p.promise;
    }

    if (!url_backend) {
        p.reject(new Error ('backend api url for provisioning not found'));
        return p.promise;
    }

    var request_url = `${url_backend}/v1/class/${class_id}/config`;

    rest.get (request_url)
		.then (
			p.resolve.bind(p),
			function (err) {
				log.error ({ class_id: class_id, err: err, stack : err.stack }, 'backend class get error');
				return p.reject (err);
			}
		);

    return p.promise;
};

keeper.cook_class = function (class_id) {
    var p = promise.pending();

    if (!class_id) {
        p.reject(new Error ('no class id found'));
        return p.promise;
    }

    var data = {
        class_id : class_id
    };

    var request_url = url_keeper + class_id + '/cook';

    rest.putJson (request_url, data)
		.then (
			p.resolve.bind(p),
			function (err) {
				log.error ({ class_id: class_id, err: err, stack : err.stack }, 'backend cook class error');
				return p.reject (err);
			}
		);

    return p.promise;
};

keeper.set_job_info = function (class_id, job_info) {
    var p = promise.pending();

    if (!class_id) {
        p.reject(new Error ('no class id found'));
        return p.promise;
    }

    var data = {
        class_id : class_id,
		job      : job_info,
    };

    var request_url = url_keeper + class_id + '/job-info';

    rest.putJson (request_url, data)
		.then (
			function (res) {
				p.resolve (res);
			},
			function (err) {
				p.reject (err);
				log.error ({ err: err, class_id: class_id, stack: err.stack }, 'set job info error (to keeper)');
			}
		);

    return p.promise;
};

keeper.get_job_info = function (class_id) {
    var p = promise.pending();

    if (!class_id) {
        p.reject(new Error ('no class id found'));
        return p.promise;
    }

    var request_url = url_keeper + class_id + '/job-info';

    rest.get (request_url)
		.then (
			function (res) {
				p.resolve (res);
			},
			function (err) {
				p.reject (err);
			}
		);

    return p.promise;
};

keeper.lock_class_config = function (class_id) {
    var p = promise.pending();

    if (!class_id) {
        p.reject(new Error ('no class id found'));
        return p.promise;
    }

    var data = {
        class_id : class_id
    };

    var request_url = url_keeper + class_id + '/lock';

    rest.postJson (request_url, data)
		.then (
			function (res) {
				p.resolve (res);
			},
			function (err) {
				p.reject (err);
				log.error ({ err: err, class_id: class_id, stack: err.stack }, 'class lock error');
			}
		);

    return p.promise;
};

keeper.unlock_class_config = function (class_id, class_config) {
    var p = promise.pending();

    if (!class_id) {
        p.reject(new Error ('no class id found'));
        return p.promise;
    }

    var data = {
        class_id : class_id
    };

    var request_url = url_keeper + class_id + '/unlock';

    rest.postJson (request_url, data)
		.then (
			function (res) {
				p.resolve (class_config);
			},
			function (err) {
				p.reject (err);
				log.error ({ err: err, class_id: class_id, stack : err.stack }, 'class unlock error');
			}
		);

    return p.promise;
};

keeper.set_class_status = function (class_id, state, err, __data) {
    var p = promise.pending();

    if (!class_id) {
        p.reject(new Error ('no class id found'));
        return p.promise;
    }

    var data = {
        class_id : class_id,
        status : state,
		err    : err,
		data   : __data
    };

    var request_url = url_keeper + class_id + '/status';

    rest.postJson (request_url, data)
		.then (
			function (result) {
				log.debug ({ class_id : class_id }, `set class status to "${data.status}"`);
				p.resolve (result);
			},
			function (err) {
				log.error ({ class_id: class_id, _status : state, err: err, stack: err.stack }, 'class set status error');
				p.reject (err);
			}
		);

    return p.promise;
};

keeper.add_prov_info = function (class_id, _prov_info) {
    var p = promise.pending();

    if (!class_id) {
        p.reject(new Error ('no class id found'));
        return p.promise;
    }

    var request_url = url_keeper + class_id + '/add-prov-info';

    rest.putJson (request_url, _prov_info)
		.then (
			function (result) {
				p.resolve (result);
			},
			function (err) {
				log.error ({ class_id: class_id, prov_info : _prov_info, err: err, stack: err.stack }, 'add provisioning info error');
				p.reject (err);
			}
		);

    return p.promise;
};

keeper.update_prov_info = function (class_id, prov_sub_doc) {
    var p = promise.pending();

    if (!class_id) {
        p.reject(new Error ('no class id found'));
        return p.promise;
    }

    var request_url = url_keeper + class_id + '/update-prov-info';

    rest.putJson (request_url, prov_sub_doc)
		.then (
			function (result) {
				p.resolve (result);
			},
			function (err) {
				log.error ({ class_id: class_id, prov_sub_doc : prov_sub_doc, err: err, stack: err.stack }, 'update provisioning info error');
				p.reject (err);
			}
		);

    return p.promise;
};

keeper.publish_docker_event = function (class_id, info) {
    var p = promise.pending();

    if (!class_id) {
        p.reject (new Error ('no class id found'));
        return p.promise;
    }

    var request_url = url_keeper + class_id + '/docker-event';

    rest.putJson (request_url, info)
		.then (
			function (result) {
				p.resolve (result);
			},
			function (err) {
				log.error ({ class_id: class_id, info : info, err: err, stack: err.stack }, 'update docker events error');
				p.reject (err);
			}
		);

    return p.promise;
};

module.exports = keeper;
