'use strict';

var config = require('../app-config');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var path = require('path');

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
	var filename = path.basename(this.contentUrl);
	var data = fs.readFileSync(config.user.dataDir + '/' + filename, {encoding: 'utf8'});
	return data;
});

//write contents to file pointed by contentUrl
pageSchema.virtual('content').set(function(value) {
	var filename = this._id + '.html';
	//Copy content to a file
	fs.writeFileSync(config.user.dataDir + '/' + filename, value);
	this.contentUrl = 'services/files/'  + filename;
});

module.exports = pageSchema;
