import {
  IdsElement,
  customElement,
  scss,
  attributes,
  stringUtils,
  mix
} from '../ids-base/ids-element';
import IdsButton from '../ids-button/ids-button';
import IdsInput from '../ids-input/ids-input';
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
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
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @part container the overall container of the spinbox
 * @part button increment/decrement button
 * @part input input containing value/placeholder
 * @part label label text above the input
 * @part validation validation message when there is an error
 */
@customElement('ids-spinbox')
@scss(styles)
export default class IdsSpinbox extends mix(IdsElement).with(
    IdsThemeMixin,
    IdsEventsMixin,
    IdsKeyboardMixin
  ) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      attributes.DIRTY_TRACKER,
      attributes.DISABLED,
      attributes.LABEL,
      attributes.LABEL_HIDDEN,
      attributes.MAX,
      attributes.MIN,
      attributes.MODE,
      attributes.READONLY,
      attributes.STEP,
      attributes.VALIDATE,
      attributes.VALUE,
      attributes.VERSION
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    if (!this.id) {
      this.setAttribute(attributes.ID, `ids-spinbox-${++instanceCounter}`);
    }

    const disabledAttribHtml = this.hasAttribute(attributes.DISABLED)
      ? /* istanbul ignore next */' disabled'
      : '';

    const buttonDisabledAttribHtml = (
      this.hasAttribute(attributes.DISABLED) || this.hasAttribute(attributes.READONLY)
    ) ? ' disabled' : '';

    /* istanbul ignore next */
    const labelHtml = this.labelHidden ? '<span></span>' : (
      `<label
        ${ buildClassAttrib('ids-label-text', this.disabled && 'disabled') }
        part="label"
        for="${this.id}-input-input"
      >
        <ids-text label ${disabledAttribHtml}>${this.label}</ids-text>
      </label>`
    );

    /* istanbul ignore next */
    return (
      `<div
        ${buildClassAttrib(
        'ids-spinbox',
        this.hasAttribute(attributes.DISABLED) && 'disabled',
        this.hasAttribute(attributes.READONLY) && 'readonly'
      ) }
        part="container">
          ${labelHtml}
          <div class="ids-spinbox-content">
            <ids-button
              type="tertiary"
              part="button"
              tabindex="-1"
              ${buttonDisabledAttribHtml}
            ><ids-text
              label
              font-size="16"
              font-weight="bold"
              ${buttonDisabledAttribHtml}
            >-</ids-text>
            </ids-button>
            <ids-input
              text-align="center"
              value=${this.value}
              id="${this.id}-input"
              label="${this.label}"
              label-hidden="true"
              ${this.placeholder ? ` placeholder="${this.placeholder}"` : ''}
              ${disabledAttribHtml}
              part="input"
            ></ids-input>
            <ids-button
              type="tertiary"
              part="button"
              tabindex="-1"
              ${buttonDisabledAttribHtml}
            ><ids-text
              label
              font-size="16"
              font-weight="bold"
              ${buttonDisabledAttribHtml}
            >+</ids-text>
            </ids-button>
          </div>
          ${this.validate ? '<div class="validation-message" part="validation"></div>' : ''}
      </div>`
    );
  }

  rendered() {
    this.#updateDisabledButtonStates();
  }

  connectedCallback() {
    this.setAttribute('aria-valuenow', this.value);
    if (stringToBool(this.getAttribute(attributes.MAX))) {
      this.setAttribute('aria-valuemax', this.max);
    }
    if (stringToBool(this.getAttribute(attributes.MIN))) {
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

    this.input.addEventListener('change', () => {
      if (this.input.value !== this.value) {
        this.value = this.input.value;
        this.#onStepButtonUnpressed();
      }
    });

    const labelEl = this.container.children[0];
    this.onEvent('click.label', labelEl, () => {
      const isDisabled = this.hasAttribute(attributes.DISABLED);
      /* istanbul ignore else */
      if (!isDisabled) {
        this.input.input?.focus();
      }
    });

    if (this.container.children[2]) {
      const validationEl = this.container.children[2];
      this.input.setValidationElement(validationEl);
    }

    this.input.setLabelElement(labelEl);

    this.onEvent(
      'mousedown.increment',
      this.#incrementButton,
      this.#getStepButtonCycler('up')
    );

    this.onEvent(
      'mousedown.decrement',
      this.#decrementButton,
      this.#getStepButtonCycler('down')
    );

    /* istanbul ignore next */
    this.onEvent('mouseup', window, (e) => {
      this.#onStepButtonUnpressed(e);
    });

    this.onEvent('focus', this, (e) => {
      const isDisabled = this.hasAttribute(attributes.DISABLED);
      /* istanbul ignore next */
      if (!isDisabled) {
        e.preventDefault();
        this.input.focus();
      }
    });

    this.listen(['ArrowUp', 'ArrowDown'], this, (e) => {
      /* istanbul ignore next */
      if (stringToBool(this.getAttribute(attributes.DISABLED))) { return; }
      /* istanbul ignore next */
      const key = e.key;

      this.#onStepButtonUnpressed();

      /* istanbul ignore next */
      switch (key) {
      case 'ArrowUp':
        this.#onStep('up');
        break;
      default:
      case 'ArrowDown':
        this.#onStep('down');
        break;
      }

      e.preventDefault();
    });

    this.setAttribute('role', 'spinbutton');

    super.connectedCallback();
  }

  /**
   * @param {number | string} value maximum value a spinbox can
   * be set to
   */
  set max(value) {
    if (parseInt(this.getAttribute(attributes.MAX)) !== parseInt(value)) {
      this.setAttribute(attributes.MAX, value);

      if (stringToBool(value)) {
        this.setAttribute('aria-valuemax', value);
      } else {
        this.removeAttribute('aria-valuemax');
      }

      this.#updateDisabledButtonStates();
    }
  }

  /**
   * @returns {number | string} the current max value the spinbox' input
   * can be set to
   */
  get max() {
    return this.getAttribute(attributes.MAX);
  }

  /**
   * @param {number | string} value minimum value a spinbox can
   * be set to
   */
  set min(value) {
    if (parseInt(this.getAttribute(attributes.MIN)) !== parseInt(value)) {
      this.setAttribute(attributes.MIN, value);

      if (stringToBool(value)) {
        this.setAttribute('aria-valuemax', value);
      } else {
        this.removeAttribute('aria-valuemax');
      }

      this.#updateDisabledButtonStates();
    }
  }

  /**
   * @returns {number | string} the current min value the spinbox' input
   * can be set to
   */
  get min() {
    return this.getAttribute(attributes.MIN);
  }

  /**
   * @param {number | string} value spinbox' input value
   */
  set value(value) {
    if (parseInt(this.getAttribute(attributes.VALUE)) !== parseInt(value)) {
      let nextValue = parseInt(value);

      // corrections on value if not in-step

      const step = parseInt(this.step);
      const hasValidStep = !Number.isNaN(step);

      if (hasValidStep && (nextValue % step !== 0)) {
        nextValue = Math.round(nextValue / step) * step;
      }

      // corrections on value if not in-range

      const hasMinValue = !Number.isNaN(parseInt(this.min));
      const hasMaxValue = !Number.isNaN(parseInt(this.max));

      if (hasMinValue) {
        nextValue = Math.max(nextValue, parseInt(this.min));
      }

      if (hasMaxValue) {
        nextValue = Math.min(nextValue, parseInt(this.max));
      }

      if ((hasMaxValue && nextValue === parseInt(this.max))
        || (hasMinValue && nextValue === parseInt(this.min))
      ) {
        this.#onStepButtonUnpressed();
      }

      // set properties/updaters

      this.setAttribute(attributes.VALUE, nextValue);
      this.setAttribute('aria-valuenow', nextValue);
      this.setAttribute(attributes.TYPE, 'number');
      this.input.value = nextValue;

      this.#updateDisabledButtonStates();

      this.triggerEvent('change', this, {
        bubbles: false,
        detail: { elem: this, value: nextValue }
      });
    }
  }

  /**
   * @returns {number | string} spinbox' current input value
   */
  get value() {
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * @param {string} value hint shown when a
   * user has cleared the spinbox input
   */
  set placeholder(value) {
    this.setAttribute(attributes.PLACEHOLDER, value);
  }

  /**
   * @returns {string} hint shown when a
   * user has cleared the spinbox input
   */
  get placeholder() {
    return this.getAttribute(attributes.PLACEHOLDER);
  }

  /**
   * @param {string} value label text describing the spinbox value
   */
  set label(value) {
    this.setAttribute(attributes.LABEL, value);
    this.setAttribute('aria-label', value);
    this.input?.setAttribute('label', value);
  }

  /**
   * @returns {string} value label text describing the spinbox value
   */
  get label() {
    return this.getAttribute(attributes.LABEL);
  }

  /**
   * @param {boolean} value Flags a label's text as not displayed
   * explicitly in the label element
   *
   * (still requires a label for the sake of accessibility and
   * will be applied on the input element)
   */
  set labelHidden(value) {
    if (stringUtils.stringToBool(value)) {
      if (this.getAttribute(attributes.LABEL_HIDDEN) !== '') {
        this.setAttribute(attributes.LABEL_HIDDEN, '');
      }

      const existingLabel = this.shadowRoot.querySelector('label');
      if (existingLabel) {
        existingLabel.remove();
      }

      this.input?.setAttribute?.('aria-label', this.label);
    } else {
      if (this.hasAttribute(attributes.LABEL_HIDDEN)) {
        this.removeAttribute(attributes.LABEL_HIDDEN);
      }

      /* istanbul ignore else */
      if (this.input) {
        this.input?.removeAttribute('aria-label');

        const labelTemplate = document.createElement('template');
        labelTemplate.innerHTML = (
          `<label
              ${ buildClassAttrib('ids-label-text', this.disabled && 'disabled') }
              part="label"
              for="${this.id}-input-input"
            >`
        );

        this.container.insertBefore(
          labelTemplate.content.childNodes[0],
          this.container.querySelector('field-container')
        );
      }
    }
  }

  /**
   * @returns {boolean} value Whether a label's text has been flagged
   * as hidden.
   *
   * (a label is still required for the sake of accessibility and this will be applied on the input
   * element)
   */
  get labelHidden() {
    return this.hasAttribute(attributes.LABEL_HIDDEN);
  }

  /**
   * @param {boolean|string} value whether to enable the dirty-tracker functionality
   */
  set dirtyTracker(value) {
    const isValueTruthy = stringToBool(value);
    if (isValueTruthy) {
      this.setAttribute(attributes.DIRTY_TRACKER, true);
      this.input.setAttribute(attributes.DIRTY_TRACKER, true);
    } else {
      this.removeAttribute(attributes.DIRTY_TRACKER);
      this.input.removeAttribute(attributes.DIRTY_TRACKER);
    }
  }

  /**
   * @returns {boolean|string} whether the dirty tracker has been enabled
   */
  get dirtyTracker() { return this.getAttribute(attributes.DIRTY_TRACKER); }

  /**
   * @param {boolean|string} value whether or not spinbox
   * interaction is disabled
   */
  set disabled(value) {
    const isValueTruthy = stringToBool(value);

    if (isValueTruthy) {
      this.setAttribute(attributes.DISABLED, true);
      this.input?.setAttribute?.(attributes.DISABLED, true);
      this.container.classList.add('disabled');
      this.setAttribute('tabindex', '-1');

      this.#incrementButton?.setAttribute?.(attributes.DISABLED, '');
      this.#decrementButton?.setAttribute?.(attributes.DISABLED, '');
    } else {
      this.removeAttribute?.(attributes.DISABLED);
      this.input?.removeAttribute?.(attributes.DISABLED);
      this.container.classList.remove('disabled');
      this.removeAttribute('tabindex');

      if (!this.hasAttribute(attributes.READONLY)) {
        this.#incrementButton?.removeAttribute?.(attributes.DISABLED);
        this.#decrementButton?.removeAttribute?.(attributes.DISABLED);
      }
    }
  }

  /**
   * @returns {'true'|null} whether or not element is disabled
   */
  get disabled() {
    return this.getAttribute(attributes.DISABLED);
  }

  /**
   * @param {string} value handles `validate` functionality;
   * if set as "required", has a required value
   */
  set validate(value) {
    if (value) {
      this.setAttribute(attributes.VALIDATE, value);
      this.input.setAttribute(attributes.VALIDATE, value);

      if (this.container.children.length === 2) {
        const validateElTemplate = document.createElement('template');
        validateElTemplate.innerHTML = `<div class="validation-message"></div>`;
        const [validateEl] = [...validateElTemplate.content.childNodes];
        this.container.appendChild(validateEl);
        this.input?.setValidationElement(validateEl);
      }
    } else {
      this.removeAttribute(attributes.VALIDATE);
      this.input.removeAttribute(attributes.VALIDATE);

      const validateEl = this.shadowRoot.querySelector('.validation-message');
      validateEl?.remove?.();
    }
  }

  /**
   * @returns {string} validation mode to use on input; if "required" then
   * displays a notice when no value was set.
   */
  get validate() { return this.getAttribute(attributes.VALIDATE); }

  /**
   * @param {boolean} value whether or not spinbox is readonly
   */
  set readonly(value) {
    if (stringToBool(value)) {
      this.container.classList.add('readonly');
      this.setAttribute(attributes.READONLY, true);
      this.input.setAttribute(attributes.READONLY, true);
      this.#onStepButtonUnpressed();
      this.#incrementButton.setAttribute(attributes.DISABLED, '');
      this.#decrementButton.setAttribute(attributes.DISABLED, '');
    } else {
      this.container.classList.remove('readonly');

      this.removeAttribute(attributes.READONLY);
      this.input.removeAttribute(attributes.READONLY);

      if (!this.hasAttribute(attributes.DISABLED)) {
        this.#incrementButton.removeAttribute(attributes.DISABLED);
        this.#decrementButton.removeAttribute(attributes.DISABLED);
      }
    }
  }

  /**
   * @returns {boolean} value whether or not spinbox is readonly
   */
  get readonly() {
    return this.getAttribute(attributes.READONLY);
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
   * callback to increment/decrement value by step
   * @type {Function}
   * @param {'up'|'down'} direction direction of step
   */
  #onStep(direction) {
    const hasValidStep = !Number.isNaN(parseInt(this.step));
    let step = hasValidStep
      ? parseInt(this.step)
      /* istanbul ignore next */
      : 1;

    if (direction === 'down') {
      step *= -1;
    }

    const hasValidValue = !Number.isNaN(parseInt(this.value));
    /* istanbul ignore next */
    this.value = (hasValidValue ? parseInt(this.value) : 0) + step;
  }

  /**
   * updates state of whether increment button is disabled
   * @type {Function}
   */
  #updateDisabledButtonStates() {
    // increment button

    const hasMaxValue = !Number.isNaN(parseInt(this.max));

    if (!hasMaxValue) {
      this.#incrementButton.removeAttribute(attributes.DISABLED);
      return;
    }

    if (parseInt(this.value) >= parseInt(this.max)) {
      this.#incrementButton?.setAttribute(attributes.DISABLED, '');
    } /* istanbul ignore else */ else if (!this.hasAttribute(attributes.READONLY)) {
      this.#incrementButton?.removeAttribute(attributes.DISABLED);
    }

    // decrement button

    const hasMinValue = !Number.isNaN(parseInt(this.min));

    if (!hasMinValue) {
      this.#decrementButton.removeAttribute(attributes.DISABLED);
      return;
    }

    if (parseInt(this.value) <= parseInt(this.min)) {
      this.#decrementButton.setAttribute(attributes.DISABLED, '');
    } /* istanbul ignore else */ else if (!this.hasAttribute(attributes.READONLY)) {
      this.#decrementButton.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * represents the direction a user is holding for
   * the spinbox; works to enable long press intervals
   *
   * @type {'up'|'down'|undefined}
   */
  #stepDirection;

  /**
   * stores a timeout related to value cycling
   */
  #stepCycleTimeout;

  /**
   * return a handler which begins incrementing/decrementing value in steps
   * @param {'up'|'down'} direction which direction to step towards
   * @returns {Function} callback which accepts mouse/touch event
   */
  #getStepButtonCycler(direction) {
    return (e) => {
      /* istanbul ignore else */
      if (0b001 /* Left Button Mask */ & e.buttons) {
        let tickCounter = 0;
        this.#stepDirection = direction;

        const timedLogic = () => {
          if (this.#stepDirection === direction) {
            this.#onStep(direction);
            tickCounter++;
            this.#stepCycleTimeout = setTimeout(
              timedLogic,
              Math.max(350 - Math.round(tickCounter * 50), 100)
            );
          } else {
            clearTimeout(timedLogic);
            this.#stepCycleTimeout = undefined;
          }
        };

        this.#stepCycleTimeout = timedLogic;
        this.#stepCycleTimeout();
      }
    };
  }

  /**
   * unbinds timers associated with value cycling
   * @param {*} e optional mouse event
   */
  #onStepButtonUnpressed(e) {
    /* istanbul ignore next */
    if (/* istanbul ignore next */ !e
    || (e.which === 1 && (this.#stepCycleTimeout || this.#stepDirection))
    ) {
      clearInterval(this.#stepCycleTimeout);
      this.#stepCycleTimeout = undefined;
      this.#stepDirection = undefined;
    }
  }
}
