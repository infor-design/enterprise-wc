import { customElement, dec } from './ids-decorators';

/**
 * IDS Base Element
 */
class IdsElement extends HTMLElement {
  constructor() {
    super();
    this.addBaseName();
  }

  /**
   * Add the component name and baseclass
   */
  @dec(1)
  addBaseName() {
    // Add the base class
    this.name = this.nodeName?.toLowerCase() || 'ids-element';
    this.classList.add(this.name);
  }

  /**
   * Properties for this web component.
   * @returns {object} The properties object
   */
  static get properties() { return {}; }

  /**
   * Handle Changes on Properties, this is part of the web component spec.
   * @type {Array}
   */
  static get observedAttributes() {
    return this.properties;
  }

  /**
   * Render the component
   */
  render() {
    const html = this.template();
    if (!html) {
      return;
    }

    const template = document.createElement('template');
    template.innerHTML = html;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * Handle Setting changes of the value has changed by calling the getter
   * in the extending class.
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

export { IdsElement, customElement, dec };
