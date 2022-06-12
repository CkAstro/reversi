import { useState, useEffect } from 'react';
import { useGameInfo } from '../../contexts/gameinfo';
import client from '../../api/client';
import GameBoard from '../gameboard';
import Modal from '../modal';
import './index.css';

const ActiveGame = () => {
   const [ skipModalActive, setSkipModalActive ] = useState(false);
   const [ endModalActive, setEndModalActive ] = useState(false);
   const { gameInfo, handleInfoUpdate, resetGameInfo } = useGameInfo();

   const [ lastGameState, setLastGameState ] = useState(Array(64).fill(null));
   const [ test, setTest ] = useState(Array(64).fill(null));
   useEffect(() => {
      const newInteract = Array(64).fill(null);
      for (let i=0; i<64; i++) {
         if (test[i] !== null) {
            newInteract[i] = 'flip';
         } else if (lastGameState[i] === null && gameInfo.gameState[i] !== null) {
            newInteract[i] = 'place flip';
         } else if (lastGameState[i] !== null && gameInfo.gameState[i] !== lastGameState[i]) {
            newInteract[i] = 'flip';
         } else {
            newInteract[i] = null;
         }
      }
      setTest(newInteract);
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
      if (response) return client.send('newGameRequest', {opponent: opponent});
   }


   const myTurn = gameInfo.playerColor === gameInfo.activePlayer;


   const activeGameText = myTurn ? `Your move (${gameInfo.playerColor})` : `Opponent's move (${gameInfo.activePlayer})`;
   const altText = gameInfo.playerColor === 'observer' ? 
      'Observing match.' : `You are ${gameInfo.playerColor}. Waiting on other player...`;


   const moveText = gameInfo.opponent.playerId ? activeGameText : altText;
      

   const skip = myTurn && gameInfo.legalMove === false && !gameInfo.gameOver;

   return (
      <div className='activeGame'>
         <Modal.SkipMessage closeModal={closeSkipModal} isActive={skipModalActive}/>
         <Modal.GameOverMessage closeModal={closeEndModal} isActive={endModalActive} winner={gameInfo.gameOver} response={handleEndGameResponse} playerColor={gameInfo.playerColor}/>
         <GameBoard gameState={gameInfo.gameState} activeBoard={myTurn} test={test}/>
         <p>{moveText}</p>
      </div>
   );
}

export default ActiveGame;