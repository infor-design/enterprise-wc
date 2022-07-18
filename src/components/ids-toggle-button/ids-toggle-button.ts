import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-toggle-button-base';

import { BUTTON_ATTRIBUTES, BUTTON_TYPES } from '../ids-button/ids-button-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import '../ids-icon/ids-icon';

import styles from '../ids-button/ids-button.scss';

// Default Toggle Button Icons
const DEFAULT_ICON_OFF = 'star-outlined';
const DEFAULT_ICON_ON = 'star-filled';

/**
 * IDS Toggle Button Component
 * @type {IdsToggleButton}
 * @inherits IdsButton
 */
@customElement('ids-toggle-button')
@scss(styles)
export default class IdsToggleButton extends Base {
  constructor() {
    super();
  }

  /**
   * @returns {Array<string>} containing configurable properties on this component
   */
  static get attributes(): Array<string> {
    return BUTTON_ATTRIBUTES.concat([
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
  connectedCallback(): void {
    super.connectedCallback();
    this.refreshIcon();
    this.refreshText();
  }

  /**
   * Set the pressed (on/off) state
   * @param {boolean | string} val if true, the "toggle" is activated
   */
  set pressed(val: boolean | string) {
    const trueVal = stringToBool(val);
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

  get pressed(): boolean {
    return this.state.pressed;
  }

  /**
   * Override setting the "type" on Toggle Buttons, since they can only be the default style
   * @param {string} val a valid type
   */
  set type(val: string | null) {
    val = BUTTON_TYPES[0];
    super.type = val;
  }

  /**
   * @returns {string} the currently set type
   */
  get type(): string {
    return super.type;
  }

  /**
   * Defines the `unpressed/off` toggle state icon.
   * @param {string} val corresponds to an IdsIcon's `icon` property
   * @returns {void}
   */
  set iconOff(val: string) {
    if (typeof val === 'string' && val.length) {
      this.setAttribute('icon-off', val);
    } else {
      this.removeAttribute('icon-off');
    }

    this.refreshIcon();
  }

  /**
   * @returns {string} the current icon representing the `unpressed/off` state
   */
  get iconOff(): string {
    return this.getAttribute('icon-off') || DEFAULT_ICON_OFF;
  }

  /**
   * Defines the `pressed/on` toggle state icon.
   * @param {string} val corresponds to an IdsIcon's `icon` property
   * @returns {void}
   */
  set iconOn(val: string) {
    if (typeof val === 'string' && val.length) {
      this.setAttribute('icon-on', val);
    } else {
      this.removeAttribute('icon-on');
    }
    this.refreshIcon();
  }

  /**
   * @returns {string} the current icon representing the `pressed/on` state
   */
  get iconOn(): string {
    return this.getAttribute('icon-on') || DEFAULT_ICON_ON;
  }

  /**
   * Defines the `unpressed/off` toggle state text.
   * @param {string} val `unpressed/off` description text
   * @returns {void}
   */
  set textOff(val: string) {
    if (typeof val !== 'string' || !val.length) {
      this.removeAttribute('text-off');
    } else {
      this.setAttribute('text-off', val);
    }
    this.refreshText();
  }

  /**
   * @returns {string} the current icon representing the `unpressed/off` state
   */
  get textOff(): string {
    return this.getAttribute('text-off') || '';
  }

  /**
   * Defines the `pressed/on` toggle state icon.
   * @param {string} val corresponds to an IdsIcon's `icon` property
   * @returns {void}
   */
  set textOn(val: string) {
    if (typeof val !== 'string' || !val.length) {
      this.removeAttribute('text-on');
    } else {
      this.setAttribute('text-on', val);
    }
    this.refreshText();
  }

  /**
   * @returns {string} the current icon representing the `pressed/on` state
   */
  get textOn(): string {
    return this.getAttribute('text-on') || '';
  }

  /**
   * Sets (or creates) a slotted icon that represents the pressed state
   * @private
   * @returns {void}
   */
  refreshIcon(): void {
    this.icon = this[this.pressed ? 'iconOn' : 'iconOff'];
  }

  /**
   * Sets (or creates) a slotted span that contains text
   * @private
   * @returns {void}
   */
  refreshText(): void {
    this.text = this[this.pressed ? 'textOn' : 'textOff'];
  }

  /**
   * Toggles the "pressed" state of the button
   * @returns {void}
   */
  toggle(): void {
    this.pressed = !this.pressed;
  }
}
