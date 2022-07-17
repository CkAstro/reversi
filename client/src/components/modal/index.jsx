import { useModal } from '../../contexts/modal';
import ServerMessage from './servermessage';
import SkipMessage from './skipmessage';
import GameOverMessage from './gameovermessage';
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

export default Modal;
export { ServerMessage, SkipMessage, GameOverMessage };