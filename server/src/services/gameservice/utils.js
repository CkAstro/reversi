import { clients } from '../../api/websocket/clients.js'; 
import gameManager from './gamemanager.js';
'use strict';

// send active games to all clients 
// (unless they're playing/observing a game)
const updateClientGameList = () => {
   const gameList = gameManager.getActiveGames().map(game => {
      return {
         gameId: game.gameId,
         black: game.black ? game.black.playerId : null,
         white: game.white ? game.white.playerId : null,
         matchType: game.matchType,
      }
   });

   // send out mapped games
   for (const client of Object.values(clients)) {
      if (!client.activeGame) client.send('currentGameUpdate', gameList);
   }
}

export { updateClientGameList }