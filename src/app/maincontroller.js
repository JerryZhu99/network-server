import {app} from "app/app.js";
import io from "lib/socket.io";

app.controller("mainController", function($scope, $location){
    game.hide();
    var socket = io();
    $scope.peers = [];
    $scope.lobbyName = "Lobby";
    $scope.players = game.network.players;
    game.network.playerConnection(function(players){
        $scope.players = players;
        $scope.$apply();
    });
    console.log(game.network.players);
    $scope.isServer = function(){
        return game.network.isServer;
    }
    
    socket.on('lobbies', function(data){
        console.log("all lobbies "+JSON.stringify(data));
        $scope.peers = data;
        $scope.$apply();
    });
    socket.on('lobby created', function(data){
        console.log("new lobby "+JSON.stringify(data));
        $scope.peers.push(data);
        $scope.$apply();
    });
    socket.on('lobby closed', function(data){
        console.log("lobby closed "+JSON.stringify(data));
        $scope.peers.splice($scope.peers.indexOf(data),1);
        $scope.$apply();
    });
    $scope.createLobby = function(name){
        $scope.lobbyName = name;
        $location.path("lobby");
    };
    $scope.makePublic = function(){
        socket.emit("peer id", {id:game.network.id, name:$scope.lobbyName});
    };
    $scope.connect = function(peer){
        $scope.lobbyName = peer.name;
        $location.path("lobby");
        game.network.connect(peer.id);
    }
    $scope.$on('$routeChangeStart', function(){
        if($location.path()=="game"){
            game.show();
        }else{
            game.hide();
        }
    });
});