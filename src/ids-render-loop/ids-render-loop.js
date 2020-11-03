import { timestamp } from './ids-render-loop-common';
import IdsRenderLoopItem from './ids-render-loop-item';

/**
 * Converts a plain object into an `IdsRenderLoopItem`.
 * @param {Function} updateCallback - (can also be the "updateCallback" function)
 * @param {Function} [timeoutCallback] callback function that gets fired at
 *  the end of this item's lifecycle
 * @param {number} [duration] the amount of time in frames that this item should exist
 * @param {string} [namespace] the namespace for this item
 * @returns {IdsRenderLoopItem} the item that was registered
 */
function buildRenderLoopItem(updateCallback, timeoutCallback, duration, namespace) {
  let noNamespace = typeof namespace !== 'string' || !namespace.length;
  let usedNamespace = namespace;
  let usedDuration = duration;

  // valid for a callback not to have a duration, as long as it's
  // namespaced for future manual removal
  if (typeof duration === 'string') {
    if (noNamespace) {
      usedNamespace = duration;
      usedDuration = -1;
      noNamespace = false;
    } else {
      const numberDuration = Number(duration);
      if (!isNaN(numberDuration)) { // eslint-disable-line
        usedDuration = numberDuration;
      }
    }
  } else if (typeof duration !== 'number') {
    usedDuration = -1;
  }

  if (typeof namespace !== 'string' || !namespace.length) {
    usedDuration = ''; // TODO: make unique
  }

  const loopItem = new IdsRenderLoopItem({
    id: namespace,
    updateCallback,
    timeoutCallback,
    duration
  });

  return loopItem;
}

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
    autoStart: true,
    eventTargetElement: null
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

    this.handleSettings(settings);
  }

  /**
   * @private
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  handleSettings(settings) {
    /**
     * @property {HTMLElement} element used as the target for renderloop DOM events.
     */
    if (settings.eventTargetElement instanceof HTMLElement) {
      this.element = settings.eventTargetElement;
    }

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
          if (!loopItem.startTime) {
            loopItem.init();
          }

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
   * Stops the entire render loop
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
   * External method for getting the callback queue contents
   * @returns {Array} list of internal RenderLoopItems
   */
  queue() {
    return this.items;
  }

  /**
   * @param {IdsRenderLoopItem|Function} loopItem - (can also be the "updateCallback" function)
   * @param {Function} [timeoutCallback] callback function that gets fired at
   *  the end of this item's lifecycle
   * @param {number} [duration] the amount of time in frames that this item should exist
   * @param {string} [namespace] the namespace for this item
   * @returns {IdsRenderLoopItem} the item that was registered
   */
  register(loopItem, timeoutCallback, duration, namespace) {
    let usedLoopItem = loopItem;
    // If we're not working with a RenderLoopItem off the bat, take arguments
    // and convert to a RenderLoopItem.  Consider the first argument
    // to be the "updateCallback" function
    if (!(loopItem instanceof IdsRenderLoopItem)) {
      usedLoopItem = buildRenderLoopItem(loopItem, timeoutCallback, duration, namespace);
    }

    this.items.push(usedLoopItem);

    return usedLoopItem;
  }

  /**
   * @param {Function} callback callback function to be unregistered
   * @param {string} [namespace] namespace to be unregistered
   * @returns {IdsRenderLoopItem} the item that was unregistered
   */
  unregister(callback, namespace) {
    let usedCallback = callback;
    let usedNamespace = namespace;

    if (typeof callback !== 'function' && typeof callback !== 'string' && typeof namespace !== 'string') {
      throw new Error('must provide either a callback function or a namespace string to remove an entry from the RenderLoop queue.');
    }

    // If callback is defined as a string, simply swap it for the namespace.
    if (typeof callback === 'string') {
      usedNamespace = callback;
      usedCallback = undefined;
    }

    return this.remove({
      cb: usedCallback,
      id: usedNamespace
    });
  }

  /**
   * Uses a callback function, or a defined namespace, to grab a RenderLoop item from the queue.
   * @private
   * @param {Function} updateCallback callback function to be retrieved
   * @param {string} [namespace] namespace to be retrieved
   * @returns {IdsRenderLoopItem} the RenderLoopItem that represents the item that was paused.
   */
  getFromQueue(updateCallback, namespace) {
    let usedUpdateCallback = updateCallback;
    let usedNamespace = namespace;

    // If callback is defined as a string, simply swap it for the namespace.
    if (typeof callback === 'string') {
      usedNamespace = updateCallback;
      usedUpdateCallback = undefined;
    }

    let retreivedItem;

    if (typeof usedUpdateCallback === 'function') {
      // Remove by callback method
      this.items.forEach((item) => {
        if (`${item.updateCallback}` !== `${usedUpdateCallback}`) {
          return true;
        }
        retreivedItem = item;
        return false;
      });
    } else if (typeof usedNamespace === 'string') {
      // Remove by namespace
      this.items.forEach((item) => {
        if (item.id !== usedNamespace) {
          return true;
        }
        retreivedItem = item;
        return false;
      });
    }

    return retreivedItem;
  }

  /**
   * Actually does the removal of a registered callback from the queue
   * Pulled out into its own function because it can be automatically called by
   * the tick, or manually triggered from an external API call.
   * @private
   * @param {IdsRenderLoopItem|object} obj the renderLoopItem
   * @returns {IdsRenderLoopItem} reference to the removed renderLoopItem
   */
  remove(obj) {
    let removedItem;

    if (obj instanceof IdsRenderLoopItem) {
      removedItem = obj;
      this.items = this.items.filter((item) => item !== obj);
    } else if (typeof obj.updateCallback === 'function') {
      // Remove by callback method
      this.items = this.items.filter((item) => {
        if (`${item.updateCallback}` !== `${obj.updateCallback}`) {
          return true;
        }
        removedItem = item;
        return false;
      });
    } else if (typeof obj.id === 'string') {
      // Remove by namespace
      this.items = this.items.filter((item) => {
        if (item.id !== obj.id) {
          return true;
        }
        removedItem = item;
        return false;
      });
    }

    // Cause the item to timeout
    removedItem.timeout();

    if (this.element) {
      this.element.triggerHandler('remove.renderLoop', [removedItem]);
    }

    // If this is undefined, an item was NOT removed from the queue successfully.
    return removedItem;
  }

  /**
   * @param {Function} callback callback function to be paused
   * @param {string} [namespace] namespace to be paused
   * @returns {IdsRenderLoopItem} the RenderLoopItem that represents the item that was paused.
   */
  pause(callback, namespace) {
    if (typeof callback !== 'function' && typeof callback !== 'string' && typeof namespace !== 'string') {
      throw new Error('must provide either a callback function or a namespace string to pause an entry in the RenderLoop queue.');
    }

    const pausedItem = this.getFromQueue(callback, namespace);

    pausedItem.pause();

    return pausedItem;
  }

  /**
   * @param {Function} callback callback function to be resumed
   * @param {string} [namespace] namespace to be resumed
   * @returns {IdsRenderLoopItem} the RenderLoopItem that represents the item that was resumed.
   */
  resume(callback, namespace) {
    if (typeof callback !== 'function' && typeof callback !== 'string' && typeof namespace !== 'string') {
      throw new Error('must provide either a callback function or a namespace string to pause an entry in the RenderLoop queue.');
    }

    const resumableItem = this.getFromQueue(callback, namespace);

    resumableItem.resume();

    return resumableItem;
  }

  /**
   * Passes in new/updated settings to the RenderLoop instance
   * @param {object} [settings] incoming settings.
   * @returns {void}
   */
  updated(settings) {
    if (typeof settings === 'object') {
      this.handleSettings(settings);
    }
  }
}

export default IdsRenderLoop;
