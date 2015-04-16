module.exports = function(app) {
	var Schema = require('mongoose').Schema;

	var user = Schema({
		name			: {type: String, required: true},
		email			: {type: String, required: true},
		password		: {type: String, required: true},
		avatar			: String,
		created_date	: {type: Date, default: Date.now }
	});

	return db.model('user', user);
};