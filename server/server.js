const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uuid = require('uuid/v4');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, clientTracking: false });
const connections = {};

const translation = require('./translate');

function handleReceivedMessages(connection) {
  connection.on('message', (data) => {

    const {message, clientInfo: {languagePreference: language, id}} = JSON.parse(data);

    const translator = translation.translateMsg(message, language)
      .then((results) => {
        const translated = results[0];
        broadcast(translated);
      });

  });
}

function sendUuidToClient(connection) {
  const uuid = JSON.stringify({id: connection.id});
  connection.send(uuid);
}

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', (socket, req) => {
  const connection = Object.assign(socket, {id: uuid()})
  connections[connection.id] = connection;
  
  sendUuidToClient(connection);

  handleReceivedMessages(connection);
});

server.listen(8081, function listening() {
  console.log('Listening on %d', server.address().port);
});