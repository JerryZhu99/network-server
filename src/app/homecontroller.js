import {app} from "app/app.js";

app.controller("homeController", function($scope, $location){
    $scope.createLobby = function(){
        $location.path("lobby");
    };
});