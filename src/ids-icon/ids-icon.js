import pathData from 'ids-identity/dist/theme-uplift/icons/standard/path-data.json';
import {
  IdsElement,
  scss,
  customElement,
  props
} from '../ids-base/ids-element';

// @ts-ignore
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
  static get properties() {
    return [props.ICON, props.SIZE];
  }

  /**
   * Create the Template for the contents
   *
   * @returns {string} The template
   */
  template() {
    const size = sizes[this.size];
    return `<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" height="${size}" width="${size}" viewBox="0 0 18 18" focusable="false" aria-hidden="true" role="presentation">
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
  get icon() { return this.getAttribute(props.ICON) || ''; }

  set icon(value) {
    const svgElem = this.shadowRoot?.querySelector('svg');
    if (value && svgElem) {
      this.setAttribute(props.ICON, value);
      svgElem.innerHTML = this.iconData();
    } else {
      this.removeAttribute(props.ICON);
      svgElem?.remove();
    }
  }

  /**
   * Return the size. May be large, normal/medium or small
   * @returns {string} the path data
   */
  get size() { return this.getAttribute(props.SIZE) || 'normal'; }

  set size(value) {
    if (value) {
      const size = sizes[this.size];
      this.setAttribute(props.SIZE, value);
      this.shadowRoot?.querySelector('svg')?.setAttribute('height', size);
      this.shadowRoot?.querySelector('svg')?.setAttribute('width', size);
    } else {
      this.removeAttribute(props.SIZE);
    }
  }
}

export default IdsIcon;
