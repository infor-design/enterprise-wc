import {
  IdsElement,
  customElement,
  scss
} from '../ids-base';
import { props } from '../ids-base/ids-constants';
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

  static get properties() {
    return [props.ALIGN];
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
  get align() { return this.getAttribute(props.ALIGN); }

  /**
   * Set the alignment of blockgrid
   * @param {string|null} value The Blockgrid Alignment
   */
  set align(value) {
    if (value) {
      this.setAttribute(props.ALIGN, value);
      this.style.textAlign = `${value}`;
    } else {
      this.removeAttribute(props.ALIGN);
      this.style.removeProperty('text-align');
    }
  }
}

export default IdsBlockgrid;
