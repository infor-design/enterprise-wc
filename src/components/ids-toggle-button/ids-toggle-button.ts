import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import IdsButton from '../ids-button/ids-button';

import { BUTTON_ATTRIBUTES, BUTTON_APPEARANCE } from '../ids-button/ids-button-common';
import type { IdsButtonAppearance } from '../ids-button/ids-button-common';

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
export default class IdsToggleButton extends IdsButton {
  constructor() {
    super();
  }

  /**
   * @returns {Array<string>} containing configurable properties on this component
   */
  static get attributes(): Array<string> {
    return BUTTON_ATTRIBUTES.concat([
      attributes.ICON_OFF,
      attributes.ICON_ON,
      attributes.TEXT_OFF,
      attributes.TEXT_ON,
      attributes.PRESSED,
      attributes.DISABLE_ICON
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

    // Prevent unnecessary re-setting of the same value
    if (this.state.pressed === trueVal) {
      return;
    }

    this.state.pressed = trueVal;
    this.shouldUpdate = false;

    if (trueVal) {
      this.setAttribute(attributes.PRESSED, trueVal.toString());
    } else {
      this.removeAttribute(attributes.PRESSED);
    }
    this.shouldUpdate = true;

    this.refreshIcon();
    this.refreshText();

    // Dispatch a custom event when pressed state changes
    this.dispatchEvent(new CustomEvent('pressed-changed', {
      detail: { pressed: trueVal, element: this },
      bubbles: true,
      composed: true
    }));
  }

  get pressed(): boolean {
    return this.state.pressed;
  }

  /**
   * Override setting the "appearance" on Toggle Buttons, since they can only be the default style
   * @param {IdsButtonAppearance | null} val a valid appearance attribute
   */
  set appearance(val: IdsButtonAppearance | null) {
    val = BUTTON_APPEARANCE[0];
    super.appearance = val;
  }

  /**
   * @returns {IdsButtonAppearance} the currently set appearance attribute
   */
  get appearance(): IdsButtonAppearance {
    return super.appearance;
  }

  /**
   * Defines the `unpressed/off` toggle state icon.
   * @param {string} val corresponds to an IdsIcon's `icon` property
   * @returns {void}
   */
  set iconOff(val: string) {
    if (typeof val === 'string' && val.length) {
      this.setAttribute(attributes.ICON_OFF, val);
    } else {
      this.removeAttribute(attributes.ICON_OFF);
    }

    this.refreshIcon();
  }

  /**
   * @returns {string} the current icon representing the `unpressed/off` state
   */
  get iconOff(): string {
    return this.getAttribute(attributes.ICON_OFF) || DEFAULT_ICON_OFF;
  }

  /**
   * Defines the `pressed/on` toggle state icon.
   * @param {string} val corresponds to an IdsIcon's `icon` property
   * @returns {void}
   */
  set iconOn(val: string) {
    if (typeof val === 'string' && val.length) {
      this.setAttribute(attributes.ICON_ON, val);
    } else {
      this.removeAttribute(attributes.ICON_ON);
    }
    this.refreshIcon();
  }

  /**
   * @returns {string} the current icon representing the `pressed/on` state
   */
  get iconOn(): string {
    return this.getAttribute(attributes.ICON_ON) || DEFAULT_ICON_ON;
  }

  /**
   * Defines if the icon is disabled
   * @param {string} val `true` to disable the icon
   */
  set disableIcon(val: string) {
    const value = stringToBool(val);
    if (value) {
      this.setAttribute(attributes.DISABLE_ICON, '');
      this.removeAttribute(attributes.ICON_OFF);
      this.removeAttribute(attributes.ICON_ON);
      this.removeAttribute(attributes.ICON);
    }
  }

  /**
   * Get the `disable-icon` attribute
   * @returns {boolean} `true` if the icon is disabled
   */
  get disableIcon(): boolean {
    return this.hasAttribute(attributes.DISABLE_ICON);
  }

  /**
   * Defines the `unpressed/off` toggle state text.
   * @param {string} val `unpressed/off` description text
   * @returns {void}
   */
  set textOff(val: string) {
    if (typeof val !== 'string' || !val.length) {
      this.removeAttribute(attributes.TEXT_OFF);
    } else {
      this.setAttribute(attributes.TEXT_OFF, val);
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
      this.removeAttribute(attributes.TEXT_ON);
    } else {
      this.setAttribute(attributes.TEXT_ON, val);
    }
    this.refreshText();
  }

  /**
   * @returns {string} the current icon representing the `pressed/on` state
   */
  get textOn(): string {
    return this.getAttribute(attributes.TEXT_ON) || '';
  }

  /**
   * Sets (or creates) a slotted icon that represents the pressed state
   * @private
   * @returns {void}
   */
  refreshIcon(): void {
    if (this.disableIcon) return;
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
