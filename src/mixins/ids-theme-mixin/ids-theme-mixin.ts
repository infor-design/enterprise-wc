import type IdsThemeSwitcher from '../../components/ids-theme-switcher/ids-theme-switcher';
import { attributes } from '../../core/ids-attributes';
import { IdsConstructor, IdsWebComponent } from '../../core/ids-interfaces';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';

type Constrainsts = IdsConstructor<IdsWebComponent & EventsMixinInterface>;

export const THEME_MODES = ['light', 'dark', 'contrast'];

/**
 * A mixin that adds theming functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsThemeMixin = <T extends Constrainsts>(superclass: T) => class extends superclass {
  switcher: IdsThemeSwitcher | null = null;

  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.MODE
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

    this.onEvent('themechanged', this.switcher, (e: CustomEvent) => {
      this.mode = e.detail.mode;
    });
  }

  /**
   * Set the mode of the current theme
   * @param {string} value The mode value for example: light, dark, or contrast
   */
  set mode(value: string) {
    if (!THEME_MODES.includes(value)) value = 'light';
    this.setAttribute('mode', value);
    this.container?.setAttribute('mode', value);
  }

  /**
   * Get the mode of the current theme
   * @returns {string} light, dark, or contrast
   */
  get mode(): string {
    return this.getAttribute('mode') || 'light';
  }
};

export default IdsThemeMixin;
