import {
  IdsElement,
  customElement,
  scss,
  attributes
} from '../../core';

import styles from './ids-layout-grid.scss';
import IdsLayoutGridCell from './ids-layout-grid-cell';

/**
 * IDS Layout Grid Component
 * @type {IdsLayoutGrid}
 * @inherits IdsElement
 */
@customElement('ids-layout-grid')
@scss(styles)
class IdsLayoutGrid extends IdsElement {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      attributes.AUTO,
      attributes.COLS,
      attributes.FIXED,
      attributes.GAP,
      attributes.NO_MARGINS,
      'min-col-width',
      attributes.ROWS
    ];
  }

  template() {
    return `<slot></slot>`;
  }

  /**
   * If true the grid is not responsive and stays equal width as will fit
   * @param {boolean | string | null} value true or false/nothing
   */
  set fixed(value) {
    if (value) {
      this.setAttribute(attributes.FIXED, value.toString());
      this.classList.add('ids-fixed');
      return;
    }

    this.removeAttribute(attributes.FIXED);
    this.classList.remove('ids-fixed');
  }

  get fixed() { return this.getAttribute(attributes.FIXED); }

  /**
   * Handle The Gap Setting
   * @returns {string} The Gap [none, sm, md, lg, xl]
   */
  get gap() { return this.getAttribute(attributes.GAP) || 'md'; }

  /**
   * Set the grid gap
   * @param {string} value The Gap [none, sm, md, lg, xl]
   */
  set gap(value) {
    if (value) {
      this.setAttribute(attributes.GAP, value);
      this.classList.add(`ids-layout-grid-gap-${value}`);
      return;
    }
    this.removeAttribute(attributes.GAP);
    this.classList.remove(`ids-layout-grid-gap-${value}`);
  }

  /**
   * Sets the grid to `auto-fit`
   * @param {boolean | string | null} value true or false/nothing
   */
  set auto(value) {
    if (value) {
      this.setAttribute(attributes.AUTO, value.toString());
      this.classList.add('ids-layout-grid-auto');
      return;
    }

    this.removeAttribute(attributes.AUTO);
    this.classList.remove('ids-layout-grid-auto');
  }

  get auto() { return this.getAttribute(attributes.AUTO); }

  /**
   * Sets the amount of columns in the grid
   * @param {string | null} value number of columns of the grid
   */
  set cols(value) {
    if (value) {
      this.setAttribute(attributes.COLS, value);
      this.style.setProperty('--grid-cols', value);
      this.classList.add(`ids-layout-grid-cols`);
      this.classList.remove('ids-layout-grid-auto');

      if (value === 'layout-grid') {
        this.setAttribute(attributes.COLS, value);
        this.classList.remove('ids-layout-grid-auto');
        this.classList.add('ids-layout-grid-system');
        this.classList.remove(`ids-layout-grid-cols`);
        this.style.removeProperty('--grid-cols');
      }
    }

    this.style.removeProperty('--grid-cols');
    this.removeAttribute(attributes.AUTO);
    this.classList.remove(`ids-layout-grid-cols`);
    this.classList.remove('ids-layout-grid-auto');
  }

  get cols() { return this.getAttribute(attributes.COLS); }

  /**
   * Sets the amount of rows in the grid. Works best with fixed height grids
   * @param {string | null} value number of rows in a fixed grid
   */
  set rows(value) {
    if (value) {
      this.auto = false;
      this.setAttribute(attributes.ROWS, value);
      this.style.setProperty('--grid-rows', value);
      this.classList.add(`ids-layout-grid-rows`);
      this.classList.remove('ids-layout-grid-auto');
      return;
    }

    this.style.removeProperty('--grid-rows');
    this.removeAttribute(attributes.AUTO);
    this.classList.remove(`ids-layout-grid-rows`);
  }

  get rows() { return this.getAttribute(attributes.ROWS); }

  /**
   * If true the grid will not have any margins
   * @param {boolean | string | null} value true or false/nothing
   */
  set noMargins(value) {
    if (value) {
      this.setAttribute(attributes.NO_MARGINS, value.toString());
      this.classList.add('ids-layout-grid-no-margins');
      return;
    }

    this.removeAttribute(attributes.NO_MARGINS);
    this.classList.remove('ids-layout-grid-no-margins');
  }

  get noMargins() { return this.getAttribute(attributes.NO_MARGINS); }

  /**
   * Sets the min col width on the grid
   * @param {string} value number for pixel length
   */
  set minColWidth(value) {
    if (value) {
      this.setAttribute('min-col-width', value.toString());
      this.style.setProperty('--grid-min-col-width', value);
      return;
    }

    this.removeAttribute('min-col-width');
    this.style.removeProperty('--grid-min-col-width');
  }

  get minColWidth() { return this.getAttribute('min-col-width'); }
}

export default IdsLayoutGrid;
