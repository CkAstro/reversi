import { useGameInfo } from 'contexts';

const MoveDisplay = () => {
   const { gameInfo } = useGameInfo();

   const myTurn = gameInfo.playerColor === gameInfo.activePlayer;
   const activeGameText = myTurn 
      ? `Your move (${gameInfo.playerColor})` 
      : `Opponent's move (${gameInfo.activePlayer})`
   ;

   const observingText = `Observing match. Current move is (${gameInfo.activePlayer})`;
   const waitingText = 'Waiting on other player...';

   const altText = gameInfo.playerColor === 'observer' ? observingText : waitingText;
   const moveText = gameInfo.opponent.playerId ? activeGameText : altText;

   return <p>{moveText}</p>;
}

export default MoveDisplay;