import {
  IdsElement,
  customElement,
  scss,
  props
} from '../ids-base/ids-element';
// @ts-ignore
import styles from './ids-wizard.scss';

/**
 * IDS Switch Component
 * @type {IdsSwitch}
 * @inherits IdsElement
 */
@customElement('ids-wizard')
@scss(styles)
class IdsSwitch extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.COLOR];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template() {
    return (
      `<div class="ids-wizard">
        Howdyhou!
      </div>`
    );
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

export default IdsSwitch;
