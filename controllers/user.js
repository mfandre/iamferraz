module.exports = function(app) {
	var User = app.models.user;

	var UserController = {
		login: function(req, res){
			var user = req.body.user;
			//console.log(JSON.stringify(req.body));
			//console.log(JSON.stringify(user));

			var query  = User.where({ email: user.email, password: user.password });
			query.findOne(function (erro, usr) {
				if (erro){
					app.sendResponse(res, false, "Xiiiii deu zica! Login do usuário." + erro, usr);
				}else if (usr) {
					//console.log("Usuario logado:" + JSON.stringify(usr));
					req.session.user = usr;
					app.sendResponse(res, true, "Login efetuado.", usr);
				}else{
					app.sendResponse(res, false, "Xiiiii deu zica! Usuário não existe.", null);
				}
			});
		},
		logout: function(req, res) {
			//console.log("Deslogando usuario:" + JSON.stringify(req.session.user));
			req.session.destroy();
			res.redirect('/');
		},
		createSaveUser: function(req, res){
			var user = req.body.user;
			//console.log(JSON.stringify(req.body));
			//console.log(JSON.stringify(user));

			if (user._id){
				User.findByIdAndUpdate(user._id, { $set: user }, function (erro, user) {
					if (!erro) {
						app.sendResponse(res, true, true, user);
					}
					else {
						app.sendResponse(res, false, "Xiiiii deu zica! Edição do user." + erro, user);
					}
				});
			}
			else
			{
				User.create(user, function(erro, user){
					if(!erro){
						app.sendResponse(res, true, false, user);
					}else{
						app.sendResponse(res, false, "Xiiiii deu zica! Criação do user." + erro, user);
					}
				});
			}
		},
		getUsers: function(req, res){
			User.find({}, function(erro, users) {
				if(!erro){
					app.sendResponse(res, true, "Retornando todos os users!", users);
				}else{
					app.sendResponse(res, false, "Xiiiii deu zica! No retorno de todos os users." + erro, users);
				}
			});
		},
		deleteUser: function(req, res){
			var id = req.body.id;
			console.log(JSON.stringify(id));

			User.remove({ _id: id }, function(erro) {
				if (!erro) {
					app.sendResponse(res, true, "User deletado!", id);
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! Deletar user." + erro, id);
				}
			});
		},
		editUser: function(req, res){
			var user = req.body.user;
			//console.log(JSON.stringify(user));
			User.findByIdAndUpdate(id, { $set: user }, function (erro, user) {
				if (!erro) {
					app.sendResponse(res, true, true, user);
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! No retorno de todos os user." + erro, user);
				}
			});
		},
		getUser: function(req, res){
			var id = req.body.id;
			console.log(JSON.stringify(id));
			User.findById(id, function (erro, user) {
				if (!erro) {
					app.sendResponse(res, true, "User encontrado!", user);
				}
				else {
					app.sendResponse(res, false, "Xiiiii deu zica! Na busca do user." + erro, user);
				}
			});
		}
	};
	return UserController;
};