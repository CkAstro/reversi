import { clients } from '../../api/websocket/clients.js';
import { updateClientGameList } from './utils.js';
import gameManager from './gamemanager.js';
import logger from '../../utils/logger.js';
'use strict';

const handleMoveRequest = ({ clientId, data }, mock=false) => {
   const client = clients[clientId];
   const move = data.move;

   const game = client.activeGame;
   const gameState = game.gameState;
   const activePlayer = game.activePlayer;
   const turn = gameState.turn;

   if (mock && game.matchType !== 'replay') {
      return logger(`mock move request but game ${game.gameId} is a live game.`);
   }

   // verify player can move
   if (activePlayer !== client.playerColor && !mock) {
      return logger(`illegal move; player ${client.playerId} attempted to move while it is not their turn`);
   }

   // skip if necessary
   if (move === '__skip__') {
      game.activePlayer = activePlayer === 'black' ? 'white' : 'black';
      game.legalMove = true;
      return game.sendGameUpdate();
   }

   // attempt to place piece
   if (gameState.placePiece(move, activePlayer)) {

      // record move and flip active player
      game.moveHistory = game.moveHistory.concat({ player: activePlayer, move: move });
      game.activePlayer = activePlayer === 'black' ? 'white' : 'black';

      // check for legal moves
      game.legalMove = turn < 4 ? true : gameState.checkLegalMove(game.activePlayer);
      game.gameOver = game.legalMove ? null : (gameState.checkLegalMove(activePlayer) ? null : gameState.gameOver());

      // update playersa
      game.sendGameUpdate();
      if (game.gameOver) gameManager.recordGame(game);
      updateClientGameList();
   }
}

export default handleMoveRequest;