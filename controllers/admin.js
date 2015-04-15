module.exports = function(app) {
	var AdminController = {
		index: function(req, res) {
			res.render('admin/index');
		},
		portal: function(req, res) {
			res.render('admin/portal');
		}
	};
	return AdminController;
};