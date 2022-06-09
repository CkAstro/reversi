import { useGameInfo } from '../../contexts/gameinfo';
import GameSelector from '../gameselector';
import ActiveGame from '../activegame';
import './index.css';

const Display = () => {

   const { gameInfo } = useGameInfo();

   // const display = gameInfo.activeGame ? 
   //    <ActiveGame/> : 
   //    <GameSelector/> ;

   const display = <ActiveGame/>
   
   return (
      <div className='gameArea'>
         {display}
      </div>
   );
}

export default Display;