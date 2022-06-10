import { clients } from '../../api/websocket/clients.js';
import { updateClientGameList } from './utils.js';
import GameState from '../../utils/gamestate/index.js';
import games from './games.js';
import handleJoinGameRequest from './joingamerequest.js';

// generate new game id
const generateGameId = () => {
   return Date.now().toString(36).slice(3)+Math.random().toString(36).slice(7,12);
}

const createNewGame = client => {
   const newGame = {
      gameId: generateGameId(),
      gameState: new GameState,
      moveHistory: [],
      activePlayer: null,
      legalMove: true,
      gameOver: null,
      black: {
         client: client,
         playerId: client.playerId,
         status: true,
      },
      white: null,
      observers: [],
   }

   // check for active players
   newGame.hasPlayers = () => {
      return (newGame.black && newGame.black.status) || (newGame.white && newGame.white.status);
   }

   // remove itself from game list
   newGame.remove = () => {
      games.activeGames = games.activeGames.filter(game => game.gameId !== newGame.gameId);
      updateClientGameList();
   }

   // send game update to all players/observers
   // call with sendGameUpdate(client) to send to specific client
   newGame.sendGameUpdate = (client = null) => {
      const gameUpdate = {
         gameState: newGame.gameState.toArray(),
         turn: newGame.gameState.turn,
         activePlayer: newGame.activePlayer,
         legalMove: newGame.legalMove,
         gameOver: newGame.gameOver,
         status: true,
      }
      if (client) {
         client.send('gameUpdate', gameUpdate);
      } else {
         newGame.black.client.send('gameUpdate', gameUpdate);
         newGame.white.client.send('gameUpdate', gameUpdate);
         for (observer of newGame.observers) {
            observer.send('gameUpdate', gameUpdate);
         }
      }
   }
   return newGame;
}

const handleNewGameRequest = ({ clientId, data }) => {
   const client = clients[clientId];
   const playerId = client.playerId;

   // if we have an opponent, see if they are in a game
   if (data.opponent && data.opponent.clientId) {
      const opponent = clients[data.opponent.clientId];
      if (opponent.activeGame) return handleJoinGameRequest({ clientId, data });
   }

   if (!playerId) {
      return client.send('errorMessage', {errorText: 'Please select a username before starting a new game.'});
   }

   if (client.activeGame) {
      return console.log(`player ${playerId} (${clientId}) is already in a game..`);
   }

   // create new game
   const newGame = createNewGame(client);

   // update client info
   client.activeGame = newGame;
   client.playerColor = 'black';
   client.send('activeGameUpdate', {activeGame: true, playerColor: 'black', opponent: {playerId: null, clientId: null}});

   // add to active games and notify all clients
   games.activeGames = games.activeGames.concat(newGame);
   updateClientGameList();
   console.log(`added player ${playerId} (${clientId}) to new game ${newGame.gameId}`);
}

export default handleNewGameRequest;