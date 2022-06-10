import { useState, useEffect } from 'react';
import { useGameInfo } from '../../contexts/gameinfo';
import GameSelector from '../gameselector';
import ActiveGame from '../activegame';
import client from '../../api/client';
import Modal from '../modal';
import './index.css';

const Display = () => {
   const [ modalActive, setModalActive ] = useState(false);
   const [ modalContent, setModalContent ] = useState('');
   const { gameInfo, handleInfoUpdate } = useGameInfo();

   // listen for game join triggers
   client.addListener('activeGameUpdate', handleInfoUpdate);

   const display = gameInfo.activeGame ? 
      <ActiveGame/> : 
      <GameSelector/> ;

   client.addListener('errorMessage', data => {
      setModalContent(<p>{data.errorText}</p>);
      setModalActive(true);
   });

   const closeModal = () => setModalActive(false);

   return (<>
      <Modal.ServerMessage closeModal={closeModal} isActive={modalActive}>{modalContent}</Modal.ServerMessage>
      <div className='gameArea'>
         {display}
      </div>
   </>);
}

export default Display;