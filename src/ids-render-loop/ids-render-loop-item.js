import { timestamp } from './ids-render-loop-common';

/**
 * An IDS RenderLoop Queue Item
 */
class IdsRenderLoopItem extends Object {
  /**
   * @param {object} opts incoming item options
   * @returns {IdsRenderLoopItem} component instance
   */
  constructor(opts = {}) {
    super();

    // This can be referenced by the RenderLoopAPI to change this item's settings
    this.id = opts.id;

    // Setting a duration greater than '-1' causes the RenderLoopItem to automatically
    // remove itself from the queue after that duration.
    this.duration = opts.duration || -1;

    // Either ID or a duration is required.
    if (this.duration < 1 && (typeof this.id !== 'string' || !this.id.length)) {
      throw new Error('cannot build a RenderLoopItem with no duration and no namespace');
    }

    // Number of frames this loop item will step before running its
    // `updateCallback()`, if defined
    this.updateDuration = opts.updateDuration || 1;
    if (this.updateDuration > 0) {
      this.setNextUpdateTime();
    }

    // handles the setting of user-defined callback functions
    this.setFuncs(opts);

    // Internal state
    this.paused = false;
    this.startTime = timestamp();
    this.totalStoppedTime = 0;

    return this;
  }

  /**
   * Handles the setting of user-defined callback functions
   * @private
   * @param {object} opts incoming settings
   */
  setFuncs(opts = {}) {
    if (typeof opts.updateCallback !== 'function' && typeof opts.timeoutCallback !== 'function') {
      throw new Error('cannot register callback to RenderLoop because callback is not a function');
    }

    if (typeof opts.updateCallback === 'function') {
      this.updateCallback = opts.updateCallback.bind(this);
    }

    if (typeof opts.timeoutCallback === 'function') {
      this.timeoutCallback = opts.timeoutCallback.bind(this);
    }
  }

  /**
   * Appends the update duration to a current timestamp and stores it, to define
   * when this item will next run its update callback.
   * @returns {void}
   */
  setNextUpdateTime() {
    this.nextUpdateTime = timestamp() + this.updateDuration;
  }

  /**
   * Defines the time this item begins its lifecycle
   * @returns {void}
   */
  init() {
    if (!this.startTime) {
      this.startTime = timestamp();
    }
  }

  /**
   * Causes the update cycle of this loop item not to occur
   * @returns {void}
   */
  pause() {
    this.paused = true;
    this.lastPauseTime = timestamp();
  }

  /**
   * Causes the update cycle of this loop item to start occurring
   * @returns {void}
   */
  resume() {
    this.resumeTime = timestamp();
    if (this.lastPauseTime) {
      this.totalStoppedTime += this.resumeTime - this.lastPauseTime;
      delete this.lastPauseTime;
    }
    this.paused = false;
  }

  /**
   * @readonly
   * @returns {number} the elapsed time this RenderLoop item has existed for
   */
  get elapsedTime() {
    return timestamp() - (this.startTime + this.totalStoppedTime);
  }

  /**
   * @readonly
   * @returns {boolean} true if the item's `updateCallback` will be fired on this renderLoop tick
   */
  get canUpdate() {
    return typeof this.nextUpdateTime === 'number' && timestamp() > this.nextUpdateTime;
  }

  /**
   * Fires a defined `updateCallback()` under the right conditions
   * @param {object} timeInfo containing raw time information from the loop (last, delta, now)
   * @param {...Array<any>} [callbackArgs] user-defined parameters that get passed
   *  to an `updateCallback()` method.
   * @returns {void}
   */
  update(timeInfo, ...callbackArgs) {
    if (typeof this.updateCallback !== 'function' || !this.canUpdate) {
      return;
    }

    // NOTE: This runs in this `IdsRenderLoopItem`s context
    this.updateCallback(timeInfo, ...callbackArgs);
  }

  /**
   * Fires a defined `timeoutCallback()` under the right conditions.
   * @returns {void}
   */
  timeout() {
    if (typeof this.timeoutCallback !== 'function' || this.noTimeout) {
      return;
    }

    // NOTE: This runs in this `IdsRenderLoopItem`s context
    this.timeoutCallback();
  }

  /**
   * @param {boolean} noTimeout causes the item to be destroyed without
   * triggering the `timeoutCallback` function
   * @returns {void}
   */
  destroy(noTimeout) {
    if (noTimeout) {
      this.noTimeout = true;
    }
    this.doRemoveOnNextTick = true;
  }
}

export default IdsRenderLoopItem;
