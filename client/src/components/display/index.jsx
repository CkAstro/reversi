import { useGameInfo } from 'contexts';
import { ActiveGame } from 'features';
import { GameSelector } from 'components';
import BackButton from './backbutton';
import client from 'api/client';
import style from './display.module.css';

const Display = () => {
   const { gameInfo, resetGameInfo } = useGameInfo();

   const display = gameInfo.activeGame ? <ActiveGame/> : <GameSelector/>;
   const hasBackButton = gameInfo.activeGame;

   const handlePressBack = () => {
      resetGameInfo();
      client.send('leaveGameRequest', {status: true});
   }

   return (
      <div className={style.gameArea}>
         {hasBackButton ? <BackButton onClick={handlePressBack}/> : null}
         {display}
      </div>
   );
}

export default Display;