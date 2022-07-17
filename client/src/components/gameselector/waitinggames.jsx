import { useState, useEffect } from 'react';
import { useActiveGameList } from '../../contexts/activegamelist';
import client from '../../api/client';
import GameObject from './gameobject';

const WaitingGames = () => { 
   const [ waitingGames, setWaitingGames ] = useState([]);
   const { activeGameList } = useActiveGameList();

   const requestJoinGame = gameId => client.send('joinGameRequest', {gameId});

   useEffect(() => {
      if (!activeGameList) return;
      const games = activeGameList.filter(game => (game.black && !game.white) || (!game.black && game.white));
      setWaitingGames(games);
   }, [activeGameList]);

   return waitingGames.map(game => (
      <GameObject key={game.gameId}
         black={game.black}
         white={game.white}
         matchType={game.matchType}
         onClick={() => requestJoinGame(game.gameId)}
      />
   ));
}

export default WaitingGames;