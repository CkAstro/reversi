import CompletedGame from '../models/completedgame.js';
import { requestActiveGames } from '../services/gameservice/index.js';
'use strict';

// return a list of active games 
// NOTE: this list will never be empty;
//    if no games are running, returns an array: [null]
const getActiveGames = (req, res) => res.json(requestActiveGames());

// get recent games from the DB
const getRecentGames = (req, res) => {
   CompletedGame.find({}).then(games => res.json(games))
}

// get player games from the DB; we search both colors for playerId
const getPlayerGames = async (req, res) => {
   const playerId = req.params.id;
   const black = await CompletedGame.find({black: playerId});
   const white = await CompletedGame.find({white: playerId});
   res.json(black.concat(white));
}

export default {
   getActiveGames,
   getRecentGames,
   getPlayerGames
}