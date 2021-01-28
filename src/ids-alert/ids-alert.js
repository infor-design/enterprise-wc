import pathData from 'ids-identity/dist/theme-uplift/icons/standard/path-data.json';
import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
// @ts-ignore
import styles from './ids-alert.scss';

const sizes = {
  large: 24,
  normal: 18,
  medium: 18,
  small: 10
};

/**
 * IDS Alert Component
 */
@customElement('ids-alert')
@scss(styles)
class IdsAlert extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The propertires in an array
   */
  static get properties() {
    return [props.TYPE, props.ICON, props.SIZE];
  }

  /** Return the icon data for the svg based on the icon name
   * @returns {string} the path data
   */
  iconData() {
    return pathData[this.icon];
  }

  /**
   * Create the template for the contents
   * @returns {string} The template
   */
  template() {
    const size = sizes[this.size];
    return `<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor"
            fill="none" height="${size}" width="${size}" viewBox="0 0 18 18"
            focusable="false" aria-hidden="true" role="presentation">
              ${this.iconData()}
            </svg>`;
  }

  /**
   * Return the icon name
   * @returns {string} the path data
   */
  get icon() { return this.getAttribute(props.ICON); }

  set icon(value) {
    if (value) {
      this.setAttribute(props.ICON, value);
      this.shadowRoot.querySelector('svg').innerHTML = this.iconData();
    } else {
      this.removeAttribute(props.ICON);
      this.shadowRoot.querySelector('svg')?.remove();
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
      this.shadowRoot.querySelector('svg').setAttribute('height', size);
      this.shadowRoot.querySelector('svg').setAttribute('width', size);
    } else {
      this.removeAttribute(props.SIZE);
    }
  }

  /**
   * Return the type of the alert.
   * @returns {string} the path data
   */
  get type() { return this.getAttribute(props.TYPE) || 'icon'; }

  /**
   * Set the type
   * @param {string} value The Type [success, info, error, alert]
   */
  set type(value) {
    if (value) {
      this.shadowRoot.querySelector('svg').classList.add(`icon-${value}`);
      this.setAttribute(props.TYPE, value);
    } else {
      this.removeAttribute(props.TYPE);
      this.shadowRoot.querySelector('svg')?.remove();
    }
  }
}

export default IdsAlert;
