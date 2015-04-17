module.exports = function(app) {
	var category = app.controllers.category;
	app.post('/category/createSaveCategory', app.isAuthenticated, category.createSaveCategory);
	app.post('/category/getCategories', category.getCategories);
	app.post('/category/deleteCategory', app.isAuthenticated, category.deleteCategory);
	app.post('/category/editCategory', app.isAuthenticated, category.editCategory);
	app.post('/category/getCategory', app.isAuthenticated, category.getCategory);
};