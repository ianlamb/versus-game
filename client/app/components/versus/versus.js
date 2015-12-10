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
    pendulum.graphics.beginFill('rgba(0,180,255,1)').beginStroke('rgba(0,120,235,1)').drawRect(0, 0, pendulum.width, pendulum.height);
    
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
    var p1Container = new createjs.Container();
    p1Container.x = 20;
    p1Container.y = 20;
    p1Container.skewY = -3;
    p1Container.skewX = 10;
    
    var p1Name = new createjs.Text($rootScope.match.p1.name);
    p1Name.color = '#fff';
    p1Name.scaleX = p1Name.scaleY = 1.5;
    
    var p1HealthBackground = new createjs.Shape();
    p1HealthBackground.width = 104;
    p1HealthBackground.height = 24;
    p1HealthBackground.y = 20;
    p1HealthBackground.graphics.beginFill('rgba(0,0,0,0.5)').drawRect(0, 0, p1HealthBackground.width, p1HealthBackground.height);
    
    var p1HealthBar = new createjs.Shape();
    p1HealthBar.height = 20;
    p1HealthBar.x = 2;
    p1HealthBar.y = 22;
    p1HealthBar.graphics.beginFill('rgba(0,180,255,1)').drawRect(0, 0, $rootScope.match.p1.character.health, p1HealthBar.height);
    
    var p1HealthLabel = new createjs.Text();
    p1HealthLabel.text = $rootScope.match.p1.character.health + '%';
    p1HealthLabel.color = '#fff';
    p1HealthLabel.y = p1HealthBar.y + 3;
    p1HealthLabel.x = p1HealthBar.x + 5;
    
    p1Container.addChild(p1Name, p1HealthBackground, p1HealthBar, p1HealthLabel);
    
    // player 2
    var p2Container = new createjs.Container();
    p2Container.width = 110;
    p2Container.x = stage.width - p2Container.width - 20;
    p2Container.y = 20;
    p2Container.skewY = 3;
    p2Container.skewX = -10;
    
    var p2Name = new createjs.Text($rootScope.match.p2.name);
    p2Name.color = '#fff';
    p2Name.scaleX = p2Name.scaleY = 1.5;
    
    var p2HealthBackground = new createjs.Shape();
    p2HealthBackground.width = 104;
    p2HealthBackground.height = 24;
    p2HealthBackground.y = 20;
    p2HealthBackground.graphics.beginFill('rgba(0,0,0,0.5)').drawRect(0, 0, p2HealthBackground.width, p2HealthBackground.height);
    
    var p2HealthBar = new createjs.Shape();
    p2HealthBar.height = 20;
    p2HealthBar.x = 2;
    p2HealthBar.y = 22;
    p2HealthBar.graphics.beginFill('rgba(0,180,255,1)').drawRect(0, 0, $rootScope.match.p2.character.health, p2HealthBar.height);
    
    var p2HealthLabel = new createjs.Text();
    p2HealthLabel.text = $rootScope.match.p2.character.health + '%';
    p2HealthLabel.color = '#fff';
    p2HealthLabel.y = p2HealthBar.y + 3;
    p2HealthLabel.x = p2HealthBar.x + p2HealthBar.graphics.command.w - 30;
    
    p2Container.addChild(p2Name, p2HealthBackground, p2HealthBar, p2HealthLabel);
    
    // misc
    var attackLabel = new createjs.Text();
    attackLabel.y = stage.height - pendulumContainer.height - 30;
    attackLabel.color = '#fff';
    attackLabel.textAlign = 'center';
    attackLabel.alpha = 0;
    attackLabel.scaleX = attackLabel.scaleY = 2;
    
    stage.addChild(p1Container, p2Container, pendulumContainer, attackLabel);
    stage.update();
    
    if ($rootScope.socket) {
        $rootScope.socket.on('match update', function(match) {
            $rootScope.match = match;
            p1HealthBar.graphics.command.w = $rootScope.match.p1.character.health;
            p2HealthBar.graphics.command.w = $rootScope.match.p2.character.health;
            p1HealthLabel.text = $rootScope.match.p1.character.health + '%';
            p2HealthLabel.text = $rootScope.match.p2.character.health + '%';
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
    
    function tick(event) {
        var time = event.delta / 1000;
        
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
                hitValue = Math.floor((hitValue + 100) / 10);
                var data = {
                    'matchId': $rootScope.match.id,
                    'playerId': $rootScope.player.id,
                    'damage': hitValue
                };
                if ($rootScope.socket) {
                    $rootScope.socket.emit('attack', data);
                }
                recoil += recoilRate;
                attackLabel.text = hitValue;
            } else {
                attackLabel.text = 'Miss!';
            }
            attackLabel.x = pendulum.x - (attackLabel.lineWidth / 2);
            attackLabel.alpha = 1;
            allowedToAttack = false;
        }
        
        // set pendulum speed based on recoil
        pendulum.speed = pendulum.baseSpeed + (recoil / 10);
        
        // move pendulum
        pendulum.x += time * (pendulum.speed * 60 * pendulum.direction);
        
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
        
        // fade attack label
        if (attackLabel.alpha > 0) {
            attackLabel.alpha -= 0.02;
        }
        
        stage.update();
    }
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", tick);
});