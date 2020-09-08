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

  connectedCallBack() {
    this
      .handleEvents()
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
    return `
      <button class="ids-trigger-button" tabindex="0"><slot></slot></button>
    `;
  }

  /**
   * Set if the button handles events
   * @param {boolean} value True of false depending if the button handles events
   */
  set disableNativeEvents(value) {
    const isDisabled = this.utilities.stringToBool(value);
    if (isDisabled) {
      this.setAttribute(props.DISABLE_EVENTS, value);
    }

    this.removeAttribute(props.DISABLE_EVENTS);
  }

  get disableNativeEvents() { return this.getAttribute(props.DISABLE_EVENTS); }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  handleEvents() {
    if (this.disableNativeEvents) {
      return;
    }
    this.eventHandlers.addEventListener('click', this, (e) => {
      console.log(e);
    });
    return this;
  }
}

export default IdsTriggerButton;
