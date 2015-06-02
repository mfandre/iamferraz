module.exports = function(app) {
	var ServerStatus = app.models.serverStatus;

	var ServerStatusController = {
		diskSpaceStatus: function(req, res) {
			ServerStatus.findOne({}, {}, { sort: { 'created_date' : -1 } }, function(err, status) {
				console.log( status );
			});

			app.sendResponse(res, true, "DiskSpace", {});
		},
		memoryStatus: function(req, res){
			app.sendResponse(res, true, "Memory", {});
		}
	};
	return ServerStatusController;
};