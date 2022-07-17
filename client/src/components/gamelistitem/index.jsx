import { GameBoard, GamePiece } from 'components';
import style from './gamelistitem.module.css';

const GameListItem = ({ gameInfo, onClick, isActive }) => {
   const blackPiece = <GamePiece mini inline value='black'/>;
   const whitePiece = <GamePiece mini inline value='white'/>;

   return (
      <div className={`noselect ${style.gameListItem} ${isActive ? style.active : ''}`} onClick={onClick}>
         <div className={style.gameListItemHeader}>
            <div>{blackPiece} {gameInfo.black}</div>
            <div>{whitePiece} {gameInfo.white}</div>
         </div>
         <div className={style.gameListItemBody}>
            <GameBoard gameState={gameInfo.gameState} mini/>
            <div className={style.info}>
               <div>Score: {gameInfo.score}</div>
               <div>{gameInfo.winner} wins</div>
               <div>Turns: {gameInfo.turn}</div>
               <div className={style.viewMatch}>View Match</div>
            </div>
         </div>
      </div>
   );
}

export default GameListItem;