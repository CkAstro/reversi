import { clients } from '../../api/websocket/clients.js'; 
import CompletedGame from '../../models/completedgame.js';
import games from './games.js';


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

   // // save game to MongoDB
   // gameToSave.save().then(result => {
   //    console.log(`game ${completedGame.gameId} saved to database`);
   // });

   // move game from active games list to complete game list
   games.activeGames = games.activeGames.filter(game => game.gameId !== completedGame.gameId);
   games.completeGames = games.completeGames.concat(completedGame);

   // remove active game and opponents from clients
   const black = completedGame.black.client;
   const white = completedGame.white.client;
   black.activeGame = null;
   white.activeGame = null;
   black.opponent = null;
   white.opponent = null;

   if (clients[black.clientId]) black.remove();
   if (clients[white.clientId]) white.remove();

   updateClientGameList();
}

// send active games to all clients 
// (unless they're playing/observing a game)
const updateClientGameList = () => {
   const gameList = games.activeGames.map(game => {
      return {
         gameId: game.gameId,
         black: game.black ? game.black.playerId : null,
         white: game.white ? game.white.playerId : null,
      }
   });

   // send out mapped games
   for (const client of Object.values(clients)) {
      if (!client.activeGame) client.send('currentGameUpdate', gameList);
   }
}

export {
   handleCompletedGame,
   updateClientGameList,
}