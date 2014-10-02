'use strict';
var config = require('../app-config.js');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var chapterSchema = require('../db-schema/Chapter');
var chapterModel = mongoose.model('Chapters', chapterSchema);

function Chapters() {
}

/*
* Return chapters for this story 
*/
Chapters.prototype.get = function(userId, storyId, done) {
	chapterModel.find({storyId: storyId}, 'title contentUrl sortorder storyId')
		.where('userId', userId)
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
* Return printable content (without notes)
*/
Chapters.prototype.getPrintableContent = function(userId, chapterId, done) {
	chapterModel.findById(chapterId)
		.where('userId', userId)
		.exec(function(err, chapter) {
			if (err) {
				console.error(err);
				done(null);
				return;
			}
			var filename = config.user.dataDir + '/' + path.basename(chapter.contentUrl);
			fs.readFile(filename, {encoding: 'utf8'}, function(err, data) {
				if (err) {
					console.error(err);
					done(null);
					return;
				}
				console.log(data);
				// Remove note references from chapter content
				var content = data.replace(/<a.*?value="jw-note".*?>.*?<\/a>/ig, '');
				console.log(content);
				done(content);
			});	
	});
};

/* 
* Add a new chapter and return new object
*/
Chapters.prototype.add = function(userId, chapter, done) {
	delete chapter.isNew;
	chapter.userId = userId;
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
Chapters.prototype.updateSortorders = function(userId, sortorders, done) {
	var error = false;
	for (var i = 0; i < sortorders.length; i++) {
		chapterModel.update({_id: sortorders[i].id, userId: userId}, {sortorder: sortorders[i].sortorder}, null, function(err) {
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
Chapters.prototype.update = function(userId, obj, done) {
	chapterModel.findById(obj._id)
		.where('userId', userId)
		.exec(function(err, chapter) {
		if (err || (chapter == null)) {
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
Chapters.prototype.deleteChapter = function(userId, id, done) {
	chapterModel.remove({_id: id})
		.where('userId', userId)
		.exec(function(err) {
		if (err) {
			console.error(err);
			done({err: true, msg: 'Failed to delete chapter'});
		}else 
			done({err: false, msg: 'Deleted chapter successfully'});
				
	});	
	
};

/* 
* Get note by id
*/
Chapters.prototype.getNote = function(userId, chapterId, id, done) {
	chapterModel.findById(chapterId)
		.where('userId', userId)
		.exec(function(err, chapter) {
		if (err || (chapter == null)) {
			console.error(err);
			done(null);
		}else {
			var note = chapter.notes.id(id);
			//if (note == null) done(null);
			done({_id: chapter._id, title: chapter.title, note: note});
		}
	});
};

/* 
* Add new note
*/
Chapters.prototype.addNote = function(userId, chapterId, done) {
	chapterModel.findById(chapterId)
		.where('userId', userId)
		.exec(function(err, chapter) {
		if (err || (chapter == null)) {
			console.error(err);
			done({err: true, msg: 'Failed to add note'});
		}else {
			chapter.notes.push({title: 'Untitled', description: ''});
			var note = chapter.notes[chapter.notes.length - 1];
			chapter.lastUpdatedAt = new Date();
			chapter.save(function(err) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to add note'});
				}else {
					done({err: false, msg: 'Added note: ' + note.title + ' successfully', note: note});
				}
			});	
		}
	});
};

/* 
* Update Note information
*/
Chapters.prototype.updateNote = function(userId, obj, done) {
	chapterModel.findById(obj._id)
		.where('userId', userId)
		.exec(function(err, chapter) {
		if (err || (chapter == null)) {
			console.error(err);
			done({err: true, msg: 'Failed to update note'});
		}else {
			var note = chapter.notes.id(obj.note._id);
			note.title = obj.note.title;
			note.description = obj.note.description;
			chapter.lastUpdatedAt = new Date();
			chapter.save(function(err) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to update note'});
				}else {
					done({err: false, msg: 'Updated note: ' + obj.note.title + ' successfully'});
				}
			});	
		}
	});
};

/* 
* Delete note
*/
Chapters.prototype.deleteNote = function(userId, chapterId, id, done) {
	chapterModel.findById(chapterId)
		.where('userId', userId)
		.exec(function(err, chapter) {
		if (err) {
			console.error(err);
			done({err: true, msg: 'Failed to delete note'});
		}else {
			var note = chapter.notes.id(id);
			note.remove();
			chapter.lastUpdatedAt = new Date();
			chapter.save(function(err) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to delete note'});
				}else {
					done({err: false, msg: 'Deleted note: ' + note.title + ' successfully'});
				}
			});	
		}
	});
};

/* 
* Delete all notes from chapter and update chapter content
*/
Chapters.prototype.deleteAllNotes = function(userId, chapterId, done) {
	var thisRef = this;
	chapterModel.findById(chapterId)
		.where('userId', userId)
		.exec(function(err, chapter) {
			if (err) {
				console.error(err);
				done({err: true, msg: 'Failed to delete notes'});
				return;
			}
			chapter.notes = [];
			var filename = config.user.dataDir + '/' + path.basename(chapter.contentUrl);
			fs.readFile(filename, {encoding: 'utf8'}, function(err, data) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to delete notes'});
					return;
				}
				// Remove note references from chapter content
				chapter.content = data.replace(/<a.*?value="jw-note".*?>.*?<\/a>/ig, '');
				chapter.lastUpdatedAt = new Date();
				chapter.save(function(err) {
					if (err) {
						console.error(err);
						done({err: true, msg: 'Failed to delete notes'});
					}else {
						done({err: false, msg: 'Deleted notes successfully'});
					}
				});
			});	
	});
};

module.exports = new Chapters();
