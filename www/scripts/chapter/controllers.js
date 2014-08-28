'use strict';

var chapterControllers = angular.module('chapterControllers', []);

/*
* Controller for my stories chapter
*/
chapterControllers.controller('ChapterListCtrl', ['$scope', '$http', '$routeParams', 'NavGuard', 'ConfirmDialog', '$modal',
	function($scope, $http, $routeParams, NavGuard, ConfirmDialog, $modal) {
		$scope.curChapterIndex = 0;	
		$scope.collapseMenu = false;
		$scope.activeChapters = [];
		var storyId = $routeParams.storyId;
		$scope.storyTitle = $routeParams.storyTitle;
		var chapterSortorders = [];		
		
		/*
		* Load chapters for current label
		*/
		$scope.init = function() {
			$http.post('/services/chapters', {storyId: storyId})
				.success(function(chapters) {
					$scope.chapters = chapters;
					$scope.activeChapters = [];
					if (!$scope.chapters.length) $scope.createChapter(); 
					else {
						$scope.activeChapters.push($scope.chapters[0]);
						$scope.activeChapters[0].active = true;
						$scope.curChapterIndex = 0;
					}
					
				});		
		};
		
		
		/*
		* Create a new chapter
		*/
		$scope.createChapter = function() {
			var chapter = {
				title: 'Untitled',
				content: '',
				storyId: storyId,
				isNew: true,
				active: true,
				sortorder: $scope.chapters.length
			};
			$scope.chapters.unshift(chapter);
			$scope.updateActiveChapters(0);
		}
				
		/*
		* Update active chapters, called when a chapter is selected from chapter list
		*/
		$scope.updateActiveChapters = function(i) {
			var index = $scope.activeChapters.indexOf($scope.chapters[i]);
			if (index == -1) {
				$scope.activeChapters.push($scope.chapters[i]);
				var index = $scope.activeChapters.length - 1;
			}
			$scope.activeChapters[index].active = true;
			$scope.curChapterIndex = i;
		}

		/*
		* Set curchapterIndex when a tab is selected
		*/
		$scope.setCurChapterIndex = function(i) {
			$scope.curChapterIndex = $scope.chapters.indexOf($scope.activeChapters[i]);
		}
		
		/*
		* Set collapseMenu
		*/
		$scope.toggleCollapseMenu = function(i) {
			$scope.collapseMenu = !$scope.collapseMenu;
		}
		
		/*
		* Called when a chapter is closed
		*/
		$scope.parentCloseChapter = function(i) {
			if (typeof $scope.activeChapters[i].isNew != 'undefined' && $scope.activeChapters[i].isNew)
				$scope.chapters.splice($scope.curChapterIndex, 1);
			$scope.activeChapters.splice(i, 1);
		}
		
		/*
		* options for the sortable chapter title list
		*/
		$scope.sortableOptions = {
			update: function(e, ui) {
				chapterSortorders = [];
				for (var i = 0; i < $scope.chapters.length; i++) {
					if (typeof $scope.chapters[i].isNew == 'undefined')
						chapterSortorders.push({id: $scope.chapters[i]._id});
				}
			},
			
			stop: function(e, ui) {
				if (chapterSortorders.length == 0) return;
				var j=0;
				for (var i = 0; i < $scope.chapters.length; i++) {
					if (typeof $scope.chapters[i].isNew == 'undefined')
						chapterSortorders[j++].sortorder = $scope.chapters[i].sortorder;
				}
				$http.post('services/chapters/updateSortorders', {sortorders: chapterSortorders})
					.success(function(result) {
						if (result.err) $scope.notify('error', result.msg);
						else $scope.notify('success', result.msg);
					}).error(function() {
						$scope.notify('error', 'Server error');
					});
				console.log(chapterSortorders);
			}
		};
		
		//initialize scope
		$scope.init();
	}
]);

/**
* Controller for each chapter tab
*/
chapterControllers.controller('ChapterCtrl', ['$scope', '$http', '$window', 'NavGuard', 'ConfirmDialog',
	function($scope, $http, $window, NavGuard, ConfirmDialog) {
		$scope.editing = false;
		if (typeof $scope.chapter.isNew != 'undefined' && $scope.chapter.isNew) 
			$scope.editing = true;
		$scope.forms = {basicForm: null};
		
		$scope.master = angular.copy($scope.chapter);
		
		/*
		* Called when a chapter is closed
		*/
		$scope.close = function(i) {
			if ($scope.activeChapters.length != 1) {
				if ($scope.forms.basicForm != null && $scope.forms.basicForm.$dirty) {
					ConfirmDialog.show('You have unsaved changes. Do you want to close?', function(result) {
						if (result) {
							NavGuard.setEditing(false);
							$scope.reset();
							$scope.parentCloseChapter(i);
						}
					});
				}else {
					NavGuard.setEditing(false);
					$scope.parentCloseChapter(i);
				}				
			}
		};
		
		/*
		* Save chapter in db
		*/
		$scope.save = function() {
			var dest = ($scope.chapter.isNew)? 'services/chapters/add' : 'services/chapters/update'; 
			$http.post(dest, {chapter: $scope.chapter})
				.success(function(result) {
					if (result.err) $scope.notify('error', result.msg) 
					else {
						if ($scope.chapter.isNew) {
							delete $scope.chapter.isNew;
							$scope.chapter._id = result.chapter._id;							
						}
						$scope.chapter.title = result.chapter.title;
						$scope.chapter.storyId = result.chapter.storyId;
						$scope.chapter.content = result.chapter.content;
						$scope.chapter.contentUrl = result.chapter.contentUrl;						
						$scope.chapter.sortorder = result.chapter.sortorder;
						$scope.notify('success', result.msg);
						$scope.editing = false;
						$scope.master = angular.copy($scope.chapter);
					}
				}).error(function() {
					$scope.notify('error', 'Server error');
				});
		}
		
		/*
		* Reset chapter state
		*/
		$scope.reset = function() {
			$scope.chapter = angular.copy($scope.master);
			if ($scope.forms.basicForm != null) $scope.forms.basicForm.$setPristine();
		}
		
		
		/*
		* Cancel editing 
		*/
		$scope.cancel = function() {
			if ($scope.forms.basicForm != null && $scope.forms.basicForm.$dirty) {
				ConfirmDialog.show('You have unsaved changes. Do you want to cancel?', function(result) {
					if (result) {
						$scope.reset();
						$scope.editing = false;
					}
				});	
			}else {
				$scope.editing = false;
			}

		}
		
		/*
		* Switch to editing mode
		*/
		$scope.edit = function() {
			$scope.editing = true;
		}
		
		/*
		* Delete chapter in db
		*/
		$scope.deletechapter = function() {
			if ($window.confirm("Confirm Delete")) {
				
			}
		}
		
		/*
		* Watch for change in edit state and set parent isDirty accordingly
		*/
		$scope.$watch("editing", function(newVal, oldVal) {
			NavGuard.setEditing(newVal);
		});
	}
]);


