import { clients } from '../../api/websocket/clients.js';
import games from './games.js';
import { updateClientGameList } from './utils.js';

const handleJoinGameRequest = ({ clientId, data }) => {
   const client = clients[clientId];
   const playerId = client.playerId;
   const gameId = data.gameId;

   if (!playerId) {
      return client.send('errorMessage', {errorText: 'Please select a username before joining a game.'});
   }

   if (client.activeGame) {
      return console.log(`player ${playerId} (${clientId}) is already in a game..`);
   }

   // search for game
   const game = games.activeGames.find(game => game.gameId === gameId);
   if (!game) {
      return console.log(`player ${playerId} (${clientId}) attempted to join game ${gameId}, but it does not exist`);
   }

   // verify empty spot
   if (game.black && game.white) {
      return console.log(`player ${playerId} (${clientId}) attempted to join active game ${gameId}`);
   }

   // add player to game
   game.white = {
      client: client,
      playerId: playerId,
      status: true,
   }
   console.log(`added player ${playerId} (${clientId}) to existing game ${gameId}`);

   // choose randomly who goes first
   game.activePlayer = Math.random() < 0.5 ? 'black' : 'white';

   // update client info
   client.activeGame = game;
   client.playerColor = 'white';
   client.opponent = game.black.client;
   client.opponent.opponent = client;
   client.send('activeGameUpdate', {activeGame: true, playerColor: 'white', opponent: client.opponent.playerId});
   client.opponent.send('activeGameUpdate', {activeGame: true, playerColor: 'black', opponent: client.playerId});

   // update everyone involved in game
   game.sendGameUpdate();

   // update everyone else 
   updateClientGameList();
};

export default handleJoinGameRequest;