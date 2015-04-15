module.exports = function(app) {
	var User = app.models.user;

	var UserController = {
		login: function(req, res){
			var user = req.body.user;
			//console.log(JSON.stringify(req.body));
			console.log(JSON.stringify(user));

			if(user.email === "fandre@gmail.com" && user.password === "1234"){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ success : true, message:"Login efetuado!" }));
				return;
			}

			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({ success : false, message:"Xiiiii deu zica!" }));
		}
	};
	return UserController;
};