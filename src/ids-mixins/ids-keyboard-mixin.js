/**
 * Handle keyboard shortcuts and pressed down keys
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsKeyboardMixin = (superclass) => class extends superclass {
  constructor() {
    super();
    this.initKeyboardHandlers();
  }

  /**
   * Initializes the keyboard management system with the current object
   * @private
   */
  initKeyboardHandlers() {
    /** @type {Map | any} */
    this.hotkeys = new Map();
    /** @type {Map | any} */
    this.pressedKeys = new Map();

    this.keyDownHandler = (/** @type {any} */ e) => {
      this.press(e.key);
      this.dispatchHotkeys(e);
    };
    this.onEvent('keydown.keyboard', this, this.keyDownHandler);

    this.keyUpHandler = (/** @type {any} */ e) => {
      this.unpress(e.key);
    };
    this.onEvent('keyup.keyboard', this, this.keyUpHandler);
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
   * Add a listener for a key or key code combination
   * @param {Array|string} keycode An array of all matchinng keycodes
   * @param {HTMLElement} elem The object with the listener attached
   * @param {Function} callback The call back when this combination is met
   */
  listen(keycode, elem, callback) {
    this.hotkeys.set(`${keycode}`, callback);
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
   * @param {object} e a string representing a {KeyboardEvent.key} that is no longer active
   * @returns {void}
   */
  dispatchHotkeys(e) {
    this.hotkeys.forEach((/** @type {any} */ value, /** @type {any} */key) => {
      if (key.split(',').indexOf(e.key) > -1) {
        value(e);
      }
    });
  }

  /**
   * Remove all handlers and clear memory
   */
  detachAllListeners() {
    if (this.keyDownHandler && this.offEvent) {
      this.offEvent('keydown.keyboard', this, this.keyDownHandler);
      delete this.keyDownHandler;
    }
    if (this.keyUpHandler && this.offEvent) {
      this.offEvent('keyup.keyboard', this, this.keyUpHandler);
      delete this.keyUpHandler;
    }
  }
};

export default IdsKeyboardMixin;
