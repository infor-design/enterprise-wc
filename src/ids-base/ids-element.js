/**
 * IDS Base Element
 */
class IdsElement extends HTMLElement {
  constructor() {
    super();
    this.name = this.nodeName?.toLowerCase() || 'ids-element';
  }

  initialize() {
    if (this.template) {
      this.render();
    }
  }

  /**
   * Render the component
   */
  render() {
    // Append the Template to the Shadown DOM (TODO: Base Method)
    const template = document.createElement('template');
    template.innerHTML = this.template();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Add the base class
    this.classList.add(this.name);
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
   * Handle Setting changes of the value has changed
   * @private
   * @param  {string} name The property name
   * @param  {string} oldValue The property old value
   * @param  {string} newValue The property new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }
}

export default IdsElement;
