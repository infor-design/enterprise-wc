import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import Base from './ids-spinbox-base';
import styles from './ids-spinbox.scss';

/**
 * used for assigning ids
 */
let instanceCounter = 0;

/**
 * IDS Spinbox Component
 * @type {IdsSpinbox}
 * @inherits IdsTriggerField
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsValidationMixin
 * @part container the overall container of the spinbox
 * @part button increment/decrement button
 * @part input input containing value/placeholder
 * @part label label text above the input
 * @part validation validation message when there is an error
 */
@customElement('ids-spinbox')
@scss(styles)
export default class IdsSpinbox extends Base {
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
    this.templateHostAttributes();
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
            ></input>
          <slot name="trigger-end"></slot>
        </div>
      </div>`
    );
  }

  templateHostAttributes() {
    if (!this.id) {
      this.setAttribute(attributes.ID, `ids-spinbox-${++instanceCounter}`);
    }
  }

  rendered() {
    this.#updateDisabledButtonStates();
  }

  #appendTriggerButtons() {
    const startBtn = this.querySelector('[slot="trigger-start"]');
    if (!startBtn) {
      this.insertAdjacentHTML('afterbegin', `<ids-trigger-button
        id="${this.id}-decrement-btn"
        inline
        no-padding
        slot="trigger-start"
        tabbable="false"
        part="button"> - </ids-trigger-button>`);
    }

    const endBtn = this.querySelector('[slot="trigger-end"]');
    if (!endBtn) {
      this.insertAdjacentHTML('beforeend', `<ids-trigger-button
        id="${this.id}-increment-btn"
        inline
        no-padding
        slot="trigger-end"
        tabbable="false"
        part="button"> + </ids-trigger-button>`);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    // Set Spinbox attributes
    this.setAttribute('role', 'spinbutton');
    this.setAttribute('aria-valuenow', this.value);
    if (stringToBool(this.getAttribute(attributes.MAX))) {
      this.setAttribute('aria-valuemax', this.max);
    }
    if (stringToBool(this.getAttribute(attributes.MIN))) {
      this.setAttribute('aria-valuemin', this.min);
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

    this.#configureMask();
    this.#attachEventHandlers();
  }

  /**
   * Sets up all internal event handling
   * @returns {void}
   */
  #attachEventHandlers() {
    this.input.addEventListener('change', () => {
      if (this.input.value !== this.value) {
        this.value = this.input.value;
        this.#onStepButtonUnpressed();
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

    this.onEvent('mouseup', window, (e) => {
      this.#onStepButtonUnpressed(e);
    });

    this.onEvent('focus', this, (e) => {
      const isDisabled = this.hasAttribute(attributes.DISABLED);
      if (!isDisabled) {
        e.preventDefault();
        this.focus();
      }
    });

    this.listen(['ArrowUp', 'ArrowDown'], this, (e) => {
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
   * @returns {IdsTriggerButton} reference to the decrementing button
   */
  get decrementButton() {
    return this.querySelector('ids-trigger-button[slot="trigger-start"]');
  }

  /**
   * @returns {IdsTriggerButton} reference to the incrementing button
   */
  get incrementButton() {
    return this.querySelector('ids-trigger-button[slot="trigger-end"]');
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
   * Override tabbable to simplify and ignore trigger buttons (never should be tabbable)
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = stringToBool(value);
    this.setAttribute(attributes.TABBABLE, isTabbable);
  }

  /**
   * @returns {boolean} true if the component is tabbable
   */
  get tabbable() {
    return stringToBool(this.getAttribute(attributes.TABBABLE));
  }

  /**
   * @param {number | string} value spinbox' input value
   */
  set value(value) {
    if (super.value !== parseInt(value)) {
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

      super.value = nextValue;

      // set properties/updaters
      this.setAttribute('aria-valuenow', nextValue);
      this.#updateDisabledButtonStates();
    }
  }

  /**
   * @returns {number | string} spinbox' current input value
   */
  get value() {
    return super.value;
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
  #onStep(direction) {
    const hasValidStep = !Number.isNaN(parseInt(this.step));
    let step = hasValidStep
      ? parseInt(this.step)
      : 1;

    if (direction === 'down') {
      step *= -1;
    }

    const hasValidValue = !Number.isNaN(parseInt(this.value));
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
      this.incrementButton?.removeAttribute(attributes.DISABLED);
      return;
    }

    if (parseInt(this.value) >= parseInt(this.max)) {
      this.incrementButton?.setAttribute(attributes.DISABLED, '');
    } else if (!this.hasAttribute(attributes.READONLY)) {
      this.incrementButton?.removeAttribute(attributes.DISABLED);
    }

    // decrement button
    const hasMinValue = !Number.isNaN(parseInt(this.min));
    if (!hasMinValue) {
      this.decrementButton?.removeAttribute(attributes.DISABLED);
      return;
    }

    if (parseInt(this.value) <= parseInt(this.min)) {
      this.decrementButton?.setAttribute(attributes.DISABLED, '');
    } else if (!this.hasAttribute(attributes.READONLY)) {
      this.decrementButton?.removeAttribute(attributes.DISABLED);
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
  #configureMask() {
    const maskOpts = {
      allowDecimal: false,
      allowNegative: true
    };
    if (this.max) {
      maskOpts.integerLimit = this.max.toString().length;
    }

    this.mask = 'number';
    this.maskOptions = maskOpts;
  }
}
