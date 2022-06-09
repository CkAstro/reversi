import GameBoard from '../gameboard';
import './index.css';

const GameListItem = ({ gameInfo, onClick, isActive }) => {
   const blackPiece = <span className='black gamePiece'/>
   const whitePiece = <span className='white gamePiece'/>

   return (
      <div className={`noselect gameListItem ${isActive}`} onClick={onClick}>
         <p>{blackPiece} {gameInfo.black}</p>
         <p>{whitePiece} {gameInfo.white}</p>
         <div>
            <div className='info'>
               <p>Score: {gameInfo.score}</p>
               <p>{gameInfo.winner} wins</p>
               <p>Turns: {gameInfo.turn}</p>
               <p className='viewMatch'>View Match</p>
            </div>
         </div>
         <GameBoard gameState={gameInfo.gameState}/>
      </div>
   );
}

export default GameListItem;