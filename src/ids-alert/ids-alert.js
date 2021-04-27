import {
  IdsElement,
  customElement,
  scss,
  props,
  mix
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';

import IdsIcon from '../ids-icon/ids-icon';
import { IdsStringUtils as stringUtils } from '../ids-base/ids-string-utils';

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
  static get properties() {
    return [props.ICON, props.DISABLED, props.MODE, props.VERSION];
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
      this.setAttribute(props.DISABLED, val.toString());
      icon?.classList.add(props.DISABLED);
    } else {
      this.removeAttribute(props.DISABLED);
      icon?.classList.remove(props.DISABLED);
    }
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Return the icon of the alert.
   * @returns {string | null} the path data
   */
  get icon() { return this.getAttribute(props.ICON); }

  /**
   * Set the icon
   * @param {string | null} value The Icon Type [success, info, error, alert]
   */
  set icon(value) {
    if (value) {
      this.setAttribute(props.ICON, value);
      this.shadowRoot?.querySelector('ids-icon')?.setAttribute(props.ICON, value);
    } else {
      this.removeAttribute(props.ICON);
    }
  }
}

export default IdsAlert;
