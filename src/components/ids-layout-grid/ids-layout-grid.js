import {
  IdsElement,
  customElement,
  scss,
  attributes
} from '../../core';

import styles from './ids-layout-grid.scss';
import IdsLayoutGridCell from './ids-layout-grid-cell';

// Class vars
const fluidGridClass = `ids-layout-fluid-grid`;
const fluidGridXlClass = `ids-layout-fluid-grid-xl`;
const autoGridClass = `ids-layout-grid-auto`;
const colsGridClass = `ids-layout-grid-cols`;
const rowsClass = `ids-layout-grid-rows`;
const noMarginsClass = `ids-layout-grid-no-margins`;

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

  connectedCallback() {
    this.#setDefaults();
  }

  template() {
    return `<slot></slot>`;
  }

  /**
   * Sets the default attributes and classes
   * @private
   * @returns {void}
   */
  #setDefaults() {
    if (this.cols === null) {
      this.setAttribute(attributes.COLS, 'fluid-grid');
      this.classList.remove(colsGridClass);
      this.classList.add(fluidGridClass);
      this.style.removeProperty('--grid-cols');
    }
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
      this.classList.add(autoGridClass);
      this.classList.remove(fluidGridClass);
      this.removeAttribute(attributes.COLS);
      return;
    }

    this.removeAttribute(attributes.AUTO);
    this.classList.remove(autoGridClass);
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
      this.classList.add(colsGridClass);
      this.classList.remove(autoGridClass);
      this.classList.remove(fluidGridClass);
    }

    if (value === 'fluid-grid') {
      this.setAttribute(attributes.COLS, value);
      this.classList.remove(colsGridClass);
      this.classList.add(fluidGridClass);
      this.style.removeProperty('--grid-cols');
      this.removeAttribute(attributes.AUTO);
      this.classList.remove(autoGridClass);
    }

    if (value === 'fluid-grid-xl') {
      this.setAttribute(attributes.COLS, value);
      this.classList.remove(colsGridClass);
      this.classList.add(fluidGridClass);
      this.classList.add(fluidGridXlClass);
      this.style.removeProperty('--grid-cols');
      this.removeAttribute(attributes.AUTO);
      this.classList.remove(autoGridClass);
    }
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
      this.classList.add(rowsClass);
      this.classList.remove(autoGridClass);
      return;
    }

    this.style.removeProperty('--grid-rows');
    this.removeAttribute(attributes.AUTO);
    this.classList.remove(rowsClass);
  }

  get rows() { return this.getAttribute(attributes.ROWS); }

  /**
   * If true the grid will not have any margins
   * @param {boolean | string | null} value true or false/nothing
   */
  set noMargins(value) {
    if (value) {
      this.setAttribute(attributes.NO_MARGINS, value.toString());
      this.classList.add(noMarginsClass);
      return;
    }

    this.removeAttribute(attributes.NO_MARGINS);
    this.classList.remove(noMarginsClass);
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
