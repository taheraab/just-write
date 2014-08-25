'use strict';

var config = new function() {
	this.databaseConnectionURI = 'mongodb://justwrite:justwrite@localhost:27017/storyDB';
	this.dataDir = __dirname + '/files';
	this.user = { //settings for logged in user, will be populated when user logs in
		dataDir: ''
	}
}
//Export singleton config object;
module.exports = config;