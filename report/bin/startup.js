var colors      = require ('colors');
//var moment      = require ('moment');

//var name  = args.name, log;

async function start () {

	try {
		/*
		 * Store basic inforamation about the application
		 * for other modules to use */
		//args.name_pretty = 'Admin Dashboard';
		//args.desc        = 'Mission control station';

		/*
		 * Common startup file for all apss */
		//log = await startup.init(args);
		//await kv.get_and_store (`config/app/vc/`, { recurse : true });

		//log.info ({ args }, `starting app ${name} with arguments`);

		require ('./www');
	}
	catch (e) {
		console.error (colors.red ('fatal error : ') + e);
		if (e.stack)
			console.error (e.stack);

		process.exit (1);
	}
}

start ();
