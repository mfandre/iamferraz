module.exports = function(app) {
	var AdminController = {
		index: function(req, res) {
			res.render('admin/index');
		},
		portal: function(req, res) {
			res.render('admin/portal');
		},
		partials: function(req, res) {
			var name = req.params.name;
			console.log("chamou partials! "+ name);
			res.render('admin/' + name + '/index');
		}
	};
	return AdminController;
};