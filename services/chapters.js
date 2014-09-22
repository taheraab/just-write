'use strict';

var express = require('express');
var Chapters = require('../models/Chapters');

var router = express.Router();




router.post('/', function(req, res, next) {
	Chapters.get(req.session.user._id, req.body.storyId, function(result) {
		res.send(result);
	});
});	
	

	
router.post('/add', function(req, res, next) {
	Chapters.add(req.session.user._id, req.body.chapter, function(result) {
		res.send(result);
	});
});

router.post('/update', function(req, res, next) {
	Chapters.update(req.session.user._id, req.body.chapter, function(result) {
		res.send(result);
	});
});

router.post('/updateSortorders', function(req, res, next) {
	Chapters.updateSortorders(req.session.user._id, req.body.sortorders, function(result) {
		res.send(result);
	});
});

router.post('/deleteChapter', function(req, res, next) {
	Chapters.deleteChapter(req.session.user._id, req.body.id, function(result) {
		res.send(result);
	});
});

router.post('/getNote', function(req, res, next) {
	Chapters.getNote(req.session.user._id, req.body.chapterId, req.body.id, function(result) {
		res.send(result);
	});
});

router.post('/addNote', function(req, res, next) {
	Chapters.addNote(req.session.user._id, req.body.chapterId, function(result) {
		res.send(result);
	});
});

router.post('/updateNote', function(req, res, next) {
	Chapters.updateNote(req.session.user._id, req.body.obj, function(result) {
		res.send(result);
	});
});

router.post('/deleteNote', function(req, res, next) {
	Chapters.deleteNote(req.session.user._id, req.body.chapterId, req.body.id, function(result) {
		res.send(result);
	});
});

router.post('/deleteAllNotes', function(req, res, next) {
	Chapters.deleteAllNotes(req.session.user._id, req.body.chapterId, function(result) {
		res.send(result);
	});
});

module.exports = router;
