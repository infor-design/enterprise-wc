import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-container-base';
import locale from '../ids-locale/ids-locale-global';

import styles from './ids-container.scss';

/**
 * IDS Container Component
 * @type {IdsContainer}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @part container - the entire container element
 */
@customElement('ids-container')
@scss(styles)
export default class IdsContainer extends Base {
  constructor() {
    super();
    this.state.locale = locale;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();

    // Reset body by default
    this.setAttribute(attributes.RESET, '');

    // Set initial lang and locale
    this.setAttribute('language', this.state.locale.state.language);
    this.setAttribute('locale', this.state.locale.state.localeName);

    // Remove hidden for FOUC
    this.onEvent('load.container', window, () => {
      this.removeAttribute('hidden');
      this.offEvent('load.container', window);
    });

    // In some cases the page may be loaded
    if (document.readyState === 'complete') {
      this.removeAttribute('hidden');
    }
    if (this.padding) {
      this.container?.style.setProperty('padding', `${this.padding}px`);
    }
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.LANGUAGE,
      attributes.LOCALE,
      attributes.PADDING,
      attributes.RESET,
      attributes.SCROLLABLE,
      attributes.MODE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-container" part="container"${this.scrollable === 'true' ? ' tabindex="0"' : ''}><slot></slot></div>`;
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate'];

  /**
   * If set to number the container will have padding added (in pixels)
   * @param {string | null} value sets the padding to the container
   */
  set padding(value: string | null) {
    if (value) {
      this.setAttribute(attributes.PADDING, value.toString());
      this.container?.style.setProperty('padding', `${value}px`);
    } else {
      this.removeAttribute(attributes.PADDING);
    }
  }

  get padding(): string | null {
    return this.getAttribute(attributes.PADDING);
  }

  /**
   * If set to true the container is scrollable
   * @param {boolean|string} value true of false depending if the tag is scrollable
   */
  set scrollable(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SCROLLABLE, 'true');
      this.container?.setAttribute(attributes.SCROLLABLE, 'true');
      this.container?.setAttribute('tabindex', '0');
      return;
    }

    this.setAttribute(attributes.SCROLLABLE, 'false');
    this.container?.setAttribute(attributes.SCROLLABLE, 'false');
    this.container?.removeAttribute('tabindex');
  }

  get scrollable(): boolean | string { return this.getAttribute(attributes.SCROLLABLE) || 'true'; }

  /**
   * Add the reset to the body
   * @private
   */
  #addReset() {
    document.body.style.margin = '0';
  }

  /**
   * If set to true body element will get reset
   * @param {boolean} value true of false
   */
  set reset(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.RESET, '');
      this.#addReset();
    } else {
      this.removeAttribute(attributes.RESET);
      document.body.style.margin = '';
    }
  }

  get reset(): boolean {
    return this.hasAttribute(attributes.RESET);
  }

  /**
   * Set the language for a component and wait for it to finish (async)
   * @param {string} value The language string value
   */
  async setLanguage(value: string) {
    await this.state.locale.setLanguage(value);
    this.language = value;
    this.triggerEvent('languagechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
  }

  /**
   * Set the language for a component
   * @param {string} value The language string value
   */
  set language(value: string) {
    if (value) {
      this.state.locale.setLanguage(value);
      this.state.locale.updateLangTag(this, value);
      this.setAttribute('language', value);
      requestAnimationFrame(() => {
        this.triggerEvent('languagechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
      });
    }
  }

  /**
   * Get the language data keys and message for the current language
   * @returns {object} The language data object
   */
  get language(): string {
    return this.state?.locale?.language;
  }

  /**
   * Set the locale for a component and wait for it to finish (async)
   * @param {string} value The locale string value
   */
  async setLocale(value: string) {
    if (value) {
      await this.state.locale.setLocale(value);
      const lang = this.state.locale.correctLanguage(value);
      this.setAttribute('locale', value);
      this.setAttribute('language', lang);
      this.state.locale.updateLangTag(this, lang);
      this.triggerEvent('localechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
    }
  }

  /**
   * Set the locale for a component
   * @param {string} value The locale string value
   */
  set locale(value: string) {
    if (value) {
      this.state.locale.setLocale(value);
      const lang = this.state.locale.correctLanguage(value);
      this.setAttribute('locale', value);
      this.setAttribute('language', lang);
      this.state.locale.updateLangTag(this, lang);

      requestAnimationFrame(() => {
        this.triggerEvent('localechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
      });
    }
  }

  get locale(): any {
    return this.state.locale;
  }

  get localeName(): string {
    return this.state.locale.state.localeName;
  }
}
