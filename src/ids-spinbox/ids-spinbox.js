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
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsDirtyTrackerMixin
} from '../ids-mixins';
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
 * @part container the overall container of the spinbox
 * @part button increment/decrement button
 * @part input input containing value/placeholder
 */
@customElement('ids-spinbox')
@scss(styles)
export default class IdsSpinbox extends mix(IdsElement).with(
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
      props.LABEL_REQUIRED,
      props.MAX,
      props.MIN,
      props.STEP,
      props.VALUE
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
      `<label
        ${ buildClassAttrib('ids-label-text', this.disabled && 'disabled') }
        part="container"
        for="${this.id}-input-input"
      >
        <ids-text color="unset" ${disabledAttribHtml}>${this.label}</ids-text>
      </label>`
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
              part="button"
              tabindex="-1"
            >-</ids-button>
            <ids-input
              text-align="center"
              value=${this.value}
              id="${this.id}-input"
              label="${this.label}"
              label-hidden="true"
              ${placeholderHtml}
              ${disabledAttribHtml}
              part="input"
            ></ids-input>
            <ids-button
              type="tertiary"
              ${disabledAttribHtml}
              part="button"
              tabindex="-1"
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

    const labelEl = this.container.children[0];
    this.onEvent('click.label', labelEl, () => {
      const isDisabled = stringToBool(this.getAttribute(props.DISABLED));
      if (isDisabled) {
        this.input.input?.focus();
      }
    });
    this.input.setLabelElement(labelEl);

    this.onEvent('click.decrement', this.#decrementButton, () => {
      this.#onDecrementStep();
    });

    this.onEvent('click.increment', this.#incrementButton, () => {
      this.#onIncrementStep();
    });

    this.onEvent('focus', this, (e) => {
      const isDisabled = stringToBool(this.getAttribute(props.DISABLED));

      if (!isDisabled) {
        e.preventDefault();
        this.input.focus();
      }
    });

    this.listen(['ArrowUp', 'ArrowDown'], this, (e) => {
      if (stringToBool(this.getAttribute(props.DISABLED))) { return; }

      const key = e.key;

      switch (key) {
      case 'ArrowUp':
        this.#onIncrementStep();
        break;
      default:
      case 'ArrowDown':
        this.#onDecrementStep();
        break;
      }

      e.preventDefault();
    });

    this.setAttribute('role', 'spinbutton');
    return this;
  }

  /**
   * @param {number | string} value maximum value a spinbox can
   * be set to
   */
  set max(value) {
    if (parseInt(this.getAttribute(props.MAX)) !== parseInt(value)) {
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

  /**
   * @returns {number | string} the current max value the spinbox' input
   * can be set to
   */
  get max() {
    return this.getAttribute(props.MAX);
  }

  /**
   * @param {number | string} value minimum value a spinbox can
   * be set to
   */
  set min(value) {
    if (parseInt(this.getAttribute(props.MIN)) !== parseInt(value)) {
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

  /**
   * @returns {number | string} the current min value the spinbox' input
   * can be set to
   */
  get min() {
    return this.getAttribute(props.MIN);
  }

  /**
   * @param {number | string} value spinbox' input value
   */
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

  /**
   * @returns {number | string} spinbox' current input value
   */
  get value() {
    return this.getAttribute(props.VALUE);
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

  /**
   * @param {string} value label of the spinbox
   */
  set label(value) {
    this.setAttribute(props.LABEL, value);
    this.setAttribute('aria-label', value);
    this.input?.setAttribute('label', value);
  }

  /**
   * @returns {string} value label of the spinbox
   */
  get label() {
    return this.getAttribute(props.LABEL);
  }

  /**
   * @param {boolean|string} value whether to enable the dirty-tracker functionality
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

  /**
   * @returns {boolean|string} whether the dirty tracker has been enabled
   */
  get dirtyTracker() { return this.getAttribute(props.DIRTY_TRACKER); }

  set disabled(value) {
    const isValueTruthy = stringToBool(value);

    if (isValueTruthy) {
      this.setAttribute?.(props.DISABLED, '');
      this.input?.setAttribute?.(props.DISABLED, true);
      this.#incrementButton?.setAttribute?.(props.DISABLED, 'true');
      this.#decrementButton?.setAttribute?.(props.DISABLED, 'true');
      this.container.classList.add('disabled');
      this.setAttribute('tabindex', '-1');
    } else {
      this.removeAttribute?.(props.DISABLED);
      this.input?.removeAttribute?.(props.DISABLED);
      this.#incrementButton?.removeAttribute?.(props.DISABLED);
      this.#decrementButton?.removeAttribute?.(props.DISABLED);
      this.container.classList.remove('disabled');
      this.removeAttribute('tabindex');
    }
  }

  /**
   * div holding spinbox buttons/input
   * @type {HTMLElement}
   */
  #contentDiv;

  /**
   * @type {IdsButton}
   */
  #incrementButton;

  /**
   * @type {IdsButton}
   */
  #decrementButton;

  /**
   * callback to increment value by step
   * @type {Function}
   */
  #onIncrementStep() {
    const hasValidStep = !Number.isNaN(parseInt(this.step));
    const step = hasValidStep ? parseInt(this.step) : 1;
    this.value = parseInt(this.value) + step;
  }

  /**
   * callback to decrement value by step
   * @type {Function}
   */
  #onDecrementStep() {
    const hasValidStep = !Number.isNaN(parseInt(this.step));
    const step = hasValidStep ? parseInt(this.step) : 1;

    this.value = parseInt(this.value) - step;
  }

  /**
   * updates state of whether decrement button is disabled
   * @type {Function}
   */
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

  /**
   * updates state of whether increment button is disabled
   * @type {Function}
   */
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

  /**
   * @param {string|boolean} value whether the spinbox should have a
   * required form input
   */
  set labelRequired(value) {
    const isValueTruthy = stringUtils.stringToBool(value);

    if (isValueTruthy) {
      this.setAttribute(props.LABEL_REQUIRED, true);
      this.input.setAttribute(props.LABEL_REQUIRED, true);
    } else {
      this.removeAttribute(props.LABEL_REQUIRED);
      this.input.removeAttribute(props.LABEL_REQUIRED);
    }
  }

  /**
   * @returns {string|boolean} value whether the spinbox has a
   * required form input
   */
  get labelRequired() { return this.getAttribute(props.LABEL_REQUIRED); }
}
