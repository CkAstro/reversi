import GameState from '../../utils/gamestate/index.js';
import logger from '../../utils/logger.js';
'use strict';

class Game {
   constructor(client, matchType) {
      this.gameId = this.generateGameId();
      this.gameState = new GameState;
      this.moveHistory = [];
      this.activePlayer = Math.random() < 0.5 ? 'black' : 'white';
      this.legalMove = true;
      this.gameOver = null;
      this.black = {
         client: client,
         playerId: client.playerId,
         status: true,
      }
      this.white = null;
      this.observers = [];
      this.matchType = matchType;
   }

   init() {
      if (this.black) {
         const client = this.black.client;
         client.activeGame = this;
         client.playerColor = 'black';
         const opponent = client.opponent;
         const gameUpdate = {
            activeGame: true,
            playerColor: 'black',
            opponent: opponent ? {playerId: opponent.playerId, clientId: opponent.clientId} : {playerId: null, clientId: null},
         }
         client.send('activeGameUpdate', gameUpdate);
      } 
      
      if (this.white) {
         const client = this.white.client;
         client.activeGame = this;
         client.playerColor = 'white';
         const opponent = client.opponent;
         const gameUpdate = {
            activeGame: true,
            playerColor: 'white',
            opponent: opponent ? {playerId: opponent.playerId, clientId: opponent.clientId} : {playerId: null, clientId: null},
         }
         client.send('activeGameUpdate', gameUpdate);
      }

      // update everyone involved in game
      if (this.black && this.white) this.sendGameUpdate();
   }

   generateGameId() {
      return Date.now().toString(36).slice(3)+Math.random().toString(36).slice(7,12);
   }

   hasPlayers() {
      return (this.black && this.black.status) || (this.white && this.white.status);
   }

   removeClient(client) {
      if (!client || client.activeGame !== this) return;
      // must remove
      //    1. client from this game (black, white, observer)
      if (this.black && this.black.client === client) this.black = null;
      if (this.white && this.white.client === client) this.white = null;
      this.observers = this.observers.filter(obs => obs.clientId !== client.clientId);
      //    2. this game from client activeGame
      client.activeGame = null;
      //    3. client's playerColor
      client.playerColor = null;
      //    4. client's opponent's opponent
      if (client.opponent) client.opponent.opponent = null;
      //    5. client's opponent
      client.opponent = null;
   }

   removeAllClients() {
      if (this.black && this.black.client) {
         this.black.client.activeGame = null; 
         this.black.client.playerColor = null;
         this.black.client.opponent = null;
         this.black = null;
      }
      if (this.white && this.white.client) {
         this.white.client.activeGame = null;
         this.white.client.playerColor = null;
         this.white.client.opponent = null;
         this.white = null;
      }
      for (const observer of this.observers) {
         if (observer.activeGame) {
            observer.activeGame = null;
            observer.playerColor = null;
            observer.opponent = null;
         }
      }
      this.observers = [];
   }

   addObserver(client) {
      client.activeGame = this;
      this.observers = this.observers.concat(client);
      client.send('activeGameUpdate', {
         activeGame: true,
         playerColor: 'observer',
         opponent: {playerId: null, clientId: null},
         black: this.black.playerId,
         white: this.white.playerId,
      });
      logger(`client ${client.clientId} now observing game ${this.gameId}`);

      // wait for client page to load before sending update
      setTimeout(() => this.sendGameUpdate(client), 100);
   }

   sendGameUpdate(client = null) {
      const gameUpdate = {
         gameState: this.gameState.toArray(),
         turn: this.gameState.turn,
         activePlayer: this.activePlayer,
         legalMove: this.legalMove,
         gameOver: this.gameOver,
         matchType: this.matchType,
         black: this.black ? this.black.playerId : null,
         white: this.white ? this.white.playerId : null,
         status: true,
      }
      if (client) return client.send('gameUpdate', gameUpdate);

      if (this.black) this.black.client.send('gameUpdate', gameUpdate);
      if (this.white) this.white.client.send('gameUpdate', gameUpdate);
      for (const observer of this.observers) {
         observer.send('gameUpdate', gameUpdate);
      }
   }
}

export { Game };
export default Game;