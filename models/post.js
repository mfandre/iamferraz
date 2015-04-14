module.exports = function(app) {
	var Schema = require('mongoose').Schema;

	var comment = Schema({
		name			: {type: String, required: true},
		created_date	: { type: Date, default: Date.now },
		comment 		: {type: String, required: true}
	});

	var category = Schema({
		name			: {type: String, required: true, index: {unique: true, sparse: true}},
		created_date	: { type: Date, default: Date.now }
	});

	var post = Schema({
		title			: {type: String, required: true},
		text			: {type: String, required: true},
		created_date	: { type: Date, default: Date.now },
		author			: {type: String, required: true},
		comments		: [comment],
		category		: [category]
	});

	return db.model('post', post);
};