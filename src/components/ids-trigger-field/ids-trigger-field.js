import {
  IdsElement,
  customElement,
  scss,
  attributes
} from '../../core';

// Import Utils
import { IdsStringUtils as stringUtils } from '../../utils';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

import styles from './ids-trigger-field.scss';

// Supporting components
import { IdsButton } from '../ids-button';
import IdsInput from '../ids-input';
import { SIZES } from '../ids-input/ids-input';
import IdsTriggerButton from './ids-trigger-button';

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
class IdsTriggerField extends IdsInput {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    this.setInputAttributes();
    this.#attachEventHandlers();
    super.connectedCallback();

    const labelEl = this.container.querySelector('label');
    this.onEvent('click.label', labelEl, () => {
      if (!stringUtils.stringToBool(this.disabled)) {
        [...this.inputs].forEach((input) => {
          input.input.focus();
        });
      }
    });
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.APPEARANCE,
      attributes.DISABLED,
      attributes.DISABLE_EVENTS,
      attributes.LABEL,
      attributes.NO_MARGINS,
      attributes.READONLY,
      attributes.SIZE,
      attributes.TABBABLE,
      attributes.CSS_CLASS,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const disabledAttribHtml = this.hasAttribute(attributes.DISABLED)
      ? ' disabled'
      : '';

