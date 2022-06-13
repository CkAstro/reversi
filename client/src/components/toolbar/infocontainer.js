import { useGameInfo } from '../../contexts/gameinfo';
import GameInfo from './gameinfoarea';
import UsernameArea from './usernamearea';
import './index.css';

const InfoContainer = () => {
   const { gameInfo } = useGameInfo();

   const gameText = gameInfo.activeGame ? <GameInfo/> : <p>You are not currently in a game.</p>;

   return (
      <div className='infoContainer'>
         <UsernameArea playerId={gameInfo.playerId}/>
         {gameInfo.playerId ? gameText : null}
      </div>
   );
}

export default InfoContainer;