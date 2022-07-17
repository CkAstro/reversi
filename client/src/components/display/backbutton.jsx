import style from './display.module.css';

const BackButton = ({ onClick }) => (
   <div className={style.backButton} onClick={onClick}>Return to Lobby</div>
);

export default BackButton;