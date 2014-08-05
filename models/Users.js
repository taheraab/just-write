'use strict';
var config = require('../app-config.js');
var crypto = require('crypto');
var moment = require('moment');

function Users() {
}

/*
* Return user profile
*/
Users.prototype.getProfile = function(sid, done) {
done({});
};


/* 
* Authenticate user with a name and password
* Return valid user information for session, else return null
*/
Users.prototype.authenticate = function(email, password, done) {
	done({
		name: "admin",
		sid: 1
	});
	
};


/*
* Insert new User
* Return user sid on success, and err object on failure
*/
Users.prototype.add = function (user, done) {
	done({});
};



/*
* Update User profile information
*/
Users.prototype.updateProfile = function(sid, user, done) {
		done({});
	
		
};


module.exports = new Users();
