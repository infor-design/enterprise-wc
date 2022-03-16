import { attributes } from '../../core/ids-attributes';

/**
 * A mixin that adds theming functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsThemeMixin = (superclass: any) => class extends superclass {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.initThemeHandlers();
  }

  /**
   * Init the mixin events and states
   * @private
   */
  initThemeHandlers() {
    this.switcher = document.querySelector('ids-theme-switcher');
    if (!this.switcher) {
      return;
    }

    this.mode = this.switcher.mode;
    this.version = this.switcher.version;

    this.onEvent('themechanged', this.switcher, (e: CustomEvent) => {
      this.mode = e.detail.mode;
      this.version = e.detail.version;
    });
  }

  /**
   * Set the mode of the current theme
   * @param {string} value The mode value for example: light, dark, or contrast
   */
  set mode(value: string) {
    this.setAttribute('mode', value);
    this.container.setAttribute('mode', value);
  }

  get mode(): string { return this.getAttribute('mode') || 'light'; }

  /**
   * Set the theme to a particular theme version
   * @param {string} value The version value for example: classic or new
   */
  set version(value: string) {
    this.setAttribute('version', value);
    this.container.setAttribute('version', value);
  }

  get version(): string { return this.getAttribute('version') || 'new'; }
};

export default IdsThemeMixin;
