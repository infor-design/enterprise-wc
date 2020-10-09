import { customElement, IdsElement, scss } from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';

/**
 * IDS Grid Panel Component
 */
@customElement('ids-layout-panel')
class IdsLayoutPanel extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.GRID_FILL,
      props.GRID_COL_SPAN,
      props.GRID_COL_START,
      props.GRID_COL_END,
      props.GRID_ROW_SPAN,
      props.GRID_ROW_START,
      props.GRID_ROW_END
    ];
  }

  /**
   * Handle The Fill Setting
   * @returns {string} The fill color or true for theme default color
   */
  get fill() { return this.getAttribute(props.GRID_FILL); }

  /**
   * Set the background fill color
   * @param {string} value The fill color or true for theme default color
   */
  set fill(value) {
    const hasFill = this.hasAttribute(props.GRID_FILL);

    if (value) {
      this.setAttribute(props.GRID_FILL, value);
      this.classList.add('ids-background-fill');
      return;
    }
    this.removeAttribute(props.GRID_FILL);
    this.classList.remove('ids-background-fill');
  }

  /**
   * Set the amount of columns to span
   * @param {string} value The number value for the columns to span in the grid
   */
  set colSpan(value) {
    if (value) {
      this.setAttribute(props.GRID_COL_SPAN, value);
      this.style.setProperty('--grid-col-span', value);
      this.classList.add(`ids-layout-col-span`);
      return;
    }

    this.style.setProperty('--grid-col-span');
    this.classList.remove(`ids-layout-col-span`);
    this.removeAttribute(props.GRID_COL_SPAN);
  }

  get colSpan() { return this.getAttribute(props.GRID_COL_SPAN); }

  /**
   * Set the starting column
   * @param {string} value The number value for the column starting point
   */
  set colStart(value) {
    if (value) {
      this.setAttribute(props.GRID_COL_START, value);
      this.style.setProperty('--grid-col-start', value);
      this.classList.add(`ids-layout-col-start`);
      return;
    }

    this.style.removeProperty('--grid-col-start');
    this.classList.remove(`ids-layout-col-start`);
    this.removeAttribute(props.GRID_COL_START);
  }

  get colStart() { return this.getAttribute(props.GRID_COL_START); }

  /**
   * Set the ending column
   * @param {string} value The number value for the column starting point
   */
  set colEnd(value) {
    if (value) {
      this.setAttribute(props.GRID_COL_END, value);
      this.style.setProperty('--grid-col-end', value);
      this.classList.add(`ids-layout-col-end`);
      return;
    }

    this.style.removeProperty('--grid-col-end');
    this.classList.remove(`ids-layout-col-end`);
    this.removeAttribute(props.GRID_COL_END);
  }

  get colEnd() { return this.getAttribute(props.GRID_COL_END); }

  /**
   * Set the amount of rows to span
   * @param {string} value The number value for the rows to span in the grid
   */
  set rowSpan(value) {
    if (value) {
      this.setAttribute(props.GRID_ROW_SPAN, value);
      this.style.setProperty('--grid-row-span', value);
      this.classList.add(`ids-layout-row-span`);
      return;
    }

    this.style.removeProperty('--grid-row-span');
    this.classList.remove(`ids-layout-row-span`);
    this.removeAttribute(props.GRID_ROW_SPAN);
  }

  get rowSpan() { return this.getAttribute(props.GRID_ROW_SPAN); }

  /**
   * Set the starting row
   * @param {string} value The number value for the row starting point
   */
  set rowStart(value) {
    if (value) {
      this.setAttribute(props.GRID_ROW_START, value);
      this.style.setProperty('--grid-row-start', value);
      this.classList.add(`ids-layout-row-start`);
      return;
    }

    this.style.removeProperty('--grid-row-start');
    this.classList.remove(`ids-layout-row-start`);
    this.removeAttribute(props.GRID_ROW_START);
  }

  get rowStart() { return this.getAttribute(props.GRID_ROW_START); }

  /**
   * Set the ending row
   * @param {string} value The number value for the row ending point
   */
  set rowEnd(value) {
    if (value) {
      this.setAttribute(props.GRID_ROW_END, value);
      this.style.setProperty('--grid-row-end', value);
      this.classList.add(`ids-layout-row-end`);
      return;
    }

    this.style.removeProperty('--grid-row-end');
    this.classList.remove(`ids-layout-row-end`);
    this.removeAttribute(props.GRID_ROW_END);
  }

  get rowEnd() { return this.getAttribute(props.GRID_ROW_END); }
}

export default IdsLayoutPanel;
