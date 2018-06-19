var Promise = require('bluebird');
var ObjectId = require('mongodb').ObjectID
	  //destinationpump = new Pump().from(new datapumps.Buffer({size: 2000}));

var data = {test:1};
var kue = require('kue-scheduler');
var Queue = kue.createQueue();
 
//create a job instance
var job = Queue
            .createJob('every', data)
            .attempts(3)
            .backoff(true)
            .priority('normal');
 
//schedule it to run every 2 seconds
Queue.every('12 seconds', job);
 
 
//somewhere process your scheduled jobs
Queue.process('every', function(job, done) {
	sync(job.data, done);
	//done();
});

function sync (data, done) {
	var datapumps = require('datapumps'),
	  Pump = datapumps.Pump,
	  MongodbMixin = datapumps.mixin.MongodbMixin,
	  ExcelWriterMixin = datapumps.mixin.ExcelWriterMixin,
	  sourcepump = new Pump(),
	  destinationpump = new Pump();
	console.log('Pumping started: ' + new Date())
	sourcepump
		.mixin(MongodbMixin('mongodb://127.0.0.1:27017/test1'))
		.useCollection('iifl')
		.from(sourcepump.find({"_id":{$gte:ObjectId("5b2254d628d4ec56086502a3")}}))//TODO: pick last _id from mongodb 
		.logErrorsToConsole()
		.on('end', function() {
			console.log('Source Pump End ' + new Date())
		})

	destinationpump
		.mixin(MongodbMixin('mongodb://127.0.0.1:27017/test1'))
		.useCollection('iifl_report')
		.from(sourcepump.buffer())
		.process(function(record) {
			return new Promise(function (res, rej){
				var arr =[];
				var doc = process_record(record);
	 
				for (var i = 0; i < doc.length; i++) {
					/*var temp = {};
					temp = JSON.parse (JSON.stringify (doc[i]));
					arr.push(destinationpump.insert(temp));*/
					//if(doc[i]._id)
					//	delete doc[i]._id;
					arr.push(destinationpump.insert(doc[i]));
				}

				Promise.all(arr).then(function() {
					res();
				}, function () {
					console.log("Error");
					rej();
				});
				
			});
		})
		.logErrorsToConsole()
		.on('end', function() {
			done();
			console.log('Destination Pump End ' + new Date())
		})

	Promise.all([ sourcepump.run(), destinationpump.run() ])
		.then(function() {
			console.log('Program End ' + new Date())
			flag = false;
		});
}

function process_record(data) {
	var arr = [];
	var ret = {};
	ret.app_version = data.appVersion;
	ret.app_name = data.appName;
	ret.client_id = data.clientId;
	ret.andriod_version = data.deviceInfo.androidVersion;
	ret.device_name = data.deviceInfo.deviceName;
	ret.available_ram = data.deviceInfo.availableRam;
	ret.total_ram = data.deviceInfo.totalRam;

	for (var i = 0; i < data.apiInfoDataList.length; i++) {
		ret.date = data.apiInfoDataList[i].date;
		for (var j = 0; j < data.apiInfoDataList[i].apiInfoTimeWiseList.length; j++) {
			ret.time_slot = data.apiInfoDataList[i].apiInfoTimeWiseList[j].timeSlot;
			for (var k = 0; k < data.apiInfoDataList[i].apiInfoTimeWiseList[j].data.length; k++) {
				var _k = data.apiInfoDataList[i].apiInfoTimeWiseList[j].data[k];
				ret.api_failure_reasons = _k.apiFailureReasons;
				ret.api_name = _k.apiName;
				ret.avg_request_size = _k.avgRequestSize;
				ret.avg_response_time = _k.avgResponseSize;
				ret.avg_response_time = _k.avgResponseTime;
				ret.count = _k.count;
				ret.max_response_time = _k.maxResponseTime;
				ret.min_response_time = _k.minResponseTime;
				
				arr.push(JSON.parse (JSON.stringify (ret)));
			}

		}
	}
	return arr;
}
