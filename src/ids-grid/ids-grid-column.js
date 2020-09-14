import { customElement, IdsElement } from '../ids-base/ids-element';

/**
 * IDS Column Component
 */
@customElement('ids-grid-column')
class IdsGridColumn extends IdsElement {
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
    return ['fill', 'span'];
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
      this.classList.add(`ids-grid-col-span--${value}`);
      return;
    }

    this.removeAttribute('span');
  }
}

export default IdsGridColumn;
