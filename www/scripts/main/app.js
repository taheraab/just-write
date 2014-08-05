'use strict';
//Main app

var mainApp = angular.module('mainApp', ['ngRoute', 
	'mainControllers', 
	'mainServices',
	'storyControllers',
  'ngAnimate', 
	'ui.bootstrap', 
	'app.directives', 
	'app.localization', 
	'app.ui.services', 
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
                otherwise({
                    redirectTo: '/stories'
                });
    }
]);

