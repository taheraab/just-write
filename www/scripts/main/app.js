'use strict';
//Main app

var mainApp = angular.module('mainApp', ['ngRoute', 
	'mainControllers', 
	'mainServices',
	'storyControllers',
	'pageControllers',
  'ngAnimate', 
	'ui.bootstrap', 
	'app.directives', 
	'app.localization', 
	'app.ui.services', 
	'textAngular'
]);

mainApp.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }
]);

mainApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
					when('/dashboard', {
						templateUrl: '/views/dashboard.html',
						controller: 'DashboardCtrl'
					}).
					when('/user-profile', {
						templateUrl: '/views/user-profile.html',
						controller: 'UserProfileCtrl'
					}).
					when('/stories', {
						templateUrl: 'views/story-list.html',
						controller: 'StoryListCtrl'
					}).
					when('/pages', {
						templateUrl: 'views/page-list.html',
						controller: 'PageListCtrl'
					}).
					otherwise({
							redirectTo: '/stories'
					});
    }
]);

