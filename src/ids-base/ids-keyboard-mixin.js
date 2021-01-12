/**
 * Handle keyboard shortcuts and pressed down keys
 */
class IdsKeyboardMixin {
  /**
   * Initializes the keyboard management system with the current object
   * @param {object} elem the element for linkage
   * @private
   */
  init(elem) {
    this.element = elem;
    this.hotkeys = new Map();
    this.pressedKeys = new Map();

    this.keyDownHandler = (/** @type {any} */ e) => {
      this.press(e.key);
      this.dispatchHotkeys(e);
    };
    this.element.addEventListener('keydown', this.keyDownHandler);

    this.keyUpHandler = (/** @type {any} */ e) => {
      this.unpress(e.key);
    };
    this.element.addEventListener('keyup', this.keyUpHandler);
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
    if (!this.element) {
      this.init(elem);
    }

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
    this.hotkeys.forEach((value, key) => {
      if (key.split(',').indexOf(e.key) > -1) {
        value(e);
      }
    });
  }

  /**
   * Remove all handlers and clear memory
   */
  destroy() {
    if (!this.element) {
      return;
    }

    this.element.removeEventListener('keydown', this.keyDownHandler);
    this.element.removeEventListener('keyup', this.keyUpHandler);
    delete this.keyDownHandler;
    delete this.keyUpHandler;
    delete this.element;
  }
}

export { IdsKeyboardMixin };
