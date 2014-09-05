'use strict';

/* Services */
var noteServices = angular.module('noteServices', []);


/*
* Check if 401 is returned from server and redirect user to login page
*/
noteServices.factory('noteAuthInterceptor', ['$q', '$window', 
	function ($q, $window) {
		return {
			responseError: function (rejection) {
				//console.log('In interceptor ' + rejection.status);
				if (rejection.status === 401) {
					// handle the case where the user is not authenticated
					$window.parent.location.href = '/login.html';
				}
				return $q.reject(rejection);
			}
		};
}]);


