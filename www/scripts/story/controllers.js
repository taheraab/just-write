'use strict';

var storyControllers = angular.module('storyControllers', []);

/*
* Controller for my stories page
*/
storyControllers.controller('StoryListCtrl', ['$scope', '$http', '$modal',
	function($scope, $http, $modal) {
		$scope.showCharacterEdit = []; //Show character edit options
		$scope.showReferenceEdit = []; //Show reference edit options
		$scope.curStoryIndex = 0;	
		
		/**
		* Get the list of stories for this user
		*/
		$scope.init = function() {
			$http.get('/services/stories/')
				.success(function(stories) {
					$scope.stories = stories;			
				});
			
		};
		
		/*
		* Set current Story Index
		*/
		$scope.setCurStoryIndex = function(i) {
			$scope.curStoryIndex = i;
		}
		
		/**
		* Add a new story 
		*/
		$scope.createStory = function() {
			var modalInstance = $modal.open({
				templateUrl: 'views/story-edit.html',
				controller: 'StoryEditCtrl',
				resolve: {
					obj: function() {
						return {title: '', description: ''};
						},
					destinationUrl: function() {
						return 'services/stories/add';
						}
				}
			});
			modalInstance.result.then(function(result) {
        if (result.err) $scope.notify('error', result.msg);
				else {
					$scope.notify('success', result.msg);
					$scope.stories.push(result.story);
				}
				});
		};

		/**
		* Edit story 
		*/
		$scope.editStory = function() {
			var obj = { storyId: $scope.stories[$scope.curStoryIndex]._id,
									title: $scope.stories[$scope.curStoryIndex].title,
									description: $scope.stories[$scope.curStoryIndex].description
								};
			var modalInstance = $modal.open({
				templateUrl: 'views/story-edit.html',
				controller: 'StoryEditCtrl',
				resolve: {
					obj: function() {
							return obj;
						},
					destinationUrl: function() {
						return 'services/stories/update';
						}
				}
			});
			modalInstance.result.then(function(result) {
        if (result.err) $scope.notify('error', result.msg);
				else {
					$scope.stories[$scope.curStoryIndex].title = obj.title;
					$scope.stories[$scope.curStoryIndex].description = obj.description;
					$scope.notify('success', result.msg);
				}
			});
		};

		/**
		* edit character 
		*/
		$scope.editCharacter = function(i) {
			var character = {
				storyId: $scope.stories[$scope.curStoryIndex]._id, 
				characterId: $scope.stories[$scope.curStoryIndex].characters[i]._id,
				name: $scope.stories[$scope.curStoryIndex].characters[i].name, 
				description: $scope.stories[$scope.curStoryIndex].characters[i].description
			};
			var modalInstance = $modal.open({
				templateUrl: 'views/character-edit.html',
				controller: 'StoryEditCtrl',
				resolve: {
					obj: function() {
						return character;
						},
					destinationUrl: function() {
						return 'services/stories/updateCharacter';
						}
				}
			});
			modalInstance.result.then(function(result) {
        if (result.err) $scope.notify('error', result.msg);
				else {
					$scope.stories[$scope.curStoryIndex].characters[i].name = character.name;
					$scope.stories[$scope.curStoryIndex].characters[i].description = character.description;
					$scope.notify('success', result.msg);
				}
			});
		};

		/**
		* Add a new character
		*/
		$scope.createCharacter = function() {
			var character = {storyId: $scope.stories[$scope.curStoryIndex]._id, 
											name: '', 
											description: ''
											};
			var modalInstance = $modal.open({
				templateUrl: 'views/character-edit.html',
				controller: 'StoryEditCtrl',
				resolve: {
					obj: function() {
						return character;
						},
					destinationUrl: function() {
						return 'services/stories/addCharacter';
						}
				}
			});
			modalInstance.result.then(function(result) {
        if (result.err) $scope.notify('error', result.msg);
				else {
					$scope.notify('success', result.msg);
					$scope.stories[$scope.curStoryIndex].characters.push(result.character);
				}
				});
		};

		/**
		* delete character
		*/
		$scope.deleteCharacter = function(i) {
			$http.post('services/stories/deleteCharacter', 
				{storyId: $scope.stories[$scope.curStoryIndex]._id, characterId: $scope.stories[$scope.curStoryIndex].characters[i]._id} )
				.success(function(result) {
					if (result.err) $scope.notify('error', result.msg);
					else {
						$scope.stories[$scope.curStoryIndex].characters.splice(i, 1);
						$scope.notify('success', result.msg);
					}
				}).error(function() {
					$scope.notify('error', "Server error");
				});
		};
		
		/**
		* Add a new reference
		*/
		$scope.createReference = function() {
			var modalInstance = $modal.open({
				templateUrl: 'views/reference-edit.html',
				controller: 'StoryEditCtrl',
				resolve: {
					obj: function() {
						return {storyId: $scope.stories[$scope.curStoryIndex]._id, reference: ''};
						},
					destinationUrl: function() {
						return 'services/stories/addReference';
						}
				}
			});
			modalInstance.result.then(function(result) {
        if (result.err) $scope.notify('error', result.msg);
				else {
					$scope.notify('success', result.msg);
					$scope.stories[$scope.curStoryIndex].references.push(result.reference);
				}
				});
		};

		/**
		* edit reference
		*/
		$scope.editReference = function(i) {
			var obj = {
				storyId: $scope.stories[$scope.curStoryIndex]._id,
				index: i,
				reference: $scope.stories[$scope.curStoryIndex].references[i]
			};
			var modalInstance = $modal.open({
				templateUrl: 'views/reference-edit.html',
				controller: 'StoryEditCtrl',
				resolve: {
					obj: function() {
						return obj;
						},
					destinationUrl: function() {
						return 'services/stories/updateReference';
						}
				}
			});
			modalInstance.result.then(function(result) {
        if (result.err) $scope.notify('error', result.msg);
				else {
					$scope.stories[$scope.curStoryIndex].references[i] = obj.reference;
					$scope.notify('success', result.msg);
				}
			});
		};

		/**
		* delete reference 
		*/
		$scope.deleteReference = function(i) {
			$http.post('services/stories/deleteReference', {storyId: $scope.stories[$scope.curStoryIndex]._id, index: i} )
				.success(function(result) {
					if (result.err) $scope.notify('error', result.msg);
					else {
						$scope.stories[$scope.curStoryIndex].references.splice(i, 1);
						$scope.notify('success', result.msg);
					}
				}).error(function() {
					$scope.notify('error', "Server error");
				});
		};
		
		$scope.init();
	}
]);

/**
* Controller for story, character and reference edit
*/
storyControllers.controller('StoryEditCtrl', 
	['$scope', '$http', '$modalInstance', 'obj', 'destinationUrl',
	function($scope, $http, $modalInstance, obj, destinationUrl) {
		$scope.obj = obj;		
		console.log(obj);
		$scope.master = angular.copy($scope.obj);
		$scope.forms = {basicForm: null};
		
		$scope.save = function() { 
			//save in database
			$http.post(destinationUrl, {obj: $scope.obj})
				.success(function(result) {
					$modalInstance.close(result);
				})
				.error(function(data, status) {
					$modalInstance.close({err: true, msg: 'Server error'});
				});
		
		};
		
		$scope.reset = function() {
			$scope.obj = angular.copy($scope.master);
			if ($scope.forms.basicForm != null) $scope.forms.basicForm.$setPristine();
		};
		
		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);



