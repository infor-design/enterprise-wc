import {
  customElement,
  scss
} from '../ids-base/ids-element';

// @ts-ignore
import { IdsButton, BUTTON_PROPS, BUTTON_TYPES } from '../ids-button/ids-button';
// @ts-ignore
import IdsIcon from '../ids-icon/ids-icon';

// @ts-ignore
import styles from '../ids-button/ids-button.scss';

// Default Toggle Button Icons
const DEFAULT_ICON_OFF = 'star-outlined';
const DEFAULT_ICON_ON = 'star-filled';

/**
 * IDS Toggle Button Component
 */
@customElement('ids-toggle-button')
@scss(styles)
class IdsToggleButton extends IdsButton {
  constructor() {
    super();
    this.icons = {
      off: DEFAULT_ICON_OFF,
      on: DEFAULT_ICON_ON
    };
    this.texts = {
      off: '',
      on: ''
    };
  }

  /**
   * @returns {Array} containing configurable properties on this component
   */
  static get properties() {
    return BUTTON_PROPS.concat([
      'icon-off',
      'icon-on',
      'text-off',
      'text-on',
      'pressed',
    ]);
  }

  /**
   * Toggle-Button-level `connectedCallback` implementation (adds an icon refresh)
   * @returns {void}
   */
  connectedCallback() {
    IdsButton.prototype.connectedCallback.apply(this);
    this.refreshIcon();
    this.refreshText();
  }

  /**
   * Set the pressed (on/off) state
   * @param {boolean|string} val if true, the "toggle" is activated
   */
  set pressed(val) {
    const trueVal = val === true || val === 'true';
    // @ts-ignore
    this.state.pressed = trueVal;
    this.shouldUpdate = false;

    if (trueVal) {
      this.setAttribute('pressed', trueVal.toString());
    } else {
      this.removeAttribute('pressed');
    }
    this.shouldUpdate = true;

    this.refreshIcon();
    this.refreshText();
  }

  get pressed() {
    // @ts-ignore
    return this.state.pressed;
  }

  /**
   * Override setting the "type" on Toggle Buttons, since they can only be the default style
   * @param {string} _val a valid
   * @returns {void}
   */
  // @ts-ignore
  set type(_val) {
    // @ts-ignore
    this.state.type = BUTTON_TYPES[0];

    if (this.hasAttribute('type')) {
      this.shouldUpdate = false;
      this.removeAttribute('type');
      this.shouldUpdate = true;
    }
    // @ts-ignore
    this.setTypeClass(this.state.type);
  }

  /**
   * Defines the `unpressed/off` toggle state icon.
   * @param {string} val corresponds to an IdsIcon's `icon` property
   * @returns {void}
   */
  set iconOff(val) {
    let isValid = false;
    if (typeof val === 'string' && val.length) {
      isValid = true;
    }
    this.icons.off = isValid ? val : DEFAULT_ICON_OFF;

    if (isValid) {
      this.setAttribute('icon-off', this.icons.off);
    } else {
      this.removeAttribute('icon-off');
    }

    this.refreshIcon();
  }

  /**
   * @returns {string} the current icon representing the `unpressed/off` state
   */
  get iconOff() {
    return this.icons.off;
  }

  /**
   * Defines the `pressed/on` toggle state icon.
   * @param {string} val corresponds to an IdsIcon's `icon` property
   * @returns {void}
   */
  set iconOn(val) {
    let isValid = false;
    if (typeof val === 'string' && val.length) {
      isValid = true;
    }
    this.icons.on = isValid ? val : DEFAULT_ICON_ON;

    if (isValid) {
      this.setAttribute('icon-on', this.icons.on);
    } else {
      this.removeAttribute('icon-on');
    }
    this.refreshIcon();
  }

  /**
   * @returns {string} the current icon representing the `pressed/on` state
   */
  get iconOn() {
    return this.icons.on;
  }

  /**
   * Defines the `unpressed/off` toggle state text.
   * @param {string} val `unpressed/off` description text
   * @returns {void}
   */
  set textOff(val) {
    if (typeof val !== 'string' || !val.length) {
      this.texts.off = '';
      this.removeAttribute('text-off');
    } else {
      this.texts.off = val;
      this.setAttribute('text-off', this.texts.off);
    }
    this.refreshText();
  }

  /**
   * @returns {string} the current icon representing the `unpressed/off` state
   */
  get textOff() {
    return this.texts.off;
  }

  /**
   * Defines the `pressed/on` toggle state icon.
   * @param {string} val corresponds to an IdsIcon's `icon` property
   * @returns {void}
   */
  set textOn(val) {
    if (typeof val !== 'string' || !val.length) {
      this.texts.on = '';
      this.removeAttribute('text-on');
    } else {
      this.texts.on = val;
      this.setAttribute('text-on', this.texts.on);
    }
    this.refreshText();
  }

  /**
   * @returns {string} the current icon representing the `pressed/on` state
   */
  get textOn() {
    return this.texts.on;
  }

  /**
   * Sets (or creates) a slotted icon that represents the pressed state
   * @private
   * @returns {void}
   */
  refreshIcon() {
    this.icon = this[this.pressed ? 'iconOn' : 'iconOff'];
  }

  /**
   * Sets (or creates) a slotted span that contains text
   * @private
   * @returns {void}
   */
  refreshText() {
    this.text = this[this.pressed ? 'textOn' : 'textOff'];
  }

  /**
   * Toggles the "pressed" state of the button
   * @returns {void}
   */
  toggle() {
    this.pressed = !this.pressed;
  }
}

export default IdsToggleButton;
