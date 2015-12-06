angular.module('login', [])
    .controller('LoginController', function($scope, $rootScope, $location) {
    'use strict';

    $scope.login = function() {
        $rootScope.player = null;
        $rootScope.socket = io();
        
        $rootScope.socket.on('connect', function() {
            $rootScope.socket.emit('add player', $scope.username);
        });
        
        $rootScope.socket.on('login', function(data) {
            $rootScope.connected = true;
            $rootScope.player = data;
            $location.path('/characters');
            $scope.$apply();
        });
    };

});