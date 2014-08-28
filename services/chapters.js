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

router.post('/update', function(req, res, next) {
	Chapters.update(req.body.chapter, function(result) {
		res.send(result);
	});
});

router.post('/updateSortorders', function(req, res, next) {
	Chapters.updateSortorders(req.body.sortorders, function(result) {
		res.send(result);
	});
});

router.post('/deleteChapter', function(req, res, next) {
	Chapters.deleteChapter(req.body.id, function(result) {
		res.send(result);
	});
});

module.exports = router;
