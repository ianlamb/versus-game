angular.module('routes', ['ui.router'])
    .config(function($urlRouterProvider, $stateProvider, $locationProvider) {
    'use strict';

    $urlRouterProvider
        .otherwise('/');

    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: 'app/components/login/index.html',
            controller: 'LoginController'
        })
        
        .state('characters', {
            url: '/characters',
            templateUrl: 'app/components/characters/index.html',
            controller: 'CharactersController'
        })
        
        .state('lobby', {
            url: '/lobby',
            templateUrl: 'app/components/lobby/index.html',
            controller: 'LobbyController'
        });
		
    $locationProvider.html5Mode(true);
});