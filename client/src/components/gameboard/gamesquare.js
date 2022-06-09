import './index.css';

const GameSquare = ({ value, onClick }) => {
   const gamePiece = `${value} gamePiece`;

   return (
      <div className='gameSquare' onClick={onClick}>
         <div className={gamePiece}/>
      </div>
   );
}

export default GameSquare;