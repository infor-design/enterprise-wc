import { attributes } from './ids-attributes';
import renderLoop from '../components/ids-render-loop/ids-render-loop-global';
import IdsRenderLoopItem from '../components/ids-render-loop/ids-render-loop-item';
import { camelCase } from '../utils/ids-string-utils/ids-string-utils';

const VERSION = '0.0.0-beta.16';

/**
 * Simple dictionary used to cache attribute names
 * to their corresponding property names.
 * @type {object.<string, string>}
 */
const attribPropNameDict = Object.fromEntries(
  Object.entries(attributes).map(([_, attrib]) => (
    [attrib, camelCase(attrib)]
  ))
);

/**
 * IDS Base Element
 */
export default class IdsElement extends HTMLElement {
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
    // Add the base class and version
    this.name = this.nodeName?.toLowerCase();
    this.IdsVersion = VERSION;
  }

  /**
   * Insert the id's and data-**-id to the various parts in the component
   * @private
   */
  addInternalIds() {
    const parts = this.shadowRoot.querySelectorAll('[part]');
    if (parts.length === 0) {
      return;
    }

    if (this.id) {
      this.appendIdtoPart(parts, 'id', this.id);
    }

    for (let i = 0; i < this.attributes.length; i++) {
      if (this.attributes[i].name.includes('data-') && this.attributes[i].name.includes('id')) {
        this.appendIdtoPart(
          parts,
          this.attributes[i].name,
          this.getAttribute(this.attributes[i].name)
        );
      }
    }
  }

  /**
   * Copy down the id's and data-**-id to the different parts in the component
   * @param  {Array} parts The array of parts
   * @param  {string} name The id name
   * @param  {string} value The id value
   * @private
   */
  appendIdtoPart(parts, name, value) {
    for (let i = 0; i < parts.length; i++) {
      let label;
      const newId = `${value}-${parts[i].getAttribute('part')}`;

      if (name === 'id' && parts[i].id) {
        label = this.shadowRoot.querySelector(`[for="${parts[i].id}"]`);
      }
      parts[i].setAttribute(name, newId);
      if (label) {
        label.setAttribute('for', newId);
      }
      if (name === 'id' && this.state?.id) {
        this.state.id = newId;
      }
    }
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
      if (!attribPropNameDict[name]) {
        attribPropNameDict[name] = camelCase(name);
      }

      this[attribPropNameDict[name]] = newValue;
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
    return this.attributes;
  }

  /**
   * @returns {Array<string>} this component's observable properties
   */
  static get attributes() {
    return [];
  }

  /**
   * Render the component using the defined template.
   * @returns {object} The object for chaining.
   */
  render() {
    if (!this.template) {
      return this;
    }

    const templateHTML = this.template();
    if (!templateHTML) {
      return this;
    }

    // Make template and shadow objects
    const template = document.createElement('template');
    if (this.shadowRoot?.innerHTML) {
      for (const el of this.shadowRoot.children) {
        if (el.nodeName !== 'STYLE') {
          el.remove();
        }
      }
    }

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    this.appendStyles();
    template.innerHTML = templateHTML;
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    this.container = this.shadowRoot?.querySelector(`.${this.name}`);
    if (this.shadowRoot?.firstElementChild.nodeName === 'STYLE' && !this.container) {
      this.container = this.shadowRoot?.firstElementChild.nextElementSibling;
    }

    if (this.shadowRoot?.firstElementChild.nodeName !== 'STYLE' && !this.container) {
      this.container = this.shadowRoot?.firstElementChild;
    }

    // Runs on next next paint to be sure rendered() fully
    if (this.rendered) {
      renderLoop.register(new IdsRenderLoopItem({
        duration: 1,
        timeoutCallback: () => {
          this.rendered();
        }
      }));
    }

    // Add automation Ids
    if (this.appendIds) {
      this.addInternalIds();
    }
    return this;
  }

  /**
   * @returns {string} containing this component's HTML Template
   */
  template() {
    return '';
  }

  /**
   * @returns {string} gets the nonce from the meta tag
   */
  get nonce() {
    this.cachedNonce = '';
    if (!document.nonce) {
      const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (csp) {
        let nonce = csp.getAttribute('content').match(/'nonce-(.*?)'/g);
        nonce = nonce ? nonce[0]?.replace('\'nonce-', '').replace('\'', '') : undefined;
        document.nonce = nonce;
      }
    }
    return document.nonce;
  }

  /**
   * Append Styles if present
   * @private
   */
  appendStyles() {
    if (this.hasStyles) {
      return;
    }

    const style = document.createElement('style');
    style.textContent = this.cssStyles;
    style.setAttribute('nonce', this.nonce);

    this.shadowRoot?.appendChild(style);
    this.hasStyles = true;
  }
}
