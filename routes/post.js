module.exports = function(app) {
	var post = app.controllers.posts;
	app.post('/post/createPost', post.createPost);
	app.post('/post/getPosts', post.getPosts);
	app.post('/post/deletePost', post.deletePost);
	app.post('/post/editPost', post.editPost);
	app.post('/post/getPost', post.getPost);
};