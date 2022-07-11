import { clients } from '../../api/websocket/clients.js';
import { updateClientGameList } from './utils.js';
import handleJoinGameRequest from './joingamerequest.js';
import gameManager from './gamemanager.js';
'use strict';

const handleNewGameRequest = ({ clientId, data }, isMock=false) => {
   const client = clients[clientId];
   
   // check for opponent
   if (data.opponent && data.opponent.clientId) {
      const opponent = clients[data.opponent.clientId];
      if (!opponent) return client.send('errorMessage', {errorText: 'Opponent has disconnected. You have been returned to the lobby'});
      if (opponent.activeGame) return handleJoinGameRequest({ clientId, data });
   }

   // request new game
   gameManager.requestNewGame(client, isMock);

   // notify all clients
   updateClientGameList();    // move to clientManager
}

export default handleNewGameRequest;