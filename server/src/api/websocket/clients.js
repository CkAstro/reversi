import gameManager from '../../services/gameservice/gamemanager.js';
'use strict';

class Client {
   constructor({ clientIp, socket }) {
      this.clientId = generateClientId();    // random id number
      this.clientIp = clientIp;              // ip address
      this.playerId = null;                  // player username
      this.socket = socket;                  // live websocket connection
      this.activeGame = null;                // playing or observing
      this.playerColor = null;               // player color (remains null if observing)
      this.opponent = null;                  // player opponent (remains null if observing)
      // send(),                             // method to send data to client
      // remove(),                           // method to remove client from active game and client list
   }

   // send data to client
   send(type, data) {
      const message = {
         type: type,
         clientId: 'server',
         data: data,
      }
      this.socket.send(JSON.stringify(message));
   }

   // remove client from active game, client list
   remove() {
      if (this.activeGame) gameManager.requestLeaveGame(this);

      // delete client
      delete clients[this.clientId];
   }
}

// generate semi-random client id
const generateClientId = () => {
   return Date.now().toString(36).slice(2,7)+Math.random().toString(36).slice(8);
}

const clients = {};

export {
   Client,
   clients,
}