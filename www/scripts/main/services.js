'use strict';

/* Services */
var mainServices = angular.module('mainServices', []);

/*
* Service to retrieve logged in user information
*/
mainServices.service('LoggedInUser', ['$http',
	function($http) {
		this.user = null;
		this.get = function(callback) {
				var thisRef = this;
				if (this.user) return callback(this.user);
				else $http.get('/getLoggedInUser').
				success(function(data) {
					thisRef.user = data;
					callback(thisRef.user);
				}).
				error(function() {
					thisRef.user = null;
					callback(thisRef.user);
				});
			}
	}
]);

/*
* Check if 401 is returned from server and redirect user to login page
*/
mainServices.factory('authInterceptor', ['$q', '$window', 
	function ($q, $window) {
		return {
			responseError: function (rejection) {
				//console.log('In interceptor ' + rejection.status);
				if (rejection.status === 401) {
					// handle the case where the user is not authenticated
					$window.location.href = '/login.html';
				}
				return $q.reject(rejection);
			}
		};
}]);

/*
* Service that shows a confirm dialog
*/
mainServices.service('ConfirmDialog', ['$modal',
	function($modal) {
		this.show = function(msg, done) {
			var result = false;
			var modalInstance = $modal.open({
				templateUrl: 'views/confirm-dialog.html',
				controller: 'ConfirmDialogCtrl',
				backdrop: 'static',
				resolve: {
					msg: function() {
						return msg;
						}
				}
			});
			modalInstance.result.then(function() {
					done(true);
				}, function() {
					done(false);
				}
			);
		};
	
	}
]);

/*
* Service to guard user from leaving the page while it is in edit mode
*/
mainServices.service('NavGuard', ['$window', '$rootScope',
	function($window, $rootScope) {
		var editCount = 0;
		
		/*
		* Set editing flag to true or false
		*/
		this.setEditing = function(value) {
			if (value) editCount++; 
			else {
				if (editCount > 0)
				editCount--;
			}
			//console.log(editCount);
		}
		
		this.reset = function() {
			editCount = 0;
		}
		
		this.isEditing = function() {
			return editCount > 0;
		}
		
		$window.onbeforeunload = function() {
			if (editCount > 0)
				return "You have unsaved changes. Do you really want to leave?";
		}
		
		$rootScope.$on('$locationChangeStart', function(event) {
			if (editCount > 0) {
				if (!$window.confirm("You have unsaved changes. Do you really want to leave?")) 
					event.preventDefault();
				else editCount = 0;
			}
		});
	}
]);

