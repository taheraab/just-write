'use strict';
var config = require('../app-config.js');
var fs = require('fs');
var mongoose = require('mongoose');
var chapterSchema = require('../db-schema/Chapter');
var chapterModel = mongoose.model('Chapters', chapterSchema);

function Chapters() {
}

/*
* Return chapters for this story 
*/
Chapters.prototype.get = function(storyId, done) {
	chapterModel.find({storyId: storyId})
		.sort('-lastUpdatedAt')
		.exec(function(err, chapters) {
		if (err) {
			console.log(err);
			done([]);
			return;
		}
		console.log(chapters);
		done(chapters);
	});

};

/* 
* Add a new chapter and return new object
*/
Chapters.prototype.add = function(chapter, done) {
	delete chapter.isNew;
	var obj = new chapterModel(chapter);
	obj.save(function(err, chapter) {
		if (err) {
			console.error(err);
			done({err: true, msg: 'Failed to add chapter'});
		}else {
			done({err: false, msg: 'Added chapter: ' + chapter.title + ' successfully', chapter: chapter});
		}
	});
};


/* 
* Update basic story information 
*
Stories.prototype.update = function(obj, done) {
	storyModel.findById(obj.storyId, function(err, story) {
		if (err) {
			console.error(err);
			done({err: true, msg: 'Failed to update story'});
		}else {
			story.title = obj.title;
			story.description = obj.description;
			story.lastUpdatedAt = new Date();
			story.save(function(err) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to update story'});
				}else {
					done({err: false, msg: 'Updated story: ' + story.title + ' successfully'});
				}
			});	
		}
	});
};


/* 
* Delete reference
*
Stories.prototype.deleteReference = function(storyId, index, done) {
	storyModel.findById(storyId, function(err, story) {
		if (err) {
			console.error(err);
			done({err: true, msg: 'Failed to delete reference'});
		}else {
			story.references.splice(index, 1);
			story.lastUpdatedAt = new Date();
			story.save(function(err) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to delete reference'});
				}else {
					done({err: false, msg: 'Deleted reference successfully'});
				}
			});	
		}
	});
};
*/

module.exports = new Chapters();
