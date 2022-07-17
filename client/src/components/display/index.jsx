import { useGameInfo } from 'contexts';
import { GameSelector, ActiveGame } from 'components';
import style from './display.module.css';

const Display = () => {
   const { gameInfo } = useGameInfo();

   const display = gameInfo.activeGame ? <ActiveGame/> : <GameSelector/>;

   return (
      <div className={style.gameArea}>
         {display}
      </div>
   );
}

export default Display;