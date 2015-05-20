module.exports = function(app) {
	var Schema = require('mongoose').Schema;

	var comment = Schema({
		name			: {type: String, required: true},
		email			: {type: String, required: true},
		created_date	: { type: Date, default: Date.now },
		comment 		: {type: String, required: true}
	});

	var post = Schema({
		title			: {type: String, required: true},
		text			: {type: String, required: true},
		summary			: {type: String, required: true},
		created_date	: {type: Date, default: Date.now },
		author			: {type: Schema.Types.ObjectId, ref: 'user'}, //{type: String, required: true},
		comments		: [comment],
		category		: [{type: Schema.Types.ObjectId, ref: 'category'}]
	});

	return db.model('post', post);
};