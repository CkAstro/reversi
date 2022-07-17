import { useModal } from 'contexts';
import HelpModal from './helpmodal';
import style from './display.module.css';

const HelpButton = () => {
   const { setModalContent } = useModal(); 

   return (
      <div 
         className={style.gameArea__buttonContainer_helpButton} 
         onClick={() => setModalContent(<HelpModal/>)}
      >How to Play</div>
   );
}

export default HelpButton;