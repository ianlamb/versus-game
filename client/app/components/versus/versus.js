angular.module('versus', [])
    .controller('VersusController', function($scope) {
    'use strict';
    
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
    
    var pendulum = new createjs.Shape();
    pendulum.width = 10;
    pendulum.height = 120;
    pendulum.direction = 1;
    pendulum.speed = 10;
    pendulum.y = stage.height - pendulum.height;
    pendulum.graphics.beginFill('blue').drawRect(0, 0, pendulum.width, pendulum.height);
    
    var target = new createjs.Shape();
    target.baseWidth = 100;
    target.minWidth = 10;
    target.width = target.baseWidth;
    target.height = 120;
    target.x = stage.width / 2 - target.width / 2;
    target.y = stage.height - target.height;
    target.graphics.beginFill('rgba(255,0,0,0.5)').drawRect(0, 0, target.width, target.height);
    
    var scoreText = new createjs.Text('Score: ' + score);
    scoreText.x = 20;
    scoreText.y = 20;
    
    stage.addChild(target);
    stage.addChild(pendulum);
    stage.addChild(scoreText);
    stage.update();
    
    function tick() {
        // attack
        if (allowedToAttack && Key.isDown(Key.SPACE)) {
            var hitValue = (pendulum.x + pendulum.width / 2) - target.x;
            if (hitValue < 0 || hitValue > target.graphics.command.w) {
                hitValue = 0;
            }
            if (hitValue > (target.graphics.command.w / 2)) {
                hitValue = (target.graphics.command.w / 2) - (hitValue - (target.graphics.command.w / 2));
            }
            // hit!
            if (hitValue > 0) {
                score += hitValue;
                scoreText.text = 'Score: ' + score;
                recoil += recoilRate;
            }
            allowedToAttack = false;
        }
        
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
        
        // set width based on recoil
        target.graphics.command.w += (target.baseWidth - target.graphics.command.w - recoil) / 2;
        
        // recoil min/max
        if (target.graphics.command.w < target.minWidth) {
            target.graphics.command.w = target.minWidth;
            recoil = target.width - target.minWidth;
        }
        if (target.graphics.command.w > target.baseWidth) {
            target.graphics.command.w = target.baseWidth;
        }
        
        // center target
        target.graphics.command.x = 0;// stage.width / 2 - target.graphics.command.w / 2;
        
        stage.update();
    }
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", tick);
});