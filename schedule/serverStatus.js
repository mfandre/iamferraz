module.exports = function(app) {
	var CronJob = require('cron').CronJob;
	var freediskspace = require('freediskspace');
  	var os = require('os');

	var ServerStatus = app.models.serverStatus;

	try {

		new CronJob('1 * * * * *', function() {
			//path = 'c:';
			//path = '/dev/vda1';

			//console.log('You will see this message every minute');
			freediskspace.detail('c:', function(error, details){
				//console.log(details);
				// { drive: '/',
				//   total: 2199023255552,
				//   used: 2199023255552,
				//   free: 155692564480 }

				if(error){
					console.log(JSON.stringify(error));
					return;
				}

				var status = {
					diskFree		: details.free,
					diskUsed		: details.used,
					diskTotal		: details.total,
					memoryFree		: os.freemem(),
					memoryTotal		: os.totalmem()
				};

				ServerStatus.create(status, function(erro, serverStatus){
					if(erro){
						console.log(erro);
					}
				});
			});

		
		}, null, true);
	} catch(ex) {
		console.log("cron pattern not valid." + JSON.stringify(ex));
	}

/*
	freediskspace.driveList(function(error, drives){
		console.log(drives);
		// ['/', '/tmp', '/home']
		// or
		// ['C:', 'D:', 'Z:']
	});
*/
	

	
};