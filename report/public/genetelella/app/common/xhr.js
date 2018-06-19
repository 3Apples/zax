define(function(require) {
	var $   = require('jquery');

	var xhr_timeout = 20000;

	var xhr = {};

	xhr.get = function (url, options) {
		var _d = $.Deferred();

		options = options || {};

		var __data = {
			async: true,
			cache: options.cache || false,
			type: 'GET',
			contentType: options.contentType || 'application/json',
			url: url,
			success: function (_data, textStatus, xhr) {
				return _d.resolve (_data);
			},

			error: function (xhr, textStatus, error) {

				console.error (' get ' + url + ' : error = ' + error);
				_d.reject(`Error : ${error} - ${xhr.responseText}`);
			},

			timeout: options.timeout || xhr_timeout
		};

		if (options && options.responseType)
			__data.responseType = options.responseType;

		$.ajax (__data);

		return _d.promise();
	};

	xhr.post = function (url, post_data)
	{
		var _d = $.Deferred();

		$.ajax ({
			async: true,
			cache: false,
			type: 'POST',
			contentType: 'application/json',
			url: url,
			data: (post_data ? JSON.stringify (post_data) : ''),
			success: function (_data, textStatus, __xhr) { 
				_d.resolve(_data);
			},

			error: function (__xhr, textStatus, error) { 
				console.error ('POST err: ' + url + ', responseText: ' + __xhr.responseText + ', textStatus: ' + textStatus);	
				console.error ('post ' + url + ' : error = ' + error + ', responseText = ' + __xhr.responseText + ', textStatus = ' + textStatus);
				_d.reject(`Error : ${error} - ${__xhr.responseText}`);
			},

			timeout: xhr_timeout
		});

		return _d.promise();
	};

	xhr.delete = function (url, options) {
		var _d = $.Deferred();

		options = options || {};

		var __data = {
			async: true,
			cache: false,
			type: 'DELETE',
			contentType: options.contentType || 'application/json',
			url: url,
			success: function (_data, textStatus, xhr) {

					_d.resolve(_data);
				},

			error: function (xhr, textStatus, error) {
					console.error (' get ' + url + ' : error = ' + error);
					_d.reject(`Error : ${error} - ${xhr.responseText}`);
				},

			timeout: options.timeout || xhr_timeout
		};

		if (options && options.responseType)
			__data.responseType = options.responseType;

		$.ajax (__data);
		return _d.promise();
	};

	xhr.put = function (url, put_data)
	{
		var _d = $.Deferred();

		$.ajax ({
			async: true,
			cache: false,
			type: 'PUT',
			contentType: 'application/json',
			url: url,
			data: (put_data ? JSON.stringify (put_data) : ''),
			success: function (_data, textStatus, __xhr) { 
				_d.resolve(_data);
			},

			error: function (__xhr, textStatus, error) { 
				console.error ('PUT err: ' + url + ', responseText: ' + __xhr.responseText + ', textStatus: ' + textStatus);	
				console.error ('put ' + url + ' : error = ' + error + ', responseText = ' + __xhr.responseText + ', textStatus = ' + textStatus);
				_d.reject(`Error : ${error} - ${__xhr.responseText}`);
			},

			timeout: xhr_timeout
		});

		return _d.promise();
	};

	xhr.get_binary = function (url, context, options) {
		var _d = $.Deferred();
		var __xhr = new XMLHttpRequest();
		__xhr.open('GET', url, true);
		__xhr.responseType = 'arraybuffer';

		__xhr.onload = function (e) {
			console.info ('event : ', e);
			return _d.resolve (this.response);
		};

		__xhr.send ();
		return _d.promise ();
	};


	return xhr;
});
