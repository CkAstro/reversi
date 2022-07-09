import { clients } from '../../api/websocket/clients.js';
import logger from '../../utils/logger.js';
'use strict';

class MockClient {
   constructor(clientId, playerId) {
      this.clientId = clientId;
      this.clientIp = null;
      this.playerId = playerId,
      this.socket = null;
      this.activeGame = null;
      this.playerColor = null;
      this.opponent = null;
   }

   send(type, data) {
      // if (data.errorText?)      // HANDLE SKIP
      return;
   }

   remove() {
      if (this.activeGame) {
         if (this.playerColor) {
            this.activeGame[this.playerColor] = null;
            if (this.opponent && this.opponent.opponent) this.opponent.opponent = null;
         } else {
            logger(`attempting to remove mock client ${this.clientId} from game, but no player color is set`);
         }
         // remove game
         if (!this.activeGame.hasPlayers()) this.activeGame.remove();
         this.activeGame = null;
      }

      // delete client
      delete clients[this.clientId];
   }
}

export default MockClient;