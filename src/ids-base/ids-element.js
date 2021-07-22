import {
  customElement,
  appendIds,
  version,
  scss
} from './ids-decorators';

import { attributes } from './ids-attributes';
import mix from '../ids-mixins/ids-mixin-builder';
import renderLoop from '../ids-render-loop/ids-render-loop-global';
import IdsRenderLoopItem from '../ids-render-loop/ids-render-loop-item';
import { stringUtils } from './ids-string-utils';

const areAdoptedStyleSheetsSupported = (
  window.ShadowRoot
  && (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow)
  && 'adoptedStyleSheets' in Document.prototype
  && 'replace' in CSSStyleSheet.prototype
);

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
const memodAttribPropNames = Object.fromEntries(
  Object.entries(attributes).map(([_, attrib]) => (
    [attrib, stringUtils.camelCase(attrib)]
  ))
);

/**
 * cache for ids-component styles to avoid reconstruction/parsing
 * objects and/or stylesheets for repeated components once seen/parsed.
 *
 * note: if we end change our style solution to not only
 * rely on  .scss we may need to consider the key of objects as hash
 * or just make the object nested levels to make sure we don't
 * pool unrelated styles.
 * @type {object.<string, CSSStyleSheet>}
 */
const memodComponentStyles = {};

/**
 * creates a component style to add to
 * memodComponentStyles
 *
 * @param {string} namespace namespace of component e.g. ids-text
 * @param {string} cssStyles the CSS Styles for the component
 * @returns {HTMLElement} style tag object
 */
function getMemodComponentStyle(namespace, cssStyles) {
  // if cache doesn't exist, create the stylesheet depending on
  // whether adopted stylesheets are supported or not by
  // the browser

  if (!memodComponentStyles[namespace]) {
    if (!areAdoptedStyleSheetsSupported) {
      const style = document.createElement('style');
      style.textContent = cssStyles;
      if (/^:(:)?host/.test(style.textContent)) {
        style.textContent = style.textContent.replace(/^:(:)?host/, `.${namespace}`);
      }
      style.setAttribute('nonce', '0a59a005'); // TODO: Make this a setting
      memodComponentStyles[namespace] = style;
    }

    if (areAdoptedStyleSheetsSupported) {
      const style = new CSSStyleSheet();
      style.replaceSync(cssStyles);
      memodComponentStyles[namespace] = style;
    }
  }

  return memodComponentStyles[namespace];
}

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
      if (!memodAttribPropNames[name]) {
        memodAttribPropNames[name] = stringUtils.camelCase(name);
      }

      this[memodAttribPropNames[name]] = newValue;
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

    if (this.shadowRoot.adoptedStyleSheets) {
      this.appendStyles();
    }

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

    // Remove any close hidden element to avoid FOUC
    this.closest('div[role="main"][hidden]')?.removeAttribute('hidden');
    this.closest('ids-container')?.removeAttribute('hidden');

    // Runs on next next paint to be sure rendered() fully
    if (this.rendered) {
      renderLoop.register(new IdsRenderLoopItem({
        duration: 1,
        timeoutCallback: () => { this.rendered(); }
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

    if (this.cssStyles) {
      const style = getMemodComponentStyle(this.name, this.cssStyles);

      if (!areAdoptedStyleSheetsSupported && typeof this.cssStyles === 'string') {
        this.shadowRoot?.appendChild(style);
      }

      if (areAdoptedStyleSheetsSupported) {
        this.shadowRoot.adoptedStyleSheets = [style];
      }
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
  attributes,
  stringUtils
};
