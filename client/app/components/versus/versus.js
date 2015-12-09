angular.module('versus', [])
    .controller('VersusController', function($scope, $rootScope, $location) {
    'use strict';
    
    if ($rootScope.socket) {
        $rootScope.socket.on('match update', function(match) {
            $rootScope.match = match;
            $scope.$apply();
        });
        
        $scope.gameResults = function() {
            if (!$rootScope.match.inProgress) {
                if ($rootScope.match.winner.name === $rootScope.player.name) {
                    return 'You won!';
                } else if ($rootScope.match.loser.name === $rootScope.player.name) {
                    return 'You lost!';
                }
            }
        };
    } else {
        // mock match to test gameplay
        $rootScope.player = {
            id: 1,
            name: 'Jekyll',
            health: 100
        };
        $rootScope.match = {
            id: 'test',
            inProgress: true,
            p1: $rootScope.player,
            p2: {
                name: 'Hyde',
                health: 100
            }
        }
    }
        
    $scope.toLobby = function() {
        $location.path('/lobby');
    };
    
    var Key = {
        _pressed: [],
    
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        ENTER: 13,
        SPACE: 32,
        
        clearBuffer: function() {
            this._pressed = [];
        },
    
        isDown: function(keyCode) {
            return this._pressed[keyCode];
        },
    
        onKeyDown: function(event) {
            this._pressed[event.keyCode] = true;
            //console.log( String.fromCharCode( event.keyCode ) + " ("+event.keyCode+") pressed!" );
        },
        
        onKeyUp: function(event) {
            this._pressed[event.keyCode] = false;
        }
    };
    window.addEventListener('keydown', function() {
        Key.onKeyDown(event);
    }, false);
    window.addEventListener('keyup', function() {
        Key.onKeyUp(event);
    }, false);
    
    var allowedToAttack = true;
    var score = 0;
    var recoil = 0;
    var recoilRate = 40;
    var recoilRecoveryRate = recoilRate / 150;
    
    var stage = new createjs.Stage('vsCanvas');
    stage.width = document.getElementById('vsCanvas').clientWidth;
    stage.height = document.getElementById('vsCanvas').clientHeight;
    
    var pendulumBox = new createjs.Shape();
    pendulumBox.width = stage.width;
    pendulumBox.height = 100;
    pendulumBox.y = stage.height - pendulumBox.height;
    pendulumBox.graphics.beginFill('rgba(0,0,0,0.5)').drawRect(0, 0, pendulumBox.width, pendulumBox.height);
    
    var pendulum = new createjs.Shape();
    pendulum.width = 5;
    pendulum.height = pendulumBox.height;
    pendulum.direction = 1;
    pendulum.baseSpeed = 5;
    pendulum.speed = pendulum.baseSpeed;
    pendulum.y = stage.height - pendulum.height;
    pendulum.graphics.beginFill('rgba(0,180,255,1)').drawRect(0, 0, pendulum.width, pendulum.height);
    
    var pendulumShadow = new createjs.Shape();
    pendulumShadow.width = pendulum.width;
    pendulumShadow.height = pendulum.height;
    pendulumShadow.y = pendulum.y;
    pendulumShadow.alpha = 0;
    pendulumShadow.graphics.beginFill('rgba(0,100,200,1)').drawRect(0, 0, pendulumShadow.width, pendulumShadow.height);
    
    var target = new createjs.Shape();
    target.baseWidth = 100;
    target.minWidth = 10;
    target.width = target.baseWidth;
    target.height = pendulumBox.height;
    target.x = stage.width / 2 - target.width / 2;
    target.y = stage.height - target.height;
    target.graphics.beginFill('rgba(225,0,0,0.4)').drawRect(0, 0, target.width, target.height);
    
    var scoreText = new createjs.Text('Score: ' + score);
    scoreText.x = 20;
    scoreText.y = 20;
    
    stage.addChild(pendulumBox);
    stage.addChild(target);
    stage.addChild(pendulum);
    stage.addChild(pendulumShadow);
    stage.addChild(scoreText);
    stage.update();
    
    function tick() {
        // attack
        if (allowedToAttack && Key.isDown(Key.SPACE)) {
            pendulumShadow.x = pendulum.x;
            pendulumShadow.alpha = 0.5;
            var hitValue = (pendulum.x + pendulum.width / 2) - target.x;
            if (hitValue < 0 || hitValue > target.graphics.command.w) {
                hitValue = 0;
            }
            if (hitValue > (target.graphics.command.w / 2)) {
                hitValue = (target.graphics.command.w / 2) - (hitValue - (target.graphics.command.w / 2));
            }
            // hit!
            if (hitValue > 0) {
                hitValue = (hitValue + 100) / 10;
                var data = {
                    'matchId': $rootScope.match.id,
                    'playerId': $rootScope.player.id,
                    'damage': Math.floor(hitValue)
                };
                if ($rootScope.socket) {
                    $rootScope.socket.emit('attack', data);
                }
                recoil += recoilRate;
            }
            allowedToAttack = false;
        }
        
        // fade pendulum shadow
        if (pendulumShadow.alpha > 0) {
            pendulumShadow.alpha -= 0.01;
        }
        
        // set pendulum speed based on recoil
        pendulum.speed = pendulum.baseSpeed + (recoil / 10);
        
        // move pendulum
        pendulum.x += (pendulum.speed * pendulum.direction);
        
        // it pendulum hits a wall reverse it and reset attack
        if (pendulum.x <= 0 || (pendulum.x + pendulum.width) >= stage.width) {
            pendulum.direction *= -1;
            allowedToAttack = true;
        }
        
        // recover recoil
        if (recoil > 0) {
            recoil -= recoilRecoveryRate;
        }
        
        // set target width based on recoil
        target.graphics.command.w += (target.baseWidth - target.graphics.command.w - recoil) / 2;
        
        // min/max
        if (target.graphics.command.w < target.minWidth) {
            target.graphics.command.w = target.minWidth;
            recoil = target.width - target.minWidth;
        }
        if (target.graphics.command.w > target.baseWidth) {
            target.graphics.command.w = target.baseWidth;
        }
        
        // center target
        target.x = stage.width / 2 - target.graphics.command.w / 2;
        
        stage.update();
    }
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", tick);
});