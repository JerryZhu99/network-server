import _ from "lib/peer.js";
import * as GameState from "game/gamestate.js";


var peer;
var connection;
var onReady;

export var isServer = true;
export var id;
export function init() {
    peer = new Peer({
        host: window.location.host,
        port: "",
        path: "/peerjs/"
    });

    console.log(peer);

    peer.on('open', function (myId) {
        id = myId;
        console.log('My peer ID is: ' + id);
        if(onReady)onReady();
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
}
export function ready(callback){
    onReady = callback;
}
export function connect(playerId) {
    connection = peer.connect(playerId);
    console.log("connection");
    setTimeout(function () {
        console.log("")
        sendMessage("join game", id);
    }, 1000);
    isServer = false;
    onConnection();
}

function onConnection() {
    connection.on('data', function (data) {
        var obj = data;
        runHandlers(obj.event, obj.data);
    });
}

var handlers = [];

function runHandlers(event, data) {
    var callback = handlers[event];
    if (callback) callback(data);
}

export function addHandler(event, callback) {
    handlers[event] = callback;
}
export function on(event, callback){
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
export function send(event, callback){
    sendMessage(event, callback);
}