'use strict';
//Note app

var noteApp = angular.module('noteApp', [
	'noteControllers', 
	'noteServices',
	'app.ui.services'
]);

noteApp.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('noteAuthInterceptor');
    }
]);


