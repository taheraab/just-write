'use strict';

var config = new function() {
	this.databaseConnectionURI = 'mongodb://justwrite:justwrite@localhost:27017/storyDB';
}
//Export singleton config object;
module.exports = config;