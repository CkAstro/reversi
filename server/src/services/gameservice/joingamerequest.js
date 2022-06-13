import { clients } from '../../api/websocket/clients.js';
import games from './games.js';
import { updateClientGameList } from './utils.js';

const handleJoinGameRequest = ({ clientId, data }) => {
   const client = clients[clientId];
   const playerId = client.playerId;

   // require player id before join
   if (!playerId) {
      return client.send('errorMessage', {errorText: 'Please select a username before joining a game.'});
   }

   // ensure single game
   if (client.activeGame) {
      return console.log(`player ${playerId} (${clientId}) is already in a game..`);
   }

   // handle specified opponent (for rematch)
   let game;
   let gameId;
   if (data.opponent && data.opponent.clientId) {
      const opponent = clients[data.opponent.clientId];
      if (opponent.opponent) return client.send('errorMessage', {errorText: `attempted to rejoin game with ${opponent.playerId}, but they are already in a game.`});
      if (!opponent.activeGame) return client.send('errorMessage', {errorText: `attempted to rejoin game with ${opponent.playerId}, but they are not available.`});
      game = opponent.activeGame;
      gameId = game.gameId;
   } else {
      // search for specified game
      gameId = data.gameId;
      game = games.activeGames.find(game => game.gameId === gameId);
   }

   if (!game) {
      return console.log(`player ${playerId} (${clientId}) attempted to join game ${gameId}, but it does not exist`);
   }

   // verify empty spot
   if (game.black && game.white) {
      return console.log(`player ${playerId} (${clientId}) attempted to join active game ${gameId}`);
   }

   // add player to game
   if (game.black) {
      game.white = {
         client: client,
         playerId: playerId,
         status: true,
      }
   } else {
      game.black = {
         client: client,
         playerId: playerId,
         status: true,
      }
   }

   console.log(`added player ${playerId} (${clientId}) to existing game ${gameId}`);

   console.log('client count', Object.entries(clients).length);

   // choose randomly who goes first
   game.activePlayer = Math.random() < 0.5 ? 'black' : 'white';

   // update client info
   client.activeGame = game;
   client.playerColor = 'white';
   client.opponent = game.black.client;
   client.opponent.opponent = client;

   client.send('activeGameUpdate', {
      activeGame: true, 
      playerColor: 'white', 
      opponent: {playerId: client.opponent.playerId, clientId: client.opponent.clientId},
   });
   client.opponent.send('activeGameUpdate', {
      activeGame: true, 
      playerColor: 'black', 
      opponent: {playerId: client.playerId, clientId: client.clientId},
   });

   // update everyone involved in game
   game.sendGameUpdate();

   // update everyone else 
   updateClientGameList();
};

export default handleJoinGameRequest;