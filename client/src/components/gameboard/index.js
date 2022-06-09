import GameSquare from './gamesquare';
import client from '../../api/client';
import { useGameInfo } from '../../contexts/gameinfo';
import './index.css';

const GameBoard = ({ activeBoard }) => {
   const { gameInfo } = useGameInfo();
   const requestMove = ind => {
      if (activeBoard) client.send('moveRequest', {move: ind});
   }

   const drawGameState = () => gameInfo.gameState.map((val, ind) => {
      return <GameSquare key={ind}
         value={val}
         onClick={() => requestMove(ind)}
      />
   });

   return (
      <div className='gameBoardContainer'>
         <div className='gameBoard'>
            {drawGameState()}
         </div>
      </div>
   );
}

export default GameBoard;