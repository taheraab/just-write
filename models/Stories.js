'use strict';
var config = require('../app-config.js');
var mongoose = require('mongoose');
var storySchema = require('../db-schema/Story');
var chapterSchema = require('../db-schema/Chapter');

var storyModel = mongoose.model('Stories', storySchema);
var chapterModel = mongoose.model('Chapters', chapterSchema);

function Stories() {
}

/*
* Return stories
*/
Stories.prototype.get = function(userId, done) {
	storyModel.find({userId: userId})
		.sort('-lastUpdatedAt')
		.exec(function(err, stories) {
		if (err) {
			console.log(err);
			done([]);
			return;
		}
		done(stories);
	});

};

/*
* Return full story for printing
*/
Stories.prototype.getFullStory = function(userId, storyId, done) {
	storyModel.findById(storyId)
		.where('userId', userId)
		.exec(function(err, story) {
			if (err || story == null) {
				console.error(err);
				done(null);
				return;
			}
			chapterModel.find({storyId: storyId})
				.sort('+sortorder')
				.exec(function(err, chapters) {
						if (err) {
							console.error(err);
						}
						done({story: story, chapters: chapters});			
				});
		});
};

/* 
* Add a new story and return new object
*/
Stories.prototype.add = function(story, done) {
	var obj = new storyModel(story);
	obj.save(function(err, story) {
		if (err) {
			console.error(err);
			done({err: true, msg: 'Failed to add story'});
		}else {
			done({err: false, msg: 'Added story: ' + story.title + ' successfully', story: story});
		}
	});
};

/* 
* Update basic story information 
*/
Stories.prototype.update = function(userId, obj, done) {
	storyModel.findById(obj.storyId)
		.where('userId', userId)
		.exec(function(err, story) {
		if (err || (story == null)) {
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
* Add new character
*/
Stories.prototype.addCharacter = function(userId, obj, done) {
	storyModel.findById(obj.storyId)
		.where('userId', userId)
		.exec(function(err, story) {
		if (err || (story == null)) {
			console.error(err);
			done({err: true, msg: 'Failed to add character'});
		}else {
			delete obj.storyId;
			story.characters.push(obj);
			var character = story.characters[story.characters.length - 1];
			story.lastUpdatedAt = new Date();
			story.save(function(err) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to add character'});
				}else {
					done({err: false, msg: 'Added character: ' + obj.name + ' successfully', character: character});
				}
			});	
		}
	});
};

/* 
* Update character information
*/
Stories.prototype.updateCharacter = function(userId, obj, done) {
	storyModel.findById(obj.storyId)
		.where('userId', userId)
		.exec(function(err, story) {
		if (err || (story == null)) {
			console.error(err);
			done({err: true, msg: 'Failed to update character'});
		}else {
			var character = story.characters.id(obj.characterId);
			character.name = obj.name;
			character.description = obj.description;
			story.lastUpdatedAt = new Date();
			story.save(function(err) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to update character'});
				}else {
					done({err: false, msg: 'Updated character: ' + obj.name + ' successfully'});
				}
			});	
		}
	});
};

/* 
* Delete character
*/
Stories.prototype.deleteCharacter = function(userId, storyId, characterId, done) {
	storyModel.findById(storyId)
		.where('userId', userId)
		.exec(function(err, story) {
		if (err || (story == null)) {
			console.error(err);
			done({err: true, msg: 'Failed to delete character'});
		}else {
			var character = story.characters.id(characterId);
			character.remove();
			story.lastUpdatedAt = new Date();
			story.save(function(err) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to delete character'});
				}else {
					done({err: false, msg: 'Deleted character: ' + character.name + ' successfully'});
				}
			});	
		}
	});
};

/* 
* Add new reference
*/
Stories.prototype.addReference = function(userId, obj, done) {
	storyModel.findById(obj.storyId)
		.where('userId', userId)
		.exec(function(err, story) {
		if (err || (story == null)) {
			console.error(err);
			done({err: true, msg: 'Failed to add reference'});
		}else {
			story.references.push(obj.reference);
			var reference = story.references[story.references.length - 1];
			story.lastUpdatedAt = new Date();
			story.save(function(err) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to add reference'});
				}else {
					done({err: false, msg: 'Added reference successfully', reference: reference});
				}
			});	
		}
	});
};

/* 
* Update reference information
*/
Stories.prototype.updateReference = function(userId, obj, done) {
	storyModel.findById(obj.storyId)
		.where('userId', userId)
		.exec(function(err, story) {
		if (err || (story == null)) {
			console.error(err);
			done({err: true, msg: 'Failed to update reference'});
		}else {
			story.references.set(obj.index, obj.reference);
			story.lastUpdatedAt = new Date();
			story.save(function(err) {
				if (err) {
					console.error(err);
					done({err: true, msg: 'Failed to update reference'});
				}else {
					done({err: false, msg: 'Updated reference successfully'});
				}
			});	
		}
	});
};

/* 
* Delete reference
*/
Stories.prototype.deleteReference = function(userId, storyId, index, done) {
	storyModel.findById(storyId)
		.where('userId', userId)
		.exec(function(err, story) {
		if (err || (story == null)) {
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


module.exports = new Stories();
