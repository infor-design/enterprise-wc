import {
  IdsElement,
  customElement,
  mix,
  scss,
  attributes
} from '../../core';

import { IdsStringUtils } from '../../utils';
import styles from './ids-checkbox.scss';

import {
  IdsEventsMixin,
  IdsDirtyTrackerMixin,
  IdsHitboxMixin,
  IdsValidationMixin,
  IdsThemeMixin,
  IdsLocaleMixin
} from '../../mixins';

import IdsText from '../ids-text';

const attribs = [
  { name: 'checked', prop: 'checked' },
  { name: 'color', prop: 'color' },
  { name: 'dirty-tracker', prop: 'dirtyTracker' },
  { name: 'disabled', prop: 'disabled' },
  { name: 'hitbox', prop: 'hitbox' },
  { name: 'horizontal', prop: 'horizontal' },
  { name: 'indeterminate', prop: 'indeterminate' },
  { name: 'label', prop: 'label' },
  { name: 'label-required', prop: 'labelRequired' },
  { name: 'validate', prop: 'validate' },
  { name: 'validation-events', prop: 'validationEvents' },
  { name: 'value', prop: 'value' }
];

/**
 * IDS Checkbox Component
 * @type {IdsCheckbox}
 * @inherits IdsElement
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsHitboxMixin
 * @mixes IdsValidationMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @part label - the label element
 * @part input - the checkbox input element
 * @part label-text - the label text element
 */
