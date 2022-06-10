import { clients } from '../../api/websocket/clients.js';

const handlePlayerIdRequest = ({ clientId, data }) => {
   const playerId = data.playerId;
   const client = clients[clientId];

   // accept all usernames for now
   client.playerId = playerId;
   client.send('playerIdUpdate', {playerId: playerId});
}

export default handlePlayerIdRequest;