import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

import styles from './ids-radio.scss';
import IdsText from '../ids-text/ids-text';
import IdsRadioGroup from './ids-radio-group';

const attribs = [
  { name: 'checked', prop: 'checked' },
  { name: 'color', prop: 'color' },
  { name: 'disabled', prop: 'disabled' },
  { name: 'group-disabled', prop: 'groupDisabled' },
  { name: 'horizontal', prop: 'horizontal' },
  { name: 'label', prop: 'label' },
  { name: 'validation-has-error', prop: 'validationHasError' },
  { name: 'value', prop: 'value' }
];

/**
 * IDS Radio Component
 * @type {IdsRadio}
 * @inherits IdsElement
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @part radio - the actual radio input element
 * @part circle - the visible circle element
 * @part label - the label text element
 */
@customElement('ids-radio')
@scss(styles)
class IdsRadio extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
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
      attributes.CHECKED,
      attributes.COLOR,
      attributes.DISABLED,
      attributes.GROUP_DISABLED,
      attributes.HORIZONTAL,
      attributes.LABEL,
      attributes.VALIDATION_HAS_ERROR,
      attributes.VALUE
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
    /** @type {string} */ name,
    /** @type {any} */ oldValue,
    /** @type {any} */ newValue
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
    super.connectedCallback();

    /** @type {any} */
    this.input = this.shadowRoot.querySelector('input[type="radio"]');
    /** @type {any} */
    this.labelEl = this.shadowRoot.querySelector('label');
    /** @type {any} */
    this.rootEl = this.shadowRoot.querySelector('.ids-radio');

    if (this.checked && !this.input.getAttribute(attributes.CHECKED)) {
      this.checked = true;
    }

    this.handleEvents();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    // Checkbox
    const toBool = IdsStringUtils.stringToBool;
    const isDisabled = toBool(this.groupDisabled) || toBool(this.disabled);
    const disabled = isDisabled ? ' disabled' : '';
    const disabledAria = isDisabled ? ' aria-disabled="true"' : '';
    const color = this.color ? ` color="${this.color}"` : '';
    const horizontal = toBool(this.horizontal) ? ' horizontal' : '';
    const checked = toBool(this.checked) ? ' checked' : '';
    const rootClass = ` class="ids-radio${disabled}${horizontal}"`;
    const radioClass = ' class="radio-button"';

    return `
      <div${rootClass}${color}>
        <label>
          <input type="radio" part="radio" tabindex="-1"${radioClass}${disabled}${checked}>
          <span class="circle${checked}" part="circle"></span>
          <ids-text class="label-text"${disabledAria} part="label">${this.label}</ids-text>
        </label>
      </div>
    `;
  }

  /**
   * Handle radio change event
   * @private
   * @returns {void}
   */
  handleRadioChangeEvent() {
    this.onEvent('change', this.input, () => {
      this.checked = this.input.checked;
    });
  }

  /**
   * Handle radio click event
   * @private
   * @returns {void}
   */
  handleRadioClickEvent() {
    this.onEvent('click', this.labelEl, () => {
      this.input?.focus(); // Safari need focus first click
    });
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {void}
   */
  handleNativeEvents() {
    const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      this.onEvent(evt, this.input, (/** @type {any} */ e) => {
        /**
         * Trigger event on parent and compose the args
         * will fire nativeEvents.
         * @private
         * @param  {object} elem Actual event
         * @param  {string} value The updated input element value
         */
        this.triggerEvent(e.type, this, {
          elem: this,
          nativeEvent: e,
          value: this.value,
          checked: this.input.checked
        });
      });
    });
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.handleRadioClickEvent();
    this.handleRadioChangeEvent();
    this.handleNativeEvents();
  }

  /**
   * Set `checked` attribute
   * @param {boolean|string} value If true will set `checked` attribute
   */
  set checked(value) {
    const circle = this.shadowRoot.querySelector('.circle');
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.CHECKED, val.toString());
    } else {
      this.removeAttribute(attributes.CHECKED);
    }
    if (this.input && this.rootEl && circle) {
      if (val) {
        if (!(IdsStringUtils.stringToBool(this.disabled)
          || IdsStringUtils.stringToBool(this.groupDisabled))) {
          this.rootEl.setAttribute('tabindex', '0');
        }
        circle.classList.add(attributes.CHECKED);
        this.input.checked = true;
      } else {
        this.rootEl.setAttribute('tabindex', '-1');
        this.input.checked = false;
        circle.classList.remove(attributes.CHECKED);
      }
    }
  }

  get checked() { return this.getAttribute(attributes.CHECKED); }

  /**
   * Set `color` attribute
   * @param {boolean|string} value If true will set `color` attribute
   */
  set color(value) {
    if (value) {
      this.setAttribute(attributes.COLOR, value.toString());
      this.rootEl?.setAttribute(attributes.COLOR, value.toString());
    } else {
      this.removeAttribute(attributes.COLOR);
      this.rootEl?.removeAttribute(attributes.COLOR);
    }
  }

  get color() { return this.getAttribute(attributes.COLOR); }

  /**
   * Set `disabled` attribute
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const labelText = this.shadowRoot.querySelector('.label-text');
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
      this.input?.setAttribute(attributes.DISABLED, val);
      this.rootEl?.classList.add(attributes.DISABLED);
      this.rootEl?.setAttribute('tabindex', '-1');
      labelText?.setAttribute('aria-disabled', 'true');
      labelText?.setAttribute(attributes.DISABLED, 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.input?.removeAttribute(attributes.DISABLED);
      labelText?.removeAttribute('aria-disabled');
      labelText?.removeAttribute(attributes.DISABLED);
      this.rootEl?.classList.remove(attributes.DISABLED);
    }
  }

  get disabled() { return this.getAttribute(attributes.DISABLED); }

  /**
   * Set `group-disabled` attribute
   * @param {boolean|string} value If true will set `group-disabled` attribute
   */
  set groupDisabled(value) {
    const labelText = this.shadowRoot.querySelector('.label-text');
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.GROUP_DISABLED, val.toString());
      this.input?.setAttribute(attributes.DISABLED, val);
      this.rootEl?.classList.add(attributes.DISABLED);
      this.rootEl?.setAttribute('tabindex', '-1');
      labelText?.setAttribute(attributes.DISABLED, 'true');
    } else {
      this.removeAttribute(attributes.GROUP_DISABLED);
      this.input?.removeAttribute(attributes.DISABLED);
      this.rootEl?.classList.remove(attributes.DISABLED);
      labelText?.removeAttribute(attributes.DISABLED);
    }
  }

  get groupDisabled() { return this.getAttribute(attributes.GROUP_DISABLED); }

  /**
   * Set `horizontal` attribute `inline|block`, default as `block`
   * @param {boolean|string} value If true will set `horizontal` attribute
   */
  set horizontal(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.HORIZONTAL, val.toString());
      this.rootEl?.classList.add(attributes.HORIZONTAL);
    } else {
      this.removeAttribute(attributes.HORIZONTAL);
      this.rootEl?.classList.remove(attributes.HORIZONTAL);
    }
  }

  get horizontal() { return this.getAttribute(attributes.HORIZONTAL); }

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
   * Set `validation-has-error` attribute
   * @param {boolean|string} value If true will set `validation-has-error` attribute
   */
  set validationHasError(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.VALIDATION_HAS_ERROR, val.toString());
      this.input?.classList.add('error');
    } else {
      this.removeAttribute(attributes.VALIDATION_HAS_ERROR);
      this.input?.classList.remove('error');
    }
  }

  get validationHasError() { return this.getAttribute(attributes.VALIDATION_HAS_ERROR); }

  /**
   * Set the `value` attribute
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
}

export default IdsRadio;
