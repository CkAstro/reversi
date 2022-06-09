import { useState, useEffect } from 'react';
import API from '../../api';
import client from '../../api/client';
import './index.css';

const NewGame = () => {
   const requestNewGame = () => client.send('newGameRequest', {status: true});

   return (
      <div className='game newGame' onClick={requestNewGame}>
         <p>Start New Game</p>
      </div>
   );
}

const WaitingGame = ({ gameId, text }) => {
   const requestJoinGame = () => client.send('joinGameRequest', {gameId: gameId});
   
   return (
      <div className='game waitingGame' onClick={requestJoinGame}>
         <p>{text}</p>
      </div>
   );
}

const LiveGame = ({ gameId, text }) => {
   const requestObserveGame = () => client.send('observeGameRequest', {gameId: gameId});

   return (
      <div className='game liveGame' onClick={requestObserveGame}>
         <p>{text}</p>
      </div>
   );
}

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

   // sort current games for those waiting on a player
   const waitingGames = () => {
      if (currentGames[0] === null) return null;
      const games = currentGames ? currentGames.filter(game => (game.black || game.white) && !(game.black && game.white)) : [];
      return games.map(game => (
         <WaitingGame key={game.gameId}
            gameId={game.gameId}
            text={game.black ? game.black : game.white}
         />
      ));
   }

   // sort current games for those with both players
   const liveGames = () => {
      if (currentGames[0] === null) return null;
      const games = currentGames ? currentGames.filter(game => game.black && game.white) : [];
      return games.map(game => {
         <LiveGame key={game.gameId}
            gameId={game.gameId}
            text={`${game.black} vs ${game.white}`}
         />
      });
   }

   return (
      <div className='gameSelectContainer'>
         <div className='gameSelect'>
            <p>Join a Game</p>
            <NewGame key={0}/>
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