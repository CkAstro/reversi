import { useModal } from '../../contexts/modal';
import style from './modal.module.css';

const ServerMessage = ({ message }) => {
   const { closeModal } = useModal();

   return (<>
      <h1>Server Message</h1>
      <p>{message}</p>
      <div className={`noselect ${style.confirmButton}`} onClick={closeModal}>Confirm</div>
   </>);
}

export default ServerMessage;