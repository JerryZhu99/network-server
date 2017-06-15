import {app} from "app/app.js";
import "app/maincontroller.js";
import "app/homecontroller.js";
import "app/lobbycontroller.js";
import "app/lobbiescontroller.js";
import "app/gamecontroller.js";
import "app/logincontroller.js";
import "app/registercontroller.js";

app.config(function($routeProvider, $locationProvider){
    $routeProvider.when('/', {
      controller:'homeController',
      templateUrl:'files/views/home.html',
    })
    .when('/lobbies', {
      controller:'lobbiesController',
      templateUrl:'files/views/lobbies.html',
    })
    .when('/lobby', {
      controller:'lobbyController',
      templateUrl:'files/views/lobby.html',
    })
    .when('/game', {
      controller:'gameController',
      templateUrl:'files/views/game.html',
    })
    .when('/login', {
      controller:'loginController',
      templateUrl:'files/views/login.html',
    })
    .when('/register', {
      controller:'registerController',
      templateUrl:'files/views/register.html',
    })
    .otherwise({
      redirectTo:'/'
    });
    $locationProvider.html5Mode(true);
});