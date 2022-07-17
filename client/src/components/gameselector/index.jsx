import client from '../../api/client';
import GameObject from './gameobject';
import WaitingGames from './waitinggames';
import LiveGames from './livegames';
import style from './gameselector.module.css';

const GameSelector = () => {
   const newGame = () => {
      const requestNewGame = () => client.send('newGameRequest', {status: true});
      return <GameObject key={0}
         onClick={() => requestNewGame()}
      />;
   }

   return (
      <div className={style.gameSelectContainer}>
         <p>Join a Game</p>
         <div className={style.gameSelect}>
            {newGame()}
            <WaitingGames/>
         </div>
         <p>Observe Live Games</p>
         <div className={style.gameSelect}>
            <LiveGames/>
         </div>
      </div>
   );
}

export default GameSelector;