    return `
      <div
        class="ids-trigger-field ${this.size}"
        part="field"
        ${this.noMargins && ' no-margins'}
      >
        ${ this.label !== '' ? `<label
          ${this.readonly && ' readonly'}
          ${this.disabled && ' disabled'}
          class="ids-label-text"
          ${this.validate !== null ? ' required' : ''}
          slot="ids-trigger-field-label"
          part="label"
          for="${this.id}-input"
        >
          <ids-text label ${disabledAttribHtml}>${this.label}</ids-text>
        </label>` : ''}
        <div
          class="ids-trigger-field-content ${this.cssClass}"
          part="content"
          ${this.readonly && ' readonly'}
          ${this.disabled && ' disabled'}
        >
          <slot></slot>
        </div>
      </div>
    `;
  }

  /**
   * Set input observer
   * @private
   * @returns {void}
   */
  setInputObserver() {
    const callback = (mutationList) => {
      mutationList.forEach((m) => {
        if (m.type === 'attributes') {
          const attr = { name: m.attributeName, val: m.target[m.attributeName] };
          this.containerSetHeightClass(attr);
        }
      });
    };
    if (this.inputObserver) {
      this.inputObserver.disconnect();
    }
    this.inputObserver = new MutationObserver(callback);

    [...this.inputs].forEach((input) => {
      this.inputObserver.observe(input, { attributes: true });
    });
  }

  /**
   * Set the class for compact or field height
   * @private
   * @param {object} attr The input attribute
   * @returns {void}
   */
  containerSetHeightClass(attr) {
    const heightClassName = (h) => `field-height-${h}`;
    const heights = ['xs', 'sm', 'md', 'lg'];
    if (attr.name === 'compact') {
      this.container?.classList[stringUtils.stringToBool(attr.val) ? 'add' : 'remove']('compact');
    } else if (attr.name === 'field-height') {
      this.container?.classList.remove(...heights.map((h) => heightClassName(h)));
      if (attr.val !== null) {
        this.container?.classList.add(heightClassName(attr.val));
      }
    }
  }

  /**
   * Set the input attributes
   * @private
   * @returns {void}
   */
  setInputAttributes() {
    this.inputs = this.querySelectorAll('ids-input');
    if (this.inputs) {
      [...this.inputs].forEach((input) => {
        input.setAttribute(attributes.TRIGGERFIELD, 'true');
        input.setAttribute(attributes.LABEL, this.label);
        input.setAttribute(attributes.SIZE, this.size);
        input.setAttribute(attributes.VALIDATE, this.validate);
        input.setAttribute(attributes.LABEL_HIDDEN, true);
        input.setAttribute(attributes.BG_TRANSPARENT, true);

        // Set class for compact or field height
        const attribs = ['compact', 'field-height'];
        const attr = (a) => ({ name: a, val: input.getAttribute(a) });
        attribs.forEach((a) => this.containerSetHeightClass(attr(a)));
        this.setInputObserver();
      });
    }
  }

  /**
   * Set the trigger button to tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = stringUtils.stringToBool(value);

    this.setAttribute(attributes.TABBABLE, value.toString());
    const button = this.querySelector('ids-trigger-button');

    if (button) {
      button.tabbable = isTabbable;
    }
  }

  get tabbable() {
    const attr = this.getAttribute(attributes.TABBABLE);
    if (attr === null) {
      return true;
    }
    return stringUtils.stringToBool(this.getAttribute(attributes.TABBABLE));
  }

  /**
   * Set the appearance of the trigger field
   * @param {string} value Provide different options for appearance 'normal' | 'compact'
   */
  set appearance(value) {
    if (value) {
      this.setAttribute(attributes.APPEARANCE, value);
      return;
    }

    this.setAttribute(attributes.APPEARANCE, 'normal');
  }

  get appearance() { return this.getAttribute(attributes.APPEARANCE); }

  /**
   * Set if the button handles events
   * @param {boolean|string} value True of false depending if the button handles events
   */
  set disableNativeEvents(value) {
    const isDisabled = stringUtils.stringToBool(value);
    if (isDisabled) {
      this.setAttribute(attributes.DISABLE_EVENTS, value.toString());
      this.#attachEventHandlers();
      return;
    }

    this.removeAttribute(attributes.DISABLE_EVENTS);
  }

  get disableNativeEvents() { return this.getAttribute(attributes.DISABLE_EVENTS); }

  /**
   * Sets the label attribute
   * @param {string} value string value from the label attribute
   */
  set label(value) {
    this.setAttribute('label', value.toString());
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  /**
   * Sets the no margins attribute
   * @param {string} n string value from the no margins attribute
   */
  set noMargins(n) {
    if (stringUtils.stringToBool(n)) {
      this.setAttribute(attributes.NO_MARGINS, 'true');
      this.container.style.marginBottom = '0';
      return;
    }
    this.removeAttribute(attributes.NO_MARGINS);
  }

  get noMargins() {
    return stringUtils.stringToBool(this.getAttribute(attributes.NO_MARGINS));
  }

  /**
   * Sets the css class
   * @param {string} c string value from the css class
   */
  set cssClass(c) {
    if (c) {
      this.setAttribute(attributes.CSS_CLASS, c.toString());
    }
  }

  get cssClass() {
    return this.getAttribute(attributes.CSS_CLASS);
  }

  /**
   * Sets the disabled attribute
   * @param {string} d string value from the disabled attribute
   */
  set disabled(d) {
    if (stringUtils.stringToBool(d)) {
      this.setAttribute(attributes.DISABLED, d.toString());
      this.setAttribute(attributes.TABBABLE, 'false');
    }
    if (stringUtils.stringToBool(d)) {
      this.setAttribute(attributes.DISABLED, 'true');
      this.removeAttribute(attributes.READONLY);
      this.querySelector('ids-trigger-button').setAttribute(attributes.DISABLED, 'true');
      this.querySelector('ids-trigger-button').removeAttribute(attributes.READONLY);
      this.querySelector('ids-input').setAttribute(attributes.DISABLED, 'true');
      this.querySelector('ids-input').removeAttribute(attributes.READONLY);
      this.shadowRoot.querySelector('label ids-text').setAttribute(attributes.DISABLED, 'true');
      this.shadowRoot.querySelector('.ids-trigger-field-content').removeAttribute(attributes.READONLY);
      this.shadowRoot.querySelector('.ids-trigger-field-content').setAttribute(attributes.DISABLED, 'true');
      return;
    }
    this.removeAttribute(attributes.DISABLED);
    this.querySelector('ids-trigger-button').removeAttribute(attributes.DISABLED);
    this.querySelector('ids-input').removeAttribute(attributes.DISABLED);
    this.shadowRoot.querySelector('label ids-text').removeAttribute(attributes.DISABLED);
    this.shadowRoot.querySelector('.ids-trigger-field-content').removeAttribute(attributes.DISABLED);
  }

  get disabled() {
    return stringUtils.stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Sets the readonly attribute
   * @param {string} r string value from the read only attribute
   */
  set readonly(r) {
    if (stringUtils.stringToBool(r)) {
      this.setAttribute(attributes.READONLY, 'true');
      this.querySelector('ids-trigger-button').setAttribute(attributes.READONLY, 'true');
      this.shadowRoot.querySelector('.ids-trigger-field-content').setAttribute(attributes.READONLY, 'true');
      return;
    }
    this.removeAttribute(attributes.READONLY);
    this.querySelector('ids-trigger-button').removeAttribute(attributes.READONLY);
    this.shadowRoot.querySelector('.ids-trigger-field-content').removeAttribute(attributes.READONLY);
  }

  get readonly() {
    return stringUtils.stringToBool(this.getAttribute('readonly'));
  }

  /**
   * Set the size (width) of input
   * @param {string} value [xs, sm, mm, md, lg, full]
   */
  set size(value) {
    const size = SIZES[value];
    this.setAttribute(attributes.SIZE, size || SIZES.default);
    this.container?.classList.remove(...Object.values(SIZES));
    this.container?.classList.add(size || SIZES.default);
  }

  get size() { return this.getAttribute(attributes.SIZE) || SIZES.default; }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #attachEventHandlers() {
    if (this.inputs) {
      [...this.inputs].forEach((input) => {
        const className = 'has-validation-message';
        this.onEvent('validate', input, (e) => {
          if (e.detail?.isValid) {
            this.container?.classList?.remove(className);
          } else {
            this.container?.classList?.add(className);
          }
        });
      });
    }

    if (this.disableNativeEvents) {
      return false;
    }

    const buttons = this.querySelectorAll('ids-trigger-button');
    if (buttons) {
      [...buttons].forEach((button) => this.onEvent('click', button, () => this.trigger()));
    }

    return this;
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

export default IdsTriggerField;
