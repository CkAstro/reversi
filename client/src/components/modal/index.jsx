import { useModal } from 'contexts';
import GameOverMessage from './gameovermessage';
import ServerMessage from './servermessage';
import SkipMessage from './skipmessage';
import style from './modal.module.css';

const Modal = () => {
   const { modalProps, closeModal } = useModal();

   const handleClick = event => event.stopPropagation();
   const handleClose = () => closeModal();

   return (
      <div className={`${style.modalContainer} ${modalProps.isActive ? style.active : ''}`} onClick={handleClose}>
         <div className={style.modal} onClick={handleClick}>
            {modalProps.content}
            <div className={style.closeButton} onClick={handleClose}>&times;</div>
         </div>
      </div>
   );
}

export { Modal, ServerMessage, SkipMessage, GameOverMessage };