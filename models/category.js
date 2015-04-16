module.exports = function(app) {
	var Schema = require('mongoose').Schema;

	var category = Schema({
		name			: {type: String, required: true, index: {unique: true, sparse: true}},
		image			: String,
		created_date	: { type: Date, default: Date.now }
	});

	return db.model('category', category);
};