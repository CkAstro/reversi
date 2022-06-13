import { useState, useEffect } from 'react';
import { useGameInfo } from '../../contexts/gameinfo';
import client from '../../api/client';
import GameBoard from '../gameboard';
import Modal from '../modal';
import BackButton from './backbutton';
import MoveDisplay from './movedisplay';
import OpponentDisplay from './opponentdisplay';
import './index.css';

const ActiveGame = () => {
   const [ skipModalActive, setSkipModalActive ] = useState(false);
   const [ endModalActive, setEndModalActive ] = useState(false);
   const { gameInfo, handleInfoUpdate, resetGameInfo } = useGameInfo();

   const [ lastGameState, setLastGameState ] = useState(Array(64).fill(null));
   const [ renderState, setRenderState ] = useState(Array(64).fill(null));
   useEffect(() => {
      const newInteract = Array(64).fill(null);
      for (let i=0; i<64; i++) {
         if (renderState[i] !== null) {
            newInteract[i] = 'flip';
         } else if (lastGameState[i] === null && gameInfo.gameState[i] !== null) {
            newInteract[i] = 'place flip';
         } else if (lastGameState[i] !== null && gameInfo.gameState[i] !== lastGameState[i]) {
            newInteract[i] = 'flip';
         } else {
            newInteract[i] = null;
         }
      }
      setRenderState(newInteract);
      setLastGameState(gameInfo.gameState.slice());
   }, [gameInfo.gameState]);

   // listen for game update (player makes a move, etc)
   client.addListener('gameUpdate', handleInfoUpdate);

   useEffect(() => {
      if (gameInfo.legalMove || gameInfo.activePlayer !== gameInfo.playerColor || gameInfo.gameOver) return;
      setSkipModalActive(true);
      client.send('moveRequest', {move: '__skip__'});
   }, [gameInfo.legalMove]);
   const closeSkipModal = () => setSkipModalActive(false); 

   useEffect(() => {
      if (!gameInfo.gameOver) return;
      setEndModalActive(true);
   }, [gameInfo.gameOver]);
   const closeEndModal = () => setEndModalActive(false);

   const handleEndGameResponse = response => {
      const opponent = gameInfo.opponent;
      if (response !== null) resetGameInfo();
      if (gameInfo.activeGame) client.send('leaveGameRequest', {status: true});
      if (response) return client.send('newGameRequest', {opponent: opponent});
   }
   
   const myTurn = gameInfo.playerColor === gameInfo.activePlayer;

   return (<>
      <BackButton onClick={() => handleEndGameResponse(false)}/>
      <Modal.SkipMessage 
         closeModal={closeSkipModal} 
         isActive={skipModalActive}
      />
      <Modal.GameOverMessage 
         closeModal={closeEndModal} 
         isActive={endModalActive} 
         winner={gameInfo.gameOver} 
         response={handleEndGameResponse} 
         playerColor={gameInfo.playerColor}
      />
      <div className='activeGame'>
         <OpponentDisplay/>
         <GameBoard gameState={gameInfo.gameState} activeBoard={myTurn} renderState={renderState}/>
         <MoveDisplay/>
      </div>
   </>);
}

export default ActiveGame;