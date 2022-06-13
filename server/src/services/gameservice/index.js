import messageHandler from '../../api/websocket/messagehandler.js';
import handlePlayerIdRequest from './playeridrequest.js';
import handleMoveRequest from './moverequest.js';
import handleNewGameRequest from './newgamerequest.js';
import handleJoinGameRequest from './joingamerequest.js';
import handleObserveGameRequest from './observegamerequest.js';
import handleLeaveGameRequest from './leavegamerequest.js';
'use strict';

// request playerId
messageHandler.addListener('playerIdRequest', handlePlayerIdRequest);

// create new game for client
messageHandler.addListener('newGameRequest', handleNewGameRequest);

// join existing game based on gameId
messageHandler.addListener('joinGameRequest', handleJoinGameRequest);

// observe game based on gameId
messageHandler.addListener('observeGameRequest', handleObserveGameRequest);

// request move for active game
messageHandler.addListener('moveRequest', handleMoveRequest);

// request to leave game
messageHandler.addListener('leaveGameRequest', handleLeaveGameRequest);

// listeners load on import
export default null;