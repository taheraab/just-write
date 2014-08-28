'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var storySchema = new Schema({
	title: {type: String, required: 'Story title cannot be empty'},
	description: String,
	createdAt: {type: Date, default: new Date()},
	lastUpdatedAt: Date,
	characters: [{name: {type:String, required: 'Character name cannot be empty'}, description: String}], 
	references: [String],
	userId: {type:ObjectId, required: 'userId cannot be null'}
	
});



module.exports = storySchema;
