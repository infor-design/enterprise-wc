import {
  IdsElement,
  customElement,
  scss,
  attributes
} from '../ids-base';

import styles from './ids-summary-form.scss';

/**
 * IDS Summary Form Component
 * @type {IdsSummaryForm}
 * @inherits IdsElement
 * @scss styles 
 */
@customElement('ids-summary-form')
@scss(styles)
class IdsSummaryForm extends IdsElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.DATA,
      attributes.FONT_WEIGHT,
      attributes.LABEL,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-summary-form">
        <ids-text label="true" class="label">${this.label ?? ''}</ids-text>
        <ids-text data="true" class="data" font-weight="${this.fontWeight ?? 'bold'}">${this.data ?? ''}</ids-text>
      </div>`;
  }

  /**
   * Set the data field
   * @param {string} value The contents of the data
   */
  set data(value) {
    this.setAttribute(attributes.VALUE, value || '');
    this.#updateData();
  }

  get data() {
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * Set the label field
   * @param {string} value The name for the label
   */
  set label(value) {
    this.setAttribute(attributes.LABEL, value || '');
    this.#updateLabel();
  }

  get label() {
    return this.getAttribute(attributes.LABEL);
  }

  /**
   * Sets the font-weight of the data field
   * The default is bold
   * It can be explicitly disabled by setting the font-weight to an empty string ''
   * @param {string} value The attribute value for font-weight of the data field
   */
  set fontWeight(value) {
    this.setAttribute(attributes.FONT_WEIGHT, value);
    this.#updateFontWeight();
  }

  get fontWeight() {
    return this.getAttribute(attributes.FONT_WEIGHT);
  }

  /**
   * Updates the UI when the font-weight is set
   * @private
   */
  #updateFontWeight() {
    this.container.querySelector('.data').setAttribute('font-weight', this.fontWeight);
  }

  /**
   * Updates the UI when the label is set
   * @private
   */
  #updateLabel() {
    this.container.querySelector('.label').innerHTML = this.label;
  }

  /**
   * Updates the UI when the data is set
   * @private
   */
  #updateData() {
    this.container.querySelector('.data').innerHTML = this.data;
  }
}

export default IdsSummaryForm;
