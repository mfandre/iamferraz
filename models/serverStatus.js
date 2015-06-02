module.exports = function(app) {
	var Schema = require('mongoose').Schema;

	var serverStatus = Schema({
		diskFree		: Number,
		diskUsed		: Number,
		diskTotal		: Number,
		memoryFree		: Number,
		memoryTotal		: Number,
		created_date	: { type: Date, default: Date.now }
	});

	return db.model('serverStatus', serverStatus);
};