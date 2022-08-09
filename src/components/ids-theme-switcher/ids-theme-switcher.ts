import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-theme-switcher-base';
import '../ids-menu-button/ids-menu-button';
import styles from './ids-theme-switcher.scss';

/**
 * IDS Theme Switcher Component
 */
@customElement('ids-theme-switcher')
@scss(styles)
export default class IdsThemeSwitcher extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    this.#attachEventHandlers();
    super.connectedCallback?.();
  }

  /**
   * Establish Internal Event Handlers
   * @private
   */
  #attachEventHandlers() {
    this.onEvent('selected.themeswitcher', this.shadowRoot.querySelector('ids-popup-menu'), (e: CustomEvent) => {
      const val = e.detail.elem.value;
      if (val === 'classic' || val === 'new') {
        this.version = val;
      }
      if (val === 'light' || val === 'dark' || val === 'contrast') {
        this.mode = val;
      }
      if (val?.indexOf('-') > -1) {
        (document.querySelector('ids-container') as any).setLocale(val);
      }
    });

    requestAnimationFrame(() => {
      this.onEvent('languagechange.themeswitcher', this.closest('ids-container'), (e: CustomEvent) => {
        this.shadowRoot.querySelector('#ids-theme-menu').innerHTML = this.menuTemplate();
        this.shadowRoot.querySelector('#locale-menu [selected]').removeAttribute('selected');
        this.shadowRoot.querySelector(`#locale-menu [value="${e.detail.locale.state.localeName}"]`)?.setAttribute('selected', 'true');
      });
    });
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<ids-menu-button id="ids-theme-switcher" menu="ids-theme-menu" color-variant="${this.colorVariant}">
            <ids-icon slot="icon" icon="more"></ids-icon>
            <span class="audible">Theme Switcher</span>
        </ids-menu-button><ids-popup-menu id="ids-theme-menu" target="#ids-theme-switcher" trigger-type="click">
        ${this.menuTemplate()}</ids-popup-menu>`;
  }

  /**
   * Create the popup part of the template for the contents
   * @returns {string} The template
   */
  menuTemplate(): string {
    return `<ids-menu-group>
    <ids-menu-item>
        ${this.locale?.translate('Mode')}
        <ids-popup-menu>
          <ids-menu-group select="single">
            <ids-menu-item selected="true" value="light">${this.locale?.translate('Light')}</ids-menu-item>
            <ids-menu-item value="dark">${this.locale?.translate('Dark')}</ids-menu-item>
            <ids-menu-item value="contrast">${this.locale?.translate('Contrast')}</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      </ids-menu-item>
      <ids-menu-item>
        ${this.locale?.translate('Locale')}
        <ids-popup-menu>
          <ids-menu-group select="single" id="locale-menu">
            <ids-menu-item selected="true" value="en-US">${this.locale?.translate('English')} (en-US)</ids-menu-item>
            <ids-menu-item value="de-DE">${this.locale?.translate('German')} (de-DE)</ids-menu-item>
            <ids-menu-item value="uk-UA">${this.locale?.translate('Ukrainian')} (uk-UA)</ids-menu-item>
            <ids-menu-item value="bg-BG">${this.locale?.translate('Bulgarian')} (bg-BG)</ids-menu-item>
            <ids-menu-item value="he-IL">${this.locale?.translate('Hebrew')} (he-IL)</ids-menu-item>
            <ids-menu-item value="ar-EG">${this.locale?.translate('Arabic')} (ar-EG)</ids-menu-item>
            <ids-menu-item value="th-TH">${this.locale?.translate('Bulgarian')} (th-TH)</ids-menu-item>
            <ids-menu-item value="zh-Hans">${this.locale?.translate('Chinese')} (zh-Hans)</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      </ids-menu-item>
    </ids-menu-group>`;
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [...super.attributes, attributes.LANGUAGE, attributes.MODE, attributes.VERSION];
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants: Array<string> = ['alternate'];

  /**
   * Set the mode of the current theme
   * @param {string} value The mode value for example: light, dark, or high-contrast
   */
  set mode(value: string) {
    if (value) {
      this.setAttribute('mode', value);
      this.triggerEvent('themechanged', this, { detail: { elem: this, mode: value, version: this.version } });
      return;
    }

    this.removeAttribute('mode');
  }

  get mode(): string { return this.getAttribute('mode') || 'light'; }

  /**
   * Set the theme to a particular theme version
   * @param {string} value The version value for example: classic or new
   */
  set version(value: string) {
    if (value) {
      this.setAttribute('version', value);
      this.triggerEvent('themechanged', this, { detail: { elem: this, mode: this.mode, version: value } });
      return;
    }

    this.removeAttribute('version');
  }

  get version(): string { return this.getAttribute('version') || 'new'; }

  /**
   * Implements callback from IdsColorVariantMixin used to
   * update the color variant setting on children components
   */
  onColorVariantRefresh(): void {
    // Updates the inner menu button's color variant, which should match the theme switcher's
    this.container.colorVariant = this.colorVariant;
  }
}
