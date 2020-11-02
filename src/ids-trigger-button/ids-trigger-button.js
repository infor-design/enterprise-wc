import {
  customElement,
  scss
} from '../ids-base/ids-element';
import { IdsButton, BUTTON_PROPS } from '../ids-button/ids-button';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { props } from '../ids-base/ids-constants';
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
   * CSS Classes that are specific to the Icon Button prototype.
   * @returns {Array} containing css classes specific to styling this component
   */
  get protoClasses() {
    return [this.name];
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
