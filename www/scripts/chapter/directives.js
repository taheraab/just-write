'use strict';

var chapterDirectives = angular.module('chapterDirectives', []);

chapterDirectives.directive('jwNote', function() {
	return {
		restrict: 'C',
		template: 'This is a note'
		};
});