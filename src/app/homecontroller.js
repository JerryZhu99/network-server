import {app} from "app/app.js";

app.controller("homeController", function($scope){
    $scope.startGame = function(){
        game.loadScenario("test");
    }
});