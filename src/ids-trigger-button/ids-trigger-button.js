import {
  customElement,
  scss,
  props
} from '../ids-base/ids-element';

// @ts-ignore
import { IdsButton, BUTTON_PROPS } from '../ids-button/ids-button';

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
    return BUTTON_PROPS.concat([props.DISABLE_EVENTS]);
  }
}

export default IdsTriggerButton;
