'use strict';

var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var pageSchema = new Schema({
	title: {type: String, required: 'Page title cannot be empty'},
	createdAt: {type: Date, default: new Date()},
	lastUpdatedAt: Date,
	contentUrl: String,
	labelId: {type:ObjectId, required: 'labelId cannot be null'}
	
});

pageSchema.set('toObject', {virtuals: true});
pageSchema.set('toJSON', {virtuals: true});

//Read contents of contentUrl into a string
pageSchema.virtual('content').get(function() {
	if (this.contentUrl == '') return '';
	var data = fs.readFileSync(this.contentUrl, {encoding: 'utf8'});
	return data;
});

//write contents to file pointed by contentUrl
pageSchema.virtual('content').set(function(value) {
	var filename = 'files/' + this._id + '.html';
	//Copy content to a file
	fs.writeFileSync(filename, value);
	this.contentUrl = filename;
});

module.exports = pageSchema;
