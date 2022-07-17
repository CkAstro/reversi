import { useModal } from '../../contexts/modal';
import client from '../../api/client';
import style from './modal.module.css';

const SkipMessage = () => {
   const { closeModal } = useModal();

   const handleClick = () => {
      client.send('moveRequest', {move: '__skip__'});
      closeModal();
   }

   return (<>
      <h1>No Legal Move</h1>
      <p>You have no legal move. You must skip your turn.</p>
      <div className={`noselect ${style.confirmButton}`} onClick={handleClick}>Confirm</div>
   </>);
}

export default SkipMessage;