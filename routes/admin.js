module.exports = function(app) {
	var admin = app.controllers.admin;
	app.get('/admin', admin.index); //login
	app.get('/admin/portal', app.isAuthenticated, admin.portal); //portal
	app.get('/admin/portal/:name', app.isAuthenticated, admin.partials); //partials da SPA do portal
};