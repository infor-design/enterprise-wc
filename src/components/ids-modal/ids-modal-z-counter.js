/**
 * Provides a global way to display
 */
class IdsModalZCounter {
  constructor() {
    this.zCounter = 1020;
  }

  increment() {
    return this.zCounter++;
  }

  /* istanbul ignore next */
  decrement() {
    return this.zCounter--;
  }

  /**
   * Decrements the counter 3x - once for the modal WebComponent, once for the overlay, and once for the Popup
   * @returns {number} remaining
   */
  hideModal() {
    this.zCounter -= 3;
    return this.zCounter;
  }
}

const zCounter = new IdsModalZCounter();

export default zCounter;
