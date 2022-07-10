import ScaleText from 'react-scale-text';
import style from './gameselector.module.css';

const GameObject = ({ black, white, matchType, onClick }) => {
   if (!(black || white)) return <div className={style.game} onClick={onClick}>
      <p>Start New Game</p>
   </div>;

   const gameClass = matchType === 'live' ? style.liveMatch : style.replayMatch;
   const liveGame = black && white;

   const firstText = black ? black : white;
   const vs = liveGame ? 'vs' : null;
   const secondText = liveGame ? white : null;
   const matchText = liveGame ? matchType : null;

   const textAdjust = {
      margin: '0px',
      whiteSpace: 'nowrap',
      textAlign: 'center',
      alignSelf: 'center',
   }

   return (
      <div className={style.game} onClick={onClick}>
         <ScaleText widthOnly={true} maxFontSize={32}>
            <p style={textAdjust}>{firstText}</p>
         </ScaleText>
         <p style={{ ...textAdjust, fontSize: '20px' }}>{vs}</p>
         <ScaleText widthOnly={true} maxFontSize={32}>
            <p style={textAdjust}>{secondText}</p>
         </ScaleText>
         <p className={gameClass}>{matchText}</p>
      </div>
   );
}

export default GameObject;