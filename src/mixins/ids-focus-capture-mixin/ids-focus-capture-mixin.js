import { attributes } from '../../core';
// Import Utils
import { IdsStringUtils, IdsXssUtils } from '../../utils';

const FOCUS_CAPTURE_EVENTNAME = 'keydown.focus-capture';

/**
 * Doesn't allow keyboard focus to be present on elements outside of this one
 * when the `captures-focus` attribute is present.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsFocusCaptureMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.CAPTURES_FOCUS,
      attributes.CYCLES_FOCUS
    ];
  }

  /**
   * @property {boolean} capturesFocus If true, retains focus within the host component.
   * If focus is attempted on an element outside of this one, it will be "captured" and
   * placed on an element inside of this component.
   */
  #capturesFocus = false;

  set capturesFocus(val) {
    const currentVal = this.#capturesFocus;
    const newVal = IdsStringUtils.stringToBool(val);
    if (currentVal !== newVal) {
      this.#capturesFocus = newVal;
      newVal
        ? this.setAttribute(attributes.CAPTURES_FOCUS, `${newVal}`)
        : this.removeAttribute(attributes.CAPTURES_FOCUS);
      this.#updateFocusEvents();
    }
  }

  get capturesFocus() {
    return this.#capturesFocus;
  }

  /**
   * @property {boolean} cyclesFocus If true, while `capturesFocus` is true, cycles the focus
   * target element to the opposite end of the container.
   */
  #cyclesFocus = true;

  set cyclesFocus(val) {
    const currentVal = this.#cyclesFocus;
    const newVal = IdsStringUtils.stringToBool(val);
    if (currentVal !== newVal) {
      this.#cyclesFocus = newVal;
      newVal
        ? this.setAttribute(attributes.CYCLES_FOCUS, `${newVal}`)
        : this.removeAttribute(attributes.CYCLES_FOCUS);
      this.gainFocus();
    }
  }

  get cyclesFocus() {
    return this.#cyclesFocus;
  }

  /**
   * Connects the focus event to this component
   * @returns {void}
   */
  #attachFocusEvents() {
    if (this.handledEvents.get(FOCUS_CAPTURE_EVENTNAME)) {
      return;
    }

    // Keydown events at the document level intercept default Tab behavior on specified elements.
    // On these elements we adjust tabbing behavior.
    if (typeof this.onEvent === 'function') {
      this.onEvent(FOCUS_CAPTURE_EVENTNAME, document, (e) => {
        const isOnFirst = document.activeElement.isEqualNode(this.firstFocusableElem);
        const isOnLast = document.activeElement.isEqualNode(this.lastFocusableElem);

        switch (e.key) {
        case 'Tab':
          if (isOnFirst && e.shiftKey) {
            e.preventDefault();
            requestAnimationFrame(() => {
              const targetElem = this.cyclesFocus ? this.lastFocusableElem : this.firstFocusableElem;
              targetElem.focus();
            });
          }
          if (isOnLast && !e.shiftKey) {
            e.preventDefault();
            requestAnimationFrame(() => {
              const targetElem = this.cyclesFocus ? this.firstFocusableElem : this.lastFocusableElem;
              targetElem.focus();
            });
          }
          break;
        default:
          break;
        }
        return true;
      });
    }
  }

  /**
   * Disconnects the focus event from this component
   * @returns {void}
   */
  #removeFocusEvents() {
    if (typeof this.offEvent === 'function') {
      this.offEvent(FOCUS_CAPTURE_EVENTNAME);
    }
  }

  /**
   * Adds/Removes the focus event based on component state
   */
  #updateFocusEvents() {
    if (this.capturesFocus) {
      this.gainFocus();
      this.#attachFocusEvents();
    } else {
      this.#removeFocusEvents();
    }
  }

  #focusableSelectors = [
    'button',
    'ids-button',
    'ids-menu-button',
    'ids-modal-button',
    'ids-toggle-button',
    '[href]',
    'input',
    'ids-input',
    'ids-checkbox',
    'ids-radio',
    'ids-switch',
    'select',
    'textarea',
    'ids-textarea',
    '[tabindex]:not([tabindex="-1"]'
  ];

  get focusableSelectors() {
    return this.#focusableSelectors;
  }

  set focusableSelectors(val = []) {
    if (Array.isArray(val)) {
      this.#focusableSelectors = val;
    }
  }

  /**
   * @property {Array<HTMLElement>} focusable reference to all focusable elements on the document
   */
  #focusable;

  /**
   * @readonly
   * @returns {Array<HTMLElement>} all possible focusable elements within Light DOM on the current page
   */
  get focusable() {
    if (!this.#focusable) {
      const selectorStr = this.focusableSelectors.join(', ');
      this.#focusable = [...document.querySelectorAll(selectorStr)];
    }
    return this.#focusable;
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} focusable elements inside of this WebComponent's Light DOM
   */
  get componentFocusable() {
    if (!this.focusable) {
      return [];
    }
    return this.focusable.filter((i) => this.contains(i));
  }

  /**
   * @readonly
   * @returns {HTMLElement} the first focusable child element inside this component
   */
  get firstFocusableElem() {
    return this.componentFocusable[0];
  }

  /**
   * @readonly
   * @returns {HTMLElement} the next focusable child element inside this component
   */
  get nextFocusableElem() {
    if (!this.focusable) {
      return document.activeElement;
    }

    const thisIndex = this.focusable.indexOf(document.activeElement);
    const nextElem = this.focusable[thisIndex + 1] || document.activeElement;
    if (!this.contains(nextElem)) {
      return this.firstFocusableElem;
    }
    return nextElem;
  }

  /**
   * @readonly
   * @returns {HTMLElement} the previous focusable child element inside this component
   */
  get previousFocusableElem() {
    if (!this.focusable) {
      return document.activeElement;
    }

    let thisIndex = this.focusable.indexOf(document.activeElement);
    if (!thisIndex) thisIndex = this.focusable.length;
    const prevElem = this.focusable[thisIndex - 1] || document.activeElement;
    if (!this.contains(prevElem)) {
      return this.lastFocusableElem;
    }
    return prevElem;
  }

  /**
   * @readonly
   * @returns {HTMLElement} the last focusable child element inside this component
   */
  get lastFocusableElem() {
    return this.componentFocusable.slice(-1)[0];
  }

  /**
   * Focuses the first-possible element within the Modal
   * @param {number|string} index the desired focusable element index to use
   * @returns {void}
   */
  setFocus(index = 0) {
    const focusable = this.componentFocusable;
    const focusedEl = document.activeElement;
    const focusedIndex = this.componentFocusable.indexOf(focusedEl);
    let safeIndex = 0;

    if (focusable.length) {
      switch (index) {
      case 'last':
        safeIndex = focusable.length - 1;
        break;
      case 'first':
      case '': // Leave at 0
        break;
      default: // undefined
        safeIndex = parseInt(index);
        break;
      }
      requestAnimationFrame(() => {
        focusable[safeIndex].focus();
      });
    }

    return (focusedIndex === safeIndex);
  }

  /**
   * Retrieves focus from elements outside of this one, and attaches
   * focus to a specified element index.
   * @param {number|string} index the desired focusable element index to use
   * @returns {void}
   */
  gainFocus(index = 0) {
    if (!this.contains(document.activeElement)) {
      this.setFocus(index);
    }
  }
};

export default IdsFocusCaptureMixin;
