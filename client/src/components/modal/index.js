import './index.css';

const ServerMessage = ({closeModal, isActive, children }) => {
   return <Modal isActive={isActive} closeModal={closeModal}>
      <h1>Server Message</h1>
      {children}
      <div className='confirmButton noselect'>Confirm</div>
   </Modal>;
}

const SkipMessage = ({closeModal, isActive }) => {
   return <Modal isActive={isActive} closeModal={closeModal}>
      <h1>No Legal Move</h1>
      <p>You have no legal move. You must skip your turn.</p>
      <div className='confirmButton noselect'>Skip</div>
   </Modal>;
}

const GameOverMessage = ({ closeModal, isActive, winner, response }) => {
   const capWinner = winner ? winner[0].toUpperCase()+winner.slice(1) : null;
   return <Modal isActive={isActive} closeModal={closeModal}>
      <h1>Game Over</h1>
      <p><b>{capWinner}</b> wins! Would you like a rematch?</p>
      <div onClick={() => response(true)} className='respondYesButton noselect'>Yes</div>
      <div onClick={() => response(false)} className='respondNoButton noselect'>No</div>
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