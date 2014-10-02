'use strict';

var previewControllers = angular.module('previewControllers', []);

previewControllers.controller('PreviewCtrl', ['$scope', '$location', '$http', 'LoggedInUser',
	function($scope, $location, $http, LoggedInUser) {
		$scope.story = null;
		/* 
		* Get content for this chapter
		*/
		function getContent(i){
			$http.post('/services/chapters/getPrintableContent', {id:$scope.chapters[i]._id}) 
				.success(function(result) {
					$scope.chapters[i].content = result;
				})
		};
		
		$scope.init = function() {
			var arr = /preview.html\?storyId=([0-9a-f]+)/.exec($location.absUrl());
			var storyId = (arr != null && typeof arr[1] != 'undefined')? arr[1] : '';
			if (storyId != '') {
				$http.post('services/stories/getFullStory', {storyId: storyId})
					.success(function(result) {
						console.log(result);
						$scope.story = result.story;
						$scope.chapters = result.chapters;
						for (var i = 0; i < $scope.chapters.length; i++) 
							getContent(i);
					});
			}
			LoggedInUser.get(function(user) {
				$scope.author = user.name;
			});
		};
		$scope.init();
		
	}
]);

