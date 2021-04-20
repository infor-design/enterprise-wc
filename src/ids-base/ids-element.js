import {
  customElement,
  version,
  scss
} from './ids-decorators';

import { props } from './ids-constants';
import mix from './ids-mixin';
import { IdsStringUtils as stringUtils } from './ids-string-utils';

/**
 * IDS Base Element
 */
@version()
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
   * @param  {string} name The property name
   * @param  {string} oldValue The property old value
   * @param  {string} newValue The property new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[stringUtils.camelCase(name)] = newValue;
    }
  }

  /**
   * Release events and cleanup, if implementing disconnectedCallback
   * in a component you can just call super.
   */
  disconnectedCallback() {
    if (this.detachAllEvents) {
      this.detachAllEvents();
    }

    if (this.detachAllListeners) {
      this.detachAllListeners();
    }
  }

  /**
   * Handle Changes on Properties, this is part of the web component spec.
   * @type {Array}
   */
  static get observedAttributes() {
    return this.properties;
  }

  static get properties() {
    return [];
  }

  /**
   * @returns {Array<string>} this component's observable properties
   */
  static get properties() {
    return [];
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

    if (this.shadowRoot?.innerHTML) {
      this.shadowRoot.innerHTML = '';
    }

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    this.appendStyles();
    template.innerHTML = this.template();
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
    /** @type {any} */
    this.container = this.shadowRoot?.querySelector(`.${this.name}`);
    if (!this.container) {
      this.container = this.shadowRoot?.firstElementChild;
    }
    // Remove any close hidden element to avoid FOUC
    this.closest('div[role="main"][hidden]')?.removeAttribute('hidden');
    this.closest('ids-container')?.removeAttribute('hidden');

    // Give implementing-component an opportunity to react to
    // new render and replacement of container node

    this.rendered?.();

    return this;
  }

  /**
   * @returns {string} containing this component's HTML Template
   */
  template() {
    return '';
  }

  /**
   * Append Styles if present
   */
  appendStyles() {
    if (this.cssStyles && !this.shadowRoot.adoptedStyleSheets && typeof this.cssStyles === 'string') {
      const style = document.createElement('style');
      style.textContent = this.cssStyles;
      if (/^:(:)?host/.test(style.textContent)) {
        style.textContent = style.textContent.replace(/^:(:)?host/, `.${this.name}`);
      }
      style.setAttribute('nonce', '0a59a005'); // TODO: Make this a setting
      this.shadowRoot?.appendChild(style);
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
  mix,
  scss,
  props
};
