import {
    app
} from "app/app.js";
import * as Network from "net/network.js"

app.controller("mainController", function ($scope, $http, $location, Auth) {
    game.hide();
    var net = Network;
    $http.post("/user").then(function (response) {
        var username = response.data.username;
        $scope.username = username;
        net.setName(username);
        if(username){
            Auth.set(username);
        }else{
            Auth.remove();
        }
    }).catch(function (response) {
        console.log(response);
    });
    $scope.peers = [];
    $scope.lobbyName = "Lobby";
    $scope.players = Network.players;
    $scope.lobbies = Network.lobbies;
    Network.player(function (players) {
        $scope.players = players;
        $scope.$apply();
    });
    Network.lobby(function(lobbies){
        $scope.lobbies = lobbies;
        $scope.$apply();
    });
    console.log(Network.players);
    $scope.isServer = function () {
        return Network.isServer;
    }
    $scope.login = function () {
        $location.path("/login");
    }
    $scope.logout = function () {
        $http.post("/logout").then(function (response) {
            $scope.username = undefined;
            Auth.remove();
            $location.path("/login");
        }).catch(function (response) {
            console.log(response);
        });
    }
    $scope.createLobby = function (name) {
        $scope.lobbyName = name;
        $location.path("/lobby");
    };
    $scope.makePublic = function () {
        Network.makePublic();
        $scope.public = true;
    };
    $scope.connect = function (peer) {
        $scope.lobbyName = peer.name;
        $location.path("/lobby");
        Network.connect(peer.id);
    }
    $scope.$on("$routeChangeStart", function () {
        if ($location.path() == "game") {
            game.show();
        } else {
            game.hide();
        }
        var publicRoutes = ["/", "/login", "/register"];
        if (!Auth.user && publicRoutes.indexOf($location.path()) == -1) {
            $location.path("/login");
        }
    });
});