/**
 * Provides a global way to display
 */
class IdsModalZCounter {
  constructor() {
    this.zCounter = 1000;
  }

  increment() {
    return this.zCounter++;
  }

  /* istanbul ignore next */
  decrement() {
    return this.zCounter--;
  }
}

const zCounter = new IdsModalZCounter();

export default zCounter;
