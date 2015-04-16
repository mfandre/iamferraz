module.exports = function(app) {
	var Category = app.models.category;

	var CategoryController = {
		login: function(req, res){
			var category = req.body.category;
			//console.log(JSON.stringify(req.body));
			//console.log(JSON.stringify(category));

			var query  = Category.where({ email: category.email, password: category.password });
			query.findOne(function (erro, usr) {
				if (erro){
					app.sendResponse(res, false, "Xiiiii deu zica! Login do usuário." + erro, usr);
				}else if (usr) {
					//console.log("Usuario logado:" + JSON.stringify(usr));
					req.session.category = usr;
					app.sendResponse(res, true, "Login efetuado.", usr);
				}else{
					app.sendResponse(res, false, "Xiiiii deu zica! Usuário não existe.", null);
				}
			});
		},
		logout: function(req, res) {
			//console.log("Deslogando usuario:" + JSON.stringify(req.session.category));
			req.session.destroy();
			res.redirect('/');
		},
		createSaveCategory: function(req, res){
			var category = req.body.category;
			//console.log(JSON.stringify(req.body));
			//console.log(JSON.stringify(category));

			if (category._id){
				Category.findByIdAndUpdate(category._id, { $set: category }, function (erro, category) {
					if (!erro) {
						app.sendResponse(res, true, true, category);
					}
					else {
						app.sendResponse(res, false, "Xiiiii deu zica! Edição do category." + erro, category);
					}
				});
			}
			else
			{
				Category.create(category, function(erro, category){
					if(!erro){
						app.sendResponse(res, true, false, category);
					}else{
						app.sendResponse(res, false, "Xiiiii deu zica! Criação do category." + erro, category);
					}
				});
			}
		},
		getCategories: function(req, res){
			Category.find({}, function(erro, categories) {
				if(!erro){
					app.sendResponse(res, true, "Retornando todos os categories!", categories);
				}else{
					app.sendResponse(res, false, "Xiiiii deu zica! No retorno de todos os categories." + erro, categories);
				}
			});
		},
		deleteCategory: function(req, res){
			var id = req.body.id;
			console.log(JSON.stringify(id));

			Category.remove({ _id: id }, function(erro) {
				if (!erro) {
					app.sendResponse(res, true, "Category deletado!", id);
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! Deletar category." + erro, id);
				}
			});
		},
		editCategory: function(req, res){
			var category = req.body.category;
			//console.log(JSON.stringify(category));
			Category.findByIdAndUpdate(id, { $set: category }, function (erro, category) {
				if (!erro) {
					app.sendResponse(res, true, true, category);
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! No retorno de todos os category." + erro, category);
				}
			});
		},
		getCategory: function(req, res){
			var id = req.body.id;
			console.log(JSON.stringify(id));
			Category.findById(id, function (erro, category) {
				if (!erro) {
					app.sendResponse(res, true, "Category encontrado!", category);
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! Na busca do category." + erro, category);
				}
			});
		}
	};
	return CategoryController;
};