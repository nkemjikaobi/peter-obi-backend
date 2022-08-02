const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	state: {
		type: String,
		required: true,
	},
	lga: {
		type: String,
		required: true,
	},
	polling_unit: {
		type: String,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
