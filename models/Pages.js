'use strict';
var config = require('../app-config.js');
var fs = require('fs');
var mongoose = require('mongoose');
var pageSchema = require('../db-schema/Page');
var pageModel = mongoose.model('Pages', pageSchema);

function Pages() {
}

/*
* Return pages for this story label
*/
Pages.prototype.get = function(labelId, done) {
	pageModel.find({labelId: labelId})
		.sort('-lastUpdatedAt')
		.exec(function(err, pages) {
		if (err) {
			console.log(err);
			done([]);
			return;
		}
		console.log(pages);
		done(pages);
	});

};

/* 
* Add a new page and return new object
*/
Pages.prototype.add = function(page, done) {
	delete page.isNew;
	var obj = new pageModel(page);
	obj.save(function(err, page) {
		if (err) {
			console.error(err);
			done({err: true, msg: 'Failed to add page'});
		}else {
			done({err: false, msg: 'Added page: ' + page.title + ' successfully', page: page});
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

module.exports = new Pages();
