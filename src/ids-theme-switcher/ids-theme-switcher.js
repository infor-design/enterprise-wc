import {
  IdsElement,
  customElement
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { props } from '../ids-base/ids-constants';

/**
 * IDS Theme Switcher Component
 */
@customElement('ids-theme-switcher')
class IdsThemeSwitcher extends IdsElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.eventHandlers = new IdsEventsMixin();
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
      console.info(value);
      this.setAttribute('mode', value);
      this.eventHandlers.dispatchEvent('themechanged', this, { detail: { elem: this, mode: value, version: this.version } });
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
      console.info(value);
      this.eventHandlers.dispatchEvent('themechanged', this, { detail: { elem: this, mode: this.mode, version: value } });
      return;
    }

    this.removeAttribute('color');
  }

  get version() { return this.getAttribute('version') || 'new'; }
}

export default IdsThemeSwitcher;
