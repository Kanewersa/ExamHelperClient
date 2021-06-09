const WebSocket = require('ws');
const Event = require("./Event").Event;

const serverAddress = "ws://localhost:8765"

let client;
let interval;

const onerror = new Event(this);
const onmessage = new Event(this);
const onopen = new Event(this);

function connectToServer() {
    'use strict';

    client = null;

    connect();

    interval = setInterval(checkConnection, 5000);
}

function sendMessage(message) {
    client.send(message)
}

function connect() {
    client = new WebSocket(serverAddress);

    client.onopen = function(e) {
        onopen.notify(e);
    };

    client.onmessage = function(e) {
        onmessage.notify(e);
    };

    client.onclose = function() {
        // reconnect now
        checkConnection();
    };

    client.onerror = function(e) {
        onerror.notify(e);
        // reconnect now
        checkConnection();
    }
}

function checkConnection() {
    if(!client || client.readyState === 3) connect();
}

function close() {
    if (interval) {
        clearInterval(interval);
    }

    if (client) {
        client.close(1000);
    }
}

exports.connectToServer = connectToServer;
exports.close = close;
exports.sendMessage = sendMessage;
exports.onmessage = onmessage;
exports.onerror = onerror;
exports.onopen = onopen;
