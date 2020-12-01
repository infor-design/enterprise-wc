import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import IdsIcon from '../ids-icon/ids-icon';

import styles from './ids-menu-item.scss';

// @TODO handle other menu-item sizes
const MENU_ITEM_SIZE = 'medium';

// Default Button state values
const MENU_DEFAULTS = {
  disabled: false,
  href: null,
  icon: null,
  showIcon: false,
  tabindex: true,
  value: null,
};

// Definable attributes
const MENU_PROPS = [
  props.DISABLED,
  props.ICON,
  props.HREF,
  props.TABINDEX,
  props.VALUE
];

/**
 * IDS Menu Item Component
 */
@customElement('ids-menu-item')
@scss(styles)
@mixin(IdsEventsMixin)
class IdsMenuItem extends IdsElement {
  /**
   * Build the menu item
   * @param {object} settings incoming settings for the menu item
   */
  constructor(settings = {}) {
    super();

    // Pull in settings
    this.state = {};
    Object.keys(MENU_DEFAULTS).forEach((prop) => {
      this.state[prop] = settings[prop] || MENU_DEFAULTS[prop];
    });
    this.shouldUpdate = true;
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    let disabledClass = '';
    let disabledAttr = '';
    if (this.state?.disabled) {
      disabledClass = ' is-disabled';
      disabledAttr = ' disabled="true"';
    }

    let href = '';
    if (this.state?.href) {
      href = ` href="${this.state.href}"`;
    }

    // Icon
    let icon = '';
    if (this.state?.showIcon && this.state?.icon) {
      icon = `<ids-icon icon="${this.state.icon}" size="${MENU_ITEM_SIZE}"></ids-icon>`;
    }
    const iconSlot = `<slot name="icon">
      ${icon}
    </slot>`;

    // Tabindex
    let tabindex = 'tabindex="0"';
    if (this.state?.tabindex) {
      tabindex = ` tabindex="${this.state.tabindex}"`;
    }

    // Text
    const textSlot = `<span class="ids-menu-item-text"><slot></slot></span>`;

    // Main
    return `<li class="ids-menu-item${disabledClass}" role="presentation">
      <a ${href} ${tabindex} ${disabledAttr} role="menuitem">
        ${iconSlot}${textSlot}
      </a>
    </li>`;
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} properties
   */
  static get properties() {
    return MENU_PROPS;
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
    this.shouldUpdate = true;
  }

  /**
   * @returns {HTMLAnchorElement} reference to the Menu Item's anchor
   */
  get a() {
    return this.shadowRoot.querySelector('a');
  }

  /**
   * Passes a disabled attribute from the custom element to the button
   * @param {boolean} val true if the button will be disabled
   */
  set disabled(val) {
    const trueVal = val === true || val === 'true';
    this.state.disabled = trueVal;

    // Update attribute if it doesn't match
    const shouldUpdate = this.shouldUpdate;
    const currentAttr = this.getAttribute('disabled');
    if (trueVal !== currentAttr) {
      this.shouldUpdate = false;
      this.setAttribute('disabled', trueVal);
      this.shouldUpdate = shouldUpdate;
    }

    this.container.classList[trueVal ? 'add' : 'remove']('is-disabled');
    if (this.a) {
      this.a.disabled = trueVal;
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
   * @param {boolean} val true if the menu item should appear highlighted
   */
  set highlighted(val) {
    const trueVal = val === true || val === 'true';
    this.state.highlighted = trueVal;
    this.container.classList[trueVal ? 'add' : 'remove']('highlighted');
  }

  /**
   * @returns {boolean} true if the menu item should show a highlight
   */
  get highlighted() {
    return this.state.highlighted;
  }

  /**
   * @param {string} val representing the icon to set
   */
  set icon(val) {
    if (typeof val !== 'string' || !val.length) {
      this.removeAttribute('icon');
      this.state.icon = undefined;
      this.removeIcon();
    } else {
      this.state.icon = val;
      this.setAttribute('icon', val);
      this.appendIcon(val);
    }
  }

  /**
   * @returns {undefined|string} a defined IdsIcon's `icon` attribute, if one is present
   */
  get icon() {
    return this.iconEl?.icon;
  }

  /**
   * @returns {undefined|IdsIcon} reference to a defined IDS Icon element, if applicable
   */
  get iconEl() {
    return this.querySelector('ids-icon[slot="icon"]');
  }

  /**
   * Check if an icon exists, and adds the icon if it's missing
   * @param {string} iconName The icon name to check
   * @private
   */
  appendIcon(iconName) {
    // First look specifically for an icon slot.
    const icon = this.querySelector(`ids-icon[slot="icon"]`); // @TODO check for submenu icons here
    if (icon) {
      icon.icon = iconName;
    } else {
      this.insertAdjacentHTML('afterbegin', `<ids-icon slot="icon" icon="${iconName}" size="${MENU_ITEM_SIZE}" class="ids-icon"></ids-icon>`);
    }
  }

  /**
   * Check if an icon exists, and removes the icon if it's present
   * @private
   */
  removeIcon() {
    const icon = this.querySelector(`ids-icon[slot="icon"]`); // @TODO check for submenu icons here
    if (icon) {
      icon.remove();
    }
  }

  /**
   * Passes a tabindex attribute from the custom element to the button
   * @param {number} val the tabindex value
   * @returns {void}
   */
  set tabindex(val) {
    // Tabindex should exist on the anchor only
    this.shouldUpdate = false;
    this.removeAttribute('tabindex');
    this.shouldUpdate = true;

    const trueVal = parseInt(val, 10);
    if (Number.isNaN(trueVal) || trueVal < -1) {
      this.state.tabindex = 0;
      this.a.removeAttribute('tabindex');
      return;
    }
    this.state.tabindex = trueVal;
    this.a.setAttribute('tabindex', trueVal);
  }

  /**
   * @returns {number} the current tabindex number for the button
   */
  get tabindex() {
    return this.state.tabindex;
  }

  /**
   * @param {any} val the value for this menu item
   */
  set value(val) {
    this.state.val = val;

    // Don't display the value inside the element if it doesn't make sense.
    if (!['string', 'number', 'boolean'].includes(typeof val)) {
      this.shouldUpdate = false;
      this.removeAttribute('value');
      this.shouldUpdate = true;
    }
  }

  /**
   * @returns {any} the value of the menu item.
   */
  get value() {
    return this.state.val;
  }

  /**
   * Causes a menu item to become focused (and therefore highlighted).
   * @returns {void}
   */
  highlight() {
    this.a.focus();
    this.highlighted = true;
  }

  /**
   * Causes a menu item to become unhighlighted.
   * @returns {void}
   */
  unhighlight() {
    this.highlighted = false;
  }

  /**
   * @param {boolean} val true if icons are present
   */
  setDisplayType(val) {
    this.container.classList[val === true ? 'add' : 'remove']('has-icon');
  }
}

export default IdsMenuItem;
