module.exports = function(app) {
	var AdminController = {
		index: function(req, res) {
			res.render('admin/index');
		}
	};
	return AdminController;
};