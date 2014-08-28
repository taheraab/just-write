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
		.sort('-sortorder')
		.exec(function(err, chapters) {
		if (err) {
			console.log(err);
			done([]);
			return;
		}
		//console.log(chapters);
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
* Update sort orders
*/
Chapters.prototype.updateSortorders = function(sortorders, done) {
	var error = false;
	for (var i = 0; i < sortorders.length; i++) {
		chapterModel.update({_id: sortorders[i].id}, {sortorder: sortorders[i].sortorder}, null, function(err) {
			if (err) {
				console.error(err);
				error = true;
				return;
			}
		});
		if (error) {
			done({err: true, msg: 'Failed to change chapter order'});
			return;
		}
	}
	done({err: false, msg: 'Changed chapter order successfully'});
};

/* 
* Update chapter
*/
Chapters.prototype.update = function(obj, done) {
	chapterModel.findById(obj._id, function(err, chapter) {
		if (err) {
			console.error(err);
			done({err: true, msg: 'Failed to update chapter'});
		}else {
			chapter.title = obj.title;
			chapter.content = obj.content;
			chapter.lastUpdatedAt = new Date();
			chapter.save(function(err, c) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to update chapter'});
				}else {
					done({err: false, msg: 'Updated chapter: ' + chapter.title + ' successfully', chapter: c});
				}
			});	
		}
	});
};


/* 
* Delete chapter
*/
Chapters.prototype.deleteChapter = function(id, done) {
	chapterModel.remove({_id: id}, function(err) {
		if (err) {
			console.error(err);
			done({err: true, msg: 'Failed to delete chapter'});
		}else 
			done({err: false, msg: 'Deleted chapter successfully'});
				
	});	
	
};


module.exports = new Chapters();
