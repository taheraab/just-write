'use strict';

var config = require('../app-config');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var path = require('path');

var chapterSchema = new Schema({
	title: {type: String, required: 'Chapter title cannot be empty'},
	createdAt: {type: Date, default: new Date()},
	lastUpdatedAt: Date,
	contentUrl: String,
	storyId: {type:ObjectId, required: 'storyId cannot be null'}
	
});

chapterSchema.set('toObject', {virtuals: true});
chapterSchema.set('toJSON', {virtuals: true});

//Read contents of contentUrl into a string
chapterSchema.virtual('content').get(function() {
	if (this.contentUrl == '') return '';
	var filename = path.basename(this.contentUrl);
	var data = fs.readFileSync(config.user.dataDir + '/' + filename, {encoding: 'utf8'});
	return data;
});

//write contents to file pointed by contentUrl
chapterSchema.virtual('content').set(function(value) {
	var filename = this._id + '.html';
	//Copy content to a file
	fs.writeFileSync(config.user.dataDir + '/' + filename, value);
	this.contentUrl = 'services/files/'  + filename;
});

module.exports = chapterSchema;
