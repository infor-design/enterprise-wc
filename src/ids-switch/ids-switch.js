import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsHideFocusMixin } from '../ids-base/ids-hide-focus-mixin';
import { IdsStringUtilsMixin as stringUtils } from '../ids-base/ids-string-utils-mixin';
import { props } from '../ids-base/ids-constants';
// @ts-ignore
import styles from './ids-switch.scss';
// @ts-ignore
import IdsText from '../ids-text/ids-text';

/**
 * IDS Switch Component
 */
@customElement('ids-switch')
@scss(styles)
@mixin(IdsHideFocusMixin)
class IdsSwitch extends IdsElement {
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
      props.LABEL_FONT_SIZE,
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
    this.eventHandlers = new IdsEventsMixin();

    // @ts-ignore
    this.hideFocus();
    this.handleEvents();
  }

  /**
   * Custom Element `disconnectedCallback` implementation
   * @returns {void}
   */
  disconnectedCallback() {
    IdsElement.prototype.disconnectedCallback.apply(this);
    // @ts-ignore
    this.destroyHideFocus();
    this.handleSwitchChangeEvent('remove');
    this.handleNativeEvents('remove');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    // Checkbox
    const disabled = stringUtils.stringToBool(this.disabled) ? ' disabled' : '';
    const checked = stringUtils.stringToBool(this.checked) ? ' checked' : '';
    const rootClass = ` class="ids-switch${disabled}"`;
    const checkboxClass = ` class="checkbox"`;

    // Label
    const labelFontSize = this.labelFontSize ? ` ${props.FONT_SIZE}="${this.labelFontSize}"` : '';

    return `
      <div${rootClass}>
        <label>
          <input type="checkbox"${checkboxClass}${disabled}${checked}>
          <span class="slider${checked}"></span>
          <ids-text class="label-text"${labelFontSize}>${this.label}</ids-text>
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
        const handler = this.eventHandlers?.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.eventHandlers.removeEventListener(eventName, this.input);
        }
      } else {
        this.eventHandlers.addEventListener(eventName, this.input, () => {
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
          const handler = this.eventHandlers?.handledEvents?.get(evt);
          if (handler && handler.target === this.input) {
            this.eventHandlers.removeEventListener(evt, this.input);
          }
        } else {
          this.eventHandlers.addEventListener(evt, this.input, (/** @type {any} */ e) => {
            /**
             * Trigger event on parent and compose the args
             * will fire `trigger + nativeEvent` as triggerclick, triggerchange etc.
             * @private
             * @param  {object} elem Actual event
             * @param  {string} value The updated input element value
             */
            this.eventHandlers.dispatchEvent(`trigger${e.type}`, this, {
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
   * Set `checked` attribute
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
   * Set `disabled` attribute
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    const rootEl = this.shadowRoot.querySelector('.ids-switch');
    const val = stringUtils.stringToBool(value);
    if (value) {
      this.setAttribute(props.DISABLED, val.toString());
      this.input?.setAttribute(props.DISABLED, val);
      rootEl?.classList.add(props.DISABLED);
    } else {
      this.removeAttribute(props.DISABLED);
      this.input?.removeAttribute(props.DISABLED);
      rootEl?.classList.remove(props.DISABLED);
    }
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Set the `label-font-size` of label
   * @param {string} value of the `label-font-size` property
   */
  set labelFontSize(value) {
    const labelText = this.shadowRoot.querySelector('.label-text') || document.createElement('span');
    if (value) {
      this.setAttribute(props.LABEL_FONT_SIZE, value);
      labelText.setAttribute(props.FONT_SIZE, value);
      return;
    }
    this.removeAttribute(props.LABEL_FONT_SIZE);
    labelText.removeAttribute(props.FONT_SIZE);
  }

  get labelFontSize() { return this.getAttribute(props.LABEL_FONT_SIZE); }

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
   * Set the `value` attribute
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
