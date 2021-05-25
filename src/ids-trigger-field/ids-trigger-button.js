import {
  customElement,
  scss,
  props,
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
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.CSS_CLASS,
      props.DISABLED,
      props.ICON,
      props.ICON_ALIGN,
      props.ID,
      props.TEXT,
      props.TYPE,
      props.TABBABLE,
      props.MODE,
      props.THEME];
  }

  /**
   * Set if the trigger field is tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = stringUtils.stringToBool(value);
    /** @type {any} */
    const button = this.shadowRoot?.querySelector('button');
    this.setAttribute(props.TABBABLE, value.toString());
    button.tabIndex = !isTabbable ? '-1' : '0';
  }

  get tabbable() { return this.getAttribute(props.TABBABLE) || true; }
}

export default IdsTriggerButton;
