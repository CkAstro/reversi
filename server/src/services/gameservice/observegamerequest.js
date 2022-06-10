import { clients } from '../../api/websocket/clients.js';

const handleObserveGameRequest = ({ clientId, data }) => {
   const client = clients[clientId];
   const gameId = data.gameId;

   // get a game pointer
   let game;
   for (const g of activeGames) {
      if (g.gameId === gameId) {
         game = g;
         break;
      }
   }
   
   // if game exists add player to observation list
   if (game) {
      client.activeGame = game;
      game.observers = game.observers.concat(client);
      console.log(`client ${clientId} now observing game ${gameId}`);
      client.send('activeGameUpdate', {
         activeGame: true, 
         playerColor: 'observer', 
         opponent: `${game.black.playerId} vs ${game.white.playerId}`,
      });

      // wait for client page to load before sending update
      setTimeout(() => game.sendGameUpdate(client), 100);
   }
};

export default handleObserveGameRequest;