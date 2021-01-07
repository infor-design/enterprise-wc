import { IdsStringUtilsMixin } from './ids-string-utils-mixin';
import {
  customElement,
  version,
  mixin,
  scss
} from './ids-decorators';
import { props } from './ids-constants';

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
    this.name = this.nodeName?.toLowerCase();
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
    console.log(oldValue);
    console.log(newValue);
    if (oldValue !== newValue) {
      this[this.camelCase(name)] = newValue;
    }
  }

  /**
   * Release events and cleanup, if implementing disconnectedCallback
   * in a component you can just call super.
   * @private
   */
  disconnectedCallback() {
    this.eventHandlers?.removeAll();
    this.keyboard?.destroy();
  }

  /**
   * Do stuff as the component is connected.
   */
  connectedCallback() {
    if (this.connectedCallBack) {
      this.connectedCallBack();
    }
  }

  /**
   * Handle Changes on Properties, this is part of the web component spec.
   * @type {Array}
   */
  static get observedAttributes() {
    console.log(this);
    return this.properties;
  }

  /**
   * Render the component using the defined template.
   * @returns {object} The object for chaining.
   */
  render() {
    if (!this.template || !this.template()) {
      return this;
    }

    // Make template and shadow objects
    const template = document.createElement('template');
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    this.appendStyles();

    template.innerHTML = this.template();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector(`.${this.name}`);

    return this;
  }

  /**
   * Append Styles if present
   */
  appendStyles() {
    if (this.cssStyles && !this.shadowRoot.adoptedStyleSheets && typeof this.cssStyles === 'string') {
      const style = document.createElement('style');
      style.textContent = this.cssStyles;
      if (style.textContent.indexOf(':host') === 0) {
        style.textContent = style.textContent.replace(':host', `.${this.name}`);
      }
      style.setAttribute('nonce', '0a59a005'); // TODO: Make this a setting
      this.shadowRoot.appendChild(style);
    }

    if (this.cssStyles && this.shadowRoot.adoptedStyleSheets) {
      const style = new CSSStyleSheet();
      style.replaceSync(this.cssStyles);
      this.shadowRoot.adoptedStyleSheets = [style];
    }
  }
}

export {
  IdsElement,
  customElement,
  mixin,
  scss,
  version,
  props
};
