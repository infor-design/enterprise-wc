import {
  IdsElement,
  customElement,
  props,
  scss,
  mix
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';
import { IdsStringUtils as stringUtils } from '../ids-base/ids-string-utils';

// @ts-ignore
import styles from './ids-radio.scss';
// @ts-ignore
import IdsText from '../ids-text/ids-text';
// @ts-ignore
import IdsRadioGroup from './ids-radio-group';

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
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.CHECKED,
      props.COLOR,
      props.DISABLED,
      props.GROUP_DISABLED,
      props.HORIZONTAL,
      props.LABEL,
      props.VALIDATION_HAS_ERROR,
      props.VALUE
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
      const attributes = [
        { name: 'checked', prop: 'checked' },
        { name: 'color', prop: 'color' },
        { name: 'disabled', prop: 'disabled' },
        { name: 'group-disabled', prop: 'groupDisabled' },
        { name: 'horizontal', prop: 'horizontal' },
        { name: 'label', prop: 'label' },
        { name: 'validation-has-error', prop: 'validationHasError' },
        { name: 'value', prop: 'value' }
      ];
      attributes.forEach((attribute) => {
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

    if (this.checked && !this.input.getAttribute(props.CHECKED)) {
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
    const toBool = stringUtils.stringToBool;
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
    this.onEvent('input', this.input, () => {
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
      if (!this.input.checked) {
        this.input.checked = true;
        this.triggerEvent('change', this.input, {});
      }
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
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.CHECKED, val.toString());
    } else {
      this.removeAttribute(props.CHECKED);
    }
    if (this.input && this.rootEl && circle) {
      if (val) {
        if (!(stringUtils.stringToBool(this.disabled)
          || stringUtils.stringToBool(this.groupDisabled))) {
          this.rootEl.setAttribute('tabindex', '0');
        }
        circle.classList.add(props.CHECKED);
        this.input.checked = true;
      } else {
        this.rootEl.setAttribute('tabindex', '-1');
        this.input.checked = false;
        circle.classList.remove(props.CHECKED);
      }
    }
  }

  get checked() { return this.getAttribute(props.CHECKED); }

  /**
   * Set `color` attribute
   * @param {boolean|string} value If true will set `color` attribute
   */
  set color(value) {
    if (value) {
      this.setAttribute(props.COLOR, value.toString());
      this.rootEl?.setAttribute(props.COLOR, value.toString());
    } else {
      this.removeAttribute(props.COLOR);
      this.rootEl?.removeAttribute(props.COLOR);
    }
  }

  get color() { return this.getAttribute(props.COLOR); }

  /**
   * Set `disabled` attribute
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const labelText = this.shadowRoot.querySelector('.label-text');
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.DISABLED, val.toString());
      this.input?.setAttribute(props.DISABLED, val);
      this.rootEl?.classList.add(props.DISABLED);
      this.rootEl?.setAttribute('tabindex', '-1');
      labelText?.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute(props.DISABLED);
      this.input?.removeAttribute(props.DISABLED);
      labelText?.removeAttribute('aria-disabled');
      this.rootEl?.classList.remove(props.DISABLED);
    }
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Set `group-disabled` attribute
   * @param {boolean|string} value If true will set `group-disabled` attribute
   */
  set groupDisabled(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.GROUP_DISABLED, val.toString());
      this.input?.setAttribute(props.DISABLED, val);
      this.rootEl?.classList.add(props.DISABLED);
      this.rootEl?.setAttribute('tabindex', '-1');
    } else {
      this.removeAttribute(props.GROUP_DISABLED);
      this.input?.removeAttribute(props.DISABLED);
      this.rootEl?.classList.remove(props.DISABLED);
    }
  }

  get groupDisabled() { return this.getAttribute(props.GROUP_DISABLED); }

  /**
   * Set `horizontal` attribute `inline|block`, default as `block`
   * @param {boolean|string} value If true will set `horizontal` attribute
   */
  set horizontal(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.HORIZONTAL, val.toString());
      this.rootEl?.classList.add(props.HORIZONTAL);
    } else {
      this.removeAttribute(props.HORIZONTAL);
      this.rootEl?.classList.remove(props.HORIZONTAL);
    }
  }

  get horizontal() { return this.getAttribute(props.HORIZONTAL); }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value) {
    const labelText = this.labelEl?.querySelector('.label-text');
    if (value) {
      this.setAttribute(props.LABEL, value);
    } else {
      this.removeAttribute(props.LABEL);
    }
    if (labelText) {
      labelText.innerHTML = value || '';
    }
  }

  get label() { return this.getAttribute(props.LABEL) || ''; }

  /**
   * Set `validation-has-error` attribute
   * @param {boolean|string} value If true will set `validation-has-error` attribute
   */
  set validationHasError(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.VALIDATION_HAS_ERROR, val.toString());
      this.input?.classList.add('error');
    } else {
      this.removeAttribute(props.VALIDATION_HAS_ERROR);
      this.input?.classList.remove('error');
    }
  }

  get validationHasError() { return this.getAttribute(props.VALIDATION_HAS_ERROR); }

  /**
   * Set the `value` attribute
   * @param {string} val the value property
   */
  set value(val) {
    if (val) {
      this.setAttribute(props.VALUE, val);
    } else {
      this.removeAttribute(props.VALUE);
    }
    this.input?.setAttribute(props.VALUE, (val || ''));
  }

  get value() { return this.getAttribute(props.VALUE); }
}

export default IdsRadio;
