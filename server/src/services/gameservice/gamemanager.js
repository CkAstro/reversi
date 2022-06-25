import GameState from "../../utils/gamestate";

class Game {
   constructor(client, matchType) {
      this.gameId = this.generateGameId();
      this.gameState = new GameState;
      this.moveHistory = [];
      this.activePlayer = null;
      this.legalMove = true;
      this.gameOver = null;
      this.black = {
         client: client,
         playerId: client.playerid,
         status: true,
      }
      this.white = null;
      this.observers = [];
      this.matchType = matchType;
   }

   generateGameId() {
      return Date.now().toString(36).slice(3)+Math.random().toString(36).slice(7,12);
   }
}



class GameManager {
   constructor() {
      this.activeGames = [];
      this.completeGames = [];
      this.incompleteGames = [];
   }

   requestActiveGames() {
      if (this.activeGames.length === 0) return [null];  // [null] intentional
      return this.activeGames.map(game => {
         return {
            gameId: game.gameId,
            black: game.black ? game.black.playerId : null,
            white: game.white ? game.white.playerId : null,
            turn: game.gameState.turn,
            matchType: game.matchType,
         }
      });
   }
}