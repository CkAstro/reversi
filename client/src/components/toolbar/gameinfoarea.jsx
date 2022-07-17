import { useGameInfo } from 'contexts';
import style from './toolbar.module.css';

const GameInfoArea = () => {
   const { gameInfo } = useGameInfo();

   const gameTextHeader = gameInfo.opponent.playerId 
      ? <p>Game in progress</p> 
      : <p>Waiting on opponent to join</p>
   ;

   const gameInfoText = () => {
      const na = 'n/a';
      const blackPlayer = gameInfo.black || na;
      const whitePlayer = gameInfo.white || na;
      return (
         <>
            <p>{blackPlayer ? `Black: ${blackPlayer === na && whitePlayer === na ? 'you!' : blackPlayer}`: null}</p>
            <p>{whitePlayer ? `White: ${whitePlayer}`: null}</p>
         </>
      );
   }

   return (
      <div className={style.gameText}>
         {gameTextHeader}
         {gameInfoText()}
      </div>
   );
}

export default GameInfoArea;