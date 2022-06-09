import { useState, useEffect } from 'react';
import InfoContainer from './infocontainer';
import GameHistory from './gamehistory';
import { useGameInfo } from '../../contexts/gameinfo';
import API from '../../api';
import client from '../../api/client';
import './index.css';

const Toolbar = () => {
   const [ recentGames, setRecentGames ] = useState([]);
   const [ playerGames, setPlayerGames ] = useState([]);


   const { setPlayerId } = useGameInfo();

   // listen for player id and update player game list
   client.addListener('playerIdUpdate', data => {
      setPlayerId(data.playerId);
      API.getPlayerGames(data.playerId).then(games => setPlayerGames(games.reverse()));
   });

   // grab recent games on init
   useEffect(() => {
      API.getRecentGames().then(games => setRecentGames(games.reverse()));
   }, []);


   return (
      <div className='toolbarArea'>
         <p>Toolbar</p>
         <InfoContainer/>
         <GameHistory recentGames={recentGames} playerGames={playerGames}/>
      </div>
   );

}

export default Toolbar;