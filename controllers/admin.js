module.exports = function(app) {
	var AdminController = {
		index: function(req, res) {
			if (req.session.user == undefined || req.session.user == null) {  
				res.render('admin/index');
			}else{
				res.render('admin/portal');
			}
		},
		portal: function(req, res) {
			res.render('admin/portal');
		},
		partials: function(req, res) {
			var name = req.params.name;
			console.log("admin chamou partials! "+ name);
			res.render('admin/' + name + '/index');
		}
	};
	return AdminController;
};