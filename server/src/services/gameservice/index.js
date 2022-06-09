import { clients } from '../../api/websocket/clients.js';
import messageHandler from '../../api/websocket/messagehandler.js';
import CompletedGame from '../../models/completedgame.js';
import GameState from '../../utils/gamestate/index.js';
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

// send active games to all clients 
// (unless they're playing/observing a game)
const updateClientGameList = () => {
   const gameList = activeGames.map(game => {
      return {
         gameId: game.gameId,
         black: game.black ? game.black.playerId : null,
         white: game.white ? game.white.playerId : null,
      }
   });
   console.log('games', activeGames.length)

   // send out mapped games
   for (const client of Object.values(clients)) {
      if (!client.activeGame) client.send('currentGameUpdate', gameList);
   }
}


// generate new game id
const generateGameId = () => {
   return Date.now().toString(36).slice(3)+Math.random().toString(36).slice(7,12);
}

// request playerId
messageHandler.addListener('playerIdRequest', ({ clientId, data }) => {
   const playerId = data.playerId;
   const client = clients[clientId];

   // accept all usernames for now
   client.playerId = playerId;
   client.send('playerIdUpdate', {playerId: playerId});
});


// create new game for client
messageHandler.addListener('newGameRequest', ({ clientId }) => {
   const client = clients[clientId];
   const playerId = client.playerId;

   if (!playerId) {
      return client.send('errorMessage', {errorText: 'Please select a username before starting a new game.'});
   }

   if (client.activeGame) {
      return console.log(`player ${playerId} (${clientId}) is already in a game..`);
   }

   // create new game
   const newGame = {
      gameId: generateGameId(),
      gameState: new GameState,
      moveHistory: [],
      activePlayer: null,
      legalMove: null,
      gameOver: null,
      black: {
         client: client,
         playerId: playerId,
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
      activeGames = activeGames.filter(game => game.gameId !== newGame.gameId);
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

   // update client info
   client.activeGame = newGame;
   client.playerColor = 'black';
   client.send('activeGameUpdate', {activeGame: true, playerColor: 'black', opponent: null});

   // add to active games and notify all clients
   activeGames = activeGames.concat(newGame);
   updateClientGameList();
   console.log(`added player ${playerId} (${clientId}) to new game ${newGame.gameId}`);
});


// join existing game based on gameId
messageHandler.addListener('joinGameRequest', ({ clientId, data }) => {
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
   const game = activeGames.find(game => game.gameId === gameId);
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
});


// observe game based on gameId
messageHandler.addListener('observeGameRequest', ({ clientId, data }) => {
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
});


// request move for active game
messageHandler.addListener('moveRequest', ({ clientId, data }) => {
   const client = clients[clientId];
   const move = data.move;

   const game = client.activeGame;
   const gameState = game.gameState;
   const activePlayer = game.activePlayer;
   const turn = gameState.turn;

   // verify player can move
   if (activePlayer !== client.playerColor) {
      return console.log(`illegal move; player ${client.playerId} attempted to move while it is not their turn`);
   }

   // skip if necessary
   if (move === '__skip__') {
      game.activePlayer = activePlayer === 'black' ? 'white' : 'black';
      game.legalMove = true;
      return game.sendGameUpdate();
   }

   if (gameState.placePiece(move, activePlayer)) {
      // record move and flip active player
      game.moveHistory = game.moveHistory.concat({ player: activePlayer, move: move });
      game.activePlayer = activePlayer === 'black' ? 'white' : 'black';

      // check for legal moves
      game.legalMove = turn < 4 ? true : gameState.checkLegalMove(game.activePlayer);
      game.gameOver = game.legalMove ? null : (gameState.checkLegalMove(activePlayer) ? null : gameState.gameOver());

      // update players
      game.sendGameUpdate();
      if (game.gameOver) handleCompletedGame(game)
   } else {
      // console.log('could not place');
   }
});


const handleCompletedGame = completedGame => {
   const gameToSave = new CompletedGame({
      gameId: completedGame.gameId,
      moveHistory: completedGame.moveHistory,
      finalState: completedGame.gameState.toArray(),
      winner: completedGame.gameOver,
      black: completedGame.black.playerId,
      white: completedGame.white.playerId,
      turn: completedGame.gameState.turn,
      time: Date.now(),
   });

   // save game to MongoDB
   gameToSave.save().then(result => {
      console.log(`game ${completedGame.gameId} saved to database`);
   });

   // remove game from active games list
   activeGames = activeGames.filter(game => game.gameId !== completedGame.gameId);

   // remove active game from clients
   completedGame.black.client.activeGame = null;
   completedGame.white.client.activeGame = null;
   updateClientGameList();
}


export default null;
export { requestActiveGames };