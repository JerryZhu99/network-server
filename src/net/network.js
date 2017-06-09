import _ from "./../lib/peer.js";

var peer = new Peer({
    host: "/",
    port: "8080",
    path: "/peerjs"
});
var connection;
console.log(peer);

peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
});
peer.on('error', function (err) {
    console.log(err);
})
peer.on('connection', function (conn) {
    console.log("connection");
    connection = conn;
    onConnection();
});
export function connect(id) {
    connection = peer.connect(id);
    console.log("connection");
    onConnection();
}

function onConnection() {
    connection.send("HI");
    connection.on('data', function (data) {
        console.log(JSON.stringify(data));
        var obj = data;
        runHandlers(event, data);
    });
}

var handlers = [];

function runHandlers(event, data) {
    handlers.forEach(function (handler) {
        if (event == handler.event) handler.callback(data);
    });
}

export function addHandler(event, callback) {
    handlers.push({
        event: event,
        callback: callback
    });
}
export function sendMessage(event, data) {
    if (connection) {
        var obj = {
            event: event,
            data: data
        };
        connection.send(data);
    }
}