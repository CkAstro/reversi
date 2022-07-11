import { useGameInfo } from '../../contexts/gameinfo';
import GameSelector from '../gameselector';
import ActiveGame from '../activegame';
import client from '../../api/client';
import Modal from '../modal';
import { useModal } from '../../contexts/modal';
import style from './display.module.css';
import ServerMessage from '../modal/servermessage';

const Display = () => {
   const { setModalContent } = useModal();
   const { gameInfo, handleInfoUpdate } = useGameInfo();

   // listen for game join triggers
   client.addListener('activeGameUpdate', handleInfoUpdate);

   const display = gameInfo.activeGame
      ? <ActiveGame/>
      : <GameSelector/>
   ;

   client.addListener('errorMessage', data => {
      setModalContent(<ServerMessage message={data.errorText}/>);
   });

   return (<>
      <Modal/>
      <div className={style.gameArea}>
         {display}
      </div>
   </>);
}

export default Display;