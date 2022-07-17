import GameObject from './gameobject';
import WaitingGames from './waitinggames';
import LiveGames from './livegames';
import client from 'api/client';
import style from './gameselector.module.css';

const NewGame = () => {
   const requestNewGame = () => client.send('newGameRequest', {status: true});
   return (
      <GameObject key={0}
         onClick={() => requestNewGame()}
      />
   );
}

const GameSelector = () => (
   <div className={style.gameSelectContainer}>
      <p>Join a Game</p>
      <div className={style.gameSelect}>
         <NewGame/>
         <WaitingGames/>
      </div>
      <p>Observe Live Games</p>
      <div className={style.gameSelect}>
         <LiveGames/>
      </div>
   </div>
);

export default GameSelector;