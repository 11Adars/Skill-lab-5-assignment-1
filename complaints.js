// complaints.js
class ComplaintQueue {
    constructor() {
      this.queue = [];
    }
  
    addComplaint(complaint) {
      this.queue.push(complaint);
    }
  
    processComplaint() {
      return this.queue.shift(); // FIFO: Process first-in complaint
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  }
  
  class ComplaintStack {
    constructor() {
      this.stack = [];
    }
  
    addResolvedComplaint(complaint) {
      this.stack.push(complaint);
    }
  
    revertLastComplaint() {
      return this.stack.pop(); // LIFO: Undo the last resolved complaint
    }
  }
  
  module.exports = { ComplaintQueue, ComplaintStack };
  