import { useGameInfo } from '../../contexts/gameinfo';
import GameBoard from '../gameboard';
import './index.css';

const ActiveGame = () => {
   const { gameInfo } = useGameInfo();

   const myTurn = gameInfo.color === gameInfo.activePlayer;
   const moveText = gameInfo.opponent ? 
      (myTurn ? `Your move (${gameInfo.color})` : `Opponent's move (${gameInfo.activePlayer})`) :
      `You are ${gameInfo.color}. Waiting on other player...`;

   const skip = myTurn && gameInfo.legalMove === false && !gameInfo.gameOver;

   return (
      <div className='activeGame'>
         <GameBoard activeBoard={myTurn}/>
         <p>{moveText}</p>
         {/* <SkipModal move={skip}/> */}
         {/* <GameOverModal/> */}
      </div>
   );
}

export default ActiveGame;