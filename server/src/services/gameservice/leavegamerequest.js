import { clients } from '../../api/websocket/clients.js';
import { updateClientGameList } from './utils.js';

const handleLeaveGameRequest = ({ clientId }) => {
   const client = clients[clientId];
   const activeGame = client.activeGame;
   const opponent = client.opponent;

   // first make sure client is in a game
   if (!activeGame) return console.log(`client ${clientId} attempted to leave game, but they are not in a game`);

   // remove if observing
   const blackId = activeGame.black ? activeGame.black.client.clientId : null;
   const whiteId = activeGame.white ? activeGame.white.client.clientId : null;
   if (clientId !== blackId && clientId !== whiteId) {
      activeGame.observers = activeGame.observers.filter(obs => obs.clientId !== clientId);
      client.activeGame = null;
   }

   // remove active game
   activeGame[client.playerColor] = null;
   client.playerColor = null;
   client.activeGame = null;

   // remove self from opponent list
   if (opponent) opponent.opponent = null;

   // remove opponent
   client.opponent = null;

   // remove game if necessary
   if (!activeGame.hasPlayers()) activeGame.remove();

   // update everyone 
   updateClientGameList();
}

export default handleLeaveGameRequest;