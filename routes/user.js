module.exports = function(app) {
	var user = app.controllers.user;
	app.post('/user/login', user.login);
	app.post('/user/createSaveUser', app.isAuthenticated, user.createSaveUser);
	app.post('/user/getUsers', app.isAuthenticated, user.getUsers);
	app.post('/user/deleteUser', app.isAuthenticated, user.deleteUser);
	app.post('/user/editUser', app.isAuthenticated, user.editUser);
	app.post('/user/getUser', app.isAuthenticated, user.getUser);
	app.get('/user/logout', app.isAuthenticated, user.logout);
};