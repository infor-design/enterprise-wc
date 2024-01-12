import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import '../ids-trigger-field/ids-trigger-button';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';

import styles from './ids-spinbox.scss';

const MOUSE_LEFT = 0b001;

/**
 * IDS Spinbox Component
 * @type {IdsSpinbox}
 * @inherits IdsTriggerField
 * @part container the overall container of the spinbox
 * @part button increment/decrement button
 * @part input input containing value/placeholder
 * @part label label text above the input
 * @part validation validation message when there is an error
 */
@customElement('ids-spinbox')
@scss(styles)
export default class IdsSpinbox extends IdsTriggerField {
  constructor() {
    super();
  }

  isFormComponent = true;

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.MASK,
      attributes.MAX,
      attributes.MIN,
      attributes.STEP,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
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
      `<div id="ids-spinbox" class="ids-spinbox ids-trigger-field ${containerClass}" part="container">
        ${labelHtml}
        <div class="field-container" part="field-container">
          <slot name="trigger-start"></slot>
          <input
            part="input"
            id="${this.id}-input"
            ${type}${inputClass}${placeholder}${inputState}
            ${ariaLabel}
            ${value}
            mask="number"
            ></input>
          <slot name="trigger-end"></slot>
        </div>
      </div>`
    );
  }

  #appendTriggerButtons() {
    const startBtn = this.querySelector('[slot="trigger-start"]');
    if (!startBtn) {
      this.insertAdjacentHTML('afterbegin', `<ids-trigger-button
        id="decrement-btn"
        inline
        no-padding
        square
        slot="trigger-start"
        tabbable="false"
        part="button"> - </ids-trigger-button>`);
    }

    const endBtn = this.querySelector('[slot="trigger-end"]');
    if (!endBtn) {
      this.insertAdjacentHTML('beforeend', `<ids-trigger-button
        id="increment-btn"
        inline
        no-padding
        square
        slot="trigger-end"
        tabbable="false"
        part="button"> + </ids-trigger-button>`);
    }
  }

  triggerField: IdsTriggerField | undefined | null;

  connectedCallback() {
    super.connectedCallback();

    // Set Spinbox ARIA Attributes
    this.setAttribute(htmlAttributes.ROLE, 'spinbutton');

    // NOTE: aXe requires `aria-label` on all fields with other aria attributes
    // like `aria-valuenow` that cause it to be interpreted as an "aria input field"
    // See https://dequeuniversity.com/rules/axe/4.3/aria-input-field-name
    this.setAttribute(htmlAttributes.ARIA_VALUENOW, this.value);
    this.setAttribute(htmlAttributes.ARIA_LABEL, this.label);

    if (stringToBool(this.getAttribute(attributes.MAX))) {
      this.setAttribute(htmlAttributes.ARIA_VALUEMAX, String(this.max));
    }
    if (stringToBool(this.getAttribute(attributes.MIN))) {
      this.setAttribute(htmlAttributes.ARIA_VALUEMIN, String(this.min));
    }

    // Add slotted elements BEFORE size/tab adjustments
    this.#appendTriggerButtons();

    // Adjust some defaults of IdsInput/IdsTriggerField if they aren't specified
    if (!stringToBool(this.getAttribute(attributes.TABBABLE))) {
      this.tabbable = false;
    }
    if (!stringToBool(this.getAttribute(attributes.SIZE))) {
      this.size = 'sm';
    }
    if (!this.hasAttribute('text-align')) {
      this.textAlign = 'center';
    }

    this.#applyMask();
    this.#attachEventHandlers();
    this.#updateDisabledButtonStates();
  }

  /**
   * Sets up all internal event handling
   * @returns {void}
   */
  #attachEventHandlers() {
    this.input?.addEventListener('change', () => {
      if (this.input && this.input.value !== this.value) {
        this.value = this.input.value;
        this.#onStepButtonUnpressed();
      }
    });

    this.input?.addEventListener('blur', () => {
      if (this.input && this.input.value === '-') {
        this.value = '';
      }
      if (this.max && this.input && parseInt(this.input.value) > this.max) {
        this.value = this.max.toString();
        return;
      }
      if (this.min && this.input && parseInt(this.input.value) < this.min) {
        this.value = this.min.toString();
      }
    });

    this.onEvent(
      'mousedown.increment',
      this.incrementButton,
      this.#getStepButtonCycler('up')
    );

    this.onEvent(
      'mousedown.decrement',
      this.decrementButton,
      this.#getStepButtonCycler('down')
    );

    this.onEvent('mouseup', window, (e: MouseEvent) => {
      this.#onStepButtonUnpressed(e);
    });

    this.onEvent('focus', this, (e: Event) => {
      const isDisabled = this.hasAttribute(attributes.DISABLED);
      if (!isDisabled) {
        e.preventDefault();
        this.focus();
      }
    });

    this.listen(['ArrowUp', 'ArrowDown'], this, (e: KeyboardEvent) => {
      if (stringToBool(this.getAttribute(attributes.DISABLED))) { return; }
      const key = e.key;

      this.#onStepButtonUnpressed();

      switch (key) {
        case 'ArrowUp':
          this.#onStep('up');
          break;
        case 'ArrowDown':
          this.#onStep('down');
          break;
        default:
      }

      e.preventDefault();
    });
  }

  /**
   * @returns {HTMLElement} reference to the decrementing button
   */
  get decrementButton() {
    return this.querySelector('ids-trigger-button[slot="trigger-start"]');
  }

  /**
   * @returns {HTMLElement} reference to the incrementing button
   */
  get incrementButton() {
    return this.querySelector('ids-trigger-button[slot="trigger-end"]');
  }

  /**
   * @param {number|null} newValue maximum value of the spinbox
   */
  set max(newValue) {
    const currentValue = this.getAttribute(attributes.MAX);
    if (currentValue !== newValue) {
      const numberValue = parseInt(newValue as any);
      if (Number.isNaN(numberValue)) {
        this.removeAttribute(attributes.MAX);
        this.removeAttribute(htmlAttributes.ARIA_VALUEMAX);
      } else {
        this.setAttribute(attributes.MAX, `${numberValue}`);
        this.setAttribute(htmlAttributes.ARIA_VALUEMAX, `${numberValue}`);
      }
      this.#applyMask();
      this.#updateDisabledButtonStates();
    }
  }

  /**
   * @returns {number|null} the current max value of the spinbox' input
   */
  get max() {
    return this.hasAttribute(attributes.MAX)
      ? parseInt(this.getAttribute(attributes.MAX) as string)
      : null;
  }

  /**
   * @param {number|null} newValue minimum value aof the spinbox
   */
  set min(newValue) {
    const currentValue = this.getAttribute(attributes.MIN);
    if (currentValue !== newValue) {
      const numberValue = parseInt(newValue as any);
      if (Number.isNaN(numberValue)) {
        this.removeAttribute(attributes.MIN);
        this.removeAttribute(htmlAttributes.ARIA_VALUEMIN);
      } else {
        this.setAttribute(attributes.MIN, `${numberValue}`);
        this.setAttribute(htmlAttributes.ARIA_VALUEMIN, `${numberValue}`);
      }

      this.#updateDisabledButtonStates();
    }
  }

  /**
   * @returns {number|null} the current min value of the spinbox' input
   */
  get min() {
    return this.hasAttribute(attributes.MIN)
      ? parseInt(this.getAttribute(attributes.MIN) as string)
      : null;
  }

  /**
   * @param {number|null} newValue step value on which the spinbox should count increments/decrements
   */
  set step(newValue: number | string | null) {
    const currentValue = this.getAttribute(attributes.STEP);
    if (currentValue !== newValue) {
      let numberValue = parseInt(newValue as any);
      if (Number.isNaN(numberValue) || numberValue < 1) {
        numberValue = 1;
      }

      this.setAttribute(attributes.STEP, `${numberValue}`);
      this.#updateDisabledButtonStates();
    }
  }

  /**
   * @returns {number | string} step value on which the spinbox will count increments/decrements
   */
  get step(): number {
    return this.hasAttribute(attributes.STEP)
      ? parseInt(this.getAttribute(attributes.STEP) as string)
      : 1;
  }

  /**
   * Override tabbable to simplify and ignore trigger buttons (never should be tabbable)
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = stringToBool(value);
    this.setAttribute(attributes.TABBABLE, String(isTabbable));
  }

  /**
   * @returns {boolean} true if the component is tabbable
   */
  get tabbable() {
    return stringToBool(this.getAttribute(attributes.TABBABLE));
  }

  /**
   * @param {string} value spinbox' input value
   */
  set value(value) {
    if (this.input && (`${value}`.trim() === '-' || value === '')) {
      this.input.value = `${value}`.trim();
      return;
    }

    const wasEmpty = super.value === '';
    const safeValue = `${parseInt(value)}`;

    if (safeValue !== 'NaN' && super.value !== safeValue) {
      super.value = this.#setValueWithinLimits(safeValue);

      // set properties/updaters
      this.setAttribute(htmlAttributes.ARIA_VALUENOW, super.value);
      this.#updateDisabledButtonStates();
      if (wasEmpty && !!this.validate) this.checkValidation();
    }
  }

  /**
   * @returns {string} spinbox' current input value
   */
  get value() {
    return super.value;
  }

  /**
   * Takes an incoming value and "corrects" it to match multiples of the step value,
   * as well as remain within the min/max boundaries, if defined
   * @param {number | string} value the incoming value
   * @returns {string} the corrected value, if applicable
   */
  #setValueWithinLimits(value: number | string) {
    let nextValue: any = parseInt(value as any);
    if (!Number.isNaN(nextValue)) {
      // corrections on value if not in-range
      const min: any = this.min;
      const max: any = this.max;
      const hasMinValue = typeof this.min === 'number' && !Number.isNaN(this.min);
      const hasMaxValue = typeof this.max === 'number' && this.max && !Number.isNaN(this.max);
      const lessThanMin = hasMinValue && nextValue < min;
      const greaterThanMax = hasMaxValue && nextValue > max;
      const isEqualToLimits = (hasMaxValue && nextValue === max) || (hasMinValue && nextValue === min);

      if (lessThanMin) nextValue = Math.max(nextValue, min as any);
      if (greaterThanMax) nextValue = Math.min(nextValue, max as any);

      // Change trigger button states if a limit is met
      if (isEqualToLimits) this.#onStepButtonUnpressed();

      // IdsInput stores its value as a string
      nextValue = `${nextValue}`;
    }

    return nextValue;
  }

  /**
   * @param {boolean|string} value whether or not spinbox
   * interaction is disabled
   */
  set disabled(value) {
    const isValueTruthy = stringToBool(value);
    super.disabled = isValueTruthy;

    if (isValueTruthy) {
      this.incrementButton?.setAttribute?.(attributes.DISABLED, '');
      this.decrementButton?.setAttribute?.(attributes.DISABLED, '');
    } else if (!this.hasAttribute(attributes.READONLY)) {
      this.incrementButton?.removeAttribute?.(attributes.DISABLED);
      this.decrementButton?.removeAttribute?.(attributes.DISABLED);
    }
  }

  /**
   * @returns {'true'|null} whether or not element is disabled
   */
  get disabled() {
    return super.disabled;
  }

  /**
   * @param {boolean} value whether or not spinbox is readonly
   */
  set readonly(value) {
    const isValueTruthy = stringToBool(value);
    super.readonly = isValueTruthy;

    if (isValueTruthy) {
      this.#onStepButtonUnpressed();
      this.incrementButton?.setAttribute(attributes.DISABLED, '');
      this.decrementButton?.setAttribute(attributes.DISABLED, '');
    } else if (!this.hasAttribute(attributes.DISABLED)) {
      this.incrementButton?.removeAttribute(attributes.DISABLED);
      this.decrementButton?.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * @returns {boolean} value whether or not spinbox is readonly
   */
  get readonly() {
    return super.readonly;
  }

  /**
   * callback to increment/decrement value by step
   * @type {Function}
   * @param {'up'|'down'} direction direction of step
   */
  #onStep(direction: any) {
    const hasValidStep = !Number.isNaN(parseInt(this.step as any));
    let step = hasValidStep
      ? parseInt(this.step as any)
      : 1;

    if (direction === 'down') {
      step *= -1;
    }

    if (direction === 'down' && parseInt(this.value) === this.min) {
      return;
    }

    if (direction === 'up' && parseInt(this.value) === this.max) {
      return;
    }

    const hasValidValue = !Number.isNaN(parseInt(this.value));
    this.value = `${(hasValidValue ? parseInt(this.value) : 0) + step}`;
  }

  /**
   * updates state of whether increment button is disabled
   * @type {Function}
   */
  #updateDisabledButtonStates() {
    // increment button
    const hasMaxValue = !Number.isNaN(parseInt(this.max as any));
    if (!hasMaxValue) {
      this.incrementButton?.removeAttribute(attributes.DISABLED);
      return;
    }

    if (parseInt(this.value) >= parseInt(this.max as any)) {
      this.incrementButton?.setAttribute(attributes.DISABLED, '');
    } else if (!this.hasAttribute(attributes.READONLY)) {
      this.incrementButton?.removeAttribute(attributes.DISABLED);
    }

    // decrement button
    const hasMinValue = !Number.isNaN(parseInt(this.min as any));
    if (!hasMinValue) {
      this.decrementButton?.removeAttribute(attributes.DISABLED);
      return;
    }

    if (parseInt(this.value) <= parseInt(this.min as any)) {
      this.decrementButton?.setAttribute(attributes.DISABLED, '');
    } else if (!this.hasAttribute(attributes.READONLY)) {
      this.decrementButton?.removeAttribute(attributes.DISABLED);
    }

    if (this.disabled) {
      this.incrementButton?.setAttribute(attributes.DISABLED, '');
      this.decrementButton?.setAttribute(attributes.DISABLED, '');
    }
  }

  /**
   * represents the direction a user is holding for
   * the spinbox; works to enable long press intervals
   * @type {'up'|'down'|undefined}
   */
  #stepDirection: any;

  /**
   * stores a timeout related to value cycling
   */
  #stepCycleTimeout: any;

  /**
   * return a handler which begins incrementing/decrementing value in steps
   * @param {'up'|'down'} direction which direction to step towards
   * @returns {Function} callback which accepts mouse/touch event
   */
  #getStepButtonCycler(direction: any) {
    return (e: any) => {
      // eslint-disable-next-line no-bitwise
      if (MOUSE_LEFT & e.buttons) {
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
            clearTimeout(timedLogic as any);
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
  #onStepButtonUnpressed(e?: MouseEvent) {
    if (!e
    || (e.which === 1 && (this.#stepCycleTimeout || this.#stepDirection))
    ) {
      clearInterval(this.#stepCycleTimeout);
      this.#stepCycleTimeout = undefined;
      this.#stepDirection = undefined;
    }
  }

  /**
   * Configure the IdsMask settings
   */
  #applyMask() {
    const canBeNegative = this.min === null || (this.min < 0);
    const maskOpts = {
      allowDecimal: false,
      allowNegative: canBeNegative,
      integerLimit: (this.min === null || this.max == null)
        ? null : Math.max(Math.abs(this.min).toString().length, Math.abs(this.max).toString().length)
    };
    this.mask = 'number';
    this.maskOptions = maskOpts;
  }
}
