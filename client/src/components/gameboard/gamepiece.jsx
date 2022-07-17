import { memo } from 'react';
import style from './gameboard.module.css';

const GamePiece = ({ value, mini, inline }) => {
   return (
      <div className={`
         ${style.gamePiece} 
         ${style[value]}  
         ${mini ? style.mini : ''}
         ${inline ? style.inline : ''}
      `}/>
   );
}

export default memo(GamePiece);