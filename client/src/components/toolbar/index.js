import { useState, useEffect } from 'react';
import { useGameInfo } from '../../contexts/gameinfo';
import InfoContainer from './infocontainer';
import GameHistory from './gamehistory';
import api from '../../api';
import style from './toolbar.module.css';

const Toolbar = () => {
   const [ recentGames, setRecentGames ] = useState([]);
   const [ playerGames, setPlayerGames ] = useState([]);
   const { gameInfo } = useGameInfo();

   // listen for player id and update player game list
   useEffect(() => {
      if (!gameInfo.playerId) return;
      api.getPlayerGames(gameInfo.playerId).then(games => setPlayerGames(games.reverse()));
   }, [gameInfo.playerId]);

   // grab recent games on init
   useEffect(() => {
      api.getRecentGames().then(games => setRecentGames(games.reverse()));
   }, []);

   return (
      <div className={style.toolbarArea}>
         <p>Toolbar</p>
         <div className={style.toolbarFlexContainer}>
            <InfoContainer/>
            <GameHistory recentGames={recentGames} playerGames={playerGames}/>
         </div>
      </div>
   );

}

export default Toolbar;