import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
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
  cssClass: [],
  disabled: false,
  tabindex: true,
  type: BUTTON_TYPES[0]
};

// Definable attributes
const BUTTON_PROPS = [
  props.CSS_CLASS,
  props.DISABLED,
  props.ICON,
  'id',
  props.TEXT,
  'type',
  'tabindex'
];

/**
 * IDS Button Component
 */
@customElement('ids-button')
@scss(styles)
@mixin(IdsEventsMixin)
class IdsButton extends IdsElement {
  constructor() {
    super();
    this.state = {};
    Object.keys(BUTTON_DEFAULTS).forEach((prop) => {
      this.state[prop] = BUTTON_DEFAULTS[prop];
    });
    this.shouldUpdate = true;
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
   * @private
   * @readonly
   * @returns {Array} containing classes used to identify this button prototype
   */
  get protoClasses() {
    const iconSlot = this.querySelector('ids-icon[slot]');
    const textSlot = this.querySelector('span[slot]');
    if (iconSlot && !textSlot) {
      return ['ids-icon-button'];
    }
    return ['ids-button'];
  }

  /**
   * Refreshes this button's prototype CSS class
   * @private
   * @returns {void}
   */
  refreshProtoClasses() {
    const cl = this.button.classList;
    const newProtoClass = this.protoClasses;
    const protoClasses = ['ids-button', 'ids-toggle-button', 'ids-icon-button'];

    cl.remove(...protoClasses);
    cl.add(newProtoClass);
  }

  /**
   * Inner template contents
   * @private
   * @returns {string} The template
   */
  template() {
    let cssClass = '';
    let protoClasses = '';
    let disabled = '';
    let icon = '';
    let tabindex = 'tabindex="0"';
    let text = '';
    let type = '';
    if (this.state?.cssClass) {
      cssClass = ` ${this.cssClass
        .concat(this.state.type !== 'default' ? this.state.type : '')
        .join(' ')}`;
    }
    if (this.state?.disabled) {
      disabled = ` disabled="true"`;
    }
    if (this.state?.tabindex) {
      tabindex = `tabindex="${this.state.tabindex ? this.state.tabindex : -1}"`;
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

    return `<button class="${protoClasses}${type}${cssClass}" ${tabindex}${disabled}>
      <slot name="icon">${icon}</slot>
      <slot name="text">${text}</slot>
    </button>`;
  }

  /**
   * Rerender the component template
   * @private
   */
  rerender() {
    const template = document.createElement('template');
    template.innerHTML = this.template();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * Sets up event listeners
   * @private
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
    let newCl = [];
    // @TODO replace with clone utils method
    const prevClasses = [].concat(this.state.cssClass);

    if (Array.isArray(val)) {
      newCl = val;
      attr = val.join(' ');
    } else if (typeof val === 'string' && val.length) {
      newCl = val.split(' ');
    }

    this.state.cssClass = newCl;
    if (newCl.length) {
      this.setAttribute('css-class', attr);
    } else {
      this.removeAttribute('css-class');
    }

    // Remove/Set CSS classes on the actual inner Button component
    const buttonCl = this.button.classList;
    const buttonClArr = Array.from(buttonCl);
    prevClasses.forEach((cssClass) => {
      if (!newCl.includes(cssClass)) {
        buttonCl.remove(cssClass);
      }
    });
    newCl.forEach((newCssClass) => {
      if (!buttonClArr.includes(newCssClass)) {
        buttonCl.add(newCssClass);
      }
    });
  }

  /**
   * @returns {Array} containing extra CSS classes that are applied to the button
   */
  get cssClass() {
    return this.state.cssClass;
  }

  /**
   * Passes a disabled attribute from the custom element to the button
   * @param {boolean} val true if the button will be disabled
   */
  set disabled(val) {
    this.shouldUpdate = false;
    this.removeAttribute('disabled');
    this.shouldUpdate = true;

    const trueVal = val === true || val === 'true';
    this.state.disabled = trueVal;
    if (this.button) {
      this.button.disabled = trueVal;
    }
  }

  /**
   * Retrieve the disabled state of the inner button element
   * @returns {boolean} the inner button's disabled state
   */
  get disabled() {
    return this.state.disabled;
  }

  /**
   * Passes a tabindex attribute from the custom element to the button
   * @param {number} val the tabindex value
   * @returns {void}
   */
  set tabindex(val) {
    this.shouldUpdate = false;
    this.removeAttribute('tabindex');
    this.shouldUpdate = true;

    const trueVal = parseInt(val, 10);
    if (Number.isNaN(trueVal) || trueVal < -1) {
      this.state.tabindex = 0;
      this.button.removeAttribute('tabindex');
      return;
    }
    this.state.tabindex = trueVal;
    this.button.setAttribute('tabindex', trueVal);
  }

  /**
   * @returns {number} the current tabindex number for the button
   */
  get tabindex() {
    return this.state.tabindex;
  }

  /**
   * @param {string} val representing the icon to set
   */
  set icon(val) {
    if (typeof val !== 'string' || !val.length) {
      this.removeAttribute('icon');
      this.state.icon = undefined;
      this.removeIcon();
      return;
    }
    this.state.icon = val;
    this.setAttribute('icon', val);
    this.appendIcon(val);
  }

  /**
   * @returns {undefined|string} a defined IdsIcon's `icon` attribute, if one is present
   */
  get icon() {
    return this.querySelector('ids-icon[slot]')?.icon;
  }

  /**
   * Check if an icon exists, and adds the icon if it's missing
   * @param {string} iconName The icon name to check
   * @private
   */
  appendIcon(iconName) {
    const icon = this.querySelector(`ids-icon[slot="icon"]`);
    if (icon) {
      icon.icon = iconName;
    } else {
      this.insertAdjacentHTML('beforeend', `<ids-icon slot="icon" icon="${iconName}" size="small" class="ids-icon"></ids-icon>`);
    }
    this.refreshProtoClasses();
  }

  /**
   * Check if an icon exists, and removes the icon if it's present
   * @private
   */
  removeIcon() {
    const icon = this.querySelector(`ids-icon[slot="icon"]`);
    if (icon) {
      icon.remove();
    }
    this.refreshProtoClasses();
  }

  /**
   * @param {string} val the text value
   * @returns {void}
   */
  set text(val) {
    if (typeof val !== 'string' || !val.length) {
      this.state.text = '';
      this.removeAttribute('text');
      this.removeText();
      return;
    }

    // @TODO: Run this through an XSS check
    this.state.text = val;
    this.setAttribute('text', val);
    this.appendText(val);
  }

  /**
   * @returns {string} the current text value
   */
  get text() {
    return this.state.text;
  }

  /**
   * Check if the text slot exists, and appends it if it's missing
   * @param {string} val New text contents
   * @private
   */
  appendText(val) {
    const text = this.querySelector(`span[slot="text"]`);
    if (text) {
      text.textContent = val;
    } else {
      this.insertAdjacentHTML('afterbegin', `<span slot="text">${val}</span>`);
    }
    this.refreshProtoClasses();
  }

  /**
   * Checks if the text slot exists, and removes it if necessary
   * @private
   */
  removeText() {
    const text = this.querySelector(`span[slot="text"]`);
    if (text) {
      text.remove();
    }
    this.refreshProtoClasses();
  }

  /**
   * @param {string} val a valid button "type"
   */
  set type(val) {
    if (!val || BUTTON_TYPES.indexOf(val) <= 0) { // BUTTON_TYPES[0] === 'default'
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
   * Generates a "ripple" effect on a specified location inside the button's boundaries.
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
