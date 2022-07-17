import { useGameInfo } from 'contexts';
import { ActiveGame } from 'features';
import { GameSelector } from 'components';
import BackButton from './backbutton';
import HelpButton from './helpbutton';
import style from './display.module.css';

const Display = () => {
   const { gameInfo } = useGameInfo();

   const display = gameInfo.activeGame ? <ActiveGame/> : <GameSelector/>;
   const hasBackButton = gameInfo.activeGame;

   return (
      <div className={style.gameArea}>
         <div className={style.gameArea__buttonContainer}>
            <HelpButton/>
            {hasBackButton ? <BackButton/> : null}
         </div>
         {display}
      </div>
   );
}

export default Display;