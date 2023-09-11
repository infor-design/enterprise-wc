import IdsGlobal from '../components/ids-global/ids-global';
import { camelCase } from '../utils/ids-string-utils/ids-string-utils';

export type IdsBaseConstructor = new (...args: any[]) => IdsElement;
export type IdsConstructor<T> = new (...args: any[]) => T & IdsElement;

/**
 * IDS Base Element
 */
export default class IdsElement extends HTMLElement {
  /** Component's name */
  name?: string;

  /** State object for current states */
  state: Record<string, any> = {};

  /** Nonce used for scripts, links */
  cachedNonce = '';

  /** Component's first child element */
  container?: HTMLElement | null = null;

  /** Styles Flag */
  hasStyles = false;

  constructor(public args?: { noShadowRoot?: boolean, noStyles?: boolean }) {
    super();

    if (!args?.noShadowRoot) {
      this.#addBaseName();
      this.#appendHostCss();
    }
  }

  /** Run the template when a component Is inserted */
  connectedCallback() {
    if (!this.args?.noShadowRoot) this.render();
  }

  /**
   * Add a base name property
   * @private
   */
  #addBaseName() {
    // Add the base name
    this.name = this.nodeName?.toLowerCase();
  }

  /**
   * Handle Setting changes of the value has changed by calling the getter
   * in the extending class.
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // TODO: Prevent double calls
    if (oldValue === newValue) return;

    /**
     * Maps global html attributes/property changes to
     * their internal component callbacks
     */
    const self = this as any;
    const setter = {
      id: self.onIdChange,
      hidden: self.onHiddenChange,
      title: self.onTitleChange
    }[name];

    if (typeof setter === 'function') {
      setter.call(this, newValue);
      return;
    }

    /**
     * Fixes our handling of kebab-to-camelCase conversions in some specific cases
     * where HTMLElement uses different casing internally.
     * @param {string} thisName the attribute name to check
     * @returns {string} corrected camelCase (or not) attribute name
     */
    const getAttributeName = (thisName: string): string => {
      switch (thisName) {
        case 'tabindex':
          return (typeof this.tabIndex === 'number') ? 'tabIndex' : 'tabindex';
        default:
          return camelCase(thisName);
      }
    };

    (this as any)[getAttributeName(name)] = newValue;
  }

  /**
   * Release events and cleanup, if implementing disconnectedCallback
   * in a component you can just call super.
   */
  disconnectedCallback() {
    (this as any).cssStyles = null;
    (this as any).popupOpenEventsTarget = null;
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
   * @param {string} force force to (re)render the component
   * @returns {object} The object for chaining.
   */
  render(force?: boolean) {
    if ((!this.template || this.shadowRoot) && !force) {
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

    // TODO: Is this the fastest way to do this but why use constructed style sheets
    // TODO: Can it be done in one shot (including the remove above)
    this.appendStyles();
    template.innerHTML = templateHTML;
    // TODO: Is insertAdjacentHTML faster than appendChild vs creating a template
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    this.container = this.shadowRoot?.querySelector(`.${this.name}`);
    if (this.shadowRoot?.firstElementChild?.nodeName === 'STYLE' && !this.container) {
      this.container = (this.shadowRoot?.firstElementChild.nextElementSibling as HTMLElement);
    }

    if (this.shadowRoot?.firstElementChild?.nodeName !== 'STYLE' && !this.container) {
      this.container = (this.shadowRoot?.firstElementChild as HTMLElement);
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
    if (this.hasStyles || this.args?.noStyles) {
      return;
    }

    const style = document.createElement('style');
    style.textContent = (this as any).cssStyles;
    if (this.nonce) style.setAttribute('nonce', this.nonce);

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
      win.idsStylesAdded = true;
      this.theme = 'default-light';
    }
  }

  /**
   * Append theme css
   * @param {string} theme name of the theme
   * @private
   */
  set theme(theme: string) {
    this.loadTheme(theme);
    document.body.querySelector('ids-theme-switcher')?.setAttribute('theme', theme);
  }

  lastTheme = '';

  /**
   * Get the theme and load it
   * @param {string} theme name of the theme
   */
  async loadTheme(theme: string) {
    // Reduce http requests
    if (this.lastTheme === theme) return;
    this.lastTheme = theme;

    const themeLoaded = IdsGlobal.onThemeLoaded();

    // Handle setting theme via links
    document.querySelector('ids-container')?.setAttribute('hidden', '');
    const themeLink = document.querySelector('link[href*="ids-theme"]');
    if (themeLink) {
      const href = themeLink.getAttribute('href');
      const filename = href?.replace(/^.*[\\/]/, '') || '';
      themeLink.setAttribute('href', href?.replace(filename, `ids-theme-${theme}.css`) || '');
      setTimeout(() => {
        document.querySelector('ids-container')?.removeAttribute('hidden');
        themeLoaded.resolve();
      }, 150);
      return;
    }

    const isSelfManaged = document.querySelector('ids-theme-switcher[self-managed]');
    if (isSelfManaged) return;

    // Handle auto themes
    const response = await fetch(`../themes/ids-theme-${theme}.css`, { cache: 'reload' });
    const themeStyles = await response.text();
    const head = (document.head as any);
    const styleElem = document.querySelector('#ids-theme');
    const style = styleElem || document.createElement('style');

    const localeFonts = `
      html[lang='ar'] {--ids-font-family-default: var(--ids-font-family-ar)}
      html[lang='he'] {--ids-font-family-default: var(--ids-font-family-he)}
      html[lang='hi'] {--ids-font-family-default: var(--ids-font-family-hi)}
      html[lang='ja'] {--ids-font-family-default: var(--ids-font-family-ja)}
      html[lang='ko'] {--ids-font-family-default: var(--ids-font-family-ko)}
      html[lang='th'] {--ids-font-family-default: var(--ids-font-family-th)}
      html[lang='zh-Hans'] {--ids-font-family-default: var(--ids-font-family-zh-hans)}
      html[lang='zh-Hant'] {--ids-font-family-default: var(--ids-font-family-zh-hant)}
    `;
    style.textContent = `${themeStyles}${localeFonts}`;
    style.id = 'ids-theme';
    if (this.nonce) style.setAttribute('nonce', this.nonce);
    if (!styleElem) {
      const titleElem = (head.querySelector('title') as HTMLElement);
      if (titleElem) head.insertBefore(style, titleElem.nextElementSibling);
      else head.insertAdjacentHTML('beforeend', style);
    }
    this.loadLegacyTheme(theme);
    setTimeout(() => {
      document.querySelector('ids-container')?.removeAttribute('hidden');
      themeLoaded.resolve();
    }, 150);
  }

  /**
   * Switch the theme in 4.x components
   * @param {string} value The theme value for example: default-light
   */
  loadLegacyTheme(value: string): void {
    let styleSheet: any = document.querySelector('#stylesheet');
    if (!styleSheet) styleSheet = document.querySelector('#sohoxi-stylesheet');
    if (!styleSheet) return;

    const href = styleSheet?.getAttribute('href');
    const mappedTheme = value.replace('default', 'theme-new');
    if (!href) return;
    styleSheet?.setAttribute('href', href.replace('theme-new-light', mappedTheme).replace('theme-new-dark', mappedTheme).replace('theme-new-contrast', mappedTheme));
  }
}
