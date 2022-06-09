import { useState, useEffect, useContext, createContext } from 'react';

const defaultInfo = {
   playerId: null,
   activeGame: false,
   color: null,
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

   const setPlayerId = playerId => {
      const newInfo = { ...gameInfo };
      newInfo.playerId = playerId;
      setGameInfo(newInfo);
   }

   return {
      gameInfo,
      setPlayerId,
   }
}

export {
   GameInfoProvider,
   useGameInfo,
}