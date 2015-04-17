module.exports = function(app) {
	var Post = app.models.post;

	var PostController = {
		createSavePost: function(req, res){
			var post = req.body.post;
			//console.log(JSON.stringify(req.body));
			//console.log(JSON.stringify(post));

			if (post._id){
				Post.findByIdAndUpdate(post._id, { $set: post }, function (erro, post) {
					if (!erro) {
						app.sendResponse(res, true, "Post alterado com sucesso.", post, {modified : true});
					}
					else {
						app.sendResponse(res, false, "Xiiiii deu zica! Edição do post.", post);
					}
				});
			}
			else
			{
				post.author = req.session.user;
				Post.create(post, function(erro, post){
					if(!erro){
						app.sendResponse(res, true, "Post criado com sucesso.", post, {modified : false});
					}else{
						app.sendResponse(res, false, "Xiiiii deu zica! Criação do post.", post);
					}
				});
			}
		},
		getPosts: function(req, res){
			Post.find({}, function(erro, posts) {
				if(!erro){
					app.sendResponse(res, true, "Retornando todos os Posts!", posts, {showNoty: false});
				}else{
					app.sendResponse(res, false, "Xiiiii deu zica! No retorno de todos os posts." + erro, posts);
				}
			}).populate('author').populate('category').exec();
		},
		deletePost: function(req, res){
			var id = req.body.id;
			console.log(JSON.stringify(id));

			Post.remove({ _id: id }, function(erro) {
				if (!erro) {
					app.sendResponse(res, true, "Post deletado!", id);
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! Deletar post." + erro, id);
				}
			});
		},
		editPost: function(req, res){
			var post = req.body.post;
			//console.log(JSON.stringify(post));
			Post.findByIdAndUpdate(id, { $set: post }, function (erro, post) {
				if (!erro) {
					app.sendResponse(res, true, "Post alterado com sucesso.", post, {modified : true});
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! No retorno de todos os posts." + erro, post);
				}
			});
		},
		getPost: function(req, res){
			var id = req.body.id;
			console.log(JSON.stringify(id));
			Post.findById(id, function (erro, post) {
				if (!erro) {
					app.sendResponse(res, true, "Post encontrado!", post);
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! Na busca do post." + erro, post);
				}
			}).populate('author').exec();
		}
	};
	return PostController;
};