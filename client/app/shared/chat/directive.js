angular.module('chat', [])
    .directive('chat', function() {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/shared/chat/view.html',
            controller: function($scope, $rootScope) {
                $scope.messages = [];
                
                $scope.sendMessage = function() {
                    if (!$scope.newMessage) {
                        return;
                    }
            		addMessage($rootScope.player.username + ': ' + $scope.newMessage);
            		$rootScope.socket.emit('new message', $scope.newMessage);
                    $scope.newMessage = '';
                }
                
                $rootScope.socket.on('user joined', function(data) {
        			addMessage('user joined: ' + data);
                    $scope.$apply();
        		});
        		
        		$rootScope.socket.on('user left', function(data) {
        			addMessage('user left: ' + data);
                    $scope.$apply();
        		});
        		
        		$rootScope.socket.on('new message', function(data) {
        			addMessage(data.user + ': ' + data.message);
                    $scope.$apply();
        		});
        	
            	function addMessage(msg) {
            		$scope.messages.push(msg);
            	}
            }
        };
    });