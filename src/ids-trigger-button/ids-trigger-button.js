import {
  customElement,
  scss
} from '../ids-base/ids-element';
import IdsButtonElement from '../ids-button/ids-button-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-trigger-button.scss';

/**
 * IDS Trigger Field Components
 */
@customElement('ids-trigger-button')
@scss(styles)
class IdsTriggerButton extends IdsButtonElement {
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
    return [props.DISABLE_EVENTS];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<button class="ids-trigger-button" tabindex="0"><slot></slot></button>`;
  }
}

export default IdsTriggerButton;
