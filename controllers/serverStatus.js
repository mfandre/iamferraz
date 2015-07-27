module.exports = function(app) {
	
	var freediskspace = require('freediskspace');
  	var os = require('os');

	var ServerStatusController = {
		getStatus: function(req, res) {
			freediskspace.detail('c:', function(error, details){
				//console.log(details);
				// { drive: '/',
				//   total: 2199023255552,
				//   used: 2199023255552,
				//   free: 155692564480 }

				if(error){
					console.log(JSON.stringify(error));
					app.sendResponse(res, false, "Xiiiii deu zica!", null);
					return;
				}

				var status = {
					diskFree		: details.free,
					diskUsed		: details.used,
					diskTotal		: details.total,
					memoryFree		: os.freemem(),
					memoryTotal		: os.totalmem()
				};

				app.sendResponse(res, true, "serverStatus", status,{showNoty: false});
			});
		},
	};
	return ServerStatusController;
};