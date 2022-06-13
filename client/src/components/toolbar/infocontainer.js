import { useState } from 'react';
import client from '../../api/client';
import { useGameInfo } from '../../contexts/gameinfo';
import GameInfo from './gameinfoarea';
import './index.css';

const InfoContainer = () => {
   const { gameInfo } = useGameInfo();

   const gameText = gameInfo.activeGame ? <GameInfo/> : <p>You are not currently in a game.</p>;

   return (
      <div className='infoContainer'>
         <UsernameArea playerId={gameInfo.playerId}/>
         {gameInfo.playerId ? gameText : null}
      </div>
   );
}

const UsernameArea = ({ playerId }) => {
   const [ usernameInput, setUsernameInput ] = useState('username...');
   const [ isActive, setIsActive ] = useState('');

   const requestPlayerId = event => {
      event.preventDefault();
      if (usernameInput === 'username...') return;
      client.send('playerIdRequest', {playerId: usernameInput});
      setIsActive('');
   }

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

   const hasPlayerId = <p>Welcome: {playerId}</p>;
   const needsPlayerId = <>
      <p>Welcome. Please select a username.</p>
      {playerIdRequestForm}
   </>;

   const display = playerId ? hasPlayerId : needsPlayerId;
   return display;
}

export default InfoContainer;