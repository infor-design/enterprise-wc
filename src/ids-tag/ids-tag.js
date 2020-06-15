import { IdsElement, customElement } from '../ids-base/ids-element';
import './ids-tag.scss';

/**
 * IDS Tag Component
 */
@customElement('ids-tag')
class IdsTag extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
    this.render();
    this.handleEvents();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return ['color', 'clickable', 'dismissible'];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return '<span class="ids-tag-text"><slot></slot></span>';
  }

  /**
   * Set the color of the tag
   * @param {string} value The color value, this can be not provided,
   * secondary (white), error, success, danger, caution or a hex code with the #
   */
  set color(value) {
    const hasColor = this.hasAttribute('color');

    if (hasColor && value) {
      this.setAttribute('color', value);
      const prop = value.substr(0, 1) === '#' ? value : `var(--ids-color-status-${value === 'error' ? 'danger' : value})`;
      this.style.backgroundColor = prop;
      this.style.borderColor = value === 'secondary' ? '' : prop;

      // TODO: Do this with css classes
      if (value === 'error' || value === 'success' || value === 'danger') {
        this.style.color = 'var(--ids-color-palette-white)';
      }

      if (value === 'secondary') {
        this.style.borderColor = 'var(--ids-color-palette-graphite-30)';
      }
      return;
    }

    this.removeAttribute('color');
    this.style.backgroundColor = '';
    this.style.borderColor = '';
    this.style.color = '';
  }

  get color() { return this.getAttribute('color'); }

  /**
   * Set if the tag may be dismissed
   * @param {boolean} value True of false depending if the tag may be dismissed
   */
  set dismissible(value) {
    const hasProp = this.hasAttribute('dismissible');

    if (hasProp && value) {
      this.setAttribute('dismissible', value);
      this.classList.add('ids-dismissible');
      return;
    }

    this.removeAttribute('dismissible');
    this.classList.remove('ids-dismissible');
  }

  get dismissible() { return this.getAttribute('dismissible'); }

  /**
   * Establish Internal Event Handlers
   * @private
   */
  handleEvents() {
    const closeIcon = this.querySelector('ids-icon[icon="close"]');
    if (closeIcon) {
      this.eventHandlers.addEventListener('click', closeIcon, () => this.dismiss());
    }
  }

  /**
   * Remove the tag from the page
   */
  dismiss() {
    if (!this.dismissible) {
      return;
    }
    this.remove();
  }
}

export default IdsTag;
