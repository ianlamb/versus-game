angular.module('navbar', [])
    .directive('navbar', function() {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/shared/navbar/view.html',
            controller: function($scope) {
                
            }
        };
    });