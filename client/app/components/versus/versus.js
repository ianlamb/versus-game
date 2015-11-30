angular.module('versus', [])
	.controller('VersusController', function($scope) {
    'use strict';
	
	var stage = new createjs.Stage('vsCanvas');
	stage.width = document.getElementById('vsCanvas').clientWidth;
	stage.height = document.getElementById('vsCanvas').clientHeight;
	
	var pendulum = new createjs.Shape();
	pendulum.width = 20;
	pendulum.height = 120;
	pendulum.direction = 1;
	pendulum.speed = 10;
	pendulum.graphics.beginFill('red').drawRect(0, 0, pendulum.width, pendulum.height);
	console.log(pendulum);
	stage.addChild(pendulum);
	stage.update();
	
	function tick() {
		pendulum.x += (pendulum.speed * pendulum.direction);
		if (pendulum.x <= 0 || (pendulum.x + pendulum.width) >= stage.width) {
			pendulum.direction *= -1;
		}
		stage.update();
	}
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.on("tick", tick);
});