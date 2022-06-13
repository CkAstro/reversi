import GameSquare from './gamesquare';
import client from '../../api/client';
import './index.css';

const GameBoard = ({ renderState, gameState, activeBoard }) => {
   const requestMove = ind => {
      if (activeBoard) client.send('moveRequest', {move: ind});
   }

   const drawGameState = () => {
      if (!gameState) return;
      return gameState.map((val, ind) => {
         return <GameSquare key={ind}
            value={val}
            renderState={renderState ? renderState[ind] : null}
            onClick={() => requestMove(ind)}
         />
      });
   }

   return (
      <div className='gameBoardContainer'>
         <div className='gameBoard'>
            {drawGameState()}
         </div>
      </div>
   );
}

export default GameBoard;