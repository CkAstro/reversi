import MockClient from './mockclient.js';
import CompletedGame from '../../models/completedgame.js';
import handleNewGameRequest from '../gameservice/newgamerequest.js';
import handleMoveRequest from '../gameservice/moverequest.js';
import { replayCount } from '../../config/index.js';
import { clients } from '../../api/websocket/clients.js';
'use strict';
// goal here is to always have a replay going; chosen from completed games
// mainly allows recruiters to test the observe function...

const getVariableWaitTime = () => 500 + 8000 * (0.25 - (Math.random()-0.5)**2)

let recentGameList;
const getRecentGames = () => CompletedGame.find({});

const initMockMatch = () => {
   const match = recentGameList[Math.floor(Math.random()*recentGameList.length)];
   const mockClients = {
      black: new MockClient(match.black, match.black),
      white: new MockClient(match.white, match.white),
   }
   clients[mockClients.black.clientId] = mockClients.black;
   clients[mockClients.white.clientId] = mockClients.white;

   const whiteOpponent = {
      clientId: mockClients.black.clientId,
      playerId: mockClients.black.playerId,
   }

   handleNewGameRequest({ clientId: mockClients.black.clientId, data: {status: true} });
   handleNewGameRequest({ clientId: mockClients.white.clientId, data: {opponent: whiteOpponent} });

   playMockMatch(match, mockClients);
}

const playMockMatch = (match, mockClients) => {
   const requestMove = () => {
      const waitTime = getVariableWaitTime();
      if (mockClients.black.activeGame.observers.length === 0) return setTimeout(requestMove, 2000);
      const player = match.moveHistory[gameMove].player;
      const clientId = mockClients[player].clientId;
      const legalMove = clients[clientId].activeGame.legalMove;
      const move = legalMove ? match.moveHistory[gameMove].move : '__skip__';
      handleMoveRequest({ clientId: clientId, data: {move: move} }, true);
      legalMove && gameMove++;

      if (gameMove === match.moveHistory.length) return initMockMatch();
      const delayMove = setTimeout(requestMove, parseInt(waitTime));
   }

   let gameMove = 0;
   requestMove();
}

// initialize replay service
const init = async () => {

   // we'll just do one for now
   recentGameList = await getRecentGames();
   initMockMatch(recentGameList);

   return console.log(`replay service initialized with n=${replayCount} replays`);
}

export default { init };