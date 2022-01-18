import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-block-grid-base';

import styles from './ids-block-grid.scss';

/**
 * IDS Block Grid Component
 * @type {IdsBlockgrid}
 * @inherits IdsElement
 */
@customElement('ids-block-grid')
@scss(styles)
export default class IdsBlockgrid extends Base {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      attributes.ALIGN,
      attributes.SELECTION,
    ];
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

  /**
   * Set the selection to a block-grid and it will add selection to all items
   * @param {string} value The selection value
   */
  set selection(value) {
    this.syncSelectionOnItems();
  }

  get selection() {
    return this.getAttribute(attributes.SELECTION);
  }

  /**
   * Add selection value to all block-grid-items
   */
  syncSelectionOnItems() {
    this.querySelectorAll('ids-block-grid-item').forEach((item) => item.setAttribute(attributes.SELECTION, this.selection));
  }
}
