'use strict';

var pageControllers = angular.module('pageControllers', []);

/*
* Controller for my stories page
*/
pageControllers.controller('PageListCtrl', ['$scope', '$http', 'NavGuard', 'ConfirmDialog', '$modal',
	function($scope, $http, NavGuard, ConfirmDialog, $modal) {
		$scope.curPageIndex = 0;	
		$scope.storyTitle = "Story 1";
		$scope.collapseMenu = false;
		$scope.activePages = [];
		var storyId = 1;
		
		$scope.labels = [ 
			{name: 'default'},
			{name: 'xyz'},
			{name: 'abc'},
		];
		
		$scope.curLabel = $scope.labels[0];
		var prevLabel = $scope.curLabel;
		
		$scope.pages = [
			{title: 'Page 1 fjhgjfgjdfjgjdfg', content: 'Page 1 content', active: true},
			{title: 'Page 2', content: 'Page 2 content', active: true}
			];
			
		$scope.activePages.push($scope.pages[0]);
		
		/**
		* Get the list of labels and pages for this story
		*/
		$scope.init = function() {
			//get labels
			$http.post('/services/pages/getLabels', {storyId: storyId})
				.success(function(labels) {
					$scope.labels = labels;
					$scope.curLabel = labels[0];
					//get pages for current label
					$scope.getPages();
				});
			
		};
		
		/*
		* Load pages for current label
		*/
		$scope.getPages = function() {
			$http.post('/services/pages', {labelId: $scope.curLabel._id})
				.success(function(pages) {
					$scope.pages = pages;			
					$scope.activePages = [];
					$scope.curPageIndex = 0;
				});		
		};
		
		/*
		* Create new label
		*/
		
		$scope.createLabel = function () {
			// Add label
			var modalInstance = $modal.open({
				templateUrl: 'views/label-edit.html',
				controller: 'LabelEditCtrl',
				backdrop: 'static',
				resolve: {
					label: function() {
						return {name: '', storyId: storyId};
					},
					destinationUrl: function() {
						return 'services/stories/addLabel';
					}
				}
			});

			function makeLabelCurrent() {
				$scope.curLabel = $scope.labels[$scope.labels.length - 1];
				$scope.pages = [];
				$scope.activePages = [];
				$scope.curPageIndex = 0;			
			}
			
			modalInstance.result.then(function(result) {
				if (result.err) $scope.notify('error', result.msg);
				else {
						$scope.labels.push(result.label);
						$scope.notify('success', result.msg);
						if (NavGuard.isEditing()) {
							ConfirmDialog.show('You have unsaved changes. Do you want to change labels?', function(result) {
								if (result) {
									NavGuard.reset();
									makeLabelCurrent();
								}
							});
						}else makeLabelCurrent();
					}
			});		
			
		};
		
		/*
		* Edit label
		*/
		
		$scope.editLabel = function () {
			var obj = {id: $scope.curLabel._id,
				name: $scope.curLabel.name
			}
			var created = false;
			// Add or Edit label
			var modalInstance = $modal.open({
				templateUrl: 'views/label-edit.html',
				controller: 'LabelEditCtrl',
				backdrop: 'static',
				resolve: {
					label: function() {
						return obj;
						},
					destinationUrl: function() {
						return 'services/stories/updateLabel';
					}
				}
			});
		
			modalInstance.result.then(function(result) {
				if (result.err) $scope.notify('error', result.msg);
				else {
					$scope.curLabel.name = obj.name;
					$scope.notify('success', result.msg);
				}
			});			
		};

		/*
		* Delete label
		*/
		$scope.deleteLabel = function() {
			ConfirmDialog.show("Confirm label delete. Pages for this label will move to 'default' label", function(result) {
				if (result) {
					
				}
			});
		}
		
		/*
		* Set prevLabel value
		*/
		$scope.$watch('curLabel', function(newVal, oldVal) {
			prevLabel = oldVal;
		});
		
		/*
		* Re-initilaize view when current label changes
		*/
		$scope.reInit = function() {
			if (NavGuard.isEditing()) {
				ConfirmDialog.show('You have unsaved changes. Do you want to change labels?', function(result) {
					if (result) {
						NavGuard.reset();
						$scope.getPages();
					}else {
						//revert to prev value
						$scope.curLabel = prevLabel;
					}
				});
			}else $scope.getPages();		
		}
		
		/*
		* Create a new Page
		*/
		$scope.createPage = function() {
			var page = {
				title: 'Untitled',
				content: '',
				isNew: true,
				active: true
			};
			$scope.pages.push(page);
			$scope.updateActivePages($scope.pages.length - 1);
		}
				
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
		
		/*
		* Called when a page is closed
		*/
		$scope.parentClosePage = function(i) {
			if (typeof $scope.activePages[i].isNew != 'undefined' && $scope.activePages[i].isNew)
				$scope.pages.splice($scope.curPageIndex, 1);
			$scope.activePages.splice(i, 1);
		}
		
	}
]);

/**
* Controller for each page tab
*/
pageControllers.controller('PageCtrl', ['$scope', '$http', '$window', 'NavGuard', 'ConfirmDialog',
	function($scope, $http, $window, NavGuard, ConfirmDialog) {
		$scope.editing = false;
		if (typeof $scope.page.isNew != 'undefined' && $scope.page.isNew) 
			$scope.editing = true;
		$scope.forms = {basicForm: null};
		
		$scope.master = angular.copy($scope.page);
		
		/*
		* Called when a page is closed
		*/
		$scope.close = function(i) {
			if ($scope.activePages.length != 1) {
				if ($scope.forms.basicForm != null && $scope.forms.basicForm.$dirty) {
					ConfirmDialog.show('You have unsaved changes. Do you want to close?', function(result) {
						if (result) {
							NavGuard.setEditing(false);
							$scope.reset();
							$scope.parentClosePage(i);
						}
					});
				}else {
					NavGuard.setEditing(false);
					$scope.parentClosePage(i);
				}				
			}
		};
		
		/*
		* Save Page in db
		*/
		$scope.save = function() {
			if ($scope.forms.basicForm != null && $scope.forms.basicForm.$dirty) {
				console.log("In save");
			}
		}
		
		/*
		* Reset page state
		*/
		$scope.reset = function() {
			$scope.page = angular.copy($scope.master);
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
		* Delete page in db
		*/
		$scope.deletePage = function() {
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


/*
* Controller for editing label
*/
pageControllers.controller('LabelEditCtrl', ['$scope', '$modalInstance', 'label', 'destinationUrl',
	function($scope, $modalInstance, label, destinationUrl) {
		$scope.label = label;
		$scope.master = angular.copy($scope.label);
		$scope.forms = {basicForm: null};
		
		$scope.save = function() { 
			//save in database
			$http.post(destinationUrl, {label: $scope.label})
				.success(function(result) {
					$modalInstance.close(result);
				})
				.error(function(data, status) {
					$modalInstance.close({err: true, msg: 'Server error'});
				});
		
		};
		
	
		$scope.reset = function() {
			$scope.label = angular.copy($scope.master);
			if ($scope.forms.basicForm != null) $scope.forms.basicForm.$setPristine();
		};
		
		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

	}
]);
