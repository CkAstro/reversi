import { useState, useEffect, memo } from 'react';
import { useGameInfo } from '../../contexts/gameinfo';
import GameListItem from '../gamelistitem';
import buildGameList from './buildgamelist';
import api from '../../api';
import style from './gamehistory.module.css';

const GameHistory = () => {
   const [ recentGames, setRecentGames ] = useState([]);
   const [ playerGames, setPlayerGames ] = useState([]);
   
   const [ isActive, setIsActive ] = useState(0);
   const [ gameView, setGameView ] = useState('recent');

   const { gameInfo } = useGameInfo();

   // grab recent games from server on init
   useEffect(() => {
      api.getRecentGames()
         .then(games => setRecentGames(buildGameList(games.reverse())));
   }, []);

   // grab player games from server once we know our username
   useEffect(() => {
      if (!gameInfo.playerId) return;
      api.getPlayerGames(gameInfo.playerId)
         .then(games => setPlayerGames(buildGameList(games.reverse())));
   }, [gameInfo.playerId]);

   // set activation (expand history item)
   const handleActivate = ind => {
      if (isActive === ind) return setIsActive(null);
      return setIsActive(ind);
   }

   const buildGameObjects = gameList => gameList.map((game, ind) => (
      <GameListItem key={game.gameId}
         gameInfo={game}
         isActive={isActive === ind}
         onClick={() => handleActivate(ind)}
      />
   ));

   const buttons = (
      <div className={style.historySelectContainer}>
         <div className={`noselect ${style.historySelectButton} ${gameView === 'recent' ? style.active : ''}`} 
            onClick={() => setGameView('recent')}>Recent Games</div>
         <div className={`noselect ${style.historySelectButton} ${gameView === 'player' ? style.active : ''}`} 
            onClick={() => setGameView('player')}>Player History</div>
      </div>
   );

   return (
      <div className={style.gameHistory}>
         {buttons}
         <div className={style.gameListContainer}>
            <div className={`noscrollbar ${style.gameList}`}>
               {buildGameObjects(gameView === 'recent' ? recentGames : playerGames)}
            </div>
         </div>
      </div>
   );
}

export default memo(GameHistory);