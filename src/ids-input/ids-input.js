import { IdsElement, customElement, mixin } from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsUtilitiesMixin } from '../ids-base/ids-utilities-mixin';
import { props } from '../ids-base/ids-constants';
import './ids-input.scss';

/**
 * IDS Trigger Field Components
 */
@customElement('ids-input')
@mixin(IdsEventsMixin)
@mixin(IdsUtilitiesMixin)
class IdsInput extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  connectedCallBack() {
    this.types = {
      default: 'text',
      text: 'text',
      password: 'password',
      number: 'number'
    };

    this
      .render()
      .handleEvents();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.DISABLE_EVENTS, props.TYPE, props.PLACEHOLDER, props.TABBABLE];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    // const type = this.types[this.type] || this.types.default;
    return `
      <style>@import url('css/ids-input/ids-input.min.css');</style>
      <input class="ids-input-field" tabindex="0" type="${this.types[this.type]}" ${ this.placeholder ? `placeholder="${this.placeholder}"` : '' }/>
    `;
  }

  /**
   * Set if the input field handles events
   * @param {boolean} value True of false depending if the input field handles events
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
   * Set the type of input
   * @param {boolean} value [text, password, number]
   */
  set type(value) {
    if (value) {
      this.setAttribute(props.TYPE, value);
    } else {
      this.setAttribute(props.TYPE, this.types.default);
    }
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
  * Set if the input is tabbable
  * @param {boolean} value True of false depending if the input is tabbable
  */
  set tabbable(value) {
    if (value == 'false') {
      this.setAttribute(props.TABBABLE, value);
      this.setAttribute('tabindex', '-1');
    }
  }

  get tabbable() { return this.getAttribute(props.TABBABLE); }

  /**
   * Set the placeholder of input
   * @param {boolean} value
   */
  set placeholder(value) {
    if (value) {
      this.setAttribute(props.PLACEHOLDER, value);
    }

    this.removeAttribute(props.PLACEHOLDER);
  }

  get placeholder() { return this.getAttribute(props.PLACEHOLDER); }

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

export default IdsInput;
