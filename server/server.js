const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uuid = require('uuid/v4');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, clientTracking: false });
const connections = {};

const translation = require('./translate');

process.env.GOOGLE_APPLICATION_CREDENTIALS = './api-secret-key.json'

function handleReceivedMessages(connection) {
  connection.on('message', (data) => {
  	const parsedData = JSON.parse(data);
  	if (parsedData['languagePreference']) {
  		connections[parsedData.id]['languagePreference'] = parsedData['languagePreference'];
  	} else if (parsedData['message']) {
  		broadcast(parsedData);

  	} else {
  		connections[parsedData.id]['name'] = parsedData['name'];
  	}
  });
}

function sendUuidToClient(connection) {
  const uuid = JSON.stringify({id: connection.id});
  connection.send(uuid);
}

function broadcast(data) {
  Object.keys(connections).forEach((key) => {
    const client = connections[key];
    if (client.connection.readyState === WebSocket.OPEN) {
      translation.translateMsg(data.message, client.languagePreference)
        .then((results) => {
        	const translatedMsg = {
        		user: data.name,
        		message: results[0]
        	}
          client.connection.send(JSON.stringify(translatedMsg));
        });
    }
  });
}

wss.on('connection', (socket, req) => {
  const connection = Object.assign(socket, {id: uuid()})
  connections[connection.id] = {connection, languagePreference: "en", name: ""};

  sendUuidToClient(connection);

  handleReceivedMessages(connection);
});

server.listen(8081, function listening() {
  console.log('Listening on %d', server.address().port);
});
