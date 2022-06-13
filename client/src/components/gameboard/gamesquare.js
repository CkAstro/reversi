import './index.css';

const GameSquare = ({ value, onClick, renderState }) => {
   const gamePiece = `${value} gamePiece ${renderState}`;
   const gameSquare = `gameSquare ${renderState}`;

   return (
      <div className={gameSquare} onClick={onClick}>
         <div className={gamePiece}/>
         <div className={`${gamePiece} top`}/>
      </div>
   );
}

export default GameSquare;