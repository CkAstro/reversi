import 'dotenv/config';
'use strict';

const PORT = process.env.PORT || 3001;
const dbUrl = process.env.MONGODB_URI;
const replayCount = process.env.REPLAY_COUNT || 1;

export {
   PORT,
   dbUrl,
   replayCount,
}