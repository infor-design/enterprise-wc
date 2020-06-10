import pathData from 'ids-identity/dist/theme-uplift/icons/standard/path-data.json';
import { IdsElement, customElement } from '../ids-base/ids-element';

/**
 * IDS Icon Component
 */
@customElement('ids-icon')
class IdsIcon extends IdsElement {
  constructor() {
    super();

    // Declare constants - or do we like "compact, cozy, and comfortable"?
    this.sizes = {
      wide: 24,
      narrow: 18,
      default: 18,
      condensed: 10
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
    const size = this.sizes[this.compactness] || this.sizes.default;
    return `<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" height="${size}" width="${size}" viewBox="0 0 18 18">
      <path d="${this.iconData()}" />
    </svg>`;
  }

  /**
   * Return the icon data for the svg based on the icon name
   * @returns {string} the path data
   */
  iconData() {
    return pathData[this.icon];
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
