angular.module('chat')
	.directive('chat', function() {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'chat-view.html',
            controller: function($scope) {
                
            }
        };
	});