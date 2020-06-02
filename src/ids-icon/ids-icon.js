import { IdsElement, customElement } from '../ids-base/ids-element';

/**
 * IDS Icon Component
 */
@customElement('ids-icon')
class IdsIcon extends IdsElement {
  constructor() {
    super();

    // Declare constants
    this.compactSizes = {
      wide: 24,
      narrow: 18,
      default: 18,
      condensed: 14
    };

    this.render();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return ['icon', 'compactness'];
  }

  /**
   * Create the Template for the contents
   *
   * @returns {string} The template
   */
  template() {
    const size = this.compactSizes[this.compactness] || this.compactSizes.default;
    return `<svg xmlns="http://www.w3.org/2000/svg" height="${size}" width="${size}" viewBox="0 0 18 18">
      <path d="${this.iconData()}" />
    </svg>`;
  }

  /**
   * Return the icon data for the svg based on the icon name
   * @returns {string} the path data
   */
  iconData() {
    const paths = {
      close: 'M10.414 9l5.293-5.293a.999.999 0 10-1.414-1.414L9 7.586 3.707 2.293a.999.999 0 10-1.414 1.414L7.586 9l-5.293 5.293a.999.999 0 101.414 1.414L9 10.414l5.293 5.293a.997.997 0 001.414 0 .999.999 0 000-1.414L10.414 9',
      'caret-right': 'M5.452 1L4 2.356 11.109 9 4 15.643 5.452 17 14 9.01 13.99 9l.01-.011z'
    };
    return paths[this.icon];
  }

  /**
   * Return the icon name
   * @returns {string} the path data
   */
  get icon() { return this.getAttribute('icon'); }

  set icon(value) {
    if (this.hasAttribute('icon') && value) {
      this.setAttribute('icon', value);
    } else {
      this.removeAttribute('icon');
    }
  }

  /**
   * Return the compact mode. May be wide, narrow or condensed
   * @returns {string} the path data
   */
  get compactness() { return this.getAttribute('compactness') || 'narrow'; }

  set compactness(value) {
    if (this.hasAttribute('compactness') && value) {
      this.setAttribute('compactness', value);
    } else {
      this.removeAttribute('compactness');
    }
  }
}

export default IdsIcon;
