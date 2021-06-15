import { customElement, IdsElement, attributes } from '../ids-base';

/**
 * IDS Layout Grid Cell Component
 * @type {IdsLayoutGridCell}
 * @inherits IdsElement
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
  static get attributes() {
    return [
      attributes.FILL,
      attributes.COL_SPAN,
      attributes.COL_START,
      attributes.COL_END,
      attributes.ROW_SPAN,
      attributes.ROW_START,
      attributes.ROW_END
    ];
  }

  /**
   * Handle The Fill Setting
   * @returns {string | null} The fill to true for theme default color
   */
  get fill() { return this.getAttribute(attributes.FILL); }

  /**
   * Set the background fill
   * @param {string | null} value The fill color or true for theme default color
   */
  set fill(value) {
    if (value) {
      this.setAttribute(attributes.FILL, value);
      this.classList.add('ids-background-fill');
      return;
    }

    this.removeAttribute(attributes.FILL);
    this.classList.remove('ids-background-fill');
  }

  /**
   * Set the amount of columns to span
   * @param {string | null} value The number value for the columns to span in the grid
   */
  set colSpan(value) {
    if (value) {
      this.setAttribute(attributes.COL_SPAN, value);
      this.style.setProperty('--grid-col-span', value);
      this.classList.add(`ids-layout-grid-col-span`);
      return;
    }

    this.style.removeProperty('--grid-col-span');
    this.classList.remove(`ids-layout-grid-col-span`);
    this.removeAttribute(attributes.COL_SPAN);
  }

  get colSpan() { return this.getAttribute(attributes.COL_SPAN); }

  /**
   * Set the starting column
   * @param {string | null} value The number value for the column starting point
   */
  set colStart(value) {
    if (value) {
      this.setAttribute(attributes.COL_START, value);
      this.style.setProperty('--grid-col-start', value);
      this.classList.add(`ids-layout-grid-col-start`);
      return;
    }

    this.style.removeProperty('--grid-col-start');
    this.classList.remove(`ids-layout-grid-col-start`);
    this.removeAttribute(attributes.COL_START);
  }

  get colStart() { return this.getAttribute(attributes.COL_START); }

  /**
   * Set the ending column
   * @param {string | null} value The number value for the column starting point
   */
  set colEnd(value) {
    if (value) {
      this.setAttribute(attributes.COL_END, value);
      this.style.setProperty('--grid-col-end', value);
      this.classList.add(`ids-layout-grid-col-end`);
      return;
    }

    this.style.removeProperty('--grid-col-end');
    this.classList.remove(`ids-layout-grid-col-end`);
    this.removeAttribute(attributes.COL_END);
  }

  get colEnd() { return this.getAttribute(attributes.COL_END); }

  /**
   * Set the amount of rows to span
   * @param {string | null} value The number value for the rows to span in the grid
   */
  set rowSpan(value) {
    if (value) {
      this.setAttribute(attributes.ROW_SPAN, value);
      this.style.setProperty('--grid-row-span', value);
      this.classList.add(`ids-layout-grid-row-span`);
      return;
    }

    this.style.removeProperty('--grid-row-span');
    this.classList.remove(`ids-layout-grid-row-span`);
    this.removeAttribute(attributes.ROW_SPAN);
  }

  get rowSpan() { return this.getAttribute(attributes.ROW_SPAN); }

  /**
   * Set the starting row
   * @param {string | null} value The number value for the row starting point
   */
  set rowStart(value) {
    if (value) {
      this.setAttribute(attributes.ROW_START, value);
      this.style.setProperty('--grid-row-start', value);
      this.classList.add(`ids-layout-grid-row-start`);
      return;
    }

    this.style.removeProperty('--grid-row-start');
    this.classList.remove(`ids-layout-grid-row-start`);
    this.removeAttribute(attributes.ROW_START);
  }

  get rowStart() { return this.getAttribute(attributes.ROW_START); }

  /**
   * Set the ending row
   * @param {string | null} value The number value for the row ending point
   */
  set rowEnd(value) {
    if (value) {
      this.setAttribute(attributes.ROW_END, value);
      this.style.setProperty('--grid-row-end', value);
      this.classList.add(`ids-layout-grid-row-end`);
      return;
    }

    this.style.removeProperty('--grid-row-end');
    this.classList.remove(`ids-layout-grid-row-end`);
    this.removeAttribute(attributes.ROW_END);
  }

  get rowEnd() { return this.getAttribute(attributes.ROW_END); }
}

export default IdsLayoutGridCell;
