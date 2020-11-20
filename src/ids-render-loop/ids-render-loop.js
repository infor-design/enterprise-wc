import { timestamp } from './ids-render-loop-common';
import IdsRenderLoopItem from './ids-render-loop-item';

/**
 * Sets up a timed loop using the `requestAnimationFrame` API.
 * This can be used for controlling animations,  or asynchronously staggering
 * routines for a specified duration.
 */
class IdsRenderLoop {
  /**
   * @param {object} [settings] incoming settings
   * @param {boolean} [settings.autoStart = true] causes the loop to start immediately
   * @param {HTMLElement} [settings.eventTargetElement] if defined,
   * causes RenderLoop events to be triggered on this element
   */
  constructor(settings = {
    autoStart: true
  }) {
    /**
     * On each RenderLoop tick (requestAnimationFrame), this array is iterated.
     * @property {Array<IdsRenderLoopItem>} items containing active RenderLoop items.
     */
    this.items = [];

    /**
     * @property {boolean} doLoop when true, the loop creates a `tick()`
     */
    this.doLoop = false;

    /**
     * @property {number} totalStoppedTime records the total number of stopped ticks
     */
    this.totalStoppedTime = 0;

    // Handle Settings
    if (settings.autoStart) {
      this.start();
    }
  }

  /**
   * Start the entire render loop
   * @returns {void}
   */
  start() {
    this.doLoop = true;
    let resume = false;

    /**
     * @property {number} startTime contains a timestamp number for when the loop begins.
     */
    if (!this.startTime) {
      this.startTime = timestamp();
    }

    // If the loop was previously stopped, record some timestamps
    // about when it resumed, and the pause duration.
    if (this.lastStopTime) {
      resume = true;
      this.resumeTime = timestamp();
      this.totalStoppedTime += this.resumeTime - this.lastStopTime;
      delete this.lastStopTime;
    }

    const self = this;
    let last = timestamp();
    let now;
    let deltaTime;

    /**
     * Actually performs a renderloop `tick()`
     * @returns {void}
     */
    function tick() {
      // Don't continue if the loop is stopped externally
      if (!self.doLoop) {
        return;
      }

      now = timestamp();
      deltaTime = (now - last) / 1000;

      // Iterate through each item stored in the queue and "update" each one.
      // In some cases, items will be removed from the queue automatically.
      // In some cases, `update` events will be triggered on loop items, if they are
      // ready to be externally updated.
      self.items.forEach((loopItem) => {
        // Remove if we've set the `doRemoveOnNextTick` flag.
        if (loopItem.doRemoveOnNextTick) {
          self.remove(loopItem);
          return;
        }

        if (resume) {
          loopItem.resume();
        }

        // Return out if we're "paused"
        if (loopItem.paused) {
          return;
        }

        // Check duration
        if (typeof loopItem.duration === 'number' && loopItem.duration > -1) {
          if (loopItem.elapsedTime >= loopItem.duration) {
            loopItem.destroy();
            return;
          }
        }

        // Pass information about current timing
        // last = previous timestamp
        // now = current timestamp
        // delta = difference between the two
        const timeInfo = {
          last,
          delta: deltaTime,
          now
        };

        loopItem.update(timeInfo);
      });

      // Continue the loop
      last = now;
      resume = false;
      requestAnimationFrame(tick);
    }

    tick();
  }

  /**
   * Stops the entire render loop and pauses every item.
   * @returns {void}
   */
  stop() {
    this.doLoop = false;
    this.lastStopTime = timestamp();

    this.items.forEach((loopItem) => {
      loopItem.pause();
    });
  }

  /**
   * @readonly
   * @returns {number} amount of time that has passed since the RenderLoop was started.
   */
  get elapsedTime() {
    return timestamp() - (this.startTime + this.totalStoppedTime);
  }

  /**
   * @param {IdsRenderLoopItem} loopItem the pre-constructed loop item.
   * @returns {void}
   */
  register(loopItem) {
    this.items.push(loopItem);
  }

  /**
   * Actually does the removal of a registered callback from the queue
   * Pulled out into its own function because it can be automatically called by
   * the tick, or manually triggered from an external API call.
   * @private
   * @param {IdsRenderLoopItem|string} obj the renderLoopItem, or its ID string
   * @returns {IdsRenderLoopItem} reference to the removed renderLoopItem
   */
  remove(obj) {
    let removedItem;

    // Remove directly
    if (obj instanceof IdsRenderLoopItem) {
      removedItem = obj;
      this.items = this.items.filter((item) => item !== obj);
    }

    // Remove by id
    if (typeof obj === 'string') {
      this.items = this.items.filter((item) => {
        if (item.id !== obj) {
          return true;
        }
        removedItem = item;
        return false;
      });
    }

    // Cause the item to timeout
    if (removedItem?.timeoutCallback) {
      removedItem.timeout();
    }

    // If this is undefined, an item was NOT removed from the queue successfully.
    return removedItem;
  }
}

export default IdsRenderLoop;
