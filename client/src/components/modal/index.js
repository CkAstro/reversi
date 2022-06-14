import './index.css';

const ServerMessage = ({closeModal, isActive, children }) => {
   return <Modal isActive={isActive} closeModal={closeModal}>
      <div className='confirmButton noselect'>Confirm</div>
      <h1>Server Message</h1>
      {children}
   </Modal>;
}

const SkipMessage = ({closeModal, isActive }) => {
   return <Modal isActive={isActive} closeModal={closeModal}>
      <div className='confirmButton noselect'>Skip</div>
      <h1>No Legal Move</h1>
      <p>You have no legal move. You must skip your turn.</p>
   </Modal>;
}

const GameOverMessage = ({ closeModal, isActive, winner, response, playerColor }) => {
   const capWinner = winner ? winner[0].toUpperCase()+winner.slice(1) : null;

   const isObserver = playerColor === 'observer';

   if (isObserver) return <Modal isActive={isActive} closeModal={closeModal}>
      <div onClick={() => response(false)} className='respondYesButton noselect'>Yes</div>
      <div onClick={() => response(null)} className='respondNoButton noselect'>No</div>
      <h1>Game Over</h1>
      <p><b>{capWinner}</b> wins! Return to lobby?</p>
   </Modal>;

   return <Modal isActive={isActive} closeModal={closeModal}>
      <div onClick={() => response(true)} className='respondYesButton noselect'>Yes</div>
      <div onClick={() => response(false)} className='respondNoButton noselect'>No</div>
      <h1>Game Over</h1>
      <p><b>{capWinner}</b> wins! Would you like a rematch?</p>
   </Modal>
}

const Modal = ({ children, closeModal, isActive }) => {

   return (
      <div className={`modalContainer ${isActive ? 'active' : ''}`} onClick={closeModal}>
         <div className='modal'>
            <div className='closeButton noselect'>&times;</div>
            {children}
         </div>
      </div>
   );
}

export default {
   ServerMessage,
   SkipMessage,
   GameOverMessage,
};