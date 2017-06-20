import _ from "lib/peer.js";
import io from "lib/socket.io";

var peer;
var connections = [];
var onReady;
var onPlayer;
var onLobby;

var socket;
var playerName = "Guest";
var lobbyName = "Lobby";
export var handlers = [];
export var isPublic;
export var lobbies = [];
export var players = [];
export var isServer = true;
export var id;
init();
export function init() {
    peer = new Peer({
        host: window.location.host,
        port: "",
        path: "/peerjs/"
    });
    socket = io();
    socket.on("lobbies", function (data) {
        console.log("all lobbies " + JSON.stringify(data));
        lobbies = data;
        if (onLobby) onLobby(lobbies);
    });
    socket.on("lobby created", function (data) {
        console.log("new lobby " + JSON.stringify(data));
        lobbies.push(data);
        if (onLobby) onLobby(lobbies);
    });
    socket.on("lobby closed", function (data) {
        console.log("lobby closed " + JSON.stringify(data));
        lobbies.splice(lobbies.indexOf(data), 1);
        if (onLobby) onLobby(lobbies);
    });

    peer.on('open', function (myId) {
        id = myId;
        console.log('My peer ID is: ' + id);
        players.push({
            id: id,
            name: playerName,
            shipData: {}
        });
        if (onPlayer) {
            onPlayer(players);
        };
        if (onReady) {
            onReady()
        };
    });
    peer.on('error', function (err) {
        console.log(err);
    })
    peer.on('connection', function (conn) {
        isServer = true;
        console.log("connection");
        onConnection(conn);
    });

    addHandler("join game", function (playerInfo) {
        players.push({
            id: playerInfo.id,
            name: playerInfo.name,
            shipData: {}
        });
        players.sort();
        console.log("player joined");

        send("player list", players.map((p) => ({id:p.id, name:p.name, shipData:p.shipData})));

        console.log(handlers);

        if (onPlayer) {
            onPlayer(players);
        }
        return true;
    });
    addHandler("player list", function (allplayers) {
        players = allplayers.map((p) => ({
            id: p.id,
            name: p.name,
            shipData: p.shipData
        }));
        if (onPlayer) onPlayer(players);
    });
}
export function ready(callback) {
    onReady = callback;
}
export function player(callback) {
    onPlayer = callback;
}
export function lobby(callback) {
    onLobby = callback;
}
export function setName(name){
    playerName = name;
    if(players[id])players[id].name = name;
}
export function setLobbyName(name){
    lobbyName = name;
}
export function makePublic() {
    socket.emit("peer id", {
        id:id,
        name:lobbyName,
        user:playerName
    });
    isPublic = true;
}
export function connect(playerId) {
    var conn = peer.connect(playerId);
    console.log("connection");
    setTimeout(function () {
        send("join game", {id:id, name:playerName});
    }, 1000);
    isServer = false;
    onConnection(conn);
}

function onConnection(connection) {
    connections.push(connection);
    connection.on('open', function () {
        console.log("connection open");
        connection.on('error', function (err) {
            console.log(err);
        });
        connection.on('data', function (data) {
            var obj = data;
            var serverOnly = runHandlers(obj.event, obj.data);
            if(isServer && !serverOnly){ //forward data if server
                connections.forEach(function(conn){
                    if(conn != connection){
                        conn.send(data);
                    }
                });
            }
        });
    })
}


function runHandlers(event, data) {
    var callback = handlers[event];
    if (callback) return callback(data);
}

export function addHandler(event, callback) {
    handlers[event] = callback;
}
export function on(event, callback) {
    addHandler(event, callback);
}
export function sendMessage(event, data) {
    connections.forEach(function(connection){
        var obj = {
            event: event,
            data: data
        };
        connection.send(obj);
    });
}
export function send(event, callback) {
    sendMessage(event, callback);
}