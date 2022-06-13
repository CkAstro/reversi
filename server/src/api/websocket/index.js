import { WebSocketServer } from 'ws';
import { Client, clients } from './clients.js';
import messageHandler from './messagehandler.js';
'use strict';

// on connection, clreate a new client object
// on close, remove client object and their association with games
const createWebSocket = expressServer => {
   const wsServer = new WebSocketServer({
      noServer: true,
      path: '/',
   });

   expressServer.on('upgrade', (req, socket, head) => {
      wsServer.handleUpgrade(req, socket, head, (webSocket) => {
         wsServer.emit('connection', webSocket, req);
      });
   });

   wsServer.on('connection', (connection, req) => {
      // get client IP
      let clientIp = req.socket.remoteAddress;
      if (clientIp.slice(0,7) === '::ffff:') clientIp = clientIp.slice(7);

      // create new client
      const newClient = new Client({clientIp: clientIp, socket: connection});
      connection.clientId = newClient.clientId;
      clients[newClient.clientId] = newClient;
      console.log(`new client connected: ${newClient.clientId}`);

      // send handshake, assign client their Id
      newClient.send('handshake', {clientId: newClient.clientId});

      // parse incoming client message and send to handler
      connection.on('message', message => {
         const parsedMessage = JSON.parse(message);
         console.log('received over socket:', parsedMessage);
         messageHandler.handleMessage(parsedMessage);
      });

      // handle connection close event
      connection.on('close', () => {
         const clientId = connection.clientId;
         const client = clients[clientId];
         if (client.activeGame && client.activeGame.matchType === 'live' && client.opponent) {
            client.opponent.send('errorMessage', {errorText: `Your opponent ${client.playerId} has disconnected.`})
         }
         client.remove();
         console.log(`connection closed with client ${clientId}`);
      });
   });
   return wsServer
}

export default createWebSocket;