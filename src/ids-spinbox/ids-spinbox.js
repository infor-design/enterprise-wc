import {
  IdsElement,
  customElement,
  scss,
  props,
  mix
} from '../ids-base/ids-element';
import IdsButton from '../ids-button/ids-button';
import IdsInput from '../ids-input/ids-input';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import styles from './ids-spinbox.scss';

/**
 * IDS Spinbox Component
 * @type {IdsSpinbox}
 * @inherits IdsElement
 */
@customElement('ids-spinbox')
@scss(styles)
class IdsSpinbox extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.MAX, props.MIN, props.STEP, props.VALUE];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    return (
      `<div class="ids-spinbox">
          <ids-button type="tertiary" tabindex="-1">-</ids-button>
          <ids-input text-align="center" value=${this.value}>
          </ids-input>
          <ids-button type="tertiary" tabindex="-1">+</ids-button>
      </div>`
    );
  }

  connectedCallback() {
    // attach a number mask to the input

    this.input = this.shadowRoot.querySelector('ids-input');
    this.input.mask = 'number';
    this.input.maskOptions = {
      allowDecimal: false,
      allowNegative: true
    };

    this.setAttribute('tabindex', 0);
    this.onEvent('click.decrement', this.container.children[0], () => {
      this.#onDecrement();
    });

    this.onEvent('click.increment', this.container.children[2], () => {
      this.#onIncrement();
    });

    this.listen(['ArrowUp', 'ArrowDown'], this.input, (e) => {
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

    return this;
  }

  set max(value) {
    if (value === '') {
      return;
    }

    if (this.getAttribute(props.MAX !== value)) {
      this.setAttribute(props.MAX, value);
    }
  }

  get max() {
    return this.getAttribute(props.MAX);
  }

  set min(value) {
    if (this.getAttribute(props.MIN !== value)) {
      this.setAttribute(props.MIN, value);
    }
  }

  get min() {
    return this.getAttribute(props.MIN);
  }

  set value(value) {
    if (parseInt(this.getAttribute(props.VALUE)) !== parseInt(value)) {
      let nextValue = parseInt(value);
      if (!Number.isNaN(parseInt(this.min))) {
        nextValue = Math.max(nextValue, parseInt(this.min));
      }

      if (!Number.isNaN(parseInt(this.max))) {
        nextValue = Math.min(nextValue, parseInt(this.max));
      }

      this.setAttribute(props.VALUE, nextValue);
      this.input.value = nextValue;
    }
  }

  get value() {
    return this.getAttribute(props.VALUE);
  }

  #onIncrement() {
    this.value = parseInt(this.value) + (this.step || 1);
  }

  #onDecrement() {
    this.value = parseInt(this.value) - (this.step || 1);
  }
}

export default IdsSpinbox;
