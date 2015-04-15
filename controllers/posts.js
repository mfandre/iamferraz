module.exports = function(app) {
	var Post = app.models.post;

	var PostController = {
		createPost: function(req, res){
			var post = req.body.post;
			//console.log(JSON.stringify(req.body));
			console.log(JSON.stringify(post));

			Post.create(post, function(erro, post){
				res.setHeader('Content-Type', 'application/json');
				if(erro){
					res.end(JSON.stringify({ success : false, message:"Xiiiii deu zica!" + erro }));
					return;
				}

				res.end(JSON.stringify({ success : true, message:"Post criado!", data: post }));
			});
		},
		getPosts: function(req, res){
			Post.find({}, function(erro, posts) {
				res.setHeader('Content-Type', 'application/json');
				if(erro){
					res.end(JSON.stringify({ success : false, message:"Xiiiii deu zica!" + erro }));
					return;
				}

				res.end(JSON.stringify({ success : true, message:"", data:posts }));
			});
		},
		deletePost: function(req, res){
			var id = req.body.id;
			//console.log(JSON.stringify(req.body));
			console.log(JSON.stringify(id));

			Post.remove({ _id: id }, function(erro) {
				res.setHeader('Content-Type', 'application/json');
				if (!erro) {
					res.end(JSON.stringify({ success : false, message:"Post deletado!", data: id}));
				}
				else {
					res.end(JSON.stringify({ success : false, message:"Xiiiii deu zica!" + erro }));
				}
			});
		},
		editPost: function(req, res){
			var post = req.body.post;
			console.log(JSON.stringify(post));
			Post.findByIdAndUpdate(id, { $set: post }, function (erro, post) {
				res.setHeader('Content-Type', 'application/json');
				if (!erro) {
					res.end(JSON.stringify({ success : false, message:"Post editado!", data : post}));
				}
				else {
					res.end(JSON.stringify({ success : false, message:"Xiiiii deu zica!" + erro }));
				}
			});
		},
		getPost: function(req, res){
			var id = req.body.id;
			console.log(JSON.stringify(id));
			Post.findById(id, function (erro, post) {
				res.setHeader('Content-Type', 'application/json');
				if (!erro) {
					res.end(JSON.stringify({ success : false, message:"Post encontrado!", data : post}));
				}
				else {
					res.end(JSON.stringify({ success : false, message:"Xiiiii deu zica!" + erro }));
				}
			});
		}
	};
	return PostController;
};