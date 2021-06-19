import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../ids-base';

import { IdsEventsMixin, IdsThemeMixin } from '../ids-mixins';
import styles from './ids-badge.scss';

/**
 * IDS Badge Component
 * @type {IdsBadge}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part badge - the badge element
 */
@customElement('ids-badge')
@scss(styles)
class IdsBadge extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [attributes.COLOR, attributes.SHAPE, attributes.MODE, attributes.version];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template() {
    const shape = this.shape;

    return `<span class="ids-badge ${shape}" part="badge"><slot></slot></span>`;
  }

  /**
   * Return the badge shape between normal and round
   * @returns {string} The path data
   */
  get shape() { return this.getAttribute('shape') || 'normal'; }

  /**
   * Set the shape of the badge
   * @param {string} value The Badge Shape
   */
  set shape(value) {
    if (value) {
      this.setAttribute('shape', value.toString());
    } else {
      this.removeAttribute('shape');
    }
    this.container.setAttribute('class', `ids-badge ${this.shape}`);
  }

  /**
   * Return the badge color
   * @returns {string | null} the path data
   */
  get color() { return this.getAttribute('color'); }

  /**
   * Set the color
   * @param {string | null} value The Badge Color [base, error, info, success and alert]
   */
  set color(value) {
    if (value) {
      this.setAttribute('color', value);
      this.container.setAttribute('color', value);
      let statusColor;

      if (value !== 'error' && value !== 'alert' && value !== 'info') {
        statusColor = `var(--ids-color-status-${value})`;
      }

      this.container.style.backgroundColor = statusColor;
      this.container.style.borderColor = statusColor;
      if (value === 'error' || value === 'info') {
        this.container.classList.add('ids-white');
      }
    } else {
      this.removeAttribute('color');
      this.container.removeAttribute('color');
      this.container.style.backgroundColor = '';
      this.container.style.borderColor = '';
      this.container.style.color = '';
      this.container.style.position = '';
    }
  }
}

export default IdsBadge;
