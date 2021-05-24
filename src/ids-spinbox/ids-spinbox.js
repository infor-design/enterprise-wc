import {
  IdsElement,
  customElement,
  scss,
  props,
  stringUtils,
  mix
} from '../ids-base/ids-element';
import IdsButton from '../ids-button/ids-button';
import IdsInput from '../ids-input/ids-input';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import { IdsDirtyTrackerMixin } from '../ids-base/ids-dirty-tracker-mixin';
import styles from './ids-spinbox.scss';

const { stringToBool, buildClassAttrib } = stringUtils;

/**
 * used for assigning ids
 */
let instanceCounter = 0;

/**
 * IDS Spinbox Component
 * @type {IdsSpinbox}
 * @inherits IdsElement
 */
@customElement('ids-spinbox')
@scss(styles)
class IdsSpinbox extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsDirtyTrackerMixin
  ) {
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
      props.MAX,
      props.MIN,
      props.STEP,
      props.VALUE,
      props.ID
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    if (!this.id) {
      this.setAttribute(props.ID, `ids-spinbox-${++instanceCounter}`);
    }

    const disabledAttribHtml = this.disabled ? ' disabled' : '';

    const labelHtml = (
      `<div
        ${ buildClassAttrib('label', this.disabled && 'disabled') }
        role="presentation"
        >
          <ids-text color="unset" font-size="14" ${disabledAttribHtml}>${this.label}</ids-text>
        </div>`
    );

    const placeholderHtml = (
      this.placeholder ? ` placeholder="${this.placeholder}"` : ''
    );

    return (
      `<div class="ids-spinbox${this.disabled ? ' disabled' : ''}">
          ${labelHtml}
          <div class="ids-spinbox-content">
            <ids-button
              type="tertiary"
              ${disabledAttribHtml}
              role="presentation"
            >-</ids-button>
            <ids-input
              text-align="center"
              value=${this.value}
              id="${this.id}-input"
              label="${this.label}"
              ${placeholderHtml}
              ${disabledAttribHtml}
              label-hidden="true"
            ></ids-input>
            <ids-button
              type="tertiary"
              ${disabledAttribHtml}
              role="presentation"
            >+</ids-button>
          </div>
      </div>`
    );
  }

  rendered() {
    this.#updateDecrementDisabled();
    this.#updateIncrementDisabled();
  }

  connectedCallback() {
    this.setAttribute('aria-valuenow', this.value);
    if (stringToBool(this.getAttribute(props.MAX))) {
      this.setAttribute('aria-valuemax', this.max);
    }
    if (stringToBool(this.getAttribute(props.MIN))) {
      this.setAttribute('aria-valuemin', this.min);
    }
    this.setAttribute('aria-label', this.label);

    this.#contentDiv = this.container.children[1];
    const [
      decrementButton,
      input,
      incrementButton
    ] = [...this.#contentDiv.children];

    this.input = input;
    this.#decrementButton = decrementButton;
    this.#incrementButton = incrementButton;

    this.input.mask = 'number';
    this.input.maskOptions = {
      allowDecimal: false,
      allowNegative: true
    };

    this.onEvent('click.decrement', this.#decrementButton, () => {
      this.#onDecrement();
    });

    this.onEvent('click.increment', this.#incrementButton, () => {
      this.#onIncrement();
    });

    this.onEvent('focus', this, (e) => {
      const isDisabled = stringToBool(this.getAttribute(props.DISABLED));

      if (!isDisabled) {
        e.preventDefault();
      }
    });

    this.listen(['ArrowUp', 'ArrowDown'], this, (e) => {
      if (stringToBool(this.getAttribute(props.DISABLED))) { return; }

      const key = e.key;

      switch (key) {
      case 'ArrowUp':
        this.#onIncrement();
        break;
      default:
      case 'ArrowDown':
        this.#onDecrement();
        break;
      }

      e.preventDefault();
    });

    this.setAttribute('role', 'spinbutton');
    return this;
  }

  set max(value) {
    if (this.getAttribute(props.MAX) !== value) {
      this.setAttribute(props.MAX, value);

      if (stringToBool(value)) {
        this.setAttribute('aria-valuemax', value);
      } else {
        this.removeAttribute('aria-valuemax');
      }

      this.#updateIncrementDisabled();
      this.#updateDecrementDisabled();
    }
  }

  get max() {
    return this.getAttribute(props.MAX);
  }

  set min(value) {
    if (this.getAttribute(props.MIN) !== value) {
      this.setAttribute(props.MIN, value);

      if (stringToBool(value)) {
        this.setAttribute('aria-valuemax', value);
      } else {
        this.removeAttribute('aria-valuemax');
      }

      this.#updateIncrementDisabled();
      this.#updateDecrementDisabled();
    }
  }

  get min() {
    return this.getAttribute(props.MIN);
  }

  set value(value) {
    if (parseInt(this.getAttribute(props.VALUE)) !== parseInt(value)) {
      const hasMinValue = !Number.isNaN(parseInt(this.min));
      const hasMaxValue = !Number.isNaN(parseInt(this.max));

      let nextValue = parseInt(value);

      if (hasMinValue) {
        nextValue = Math.max(nextValue, parseInt(this.min));
      }

      if (hasMaxValue) {
        nextValue = Math.min(nextValue, parseInt(this.max));
      }

      this.setAttribute(props.VALUE, nextValue);
      this.setAttribute('aria-valuenow', nextValue);
      this.setAttribute(props.TYPE, 'number');
      this.input.value = nextValue;

      this.#updateDecrementDisabled();
      this.#updateIncrementDisabled();
    }
  }

  get value() {
    return this.getAttribute(props.VALUE);
  }

  set id(value) {
    this.setAttribute(props.ID, value);
    const labelEl = this.shadowRoot.querySelector('label');
    const inputId = `${value}-input`;
    labelEl?.setAttribute?.('for', inputId);
    this.#contentDiv?.setAttribute(props.ID, inputId);
  }

  get id() {
    return this.getAttribute(props.ID);
  }

  /**
   * @param {string} value placeholder text when a user has cleared
   * the spinbox input
   */
  set placeholder(value) {
    this.setAttribute(props.PLACEHOLDER, value);
  }

  /**
   * @returns {string} placeholder text when a
   * user has cleared the spinbox input
   */
  get placeholder() {
    return this.getAttribute(props.PLACEHOLDER);
  }

  set label(value) {
    this.setAttribute(props.LABEL, value);
    this.setAttribute('aria-label', value);
    this.input?.setAttribute('label', value);
  }

  get label() {
    return this.getAttribute(props.LABEL);
  }

  /**
   * Set the dirty tracking feature on to indicate a changed field
   * @param {boolean|string} value If true will set `dirty-tracker` attribute
   */
  set dirtyTracker(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(props.DIRTY_TRACKER, val.toString());
      this.input.setAttribute(props.DIRTY_TRACKER, val.toString());
    } else {
      this.removeAttribute(props.DIRTY_TRACKER);
      this.input.removeAttribute(props.DIRTY_TRACKER);
    }
  }

  get dirtyTracker() { return this.getAttribute(props.DIRTY_TRACKER); }

  set disabled(value) {
    const isValueTruthy = stringToBool(value);

    if (isValueTruthy) {
      this.setAttribute?.(props.DISABLED, '');
      this.input?.setAttribute?.(props.DISABLED, true);
      this.#incrementButton?.setAttribute?.(props.DISABLED, 'true');
      this.#decrementButton?.setAttribute?.(props.DISABLED, 'true');
      this.container.classList.add('disabled');
    } else {
      this.removeAttribute?.(props.DISABLED);
      this.input?.removeAttribute?.(props.DISABLED);
      this.#incrementButton?.removeAttribute?.(props.DISABLED);
      this.#decrementButton?.removeAttribute?.(props.DISABLED);
      this.container.classList.remove('disabled');
    }
  }

  #contentDiv;

  #incrementButton;

  #decrementButton;

  #onIncrement() {
    const hasValidStep = !Number.isNaN(parseInt(this.step));
    const step = hasValidStep ? parseInt(this.step) : 1;
    this.value = parseInt(this.value) + step;
  }

  #onDecrement() {
    const hasValidStep = !Number.isNaN(parseInt(this.step));
    const step = hasValidStep ? parseInt(this.step) : 1;

    this.value = parseInt(this.value) - step;
  }

  #updateDecrementDisabled() {
    const hasMinValue = !Number.isNaN(parseInt(this.min));

    if (!hasMinValue) {
      this.#decrementButton.removeAttribute('disabled');
      return;
    }

    if (parseInt(this.value) <= parseInt(this.min)) {
      this.#decrementButton.setAttribute('disabled', '');
    } else {
      this.#decrementButton.removeAttribute('disabled');
    }
  }

  #updateIncrementDisabled() {
    const hasMaxValue = !Number.isNaN(parseInt(this.max));

    if (!hasMaxValue) {
      this.#incrementButton.removeAttribute('disabled');
      return;
    }

    if (parseInt(this.value) >= parseInt(this.max)) {
      this.#incrementButton?.setAttribute('disabled', '');
    } else {
      this.#incrementButton?.removeAttribute('disabled');
    }
  }
}

export default IdsSpinbox;
