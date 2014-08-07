'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: {type: String, required: 'User name cannot be mepty'},
	email: {type: String, required: 'User email cannot be empty'},
	createdAt: {type: Date, default: new Date()},
	lastUpdatedAt: Date,
	password: {type: String, required: 'Password cannot be empty'}
	
});

//Check if name is unique
userSchema.statics.emailExists = function(email, id, done) {
	var query = this.where('email', email);
	if (id != null) query.where('_id').ne(id);
	query.count(function(err, count) {
		if (err) {
			console.error(err);
			done(false);
		}else {
			if (count > 0) done(true);
			else done(false);
		}
	});
};

module.exports = userSchema;
