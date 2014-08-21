'use strict';

var pageControllers = angular.module('pageControllers', []);

/*
* Controller for my stories page
*/
pageControllers.controller('PageListCtrl', ['$scope', '$http', '$routeParams', 'NavGuard', 'ConfirmDialog', '$modal',
	function($scope, $http, $routeParams, NavGuard, ConfirmDialog, $modal) {
		$scope.curPageIndex = 0;	
		$scope.collapseMenu = false;
		$scope.activePages = [];
		var storyId = $routeParams.storyId;
		var prevLabel;
				
		/**
		* Get the list of labels and pages for this story
		*/
		$scope.init = function() {
			//get labels
			$http.post('/services/stories/getLabels', {storyId: storyId})
				.success(function(story) {
					$scope.storyTitle = story.title;
					$scope.labels = story.labels;
					$scope.curLabel = $scope.labels[0];
					prevLabel = $scope.curLabel;
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
					if (!$scope.pages.length) $scope.createPage(); 
					else {
						$scope.activePages.push($scope.pages[0]);
						$scope.activePages[0].active = true;
						$scope.curPageIndex = 0;
					}
					
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

			
			modalInstance.result.then(function(result) {
				if (result.err) $scope.notify('error', result.msg);
				else {
						$scope.labels.push(result.label);
						$scope.notify('success', result.msg);
						if (NavGuard.isEditing()) {
							ConfirmDialog.show('You have unsaved changes. Do you want to change labels?', function(result) {
								if (result) {
									NavGuard.reset();
									$scope.curLabel = $scope.labels[$scope.labels.length - 1];
									$scope.reInit();
								}
							});
						}else {
							$scope.curLabel = $scope.labels[$scope.labels.length - 1];
							$scope.reInit();
						}
					}
			});		
			
		};
		
		/*
		* Edit label
		*/
		
		$scope.editLabel = function () {
			var obj = {
				storyId: storyId,
				labelId: $scope.curLabel._id,
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
			function deleteLabel() {
				$http.post('services/stories/deleteLabel', {storyId: storyId, labelId: $scope.curLabel._id})
					.success(function(result) {
						if (result.err) $scope.notify('error', result.msg);
						else {
							var index = $scope.labels.indexOf($scope.curLabel);
							var nextIndex = (index == ($scope.labels.length - 1)) ? 0 : index + 1;
							$scope.labels.splice(index, 1);
							$scope.curLabel = $scope.labels[nextIndex];
							$scope.reInit();
							$scope.notify('success', result.msg);
						}
					});
			}
			if (NavGuard.isEditing()) {
				ConfirmDialog.show('You have unsaved changes. Do you want to delete label?', function(result) {
					if (result) {
						NavGuard.reset();
						deleteLabel();
					}
				});
			} else {		
				ConfirmDialog.show("Confirm label delete. Pages for this label will move to 'default' label", function(result) {
					if (result) {
						deleteLabel();
					}
				});
			}
		};
		
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
				labelId: $scope.curLabel._id,
				isNew: true,
				active: true
			};
			$scope.pages.push(page);
			$scope.updateActivePages($scope.pages.length - 1);
		}
				
		/*
		* Update active pages, called when a page is selected from page list
		*/
		$scope.updateActivePages = function(i) {
			var index = $scope.activePages.indexOf($scope.pages[i]);
			if (index == -1) {
				$scope.activePages.push($scope.pages[i]);
				var index = $scope.activePages.length - 1;
			}
			$scope.activePages[index].active = true;
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
		
		//initialize scope
		$scope.init();
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
			var dest = ($scope.page.isNew)? 'services/pages/add' : 'services/pages/update'; 
			$http.post(dest, {page: $scope.page})
				.success(function(result) {
					if (result.err) $scope.notify('error', result.msg) 
					else {
						if ($scope.page.isNew) {
							delete $scope.page.isNew;
							$scope.page._id = result.page._id;							
						}
						$scope.page.title = result.page.title;
						$scope.page.labelId = result.page.labelId;
						$scope.page.content = result.page.content;
						$scope.page.contentUrl = result.page.contentUrl;						
						$scope.notify('success', result.msg);
						$scope.editing = false;
						$scope.master = angular.copy($scope.page);
					}
				}).error(function() {
					$scope.notify('error', 'Server error');
				});
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
pageControllers.controller('LabelEditCtrl', ['$scope', '$http', '$modalInstance', 'label', 'destinationUrl',
	function($scope, $http, $modalInstance, label, destinationUrl) {
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
