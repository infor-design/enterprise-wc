import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsDOMUtilsMixin } from '../ids-base/ids-dom-utils';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-button.scss';

// Button Styles
const BUTTON_TYPES = [
  'default',
  'primary',
  'secondary',
  'tertiary',
  'destructive'
];

// Default Button state values
const BUTTON_DEFAULTS = {
  cssClasses: [],
  disabled: false,
  focusable: true,
  type: BUTTON_TYPES[0]
};

// Definable attributes
const BUTTON_PROPS = [
  props.CSS_CLASS,
  props.DISABLED,
  props.FOCUSABLE,
  props.ICON,
  'id',
  props.TEXT,
  'type'
];

/**
 * IDS Button Component
 */
@customElement('ids-button')
@scss(styles)
@mixin(IdsDOMUtilsMixin)
@mixin(IdsEventsMixin)
class IdsButton extends IdsElement {
  constructor() {
    super();
    this.shouldUpdate = true;
    this.state = {};
    Object.keys(BUTTON_DEFAULTS).forEach((prop) => {
      this.state[prop] = BUTTON_DEFAULTS[prop];
    });
  }

  /**
   * Override `attributeChangedCallback` from IdsElement to wrap its normal operation in a
   * check for a true `shouldUpdate` property.
   * @private
   * @param  {string} name The property name
   * @param  {string} oldValue The property old value
   * @param  {string} newValue The property new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shouldUpdate) {
      IdsElement.prototype.attributeChangedCallback.apply(this, [name, oldValue, newValue]);
    }
  }

  /**
   * Button-level `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    this.handleEvents();
    this.shouldUpdate = true;
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return BUTTON_PROPS;
  }

  /**
   * @returns {Array} containing classes used to identify this button prototype
   */
  get protoClasses() {
    const textSlot = this.querySelector('span');
    if (!textSlot) {
      return ['ids-icon-button'];
    }
    return ['ids-button'];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    let cssClasses = '';
    let protoClasses = '';
    let disabled = '';
    let icon = '';
    let tabindex = 'tabindex="0"';
    let text = '';
    let type = '';
    if (this.state?.cssClass) {
      cssClasses = ` ${this.cssClass
        .concat(this.state.type !== 'default' ? this.state.type : '')
        .join(' ')}`;
    }
    if (this.state?.disabled) {
      disabled = ` disabled="true"`;
    }
    if (this.state?.focusable) {
      tabindex = `tabindex="${this.state.focusable ? 0 : -1}"`;
    }
    if (this.state?.icon) {
      icon = `<ids-icon slot="icon" icon="${this.state.icon}"></ids-icon>`;
    }
    if (this.state?.text) {
      text = `<span slot="text">${this.state.text}</span>`;
    }
    if (this.state && this.state?.type !== 'default') {
      type = ` btn-${this.state.type}`;
    }
    if (this.protoClasses.length) {
      protoClasses = `${this.protoClasses.join(' ')}`;
    }

    return `<button class="${protoClasses}${type}${cssClasses}" ${tabindex}${disabled}>
      <slot name="icon">${icon}</slot>
      <slot name="text">${text}</slot>
    </button>`;
  }

