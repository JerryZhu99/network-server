import {app} from "app/app.js";
import "app/maincontroller.js";
import "app/homecontroller.js";

app.config(function($routeProvider, $locationProvider){
    $routeProvider.when('/', {
      controller:'homeController',
      templateUrl:'files/views/home.html',
    })
    .otherwise({
      redirectTo:'/'
    });
    $locationProvider.html5Mode(true);
});