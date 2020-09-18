import { customElement, IdsElement } from '../ids-base/ids-element';

/**
 * IDS Column Component
 */
@customElement('ids-grid-tile')
class IdsGridTile extends IdsElement {
  constructor() {
    super();
  }

  connectedCallBack() {
    this.classList.add(this.name);
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return ['fill', 'span', 'xs-span', 'sm-span', 'md-span', 'lg-span', 'xl-span'];
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
    if (value) {
      this.setAttribute('fill', value);
      this.classList.add('ids-background-fill');
      return;
    }
    this.removeAttribute('fill');
    this.classList.remove('ids-background-fill');
  }

  /**
   * Handle the span setting
   * @returns {string} The amount of columns to span in the grid
   */
  get span() { return this.getAttribute('span') };

  /**
   * Set the amount of columns to span
   * @param {string} value The number value for the columns to span in the grid
   */
  set span(value) {
    if (value) {
      this.setAttribute('span', value);
      this.classList.add(`ids-grid-span-${value}`);
      return;
    }

    this.removeAttribute('span');
  }

  /**
   * Set the amount of columns to span - extra small breakpoint
   * @param {string} value The number value for the columns to span in the grid
   */
  set xsSpan(value) {
    if (value) {
      this.setAttribute('xs-span', value);
      this.classList.add(`ids-grid-span-xs-${value}`);
      return;
    }

    this.removeAttribute('xs-span');
  }

  /**
   * Set the amount of columns to span - small breakpoint
   * @param {string} value The number value for the columns to span in the grid
   */
  set smSpan(value) {
    if (value) {
      this.setAttribute('sm-span', value);
      this.classList.add(`ids-grid-span-sm-${value}`);
      return;
    }

    this.removeAttribute('sm-span');
  }

  /**
   * Set the amount of columns to span - medium breakpoint
   * @param {string} value The number value for the columns to span in the grid
   */
  set mdSpan(value) {
    if (value) {
      this.setAttribute('md-span', value);
      this.classList.add(`ids-grid-span-md-${value}`);
      return;
    }

    this.removeAttribute('md-span');
  }

  /**
   * Set the amount of columns to span - large breakpoint
   * @param {string} value The number value for the columns to span in the grid
   */
  set lgSpan(value) {
    if (value) {
      this.setAttribute('lg-span', value);
      this.classList.add(`ids-grid-span-lg-${value}`);
      return;
    }

    this.removeAttribute('lg-span');
  }

  /**
   * Set the amount of columns to span - extra large breakpoint
   * @param {string} value The number value for the columns to span in the grid
   */
  set xlSpan(value) {
    if (value) {
      this.setAttribute('xl-span', value);
      this.classList.add(`ids-grid-span-xl-${value}`);
      return;
    }

    this.removeAttribute('xl-span');
  }
}

export default IdsGridTile;
