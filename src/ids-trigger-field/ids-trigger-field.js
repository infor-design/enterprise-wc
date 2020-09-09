import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-trigger-field.scss';

/**
 * IDS Trigger Field Components
 */
@customElement('ids-trigger-field')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsStringUtilsMixin)
class IdsTriggerField extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  connectedCallBack() {
    this.handleEvents();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.TABBABLE, props.APPEARANCE, props.DISABLE_EVENTS];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-trigger-field"><slot></slot></div>`;
  }

  /**
   * Set if the trigger field is tabbable
   * @param {boolean} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = this.stringToBool(value);
    if (!isTabbable) {
      this.setAttribute(props.TABBABLE, value);
      this.setAttribute('tabindex', '-1');
    } else {
      this.setAttribute('tabindex', '0');
    }
  }

  get tabbable() { return this.getAttribute(props.TABBABLE); }

  /**
   * TODO: Set the appearance of the trigger field
   * @param {string} value Provide different options for appearance ['Normal', 'Compact']
   */
  set appearance(value) {
    if (value) {
      this.setAttribute(props.APPEARANCE, value);
    }

    this.removeAttribute(props.APPEARANCE);
  }

  get appearance() { return this.getAttribute(props.APPEARANCE); }

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
    const button = this.querySelector('ids-trigger-button');
    if (button) {
      this.eventHandlers.addEventListener('click', button, () => this.trigger());
    }

    return this;
  }

  /**
   * Fire trigger event
   */
  trigger() {
    let canTrigger = true;
    const response = (veto) => {
      canTrigger = !!veto;
    };

    if (!canTrigger) {
      return;
    }

    this.eventHandlers.dispatchEvent('triggerfield', this, { elem: this, response });
  }
}

export default IdsTriggerField;
