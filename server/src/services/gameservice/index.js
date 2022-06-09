import { clients } from '../../api/websocket/clients.js';
import messageHandler from '../../api/websocket/messagehandler.js';
'use strict';

let activeGames = [];

// request playerId
messageHandler.addListener('playerIdRequest', ({ clientId, data }) => {
   const playerId = data.playerId;
   const client = clients[clientId];

   // accept all usernames for now
   client.playerId = playerId;
   client.send('playerIdUpdate', {playerId: playerId});
});

export default null;