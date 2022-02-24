import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-checkbox-group-base';

import styles from './ids-checkbox-group.scss';

/**
 * IDS Checkbox Group Component
 * @type {IdsCheckboxGroup}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part checkbox-group - the checkbox-group element
 */
@customElement('ids-checkbox-group')
@scss(styles)
export default class IdsCheckboxGroup extends Base {
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
      attributes.LABEL,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template() {
    return `
      <div class="ids-checkbox-group" part="checkbox-group">
        <ids-text font-size="16" type="span">${this.label}</ids-text>
        <slot></slot>
      </div>
    `;
  }

  /**
   * Return the label of checkbox-group
   * @returns {string} label
   */
  get label() { return this.getAttribute('label') || ''; }

  /**
   * Set the label of checkbox-group
   * @param {string} value label
   */
  set label(value) {
    if (value) {
      this.setAttribute('label', value.toString());
    } else {
      this.removeAttribute('label');
    }
    this.container.querySelector('ids-text').innerHTML = value;
  }
}
