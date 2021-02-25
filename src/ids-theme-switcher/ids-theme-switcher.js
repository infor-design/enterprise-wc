import {
  IdsElement,
  customElement,
  mix,
  props
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
// @ts-ignore
import IdsMenuButton from '../ids-menu-button/ids-menu-button';

/**
 * IDS Theme Switcher Component
 */
@customElement('ids-theme-switcher')
class IdsThemeSwitcher extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    this.handleEvents();
  }

  /**
   * Establish Internal Event Handlers
   * @private
   */
  handleEvents() {
    // Handle Clicking the x for dismissible
    // Ensure icon is always last
    this.onEvent('selected', this.shadowRoot.querySelector('ids-popup-menu'), (e) => {
      const val = e.detail.elem.value;
      if (val === 'classic' || val === 'new') {
        this.version = val;
      }
      if (val === 'light' || val === 'dark' || val === 'contrast') {
        this.mode = val;
      }
    });
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-theme-switcher">
        <ids-menu-button id="ids-theme-switcher" menu="ids-theme-menu">
            <ids-icon slot="icon" icon="more"></ids-icon>
            <span class="audible">Theme Switcher</span>
        </ids-menu-button>
        <ids-popup-menu id="ids-theme-menu" target="ids-theme-switcher" trigger="click">
          <ids-menu-group>
            <ids-menu-item>
              Theme
              <ids-popup-menu>
                <ids-menu-group select="single">
                  <ids-menu-item selected="true" value="new">New</ids-menu-item>
                  <ids-menu-item value="classic">Classic</ids-menu-item>
                </ids-menu-group>
              </ids-popup-menu>
            </ids-menu-item>
            <ids-menu-item>
              Mode
              <ids-popup-menu>
                <ids-menu-group select="single">
                  <ids-menu-item selected="true" value="light">Light</ids-menu-item>
                  <ids-menu-item value="dark">Dark</ids-menu-item>
                  <ids-menu-item value="contrast">High Contrast</ids-menu-item>
                </ids-menu-group>
              </ids-popup-menu>
            </ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      </div>`;
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.MODE, props.VERSION];
  }

  /**
   * Set the mode of the current theme
   * @param {string} value The mode value for example: light, dark, or high-contrast
   */
  set mode(value) {
    if (value) {
      this.setAttribute('mode', value);
      this.triggerEvent('themechanged', this, { detail: { elem: this, mode: value, version: this.version } });
      return;
    }

    this.removeAttribute('color');
  }

  get mode() { return this.getAttribute('mode') || 'light'; }

  /**
   * Set the theme to a particular theme version
   * @param {string} value The version value for example: classic or new
   */
  set version(value) {
    if (value) {
      this.setAttribute('version', value);
      this.triggerEvent('themechanged', this, { detail: { elem: this, mode: this.mode, version: value } });
      return;
    }

    this.removeAttribute('version');
  }

  get version() { return this.getAttribute('version') || 'new'; }
}

export default IdsThemeSwitcher;
