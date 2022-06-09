import 'dotenv/config';
'use strict';

const PORT = process.env.PORT || 3001;
const dbUrl = process.env.MONGODB_URI;

export {
   PORT,
   dbUrl,
}