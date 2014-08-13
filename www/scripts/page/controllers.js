'use strict';

var pageControllers = angular.module('pageControllers', []);

/*
* Controller for my stories page
*/
pageControllers.controller('PageListCtrl', ['$scope', '$http', 
	function($scope, $http) {
		$scope.curPageIndex = 0;	
		$scope.storyTitle = "Story 1"
		$scope.collapseMenu = false;
		$scope.activePages = [];
		
		$scope.pages = [
			{title: 'Page 1 fjhgjfgjdfjgjdfg', content: 'Page 1 content', active: true},
			{title: 'Page 2', content: 'Page 2 content', active: true}
			];
			
		$scope.activePages.push($scope.pages[0]);
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
		* Update active pages
		*/
		$scope.updateActivePages = function(i) {
			var index = $scope.activePages.indexOf($scope.pages[i]);
			if (index == -1) {
				$scope.activePages.push($scope.pages[i]);
			}else $scope.activePages[index].active = true;
			$scope.curPageIndex = i;
		}

		/*
		* Set curPageIndex when a tab is selected
		*/
		$scope.setCurPageIndex = function(i) {
			$scope.curPageIndex = $scope.pages.indexOf($scope.activePages[i]);
		}
		
		/*
		* Set collapseMenu
		*/
		$scope.toggleCollapseMenu = function(i) {
			$scope.collapseMenu = !$scope.collapseMenu;
		}
		
		
	}
]);

/**
* Controller for each page tab
*/
pageControllers.controller('PageCtrl', ['$scope', '$http',
	function($scope, $http) {
		$scope.editing = true;
		$scope.closePage = function() {
			console.log("here");
		};
	}
]);

/**
* Controller for story, character and reference edit

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

*/

