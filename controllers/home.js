module.exports = function(app) {
	var HomeController = {
		index: function(req, res) {
			res.render('home/index');
		},
		partials: function(req, res) {
			var name = req.params.name;
			console.log("blog chamou partials! "+ name);
			res.render('home/' + name + '/index',{},function(err, html) {
				if(err) {
					res.render('error'); // File doesn't exist
				} else {
					res.end(html);
				}
			});
		}
	};
	return HomeController;
};