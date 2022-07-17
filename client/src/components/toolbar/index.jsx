import InfoContainer from './infocontainer';
import { GameHistory } from 'components';
import style from './toolbar.module.css';

const Toolbar = () => {
   return (
      <div className={style.toolbarArea}>
         <p>Toolbar</p>
         <div className={style.toolbarFlexContainer}>
            <InfoContainer/>
            <GameHistory/>
         </div>
      </div>
   );
}

export default Toolbar;