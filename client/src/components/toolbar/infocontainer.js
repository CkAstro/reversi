import { useState } from 'react';
import client from '../../api/client';
import { useGameInfo } from '../../contexts/gameinfo';
import './index.css';

const InfoContainer = () => {
   const [ usernameInput, setUsernameInput ] = useState('username...');
   const [ isActive, setIsActive ] = useState('');
   const [ gameStatus, setGameStatus ] = useState({ inGame: false, opponent: null });

   const { gameInfo, setPlayerId } = useGameInfo();

   const requestPlayerId = event => {
      event.preventDefault();
      if (usernameInput === 'username...') return;
      client.send('playerIdRequest', {playerId: usernameInput});
      setIsActive('');
   }

   client.addListener('playerIdUpdate', data => {
      setPlayerId(data.playerId);
   });

   const handleInput = event => setUsernameInput(event.target.value);
   const handleFocus = event => {
      setIsActive('active');
      event.target.select();
   }

   const playerIdRequestForm = (
      <form onSubmit={requestPlayerId}>
         <input className={isActive}
            onChange={handleInput}
            onFocus={handleFocus}
            value={usernameInput}
         />
         <button type='submit'>submit</button>
      </form>
   );

   const gameText = <p>You are not in a game.</p>
   const hasPlayerDisplay = <>
      <p>Welcome: {gameInfo.playerId}</p>
      <p>{gameText}</p>
   </>;

   const getPlayerDisplay = <>
      <p>Welcome. Please select a username.</p>
      {playerIdRequestForm}
   </>;

   const display = gameInfo.playerId ? hasPlayerDisplay : getPlayerDisplay;

   return (
      <div className='infoContainer'>
         {display}
      </div>
   );
}

export default InfoContainer;