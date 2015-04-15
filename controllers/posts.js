module.exports = function(app) {
	var Post = app.models.post;

	var PostController = {
		createPost: function(req, res){
			var post = req.body.post;
			//console.log(JSON.stringify(req.body));
			console.log(JSON.stringify(post));

			Post.create(post, function(erro, post){
				if(erro){
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({ success : false, message:"Xiiiii deu zica!" + erro }));
					return;
				}

				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ success : true, message:"Post criado!" }));
			});
		},
		getPosts: function(req, res){
			Post.find({}, function(erro, posts) {
				if(erro){
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({ success : false, message:"Xiiiii deu zica!" + erro }));
					return;
				}

				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ success : true, message:"", data:posts }));
			});
		}
	};
	return PostController;
};