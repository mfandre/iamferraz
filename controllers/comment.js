module.exports = function(app) {
	var Post = app.models.post;

	var CommentController = {
		createSaveComment: function(req, res){
			var comment = req.body.comment;
			//console.log(JSON.stringify(req.body));
			//console.log(JSON.stringify(category));

			app.sendResponse(res, false, "Falta Implementar!!!");
		},
		getComments: function(req, res){
			Post.find({}, function(erro, posts) {
				if(!erro){
					var comments = [];
					for(var i=0; i < posts.length; i++)
					{
						var tempComments = posts[i].comments.map(function (result) {
							return {
								post_id : posts[i]._id,
								post_title : posts[i].title,
								_id		: result._id,
								comment : result.comment,
								email 	: result.email,
								created_date : result.created_date,
								name : result.name
							};
						});

						comments = comments.concat(tempComments);
					}
					//console.log(comments);
					app.sendResponse(res, true, "Retornando todos os comentários!", comments, {showNoty: false});
				}else{
					app.sendResponse(res, false, "Xiiiii deu zica! No retorno de todos os comentários." + erro, null);
				}
			});
		},
		deleteComment: function(req, res){
			var comment_id = req.body.comment_id;
			var post_id = req.body.post_id;
			//console.log(JSON.stringify(post_id));
			//console.log(JSON.stringify(comment_id));

			Post.findById(post_id, function (err, post) {
				if(!err)
				{
					var comment =  post.comments.id(comment_id);
					comment.remove();
					post.save(function(err, post){
						if(!err)
							app.sendResponse(res, true, "Comentário alterado com sucesso.", comment, {modified : true});
						else
							app.sendResponse(res, false, "Xiiiii deu zica! Erro ao deletar comentário." + erro, null);
					});
					
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! Erro ao deletar comentário." + erro, null);
				}
			});
		},
		editComment: function(req, res){
			var comment = req.body.comment;
			//console.log(JSON.stringify(category));
			app.sendResponse(res, false, "Falta Implementar!!!");
		},
		getComment: function(req, res){
			var id = req.body.id;
			//console.log(JSON.stringify(id));
			Post.find({}, function (erro, posts) {
				if (!erro) {
					var comment = posts.comments.filter(function (comment) {
						return comment._id === id;
					});

					app.sendResponse(res, true, "Comentário encontrado!", comment);
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! Na busca do comentário." + erro, null);
				}
			});
		}
	};
	return CommentController;
};