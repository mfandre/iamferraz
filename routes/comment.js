module.exports = function(app) {
	var comment = app.controllers.comment;
	app.post('/comment/createSaveComment', app.isAuthenticated, comment.createSaveComment);
	app.post('/comment/getComments', comment.getComments);
	app.post('/comment/deleteComment', app.isAuthenticated, comment.deleteComment);
	app.post('/comment/editComment', app.isAuthenticated, comment.editComment);
	app.post('/comment/getComment', app.isAuthenticated, comment.getComment);
};