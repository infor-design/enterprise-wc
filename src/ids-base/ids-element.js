import { IdsStringUtilsMixin } from './ids-string-utils-mixin';
import {
  customElement,
  version,
  mixin,
  scss
} from './ids-decorators';

/**
 * IDS Base Element
 */
@version()
@mixin(IdsStringUtilsMixin)
class IdsElement extends HTMLElement {
  constructor() {
    super();
    this.addBaseName();
    this.render();
  }

  /**
   * Add the component name and baseclass
   * @private
   */
  addBaseName() {
    // Add the base class
    this.name = this.nodeName?.toLowerCase() || 'ids-element';
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
      this[this.camelCase(name)] = newValue;
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
   * @returns {object} The properties object
   */
  static get properties() { return {}; }

  /**
   * Render the component using the defined template.
   * @returns {object} The object for chaining.
   */
  render() {
    if (!this.template) {
      return this;
    }
    let html = this.template();

    // Make template and shadow objects
    const template = document.createElement('template');
    this.attachShadow({ mode: 'open' });

    // Append Styles if present
    if (this.styles && !this.shadowRoot.adoptedStyleSheets) {
      const style = document.createElement('style');
      style.textContent = this.styles.replace(':host', `.${this.name}`);
      this.shadowRoot.appendChild(style);
    }

    if (this.styles && this.shadowRoot.adoptedStyleSheets) {
      const style = new CSSStyleSheet();
      style.replaceSync(this.styles);
      this.shadowRoot.adoptedStyleSheets = [style];
    }

    html = html.replace('<slot></slot>', this.innerHTML);
    this.innerHTML = '';
    template.innerHTML = html;
    const clone = template.content.cloneNode(true);
    this.shadowRoot.appendChild(clone);

    this.root = this.shadowRoot.querySelector(`.${this.name}`);

    return this;
  }
}

export {
  IdsElement,
  customElement,
  mixin,
  scss,
  version
};
