import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

import Base from './ids-trigger-field-base';

import './ids-trigger-button';

import styles from './ids-trigger-field.scss';

/**
 * IDS Trigger Field Component
 * @type {IdsTriggerField}
 * @inherits IdsInput
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part field - the field container
 * @part content - the content with trigger buttons and input element
 */
@customElement('ids-trigger-field')
@scss(styles)
export default class IdsTriggerField extends Base {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Get a list of element dependencies for this component
   * @returns {object} of elements
   */
  get elements() {
    return {
      ...super.elements,
      content: this.container.querySelector('.ids-trigger-field-content'),
      label: this.container.querySelector('label'),
      text: this.container.querySelector('ids-text'),
    };
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this.#attachTriggerButtonEvents();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.FORMAT,
      attributes.TABBABLE
    ];
  }

  /**
   * Push color variant to the container element
   * @returns {void}
   */
  onColorVariantRefresh(): void {
    this.buttons.forEach((btn) => { btn.colorVariant = this.colorVariant; });
  }

  /**
   * Creates the Template for rendering an IdsTriggerField's contents
   * @returns {string} containing the template
   */
  template() {
    this.templateHostAttributes();
    const {
      ariaLabel,
      containerClass,
      inputClass,
      inputState,
      labelHtml,
      placeholder,
      type,
      value
    } = this.templateVariables();

    return `<div class="ids-trigger-field ${containerClass}" part="container">
      ${labelHtml}
      <div class="field-container" part="field-container">
        <slot name="trigger-start"></slot>
        <input
          part="input"
          id="${this.id}-input"
          ${type}${inputClass}${placeholder}${inputState}
          ${ariaLabel}
          ${value}
          ></input>
        <slot name="trigger-end"></slot>
      </div>
      ${this.autocomplete ? `
        <ids-popup
          type="dropdown"
          align="bottom, left"
          align-target="#${this.id}-input"
          part="popup"
        >
          <ids-list-box slot="content"></ids-list-box>
        </ids-popup>` : ''}
    </div>`;
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} containing references to slotted IdsTriggerButtons on this component
   */
  get buttons() {
    return [...this.querySelectorAll('ids-trigger-button')];
  }

  /**
   * @param {boolean | string} value true if this trigger field's buttons should be made accessible using the tab key
   */
  set tabbable(value: boolean | string) {
    const currentValue = this.getAttribute(attributes.TABBABLE);
    const newValue = stringToBool(value);

    if (currentValue !== newValue) {
      if (newValue) {
        this.setAttribute(attributes.TABBABLE, `${stripHTML(`${value}`)}`);
      } else {
        this.removeAttribute(attributes.TABBABLE);
      }
    }

    this.buttons.forEach((button) => {
      button.tabbable = newValue;
    });
  }

  /**
   * @returns {boolean} true if this trigger field's buttons are accessible using the tab key
   */
  get tabbable(): boolean {
    return stringToBool(this.getAttribute(attributes.TABBABLE));
  }

  /**
   * Sets the disabled attribute
   * @param {boolean | string} d string value from the disabled attribute
   */
  set disabled(d: boolean | string) {
    super.disabled = d;

    if (stringToBool(d)) {
      this.buttons.forEach((btn) => {
        btn.setAttribute(attributes.DISABLED, '');
        btn.removeAttribute(attributes.READONLY);
      });
    } else {
      this.buttons.forEach((btn) => {
        btn.removeAttribute(attributes.DISABLED);
      });
    }
  }

  get disabled(): boolean {
    return super.disabled;
  }

  /**
   * Sets the readonly attribute
   * @param {string} r string value from the read only attribute
   */
  set readonly(r: boolean | string) {
    super.readonly = r;

    if (stringToBool(r)) {
      this.buttons.forEach((btn) => {
        btn.setAttribute(attributes.READONLY, '');
        btn.removeAttribute(attributes.DISABLED);
      });
    } else {
      this.buttons.forEach((btn) => {
        btn.removeAttribute(attributes.READONLY);
      });
    }
  }

  get readonly(): boolean {
    return super.readonly;
  }

  /**
   * Set format for date, time
   * @param {string} val date, time format
   */
  set format(val: string) {
    if (val) {
      this.setAttribute(attributes.FORMAT, val);
    } else {
      this.removeAttribute(attributes.FORMAT);
    }
  }

  /**
   * Return format
   * @returns {string} return date format
   */
  get format(): string {
    return this.getAttribute(attributes.FORMAT);
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {this} The IdsTriggerField API for chaining.
   */
  #attachTriggerButtonEvents(): this {
    const buttons = this.querySelectorAll('ids-trigger-button');
    if (buttons) {
      [...buttons].forEach((button) => this.onEvent('click', button, () => this.trigger()));
    }

    return this;
  }

  /**
   * Updates trigger buttons when the trigger field's fieldHeight property is updated
   * @param {string} val the new field height setting
   */
  onFieldHeightChange(val: string): void {
    this.buttons.forEach((btn) => {
      btn.fieldHeight = val;
    });
  }

  /**
   * Fire the trigger event and action.
   */
  trigger(): void {
    let canTrigger = true;
    const response = (veto: any) => {
      canTrigger = !!veto;
    };
    this.triggerEvent('beforetriggerclicked', this, { detail: { elem: this, response } });

    if (!canTrigger) {
      return;
    }
    this.triggerEvent('triggerclicked', this, { detail: { elem: this } });
  }
}
