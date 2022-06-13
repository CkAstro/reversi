import { useGameInfo } from '../../contexts/gameinfo';
import './index.css';

const GameInfo = () => {
   const { gameInfo } = useGameInfo();

   const gameTextHeader = gameInfo.opponent.playerId ? <p>Game in progress</p> : <p>Waiting on opponent to join</p>

   const gameInfoText = () => {
      const opponent = gameInfo.opponent.playerId || 'n/a';
      const blackPlayer = gameInfo.playerColor === 'black' ? gameInfo.playerId : opponent;
      const whitePlayer = gameInfo.playerColor === 'white' ? gameInfo.playerId : opponent;
      return <>
         <p>{blackPlayer ? `Black: ${blackPlayer}`: null}</p>
         <p>{whitePlayer ? `White: ${whitePlayer}`: null}</p>
      </>;
   }

   return (
      <div className='gameText'>
         {gameTextHeader}
         {gameInfoText()}
      </div>
   );
}

export default GameInfo;