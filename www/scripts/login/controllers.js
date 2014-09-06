'use strict';

var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('MainCtrl', ['$scope', 'logger', 
	function($scope, logger) {
		$scope.brand = "Just Write";
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
	}
]);

loginControllers.controller('SigninCtrl', ['$scope', '$http', '$window', 
	function($scope, $http, $window) {
		$scope.signin = function() {
			$http.post("/services/login/signin", $scope.user).
			success(function() {
				$window.location.href = "/main.html";
			}).
			error(function(data, status) {
				$scope.notify('error', data);
			});
		};
	}
]);

loginControllers.controller('SignupCtrl', ['$scope', '$http',
	function($scope, $http) {
		$scope.signup = function() {
			$http.post("/services/login/signup", $scope.user).
			success(function(result) {
				if (result.err) 
					$scope.notify('error', result.msg);
				else 
					$scope.notify('success', 'User created successfully, Please login to continue'); 
			})
		}
	}
]);

loginControllers.controller('ForgotPasswordCtrl', ['$scope', 
	function($scope) {
		$scope.sendPassword = function() {
		
		}
	}
]);
