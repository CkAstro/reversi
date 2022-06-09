import { useGameInfo } from '../../contexts/gameinfo';
import client from '../../api/client';
import GameBoard from '../gameboard';
import './index.css';

const ActiveGame = () => {
   const { gameInfo, handleInfoUpdate } = useGameInfo();

   // listen for game update (player makes a move, etc)
   client.addListener('gameUpdate', handleInfoUpdate);

   const myTurn = gameInfo.playerColor === gameInfo.activePlayer;
   const moveText = gameInfo.opponent ? 
      (myTurn ? `Your move (${gameInfo.playerColor})` : `Opponent's move (${gameInfo.activePlayer})`) :
      `You are ${gameInfo.playerColor}. Waiting on other player...`;

   const skip = myTurn && gameInfo.legalMove === false && !gameInfo.gameOver;

   return (
      <div className='activeGame'>
         <GameBoard gameState={gameInfo.gameState} activeBoard={myTurn}/>
         <p>{moveText}</p>
         {/* <SkipModal move={skip}/> */}
         {/* <GameOverModal/> */}
      </div>
   );
}

export default ActiveGame;