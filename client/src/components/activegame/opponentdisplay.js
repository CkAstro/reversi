import { useGameInfo } from '../../contexts/gameinfo';

const OpponentDisplay = () => {
   const { gameInfo } = useGameInfo();

   const isObserving = gameInfo.playerColor === 'observer';
   const opponent = gameInfo.opponent ? gameInfo.opponent.playerId : null;

   const displayText = isObserving ? <>
         <span className='playerNameText'>{gameInfo.black}</span> 
         <span className='playerVsText'>vs</span>
         <span className='playerNameText'>{gameInfo.white}</span>
      </> : <span className='playerNameText'>{opponent}</span>;
   return <p>{displayText}</p>;
}

export default OpponentDisplay;