/**
 * Light-weight wrapper around events.
 */
export default function IdsEventHandler() {
  this.handledEvents = new Map();

  /**
   * Add and keep track of an event listener.
   * @param {string} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {Function} callback The callback code to execute
   * @param {object} options Additional event settings (passive, once, passive ect)
   */
  this.addEventListener = (eventName, target, callback, options) => {
    target.addEventListener(eventName, callback, options);
    this.handledEvents.set(eventName, { target, callback, options });
  };

  /**
   * Add and keep track of an event listener.
   * @param {string} eventName The event name with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options Additional event settings (passive, once, passive ect)
   */
  this.removeEventListener = (eventName, target, options) => {
    const handler = this.handledEvents.get(eventName);
    target.removeEventListener(eventName, handler.callback, options || handler.options);
    this.handledEvents.delete(eventName);
  };

  /**
   * Create and trigger a custom event
   * @param {string} eventName The event id with optional namespace
   * @param {HTMLElement} target The DOM element to register
   * @param {object} options The custom data to send
   */
  this.dispatchEvent = (eventName, target, options) => {
    const event = new CustomEvent(eventName, { detail: options });
    target.dispatchEvent(event);
  };

  /**
   * Detach all event handlers
   */
  this.removeAll = () => {
    this.handledEvents.forEach((value, key) => {
      this.removeEventListener(key, value.target, value.options);
    });
  };
}

export { IdsEventHandler };
