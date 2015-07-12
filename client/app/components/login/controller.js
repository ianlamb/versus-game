angular.module('loginController', [])
    .controller('LoginController', function($scope, $rootScope, $location) {
    'use strict';

    $scope.login = function() {
        $rootScope.vs = {};
        $rootScope.vs.username = $scope.username;
        $rootScope.socket = io();
        
        $rootScope.socket.on('connect', function() {
        	$rootScope.socket.emit('add user', $scope.username);
        });
        
        $rootScope.socket.on('login', function(data) {
        	$rootScope.vs.connected = true;
        	$rootScope.vs.character = data.character;
            $location.path('/characters');
        });
    };

});