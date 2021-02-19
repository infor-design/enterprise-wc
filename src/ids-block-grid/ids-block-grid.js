import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
// @ts-ignore
import styles from './ids-block-grid.scss';

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
   * @returns {string} The path data
   */
  get align() { return this.getAttribute(props.ALIGN); }

  /**
   * Set the alignment of blockgrid
   * @param {string} value The Blockgrid Alignment
   */
  set align(value) {
    if (value) {
      this.setAttribute(props.ALIGN, value);
      this.style.textAlign = value === 'centered' ? 'center' : `${value}`;
    } else {
      this.removeAttribute(props.ALIGN);
      this.style.removeProperty('text-align');
    }
  }
}

export default IdsBlockgrid;
