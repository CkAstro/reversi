import { useState, useEffect } from 'react';
import { useActiveGameList } from '../../contexts/activegamelist';
import client from '../../api/client';
import GameObject from './gameobject';

const LiveGames = () => { 
   const [ liveGames, setLiveGames ] = useState([]);
   const { activeGameList } = useActiveGameList();

   const requestObserveGame = gameId => client.send('observeGameRequest', {gameId});

   useEffect(() => {
      if (!activeGameList) return;
      const games = activeGameList.filter(game => game.black && game.white);
      setLiveGames(games);
   }, [activeGameList]);

   return liveGames.map(game => (
      <GameObject key={game.gameId}
         black={game.black}
         white={game.white}
         matchType={game.matchType}
         onClick={() => requestObserveGame(game.gameId)}
      />
   ));
}

export default LiveGames;