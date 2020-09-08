import pathData from 'ids-identity/dist/theme-uplift/icons/standard/path-data.json';
import { IdsElement, customElement } from '../ids-base/ids-element';

// Setting Defaults
const sizes = {
  large: 24,
  normal: 18,
  medium: 18,
  small: 10
};

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
    const size = sizes[this.size] || sizes.normal;
    return `<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" height="${size}" width="${size}" viewBox="0 0 18 18" focusable="false" aria-hidden="true" role="presentation">
      <path d="${this.iconData()}" />
    </svg>`;
  }

  /**
   * Rerender the component with the current settings
   */
  rerender() {
    const svg = this.shadowRoot.querySelector('svg');
    if (!svg) {
      return;
    }
    this.shadowRoot.innerHTML = this.template();
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
      this.shadowRoot.querySelector('svg path').setAttribute('d', this.iconData());
    } else {
      this.removeAttribute('icon');
      this.shadowRoot.querySelector('svg').remove();
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
      this.shadowRoot.querySelector('svg').setAttribute('height', sizes[this.size]);
      this.shadowRoot.querySelector('svg').setAttribute('width', sizes[this.size]);
    } else {
      this.removeAttribute('size');
    }
  }
}

export default IdsIcon;
