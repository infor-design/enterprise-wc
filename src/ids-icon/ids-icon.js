import pathData from 'ids-identity/dist/theme-new/icons/standard/path-data.json';
import {
  IdsElement,
  scss,
  customElement,
  attributes,
  stringUtils
} from '../ids-base';

import styles from './ids-icon.scss';

// Setting Defaults
const sizes = {
  large: 24,
  normal: 18,
  medium: 18,
  small: 10
};

/**
 * IDS Icon Component
 * @type {IdsIcon}
 * @inherits IdsElement
 */
@customElement('ids-icon')
@scss(styles)
class IdsIcon extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ICON,
      attributes.SIZE,
      attributes.VERTICAL
    ];
  }

  /**
   * Create the Template for the contents
   *
   * @returns {string} The template
   */
  template() {
    const size = sizes[this.size];
    return `<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" height="${size}" width="${size}" viewBox="0 0 18 18" aria-hidden="true">
      ${this.iconData()}
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
  get icon() { return this.getAttribute(attributes.ICON) || ''; }

  set icon(value) {
    const svgElem = this.shadowRoot?.querySelector('svg');
    if (value && svgElem) {
      this.setAttribute(attributes.ICON, value);
      svgElem.innerHTML = this.iconData();
    } else {
      this.removeAttribute(attributes.ICON);
      svgElem?.remove();
    }
  }

  /**
   * Return the size. May be large, normal/medium or small
   * @returns {string} the path data
   */
  get size() { return this.getAttribute(attributes.SIZE) || 'normal'; }

  set size(value) {
    if (value && sizes[value]) {
      const size = sizes[this.size];
      this.setAttribute(attributes.SIZE, value);
      this.shadowRoot?.querySelector('svg')?.setAttribute('height', size);
      this.shadowRoot?.querySelector('svg')?.setAttribute('width', size);
    } else {
      this.removeAttribute(attributes.SIZE);
    }
  }

  /** @returns {string|boolean} Whether or not the icon is vertical */
  get vertical() { return this.getAttribute(attributes.VERTICAL) || false; }

  /** @param {string|boolean} value Rotate the icon to vertical */
  set vertical(value) {
    const isVertical = stringUtils.stringToBool(value);
    if (isVertical) {
      this.setAttribute(attributes.VERTICAL, value);
      this.container.classList.add('vertical');
      return;
    }
    this.removeAttribute(attributes.VERTICAL);
    this.container.classList.remove('vertical');
  }
}

export default IdsIcon;
