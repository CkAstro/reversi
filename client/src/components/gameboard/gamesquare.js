import './index.css';

const GameSquare = ({ value, onClick, test }) => {
   const gamePiece = `${value} gamePiece ${test}`;
   const gameSquare = `gameSquare ${test}`;

   return (
      <div className={gameSquare} onClick={onClick}>
         <div className={gamePiece}/>
         <div className={`${gamePiece} top`}/>
      </div>
   );
}

export default GameSquare;