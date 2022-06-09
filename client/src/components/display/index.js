import { useGameInfo } from '../../contexts/gameinfo';
import GameSelector from '../gameselector';
import ActiveGame from '../activegame';
import client from '../../api/client';
import './index.css';

const Display = () => {
   const { gameInfo, handleInfoUpdate } = useGameInfo();

   // listen for game join triggers
   client.addListener('activeGameUpdate', handleInfoUpdate);

   const display = gameInfo.activeGame ? 
      <ActiveGame/> : 
      <GameSelector/> ;
   
   return (
      <div className='gameArea'>
         {display}
      </div>
   );
}

export default Display;