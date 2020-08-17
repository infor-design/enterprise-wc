import { IdsElement, customElement, mixin } from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { props } from '../ids-base/ids-constants';
import './ids-trigger-button.scss';


/**
 * IDS Trigger Field Components
 */
@customElement('ids-trigger-button')
@mixin(IdsEventsMixin)
class IdsTriggerButton extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  connectedCallBack() {
    this
      .render()
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
      <style>@import url('css/ids-trigger-button/ids-trigger-button.min.css');</style>
      <button class="ids-trigger-button" tabindex="0"><slot></slot></button>
    `;
  }

  /**
   * Set if the trigger field handles events
   * @param {boolean} value True of false depending if the trigger field is tabbable
   */
  set disableNativeEvents(value) {
    if (value) {
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
