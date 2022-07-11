import { useActiveGameList } from '../../contexts/activegamelist';
import client from '../../api/client';
import GameObject from './gameobject';
import style from './gameselector.module.css';

const GameSelector = () => {
   const { activeGameList } = useActiveGameList();

   const newGame = () => {
      const requestNewGame = () => client.send('newGameRequest', {status: true});
      return <GameObject key={0}
         onClick={() => requestNewGame()}
      />;
   }

   // sort current games for those waiting on a player
   const waitingGames = () => {
      const requestJoinGame = gameId => client.send('joinGameRequest', {gameId: gameId});

      if (activeGameList[0] === null) return null;
      const games = activeGameList ? activeGameList.filter(game => (game.black || game.white) && !(game.black && game.white)) : [];
      return games.map(game => <GameObject key={game.gameId} 
         black={game.black}
         white={game.white}
         matchType={game.matchType}
         onClick={() => requestJoinGame(game.gameId)}
      />);
   }

   // sort current games for those with both players
   const liveGames = () => {
      const requestObserveGame = gameId => client.send('observeGameRequest', {gameId: gameId});

      if (activeGameList[0] === null) return null;
      const games = activeGameList ? activeGameList.filter(game => game.black && game.white) : [];
      return games.map(game => <GameObject key={game.gameId} 
         black={game.black}
         white={game.white}
         matchType={game.matchType}
         onClick={() => requestObserveGame(game.gameId)}
      />);
   }

   return (
      <div className={style.gameSelectContainer}>
         <p>Join a Game</p>
         <div className={style.gameSelect}>
            {newGame()}
            {waitingGames()}
         </div>
         <p>Observe Live Games</p>
         <div className={style.gameSelect}>
            {liveGames()}
         </div>
      </div>
   );
}

export default GameSelector;