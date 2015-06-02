module.exports = function(app) {
	var serverStatus = app.controllers.serverStatus;
	app.post('/serverStatus/getStatus',app.isAuthenticated , serverStatus.getStatus);
};