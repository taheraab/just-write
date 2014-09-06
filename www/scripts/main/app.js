'use strict';
//Main app

var mainApp = angular.module('mainApp', ['ngRoute', 
	'mainControllers', 
	'mainServices',
	'storyControllers',
	'chapterControllers',
	'chapterDirectives',
  'ngAnimate', 
	'ui.bootstrap', 
	'app.directives', 
	'app.localization', 
	'app.ui.services', 
	'textAngular',
	'ui.sortable'
]);

mainApp.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }
]);

mainApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
					when('/user-profile', {
						templateUrl: '/views/user-profile.html',
						controller: 'UserProfileCtrl'
					}).
					when('/stories', {
						templateUrl: 'views/story-list.html',
						controller: 'StoryListCtrl'
					}).
					when('/chapters/:storyId/:storyTitle', {
						templateUrl: 'views/chapter-list.html',
						controller: 'ChapterListCtrl'
					}).
					otherwise({
							redirectTo: '/stories'
					});
    }
]);

/*
* Register Custom annotation tool for textAngular
*/
mainApp.config(['$provide',
	function($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
			// $delegate is the taOptions we are decorating
			// register the tool with textAngular
			taRegisterTool('insertNote', {
				tooltiptext: 'Add Note',
				buttontext: 'Note',
				iconclass: "fa fa-comment",
				action: function(){
						var editorParentScope = this.$editor().$parent;
						var thisRef = this;
						editorParentScope.createNote(function(url) {
							if (url != null) {
								var elm = '<a href="' + url 
									+ '" value="jw-note" class="btn btn-xs btn-success" target="notes">Note</a>';
								return thisRef.$editor().wrapSelection('insertHTML', elm, true);
							}
						});
					},		
				onElementSelect: {
					element: 'a',
					onlyWithAttrs: ['value'],
					action: function(event, $element, editorScope) {
						if ($element.attr('value') == 'jw-note') {
							var arr = /note.html\?chapterId=[0-9a-f]+&id=([0-9a-f]+)/.exec($element.attr('href'));
							var noteId = (arr != null && typeof arr[1] != 'undefined')? arr[1] : '';
							editorScope.$parent.getNote(noteId, function(chapter) {
								if (chapter != null) {
									event.preventDefault();
									editorScope.displayElements.popover.css('width', '435px');
									var container = editorScope.displayElements.popoverContainer;
									container.empty();
									container.css('line-height', '28px');
									var title = angular.element('<span>' + chapter.note.title + '</span>');
									title.css({
										'display': 'inline-block',
										'max-width': '200px',
										'overflow': 'hidden',
										'text-overflow': 'ellipsis',
										'white-space': 'nowrap',
										'vertical-align': 'middle'
									});
									container.append(title);
									var link = angular.element('<a href="' + $element.attr('href') + '" target="notes" class="btn btn-default btn-sm" unselectable="on"><i class="fa fa-edit"></i></a>');
									var buttonGroup = angular.element('<div class="btn-group pull-right">');
									var delButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" tabindex="-1" unselectable="on"><i class="fa fa-trash-o"></i></button>');
									
									delButton.on('click', function(event){
										event.preventDefault();
										editorScope.$parent.deleteNote(noteId, function(result) {
											if (!result.err) {
												$element.replaceWith('');
												editorScope.updateTaBindtaTextElement();
											}	
											editorScope.hidePopover();
										});
									});
									
									buttonGroup.append(link);
									buttonGroup.append(delButton);
									container.append(buttonGroup);
									editorScope.showPopover($element);																	
								}
								
							});
							
						}
					}
				}
			});
			// add the button to the default toolbar definition
			taOptions.toolbar.push(['insertNote']);
			return taOptions;
    }]);	
	}
]);

