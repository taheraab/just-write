'use strict';

var express = require('express');
var Stories = require('../models/Stories.js');

var router = express.Router();



/* Get user profile */
router.get('/', function(req, res, next) {
	Stories.get(req.session.user._id, function(result) {
		res.send(result);
	});
});	
	
	
router.post('/add', function(req, res, next) {
	var story = req.body.obj;
	story.userId = req.session.user._id;
	Stories.add(story, function(result) {
		res.send(result);
	});
});

router.post('/update', function(req, res, next) {
	Stories.update(req.body.obj, function(result) {
		res.send(result);
	});
});

router.post('/addCharacter', function(req, res, next) {
	Stories.addCharacter(req.body.obj, function(result) {
		res.send(result);
	});
});


router.post('/updateCharacter', function(req, res, next) {
	Stories.updateCharacter(req.body.obj, function(result) {
		res.send(result);
	});
});

router.post('/deleteCharacter', function(req, res, next) {
	Stories.deleteCharacter(req.body.storyId, req.body.characterId, function(result) {
		res.send(result);
	});
});

router.post('/addReference', function(req, res, next) {
	Stories.addReference(req.body.obj, function(result) {
		res.send(result);
	});
});

router.post('/updateReference', function(req, res, next) {
	Stories.updateReference(req.body.obj, function(result) {
		res.send(result);
	});
});

router.post('/deleteReference', function(req, res, next) {
	Stories.deleteReference(req.body.storyId, req.body.index, function(result) {
		res.send(result);
	});
});

module.exports = router;
