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
      attributes.MODE
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.initThemeHandlers();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.offEvent('themechanged');
    this.switcher = null;
  }

  /**
   * Init the mixin events and states
   * @private
   */
  initThemeHandlers() {
    const switcher: any = document.querySelector('ids-theme-switcher');
    if (!switcher) {
      return;
    }

    this.mode = switcher.mode;

    this.onEvent('themechanged', switcher, (e: CustomEvent) => {
      this.mode = e.detail.mode;
    });
  }

  /**
   * Set the mode of the current theme
   * @param {string} value The mode value for example: light, dark, or contrast
   */
  set mode(value: string) {
    if (value === undefined) value = 'light';
    this.setAttribute('mode', value);
    this.container?.setAttribute('mode', value);
  }

  get mode(): string { return this.getAttribute('mode') || 'light'; }
};

export default IdsThemeMixin;
