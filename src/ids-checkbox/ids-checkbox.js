import {
  IdsElement,
  customElement,
  mix,
  scss,
  props
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsHideFocusMixin } from '../ids-base/ids-hide-focus-mixin';
import { IdsStringUtils as stringUtils } from '../ids-base/ids-string-utils';
import { IdsDirtyTrackerMixin } from '../ids-base/ids-dirty-tracker-mixin';
import { IdsValidationMixin } from '../ids-base/ids-validation-mixin';

// @ts-ignore
import styles from './ids-checkbox.scss';
// @ts-ignore
import IdsText from '../ids-text/ids-text';

/**
 * IDS Checkbox Component
 */
@customElement('ids-checkbox')
@scss(styles)
class IdsCheckbox extends mix(IdsElement).with(
    IdsHideFocusMixin,
    IdsDirtyTrackerMixin,
    IdsValidationMixin,
    IdsEventsMixin
  ) {
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
      props.DIRTY_TRACKER,
      props.DISABLED,
      props.HORIZONTAL,
      props.INDETERMINATE,
      props.LABEL,
      props.LABEL_REQUIRED,
      props.VALIDATE,
      props.VALIDATION_EVENTS,
      props.VALUE
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    /** @type {any} */
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    this.labelEl = this.shadowRoot.querySelector('label');

    // @ts-ignore
    this.hideFocus();
    this.handleEvents();
  }

  /**
   * Custom Element `disconnectedCallback` implementation
   * @returns {void}
   */
  disconnectedCallback() {
    // @ts-ignore
    IdsElement.prototype.disconnectedCallback.apply(this);
    // @ts-ignore
    this.destroyHideFocus();
    this.handleCheckboxChangeEvent('remove');
    this.handleNativeEvents('remove');
  }

  /**
   * Create the Template for the contents.
   * @returns {string} The template.
   */
  template() {
    // Checkbox
    const disabled = stringUtils.stringToBool(this.disabled) ? ' disabled' : '';
    const horizontal = stringUtils.stringToBool(this.horizontal) ? ' horizontal' : '';
    const checked = stringUtils.stringToBool(this.checked) ? ' checked' : '';
    const rootClass = ` class="ids-checkbox${disabled}${horizontal}"`;
    let checkboxClass = 'checkbox';
    checkboxClass += stringUtils.stringToBool(this.indeterminate) ? ' indeterminate' : '';
    checkboxClass = ` class="${checkboxClass}"`;

    return `
      <div${rootClass}>
        <label>
          <input type="checkbox"${checkboxClass}${disabled}${checked}>
          <span class="checkmark${checked}"></span>
          <ids-text class="label-text">${this.label}</ids-text>
        </label>
      </div>
    `;
  }

  /**
   * Handle checkbox change event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleCheckboxChangeEvent(option = '') {
    if (this.input) {
      const eventName = 'change';
      if (option === 'remove') {
        const handler = this?.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.off(eventName, this.input);
        }
      } else {
        this.on(eventName, this.input, () => {
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
          const handler = this?.handledEvents?.get(evt);
          if (handler && handler.target === this.input) {
            this.off(evt, this.input);
          }
        } else {
          this.on(evt, this.input, (/** @type {any} */ e) => {
            /**
             * Trigger event on parent and compose the args
             * will fire nativeEvents.
             * @private
             * @param  {object} elem Actual event
             * @param  {string} value The updated input element value
             */
            this.trigger(e.type, this, {
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
    this.handleCheckboxChangeEvent();
    this.handleNativeEvents();
  }

  /**
   * Sets the checked state to true or false
   * @param {boolean|string} value If true will set `checked` attribute
   */
  set checked(value) {
    const checkmark = this.shadowRoot.querySelector('.checkmark');
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.CHECKED, val.toString());
      this.input?.setAttribute(props.CHECKED, val);
      checkmark?.classList.add(props.CHECKED);
    } else {
      this.removeAttribute(props.CHECKED);
      this.input?.removeAttribute(props.CHECKED);
      checkmark?.classList.remove(props.CHECKED);
    }
  }

  get checked() { return this.getAttribute(props.CHECKED); }

  /**
   *  Sets the checkbox color to one of the colors in our color palette for example emerald07
   * @param {boolean|string} value If true will set `color` attribute
   */
  set color(value) {
    const rootEl = this.shadowRoot.querySelector('.ids-checkbox');
    if (value) {
      this.setAttribute(props.COLOR, value.toString());
      rootEl?.setAttribute(props.COLOR, value.toString());
    } else {
      this.removeAttribute(props.COLOR);
      rootEl?.removeAttribute(props.COLOR);
    }
  }

  get color() { return this.getAttribute(props.COLOR); }

  /**
   * Set the dirty tracking feature on to indicate a changed field
   * @param {boolean|string} value If true will set `dirty-tracker` attribute
   */
  set dirtyTracker(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.DIRTY_TRACKER, val.toString());
    } else {
      this.removeAttribute(props.DIRTY_TRACKER);
    }
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    this.labelEl = this.shadowRoot.querySelector('label');
    // @ts-ignore
    this.handleDirtyTracker();
  }

  get dirtyTracker() { return this.getAttribute(props.DIRTY_TRACKER); }

  /**
   * Sets input to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    const rootEl = this.shadowRoot.querySelector('.ids-checkbox');
    const val = stringUtils.stringToBool(value);
    if (val) {
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
   * Flips the checkbox orientation to horizontal
   * @param {boolean|string} value If true will set `horizontal` attribute
   */
  set horizontal(value) {
    const rootEl = this.shadowRoot.querySelector('.ids-checkbox');
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.HORIZONTAL, val.toString());
      rootEl?.classList.add(props.HORIZONTAL);
    } else {
      this.removeAttribute(props.HORIZONTAL);
      rootEl?.classList.remove(props.HORIZONTAL);
    }
  }

  get horizontal() { return this.getAttribute(props.HORIZONTAL); }

  /**
   * Sets the checkbox to the indeterminate state
   * @param {string|boolean} value The `indeterminate` attribute
   */
  set indeterminate(value) {
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.INDETERMINATE, val.toString());
      this.input.classList.add(props.INDETERMINATE);
      this.input.indeterminate = true;
    } else {
      this.removeAttribute(props.INDETERMINATE);
      this.input.classList.remove(props.INDETERMINATE);
      this.input.indeterminate = false;
    }
  }

  get indeterminate() { return this.getAttribute(props.INDETERMINATE); }

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
   * Sets the checkbox to required
   * @param {string} value The `label-required` attribute
   */
  set labelRequired(value) {
    this.labelEl = this.shadowRoot.querySelector('label');
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.LABEL_REQUIRED, val.toString());
    } else {
      this.removeAttribute(props.LABEL_REQUIRED);
    }
    this.labelEl.classList[!val ? 'add' : 'remove']('no-required-indicator');
  }

  get labelRequired() { return this.getAttribute(props.LABEL_REQUIRED); }

  /**
   * Sets the validation check to use
   * @param {string} value The `validate` attribute
   */
  set validate(value) {
    if (value) {
      this.setAttribute(props.VALIDATE, value);
    } else {
      this.removeAttribute(props.VALIDATE);
    }
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    this.labelEl = this.shadowRoot.querySelector('label');
    // @ts-ignore
    this.handleValidation();
  }

  get validate() { return this.getAttribute(props.VALIDATE); }

  /**
   * Sets which events to fire validation on
   * @param {string} value The `validation-events` attribute
   */
  set validationEvents(value) {
    if (value) {
      this.setAttribute(props.VALIDATION_EVENTS, value);
    } else {
      this.removeAttribute(props.VALIDATION_EVENTS);
    }
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    this.labelEl = this.shadowRoot.querySelector('label');
    // @ts-ignore
    this.handleValidation();
  }

  get validationEvents() { return this.getAttribute(props.VALIDATION_EVENTS); }

  /**
   * Set the checkbox `value` attribute
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

export default IdsCheckbox;
