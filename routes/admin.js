module.exports = function(app) {
	var admin = app.controllers.admin;
	app.get('/admin', admin.index); //login
	app.get('/admin/portal', admin.portal); //portal
	app.get('/admin/portal/:name', admin.partials); //partials da SPA do portal
};