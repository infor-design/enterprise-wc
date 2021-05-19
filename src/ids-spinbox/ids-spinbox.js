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
import styles from './ids-spinbox.scss';

/**
 * IDS Spinbox Component
 * @type {IdsSpinbox}
 * @inherits IdsElement
 */
@customElement('ids-spinbox')
@scss(styles)
class IdsSpinbox extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.MAX, props.MIN, props.VALUE];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    return (
      `<div class="ids-spinbox" tabindex="-1">
          <ids-button type="tertiary" disabled>-</ids-button>
          <ids-input text-align="center" value=${this.value}>
          </ids-input>
          <ids-button type="tertiary">+</ids-button>
      </div>`
    );
  }

  connectedCallback() {
    // attach a number mask to the input

    this.input = this.shadowRoot.querySelector('ids-input');
    this.input.mask = 'number';
    this.input.maskOptions = { allowDecimal: false };

    this.setAttribute('tabindex', 0);
    this.onEvent('click.decrement', this.children[0], () => {
      this.value = parseInt(this.value) - 1;
    });

    this.onEvent('click.increment', this.children[2], () => {
      this.value = parseInt(this.value) + 1;
    });
  }

  set max(value) {
    if (this.getAttribute(props.MAX !== value)) {
      this.setAttribute(props.MAX, value);
    }
  }

  get max() {
    return this.max;
  }

  set min(value) {
    if (this.getAttribute(props.MIN !== value)) {
      this.setAttribute(props.MIN, value);
    }
  }

  get min() {
    return this.min;
  }

  set value(value) {
    if (parseInt(this.getAttribute(props.VALUE) !== parseInt(value))) {
      this.setAttribute(props.VALUE, parseInt(value));
      this.children[1].value = value;
    }
  }

  get value() {
    return this.getAttribute(props.VALUE);
  }
}

export default IdsSpinbox;
