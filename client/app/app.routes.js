angular.module('routes', ['ui.router'])
    .config(function($urlRouterProvider, $stateProvider, $locationProvider) {
    'use strict';

    $urlRouterProvider
        .otherwise('/');

    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: 'app/components/login/login.html',
            controller: 'LoginController'
        })
        
        .state('characters', {
            url: '/characters',
            templateUrl: 'app/components/characters/characters.html',
            controller: 'CharactersController'
        })
        
        .state('lobby', {
            url: '/lobby',
            templateUrl: 'app/components/lobby/lobby.html',
            controller: 'LobbyController'
        })
        
        .state('versus', {
            url: '/versus',
            templateUrl: 'app/components/versus/versus.html',
            controller: 'VersusController'
        });
		
    $locationProvider.html5Mode(true);
});