import { useState } from 'react';
import client from 'api/client';
import style from './toolbar.module.css';

const UsernameArea = ({ playerId }) => {
   const defaultInput = 'username...';
   const [ usernameInput, setUsernameInput ] = useState(defaultInput);

   const requestPlayerId = event => {
      event.preventDefault();
      if (usernameInput === defaultInput) return;
      client.send('playerIdRequest', {playerId: usernameInput});
   }

   const handleInput = event => setUsernameInput(event.target.value);
   const handleFocus = event => event.target.select();

   const playerIdRequestForm = (
      <form className={style.idRequest} onSubmit={requestPlayerId}>
         <input className={usernameInput === defaultInput ? null : style.active}
            onChange={handleInput}
            onFocus={handleFocus}
            value={usernameInput}
         />
         <button type='submit'>Submit</button>
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