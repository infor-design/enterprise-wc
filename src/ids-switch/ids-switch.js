import {
  IdsElement,
  customElement,
  props,
  scss,
  mix,
  stringUtils
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';

import styles from './ids-switch.scss';
import IdsText from '../ids-text/ids-text';

/**
 * IDS Switch Component
 * @type {IdsSwitch}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part checkbox - the checkbox input element
 * @part slider - the sliding part of the switch
 * @part label - the label text
 */
@customElement('ids-switch')
@scss(styles)
class IdsSwitch extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
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
    return [
      props.CHECKED,
      props.DISABLED,
      props.LABEL,
      props.VALUE
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    /** @type {object} */
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    this.labelEl = this.shadowRoot.querySelector('label');

    this.handleEvents();
    super.connectedCallback();
  }

  /**
   * Custom Element `disconnectedCallback` implementation
   * @returns {void}
   */
  disconnectedCallback() {
    IdsElement.prototype.disconnectedCallback.apply(this);
    this.handleSwitchChangeEvent('remove');
    this.handleNativeEvents('remove');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const disabled = stringUtils.stringToBool(this.disabled) ? ' disabled' : '';
    const checked = stringUtils.stringToBool(this.checked) ? ' checked' : '';
    const rootClass = ` class="ids-switch${disabled}"`;
    const checkboxClass = ` class="checkbox"`;

    return `
      <div${rootClass}>
        <label>
          <input type="checkbox"${checkboxClass}${disabled}${checked} part="checkbox">
          <span class="slider${checked}" part="slider"></span>
          <ids-text class="label-text" part="label">${this.label}</ids-text>
        </label>
      </div>
    `;
  }

  /**
   * Handle switch change event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleSwitchChangeEvent(option = '') {
    if (this.input) {
      const eventName = 'change';
      if (option === 'remove') {
        const handler = this.handledEvents?.get(eventName);
        /* istanbul ignore next */
        if (handler && handler.target === this.input) {
          this.offEvent(eventName, this.input);
        }
      } else {
        this.onEvent(eventName, this.input, () => {
          this.indeterminate = false;
          this.checked = this.input.checked;
        });
      }
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {object} The object for chaining.
   */
  handleNativeEvents(option = '') {
    if (this.input) {
      const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
      events.forEach((evt) => {
        if (option === 'remove') {
          const handler = this.handledEvents?.get(evt);
          if (handler && handler.target === this.input) {
            this.offEvent(evt, this.input);
          }
        } else {
          this.onEvent(evt, this.input, (/** @type {any} */ e) => {
            /**
             * Trigger event on parent and compose the args
             * will fire nativeEvents.
             * @private
             * @param  {object} elem Actual event
             * @param  {string} value The updated input element value
             */
            this.triggerEvent(e.type, this, {
              detail: {
                elem: this,
                nativeEvent: e,
                value: this.value,
                checked: this.input.checked
              }
            });
          });
        }
      });
    }
    return this;
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.handleSwitchChangeEvent();
    this.handleNativeEvents();
  }

  /**
   * Sets the checked state to true or false
   * @param {boolean|string} value If true will set `checked` attribute
   */
  set checked(value) {
    const slider = this.shadowRoot.querySelector('.slider');
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.CHECKED, val.toString());
      this.input?.setAttribute(props.CHECKED, val);
      slider?.classList.add(props.CHECKED);
    } else {
      this.removeAttribute(props.CHECKED);
      this.input?.removeAttribute(props.CHECKED);
      slider?.classList.remove(props.CHECKED);
    }
  }

  get checked() { return this.getAttribute(props.CHECKED); }

  /**
   * Sets checkbox to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    const rootEl = this.shadowRoot.querySelector('.ids-switch');
    const val = stringUtils.stringToBool(value);
    const labelText = this.shadowRoot.querySelector('.label-text');

    if (val) {
      this.setAttribute(props.DISABLED, val.toString());
      this.input?.setAttribute(props.DISABLED, val);
      rootEl?.classList.add(props.DISABLED);
      labelText?.setAttribute(props.DISABLED, 'true');
    } else {
      this.removeAttribute(props.DISABLED);
      this.input?.removeAttribute(props.DISABLED);
      rootEl?.classList.remove(props.DISABLED);
      labelText?.removeAttribute(props.DISABLED);
    }
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value) {
    const labelText = this.shadowRoot.querySelector('.label-text') || document.createElement('span');
    if (value) {
      this.setAttribute(props.LABEL, value);
      labelText.innerHTML = value;
      return;
    }
    this.removeAttribute(props.LABEL);
    labelText.innerHTML = '';
  }

  get label() { return this.getAttribute(props.LABEL) || ''; }

  /**
   * Sets the checkbox `value` attribute
   * @param {string} val the value property
   */
  set value(val) {
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');

    if (val) {
      this.setAttribute(props.VALUE, val);
    } else {
      this.removeAttribute(props.VALUE);
    }
    this.input.setAttribute(props.VALUE, (val || ''));
  }

  get value() { return this.getAttribute(props.VALUE); }
}

export default IdsSwitch;
