angular.module('characters', [])
    .controller('CharactersController', function($scope, $rootScope, $location) {
    'use strict';

    $scope.selectCharacter = function(character) {
        $rootScope.player.character = character;
        $location.path('/lobby');
    };

});