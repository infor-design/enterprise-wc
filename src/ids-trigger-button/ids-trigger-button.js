import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsUtilitiesMixin } from '../ids-base/ids-utilities-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-trigger-button.scss';


/**
 * IDS Trigger Field Components
 */
@customElement('ids-trigger-button')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsUtilitiesMixin)
class IdsTriggerButton extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  connectedCallBack() {}

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
