import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

import Base from './ids-trigger-field-base';

import IdsTriggerButton from './ids-trigger-button';

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
      attributes.TABBABLE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
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

    return (
      `<div class="ids-trigger-field ${containerClass}" part="container">
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
      </div>`
    );
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} containing references to slotted IdsTriggerButtons on this component
   */
  get buttons() {
    return [...this.querySelectorAll('ids-trigger-button')];
  }

  /**
   * Set the trigger button to tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
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

  get tabbable() {
    return stringToBool(this.getAttribute(attributes.TABBABLE));
  }

  /**
   * Sets the disabled attribute
   * @param {string} d string value from the disabled attribute
   */
  set disabled(d) {
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

  get disabled() {
    return super.disabled;
  }

  /**
   * Sets the readonly attribute
   * @param {string} r string value from the read only attribute
   */
  set readonly(r) {
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

  get readonly() {
    return super.readonly;
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #attachTriggerButtonEvents() {
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
  onFieldHeightChange(val) {
    this.buttons.forEach((btn) => {
      btn.fieldHeight = val;
    });
  }

  /**
   * Fire the trigger event and action.
   */
  trigger() {
    let canTrigger = true;
    const response = (veto) => {
      canTrigger = !!veto;
    };
    this.triggerEvent('beforetriggerclicked', this, { detail: { elem: this, response } });

    if (!canTrigger) {
      return;
    }
    this.triggerEvent('triggerclicked', this, { detail: { elem: this } });
  }
}
