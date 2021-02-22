import {
  IdsElement,
  customElement,
  scss,
  props
} from '../ids-base/ids-element';
// @ts-ignore
import styles from './ids-badge.scss';

/**
 * IDS Badge Component
 * @type {IdsBadge}
 * @inherits IdsElement
 */
@customElement('ids-badge')
@scss(styles)
class IdsBadge extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.COLOR, props.SHAPE];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template() {
    const shape = this.shape;

    return `<span class="ids-badge ${shape}"><slot></slot></span>`;
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

      let statusColor;

      if (value === 'error') {
        statusColor = 'var(--ids-color-status-danger)';
      } else if (value === 'alert') {
        statusColor = 'var(--ids-color-status-caution)';
      } else if (value === 'info') {
        statusColor = 'var(--ids-color-status-base)';
      } else {
        statusColor = `var(--ids-color-status-${value})`;
      }

      this.container.style.backgroundColor = statusColor;
      this.container.style.borderColor = statusColor;
      if (value === 'error' || value === 'info') {
        this.container.classList.add('ids-white');
      }
    } else {
      this.removeAttribute('color');
      this.container.style.backgroundColor = '';
      this.container.style.borderColor = '';
      this.container.style.color = '';
      this.container.style.position = '';
    }
  }
}

export default IdsBadge;
