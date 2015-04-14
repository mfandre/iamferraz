module.exports = function(app) {
	var admin = app.controllers.admin;
	app.get('/admin', admin.index);
};