import { useGameInfo } from '../../contexts/gameinfo';
import GameSelector from '../gameselector';
import './index.css';

const ActiveGame = () => {
   return <p>Active Game!</p>
}

const Display = () => {

   const { gameInfo } = useGameInfo();

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