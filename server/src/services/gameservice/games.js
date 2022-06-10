// games object - exportable games stored in memory (save on DB calls)
//
// activeGames : active games
// completeGames : pull from DB on init, store new ones in memory (and save to db)
// incompleteGames : store for player reconnect (not going to implement for a while ...)

const requestActiveGames = () => {
   if (games.activeGames.length === 0) return [null];    // [null] intentional
   return games.activeGames.map(game => {
      return {
         gameId: game.gameId,
         black: game.black ? game.black.playerId : null,
         white: game.white ? game.white.playerId : null,
         turn: game.gameState.turn,
      }
   });
}

const games = {
   activeGames: [],
   completeGames: [],
   incompleteGames: [],
}

export default games;
export { requestActiveGames };