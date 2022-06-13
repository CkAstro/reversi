import { clients } from '../../api/websocket/clients.js';
import { updateClientGameList } from './utils.js';

const handleLeaveGameRequest = ({ clientId }) => {
   const client = clients[clientId];
   const activeGame = client.activeGame;
   if (!activeGame) return console.log(`client ${clientId} attempted to leave game, but they are not in a game`);

   // remove if observing
   const blackId = activeGame.black ? activeGame.black.client.clientId : null;
   const whiteId = activeGame.white ? activeGame.white.client.clientId : null;
   if (activeGame.matchType === 'replay' || (clientId !== blackId && clientId !== whiteId)) {
      activeGame.observers = activeGame.observers.filter(obs => obs.clientId !== clientId);
      client.activeGame = null;
      return;
   }

   // notify opponent
   const opponent = client.opponent;
   if (opponent) opponent.send('errorMessage', {errorText: `Your opponent ${client.playerId} has left the game.`});

   // remove player
   client.activeGame = null;
   activeGame[client.playerColor] = null;
   if (opponent) opponent.opponent = null;
   client.opponent = null;
   activeGame.observers = activeGame.observers.filter(obs => obs.clientId !== clientId);

   // remove game if necessary
   if (!activeGame.hasPlayers()) activeGame.remove();

   // update everyone 
   updateClientGameList();
}

export default handleLeaveGameRequest;