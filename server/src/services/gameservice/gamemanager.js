import CompletedGame from '../../models/completedgame.js';
import Game from './game.js';
'use strict';

class GameManager {
   constructor() {
      this._activeGames = [];
      this._completeGames = [];
      this._incompleteGames = [];
   }

   getActiveGames() { return this._activeGames; }
   getCompleteGames() { return this._completeGames; }
   getIncompleteGames() { return this._incompleteGames; }

   requestActiveGames() {
      if (this._activeGames.length === 0) return [null];  // [null] intentional
      return this._activeGames.map(game => {
         return {
            gameId: game.gameId,
            black: game.black ? game.black.playerId : null,
            white: game.white ? game.white.playerId : null,
            turn: game.gameState.turn,
            matchType: game.matchType,
         }
      });
   }

   // create new game
   createNewGame(client, matchType) {
      if (matchType !== 'live' && matchType !== 'replay') throw new Error('match type not recognized; cannot create new game');
      if (!client || !client.clientId || !client.playerId) throw new Error('client is not valid for new game');
      const newGame = new Game(client, matchType);
      this._activeGames = this._activeGames.concat(newGame);
      return newGame;
   }

   // handle new game request
   requestNewGame(client, isMock=false) {
      if (!client || !client.clientId ) throw new Error('client is not valid for new game');
      if (!client.playerId) return client.send('errorMessage', {errorText: 'Please select a username before starting a new game.'});
      if (client.activeGame) return console.log('player attempted to start new game while in active game', client);

      const matchType = isMock ? 'replay' : 'live';
      const newGame = this.createNewGame(client, matchType);

      console.log(`added player ${client.playerId} (${client.clientId}) to new game ${newGame.gameId}`);

      // initialize game
      newGame.init();
   }

   // handle join game request
   requestJoinGame(client, opponent, gameId) {
      if (!client || !client.clientId ) throw new Error('client is not valid for new game');
      if (!client.playerId) return client.send('errorMessage', {errorText: 'Please select a username before joining a game.'});
      if (client.activeGame) return console.log('player attempted to join game while in active game', client);

      // opponent requested ?
      if (opponent && opponent.opponent) return client.send('errorMessage', {errorText: `attempted to rejoin game with ${opponent.playerId}, but they are already in a game.`});
      if (opponent && !opponent.activeGame) return client.send('errorMessage', {errorText: `attempted to rejoin game with ${opponent.playerId}, but they are not available.`});

      // get game
      const game = opponent
         ? opponent.activeGame
         : this._activeGames.find(game => game.gameId === gameId)
      ;

      // make sure game exists
      if (!game) return console.log(`player ${client.playerId} (${client.clientId}) attempted to join game ${gameId}, but it does not exist`);

      // verify single empty spot
      if (game.black && game.white) return console.log(`player ${client.playerId} (${client.clientId}) attempted to join active game ${gameId}, but it is full`);
      if (!game.black && !game.white) return console.log(`player ${client.playerId} (${client.clientId}) attempted to join active game ${gameId}, but it is empty`);

      // add player to game and set opponents
      if (game.black) {
         client.opponent = game.black.client;
         game.white = {
            client: client,
            playerId: client.playerId,
            status: true,
         }
      } else {
         client.opponent = game.white.client;
         game.black = {
            client: client,
            playerId: client.playerId,
            status: true,
         }
      }
      client.opponent.opponent = client;

      // log addition
      console.log(`added player ${client.playerId} (${client.clientId}) to existing game ${gameId}`);

      // init game
      game.init();
   }

   requestObserveGame(client, gameId) {
      // get game pointer
      let game;
      for (const g of this._activeGames) {
         if (g.gameId === gameId) {
            game = g;
            break;
         }
      }
      if (!game) client.send('errorMessage', {errorText: 'Game no longer exists!'});

      // if game exists add observer
      game.addObserver(client);
   }

   // handle leave game request
   requestLeaveGame(client) {
      if (!client || !client.clientId ) throw new Error('client is not valid for new game');
      if (!client.activeGame) return console.log(`client ${client.clientId} attempted to leave game, but they are not in a game`);

      const activeGame = client.activeGame;
      activeGame.removeClient(client);
      if (!activeGame.hasPlayers()) this._requestDeleteGame(activeGame);
   }

   // handle remove game
   _requestDeleteGame(gameToRemove) {
      if (gameToRemove.hasPlayers()) return console.log(`server attempted to remove game ${gameToRemove.gameId}, but players are still present`);
      gameToRemove.removeAllClients();
      this._activeGames = this._activeGames.filter(game => game.gameId !== gameToRemove.gameId);
      if (gameToRemove.gameOver) {
         this._completeGames = this._completeGames.concat(gameToRemove);
      } else {
         this._incompleteGames = this._incompleteGames.concat(gameToRemove);
      }
   }

   // handle recording of completed game
   recordGame(game) {
      if (game.matchType !== 'live') return this._requestDeleteGame(game);

      const gameToSave = new CompletedGame({
         gameId: game.gameId,
         moveHistory: game.moveHistory,
         finalState: game.gameState.toArray(),
         winner: game.gameOver,
         black: game.black.playerId,
         white: game.white.playerId,
         turn: game.gameState.turn,
         time: Date.now(),
      });

      gameToSave.save().then(result => {
         console.log(`game ${game.gameId} successfully saved to database`);
      });

      this._requestDeleteGame(game);
   }

}

export default new GameManager;
export { GameManager, Game };