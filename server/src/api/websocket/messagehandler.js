import logger from '../../utils/logger.js';
'use strict';

// listen for messages from client and handle them. used with
// MessageHandler.addListener('myMessage', (data) => function(data));
class MessageHandler {
   constructor() {
      this.listeners = {};
   }

   addListener(type, handler) {
      if (!this.listeners[type]) this.listeners[type] = handler;
   }

   handleMessage(message) {
      if (this.listeners[message.type]) {
         this.listeners[message.type](message);
      } else {
         logger(`ERROR: received '${message.type}' message from client ${message.client}, but no listener is available`);
      }
   }
}

export default new MessageHandler;