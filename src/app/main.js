import {app} from "app/app.js";
import "app/maincontroller.js";
import "app/homecontroller.js";
import "app/lobbycontroller.js";
import "app/gamecontroller.js";

app.config(function($routeProvider, $locationProvider){
    $routeProvider.when('/', {
      controller:'homeController',
      templateUrl:'files/views/home.html',
    })
    .when('/lobby', {
      controller:'lobbyController',
      templateUrl:'files/views/lobby.html',
    })
    .when('/game', {
      controller:'gameController',
      templateUrl:'files/views/game.html',
    })
    .otherwise({
      redirectTo:'/'
    });
    $locationProvider.html5Mode(true);
});