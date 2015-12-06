angular.module('lobby', [])
    .controller('LobbyController', function($scope, $rootScope, $location) {
    'use strict';
    
    $scope.findingMatch = false;

    $scope.findMatch = function() {
        $scope.findingMatch = true;
        $rootScope.socket.on('found match', function(data) {
            $rootScope.match = data;
            $location.path('/versus');
            $scope.$apply();
        });
        $rootScope.socket.emit('find match', $rootScope.player);
    };

});