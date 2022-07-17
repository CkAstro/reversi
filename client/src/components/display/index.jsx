import { useGameInfo } from '../../contexts/gameinfo';
import GameSelector from '../gameselector';
import ActiveGame from '../activegame';
import style from './display.module.css';

const Display = () => {
   const { gameInfo } = useGameInfo();

   const display = gameInfo.activeGame
      ? <ActiveGame/>
      : <GameSelector/>
   ;

   return (
      <div className={style.gameArea}>
         {display}
      </div>
   );
}

export default Display;