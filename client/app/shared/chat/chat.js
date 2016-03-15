angular.module('chat', [])
    .directive('chat', function() {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/shared/chat/chat.html',
            controller: function($scope, $rootScope) {
                $scope.messages = [];
                
                $scope.sendMessage = function() {
                    if (!$scope.newMessage) {
                        return;
                    }
                    $rootScope.socket.emit('new message', $scope.newMessage);
                    $scope.newMessage = '';
                };
                
                $rootScope.socket.on('player joined', function(player) {
                    addMessage('player joined: ' + player.name);
                    $scope.$apply();
                });
                
                $rootScope.socket.on('player left', function(player) {
                    addMessage('player left: ' + player.name);
                    $scope.$apply();
                });
                
                $rootScope.socket.on('new message', function(data) {
                    addMessage(data.player.name + ': ' + data.message);
                    $scope.$apply();
                });
            
                function addMessage(msg) {
                    $scope.messages.push(msg);
                }
            }
        };
    });