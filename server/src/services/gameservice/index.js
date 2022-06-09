import { clients } from '../../api/websocket/clients.js';
import messageHandler from '../../api/websocket/messagehandler.js';
'use strict';

let activeGames = [];
const requestActiveGames = () => {
   if (activeGames.length === 0) return [null];    // [null] intentional
   return activeGames.map(game => {
      return {
         gameId: game.gameId,
         black: game.black ? game.black.playerId : null,
         white: game.white ? game.white.playerId : null,
         turn: game.gameState.turn,
      }
   });
}

// request playerId
messageHandler.addListener('playerIdRequest', ({ clientId, data }) => {
   const playerId = data.playerId;
   const client = clients[clientId];

   // accept all usernames for now
   client.playerId = playerId;
   client.send('playerIdUpdate', {playerId: playerId});
});

export default null;
export { requestActiveGames };