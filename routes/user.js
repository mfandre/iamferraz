module.exports = function(app) {
	var user = app.controllers.user;
	app.post('/user/login', user.login);
};