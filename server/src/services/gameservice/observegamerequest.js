import { clients } from '../../api/websocket/clients.js';
import gameManager from './gamemanager.js';
'use strict';

const handleObserveGameRequest = ({ clientId, data }) => {
   const client = clients[clientId];
   const gameId = data.gameId;

   gameManager.requestObserveGame(client, gameId);
}

export default handleObserveGameRequest;