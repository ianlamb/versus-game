angular.module('versus', [])
    .controller('VersusController', function($scope, $rootScope, $location) {
    'use strict';
    
    if (!$rootScope.socket) {
        // mock match to test gameplay
        $rootScope.player = {
            id: 1,
            name: 'Jekyll',
            character: {
                health: 100
            }
        };
        $rootScope.match = {
            id: 'test',
            inProgress: true,
            p1: $rootScope.player,
            p2: {
                id: 2,
                name: 'Hyde',
                character: {
                    health: 100
                }
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
    var recoil = 0;
    var recoilRate = 40;
    var recoilRecoveryRate = recoilRate / 150;
    
    var stage = new createjs.Stage('vsCanvas');
    stage.width = document.getElementById('vsCanvas').clientWidth;
    stage.height = document.getElementById('vsCanvas').clientHeight;
    
    // pendulum
    var pendulumContainer = new createjs.Container();
    pendulumContainer.width = stage.width;
    pendulumContainer.height = 100;
    pendulumContainer.y = stage.height - pendulumContainer.height;
    
    var pendulum = new createjs.Shape();
    pendulum.width = 5;
    pendulum.height = pendulumContainer.height;
    pendulum.direction = 1;
    pendulum.baseSpeed = 5;
    pendulum.speed = pendulum.baseSpeed;
    pendulum.graphics.beginFill('rgba(0,180,255,1)').drawRect(0, 0, pendulum.width, pendulum.height);
    
    var pendulumShadow = new createjs.Shape();
    pendulumShadow.width = pendulum.width;
    pendulumShadow.height = pendulum.height;
    pendulumShadow.alpha = 0;
    pendulumShadow.graphics.beginFill('rgba(0,100,200,1)').drawRect(0, 0, pendulumShadow.width, pendulumShadow.height);
    
    var target = new createjs.Shape();
    target.baseWidth = 100;
    target.minWidth = 10;
    target.width = target.baseWidth;
    target.height = pendulumContainer.height;
    target.x = stage.width / 2 - target.width / 2;
    target.graphics.beginFill('rgba(225,0,0,0.4)').drawRect(0, 0, target.width, target.height);
    
    var pendulumBackground = new createjs.Shape();
    pendulumBackground.graphics.beginFill('rgba(0,0,0,0.5)').drawRect(0, 0, stage.width, 100);
    
    pendulumContainer.addChild(pendulumBackground, target, pendulumShadow, pendulum);
    
    // player 1
    var p1Name = new createjs.Text($rootScope.match.p1.name);
    p1Name.color = '#fff';
    
    var p1HealthContainer = new createjs.Shape();
    p1HealthContainer.width = 104;
    p1HealthContainer.height = 24;
    p1HealthContainer.y = 20;
    p1HealthContainer.graphics.beginFill('rgba(0,0,0,0.5)').drawRect(0, 0, p1HealthContainer.width, p1HealthContainer.height);
    
    var p1Health = new createjs.Shape();
    p1Health.height = 20;
    p1Health.x = 2;
    p1Health.y = 22;
    p1Health.graphics.beginFill('rgba(0,180,255,1)').drawRect(0, 0, $rootScope.match.p1.character.health, p1Health.height);
    
    var p1Container = new createjs.Container();
    p1Container.x = 20;
    p1Container.y = 20;
    p1Container.skewY = -3;
    p1Container.skewX = 10;
    p1Container.addChild(p1Name, p1HealthContainer, p1Health);
    
    // player 2
    var p2Name = new createjs.Text($rootScope.match.p2.name);
    p2Name.color = '#fff';
    
    var p2HealthContainer = new createjs.Shape();
    p2HealthContainer.width = 104;
    p2HealthContainer.height = 24;
    p2HealthContainer.y = 20;
    p2HealthContainer.graphics.beginFill('rgba(0,0,0,0.5)').drawRect(0, 0, p2HealthContainer.width, p2HealthContainer.height);
    
    var p2Health = new createjs.Shape();
    p2Health.height = 20;
    p2Health.x = 2;
    p2Health.y = 22;
    p2Health.graphics.beginFill('rgba(0,180,255,1)').drawRect(0, 0, $rootScope.match.p2.character.health, p2Health.height);
    
    var p2Container = new createjs.Container();
    p2Container.width = 110;
    p2Container.x = stage.width - p2Container.width - 20;
    p2Container.y = 20;
    p2Container.skewY = 3;
    p2Container.skewX = -10;
    p2Container.addChild(p2Name, p2HealthContainer, p2Health);
    
    stage.addChild(p1Container, p2Container, pendulumContainer);
    stage.update();
    
    if ($rootScope.socket) {
        $rootScope.socket.on('match update', function(match) {
            $rootScope.match = match;
            p1Health.graphics.command.w = $rootScope.match.p1.character.health;
            p2Health.graphics.command.w = $rootScope.match.p2.character.health;
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
    }
    
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
        
        // fade pendulum shadow
        if (pendulumShadow.alpha > 0) {
            pendulumShadow.alpha -= 0.01;
        }
        
        stage.update();
    }
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", tick);
});