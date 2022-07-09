import axios from 'axios';

// baseUrl depends on localhost/website
const baseUrl = window.location.host.includes('localhost')
   ? 'http://localhost:3003/api/reversi'
   : (window.location.host.includes('192')
      ? 'http://192.168.3.105:3003/api/reversi'
      : '/api/reversi')
;

// request all active games
const getActiveGames = () => {
   const request = axios.get(`${baseUrl}/active`);
   return request.then(response => response.data);
}

// request all recent games
const getRecentGames = () => {
   const request = axios.get(`${baseUrl}/recent`);
   return request.then(response => response.data);
}

// request player-specific games
const getPlayerGames = playerId => {
   const request = axios.get(`${baseUrl}/playerId/${playerId}`);
   return request.then(response => response.data);
}

export default {
   getActiveGames,
   getRecentGames,
   getPlayerGames
}