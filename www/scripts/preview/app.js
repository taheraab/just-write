'use strict';
var previewApp = angular.module('previewApp', [
	'mainServices',
	'previewControllers',
	'app.ui.services',
	'ngSanitize'

]);

previewApp.config(['$httpProvider', 
	function($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	}
]);

