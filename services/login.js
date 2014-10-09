'use strict';

var express = require('express');
var Users = require('../models/Users.js');
var router = express.Router();
var config = require('../app-config');
var fs = require('fs');

/* 
* Authenticate user, set session state
*/
router.post('/signin', function(req, res, next) {
	Users.authenticate(req.body.email, req.body.password, function(user) {
		if (user === null) {
			// Couldn't find user 
			res.send(401, 'User email or password incorrect');
			return;
		}
		req.session.user = user;
		// Check is user files directory is present, else create it
		config.user.dataDir = config.dataDir + '/' + user._id;
		fs.exists(config.user.dataDir, function(result) {
			if (!result) {
				fs.mkdir(config.user.dataDir, function(err) {
					console.log('mkdir');
					if (err) console.error(err);
				});
			}
		});
		res.status(200).end();
	});
});
	

/*
* Add new user with its admin user
*/
router.post('/signup', function(req, res, next) {
	var user = {
		email: req.body.email,
		password: req.body.password,
		name: req.body.name,
	};
	Users.add(user, function(result) {
		res.json(result);
	});
});

module.exports = router;
