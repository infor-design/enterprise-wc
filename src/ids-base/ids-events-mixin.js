/**
 * Light-weight wrapper around events.
 */
class IdsEventsMixin {
  handledEvents = new Map();

  /**
   * Add and keep track of an event listener.
   * @param {string|any} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {Function|any} callback The callback code to execute
   * @param {object} options Additional event settings (passive, once, passive ect)
   */
  addEventListener(eventName, target, callback, options) {
    target.addEventListener(eventName.split('.')[0], callback, options);
    this.handledEvents.set(eventName, { target, callback, options });
  }

  /**
   * Add and keep track of an event listener.
   * @param {string} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, passive ect)
   */
  removeEventListener(eventName, target, options) {
    const handler = this.handledEvents.get(eventName);
    target.removeEventListener(eventName.split('.')[0], handler.callback, options || handler.options);
    this.handledEvents.delete(eventName);
  }

  /**
   * Create and trigger a custom event
   * @param {string} eventName The event id with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} [options] The custom data to send
   */
  dispatchEvent(eventName, target, options = {}) {
    const event = new CustomEvent(eventName.split('.')[0], options);
    target.dispatchEvent(event);
  }

  /**
   * Detach all event handlers
   * @param {string} [eventName] an optional event name to filter with
   */
  removeAll(eventName = undefined) {
    const doCheck = typeof eventName === 'string' && eventName.length;
    this.handledEvents.forEach((value, key) => {
      if (doCheck && key !== eventName) {
        return;
      }
      this.removeEventListener(key, value.target, value.options);
    });
  }
}

export { IdsEventsMixin };
