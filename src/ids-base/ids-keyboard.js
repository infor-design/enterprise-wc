/**
 * Handle keyboard pressing and pressed down keys
 */
export default class IdsKeyboardHandler {
  /* Map Containing the currently pressed down keys */
  pressedKeys = new Map();

  /* Array Containing the current listeners */
  listeners = [];

  constructor() {
    this.init();
  }

  /**
   * Initializes the keyboard management system
   * @private
   */
  init() {
    this.keyDownHandler = document.addEventListener('keydown', (e) => {
      this.press(e.key);
    });

    this.keyUpHandler = document.addEventListener('keyup', (e) => {
      this.unpress(e.key);
    });
  }

  /**
   * Add a key to the pressedKeys Map.
   * @private
   * @param {string} key a string representing a {KeyboardEvent.key} that was pressed
   * @returns {Map} the current set of pressed keys
   */
  press(key) {
    return this.pressedKeys.set(`${key}`, true);
  }

  /**
   * Remove a key from the pressedKeys map.
   * @private
   * @param {string} key a string representing a {KeyboardEvent.key} that is no longer active
   * @returns {boolean}  whether or not the key had been previously logged as "pressed"
   */
  unpress(key) {
    return this.pressedKeys.delete(`${key}`);
  }

  /**
   * Dispatch an event on any active listeners
   * @private
   * @returns {void}
   */
  dispatch() {
    if (this.listeners.length === 0) {
      return;
    }

    this.pressedKeys.forEach(() => {
      this.dispatchEvent(new CustomEvent('keyed', { pressedKeys: this.pressedKeys }));
    });
  }

  /**
   * Release all event handlers
   */
  destroy() {
    document.removeEventListener('keydown', this.keyDownHandler);
    this.keyUpHandler = document.addEventListener('keyup', this.keyUpHandler);
  }
}
