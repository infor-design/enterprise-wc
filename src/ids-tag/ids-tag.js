import IdsElement from '../ids-base/ids-element';

/**
 * IDS Tag Component
 */
class IdsTag extends IdsElement {
  /**
   * Call the constructor and initialize
   */
  constructor() {
    super();
    this.render();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return '<span class="ids-tag-text"><slot></slot></span>';
  }

  /**
   * Return the properties we handle settings for
   * @returns {string} The template
   */
  settings() {
    return ['color'];
  }

  /**
   * Handle The Color Setting
   * @returns {string} The color
   */
  get color() { return this.getAttribute('color'); }

  /**
   * Set the color of the tab
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
}

export default IdsTag;
