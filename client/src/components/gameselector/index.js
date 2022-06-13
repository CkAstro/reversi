import { useState, useEffect } from 'react';
import API from '../../api';
import client from '../../api/client';
import GameObject from './gameobject';
import './index.css';

const GameSelector = () => {
   const [ currentGames, setCurrentGames ] = useState([]);

   // grab current games from API call on init
   useEffect(() => {
      API.getActiveGames().then(games => setCurrentGames(games));
   }, []);

   // then listen to websocket for updates
   client.addListener('currentGameUpdate', data => {
      setCurrentGames(data);
   });

   const newGame = () => {
      const requestNewGame = () => client.send('newGameRequest', {status: true});
      return <GameObject key={0}
         onClick={() => requestNewGame()}
      />;
   }

   // sort current games for those waiting on a player
   const waitingGames = () => {
      const requestJoinGame = gameId => client.send('joinGameRequest', {gameId: gameId});
      if (currentGames[0] === null) return null;
      const games = currentGames ? currentGames.filter(game => (game.black || game.white) && !(game.black && game.white)) : [];
      return games.map(game => <GameObject key={game.gameId} 
         black={game.black}
         white={game.white}
         matchType={game.matchType}
         onClick={() => requestJoinGame(game.gameId)}
      />);
   }

   // sort current games for those with both players
   const liveGames = () => {
      const requestObserveGame = gameId => client.send('observeGameRequest', {gameId: gameId});

      if (currentGames[0] === null) return null;
      const games = currentGames ? currentGames.filter(game => game.black && game.white) : [];
      return games.map(game => <GameObject key={game.gameId} 
         black={game.black}
         white={game.white}
         matchType={game.matchType}
         onClick={() => requestObserveGame(game.gameId)}
      />);
   }

   return (
      <div className='gameSelectContainer'>
         <div className='gameSelect'>
            <p>Join a Game</p>
            {newGame()}
            {waitingGames()}
         </div>
         <div className='gameSelect'>
            <p>Observe Live Games</p>
            {liveGames()}
         </div>
      </div>
   );
}

export default GameSelector;