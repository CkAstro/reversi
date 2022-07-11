
const buildGameList = games => games.map(game => {
   let blackScore = 0;
   let whiteScore = 0;
   game.finalState.forEach(val => {
      val === 'black' && blackScore++;
      val === 'white' && whiteScore++;
   });

   return {
      gameId: game.gameId,
      gameState: game.finalState,
      black: game.black,
      white: game.white,
      winner: game.winner[0].toUpperCase()+game.winner.slice(1),
      score: `${blackScore} vs ${whiteScore}`,
      turn: game.turn,
   }
});

export default buildGameList;