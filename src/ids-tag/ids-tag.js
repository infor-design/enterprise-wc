/**
 * IDS Tag Component
 */
class IdsTag extends HTMLElement {
  /**
   * Call the constructor and initialize
   */
  constructor() {
    super();
    this.render();
  }

  /**
   * Create the Template for the contents
   *
   * @returns {string} The template
   */
  static template() {
    return '<span class="ids-tag-text"><slot></slot></span>';
  }

  /**
   * Handle Settings.
   *
   * @type {Array}
   */
  static get observedAttributes() {
    return ['color'];
  }

  /**
   * Handle Setting changes
   * TODO: Goes in base
   * @param  {string} name The property name
   * @param  {string} oldValue The property old value
   * @param  {string} newValue The property new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }

  /**
   * Handle The Color Setting
   * @returns {string} The color
   */
  get color() { return this.getAttribute('color'); }

  set color(value) {
    const hasColor = this.hasAttribute('color');
    if (hasColor || !value) {
      this.setAttribute('color', value);
      this.style.setProperty('--ids-tag-background-color', `var(--ids-theme-color-status-${value})`);
    } else {
      this.removeAttribute('color');
      this.style.removeProperty('--ids-tag-background-color');
    }
  }

  /**
   * Render the component
   */
  render() {
    const template = document.createElement('template');
    template.innerHTML = IdsTag.template();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('ids-tag', IdsTag);
