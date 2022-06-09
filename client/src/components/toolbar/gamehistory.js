import { useState, useEffect } from 'react';
import GameListItem from './gamelistitem';
import './index.css';

const GameHistory = ({ recentGames, playerGames }) => {
   const [ isActive, setIsActive ] = useState(Array(20).fill(''));
   const [ gameView, setGameView ] = useState('recent');

   useEffect(() => {
      const active = isActive.slice();
      active[0] = 'active';
      setIsActive(active);
   }, []);

   const handleActivate = ind => {
      const activate = Array(20).fill('');
      if (!isActive[ind]) activate[ind] = 'active';
      setIsActive(activate);
   }

   const buttons = (
      <div className='historySelectContainer'>
         <div className={`historySelectButton noselect ${gameView === 'recent' ? 'active' : ''}`} 
            onClick={() => setGameView('recent')}>Recent Games</div>
         <div className={`historySelectButton noselect ${gameView === 'player' ? 'active' : ''}`} 
            onClick={() => setGameView('player')}>Player History</div>
      </div>
   );

   const buildGameList = games => {
      if (games.length === 0) return <p>Game history not available.</p>;

      // reformat games before rendering a GameListItem
      return games.map((game, ind) => {
         let blackScore = 0;
         let whiteScore = 0;
         game.finalState.forEach(val => {
            val === 'black' && blackScore++;
            val === 'white' && whiteScore++;
         });

         const formattedGame = {
            gameId: game.gameId,
            gameState: game.finalState,
            black: game.black,
            white: game.white,
            winner: game.winner[0].toUpperCase()+game.winner.slice(1),
            score: `${blackScore} vs ${whiteScore}`,
            turn: game.turn,
         }

         return <GameListItem key={game.gameId}
            gameInfo={formattedGame}
            isActive={isActive[ind]}
            onClick={() => handleActivate(ind)}
         />
      });
   }

   return (
      <div className='gameHistory'>
         {buttons}
         <div className='gameListContainer'>
            <div className='gameList noscrollbar'>
               {buildGameList(gameView === 'recent' ? recentGames : playerGames)}
            </div>
         </div>
      </div>
   );
}

export default GameHistory;