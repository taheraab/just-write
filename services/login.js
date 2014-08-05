'use strict';

var express = require('express');
var Users = require('../models/Users.js');
var router = express.Router();


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
		res.send(200);
	});
});
	

/*
* Add new tenant with its admin user
*/
router.post('/signup', function(req, res, next) {
	var user = {
		userid: req.body.email,
		password: req.body.password,
		name: req.body.name,
	};
	Users.add(user, function(result) {
		res.json(result);
	});
});

module.exports = router;
