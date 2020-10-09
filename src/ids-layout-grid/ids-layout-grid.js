import {
  IdsElement,
  customElement,
  version,
  scss
} from '../ids-base/ids-element';
import { mixin } from '../ids-base/ids-decorators';
import styles from './ids-layout-grid.scss';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { props } from '../ids-base/ids-constants';

/**
 * IDS Layout Component
 */
@customElement('ids-layout-grid')
@scss(styles)
@mixin(IdsStringUtilsMixin)
class IdsLayoutGrid extends IdsElement {
  constructor() {
    super();
  }

  static get properties() {
    return [
      props.GRID_FIXED,
      props.GRID_GAP,
      props.GRID_AUTO,
      props.GRID_COLS,
      props.GRID_ROWS,
      props.GRID_NO_MARGINS
    ];
  }

  template() {
    return `<slot></slot>`;
  }

  /**
   * If true the grid is not responsive and stays equal width as will fit
   * @param {boolean} value true or false/nothing
   */
  set fixed(value) {
    if (value) {
      this.setAttribute(props.GRID_FIXED, value);
      this.classList.add('ids-fixed');
      return;
    }

    this.removeAttribute(props.GRID_FIXED);
    this.classList.remove('ids-fixed');
  }

  get fixed() { return this.getAttribute(props.GRID_FIXED); }

  /**
   * Handle The Gap Setting
   * @returns {string} The Gap [none, sm, md, lg, xl]
   */
  get gap() { return this.getAttribute(props.GRID_GAP); }

  /**
   * Set the grid gap
   * @param {string} value The Gap [none, sm, md, lg, xl]
   */
  set gap(value) {
    if (value) {
      this.setAttribute(props.GRID_GAP, value);
      this.classList.add(`ids-grid-gap-${value}`);
      return;
    }
    this.removeAttribute(props.GRID_GAP);
    this.classList.remove(`ids-grid-gap-${value}`);
  }

  /**
   * Sets the grid to `auto-fit`
   * @param {boolean} value true or false/nothing
   */
  set auto(value) {
    if (value) {
      this.setAttribute(props.GRID_AUTO, value);
      this.classList.add('ids-layout-cols-auto');
      return;
    }

    this.removeAttribute(props.GRID_AUTO);
    this.classList.remove('ids-layout-cols-auto');
  }

  get auto() { return this.getAttribute(props.GRID_AUTO); }

  /**
   * Sets the amount of columns in the grid
   * @param {string} value number of columns of the grid
   */
  set cols(value) {
    if (value) {
      this.auto = false;
      this.setAttribute(props.GRID_COLS, value);
      this.style.setProperty('--grid-cols', value);
      this.classList.add(`ids-layout-cols`);
      this.classList.remove('ids-layout-cols-auto');
      return;
    }

    this.style.removeProperty('--grid-cols');
    this.removeAttribute(props.GRID_AUTO);
    this.classList.remove(`ids-layout-cols`);
  }

  get cols() { return this.getAttribute(props.GRID_COLS); }

  /**
   * Sets the amount of rows in the grid. Works best with fixed height grids
   * @param {string} value number of rows in a fixed grid
   */
  set rows(value) {
    if (value) {
      this.auto = false;
      this.setAttribute(props.GRID_ROWS, value);
      this.style.setProperty('--grid-rows', value);
      this.classList.add(`ids-layout-rows`);
      this.classList.remove('ids-layout-cols-auto');
      return;
    }

    this.style.removeProperty('--grid-rows');
    this.removeAttribute(props.GRID_AUTO);
    this.classList.remove(`ids-layout-rows`);
  }

  get rows() { return this.getAttribute(props.GRID_ROWS); }

  /**
   * If true the grid will not have any margins
   * @param {boolean} value true or false/nothing
   */
  set noMargins(value) {
    if (value) {
      this.setAttribute(props.GRID_NO_MARGINS, value);
      this.classList.add('ids-layout-grid-no-margins');
      return;
    }

    this.removeAttribute(props.GRID_NO_MARGINS);
    this.classList.remove('ids-layout-grid-no-margins');
  }

  get noMargins() { return this.getAttribute(props.GRID_NO_MARGINS); }
}

export default IdsLayoutGrid;
