import { useGameInfo } from 'contexts';
import client from 'api/client';
import style from './display.module.css';

const BackButton = () => {
   const { resetGameInfo } = useGameInfo();

   const handlePressBack = () => {
      resetGameInfo();
      client.send('leaveGameRequest', {status: true});
   }
   
   return (
      <div 
         className={style.gameArea__buttonContainer_backButton} 
         onClick={handlePressBack}
      >Return to Lobby</div>
   );
}

export default BackButton;