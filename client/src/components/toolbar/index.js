import { useState, useEffect } from 'react';
import InfoContainer from './infocontainer';
import GameHistory from './gamehistory';
import API from '../../api';
import './index.css';

const Toolbar = () => {
   const [ recentGames, setRecentGames ] = useState([]);
   const [ playerGames, setPlayerGames ] = useState([]);

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