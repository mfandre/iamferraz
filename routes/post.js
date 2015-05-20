module.exports = function(app) {
	var post = app.controllers.posts;
	app.post('/post/createSavePost',app.isAuthenticated , post.createSavePost);
	app.post('/post/getPosts', post.getPosts);
	app.post('/post/deletePost',app.isAuthenticated, post.deletePost);
	app.post('/post/editPost', app.isAuthenticated, post.editPost);
	app.post('/post/getPost', app.isAuthenticated, post.getPost);
	app.post('/post/sendCommentToPost',post.sendCommentToPost);
};