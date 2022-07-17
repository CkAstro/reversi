import { useState, useContext, createContext } from 'react';

const ActiveGameListContext = createContext();
const ActiveGameListProvider = ({ children }) => {
   const [ activeGameList, setActiveGameList ] = useState([]);

   return (
      <ActiveGameListContext.Provider value={[activeGameList, setActiveGameList]}>
         {children}
      </ActiveGameListContext.Provider>
   );
}

const useActiveGameList = () => {
   const [ activeGameList, setActiveGameList ] = useContext(ActiveGameListContext);

   return {
      activeGameList,
      setActiveGameList,
   }
}

export { ActiveGameListProvider, useActiveGameList };