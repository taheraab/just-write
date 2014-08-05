'use strict';

var express = require('express');
var Users = require('../models/Users.js');

var router = express.Router();



/* Get user profile */
router.get('/getProfile', function(req, res, next) {
	Users.getProfile(req.session.user.sid, function(result) {
		res.send(result);
	});
});	
	
	
router.post('/add', function(req, res, next) {
	var user = req.body.user;
	Users.add(user, function(result) {
		res.send(result);
	});
});

/* Update user profile */
router.post('/updateProfile', function(req, res, next) {
	var user = req.body.user;
	Users.updateProfile(req.session.user.sid, user, function(result) {
		res.send(result);
	});
});

module.exports = router;
