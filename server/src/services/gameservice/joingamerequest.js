import { clients } from '../../api/websocket/clients.js';
import { updateClientGameList } from './utils.js';
import gameManager from './gamemanager.js';
'use strict';

const handleJoinGameRequest = ({ clientId, data }) => {
   const client = clients[clientId];
   const opponent = (data.opponent && data.opponent.clientId) ? clients[data.opponent.clientId] : null;

   // request join game
   gameManager.requestJoinGame(client, opponent, data.gameId);

   // send out server message 
   updateClientGameList();
}

export default handleJoinGameRequest;