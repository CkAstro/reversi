import { clients } from '../../api/websocket/clients.js';
import { updateClientGameList } from './utils.js';
import gameManager from './gamemanager.js';
'use strict';

const handleLeaveGameRequest = ({ clientId }) => {
   const client = clients[clientId];

   // leave game
   gameManager.requestLeaveGame(client);

   // update everyone
   updateClientGameList();
}

export default handleLeaveGameRequest;