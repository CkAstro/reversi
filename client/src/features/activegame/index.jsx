import { useState, useEffect } from 'react';
import { useGameInfo, useModal } from 'contexts';
import { SkipMessage, GameOverMessage, GameBoard } from 'components';
import OpponentDisplay from './opponentdisplay';
import MoveDisplay from './movedisplay';
import style from './activegame.module.css';

const ActiveGame = () => {
   const { setModalContent } = useModal();
   const { gameInfo } = useGameInfo();

   // record most recent move so we can trigger effects
   const [ lastGameState, setLastGameState ] = useState(null);
   const [ lastMove, setLastMove ] = useState(null);
   useEffect(() => {
      if (gameInfo.turn === null) return;
      if (!lastGameState) return setLastGameState(Array(64).fill(null));
      const { gameState } = gameInfo;
      let newLastMove = null;
      for (let i=0; i<64; i++) {
         if (gameState[i] && !lastGameState[i]) {
            if (newLastMove) {
               newLastMove = null;
               break;
            } else {
               newLastMove = i;
            }
         }
      }
      setLastMove(newLastMove);
      setLastGameState(gameState.slice());
   }, [gameInfo.gameState]);

   useEffect(() => {
      if (gameInfo.legalMove || gameInfo.activePlayer !== gameInfo.playerColor || gameInfo.gameOver) return;
      setModalContent(<SkipMessage/>);
   }, [gameInfo.legalMove]);

   useEffect(() => {
      if (!gameInfo.gameOver) return;
      setModalContent(<GameOverMessage/>);
   }, [gameInfo.gameOver]);
   
   const myTurn = gameInfo.playerColor === gameInfo.activePlayer;

   return (
      <div className={style.activeGame}>
         <OpponentDisplay/>
         <GameBoard gameState={gameInfo.gameState} activeBoard={myTurn} lastMove={lastMove}/>
         <MoveDisplay/>
      </div>
   );
}

export default ActiveGame;