@customElement('ids-checkbox')
@scss(styles)
class IdsCheckbox extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsDirtyTrackerMixin,
    IdsHitboxMixin,
    IdsValidationMixin,
    IdsThemeMixin,
    IdsLocaleMixin
  ) {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.CHECKED,
      attributes.COLOR,
      attributes.DISABLED,
      attributes.HORIZONTAL,
      attributes.INDETERMINATE,
      attributes.LABEL,
      attributes.LABEL_REQUIRED,
      attributes.LANGUAGE,
      attributes.VALUE,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * Custom Element `attributeChangedCallback` implementation
   * @param {string} name The name of attribute changed
   * @param {any} oldValue The old value
   * @param {any} newValue The new value
   * @returns {void}
   */
  attributeChangedCallback(
    name,
    oldValue,
    newValue
  ) {
    if (oldValue !== newValue) {
      attribs.forEach((attribute) => {
        if (name === attribute.name) {
          this[attribute.prop] = newValue;
        }
      });
    }
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    this.labelEl = this.shadowRoot.querySelector('label');

    this.#attachEventHandlers();
    super.connectedCallback();
  }

  /**
   * Create the Template for the contents.
   * @returns {string} The template.
   */
  template() {
    // Checkbox
    const color = this.color ? ` color="${this.color}"` : '';
    const disabled = IdsStringUtils.stringToBool(this.disabled) ? ' disabled' : '';
    const horizontal = IdsStringUtils.stringToBool(this.horizontal) ? ' horizontal' : '';
    const checked = IdsStringUtils.stringToBool(this.checked) ? ' checked' : '';
    const rootClass = ` class="ids-checkbox${disabled}${horizontal}"`;
    let checkboxClass = 'checkbox';
    checkboxClass += IdsStringUtils.stringToBool(this.indeterminate) ? ' indeterminate' : '';
    checkboxClass = ` class="${checkboxClass}"`;
    const rInd = !(IdsStringUtils.stringToBool(this.labelRequired) || this.labelRequired === null);
    const labelClass = rInd ? ' class="no-required-indicator"' : '';

    return `
      <div${rootClass}${color} part="root">
        <label${labelClass} part="label">
          <input part="input" type="checkbox"${checkboxClass}${disabled}${checked}>
          <span class="checkmark${checked}"></span>
          <ids-text class="label-text" part="label-text">${this.label}</ids-text>
        </label>
      </div>
    `;
  }

  /**
   * Attach checkbox change event
   * @private
   * @returns {void}
   */
  attachCheckboxChangeEvent() {
    this.onEvent('change', this.input, (e) => {
      this.indeterminate = false;
      this.checked = this.input.checked;
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

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {void}
   */
  attachNativeEvents() {
    const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      this.onEvent(evt, this.input, (e) => {
        this.triggerEvent(e.type, this, {
          detail: {
            elem: this,
            nativeEvent: e,
            value: this.value,
            checked: this.input.checked
          }
        });
      });
    });
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  #attachEventHandlers() {
    this.attachCheckboxChangeEvent();
    this.attachNativeEvents();

    // Respond to parent changing language
    this.offEvent('languagechange.checkbox-container');
    this.onEvent('languagechange.checkbox-container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
      // Do something with parent lang
    });
  }

  /**
   * Sets the checked state to true or false
   * @param {boolean|string} value If true will set `checked` attribute
   */
  set checked(value) {
    const checkmark = this.shadowRoot.querySelector('.checkmark');
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.CHECKED, val.toString());
      this.input?.setAttribute(attributes.CHECKED, val.toString());
      checkmark?.classList.add(attributes.CHECKED);
    } else {
      this.removeAttribute(attributes.CHECKED);
      this.input?.removeAttribute(attributes.CHECKED);
      checkmark?.classList.remove(attributes.CHECKED);
    }
  }

  get checked() { return this.getAttribute(attributes.CHECKED); }

  /**
   *  Sets the checkbox color to one of the colors in our color palette for example emerald07
   * @param {boolean|string} value If true will set `color` attribute
   */
  set color(value) {
    const rootEl = this.shadowRoot.querySelector('.ids-checkbox');
    if (value) {
      this.setAttribute(attributes.COLOR, value.toString());
      rootEl?.setAttribute(attributes.COLOR, value.toString());
    } else {
      this.removeAttribute(attributes.COLOR);
      rootEl?.removeAttribute(attributes.COLOR);
    }
  }

  get color() { return this.getAttribute(attributes.COLOR); }

  /**
   * Sets input to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const rootEl = this.shadowRoot.querySelector('.ids-checkbox');
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
      this.input?.setAttribute(attributes.DISABLED, val.toString());
      rootEl?.classList.add(attributes.DISABLED);
      this.labelEl?.querySelector('.label-text')?.setAttribute(attributes.DISABLED, val.toString());
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.input?.removeAttribute(attributes.DISABLED);
      rootEl?.classList.remove(attributes.DISABLED);
      this.labelEl?.querySelector('.label-text').removeAttribute(attributes.DISABLED);
    }
  }

  get disabled() { return this.getAttribute(attributes.DISABLED); }

  /**
   * Flips the checkbox orientation to horizontal
   * @param {boolean|string} value If true will set `horizontal` attribute
   */
  set horizontal(value) {
    const rootEl = this.shadowRoot.querySelector('.ids-checkbox');
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.HORIZONTAL, val.toString());
      rootEl?.classList.add(attributes.HORIZONTAL);
    } else {
      this.removeAttribute(attributes.HORIZONTAL);
      rootEl?.classList.remove(attributes.HORIZONTAL);
    }
  }

  get horizontal() { return this.getAttribute(attributes.HORIZONTAL); }

  /**
   * Sets the checkbox to the indeterminate state
   * @param {string|boolean} value The `indeterminate` attribute
   */
  set indeterminate(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.INDETERMINATE, val.toString());
    } else {
      this.removeAttribute(attributes.INDETERMINATE);
    }
    if (this.input) {
      if (val) {
        this.input.classList.add(attributes.INDETERMINATE);
        this.input.indeterminate = true;
      } else {
        this.input.classList.remove(attributes.INDETERMINATE);
        this.input.indeterminate = false;
      }
    }
  }

  get indeterminate() { return this.getAttribute(attributes.INDETERMINATE); }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value) {
    const labelText = this.labelEl?.querySelector('.label-text');
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }
    if (labelText) {
      labelText.innerHTML = value || '';
    }
  }

  get label() { return this.getAttribute(attributes.LABEL) || ''; }

  /**
   * Sets the checkbox to required
   * @param {string} value The `label-required` attribute
   */
  set labelRequired(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (value) {
      this.setAttribute(attributes.LABEL_REQUIRED, value.toString());
    } else {
      this.removeAttribute(attributes.LABEL_REQUIRED);
    }
    this.labelEl?.classList[!val ? 'add' : 'remove']('no-required-indicator');
  }

  get labelRequired() { return this.getAttribute(attributes.LABEL_REQUIRED); }

  /**
   * Set the checkbox `value` attribute
   * @param {string} val the value property
   */
  set value(val) {
    if (val) {
      this.setAttribute(attributes.VALUE, val);
    } else {
      this.removeAttribute(attributes.VALUE);
    }
    this.input?.setAttribute(attributes.VALUE, (val || ''));
  }

  get value() { return this.getAttribute(attributes.VALUE); }

  /**
   * Overrides the standard "focus" behavior to instead pass focus to the inner HTMLInput element.
   */
  focus() {
    this.input.focus();
  }
}

export default IdsCheckbox;
