import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../ids-base/ids-element';
import IdsButton from '../ids-ππbutton/ids-button';
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
    return [];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    return (
      `<div class="ids-spinbox">
          <button part="button" class="ids-button btn-tertiary" tabindex="0" mode="light" version="new">
            <slot name="icon" part="icon"></slot>
            <slot name="text">-</slot>
          </button>
          <ids-input label="First Name"></ids-input>
          <button part="button" class="ids-button btn-tertiary" tabindex="0" mode="light" version="new">
            <slot name="icon" part="icon"></slot>
            <slot name="text">+</slot>
          </button>
      </div>`
    );
  }

  connectedCallback() {
    // attach a number mask to the input

    this.input = this.shadowRoot.querySelector('ids-input');
    this.input.mask = 'number';
    this.input.maskOptions = { allowDecimal: false };
  }

  set maximum(value) {

  }
}

export default IdsSpinbox;
