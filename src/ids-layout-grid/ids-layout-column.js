import { customElement, IdsElement, scss } from '../ids-base/ids-element';

/**
 * IDS Column Component
 */
@customElement('ids-layout-column')
class IdsLayoutColumn extends IdsElement {
  constructor() {
    super();
  }

  connectedCallBack() { }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return ['fill', 'gap', 'col-span', 'col-start', 'col-end', 'row-span', 'row-start', 'row-end'];
  }

  /**
   * Handle The Fill Setting
   * @returns {string} The fill color or true for theme default color
   */
  get fill() { return this.getAttribute('fill'); }

  /**
   * Set the background fill color
   * @param {string} value The fill color or true for theme default color
   */
  set fill(value) {
    const hasFill = this.hasAttribute('fill');

    if (value) {
      this.setAttribute('fill', value);
      this.classList.add('ids-background-fill');
      return;
    }
    this.removeAttribute('fill');
    this.classList.remove('ids-background-fill');
  }

  /**
   * Set the amount of columns to span
   * @param {string} value The number value for the columns to span in the grid
   */
  set colSpan(value) {
    if (value) {
      this.setAttribute('col-span', value);
      this.style.setProperty('--grid-col-span', value);
      this.classList.add(`ids-layout-col-span`);
      return;
    }

    this.style.setProperty('--grid-col-span');
    this.classList.remove(`ids-layout-col-span`);
    this.removeAttribute('col-span');
  }

  get colSpan() { return this.getAttribute('col-span') };

  /**
   * Set the starting column
   * @param {string} value The number value for the column starting point
   */
  set colStart(value) {
    if (value) {
      this.setAttribute('col-start', value);
      this.style.setProperty('--grid-col-start', value);
      this.classList.add(`ids-layout-col-start`);
      return;
    }

    this.style.removeProperty('--grid-col-start');
    this.classList.remove(`ids-layout-col-start`);
    this.removeAttribute('col-start');
  }

  get colStart() { return this.getAttribute('col-start') };

  /**
   * Set the ending column
   * @param {string} value The number value for the column starting point
   */
  set colEnd(value) {
    if (value) {
      this.setAttribute('col-end', value);
      this.style.setProperty('--grid-col-end', value);
      this.classList.add(`ids-layout-col-end`);
      return;
    }

    this.style.removeProperty('--grid-col-end');
    this.classList.remove(`ids-layout-col-end`);
    this.removeAttribute('col-end');
  }

  get colEnd() { return this.getAttribute('col-end') };

  /**
   * Set the amount of rows to span
   * @param {string} value The number value for the rows to span in the grid
   */
  set rowSpan(value) {
    if (value) {
      this.setAttribute('row-span', value);
      this.style.setProperty('--grid-row-span', value);
      this.classList.add(`ids-layout-row-span`);
      return;
    }

    this.style.removeProperty('--grid-row-span');
    this.classList.remove(`ids-layout-row-span`);
    this.removeAttribute('row-span');
  }

  get rowSpan() { return this.getAttribute('row-span') };

  /**
   * Set the starting row
   * @param {string} value The number value for the row starting point
   */
  set rowStart(value) {
    if (value) {
      this.setAttribute('row-start', value);
      this.style.setProperty('--grid-row-start', value);
      this.classList.add(`ids-layout-row-start`);
      return;
    }

    this.style.removeProperty('--grid-row-start');
    this.classList.remove(`ids-layout-row-start`);
    this.removeAttribute('row-start');
  }

  get rowStart() { return this.getAttribute('row-start') };

  /**
   * Set the ending row
   * @param {string} value The number value for the row ending point
   */
  set rowEnd(value) {
    if (value) {
      this.setAttribute('row-end', value);
      this.style.setProperty('--grid-row-end', value);
      this.classList.add(`ids-layout-row-end`);
      return;
    }

    this.style.removeProperty('--grid-row-end');
    this.classList.remove(`ids-layout-row-end`);
    this.removeAttribute('row-end');
  }

  get rowEnd() { return this.getAttribute('row-end') };
}

export default IdsLayoutColumn;
