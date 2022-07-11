import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GameInfoProvider, useGameInfo } from './contexts/gameinfo';
import { ModalProvider, useModal } from './contexts/modal';
import { ActiveGameListProvider, useActiveGameList } from './contexts/activegamelist';
import Header from './components/header';
import Display from './components/display';
import Toolbar from './components/toolbar';
import client from './api/client';
import api from './api';
import Modal from './components/modal';
import ServerMessage from './components/modal/servermessage';
import './index.css';

const Reversi = () => {
   const { handleInfoUpdate } = useGameInfo();
   const { setModalContent } = useModal();
   const { setActiveGameList } = useActiveGameList();

   // run client setup
   useEffect(() => {
      if (client.isInit) return;
      client.init();

      // watch for game updates
      client.addListener('gameUpdate', handleInfoUpdate);
      client.addListener('activeGameUpdate', handleInfoUpdate);

      // watch for live game list update
      client.addListener('currentGameUpdate', setActiveGameList);

      // watch for username update
      client.addListener('playerIdUpdate', handleInfoUpdate);

      // route server error messages to modal
      client.addListener('errorMessage', data => {
         setModalContent(<ServerMessage message={data.errorText}/>);
      });

      // finally, request active games from server
      api.getActiveGames().then(games => setActiveGameList(games));
   }, []);
   
   return (
      <div className='reversiContainer'>
         <Display/>
         <Toolbar/>
         <Modal/>
      </div>
   );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <div className='mainLayout'>
      <Header/>
      <div className='mainContainer'>
         <GameInfoProvider>
            <ActiveGameListProvider>
               <ModalProvider>
                  <Reversi/>
               </ModalProvider>
            </ActiveGameListProvider>
         </GameInfoProvider>
      </div>
   </div>
);