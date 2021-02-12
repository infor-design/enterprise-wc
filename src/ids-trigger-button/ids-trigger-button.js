import {
  customElement,
  scss,
  props
} from '../ids-base/ids-element';

import { IdsButton, BUTTON_PROPS } from '../ids-button/ids-button';
import { IdsStringUtils as stringUtils } from '../ids-base/ids-string-utils';

// @ts-ignore
import styles from './ids-trigger-button.scss';

/**
 * IDS Trigger Field Components
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
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return BUTTON_PROPS.concat([props.DISABLE_EVENTS, props.tabbable]);
  }

  /**
   * Set if the trigger field is tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = stringUtils.stringToBool(value);
    /** @type {any} */
    const button = this.shadowRoot.querySelector('button');
    this.setAttribute(props.TABBABLE, value.toString());
    button.tabIndex = !isTabbable ? '-1' : '0';
  }

  get tabbable() { return this.getAttribute(props.TABBABLE) || true; }
}

export default IdsTriggerButton;
