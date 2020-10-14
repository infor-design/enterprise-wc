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
      props.FIXED,
      props.GAP,
      props.AUTO,
      props.COLS,
      props.ROWS,
      props.NO_MARGINS
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
      this.setAttribute(props.FIXED, value);
      this.classList.add('ids-fixed');
      return;
    }

    this.removeAttribute(props.FIXED);
    this.classList.remove('ids-fixed');
  }

  get fixed() { return this.getAttribute(props.FIXED); }

  /**
   * Handle The Gap Setting
   * @returns {string} The Gap [none, sm, md, lg, xl]
   */
  get gap() { return this.getAttribute(props.GAP); }

  /**
   * Set the grid gap
   * @param {string} value The Gap [none, sm, md, lg, xl]
   */
  set gap(value) {
    if (value) {
      this.setAttribute(props.GAP, value);
      this.classList.add(`ids-layout-grid-gap-${value}`);
      return;
    }
    this.removeAttribute(props.GAP);
    this.classList.remove(`ids-layout-grid-gap-${value}`);
  }

  /**
   * Sets the grid to `auto-fit`
   * @param {boolean} value true or false/nothing
   */
  set auto(value) {
    if (value) {
      this.setAttribute(props.AUTO, value);
      this.classList.add('ids-layout-cols-auto');
      return;
    }

    this.removeAttribute(props.AUTO);
    this.classList.remove('ids-layout-cols-auto');
  }

  get auto() { return this.getAttribute(props.AUTO); }

  /**
   * Sets the amount of columns in the grid
   * @param {string} value number of columns of the grid
   */
  set cols(value) {
    if (value) {
      this.auto = false;
      this.setAttribute(props.COLS, value);
      this.style.setProperty('--grid-cols', value);
      this.classList.add(`ids-layout-cols`);
      this.classList.remove('ids-layout-cols-auto');
      return;
    }

    this.style.removeProperty('--grid-cols');
    this.removeAttribute(props.AUTO);
    this.classList.remove(`ids-layout-cols`);
  }

  get cols() { return this.getAttribute(props.COLS); }

  /**
   * Sets the amount of rows in the grid. Works best with fixed height grids
   * @param {string} value number of rows in a fixed grid
   */
  set rows(value) {
    if (value) {
      this.auto = false;
      this.setAttribute(props.ROWS, value);
      this.style.setProperty('--grid-rows', value);
      this.classList.add(`ids-layout-rows`);
      this.classList.remove('ids-layout-cols-auto');
      return;
    }

    this.style.removeProperty('--grid-rows');
    this.removeAttribute(props.AUTO);
    this.classList.remove(`ids-layout-rows`);
  }

  get rows() { return this.getAttribute(props.ROWS); }

  /**
   * If true the grid will not have any margins
   * @param {boolean} value true or false/nothing
   */
  set noMargins(value) {
    if (value) {
      this.setAttribute(props.NO_MARGINS, value);
      this.classList.add('ids-layout-grid-no-margins');
      return;
    }

    this.removeAttribute(props.NO_MARGINS);
    this.classList.remove('ids-layout-grid-no-margins');
  }

  get noMargins() { return this.getAttribute(props.NO_MARGINS); }
}

export default IdsLayoutGrid;
