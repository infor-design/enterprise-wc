import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-input.scss';

// Setting Defaults
const types = {
  default: 'text',
  text: 'text',
  password: 'password',
  number: 'number',
  email: 'email'
};

/**
 * IDS Trigger Field Components
 */
@customElement('ids-input')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsStringUtilsMixin)
class IdsInput extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  connectedCallBack() {
    this.input = this.shadowRoot.querySelector('.ids-input-field');
    this.handleEvents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === props.FIELD_STATE) {
      this.setState(oldValue, newValue);
    }
    if (name === props.VALIDATION_STATUS) {
      this.setValidationStatus(oldValue, newValue);
    }
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.TYPE, props.PLACEHOLDER, props.VALUE, props.FIELD_STATE, props.VALIDATION_STATUS];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const type = ` type="${this.type || types.default}"`;
    const value = this.value ? ` value="${this.value}"` : '';
    const placeholder = this.placeholder ? ` placeholder="${this.placeholder}"` : '';
    let fieldState = this.fieldState === 'disabled' ? ' disabled' : '';
    fieldState = this.fieldState === 'readonly' ? ' readonly' : fieldState;

    return `
      <input class="ids-input-field"${type}${value}${placeholder}${fieldState}/>
    `;
  }

  /**
   * Set the type of input
   * @param {boolean} value [text, password, number, email]
   */
  set type(value) {
    if (value) {
      this.setAttribute(props.TYPE, value);
      return;
    }
    this.setAttribute(props.TYPE, types.default);
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Set the placeholder of input
   * @param {string} value of the placeholder property
   */
  set placeholder(value) {
    if (value) {
      this.setAttribute(props.PLACEHOLDER, value);
      return;
    }

    this.removeAttribute(props.PLACEHOLDER);
  }

  get placeholder() { return this.getAttribute(props.PLACEHOLDER); }

  /**
   * Set the `value` attribute of input
   * @param {string} val the value property
   */
  set value(val) {
    if (val) {
      this.setAttribute(props.VALUE, val);
      return;
    }

    this.removeAttribute(props.VALUE);
  }

  get value() { return this.getAttribute(props.VALUE); }

  /**
   * Set the `fieldState` attribute of input
   * @param {string} val the value property
   */
  set fieldState(val) {
    if (val) {
      this.setAttribute(props.FIELD_STATE, val);
      return;
    }

    this.removeAttribute(props.FIELD_STATE);
  }

  get fieldState() { return this.getAttribute(props.FIELD_STATE); }

  /**
   * Set the `validationStatus` attribute of input
   * @param {string} val the value property
   */
  set validationStatus(val) {
    if (val) {
      this.setAttribute(props.VALIDATION_STATUS, val);
      return;
    }

    this.removeAttribute(props.VALIDATION_STATUS);
  }

  get validationStatus() { return this.getAttribute(props.VALIDATION_STATUS); }

  /**
   * set state `enabled/disabled/readonly`
   * @private
   * @param {string} oldValue the old value
   * @param {string} newValue the new value
   * @returns {void}
   */
  setState(oldValue, newValue) {
    this.input?.removeAttribute('disabled');
    this.input?.removeAttribute('readonly');

    if (/\b(disabled|readonly)\b/g.test(newValue)) {
      this.input?.setAttribute(newValue, '');
    }
  }

  /**
   * set validation status
   * @private
   * @param {string} oldValue the old value
   * @param {string} newValue the new value
   * @returns {void}
   */
  setValidationStatus(oldValue, newValue) {
    const action = this.validationStatus ? 'add' : 'remove';
    const className = this.validationStatus ? newValue : oldValue;
    this.input?.classList[action](className);
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  handleEvents() {
    if (this.input) {
      const events = ['click', 'change', 'focus', 'blur'];
      events.forEach((evt) => {
        this.eventHandlers.addEventListener(evt, this.input, (e) => this.trigger(e));
      });
    }
    return this;
  }

  /**
   * Fire trigger event
   * @private
   * @param  {object} e The native event
   */
  trigger(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (this.input) {
      const val = this.input.value;
      this.value = val;
      this.input.setAttribute(props.VALUE, val);

      // Event args
      const args = { elem: this, nativeEvent: e, value: val };

      let canTrigger = true;
      const response = (veto) => { canTrigger = !!veto; };
      this.eventHandlers.dispatchEvent(`trigger${e.type}`, this, { ...args, response });
      if (!canTrigger) {
        return;
      }

      /**
       * Trigger event on parent and compose the args
       * will fire `trigger + nativeEvent` as triggerclick, triggerchange etc.
       * @private
       * @param  {object} elem Actual event
       * @param  {string} value The updated input element value
       */
      this.eventHandlers.dispatchEvent(`trigger${e.type}`, this, args);
    }
  }
}

export default IdsInput;
