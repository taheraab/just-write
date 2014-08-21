'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var storySchema = new Schema({
	title: {type: String, required: 'Story title cannot be empty'},
	description: String,
	createdAt: {type: Date, default: new Date()},
	lastUpdatedAt: Date,
	labels: [{name: {type:String, required: 'Label name cannot be empty'}}],
	characters: [{name: {type:String, required: 'Character name cannot be empty'}, description: String}], 
	references: [String],
	userId: {type:ObjectId, required: 'userId cannot be null'}
	
});

storySchema.statics.getNumOfPages = function() {

};

storySchema.statics.getNumOfWords = function() {

};

//Check if label name is unique
storySchema.statics.labelExists = function(storyId, name, labelId, done) {
	var query = this.findById(storyId);
	query.where('labels').elemMatch(function(elm) {
		elm.where('name', name);
		if (labelId != null) elm.where('_id').ne(labelId);
	});
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

module.exports = storySchema;
