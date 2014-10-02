'use strict';

var express = require('express');
var Stories = require('../models/Stories.js');

var router = express.Router();



/* Get story list for user */
router.get('/', function(req, res, next) {
	Stories.get(req.session.user._id, function(result) {
		res.send(result);
	});
});	
	
router.post('/getFullStory', function(req, res, next) {
	Stories.getFullStory(req.session.user._id, req.body.storyId, function(result) {
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
	Stories.update(req.session.user._id, req.body.obj, function(result) {
		res.send(result);
	});
});

router.post('/addCharacter', function(req, res, next) {
	Stories.addCharacter(req.session.user._id, req.body.obj, function(result) {
		res.send(result);
	});
});


router.post('/updateCharacter', function(req, res, next) {
	Stories.updateCharacter(req.session.user._id, req.body.obj, function(result) {
		res.send(result);
	});
});

router.post('/deleteCharacter', function(req, res, next) {
	Stories.deleteCharacter(req.session.user._id, req.body.storyId, req.body.characterId, function(result) {
		res.send(result);
	});
});

router.post('/addReference', function(req, res, next) {
	Stories.addReference(req.session.user._id, req.body.obj, function(result) {
		res.send(result);
	});
});

router.post('/updateReference', function(req, res, next) {
	Stories.updateReference(req.session.user._id, req.body.obj, function(result) {
		res.send(result);
	});
});

router.post('/deleteReference', function(req, res, next) {
	Stories.deleteReference(req.session.user._id, req.body.storyId, req.body.index, function(result) {
		res.send(result);
	});
});


module.exports = router;
