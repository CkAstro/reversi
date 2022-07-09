import Node from './node.js';
import logger from '../logger.js';
'use strict';

class GameState {
   constructor() {
      this.nodes = [];
      this.turn = 0;

      // first create nodes
      for (let n=0; n<64; n++) {
         this.nodes = this.nodes.concat(new Node(n));
      }

      // then link neighbors
      for (let dir=0; dir<8; dir++) {
         for (let n=0; n<64; n++) {
            this.nodes[n].addNeighbor((           n<8 ) ? null : this.nodes[n-8]);
            this.nodes[n].addNeighbor((n%8===7 || n<8 ) ? null : this.nodes[n-7]);
            this.nodes[n].addNeighbor((n%8===7        ) ? null : this.nodes[n+1]);
            this.nodes[n].addNeighbor((n%8===7 || n>55) ? null : this.nodes[n+9]);
            this.nodes[n].addNeighbor((           n>55) ? null : this.nodes[n+8]);
            this.nodes[n].addNeighbor((n%8===0 || n>55) ? null : this.nodes[n+7]);
            this.nodes[n].addNeighbor((n%8===0        ) ? null : this.nodes[n-1]);
            this.nodes[n].addNeighbor((n%8===0 || n<8 ) ? null : this.nodes[n-9]);
         }
      }
   }

   // convert to list of values
   *getVals() {
      for (let i=0; i<this.nodes.length; i++) {
         yield this.nodes[i].value;
      }
   }

   // convert list of values to array
   toArray() {
      return [...this.getVals()];
   }

   // returns True if piece was placed, returns False if non-legal move
   // uses Node.flip(...) to count how many pieces were flipped
   //  - if a piece of same color is next to placement, flipped == 1,
   //    so we must only increment result if flipped > 1 by flipped-1
   placePiece(ind, val) {
      // first four moves must be in inner square
      if (this.turn < 4) {
         if (!this.nodes[ind].value && [27, 28, 35, 36].includes(ind)) {
            this.nodes[ind].value = val;
            this.turn++;
            return true;
         } else {
            return false;
         }
      } else {
         // return if already filled
         if (this.nodes[ind].value) return false;
         // loop through each direction and flip, 
         // incrementing result by flip count
         let result = 0;
         for (let n=0; n<8; n++) {
            if (this.nodes[ind].neighbors[n]) {
               const flipped = this.nodes[ind].neighbors[n].flip(n, val);
               if (flipped > 1) result += flipped-1;
            }
         }
         // if any were flipped, place piece and return true
         if (result > 0) {
            this.nodes[ind].value = val;
            this.turn++;
            return true;
         }
         // else return false
         return false;
      }
   }

   // loops through each board piece and uses same algorithm as 
   // placePiece(), any value of 
   //  - we send the 'update=false' argument to Node.flip() to
   //    prevent pieces from actually flipping
   checkLegalMove(val) {
      for (let ind=0; ind<64; ind++) {
         if (this.nodes[ind].value) {
            continue;
         } else {
            for (let n=0; n<8; n++) {
               if (this.nodes[ind].neighbors[n]) {
                  const flipped = this.nodes[ind].neighbors[n].flip(n, val, false);
                  if (flipped > 1) return true;
               }
            }
         }
      }
      return false;
   }

   // when game is over, tally up pieces and report winner
   gameOver() {
      const count = {
         black: 0,
         white: 0,
      }
      for (let ind=0; ind<64; ind++) {
         if (this.nodes[ind].value === 'black') {
            count.black++;
         } else if (this.nodes[ind].value === 'white') {
            count.white++;
         }
      }
      logger('Game over. Final count:', count);
      if (count.black > count.white) {
         return 'black';
      } else if (count.black < count.white) {
         return 'white';
      } else {
         return 'tie';
      }
   }
}

export default GameState;