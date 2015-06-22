module.exports = function(app) {
	var sendEmail = app.controllers.sendEmail;
	app.post('/sendEmail', sendEmail.sendEmail);
};