import { memo } from 'react';
import GameSquare from './gamesquare';
import client from 'api/client';
import style from './gameboard.module.css';

const GameBoard = ({ lastMove, gameState, activeBoard, mini }) => {
   const requestMove = ind => {
      if (activeBoard) client.send('moveRequest', {move: ind});
   }

   const drawGameState = gameState.map((val, ind) => (
      <GameSquare key={ind}
         value={val}
         isPlaced={lastMove === ind}
         onClick={() => requestMove(ind)}
         mini={mini}
      />
   ));

   return (
      <div className={`${style.gameBoardContainer}`}>
         <div className={`${style.gameBoard} ${mini ? style.mini : ''}`}>
            {drawGameState}
         </div>
      </div>
   );
}

export default memo(GameBoard);