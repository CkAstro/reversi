import { useState, useEffect, useContext, createContext } from 'react';
import client from '../api/client';

const defaultInfo = {
   playerId: null,
   activeGame: false,
   playerColor: null,
   opponent: null,
   gameState: Array(64).fill(null),
   turn: null,
   activePlayer: null,
   legalMove: null,
   gameOver: null,
}

const GameInfoContext = createContext();

const GameInfoProvider = ({ children }) => {
   const [ gameInfo, setGameInfo ] = useState(defaultInfo);

   return (
      <GameInfoContext.Provider value={[gameInfo, setGameInfo]}>
         {children}
      </GameInfoContext.Provider>
   );
}

const useGameInfo = () => {
   const [ gameInfo, setGameInfo ] = useContext(GameInfoContext);

   const handleInfoUpdate = data => {
      const newInfo = {
         ..._BUGFIX_gameInfo,    // should be ...gameInfo,
         ...data,
      };
      _BUGFIX_gameInfo = newInfo;
      setGameInfo(newInfo);
   }

   return {
      gameInfo,
      handleInfoUpdate,
   }
}

// BUG FIX
// note : this fix may be nullified by combining 'activeGameUpdate' and
//    'gameUpdate' messages server-side
//
// issue : if 'setGameInfo()' is called too quickly, e.g., from successive
//    'activeGameUpdate' and 'gameUpdate' messages when a game initializes
//    (both players have joined)
//
// fix : we define a localized global to store the values so when we build 
//    the 'newInfo' variable, we have access to most recent values
let _BUGFIX_gameInfo = { ...defaultInfo };

export {
   GameInfoProvider,
   useGameInfo,
}