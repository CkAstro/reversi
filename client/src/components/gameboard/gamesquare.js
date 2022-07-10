import { memo } from 'react';
import GamePiece from './gamepiece';
import style from './gameboard.module.css';

const GameSquare = ({ value, onClick, isPlaced, mini }) => {
   if (!value) return <div onClick={onClick} className={style.gameSquare}/>;

   return <div onClick={onClick} className={`${style.gameSquare} ${isPlaced ? style.placed : ''}`}>
      {console.log('rendering square!')}
      <GamePiece value={value} mini={mini}/>
   </div>
}

export default memo(GameSquare);