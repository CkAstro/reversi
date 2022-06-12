import client from '../../api/client';
import './index.css';

const LiveGame = ({ gameInfo }) => {
   const requestObserveGame = () => client.send('observeGameRequest', {gameId: gameInfo.gameId});

   const text = (<><p>{gameInfo.black}</p><p>vs</p><p>{gameInfo.white}</p></>)
   const matchType = <p className={`${gameInfo.matchType}Match`}>{gameInfo.matchType}</p>;
   return (
      <div className='game liveGame' onClick={requestObserveGame}>
         {text}
         {matchType}
      </div>
   );
}

export default LiveGame;