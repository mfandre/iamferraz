module.exports = function(app) {
	var upload = app.controllers.upload;
	app.post('/upload',app.isAuthenticated , upload.upload);
};