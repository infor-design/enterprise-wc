import { timestamp } from './ids-render-loop-common';

/**
 * An IDS RenderLoop Queue Item
 * @type {IdsRenderLoopItem}
 * @param {object} settings incoming item options
 */
class IdsRenderLoopItem extends Object {
  /**
   * @param {object} settings incoming item options
   */
  constructor(settings = {}) {
    super();

    // This can be referenced by the RenderLoopAPI to change this item's settings
    this.id = settings.id;

    // Setting a duration greater than '-1' causes the RenderLoopItem to automatically
    // remove itself from the queue after that duration.
    this.duration = -1;
    if (typeof settings.duration === 'number') {
      this.duration = parseInt(settings.duration, 10);
    }

    // Either ID or a duration is required.
    if (this.duration < 1 && (typeof this.id !== 'string' || !this.id.length)) {
      throw new Error('cannot build a RenderLoopItem with no duration and no namespace');
    }

    // Number of frames this loop item will step before running its
    // `updateCallback()`, if defined
    this.updateDuration = 1;
    if (typeof settings.updateDuration === 'number') {
      this.updateDuration = parseInt(settings.updateDuration, 10);
    }
    this.setNextUpdateTime();

    // handles the setting of user-defined callback functions
    if (typeof settings.updateCallback !== 'function' && typeof settings.timeoutCallback !== 'function') {
      throw new Error('cannot register callback to RenderLoop because callback is not a function');
    }

    if (typeof settings.updateCallback === 'function') {
      this.updateCallback = settings.updateCallback.bind(this);
    }

    if (typeof settings.timeoutCallback === 'function') {
      this.timeoutCallback = settings.timeoutCallback.bind(this);
    }

    // Internal state
    this.paused = false;
    this.startTime = timestamp();
    this.totalStoppedTime = 0;

    return this;
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
    /* istanbul ignore next */
    this.totalStoppedTime += this.resumeTime - (this.lastPauseTime || 0);
    delete this.lastPauseTime;
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
    this.setNextUpdateTime();
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
