'use strict';

class Node {
   constructor(nodeId) {
      this.nodeId = nodeId;
      this.value = null;
      this.neighbors = [];
   }

   addNeighbor(node) {
      if (this.neighbors.length < 8) this.neighbors = this.neighbors.concat(node);
   }

   flip(dir, val, update = true) {
      if (this.value === val) return 1;
      if (this.value === null || this.neighbors[dir] === null) return 0;
      const flipped = this.neighbors[dir].flip(dir, val, update);
      if (flipped > 0) {
         if (update) this.value = val;
         return flipped + 1;
      } else {
         return 0;
      }
   }
}

export default Node;