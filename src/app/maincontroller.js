import {app} from "app/app.js";
import io from "lib/socket.io";
app.controller("mainController", function($scope){
    game.hide();
    var socket = io();
    $scope.peers = [];
    socket.on('peers', function(data){
        $scope.peers = data;
        $scope.$apply();
    });
    socket.on('peer', function(data){
        console.log("new peer"+data);
        $scope.peers.push(data);
        $scope.$apply();
    });
    $scope.makePublic = function(){
        socket.emit("peer id", game.network.id);
    };
    $scope.connect = function(id){
        game.network.connect(id);
    }
});