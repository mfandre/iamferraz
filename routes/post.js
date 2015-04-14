module.exports = function(app) {
	var post = app.controllers.posts;
	app.post('/post/createPost', post.createPost);
	app.post('/post/getPosts', post.getPosts);
};