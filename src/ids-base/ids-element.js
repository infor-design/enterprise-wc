import { customElement, version, mixin } from './ids-decorators';

/**
 * IDS Base Element
 */
@version()
class IdsElement extends HTMLElement {
  constructor() {
    super();
  }

  /**
   * Add the component name and baseclass
   * @private
   */
  addBaseName() {
    // Add the base class
    this.name = this.nodeName?.toLowerCase() || 'ids-element';
    this.classList.add(this.name);
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

  /**
   * Release events and cleanup, if implementing disconnectedCallback
   * in a component you can just call super.
   */
  disconnectedCallback() {
    if (this.eventHandlers) {
      this.eventHandlers.removeAll();
    }
  }

  /**
   * Do stuff as the component is connected.
   */
  connectedCallback() {
    this.addBaseName();
    if (this.connectedCallBack) {
      this.connectedCallBack();
    }
    this.loadingClass = 'ids-loading';
    document.querySelector('body').classList.remove(this.loadingClass);
  }

  /**
   * Handle Changes on Properties, this is part of the web component spec.
   * @type {Array}
   */
  static get observedAttributes() {
    return this.properties;
  }

  /**
   * Properties for this web component.
   * TODO: We may need to do this https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   * @returns {object} The properties object
   */
  static get properties() { return {}; }

  /**
   * Render the component using the defined template.
   * @returns {object} The object for chaining.
   */
  render() {
    const html = this.template();
    if (!html) {
      return this;
    }
    const template = document.createElement('template');
    template.innerHTML = html;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    return this;
  }
}

export {
  IdsElement,
  customElement,
  mixin,
  version
};
