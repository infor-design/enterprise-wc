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
      attributes.MIN_COL_WIDTH,
      attributes.ROWS,
    ];
  }

  autoGridClass = `ids-layout-grid-auto`;

  colsGridClass = `ids-layout-grid-cols`;

  gridSystemClass = `ids-layout-grid-system`;

  gridSystemXlClass = `ids-layout-grid-system-xl`

  rowsClass = `ids-layout-grid-rows`;

  noMarginsClass = `ids-layout-grid-no-margins`;

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
      this.classList.add(this.autoGridClass);
      return;
    }

    this.removeAttribute(attributes.AUTO);
    this.classList.remove(this.autoGridClass);
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
      this.classList.add(this.colsGridClass);
      this.classList.remove(this.autoGridClass);
    }

    if (value === 'layout-grid') {
      this.setAttribute(attributes.COLS, value);
      this.classList.remove(this.colsGridClass);
      this.classList.add(this.gridSystemClass);
      this.style.removeProperty('--grid-cols');
    }

    if (value === 'layout-grid-xl') {
      this.setAttribute(attributes.COLS, value);
      this.classList.remove(this.colsGridClass);
      this.classList.add(this.gridSystemClass);
      this.classList.add(this.gridSystemXlClass);
      this.style.removeProperty('--grid-cols');
    }

    this.removeAttribute(attributes.AUTO);
    this.classList.remove(this.autoGridClass);
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
      this.classList.add(this.rowsClass);
      this.classList.remove(this.autoGridClass);
      return;
    }

    this.style.removeProperty('--grid-rows');
    this.removeAttribute(attributes.AUTO);
    this.classList.remove(this.rowsClass);
  }

  get rows() { return this.getAttribute(attributes.ROWS); }

  /**
   * If true the grid will not have any margins
   * @param {boolean | string | null} value true or false/nothing
   */
  set noMargins(value) {
    if (value) {
      this.setAttribute(attributes.NO_MARGINS, value.toString());
      this.classList.add(this.noMarginsClass);
      return;
    }

    this.removeAttribute(attributes.NO_MARGINS);
    this.classList.remove(this.noMarginsClass);
  }

  get noMargins() { return this.getAttribute(attributes.NO_MARGINS); }

  /**
   * Sets the min col width on the grid
   * @param {string} value number for pixel length
   */
  set minColWidth(value) {
    if (value) {
      this.setAttribute(attributes.MIN_COL_WIDTH, value.toString());
      this.style.setProperty('--grid-min-col-width', value);
      return;
    }

    this.removeAttribute(attributes.MIN_COL_WIDTH);
    this.style.removeProperty('--grid-min-col-width');
  }

  get minColWidth() { return this.getAttribute(attributes.MIN_COL_WIDTH); }
}

export default IdsLayoutGrid;
