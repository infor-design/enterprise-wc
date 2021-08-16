import {
  customElement,
  scss,
  attributes,
  stringUtils
} from '../ids-base';

// Supporting Components
import { IdsButton } from '../ids-button/ids-button';

import styles from './ids-trigger-button.scss';

/**
 * IDS Trigger Button Component
 * @type {IdsTriggerButton}
 * @inherits IdsElement
 */
@customElement('ids-trigger-button')
@scss(styles)
class IdsTriggerButton extends IdsButton {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [attributes.CSS_CLASS,
      attributes.DISABLED,
      attributes.ICON,
      attributes.ICON_ALIGN,
      attributes.ID,
      attributes.TEXT,
      attributes.TYPE,
      attributes.TABBABLE,
      attributes.MODE,
      attributes.THEME];
  }

  /**
   * Set if the trigger field is tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = stringUtils.stringToBool(value);
    const button = this.shadowRoot?.querySelector('button');
    this.setAttribute(attributes.TABBABLE, value.toString());
    button.tabIndex = !isTabbable ? '-1' : '0';
  }

  get tabbable() { return this.getAttribute(attributes.TABBABLE) || true; }
}

export default IdsTriggerButton;
