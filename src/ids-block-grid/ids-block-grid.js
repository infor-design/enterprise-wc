import {
  IdsElement,
  customElement,
  scss
} from '../ids-base';
import { attributes } from '../ids-base/ids-attributes';
import styles from './ids-block-grid.scss';

/**
 * IDS Block Grid Component
 * @type {IdsBlockgrid}
 * @inherits IdsElement
 */
@customElement('ids-block-grid')
@scss(styles)
class IdsBlockgrid extends IdsElement {
  constructor() {
    super();
  }

  static get attributes() {
    return [attributes.ALIGN];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template() {
    return `<slot></slot>`;
  }

  /**
   * Return the alignment of blockgrid
   * @returns {string|null} The path data
   */
  get align() { return this.getAttribute(attributes.ALIGN); }

  /**
   * Set the alignment of blockgrid
   * @param {string|null} value The Blockgrid Alignment
   */
  set align(value) {
    if (value) {
      this.setAttribute(attributes.ALIGN, value);
      this.style.textAlign = `${value}`;
    } else {
      this.removeAttribute(attributes.ALIGN);
      this.style.removeProperty('text-align');
    }
  }
}

export default IdsBlockgrid;
