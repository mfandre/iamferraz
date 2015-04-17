module.exports = function(app) {
	var home = app.controllers.home;
	app.get('/', home.index);
	app.get('/:name', home.partials); //partials da SPA do blog
};