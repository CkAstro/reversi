import compression from 'compression';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

import gameService from './services/gameservice/index.js';
import createWebSocket from './api/websocket/index.js';
import { clients } from './api/websocket/clients.js';
import messageHandler from './api/websocket/messagehandler.js';

import { PORT } from './config/index.js';
import API from './api/index.js';
'use strict';

// ----- init ----- //
const app = express();
app.use(compression());
app.use(cors());
app.use(express.json());

// set client ping/pong function 
//    (not necessary unless we're running on Heroku or something...)
messageHandler.addListener('__ping__', ({ clientId, data }) => {
   clients[clientId].send('__pong__', {message: '__pong__'});
});

// ----- log ----- //
const requestLogger = (request, response, next) => {
   const message = {
      method: request.method,
      path: request.path,
      body: request.body,
   }
   console.log('received api call:', message);
   next();
}
app.use(requestLogger);

// ----- REST API ----- //
app.get('/api/reversi/recent', API.getRecentGames);
app.get('/api/reversi/active', API.getActiveGames);
app.get('/api/reversi/playerId/:id', API.getPlayerGames);


// ----- static serving ----- //
app.use(express.static('../client/build'));     // NOTE: this MUST come after API requests

// ----- unknown endpoint ----- //
const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' });
}
app.use(unknownEndpoint);

// ----- listen ----- //
const server = app.listen(PORT, () => console.log(`DataVis server running on port ${PORT}`));

// ----- websocket ----- //
const wsServer = createWebSocket(server);