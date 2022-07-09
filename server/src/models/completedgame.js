import mongoose from 'mongoose';
import { dbUrl } from '../config/index.js';
import logger from '../utils/logger.js';
'use strict';

// connect to DB
logger('connecting to', dbUrl);
mongoose.connect(dbUrl)
   .then(result => logger('connected to MongoDB'))
   .catch(error => logger('error connecting to MongoDB:', error.message));

// define CompletedGame
const completedGameSchema = new mongoose.Schema({
   gameId: String,
   moveHistory: Array,
   finalState: Array,
   winner: String,
   black: String,
   white: String,
   turn: Number,
   time: Number,
});

// when returning, remove some junk
completedGameSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
   }
});

const CompletedGame =  mongoose.model('CompletedGame', completedGameSchema);

export default CompletedGame;