import {
  IdsElement,
  customElement,
  mix,
  scss,
  props
} from '../ids-base/ids-element';

import { IdsStringUtils as stringUtils } from '../ids-base/ids-string-utils';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../ids-render-loop/ids-render-loop-mixin';

// @ts-ignore
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
  tabIndex: true,
  type: BUTTON_TYPES[0]
};

// Definable attributes
const BUTTON_PROPS = [
  props.CSS_CLASS,
  props.DISABLED,
  props.ICON,
  props.ICON_ALIGN,
  props.ID,
  props.TEXT,
  props.TYPE,
  props.TABINDEX
];

// Icon alignments
const ICON_ALIGN = [
  'align-icon-start',
  'align-icon-end'
];

/**
 * IDS Button Component
 * @type {IdsButton}
 * @inherits IdsElement
 * @mixes IdsRenderLoopMixin
 * @mixes IdsEventsMixin
 */
@customElement('ids-button')
@scss(styles)
class IdsButton extends mix(IdsElement).with(IdsRenderLoopMixin, IdsEventsMixin) {
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
   * @param  {string} name The property name
   * @param  {string} oldValue The property old value
   * @param  {string} newValue The property new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shouldUpdate) {
      switch (name) {
      // Convert "tabindex" to "tabIndex"
      case 'tabindex':
        this.tabIndex = Number(newValue);
        break;
      default:
        IdsElement.prototype.attributeChangedCallback.apply(this, [name, oldValue, newValue]);
        break;
      }
    }
  }

  /**
   * Button-level `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    this.handleEvents();
    this.setIconAlignment();
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
    const textSlot = this.querySelector('span:not(.audible)');
    const iconSlot = this.querySelector('ids-icon[slot]')
      || this.querySelector('ids-icon');

    if (iconSlot && (!textSlot)) {
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
    /** @type {any} */
    const newProtoClass = this.protoClasses;
    const protoClasses = ['ids-button', 'ids-icon-button', 'ids-menu-button', 'ids-toggle-button'];

    cl.remove(...protoClasses);
    cl.add(...newProtoClass);
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    let cssClass = '';
    let protoClasses = '';
    let disabled = '';
    let icon = '';
    let tabIndex = 'tabindex="0"';
    let text = '';
    let type = '';
    if (this.state?.cssClass) {
      cssClass = ` ${this.state.cssClass.join(' ')}`;
    }
    if (this.state?.disabled) {
      disabled = ` disabled="true"`;
    }
    if (this.state?.tabIndex) {
      tabIndex = `tabindex="${this.state.tabIndex}"`;
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
    /* istanbul ignore next */
    if (this.protoClasses.length) {
      protoClasses = `${this.protoClasses.join(' ')}`;
    }

    let alignCSS = ' align-icon-start';
    let namedSlots = `<slot name="icon">${icon}</slot><slot name="text">${text}</slot>`;
    if (this.state?.iconAlign === 'end') {
      alignCSS = ' align-icon-end';
      namedSlots = `<slot name="text">${text}</slot><slot name="icon">${icon}</slot>`;
    }

    return `<button class="${protoClasses}${type}${alignCSS}${cssClass}" ${tabIndex}${disabled}>
      ${namedSlots}
      <slot>${icon}${text}</slot>
    </button>`;
  }

  /**
   * Sets up event listeners
   * @private
   * @returns {void}
   */
  /* istanbul ignore next */
  handleEvents() {
    let x;
    let y;
    let preceededByTouchstart = false;

    this.onEvent('click.ripple', this.button, (/** @type {any} */ e) => {
      if (preceededByTouchstart) {
        preceededByTouchstart = false;
        return;
      }
      x = e.clientX !== 0 ? e.clientX : undefined;
      y = e.clientY !== 0 ? e.clientY : undefined;
      this.createRipple(x, y);
    });

    this.onEvent('touchstart.ripple', this.button, (/** @type {any} */ e) => {
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
      this.setAttribute(props.CSS_CLASS, attr.toString());
    } else {
      this.removeAttribute(props.CSS_CLASS);
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

  get cssClass() {
    return this.state.cssClass;
  }

  /**
   * Passes a disabled attribute from the custom element to the button
   * @param {boolean|string} val true if the button will be disabled
   */
  set disabled(val) {
    this.shouldUpdate = false;
    this.removeAttribute(props.DISABLED);
    this.shouldUpdate = true;

    const trueVal = stringUtils.stringToBool(val);
    this.state.disabled = trueVal;

    /* istanbul ignore next */
    if (this.button) {
      this.button.disabled = trueVal;
    }
  }

  get disabled() {
    return this.state.disabled;
  }

  /**
   * Passes a tabIndex attribute from the custom element to the button
   * @param {number} val the tabIndex value
   * @returns {void}
   */
  set tabIndex(val) {
    // Remove the webcomponent tabIndex
    this.shouldUpdate = false;
    this.removeAttribute(props.TABINDEX);
    this.shouldUpdate = true;

    const trueVal = Number(val);
    if (Number.isNaN(trueVal) || trueVal < -1) {
      this.state.tabIndex = 0;
      this.button.setAttribute(props.TABINDEX, '0');
      return;
    }
    this.state.tabIndex = trueVal;
    this.button.setAttribute(props.TABINDEX, `${trueVal}`);
  }

  /**
   * @returns {number} the current tabIndex number for the button
   */
  get tabIndex() {
    return this.state.tabIndex;
  }

  /**
   * Sets the icon on the button
   * @param {undefined|string} val representing the icon to set
   */
  set icon(val) {
    if (typeof val !== 'string' || !val.length) {
      this.removeAttribute(props.ICON);
      this.state.icon = undefined;
      this.removeIcon();
      return;
    }
    this.state.icon = val;
    this.setAttribute(props.ICON, val);
    this.appendIcon(val);
  }

  /**
   * Gets the current icon used on the button
   * @returns {undefined|string} a defined IdsIcon's `icon` attribute, if one is present
   */
  get icon() {
    // @ts-ignore
    return this.querySelector('ids-icon')?.getAttribute('icon');
  }

  /**
   * Sets the alignment of an existing icon to the 'start' or 'end' of the text
   * @param {string} val the alignment type to set.
   */
  set iconAlign(val) {
    let trueVal = val;
    if (!ICON_ALIGN.includes(`align-icon-${val}`)) {
      trueVal = 'start';
    }
    this.state.iconAlign = trueVal;
    this.setIconAlignment();
  }

  /**
   * @returns {string} containing 'start' or 'end'
   */
  get iconAlign() {
    return this.state.iconAlign;
  }

  /**
   * Check if an icon exists, and adds the icon if it's missing
   * @param {string} iconName The icon name to check
   * @private
   */
  appendIcon(iconName) {
    // First look specifically for an icon slot.
    /** @type {any} */
    const icon = this.querySelector(`ids-icon`); // @TODO check for dropdown/expander icons here

    if (icon) {
      icon.icon = iconName;
      this.setIconAlignment();
    } else {
      this.insertAdjacentHTML('afterbegin', `<ids-icon slot="icon" icon="${iconName}" class="ids-icon"></ids-icon>`);
    }

    this.refreshProtoClasses();
  }

  /**
   * Check if an icon exists, and removes the icon if it's present
   * @private
   */
  removeIcon() {
    const icon = this.querySelector(`ids-icon`); // @TODO check for dropdown/expander icons here

    if (icon) {
      icon.remove();
    }
    this.setIconAlignment();
    this.refreshProtoClasses();
  }

  /**
   * Adds/Removes Icon Alignment CSS classes to/from the inner button component.
   * @private
   */
  setIconAlignment() {
    const alignment = this.iconAlign || 'start';
    const iconStr = this.icon;
    this.button.classList.remove(...ICON_ALIGN);

    // Append the icon, if needed
    if (iconStr) {
      this.button.classList.add(`align-icon-${alignment}`);
    }

    // Re-arrange the slots
    /** @type {HTMLElement | null} */
    const iconSlot = this.button.querySelector('slot[name="icon"]');
    /* istanbul ignore next */
    if (!iconSlot) {
      return;
    }

    if (alignment === 'end') {
      this.button.appendChild(iconSlot);
    } else {
      this.button.prepend(iconSlot);
    }
  }

  /**
   * @param {string} val the text value
   * @returns {void}
   */
  set text(val) {
    this.removeAttribute(props.TEXT);

    if (typeof val !== 'string' || !val.length) {
      this.state.text = '';
      this.removeText();
      return;
    }

    // @TODO: Run this through an XSS check
    this.state.text = val;
    this.appendText(val);
  }

  /**
   * @returns {string} the current text value
   */
  get text() {
    const textElem = this.querySelector('span:not(.audible)');
    if (textElem && textElem.textContent?.length) {
      return textElem.textContent;
    }
    return this.state.text;
  }

  /**
   * Check if the text slot exists, and appends it if it's missing
   * @param {string} val New text contents
   * @private
   */
  appendText(val) {
    const text = this.querySelector(`span:not(.audible)`);
    if (text) {
      text.textContent = val;
    } else {
      this.insertAdjacentHTML('afterbegin', `<span>${val}</span>`);
    }
    this.refreshProtoClasses();
  }

  /**
   * Checks if the text slot exists, and removes it if necessary
   * @private
   */
  removeText() {
    const text = this.querySelector(`span:not(.audible)`);
    if (text) {
      text.remove();
    }
    this.refreshProtoClasses();
  }

  /**
   * Set the button types between 'default', 'primary', 'secondary', 'tertiary', or 'destructive'
   * @param {string} val a valid button "type"
   */
  set type(val) {
    if (!val || BUTTON_TYPES.indexOf(val) <= 0) {
      this.removeAttribute(props.TYPE);
      this.state.type = BUTTON_TYPES[0];
    } else {
      this.setAttribute(props.TYPE, val);
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
   * @private
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
   * @returns {object} containing x/y coordinates of the ripple
   */
  getRippleOffsets(x, y) {
    const btnRect = this.getBoundingClientRect();
    /* istanbul ignore next */
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
   * @private
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
    /** @type {object} */
    const btnOffsets = this.getRippleOffsets(x, y);
    rippleEl.classList.add('ripple-effect');
    rippleEl.setAttribute('aria-hidden', 'true');
    rippleEl.setAttribute('focusable', 'false');
    rippleEl.setAttribute('role', 'presentation');

    this.button.prepend(rippleEl);
    rippleEl.style.left = `${btnOffsets.x}px`;
    rippleEl.style.top = `${btnOffsets.y}px`;
    rippleEl.classList.add('animating');

    // After a short time, remove the ripple effect
    if (this.rippleTimeout) {
      this.rippleTimeout.destroy(true);
    }
    // @ts-ignore
    this.rippleTimeout = this.rl.register(new IdsRenderLoopItem({
      duration: 1200,
      timeoutCallback() {
        rippleEl.remove();
      }
    }));
  }

  /**
   * Overrides the standard "focus" behavior to instead pass focus to the inner HTMLButton element.
   */
  focus() {
    this.button.focus();
  }
}

export { IdsButton, BUTTON_PROPS, BUTTON_TYPES };
