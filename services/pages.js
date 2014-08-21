'use strict';

var express = require('express');
var Pages = require('../models/Pages');

var router = express.Router();




router.post('/', function(req, res, next) {
	Pages.get(req.body.labelId, function(result) {
		res.send(result);
	});
});	
	

	
router.post('/add', function(req, res, next) {
	Pages.add(req.body.page, function(result) {
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
