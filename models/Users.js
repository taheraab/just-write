'use strict';
var config = require('../app-config.js');
var mongoose = require('mongoose');
var crypto = require('crypto');
var userSchema = require('../db-schema/User');

var usersModel = mongoose.model('Users', userSchema);

function Users() {
}

/*
* Return user profile
*/
Users.prototype.getProfile = function(id, done) {
	usersModel.findById(id, 'name email', function(err, user) {
		if (err) {
			console.log(err);
			done({});
			return;
		}
		done(user);
	});

};


/* 
* Authenticate user with a name and password
* Return valid user information for session, else return null
*/
Users.prototype.authenticate = function(email, password, done) {
	usersModel.findOne()
		.select('_id name email')
		.where('email', email)
		.where('password', crypto.createHash('md5').update(password).digest('hex'))
		.exec(function(err, user) {
			if (err) {
				console.error(err);
				done(null);
				return;
			}
			done(user);
		});	
};


/*
* Insert new User
* Return user sid on success, and err object on failure
*/
Users.prototype.add = function (user, done) {
	usersModel.emailExists(user.email, null, function(result) {
		if (result) {
			done({err: true, msg: 'User email ' + user.email + ' already exists'});
			return;
		}
		user.password = crypto.createHash('md5').update(user.password).digest('hex');
		var obj = new usersModel(user);
		obj.save(function(err) {
			if (err) {
				console.error(err)
				done({err: true, msg: 'Failed to add user'});
			}else {
				done({err: false, msg: 'Added user ' + user.name + ' successfully'});
			}
		});
	});
};



/*
* Update User profile information
*/
Users.prototype.updateProfile = function(id, user, done) {
	var thisRef = this;
	
	function updateUser() {
		if (!user.changePassword) delete user.password;
		delete user.changePassword;
		user.lastUpdatedAt = new Date();
		usersModel.update({'_id': id}, user, null, function(err) {
			if (err) {
				console.error(err);
				done({err: true, msg:'Failed to update User: ' + user.name});
			}else 
				done({err: false, msg:'Updated User: ' + user.name + ' successfully'});
		});
	}	
	
	usersModel.emailExists(user.email, id,  function(result) {
		if (result) {
			done({err: true, msg: 'User email ' + user.email + ' already exists'});
			return;
		}
		
		if (user.changePassword) {
			thisRef.authenticate(user.email, user.password, function(result) {
				if (result == null) {
					done({err: true, msg:'Could not authenticate user'});
					return;				
				}
				user.password = crypto.createHash('md5').update(user.newPassword).digest('hex');
				delete user.newPassword;
				updateUser();
			});
		}else updateUser();
	
	});
	
		
};


module.exports = new Users();
