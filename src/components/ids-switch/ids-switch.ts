import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsFormInputMixin from '../../mixins/ids-form-input-mixin/ids-form-input-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-text/ids-text';

import styles from './ids-switch.scss';

const Base = IdsLocaleMixin(
  IdsFormInputMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Switch Component
 * @type {IdsSwitch}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @part checkbox - the checkbox input element
 * @part slider - the sliding part of the switch
 * @part label - the label text
 */
@customElement('ids-switch')
@scss(styles)
export default class IdsSwitch extends Base {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  isFormComponent = true;

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.CHECKED,
      attributes.DISABLED,
      attributes.LABEL,
      attributes.VALUE
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
  }

  /**
   * Custom Element `disconnectedCallback` implementation
   * @returns {void}
   */
  disconnectedCallback() {
    Base.prototype.disconnectedCallback.apply(this);
    this.#attachSwitchChangeEvent('remove');
    this.attachNativeEvents('remove');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    const disabled = stringToBool(this.disabled) ? ' disabled' : '';
    const checked = stringToBool(this.checked) ? ' checked' : '';
    const value = checked ? ` value="${this.value}"` : '';
    const rootClass = ` class="ids-switch${disabled}"`;
    const checkboxClass = ` class="checkbox"`;

    return `
      <div${rootClass}>
        <label>
          <input type="checkbox" part="checkbox" ${checkboxClass}${disabled}${checked}${value}>
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
  #attachSwitchChangeEvent(option = '') {
    if (this.input) {
      const eventName = 'change';
      if (option === 'remove') {
        const handler = this.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.offEvent(eventName, this.input);
        }
      } else {
        this.onEvent(eventName, this.input, () => {
          this.checked = !!this.input?.checked;
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
  attachNativeEvents(option = '') {
    if (this.input) {
      const events = ['focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
      events.forEach((evt: string) => {
        if (option === 'remove') {
          const handler = this.handledEvents?.get(evt);
          if (handler && handler.target === this.input) {
            this.offEvent(evt, this.input);
          }
        } else {
          this.onEvent(evt, this.input, (e: any) => {
            /**
             * Trigger event on parent and compose the args
             * will fire nativeEvents.
             * @private
             * @param {object} elem Actual event
             * @param {string} value The updated input element value
             */
            this.triggerEvent(e.type, this, {
              detail: {
                elem: this,
                nativeEvent: e,
                value: this.value,
                checked: this.input?.checked
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
  #attachEventHandlers() {
    this.#attachSwitchChangeEvent();
    this.attachNativeEvents();
  }

  /**
   * Sets the checked state to true or false
   * @param {boolean|string} value If true will set `checked` attribute
   */
  set checked(value: boolean | string) {
    const slider = this.shadowRoot?.querySelector('.slider');
    const val = stringToBool(value);

    if (val) {
      this.setAttribute(attributes.CHECKED, val.toString());
      slider?.classList.add(attributes.CHECKED);
      if (this.input) {
        this.input.setAttribute(attributes.CHECKED, val.toString());
        this.input.checked = true;
      }
    } else {
      this.removeAttribute(attributes.CHECKED);
      slider?.classList.remove(attributes.CHECKED);
      if (this.input) {
        this.input.removeAttribute(attributes.CHECKED);
        this.input.checked = false;
      }
    }
  }

  get checked(): boolean {
    return stringToBool(this.input ? this.input.checked : this.getAttribute(attributes.CHECKED));
  }

  /**
   * @readonly
   * @returns {HTMLInputElement} the inner `input` element
   * @see IdsFormInputMixin.formInput
   */
  get formInput(): HTMLInputElement | null {
    return this.input ?? null;
  }

  /**
   * @readonly
   * @returns {HTMLInputElement} the inner `input` element
   */
  get input(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector<HTMLInputElement>('input[type="checkbox"]') ?? null;
  }

  get labelEl(): HTMLLabelElement | null {
    return this.shadowRoot?.querySelector('label') ?? null;
  }

  /**
   * Sets checkbox to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value: boolean | string) {
    const val = stringToBool(value);

    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
      this.input?.setAttribute(attributes.DISABLED, '');
      this.container?.classList.add(attributes.DISABLED);
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.input?.removeAttribute(attributes.DISABLED);
      this.container?.classList.remove(attributes.DISABLED);
    }
  }

  get disabled(): boolean { return this.hasAttribute(attributes.DISABLED); }

  /**
   * Set the `label` text
   * @param {string | null} value of the `label` text property
   */
  set label(value: string | null) {
    const labelText = this.shadowRoot?.querySelector('.label-text') || document.createElement('span');
    if (value) {
      this.setAttribute(attributes.LABEL, value);
      labelText.innerHTML = value;
      return;
    }
    this.removeAttribute(attributes.LABEL);
    labelText.innerHTML = '';
  }

  get label(): string { return this.getAttribute(attributes.LABEL) || ''; }

  /**
   * React to attributes changing on the web-component
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;

    if (name === attributes.VALUE) {
      this.checked = !!newValue;
    }
  }

  /**
   * Sets the checkbox `value` attribute
   * @param {string} value the value property
   */
  set value(value: string) {
    super.value = value || '';
    this.checked = !this.checked;
  }

  /**
   * Gets the checkbox `value` attribute
   * @returns {string | null} the value property
   *
   * If a checkbox is unchecked when its form is submitted,
   * neither the name nor the value is submitted to the server.
   * If the value attribute is omitted, the default value for the checkbox is `on`.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
   */
  get value(): string { return this.checked ? (super.value ?? 'on') : ''; }

  /**
   * Overrides the standard "focus" behavior to instead pass focus to the inner HTMLInput element.
   */
  focus() {
    this.input?.focus();
  }
}
