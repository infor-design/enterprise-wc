import {
  IdsElement,
  customElement,
  scss,
  attributes
} from '../ids-base';

import styles from './ids-summary-field.scss';

/**
 * IDS Summary Field Component
 * @type {IdsSummaryField}
 * @inherits IdsElement
 */
@customElement('ids-summary-field')
@scss(styles)
class IdsSummaryField extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.DATA,
      attributes.LABEL,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-summary-field">
        <ids-text label="true" class="label">${this.label ?? ''}</ids-text>
        <ids-text data="true" class="data" font-weight="bold">${this.data ?? ''}</ids-text>
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

export default IdsSummaryField;
