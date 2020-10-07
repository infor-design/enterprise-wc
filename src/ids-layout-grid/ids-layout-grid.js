import {
  IdsElement,
  customElement,
  version,
  scss
} from '../ids-base/ids-element';
import styles from './ids-layout-grid.scss';

/**
 * IDS Layout Component
 */
@customElement('ids-layout-grid')
@scss(styles)
class IdsLayoutGrid extends IdsElement {
  constructor() {
    super();
  }

  connectedCallBack() {
    this.init();
  }

  init() {
    // Add class
    this.classList.add('ids-layout-grid');

    // Append One style sheet
    const firstSheet = document.querySelector('#ids-layout-grid-styles');

    if (!firstSheet) {
      const style = document.createElement('style');
      style.setAttribute('id', 'ids-layout-grid-styles');
      style.textContent = this.cssStyles;
      this.appendChild(style);
    }
  }

  static get properties() {
    return ['fixed', 'gap', 'auto', 'cols', 'rows'];
  }

  /**
   * If true the grid is not responsive and stays equal width as will fit
   * @param {boolean} value true or false/nothing
   */
  set fixed(value) {
    if (value) {
      this.setAttribute('fixed', value);
      this.classList.add('ids-fixed');
      return;
    }

    this.removeAttribute('fixed');
    this.classList.remove('ids-fixed');
  }

  get fixed() { return this.getAttribute('fixed'); }

  /**
   * Handle The Gap Setting
   * @returns {string} The Gap [none, sm, md, lg, xl]
   */
  get gap() { return this.getAttribute('gap'); }

  /**
   * Set the grid gap
   * @param {string} value The Gap [none, sm, md, lg, xl]
   */
  set gap(value) {
    if (value) {
      this.setAttribute('gap', value);
      this.classList.add(`ids-grid-gap-${value}`);
      return;
    }
    this.removeAttribute('gap');
    this.classList.remove(`ids-grid-gap-${value}`);
  }

  /**
   * Sets the grid to `auto-fit`
   * @param {boolean} value true or false/nothing
   */
  set auto(value) {
    if (value) {
      this.setAttribute('auto', value);
      this.classList.add('ids-layout-cols-auto');
      return;
    }

    this.removeAttribute('auto');
    this.classList.remove('ids-layout-cols-auto');
  }

  get auto() { return this.getAttribute('auto'); }

  /**
   * Sets the amount of columns in the grid
   * @param {string} value number of columns of the grid
   */
  set cols(value) {
    if (value) {
      this.auto = false;
      this.setAttribute('cols', value);
      this.style.setProperty('--grid-cols', value);
      this.classList.add(`ids-layout-cols`);
      this.classList.remove('ids-layout-cols-auto');
      return;
    }

    this.style.removeProperty('--grid-cols');
    this.removeAttribute('auto');
    this.classList.remove(`ids-layout-cols`);
  }

  get cols() { return this.getAttribute('cols'); }

  /**
   * Sets the amount of rows in the grid. Works best with fixed height grids
   * @param {string} value number of rows in a fixed grid
   */
  set rows(value) {
    if (value) {
      this.auto = false;
      this.setAttribute('rows', value);
      this.classList.add(`ids-layout-rows`);
      this.classList.remove('ids-layout-cols-auto');
      return;
    }

    this.removeAttribute('auto');
    this.classList.remove(`ids-layout-rows`);
  }

  get rows() { return this.getAttribute('rows'); }
}

export default IdsLayoutGrid;
