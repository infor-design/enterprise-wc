import {
  IdsElement,
  customElement,
  mix,
  scss,
  attributes
} from '../../core';

import { IdsStringUtils } from '../../utils';

import {
  IdsEventsMixin,
  IdsColorVariantMixin,
  IdsRenderLoopMixin,
  IdsRenderLoopItem,
  IdsThemeMixin,
  IdsTooltipMixin
} from '../../mixins';

import styles from './ids-button.scss';

const { stringToBool } = IdsStringUtils;

// Button Styles
const BUTTON_TYPES = [
  'default',
  'primary',
  'secondary',
  'tertiary',
  'destructive',
  'swipe-action-left',
  'swipe-action-right'
];

// Default Button state values
const BUTTON_DEFAULTS = {
  cssClass: [],
  disabled: false,
  tabIndex: true,
  type: BUTTON_TYPES[0]
};

// Definable attributes
const BUTTON_ATTRIBUTES = [
  attributes.CSS_CLASS,
  attributes.DISABLED,
  attributes.ICON,
  attributes.ICON_ALIGN,
  attributes.ID,
  attributes.NO_RIPPLE,
  attributes.SQUARE,
  attributes.TEXT,
  attributes.TYPE,
  attributes.TABINDEX,
  attributes.COLOR_VARIANT
];

// Icon alignments
const ICON_ALIGN = [
  'align-icon-start',
  'align-icon-end'
];

const baseProtoClasses = [
  'ids-button',
  'ids-icon-button',
  'ids-menu-button',
  'ids-toggle-button'
];

/**
 * IDS Button Component
 * @type {IdsButton}
 * @inherits IdsElement
 * @mixes IdsRenderLoopMixin
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @mixes IdsTooltipMixin
 * @part button - the button element
 * @part icon - the icon element
 * @part text - the text element
 */
@customElement('ids-button')
@scss(styles)
class IdsButton extends mix(IdsElement).with(
    IdsRenderLoopMixin,
    IdsEventsMixin,
    IdsColorVariantMixin,
    IdsThemeMixin,
    IdsTooltipMixin
  ) {
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
        if (Number.isNaN(Number.parseInt(newValue))) {
          this.tabIndex = null;
        }
        this.tabIndex = Number(newValue);
        break;
      default:
        super.attributeChangedCallback.apply(this, [name, oldValue, newValue]);
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
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [...super.attributes, ...BUTTON_ATTRIBUTES];
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate'];

  /**
   * Figure out the classes
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

    cl.remove(...baseProtoClasses);
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
      icon = `<ids-icon slot="icon" part="icon" icon="${this.state.icon}"></ids-icon>`;
    }
    if (this.state?.text) {
      text = `<span slot="text" part="text">${this.state.text}</span>`;
    }
    if (this.state && this.state?.type !== 'default') {
      type = ` btn-${this.state.type}`;
    }

    /* istanbul ignore next */
    if (this.hasAttribute(attributes.SQUARE)) {
      cssClass += ' square';
    }

    /* istanbul ignore next */
    if (this.protoClasses.length) {
      protoClasses = `${this.protoClasses.join(' ')}`;
    }

    let alignCSS = ' align-icon-start';
    let namedSlots = `<slot name="icon" part="icon">${icon}</slot><slot name="text">${text}</slot>`;
    if (this.state?.iconAlign === 'end') {
      alignCSS = ' align-icon-end';
      namedSlots = `<slot name="text" part="text">${text}</slot><slot name="icon">${icon}</slot>`;
    }

    return `<button part="button" class="${protoClasses}${type}${alignCSS}${cssClass}" ${tabIndex}${disabled}>
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
    if (this.noRipple) {
      return;
    }

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
      this.setAttribute(attributes.CSS_CLASS, attr.toString());
    } else {
      this.removeAttribute(attributes.CSS_CLASS);
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
    const isValueTruthy = stringToBool(val);
    this.shouldUpdate = false;
    if (isValueTruthy) {
      this.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.shouldUpdate = true;
    this.state.disabled = isValueTruthy;

    /* istanbul ignore next */
    if (this.button) {
      this.button.disabled = isValueTruthy;
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
    const trueVal = Number(val);

    if (Number.isNaN(trueVal) || trueVal < -1) {
      this.state.tabIndex = 0;
      this.button.setAttribute(attributes.TABINDEX, '0');
      this.removeAttribute(attributes.TABINDEX);
      return;
    }

    this.state.tabIndex = trueVal;
    this.button.setAttribute(attributes.TABINDEX, `${trueVal}`);
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
      this.removeAttribute(attributes.ICON);
      this.state.icon = undefined;
      this.removeIcon();
      return;
    }
    this.state.icon = val;
    this.setAttribute(attributes.ICON, val);
    this.appendIcon(val);
  }

  /**
   * Gets the current icon used on the button
   * @returns {undefined|string} a defined IdsIcon's `icon` attribute, if one is present
   */
  get icon() {
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
    this.removeAttribute(attributes.TEXT);

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
    return this.textContent;
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
      this.removeAttribute(attributes.TYPE);
      this.state.type = BUTTON_TYPES[0];
    } else {
      this.setAttribute(attributes.TYPE, val);
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
   * If set to true the ripple effect will be disabled.
   * @param {boolean} val The ripple value
   */
  set noRipple(val) {
    if (IdsStringUtils.stringToBool(val)) {
      this.setAttribute(attributes.NO_RIPPLE, true);
      this.state.noRipple = true;
      this.offEvent('click.ripple');
      this.offEvent('touchstart.ripple');
      return;
    }
    this.removeAttribute(attributes.NO_RIPPLE);
    this.state.noRipple = false;
  }

  /**
   * @returns {string} the currently set type
   */
  get noRipple() {
    return this.state.noRipple || false;
  }

  /**
   * @param {boolean} value whether the corners of the button as an icon-button should be angled/90°
   */
  set square(value) {
    const isTruthy = stringToBool(value);

    if (isTruthy && !this.button.classList.contains('square')) {
      this.button.classList.add('square');
    } else if (!isTruthy && this.button.classList.contains('square')) {
      this.button.classList.remove('square');
    }

    if (isTruthy && !this.hasAttribute(attributes.SQUARE)) {
      this.setAttribute(attributes.SQUARE, '');
    } else if (!isTruthy && this.hasAttribute(attributes.SQUARE)) {
      this.removeAttribute(attributes.SQUARE);
    }
  }

  /**
   * @returns {boolean} whether the corners of the button as an icon-button are angled/90°
   */
  get square() {
    return this.hasAttribute(attributes.SQUARE);
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

    this.button.prepend(rippleEl);
    rippleEl.style.left = `${btnOffsets.x}px`;
    rippleEl.style.top = `${btnOffsets.y}px`;
    rippleEl.classList.add('animating');

    // After a short time, remove the ripple effect
    if (this.rippleTimeout) {
      this.rippleTimeout.destroy(true);
    }

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

  /**
   * Implements callback from IdsColorVariantMixin used to
   * update the color variant on children components
   * @returns {void}
   */
  onColorVariantRefresh() {
    const icons = this.querySelectorAll('ids-icon');
    const texts = this.querySelectorAll('ids-text');
    const iterator = (el) => {
      el.colorVariant = this.colorVariant;
    };
    [...icons, ...texts].forEach(iterator);
  }
}

export { IdsButton, BUTTON_ATTRIBUTES, BUTTON_TYPES };
