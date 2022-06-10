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
      resetGameInfo();
      if (response) return client.send('newGameRequest', {opponent: opponent});
   }


   const myTurn = gameInfo.playerColor === gameInfo.activePlayer;
   const moveText = gameInfo.opponent.playerId ? 
      (myTurn ? `Your move (${gameInfo.playerColor})` : `Opponent's move (${gameInfo.activePlayer})`) :
      `You are ${gameInfo.playerColor}. Waiting on other player...`;

   const skip = myTurn && gameInfo.legalMove === false && !gameInfo.gameOver;

   return (
      <div className='activeGame'>
         <Modal.SkipMessage closeModal={closeSkipModal} isActive={skipModalActive}/>
         <Modal.GameOverMessage closeModal={closeEndModal} isActive={endModalActive} winner={gameInfo.gameOver} response={handleEndGameResponse}/>
         <GameBoard gameState={gameInfo.gameState} activeBoard={myTurn}/>
         <p>{moveText}</p>
      </div>
   );
}

export default ActiveGame;