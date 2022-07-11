import { useGameInfo } from '../../contexts/gameinfo';
import GameInfoArea from './gameinfoarea';
import UsernameArea from './usernamearea';
import style from './toolbar.module.css';

const InfoContainer = () => {
   const { gameInfo } = useGameInfo();

   const gameText = gameInfo.activeGame 
      ? <GameInfoArea/> 
      : <p>You are not currently in a game.</p>
   ;

   return (
      <div className={style.infoContainer}>
         <UsernameArea playerId={gameInfo.playerId}/>
         {gameInfo.playerId ? gameText : null}
      </div>
   );
}

export default InfoContainer;