import { useGameInfo } from '../../contexts/gameinfo';
import style from './toolbar.module.css';

const GameInfoArea = () => {
   const { gameInfo } = useGameInfo();

   const gameTextHeader = gameInfo.opponent.playerId ? <p>Game in progress</p> : <p>Waiting on opponent to join</p>

   const gameInfoText = () => {
      const blackPlayer = gameInfo.black || 'n/a';
      const whitePlayer = gameInfo.white || 'n/a';
      return <>
         <p>{blackPlayer ? `Black: ${blackPlayer}`: null}</p>
         <p>{whitePlayer ? `White: ${whitePlayer}`: null}</p>
      </>;
   }

   return (
      <div className={style.gameText}>
         {gameTextHeader}
         {gameInfoText()}
      </div>
   );
}

export default GameInfoArea;