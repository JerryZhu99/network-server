import {app} from "app/app.js";

app.controller("lobbyController", function($scope, $location){
    game.hide();
    $scope.players = game.gamestate.players;

    $scope.startGame = function(){
        if(game.started){
            game.show();
            $location.path("game");
        }else{
            game.startGame("raid");
        }
    }
});