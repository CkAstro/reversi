import style from './activegame.module.css';

const BackButton = ({ onClick }) => {
   console.log(style);
   return <div className={style.backButton} onClick={onClick}>Return to Lobby</div>
}

export default BackButton;