import { useModal } from '../../contexts/modal';
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



// const GameOverMessage = ({ closeModal, isActive, winner, response, playerColor }) => {
//    const capWinner = winner ? winner[0].toUpperCase()+winner.slice(1) : null;

//    const isObserver = playerColor === 'observer';

//    if (isObserver) return <Modal isActive={isActive} closeModal={closeModal}>
//       <div onClick={() => response(false)} className='respondYesButton noselect'>Yes</div>
//       <div onClick={() => response(null)} className='respondNoButton noselect'>No</div>
//       <h1>Game Over</h1>
//       <p><b>{capWinner}</b> wins! Return to lobby?</p>
//    </Modal>;

//    return <Modal isActive={isActive} closeModal={closeModal}>
//       <div onClick={() => response(true)} className='respondYesButton noselect'>Yes</div>
//       <div onClick={() => response(false)} className='respondNoButton noselect'>No</div>
//       <h1>Game Over</h1>
//       <p><b>{capWinner}</b> wins! Would you like a rematch?</p>
//    </Modal>
// }