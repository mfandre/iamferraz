module.exports = function(app) {
	var ServerStatus = app.models.serverStatus;

	var ServerStatusController = {
		getStatus: function(req, res) {
			ServerStatus.findOne({}, {}, { sort: { 'created_date' : -1 } }, function(err, status) {
				if(!err)
					app.sendResponse(res, true, "serverStatus", status,{showNoty: false});
				else
					app.sendResponse(res, false, "Xiiiii deu zica!", null);
			});
		},
	};
	return ServerStatusController;
};