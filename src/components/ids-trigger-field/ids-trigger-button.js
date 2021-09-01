import {
  customElement,
  scss,
  attributes
} from '../../core';

// Import Utils
import { IdsStringUtils as stringUtils } from '../../utils';

// Import Dependencies
import { IdsButton } from '../ids-button/ids-button';

// Import Styles
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

    // Trigger it the first time since we have no template
    if (stringUtils.stringToBool(this.readonly)) {
      this.readonly = true;
    }
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.READONLY,
      attributes.TABBABLE
    ];
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

  /**
   * Set the trigger button to readonly color
   * @param {boolean|string} value True of false depending if the trigger button is readonly
   */
  set readonly(value) {
    const isReadonly = stringUtils.stringToBool(value);
    const button = this.shadowRoot?.querySelector('button');
    if (isReadonly) {
      button.setAttribute(attributes.READONLY, 'true');
      this.setAttribute(attributes.READONLY, 'true');
      return;
    }
    button.removeAttribute(attributes.READONLY);
    this.removeAttribute(attributes.READONLY);
  }

  get readonly() {
    return stringUtils.stringToBool(this.getAttribute(attributes.READONLY)) || false;
  }
}

export default IdsTriggerButton;
