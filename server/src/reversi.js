import compression from 'compression';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

import { PORT } from './config/index.js';
import API from './api/index.js';
'use strict';

// ----- init ----- //
const app = express();
app.use(compression());
app.use(cors());
app.use(express.json());

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


// ----- static serving ----- //
app.use(express.static('../client/build'));     // NOTE: this MUST come after API requests

// ----- unknown endpoint ----- //
const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' });
}
app.use(unknownEndpoint);

// ----- listen ----- //
const server = app.listen(PORT, () => console.log(`DataVis server running on port ${PORT}`));