'use strict';

var mainControllers = angular.module('mainControllers', []);

mainControllers.controller('MainCtrl', ['$scope', 'LoggedInUser', 'logger',
	function($scope, LoggedInUser, logger) {
		$scope.brand = "Just Write";
		//sets the loggedInUser information in main scope
		LoggedInUser.get(function(data) {
			$scope.loggedInUser = data;
		});
		
		//method to report status messages on a page
		$scope.notify = function(type, message) {
			switch (type) {
				case 'info':
					return logger.log(message);
				case 'success':
					return logger.logSuccess(message);
				case 'warning':
					return logger.logWarning(message);
				case 'error':
					return logger.logError(message);
			}
		};
		
		//sets global status data
		$scope.statusData = [
				{name: 'All', value: '0'},
				{name: 'Active', value: '1'},
				{name: 'Inactive', value: '2'},
			];
		//global status list for lookup based on statusid
		$scope.statusList = ['All', 'Active', 'Inactive'];

	}
]);


mainControllers.controller('HeaderCtrl', ['$scope', '$http', '$window',
	function($scope, $http, $window) {
		$scope.signout = function() {
			$http.get('/signout').
				success(function() {
					$window.location.href = '/login.html';
				});
		}
	}
]);

/*
* Controller for user profile page
*/
mainControllers.controller('UserProfileCtrl', ['$scope', '$http', '$modal',
	function($scope, $http, $modal) {
		$scope.init = function() {
			$http.get('/services/users/getProfile')
				.success(function(user) {
					$scope.user = user;
				});
		};
		
		$scope.edit = function() {
			var modalInstance = $modal.open({
				templateUrl: 'views/user-profile-edit.html',
				controller: 'UserProfileEditCtrl',
				backdrop: 'static',
				resolve: {
					user: function() {
						return $scope.user;
						}
				}
			});
			
			modalInstance.result.then(function(result) {
        if (result.err) $scope.notify('error', result.msg);
				else $scope.notify('success', result.msg);
				$scope.init();
       }, function() {
				$scope.init();
			 });

		};
			
		$scope.init();
	}
]);

/**
* Controller for user profile edit page
*/
mainControllers.controller('UserProfileEditCtrl', 
	['$scope', '$http', '$modalInstance', 'user',
	function($scope, $http, $modalInstance, user) {
		$scope.user = user;		
		$scope.user.changePassword = false;
		$scope.master = angular.copy($scope.user);
		$scope.forms = {basicForm: null, passwordForm: 	null};
		
		$scope.save = function() { 
			//save in database
			$http.post('/services/users/updateProfile', {user: $scope.user})
				.success(function(result) {
					$modalInstance.close(result);
				})
				.error(function(data, status) {
					$modalInstance.close({err: true, msg: 'Server error'});
				});
		
		};
		
		$scope.canSave = function() {
			var result = false;
			if ($scope.forms.basicForm != null) {
				 result = $scope.forms.basicForm.$valid;
			}
			if ($scope.user.changePassword && $scope.forms.passwordForm != null) {
				result = result && $scope.forms.passwordForm.$valid;
			}
			return result;
		}
	
		$scope.reset = function() {
			$scope.user = angular.copy($scope.master);
			if ($scope.forms.basicForm != null) $scope.forms.basicForm.$setPristine();
			if ($scope.forms.passwordForm != null) $scope.forms.passwordForm.$setPristine();
		};
		
		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);

mainControllers.controller('DashboardCtrl', ['$scope',
	function($scope) {
	
	}
]);

/*
* Controller for confirmation dialog
*/
mainControllers.controller('ConfirmDialogCtrl', ['$scope', '$modalInstance', 'msg', 
	function($scope, $modalInstance, msg) {
		$scope.msg = msg;
		$scope.ok = function() {
			$modalInstance.close(true);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

	}
]);



