import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';

type Constraints = IdsConstructor<EventsMixinInterface>;

/**
 * Toggles CSS class for a component container depends on how the component receives focus,
 * clicked or on key entry (tabs or arrows).
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsHideFocusMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.HIDE_FOCUS
    ];
  }

  /**
   * @property {boolean} isClick indicates if the component being clicked
   */
  #isClick = false;

  /**
   * @property {boolean} isFocused indicates if the component is focused on key entry
   */
  #isFocused = false;

  connectedCallback() {
    super.connectedCallback?.();

    // Apply default focus state classes
    if (this.hideFocus) {
      this.#attachHideFocusEvents();
      this.#addHideFocusCssClass();
    }
    if (document.activeElement === this) {
      this.#addIsFocusedCssClass();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#removeHideFocusEvents();
    this.#removeHideFocusCssClass();
    this.#removeIsFocusedCssClass();
  }

  /**
   * Set up event listeners
   * @private
   * @returns {void}
   */
  #attachHideFocusEvents() {
    this.#removeHideFocusEvents();

    this.onEvent('focusin.hide-focus', this, (e) => {
      if (!this.#isClick && !this.#isFocused) {
        this.#addIsFocusedCssClass();
        this.#removeHideFocusCssClass();
        this.triggerEvent('hidefocusremove', this, e);
      }
      this.#isClick = false;
      this.#isFocused = true;
    });
    this.onEvent('focusout.hide-focus', this, (e) => {
      this.#addHideFocusCssClass();
      this.#removeIsFocusedCssClass();
      this.#isFocused = false;
      this.triggerEvent('hidefocusadd', this, e);
    });
    this.onEvent('mousedown.hide-focus', this, (e) => {
      this.#isClick = true;
      this.#addIsFocusedCssClass();
      this.#addHideFocusCssClass();
      this.triggerEvent('hidefocusadd', this, e);
    });
  }

  #removeHideFocusEvents() {
    this.offEvent('focusin.hide-focus');
    this.offEvent('focusout.hide-focus');
    this.offEvent('mousedown.hide-focus');
  }

  #addHideFocusCssClass() {
    this.container?.classList.add('hide-focus');
  }

  #addIsFocusedCssClass() {
    this.container?.classList.add('is-focused');
  }

  #removeHideFocusCssClass() {
    this.container?.classList.remove('hide-focus');
  }

  #removeIsFocusedCssClass() {
    this.container?.classList.remove('is-focused');
  }

  /**
   * Set whether or not the functionality should be enabled. Enabled by default
   * @param {string|boolean|null} value hide-focus attribute value
   */
  set hideFocus(value: string | boolean | null) {
    const boolVal = stringToBool(value);
    this.setAttribute(attributes.HIDE_FOCUS, String(boolVal));

    if (boolVal) {
      this.#addHideFocusCssClass();
      this.#attachHideFocusEvents();
    } else {
      this.#removeHideFocusCssClass();
      this.#removeHideFocusEvents();
    }
  }

  /**
   * hide-focus attribute
   * @returns {boolean} hideFocus param converted to boolean from attribute value. Defaults to true
   */
  get hideFocus(): boolean {
    const attrVal = this.getAttribute(attributes.HIDE_FOCUS);

    return attrVal ? stringToBool(attrVal) : true;
  }
};

export default IdsHideFocusMixin;