  /**
   * Sets up event listeners
   * @returns {void}
   */
  handleEvents() {
    let x;
    let y;
    let preceededByTouchstart = false;

    this.eventHandlers.addEventListener('click', this.button, (e) => {
      if (preceededByTouchstart) {
        preceededByTouchstart = false;
        return;
      }
      x = e.clientX !== 0 ? e.clientX : undefined;
      y = e.clientY !== 0 ? e.clientY : undefined;
      this.createRipple(x, y);
    });

    this.eventHandlers.addEventListener('touchstart', this.button, (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        x = touch.clientX !== 0 ? touch.clientX : undefined;
        y = touch.clientY !== 0 ? touch.clientY : undefined;
        this.createRipple(x, y);
        preceededByTouchstart = true;
      }
    }, {
      passive: true
    });
  }

  /**
   * @readonly
   * @returns {HTMLButtonElement} reference to the true button element used in the Shadow Root
   */
  get button() {
    return this.shadowRoot.querySelector('button');
  }

  /**
   * @param {Array|string} val containing CSS classes that will be applied to the button
   * Strings will be split into an array and separated by whitespace.
   */
  set cssClass(val) {
    let attr = val;
    if (Array.isArray(val)) {
      this.state.cssClasses = val;
      attr = val.join(' ');
    } else if (typeof val === 'string') {
      this.state.cssClasses = val.split(' ');
    }

    this.shouldUpdate = false;
    this.setAttribute('css-class', attr);
    this.shouldUpdate = true;
  }

  /**
   * @returns {Array} containing extra CSS classes that are applied to the button
   */
  get cssClass() {
    return this.state.cssClasses;
  }

  /**
   * Pass a disabled attribute along to the inner Button element
   * @param {boolean} val true if the button will be disabled
   */
  set disabled(val) {
    const trueVal = val === true;
    this.state.disabled = trueVal;
    if (this.button) {
      this.button.disabled = trueVal;
    }

    this.shouldUpdate = false;
    if (trueVal && !this.hasAttribute('disabled')) {
      this.setAttribute('disabled', true);
    }
    if (!trueVal && this.hasAttribute('disabled')) {
      this.removeAttribute('disabled');
    }
    this.shouldUpdate = true;
  }

  /**
   * Retrieve the disabled state of the inner button element
   * @returns {boolean} the inner button's disabled state
   */
  get disabled() {
    return this.state.disabled;
  }

  /**
   * Controls the ability of the inner button to become focused
   * @param {boolean} val true if the button will be focusable
   */
  set focusable(val) {
    const trueVal = val === true;
    this.state.focusable = trueVal;
    if (this.button) {
      this.button.tabIndex = trueVal ? 0 : -1;
    }

    this.shouldUpdate = false;
    if (trueVal && !this.hasAttribute('focusable')) {
      this.setAttribute('focusable', this.state.focusable);
    }
    if (!trueVal && this.hasAttribute('focusable')) {
      this.removeAttribute('focusable');
    }
    this.shouldUpdate = true;
  }

  /**
   * @returns {boolean} true if the inner button's tabIndex is zero (focusable)
   */
  get focusable() {
    return this.state.focusable;
  }

  /**
   * @param {string} val the text value
   * @returns {void}
   */
  set text(val) {
    if (typeof val !== 'string' || !val.length) {
      this.state.text = '';
      this.removeAttribute('text');
    } else {
      // @TODO: Run this through an XSS check
      this.state.text = val;
      this.setAttribute('text', val);
    }

    // Update an existing text slot with the new text
    const textSlot = this.querySelector('span[slot]');
    if (textSlot) {
      textSlot.textContent = this.state.text;
    }
  }

  /**
   * @returns {string} the current text value
   */
  get text() {
    return this.state.text;
  }

  /**
   * @param {string} val a valid
   */
  set type(val) {
    if (!val || BUTTON_TYPES.indexOf(val) === -1) {
      this.removeAttribute('type');
      this.state.type = BUTTON_TYPES[0];
    } else {
      this.setAttribute('type', val);
      if (this.state.type !== val) {
        this.state.type = val;
      }
    }
    this.setTypeClass(val);
  }

  /**
   * @returns {string} the currently set type
   */
  get type() {
    return this.state.type;
  }

  /**
   * Sets the correct type class on the Shadow button.
   * @param {string} val desired type class
   */
  setTypeClass(val) {
    BUTTON_TYPES.forEach((type) => {
      const typeClassName = `btn-${type}`;
      if (val === type) {
        if (type !== 'default' && !this.button.classList.contains(typeClassName)) {
          this.button.classList.add(typeClassName);
        }
        return;
      }
      if (this.button.classList.contains(typeClassName)) {
        this.button.classList.remove(typeClassName);
      }
    });
  }

  /**
   * The math used for getting the ripple offsets
   * @private
   * @param {number} x the X coordinate
   * @param {number} y the Y coordinate
   * @returns {Array} containing x/y coordinates of the ripple
   */
  getRippleOffsets(x, y) {
    const btnRect = this.getBoundingClientRect();
    const halfRippleSize = this.button.classList.contains('ids-icon-button') ? 35 : 125;
    let btnX;
    let btnY;

    // If "X" is defined, assume it's page coordinates and subtract the
    // custom element's offsets from its location in the page.
    // Otherwise, simply set the offset to the center of the button.
    if (!x) {
      btnX = (btnRect.width / 2);
    } else {
      btnX = x - btnRect.left;
    }

    // If "Y" is defined, assume it's page coordinates and subtract the
    // custom element's offsets from its location in the page.
    // Otherwise, simply set the offset to the center of the button.
    if (!y) {
      btnY = (btnRect.height / 2);
    } else {
      btnY = y - btnRect.top;
    }

    // Subtract half the ripple size from each dimension.
    btnX -= halfRippleSize;
    btnY -= halfRippleSize;

    return { x: btnX, y: btnY };
  }

  /**
   * Generates an SVG-based "ripple" effect on a specified location inside the button's boundaries.
   * The coordinates defined are actual page coordinates, using the top/left of the page as [0,0],
   * which allows this to connect easily to mouse/touch events.
   * @param {number} x the X coordinate
   * @param {number} y the Y coordinate
   * @returns {void}
   */
  createRipple(x, y) {
    if (this.disabled) {
      return;
    }

    // Remove pre-existing ripples
    const otherRippleEls = this.button.querySelectorAll('.ripple-effect');
    otherRippleEls.forEach((rippleEl) => {
      rippleEl.remove();
    });

    // Make/Place a new ripple
    const rippleEl = document.createElement('span');
    const btnOffsets = this.getRippleOffsets(x, y);
    rippleEl.classList.add('ripple-effect');
    rippleEl.setAttribute('aria-hidden', true);
    rippleEl.setAttribute('focusable', false);
    rippleEl.setAttribute('role', 'presentation');

    this.button.prepend(rippleEl);
    rippleEl.style.left = `${btnOffsets.x}px`;
    rippleEl.style.top = `${btnOffsets.y}px`;
    rippleEl.classList.add('animating');

    // After a short time, remove the ripple effect
    // @TODO replace this with a renderloop callback
    setTimeout(() => {
      rippleEl.remove();
    }, 1200);
  }
}

export { IdsButton, BUTTON_PROPS, BUTTON_TYPES };
