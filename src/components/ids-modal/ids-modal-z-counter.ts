/**
 * Provides a global way to display
 */
class IdsModalZCounter {
  zCounter: number;

  constructor() {
    this.zCounter = 1020;
  }

  increment() {
    return this.zCounter++;
  }

  decrement() {
    return this.zCounter--;
  }
}

const zCounter = new IdsModalZCounter();

export default zCounter;
