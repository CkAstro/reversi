import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/header';
import Display from './components/display';
import Toolbar from './components/toolbar';
import client from './api/client';
import { GameInfoProvider } from './contexts/gameinfo';
import './index.css';
import { ModalProvider } from './contexts/modal';

const Reversi = () => {
   useEffect(() => {
      if (!client.isInit) client.init();
   }, []);
   
   return (
      <div className='reversiContainer'>
            <GameInfoProvider>
               <ModalProvider>
                  <Display/>
                  <Toolbar/>
               </ModalProvider>
            </GameInfoProvider>
      </div>
   );
}

const App = () => {
   return (
      <div className='mainLayout'>
         <Header/>
         <div className='mainContainer'>
            <Reversi/>
         </div>
      </div>
   );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <App/>
);