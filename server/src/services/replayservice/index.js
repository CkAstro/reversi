import MockClient from './mockclient.js';
import CompletedGame from '../../models/completedgame.js';
import handleNewGameRequest from '../gameservice/newgamerequest.js';
import handleMoveRequest from '../gameservice/moverequest.js';
import { replayCount } from '../../config/index.js';
import { clients } from '../../api/websocket/clients.js';
'use strict';
// goal here is to always have a replay going; chosen from completed games
// mainly allows recruiters to test the observe function...

const getVariableWaitTime = () => Math.floor(1500 + 10000 * (0.25 - (Math.random()-0.5)**2));

let recentGameList;
const getRecentGames = () => CompletedGame.find({});

// NOTE: we pass replayInd to ensure clientIds are unique
const initMockMatch = replayInd => {
   const match = recentGameList[Math.floor(Math.random()*recentGameList.length)];

   const blackClientId = `${match.black}-${replayInd}`;
   const whiteClientId = match.black === match.white ? `${replayInd}-${match.white}` : `${match.white}-${replayInd}`;

   const mockClients = {
      black: new MockClient(blackClientId, match.black),
      white: new MockClient(whiteClientId, match.white),
   }
   clients[mockClients.black.clientId] = mockClients.black;
   clients[mockClients.white.clientId] = mockClients.white;

   const whiteOpponent = {
      clientId: mockClients.black.clientId,
      playerId: mockClients.black.playerId,
   }

   handleNewGameRequest({ clientId: mockClients.black.clientId, data: {status: true} }, true);
   handleNewGameRequest({ clientId: mockClients.white.clientId, data: {opponent: whiteOpponent} }, true);

   playMockMatch(match, mockClients, replayInd);
}

const playMockMatch = (match, mockClients, replayInd) => {
   const requestMove = () => {
      if (mockClients.black.activeGame.observers.length === 0) return setTimeout(requestMove, 2000);
      const player = match.moveHistory[gameMove].player;
      const clientId = mockClients[player].clientId;
      const legalMove = clients[clientId].activeGame.legalMove;
      const move = legalMove ? match.moveHistory[gameMove].move : '__skip__';
      handleMoveRequest({ clientId: clientId, data: {move: move} }, true);
      legalMove && gameMove++;

      if (gameMove === match.moveHistory.length) return initMockMatch(replayInd);
      setTimeout(requestMove, getVariableWaitTime());
   }

   let gameMove = 0;
   requestMove();
}

// initialize replay service
const init = async () => {

   // we'll just do one for now
   recentGameList = await getRecentGames();
   for (let i=0; i<replayCount; i++) {
      initMockMatch(i);
   }

   return console.log(`replay service initialized with n=${replayCount} replays`);
}

export default { init };