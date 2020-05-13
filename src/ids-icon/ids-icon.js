/**
 * IDS Icon Component
 */
class IdsIcon extends HTMLElement {
  constructor() {
    super();

    // Declare constants
    this.compactSizes = {
      wide: 32,
      narrow: 24,
      default: 24,
      condensed: 16,
    };

    this.render();
  }

  /**
   * Return the icon data for the svg based on the icon name
   * @returns {string} the path data
   */
  iconData() {
    const paths = {
      close: 'M10.414 9l5.293-5.293a.999.999 0 10-1.414-1.414L9 7.586 3.707 2.293a.999.999 0 10-1.414 1.414L7.586 9l-5.293 5.293a.999.999 0 101.414 1.414L9 10.414l5.293 5.293a.997.997 0 001.414 0 .999.999 0 000-1.414L10.414 9',
      'caret-right': 'M5.452 1L4 2.356 11.109 9 4 15.643 5.452 17 14 9.01 13.99 9l.01-.011z',
    };
    return paths[this.icon];
  }

  /**
   * Create the Template for the contents
   *
   * @returns {string} The template
   */
  template() {
    const size = this.compactSizes[this.compactness] || this.compactSizes.default;
    return `<svg
      xmlns="http://www.w3.org/2000/svg" height="${size}" width="${size}" viewBox="0 0 18 18"
      >
      <path d="${this.iconData()}" />
    </svg>`;
  }

  /**
   * Handle Settings.
   *
   * @type {Array}
   */
  static get observedAttributes() {
    return ['icon', 'compactness'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
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
   * Return the compact mode. May be wide, narrow or condensed
   * @returns {string} the path data
   */
  get compactness() { return this.getAttribute('compactness') || 'narrow'; }

  set compactness(value) {
    if (this.hasAttribute('compactness') && value) {
      this.setAttribute('compactness', value);
    } else {
      this.removeAttribute('compactness');
    }
  }

  /**
   * Render the component
   */
  render() {
    const template = document.createElement('template');
    template.innerHTML = this.template();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('ids-icon', IdsIcon);
