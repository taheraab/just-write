'use strict';

var noteControllers = angular.module('noteControllers', []);

noteControllers.controller('NoteCtrl', ['$scope', '$location', 'logger', '$http',
	function($scope, $location, logger, $http) {
		$scope.forms = {basicForm: null};
		$scope.chapter = null;
		
		$scope.init = function() {
			var arr = /note.html\?chapterId=([0-9a-f]+)&id=([0-9a-f]+)/.exec($location.absUrl());
			var chapterId = (arr != null && typeof arr[1] != 'undefined')? arr[1] : '';
			var id = (arr != null && typeof arr[2] != 'undefined')? arr[2] : '';
			if (chapterId != '') {
				$http.post('services/chapters/getNote', {chapterId: chapterId, id: id})
					.success(function(chapter) {
							$scope.chapter = chapter;
					});
			}
		};
		
		$scope.save = function() { 
			//save in database
			$http.post('services/chapters/updateNote', {obj: $scope.chapter})
				.success(function(result) {
					if (result.err) logger.logError(result.msg);
					else logger.logSuccess(result.msg);
				})
				.error(function(data, status) {
					logger.logError('Server error');
				});
		
		};
		
		$scope.init();
		
	}
]);

