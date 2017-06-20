import app from "app/app";

app.controller("lobbyController", function($scope, $location){
    game.hide();
    $scope.players = game.gamestate.players;
});