import { useGameInfo } from 'contexts';
import style from './activegame.module.css';

const OpponentDisplay = () => {
   const { gameInfo } = useGameInfo();

   const isObserving = gameInfo.playerColor === 'observer';
   const opponent = gameInfo.opponent ? gameInfo.opponent.playerId : null;

   const displayText = isObserving 
      ?  <>
            <span className={style.playerNameText}>{gameInfo.black}</span> 
            <span className={style.playerVsText}>vs</span>
            <span className={style.playerNameText}>{gameInfo.white}</span>
         </> 
      : <span className={style.playerNameText}>{opponent}</span>
   ;
   return <p>{displayText}</p>;
}

export default OpponentDisplay;