import { memo } from 'react';
import { useGameInfo, useModal } from 'contexts';
import client from 'api/client';
import style from './modal.module.css';

const GameOverMessage = () => {
   const { closeModal } = useModal();
   const { gameInfo, resetGameInfo } = useGameInfo();
   const { gameOver, playerColor } = gameInfo;

   const winner = gameOver === playerColor 
      ? 'You win' 
      : `${gameOver[0].toUpperCase()+gameOver.slice(1)} wins`
   ;

   const handleResponse = response => {
      const { opponent } = gameInfo;
      if (response !== null) resetGameInfo();
      if (response) client.send('newGameRequest', {opponent: opponent});
      closeModal();
   }

   const message = playerColor === 'observer' 
      ? 'Return to lobby?' 
      : 'Would you like a rematch?'
   ;

   const onClickYes = playerColor === 'observer' ? false : true;
   const onClickNo = playerColor === 'observer' ? null : false;

   return (
      <>
         <h1>Game Over</h1>
         <p>{winner}! {message}</p>
         <div className={`noselect ${style.respondYesButton}`} onClick={() => handleResponse(onClickYes)}>Yes</div>
         <div className={`noselect ${style.respondNoButton}`} onClick={() => handleResponse(onClickNo)}>No</div>
      </>
   );
}

export default memo(GameOverMessage);