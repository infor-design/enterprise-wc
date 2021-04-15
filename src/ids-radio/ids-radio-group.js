import {
  IdsElement,
  customElement,
  props,
  scss,
  mix,
  stringUtils
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsDirtyTrackerMixin } from '../ids-base/ids-dirty-tracker-mixin';
import { IdsValidationMixin } from '../ids-base/ids-validation-mixin';

// @ts-ignore
import styles from './ids-radio-group.scss';

// @ts-ignore
import IdsText from '../ids-text/ids-text';

/**
 * IDS Radio Group Component
 * @type {IdsRadioGroup}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsValidationMixin
 */
@customElement('ids-radio-group')
@scss(styles)
class IdsRadioGroup extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsDirtyTrackerMixin,
    IdsValidationMixin
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
      props.DIRTY_TRACKER,
      props.DISABLED,
      props.HORIZONTAL,
      props.LABEL,
      props.LABEL_REQUIRED,
      props.VALIDATE,
      props.VALIDATION_EVENTS,
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
        { name: 'dirty-tracker', prop: 'dirtyTracker' },
        { name: 'disabled', prop: 'disabled' },
        { name: 'horizontal', prop: 'horizontal' },
        { name: 'label', prop: 'label' },
        { name: 'label-required', prop: 'labelRequired' },
        { name: 'validate', prop: 'validate' },
        { name: 'validation-events', prop: 'validationEvents' },
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
    const slot = this.shadowRoot.querySelector('slot');
    this.onEvent('slotchange', slot, () => {
      this.afterChildrenReady();
    });
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    // Radio
    const disabled = stringUtils.stringToBool(this.disabled) ? ' disabled' : '';
    const disabledAria = stringUtils.stringToBool(this.disabled) ? ' aria-disabled="true"' : '';
    const horizontal = stringUtils.stringToBool(this.horizontal) ? ' horizontal' : '';
    const rootClass = ` class="ids-radio-group${disabled}${horizontal}"`;
    const rInd = !(stringUtils.stringToBool(this.labelRequired) || this.labelRequired === null);
    const labelClass = ` class="group-label-text${rInd ? ' no-required-indicator' : ''}"`;

    // Label
    const label = this.label ? `<ids-text type="legend"${labelClass}${disabledAria}>${this.label}</ids-text>` : '';

    return `<div role="radiogroup"${rootClass}>${label}<slot></slot></div>`;
  }

  /**
   * Set after children ready
   * @private
   * @returns {void}
   */
  afterChildrenReady() {
    this.input = this.shadowRoot.querySelector('.ids-radio-group');
    this.labelEl = this.shadowRoot.querySelector('.group-label-text');

    this.setValue();
    this.handleHorizontal();
    this.handleDisabled();
    this.handleEvents();
    // @ts-ignore
    this.handleDirtyTracker();
    // @ts-ignore
    this.handleValidation();
  }

  /**
   * Set value for group
   * @private
   * @returns {void}
   */
  setValue() {
    const radioArr = [].slice.call(this.querySelectorAll('ids-radio[checked="true"]'));
    const len = radioArr.length;
    const value = radioArr[len - 1]?.getAttribute(props.VALUE);
    if (value) {
      this.setAttribute(props.VALUE, value);
    } else if (!len) {
      const radio = this.querySelector('ids-radio');
      const rootEl = radio?.shadowRoot?.querySelector('.ids-radio');
      rootEl?.setAttribute('tabindex', '0');
    } else if (len > 1) {
      radioArr.pop();
      radioArr.forEach((r) => r.removeAttribute(props.CHECKED));
    }
  }

  /**
   * Clear the group as checked, validation etc.
   * @returns {void}
   */
  clear() {
    this.value = null;
    this.checked = null;
    // @ts-ignore
    this.removeAllMessages();
    const radio = this.querySelector('ids-radio');
    const rootEl = radio.shadowRoot?.querySelector('.ids-radio');
    rootEl?.setAttribute('tabindex', '0');
  }

  /**
   * Set disabled for each radio in group.
   * @returns {void}
   */
  handleDisabled() {
    const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
    const rootEl = this.shadowRoot.querySelector('.ids-radio-group');

    if (stringUtils.stringToBool(this.disabled)) {
      this.labelEl?.setAttribute('aria-disabled', 'true');
      rootEl?.classList.add(props.DISABLED);
      radioArr.forEach((r) => r.setAttribute(props.GROUP_DISABLED, true));
    } else {
      this.labelEl?.removeAttribute('aria-disabled');
      rootEl?.classList.remove(props.DISABLED);
      radioArr.forEach((r) => r.removeAttribute(props.GROUP_DISABLED));
    }
  }

  /**
   * Set horizontal for each radio in group.
   * @returns {void}
   */
  handleHorizontal() {
    const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
    const rootEl = this.shadowRoot.querySelector('.ids-radio-group');
    if (stringUtils.stringToBool(this.horizontal)) {
      rootEl?.classList.add(props.HORIZONTAL);
      radioArr.forEach((r) => r.setAttribute(props.HORIZONTAL, true));
    } else {
      rootEl?.classList.remove(props.HORIZONTAL);
      radioArr.forEach((r) => r.removeAttribute(props.HORIZONTAL));
    }
  }

  /**
   * Make given radio as checked.
   * @private
   * @param {object} radio to make checked
   * @param {boolean} isFocus if true will set focus
   * @returns {void}
   */
  makeChecked(radio, isFocus) {
    const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
    const targetEl = radioArr.filter((r) => r !== radio);
    targetEl.forEach((r) => r.removeAttribute(props.CHECKED));
    this.checked = radio;
    const val = radio.value;
    if (val) {
      this.value = val;
    }
    if (isFocus) {
      radio.shadowRoot?.querySelector('input[type="radio"]')?.focus();
    }

    // Mark if first radio checked in group, use for css style
    const className = 'first-item-checked';
    if (radio === radioArr[0]) {
      this.input?.classList.add(className);
    } else {
      this.input?.classList.remove(className);
    }

    const args = { value: val, checked: radio };
    this.triggerEvent('change', this.input, args);
    this.triggerEvent('change', this, args);
  }

  /**
   * Handle radio group change event
   * @private
   * @returns {void}
   */
  handleRadioGroupChangeEvent() {
    const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));

    radioArr.forEach((r) => {
      this.onEvent('change', r, () => {
        this.makeChecked(r, false);
      });
    });
  }

  /**
   * Handle keydown event
   * @private
   * @returns {void}
   */
  handleRadioGroupKeydown() {
    const radioArr = [].slice.call(this.querySelectorAll('ids-radio:not([disabled="true"])'));
    const len = radioArr.length;
    radioArr.forEach((r, i) => {
      this.onEvent('keydown', r, (/** @type {any} */ e) => {
        const allow = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Space'];
        const key = e.code;
        if (allow.indexOf(key) > -1) {
          let idx = i;
          if (key === 'ArrowDown' || key === 'ArrowRight') {
            idx = (i >= (len - 1)) ? 0 : (idx + 1);
          } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
            idx = (i <= 0) ? (len - 1) : (idx - 1);
          }
          this.makeChecked(radioArr[idx], true);
          e.preventDefault();
        }
      });
    });
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.handleRadioGroupChangeEvent();
    this.handleRadioGroupKeydown();
  }

  /**
   * Sets the dirty tracking feature on to indicate a changed field
   * @param {boolean|string} value If true will set `dirty-tracker` attribute
   */
  set dirtyTracker(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.DIRTY_TRACKER, val.toString());
    } else {
      this.removeAttribute(props.DIRTY_TRACKER);
    }
    // @ts-ignore
    this.handleDirtyTracker();
  }

  get dirtyTracker() { return this.getAttribute(props.DIRTY_TRACKER); }

  /**
   * Sets checkbox to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    if (stringUtils.stringToBool(value)) {
      this.setAttribute(props.DISABLED, value.toString());
    } else {
      this.removeAttribute(props.DISABLED);
    }
    this.handleDisabled();
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Flips the checkbox orientation to horizontal
   * @param {boolean|string} value If true will set `horizontal` attribute
   */
  set horizontal(value) {
    if (stringUtils.stringToBool(value)) {
      this.setAttribute(props.HORIZONTAL, value.toString());
    } else {
      this.removeAttribute(props.HORIZONTAL);
    }
    this.handleHorizontal();
  }

  get horizontal() { return this.getAttribute(props.HORIZONTAL); }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value) {
    const rootEl = this.shadowRoot.querySelector('.ids-radio-group');
    let labelText = this.shadowRoot.querySelector('.group-label-text');
    if (value) {
      this.setAttribute(props.LABEL, value);
      if (!labelText) {
        labelText = document.createElement('ids-text');
        labelText.className = 'group-label-text';
        const refEl = this.shadowRoot.querySelector('slot');
        rootEl?.insertBefore(labelText, refEl);
        labelText = this.shadowRoot.querySelector('.group-label-text');
      }
      labelText.innerHTML = value;
      return;
    }
    this.removeAttribute(props.LABEL);
    labelText = this.shadowRoot.querySelector('.group-label-text');
    labelText?.remove();
  }

  get label() { return this.getAttribute(props.LABEL); }

  /**
   * Sets the checkbox to required
   * @param {string} value The `label-required` attribute
   */
  set labelRequired(value) {
    const val = stringUtils.stringToBool(value);
    if (value) {
      this.setAttribute(props.LABEL_REQUIRED, value.toString());
    } else {
      this.removeAttribute(props.LABEL_REQUIRED);
    }
    this.labelEl?.classList[!val ? 'add' : 'remove']('no-required-indicator');
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
    // @ts-ignore
    this.handleValidation();
  }

  get validationEvents() { return this.getAttribute(props.VALIDATION_EVENTS); }

  /**
   * Sets the checkbox `value` attribute
   * @param {string | null} val the value property
   */
  set value(val) {
    const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
    if (val) {
      const state = { on: [], off: [] };
      radioArr.forEach((/** @type {HTMLElement | never} */ r) => {
        const rVal = r.getAttribute(props.VALUE);
        // @ts-ignore
        state[rVal === val ? 'on' : 'off'].push(r);
      });
      state.off.forEach((/** @type {HTMLElement} */ r) => r.removeAttribute(props.CHECKED));
      /** @type {HTMLElement} */
      const r = state.on[state.on.length - 1];
      if (r) {
        r.setAttribute(props.CHECKED, 'true');
        this.setAttribute(props.VALUE, val);
        this.checked = r;
      } else {
        this.removeAttribute(props.VALUE);
      }
    } else {
      this.removeAttribute(props.VALUE);
      radioArr.forEach((r) => r.removeAttribute(props.CHECKED));
    }
  }

  get value() { return this.getAttribute(props.VALUE); }
}

export default IdsRadioGroup;
