import { useModal } from 'contexts';
import style from './display.module.css';

const HelpModal = () => {
   const { closeModal } = useModal();

   return (
      <div className={style.gameArea__helpModal}>
         <div className={style.helpModal__closeButton} onClick={closeModal}>Close</div>
         <h1>How to Play</h1>
         <div className={style.gameArea__helpModal_section}>
            <div>
               <h2>First Four Moves</h2>
               <p>The starting player is chosen at random.</p>
               <p>The first four moves must be made in the center four squares.</p> 
               <p>No pieces will flip during this stage.</p>
            </div>
            <img src={require('assets/img/reversi_rules_1.webp')} width='33%' height='33%'/>
         </div>
         <div className={style.gameArea__helpModal_section}>
            <div>
               <h2>The Rest of the Game</h2>
               <p>Each piece placed must flip at least (1) opponent piece.</p>
               <p>A piece is flipped when opponent placement surrounds it with opponent pieces.</p>
               <p>In the example, white placed in the bottom-left and now two black pieces are surrounded by white.</p>
            </div>
            <img src={require('assets/img/reversi_rules_2.webp')} width='33%' height='33%'/>
         </div>
         <div className={style.gameArea__helpModal_section}>
            <div>
               <h2>Game Over</h2>
               <p>If a player does not have a legal move, the player must skip their turn.</p>
               <p>If neither player has a legal move, the game is over. The winner is the player with the most pieces at the end of the game.</p>
            </div>
            <img src={require('assets/img/reversi_rules_3.webp')} width='33%' height='33%'/>
         </div>
      </div>
   );
}

export default HelpModal;