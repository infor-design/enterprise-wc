import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-menu-button/ids-menu-button';
import styles from './ids-theme-switcher.scss';
import type IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import type IdsMenuButton from '../ids-menu-button/ids-menu-button';

const Base = IdsLocaleMixin(
  IdsColorVariantMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Theme Switcher Component
 */
@customElement('ids-theme-switcher')
@scss(styles)
export default class IdsThemeSwitcher extends Base {
  popup?: IdsPopupMenu | null;

  menuButton?: IdsMenuButton | null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.popup = this.shadowRoot?.querySelector('ids-popup-menu');
    this.menuButton = this.shadowRoot?.querySelector('ids-menu-button');
    this.menuButton?.configureMenu();
    this.#attachEventHandlers();
  }

  disconnectedCallback() {
    this.popup = null;
    this.menuButton = null;
    this.container = null;
    super.disconnectedCallback();
  }

  /**
   * Establish Internal Event Handlers
   * @private
   */
  #attachEventHandlers() {
    this.onEvent('selected.themeswitcher', this.popup, (e: CustomEvent) => {
      const val = e.detail.elem.value;
      if (val === 'light' || val === 'dark' || val === 'contrast') {
        this.mode = val;
      }
      if (val?.indexOf('-') > -1) {
        if (this.locale) this.locale.setLocale(val);
        (document.querySelector('ids-container') as any).setLocale(val);
      }
    });
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<ids-menu-button id="ids-theme-switcher" menu="ids-theme-menu" color-variant="${this.colorVariant}" icon="more">
      <span class="audible">Theme Switcher</span>
    </ids-menu-button>
    <ids-popup-menu id="ids-theme-menu" target="#ids-theme-switcher" trigger-type="click">
      ${this.menuTemplate()}
    </ids-popup-menu>`;
  }

  /**
   * Create the popup part of the template for the contents
   * @returns {string} The template
   */
  menuTemplate(): string {
    return `<ids-menu-group>
    <ids-menu-item>
      <ids-text translate-text="true">Mode</ids-text>
        <ids-popup-menu>
          <ids-menu-group select="single">
            <ids-menu-item selected="true" value="light">
              <ids-text translate-text="true">Light</ids-text>
              </ids-menu-item>
            <ids-menu-item value="dark">
              <ids-text translate-text="true">Dark</ids-text>
            </ids-menu-item>
            <ids-menu-item value="contrast">
              <ids-text translate-text="true">Contrast</ids-text>
            </ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      </ids-menu-item>
      <ids-menu-item>
        <ids-text translate-text="true">Locale</ids-text>
        <ids-popup-menu>
          <ids-menu-group select="single" id="locale-menu">
            <ids-menu-item selected="true" value="en-US">
              <ids-text translate-text="true">English</ids-text>
              <ids-text>(en-US)</ids-text>
            </ids-menu-item>
            <ids-menu-item value="de-DE">
              <ids-text translate-text="true">German</ids-text>
              <ids-text>(de-DE)</ids-text>
            </ids-menu-item>
            <ids-menu-item value="uk-UA">
              <ids-text translate-text="true">Ukrainian</ids-text>
              <ids-text>(uk-UA)</ids-text>
            </ids-menu-item>
            <ids-menu-item value="bg-BG">
              <ids-text translate-text="true">Bulgarian</ids-text>
              <ids-text>(bg-BG)</ids-text>
            </ids-menu-item>
            <ids-menu-item value="he-IL">
              <ids-text translate-text="true">Hebrew</ids-text>
              <ids-text>(he-IL)</ids-text>
            </ids-menu-item>
            <ids-menu-item value="ar-EG">
              <ids-text translate-text="true">Arabic</ids-text>
              <ids-text>(ar-EG)</ids-text>
            </ids-menu-item>
            <ids-menu-item value="th-TH">
              <ids-text translate-text="true">Thai</ids-text>
              <ids-text>(th-TH)</ids-text>
            </ids-menu-item>
            <ids-menu-item value="zh-Hans">
              <ids-text translate-text="true">Chinese</ids-text>
              <ids-text>(zh-Hans)</ids-text>
            </ids-menu-item>
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
    return [...super.attributes, attributes.LANGUAGE, attributes.MODE];
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
      this.triggerEvent('themechanged', this, { detail: { elem: this, mode: value } });
      return;
    }

    this.removeAttribute('mode');
  }

  get mode(): string { return this.getAttribute('mode') || 'light'; }

  /**
   * Implements callback from IdsColorVariantMixin used to
   * update the color variant setting on children components
   */
  onColorVariantRefresh(): void {
    // Updates the inner menu button's color variant, which should match the theme switcher's
    this.container?.setAttribute(attributes.COLOR_VARIANT, this.colorVariant as string);
  }
}
