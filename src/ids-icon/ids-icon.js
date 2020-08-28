import pathData from 'ids-identity/dist/theme-uplift/icons/standard/path-data.json';
import { IdsElement, customElement } from '../ids-base/ids-element';

/**
 * IDS Icon Component
 */
@customElement('ids-icon')
class IdsIcon extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return ['icon', 'size'];
  }

  /**
   * Create the Template for the contents
   *
   * @returns {string} The template
   */
  template() {
    const sizes = {
      large: 24,
      normal: 18,
      medium: 18,
      small: 10
    };
    const size = sizes[this.size] || sizes.normal;
    return `<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" height="${size}" width="${size}" viewBox="0 0 18 18" focusable="false" aria-hidden="true" role="presentation">
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
   * Return the size. May be large, normal/medium or small
   * @returns {string} the path data
   */
  get size() { return this.getAttribute('size') || 'normal'; }

  set size(value) {
    if (this.hasAttribute('size') && value) {
      this.setAttribute('size', value);
    } else {
      this.removeAttribute('size');
    }
  }
}

export default IdsIcon;
