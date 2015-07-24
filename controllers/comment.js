module.exports = function(app) {
	var Post = app.models.post;

	var CommentController = {
		/*createSaveComment: function(req, res){
			var comment = req.body.comment;
			//console.log(JSON.stringify(req.body));
			//console.log(JSON.stringify(category));

			if (comment._id){
				Post.comments.findByIdAndUpdate(comment._id, { $set: comment }, function (erro, comment) {
					if (!erro) {
						app.sendResponse(res, true, "Comment alterada com sucesso.", comment, {modified : true});
					}
					else {
						app.sendResponse(res, false, "Xiiiii deu zica! Edição do comment." + erro, comment);
					}
				});
			}
			else
			{
				Post.create(comment, function(erro, comment){
					if(!erro){
						app.sendResponse(res, true, "Comentário criada com sucesso.", comment, {modified : false});
					}else{
						app.sendResponse(res, false, "Xiiiii deu zica! Criação do comment." + erro, comment);
					}
				});
			}
		},*/
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
					console.log(comments);
					app.sendResponse(res, true, "Retornando todos os comentarios!", comments, {showNoty: false});
				}else{
					app.sendResponse(res, false, "Xiiiii deu zica! No retorno de todos os comentarios." + erro, null);
				}
			});
		},
		/*deleteComment: function(req, res){
			var id = req.body.id;
			console.log(JSON.stringify(id));

			Post.comments.remove({ _id: id }, function(erro) {
				if (!erro) {
					app.sendResponse(res, true, "Comentario deletada!", id);
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! Deletar comment." + erro, id);
				}
			});
		},
		editComment: function(req, res){
			var comment = req.body.comment;
			//console.log(JSON.stringify(category));
			Post.comments.findByIdAndUpdate(id, { $set: comment }, function (erro, comment) {
				if (!erro) {
					app.sendResponse(res, true, "Comentario alterada com sucesso.", comment, {modified : true});
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! No retorno de todos os comentarios." + erro, comment);
				}
			});
		},
		getComment: function(req, res){
			var id = req.body.id;
			console.log(JSON.stringify(id));
			Post.comments.findById(id, function (erro, comment) {
				if (!erro) {
					app.sendResponse(res, true, "Comentário encontrado!", comment);
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! Na busca do comment." + erro, comment);
				}
			});
		}*/
	};
	return CommentController;
};