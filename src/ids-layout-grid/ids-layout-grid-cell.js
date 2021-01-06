import { customElement, IdsElement } from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';

/**
 * IDS Grid Panel Component
 */
@customElement('ids-layout-grid-cell')
class IdsLayoutGridCell extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.FILL,
      props.COL_SPAN,
      props.COL_START,
      props.COL_END,
      props.ROW_SPAN,
      props.ROW_START,
      props.ROW_END
    ];
  }

  /**
   * Handle The Fill Setting
   * @returns {string} The fill to true for theme default color
   */
  get fill() { return this.getAttribute(props.FILL); }

  /**
   * Set the background fill
   * @param {string} value The fill color or true for theme default color
   */
  set fill(value) {
    if (value) {
      this.setAttribute(props.FILL, value);
      // this.style.setProperty('--grid-fill-color', `var(--body-color-primary-background)`);
      this.classList.add('ids-background-fill');
      return;
    }

    this.removeAttribute(props.FILL);
    // this.style.removeProperty('--grid-fill-color');
    this.classList.remove('ids-background-fill');
  }

  /**
   * Set the amount of columns to span
   * @param {string} value The number value for the columns to span in the grid
   */
  set colSpan(value) {
    if (value) {
      this.setAttribute(props.COL_SPAN, value);
      this.style.setProperty('--grid-col-span', value);
      this.classList.add(`ids-layout-grid-col-span`);
      return;
    }

    this.style.removeProperty('--grid-col-span');
    this.classList.remove(`ids-layout-grid-col-span`);
    this.removeAttribute(props.COL_SPAN);
  }

  get colSpan() { return this.getAttribute(props.COL_SPAN); }

  /**
   * Set the starting column
   * @param {string} value The number value for the column starting point
   */
  set colStart(value) {
    if (value) {
      this.setAttribute(props.COL_START, value);
      this.style.setProperty('--grid-col-start', value);
      this.classList.add(`ids-layout-grid-col-start`);
      return;
    }

    this.style.removeProperty('--grid-col-start');
    this.classList.remove(`ids-layout-grid-col-start`);
    this.removeAttribute(props.COL_START);
  }

  get colStart() { return this.getAttribute(props.COL_START); }

  /**
   * Set the ending column
   * @param {string} value The number value for the column starting point
   */
  set colEnd(value) {
    if (value) {
      this.setAttribute(props.COL_END, value);
      this.style.setProperty('--grid-col-end', value);
      this.classList.add(`ids-layout-grid-col-end`);
      return;
    }

    this.style.removeProperty('--grid-col-end');
    this.classList.remove(`ids-layout-grid-col-end`);
    this.removeAttribute(props.COL_END);
  }

  get colEnd() { return this.getAttribute(props.COL_END); }

  /**
   * Set the amount of rows to span
   * @param {string} value The number value for the rows to span in the grid
   */
  set rowSpan(value) {
    if (value) {
      this.setAttribute(props.ROW_SPAN, value);
      this.style.setProperty('--grid-row-span', value);
      this.classList.add(`ids-layout-grid-row-span`);
      return;
    }

    this.style.removeProperty('--grid-row-span');
    this.classList.remove(`ids-layout-grid-row-span`);
    this.removeAttribute(props.ROW_SPAN);
  }

  get rowSpan() { return this.getAttribute(props.ROW_SPAN); }

  /**
   * Set the starting row
   * @param {string} value The number value for the row starting point
   */
  set rowStart(value) {
    if (value) {
      this.setAttribute(props.ROW_START, value);
      this.style.setProperty('--grid-row-start', value);
      this.classList.add(`ids-layout-grid-row-start`);
      return;
    }

    this.style.removeProperty('--grid-row-start');
    this.classList.remove(`ids-layout-grid-row-start`);
    this.removeAttribute(props.ROW_START);
  }

  get rowStart() { return this.getAttribute(props.ROW_START); }

  /**
   * Set the ending row
   * @param {string} value The number value for the row ending point
   */
  set rowEnd(value) {
    if (value) {
      this.setAttribute(props.ROW_END, value);
      this.style.setProperty('--grid-row-end', value);
      this.classList.add(`ids-layout-grid-row-end`);
      return;
    }

    this.style.removeProperty('--grid-row-end');
    this.classList.remove(`ids-layout-grid-row-end`);
    this.removeAttribute(props.ROW_END);
  }

  get rowEnd() { return this.getAttribute(props.ROW_END); }
}

export default IdsLayoutGridCell;
