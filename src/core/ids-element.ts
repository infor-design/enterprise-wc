import { version } from './ids-attributes';
import renderLoop from '../components/ids-render-loop/ids-render-loop-global';
import IdsRenderLoopItem from '../components/ids-render-loop/ids-render-loop-item';
import { camelCase } from '../utils/ids-string-utils/ids-string-utils';
import IdsEventsMixin from '../mixins/ids-events-mixin/ids-events-mixin';
import styles from './ids-element.scss';

/**
 * IDS Base Element
 */
export default class IdsElement extends IdsEventsMixin(HTMLElement) {
  constructor() {
    super();
    this.addBaseName();
    this.render();
    this.#appendHostCss();
  }

  /** Component's name */
  name?: string;

  /** Ids Version No */
  IdsVersion?: string;

  /** State object for current states */
  state?: Record<string, unknown>;

  /**
   * Add the component name and baseclass
   * @private
   */
  addBaseName() {
    // Add the base class and version
    this.name = this.nodeName?.toLowerCase();
    this.IdsVersion = version;
  }

  /**
   * Handle Setting changes of the value has changed by calling the getter
   * in the extending class.
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this[camelCase(name)] = newValue;
    }
  }

  /**
   * Release events and cleanup, if implementing disconnectedCallback
   * in a component you can just call super.
   */
  disconnectedCallback() {
    this.detachAllEvents();
    if (this.detachAllListeners) {
      this.detachAllListeners();
    }
    delete this.cssStyles;
    delete this.attribPropNameDict;
    delete this.popupOpenEventsTarget;
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
  static get attributes(): Array<string> {
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
    const documentElement: any = document;
    if (!documentElement.nonce) {
      const csp: any = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (csp) {
        let nonce = csp.getAttribute('content').match(/'nonce-(.*?)'/g);
        nonce = nonce ? nonce[0]?.replace('\'nonce-', '').replace('\'', '') : undefined;
        documentElement.nonce = nonce;
      }
    }
    return documentElement.nonce || '0a59a005';
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

  /**
   * Append One host css
   * @private
   */
  #appendHostCss() {
    const win = (window as any);
    if (!win.idsStylesAdded) {
      const doc = (document.head as any);
      const style = document.createElement('style');
      style.textContent = styles.replace(':host {', ':root {');
      style.id = 'ids-styles';
      style.setAttribute('nonce', this.nonce);

      doc.appendChild(style);
      win.idsStylesAdded = true;
    }
  }
}
