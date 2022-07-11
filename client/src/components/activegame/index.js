import { useState, useEffect } from 'react';
import { useGameInfo } from '../../contexts/gameinfo';
import { useModal } from '../../contexts/modal';
import client from '../../api/client';
import GameBoard from '../gameboard';
import BackButton from './backbutton';
import MoveDisplay from './movedisplay';
import OpponentDisplay from './opponentdisplay';
import SkipMessage from '../modal/skipmessage';
import GameOverMessage from '../modal/gameovermessage';
import style from './activegame.module.css';

const ActiveGame = () => {
   const { setModalContent } = useModal();
   const { gameInfo, resetGameInfo } = useGameInfo();

   // record most recent move so we can trigger effects
   const [ lastGameState, setLastGameState ] = useState(null);
   const [ lastMove, setLastMove ] = useState(null);
   useEffect(() => {
      if (gameInfo.turn === null) return;
      if (!lastGameState) return setLastGameState(Array(64).fill(null));

      const { gameState } = gameInfo;
      for (let i=0; i<64; i++) {
         if (gameState[i] && !lastGameState[i]) {
            setLastMove(i);
            break;
         }
      }
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

   const handleEndGameResponse = response => {
      if (response !== null) resetGameInfo();
      if (gameInfo.activeGame) client.send('leaveGameRequest', {status: true});
   }
   
   const myTurn = gameInfo.playerColor === gameInfo.activePlayer;

   return (<>
      <BackButton onClick={() => handleEndGameResponse(false)}/>
      <div className={style.activeGame}>
         <OpponentDisplay/>
         <GameBoard gameState={gameInfo.gameState} activeBoard={myTurn} lastMove={lastMove}/>
         <MoveDisplay/>
      </div>
   </>);
}

export default ActiveGame;