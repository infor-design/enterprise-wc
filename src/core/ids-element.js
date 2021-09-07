import {
  customElement,
  appendIds,
  version,
  scss
} from './ids-decorators';

import { attributes } from './ids-attributes';
import mix from './ids-mixin-builder';
import renderLoop from '../components/ids-render-loop/ids-render-loop-global';
import IdsRenderLoopItem from '../components/ids-render-loop/ids-render-loop-item';

// Import Utils
import { IdsStringUtils as stringUtils } from '../utils';

/**
 * simple dictionary used to memoize attribute names
 * to their corresponding property names.
 *
 * Prepopulates with attribs stored in ids-constants,
 * but may have other non-standard attrib names added
 * that are not specified.
 *
 * @type {object.<string, string>}
 */
const attribPropNameDict = Object.fromEntries(
  Object.entries(attributes).map(([_, attrib]) => (
    [attrib, stringUtils.camelCase(attrib)]
  ))
);

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
   * Insert the id's and data-**-id to the various parts in the component
   * @private
   */
  addInternalIds() {
    const parts = this.shadowRoot.querySelectorAll('[part]');
    /* istanbul ignore next */
    if (parts.length === 0) {
      return;
    }

    if (this.id) {
      this.appendIdtoPart(parts, 'id', this.id);
    }

    for (let i = 0; i < this.attributes.length; i++) {
      if (this.attributes[i].name.includes('data-') && this.attributes[i].name.includes('id')) {
        this.appendIdtoPart(
          parts, this.attributes[i].name,
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
      /* istanbul ignore next */
      if (label) {
        label.setAttribute('for', newId);
      }
      /* istanbul ignore next */
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
        attribPropNameDict[name] = stringUtils.camelCase(name);
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
    if (!this.template || !this.template()) {
      return this;
    }

    // Make template and shadow objects
    const template = document.createElement('template');

    if (this.shadowRoot?.innerHTML) {
      this.shadowRoot.innerHTML = '';
      // Append the style sheet for safari
      if (!this.shadowRoot.adoptedStyleSheets) {
        this.hasStyles = false;
        this.appendStyles();
      }
    }

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    this.appendStyles();
    template.innerHTML = this.template();
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    /** @type {any} */
    this.container = this.shadowRoot?.querySelector(`.${this.name}`);
    if (!this.shadowRoot.adoptedStyleSheets && !this.container) {
      this.container = this.shadowRoot?.firstElementChild.nextSibling;
    }
    /* istanbul ignore next */
    if (!this.container) {
      this.container = this.shadowRoot?.firstElementChild;
    }

    // Runs on next next paint to be sure rendered() fully
    if (this.rendered) {
      renderLoop.register(new IdsRenderLoopItem({
        duration: 1,
        timeoutCallback: () => {
          this.rendered();
          // Remove any close hidden element to avoid FOUC
          this.closest('div[role="main"][hidden]')?.removeAttribute('hidden');
          this.closest('ids-container')?.removeAttribute('hidden');
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
   * Append Styles if present
   * @private
   */
  appendStyles() {
    if (this.hasStyles) {
      return;
    }

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
    this.hasStyles = true;
  }
}

export {
  IdsElement,
  customElement,
  appendIds,
  mix,
  scss,
  attributes
};
