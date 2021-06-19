import {
  IdsElement,
  customElement,
  scss,
  attributes,
  stringUtils,
  mix
} from '../ids-base';

import { IdsEventsMixin, IdsThemeMixin } from '../ids-mixins';

import IdsIcon from '../ids-icon/ids-icon';

import styles from './ids-alert.scss';

/**
 * IDS Alert Component
 * @type {IdsAlert}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part icon - the icon element
 */
@customElement('ids-alert')
@scss(styles)
class IdsAlert extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The propertires in an array
   */
  static get attributes() {
    return [attributes.ICON, attributes.DISABLED, attributes.MODE, attributes.VERSION];
  }

  /**
   * Create the Template for the contents
   *
   * @returns {string} The template
   */
  template() {
    const cssClass = stringUtils.stringToBool(this.disabled) ? ' class="disabled"' : '';
    return `<ids-icon size="normal"${cssClass} part="icon"></ids-icon>`;
  }

  /**
   * Sets to disabled
   * @param {boolean|string?} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const icon = this.shadowRoot?.querySelector('ids-icon');
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
      icon?.classList.add(attributes.DISABLED);
    } else {
      this.removeAttribute(attributes.DISABLED);
      icon?.classList.remove(attributes.DISABLED);
    }
  }

  get disabled() { return this.getAttribute(attributes.DISABLED); }

  /**
   * Return the icon of the alert.
   * @returns {string | null} the path data
   */
  get icon() { return this.getAttribute(attributes.ICON); }

  /**
   * Set the icon
   * @param {string | null} value The Icon Type [success, info, error, alert]
   */
  set icon(value) {
    if (value) {
      this.setAttribute(attributes.ICON, value);
      this.shadowRoot?.querySelector('ids-icon')?.setAttribute(attributes.ICON, value);
    } else {
      this.removeAttribute(attributes.ICON);
    }
  }
}

export default IdsAlert;
