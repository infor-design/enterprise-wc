/**
 * IDS Tag Component
 */
class IdsTag extends HTMLElement {
  /**
   * Call the constructor and initialize
   */
  constructor() {
    super();
    this.name = 'ids-tag'; // TODO: Base Method
    this.render(); // TODO: Base Method
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
   * TODO: Base Method
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
    if (hasColor && value) {
      this.setAttribute('color', value);
      const prop = value.substr(0, 1) === '#' ? value : `var(--ids-theme-color-status-${value})`;
      this.style.backgroundColor = prop;
      this.style.borderColor = value === 'secondary' ? '' : prop;

      // TODO: Do this with css classes
      if (value === 'error' || value === 'success') {
        this.style.color = 'var(--ids-theme-color-palette-white)';
      }

      if (value === 'secondary') {
        this.style.borderColor = 'var(--ids-theme-color-palette-graphite-30)';
      }
      return;
    }

    this.removeAttribute('color');
    this.style.backgroundColor = '';
    this.style.borderColor = '';
    this.style.color = '';
  }

  /**
   * Render the component
   */
  render() {
    // Append the Template to the Shadown DOM (TODO: Base Method)
    const template = document.createElement('template');
    template.innerHTML = IdsTag.template();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Add the class  (TODO: Base Method)
    this.classList.add(this.name);
  }
}

export default IdsTag;
