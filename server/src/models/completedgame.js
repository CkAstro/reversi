import mongoose from 'mongoose';
import { dbUrl } from '../config/index.js';
'use strict';

// connect to DB
console.log('connecting to', dbUrl);
mongoose.connect(dbUrl)
   .then(result => console.log('connected to MongoDB'))
   .catch(error => console.log('error connecting to MongoDB:', error.message));

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