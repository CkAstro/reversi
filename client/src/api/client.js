// TODO : listeners need to interface with contexts; prevent-rewrite 
//    currently disabled in 'addListener'

// Client serves two purposes
// -------------------------------
// 1. opens a websocket for communication with the reversi server
// 2. acts as an internal message handler so components can interact
//     - NOTE: internal message handler is currently depreciated in favor 
//       of React contexts
//
// Each relies on listener events, 
//    client.addListener('myMessage', (data) => function_to_perform(data))
// these are then stored in client.listeners
//    client.listeners['myMessage'] = (data) => function_to_perform(data)
// then when we receive a message from server (or internal) we perform the
// function associated with the message via serverMessageHandler(message)

class Client {
   constructor() {
      this.isInit = false;
      this.clientId = null;
      this.socket = null;
      this.listeners = {};
      this.internalListeners = {};
   }

   init() {
      if (this.isInit) return;
      const WS_URL = window.location.host.includes('localhost') ? 
         'ws://localhost:3003' :
         'wss://reversi.chriskolb.dev' ;
      this.socket = new WebSocket(WS_URL);
      this.socket.onopen = () => console.log('client connected to server');
      this.socket.onmessage = message => {
         const parsedMessage = JSON.parse(message.data);
         console.log('message from server:', parsedMessage);
         this.serverMessageHandler(parsedMessage);
      }
   }
   
   // send a message to server
   send(type, data) {
      const message = {
         type: type,
         clientId: this.clientId,
         data: data,
      }
      this.socket.send(JSON.stringify(message));
   }

   // send a message internally (immediately goes to internalMessageHandler)
   sendInternal(type, data) {
      const message = {
         type: type,
         data: data,
      }
      this.internalMessageHandler(message);
   }

   // add a server listener
   addListener(type, updater) {
      // if (!this.listeners[type]) this.listeners[type] = updater;
      this.listeners[type] = updater;
   }

   // add an internal listener
   addInternalListener(type, updater) {
      if (!this.internalListeners[type]) this.internalListeners[type] = updater;
   }

   // handle server messages
   serverMessageHandler(message) {
      if (message.type === '__pong__') return;
      if (message.type === 'handshake') {
         this.clientId = message.data.clientId;    // grab client id
      } else if (this.listeners[message.type]) {
         this.listeners[message.type](message.data);
      } else {
         console.log(`WARNING: received '${message.type}' message from server, but no listener is available`);
      }
   }

   // handle internal messages
   internalMessageHandler(message) {
      if (this.internalListeners[message.type]) {
         this.internalListeners[message.type](message.data);
      } else {
         console.log(`WARNING: received '${message.type}' internal message, but no listener is available.`);
      }
   }
}

export default new Client;