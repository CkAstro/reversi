import { useState } from 'react';
import client from '../../api/client';
import style from './toolbar.module.css';

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
         <input className={isActive ? style.active : null}
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

export default UsernameArea;