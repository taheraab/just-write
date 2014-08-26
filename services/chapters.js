'use strict';

var express = require('express');
var Chapters = require('../models/Chapters');

var router = express.Router();




router.post('/', function(req, res, next) {
	Chapters.get(req.body.storyId, function(result) {
		res.send(result);
	});
});	
	

	
router.post('/add', function(req, res, next) {
	Chapters.add(req.body.chapter, function(result) {
		res.send(result);
	});
});
/*
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
*/
module.exports = router;
