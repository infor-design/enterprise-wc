// Import Core
import { attributes } from '../../core/ids-attributes';

// Import Utils
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { getClosestContainerNode } from '../../utils/ids-dom-utils/ids-dom-utils';
import { IdsConstructor } from '../../core/ids-element';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';

const FOCUS_CAPTURE_EVENTNAME = 'keydown.focus-capture';

type Constraints = IdsConstructor<EventsMixinInterface>;

/**
 * Doesn't allow keyboard focus to be present on elements outside of this one
 * when the `captures-focus` attribute is present.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsFocusCaptureMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.CAPTURES_FOCUS,
      attributes.CYCLES_FOCUS,
      attributes.FOCUS_INLINE
    ];
  }

  /**
   * @property {Node} hostNode the top-level node responsible for hosting focus.
   * This is normally `document` but can also be another component's Shadow Root.
   */
  #hostNode: any = document;

  connectedCallback() {
    super.connectedCallback?.();
    if (this.hasAttribute(attributes.FOCUS_INLINE)) this.syncInline(true);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this.#removeFocusEvents();
    this.#hostNode = undefined;
    this.#focusableElementsInDocument = [];
  }

  /**
   * @property {boolean} capturesFocus If true, retains focus within the host component.
   * If focus is attempted on an element outside of this one, it will be "captured" and
   * placed on an element inside of this component.
   */
  #capturesFocus = false;

  set capturesFocus(val) {
    const currentVal = this.#capturesFocus;
    const newVal = stringToBool(val);
    if (currentVal !== newVal) {
      this.#capturesFocus = newVal;
      if (newVal) {
        this.setAttribute(attributes.CAPTURES_FOCUS, `${newVal}`);
      } else {
        this.removeAttribute(attributes.CAPTURES_FOCUS);
      }
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
    const newVal = stringToBool(val);
    if (currentVal !== newVal) {
      this.#cyclesFocus = newVal;
      if (newVal) {
        this.setAttribute(attributes.CYCLES_FOCUS, `${newVal}`);
        this.gainFocus();
      } else {
        this.removeAttribute(attributes.CYCLES_FOCUS);
      }
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
    const keydownEventHandler = (e: any) => {
      const isOnFirst = this.#hostNode.activeElement?.isEqualNode(this.firstFocusableElement);
      const isOnLast = this.#hostNode.activeElement?.isEqualNode(this.lastFocusableElement);

      switch (e.key) {
        case 'Tab':
          if (isOnFirst && e.shiftKey) {
            e.preventDefault();
            requestAnimationFrame(() => {
              const targetElem: any = this.cyclesFocus ? this.lastFocusableElement : this.firstFocusableElement;
              targetElem.focus();
            });
          }
          if (isOnLast && !e.shiftKey) {
            e.preventDefault();
            requestAnimationFrame(() => {
              const targetElem: any = this.cyclesFocus ? this.firstFocusableElement : this.lastFocusableElement;
              targetElem.focus();
            });
          }
          break;
        default:
          break;
      }
      return true;
    };

    // Keydown events at the document level intercept default Tab behavior on specified elements.
    // On these elements we adjust tabbing behavior.
    this.onEvent(FOCUS_CAPTURE_EVENTNAME, this.#hostNode, keydownEventHandler.bind(this));
  }

  /**
   * Disconnects the focus event from this component
   * @returns {void}
   */
  #removeFocusEvents() {
    this.offEvent(FOCUS_CAPTURE_EVENTNAME);
  }

  /**
   * Adds/Removes the focus event based on component state
   */
  #updateFocusEvents() {
    this.#removeFocusEvents();
    if (this.capturesFocus) {
      this.gainFocus();
      this.#attachFocusEvents();
    }
  }

  #focusableSelectors = [
    'button',
    'ids-button',
    'ids-dropdown',
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

  set focusableSelectors(val) {
    if (Array.isArray(val)) {
      this.#focusableSelectors = val;
    }
  }

  /**
   * @property {Array<HTMLElement>} focusable reference to all focusable elements on the document
   */
  #focusableElementsInDocument: any = [];

  /**
   * @readonly
   * @returns {Array<HTMLElement>} all possible focusable elements within Light DOM on the current page
   */
  get focusableElementsInDocument() {
    if (!this.#focusableElementsInDocument.length && this.focusableSelectors.length) this.refreshFocusableElements();
    return this.#focusableElementsInDocument;
  }

  refreshFocusableElements() {
    const selectorStr = this.focusableSelectors.join(', ');
    this.#focusableElementsInDocument = [...this.#hostNode.querySelectorAll(selectorStr)]
      .filter((i: HTMLElement) => !i.hasAttribute(attributes.HIDDEN));
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} focusable elements inside of this WebComponent's Light DOM
   */
  get focusableElements() {
    if (this.focusInline) return this.focusableElementsInDocument;
    return this.focusableElementsInDocument.filter((i: any) => this.contains(i));
  }

  /**
   * @readonly
   * @returns {HTMLElement} the first focusable child element inside this component
   */
  get firstFocusableElement() {
    return this.focusableElements[0];
  }

  /**
   * @readonly
   * @returns {HTMLElement} the next focusable child element inside this component
   */
  get nextFocusableElement() {
    if (!this.focusableElements.length) {
      return undefined;
    }

    const thisIndex = this.focusableElementsInDocument.indexOf(this.#hostNode.activeElement);
    const nextElem = this.focusableElementsInDocument[thisIndex + 1];
    if (!this.contains(nextElem) && this.cyclesFocus) {
      return this.firstFocusableElement;
    }
    return nextElem;
  }

  /**
   * @readonly
   * @returns {HTMLElement} the previous focusable child element inside this component
   */
  get previousFocusableElement() {
    if (!this.focusableElements.length) {
      return undefined;
    }

    const thisIndex = this.focusableElementsInDocument.indexOf(this.#hostNode.activeElement);
    const prevElem = this.focusableElementsInDocument[thisIndex - 1];
    if (!this.contains(prevElem) && this.cyclesFocus) {
      return this.lastFocusableElement;
    }
    return prevElem;
  }

  /**
   * @readonly
   * @returns {HTMLElement} the last focusable child element inside this component
   */
  get lastFocusableElement() {
    return this.focusableElements.slice(-1)[0];
  }

  /**
   * Focuses the first-possible element within the Modal
   * @param {number|string} index the desired focusable element index to use
   * @returns {void}
   */
  setFocus(index: number | string = 0) {
    const focusable = this.focusableElements;
    const focusedEl = this.#hostNode.activeElement;
    const focusedIndex = this.focusableElements.indexOf(focusedEl);
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
          safeIndex = typeof index === 'string' ? parseInt(index) : index;
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
    if (!this.contains(this.#hostNode.activeElement)) {
      this.setFocus(index);
    }
  }

  /**
   * Sets the correct host node to use for focus detection
   * @param {boolean | null} val if truthy, uses this component's shadow root for focus detection
   */
  syncInline(val: boolean | null) {
    if (val) this.#hostNode = this.shadowRoot;
    else this.#hostNode = getClosestContainerNode(this);
  }

  /**
   * @param {boolean | string} val true if focus detection should only occur within this component's shadow root
   */
  set focusInline(val: boolean | string | null) {
    const newValue = stringToBool(val);
    if (newValue) {
      this.setAttribute(attributes.FOCUS_INLINE, 'true');
    } else {
      this.removeAttribute(attributes.FOCUS_INLINE);
    }
    this.syncInline(newValue);
  }

  /**
   * @returns {boolean} true if this component should only capture focus within its shadow root
   */
  get focusInline() {
    return this.hasAttribute(attributes.FOCUS_INLINE);
  }
};

export default IdsFocusCaptureMixin;
