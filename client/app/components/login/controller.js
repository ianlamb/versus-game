angular.module('login', [])
    .controller('LoginController', function($scope, $rootScope, $location) {
    'use strict';

    $scope.login = function() {
        $rootScope.player = {};
        $rootScope.player.username = $scope.username;
        $rootScope.socket = io();
        
        $rootScope.socket.on('connect', function() {
        	$rootScope.socket.emit('add user', $scope.username);
        });
        
        $rootScope.socket.on('login', function(data) {
        	$rootScope.connected = true;
        	$rootScope.player.characters = data.characters;
            $location.path('/characters');
            $scope.$apply();
        });
    };

});