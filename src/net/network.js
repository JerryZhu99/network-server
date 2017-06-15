import _ from "lib/peer.js";
import io from "lib/socket.io";

var peer;
var connection;
var onReady;
var onPlayer;
var onLobby;

var socket;
var playerName = "Guest";
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
            id: id
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
        connection = conn;
        onConnection();
    });

    addHandler("join game", function (playerInfo) {
        players.push({
            id: playerInfo.id,
            name: playerInfo.name
        });
        players.sort();
        console.log("player joined");

        send("player list", players.map((p) => ({id:p.id, name:p.name})));

        console.log(handlers);

        if (onPlayer) {
            onPlayer(players);
        }
    });
    addHandler("player list", function (allplayers) {
        players = allplayers.map((p) => ({
            id: p.id,
            name: p.name
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
    players[Network.id].name = name;
}
export function makePublic() {
    socket.emit("peer id", this);
    isPublic = true;
}
export function connect(playerId) {
    connection = peer.connect(playerId);
    console.log("connection");
    setTimeout(function () {
        send("join game", {id:id, name:playerName});
    }, 1000);
    isServer = false;
    onConnection();
}

function onConnection() {
    connection.on('open', function () {
        console.log("connection open");
        connection.on('error', function (err) {
            console.log(err);
        });
        connection.on('data', function (data) {
            var obj = data;
            runHandlers(obj.event, obj.data);
        });
    })
}


function runHandlers(event, data) {
    var callback = handlers[event];
    if (callback) callback(data);
}

export function addHandler(event, callback) {
    handlers[event] = callback;
}
export function on(event, callback) {
    addHandler(event, callback);
}
export function sendMessage(event, data) {
    if (connection) {
        var obj = {
            event: event,
            data: data
        };
        connection.send(obj);
    }
}
export function send(event, callback) {
    sendMessage(event, callback);
}