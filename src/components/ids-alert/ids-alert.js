/* eslint-disable no-nested-ternary */
import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { sizes } from '../ids-icon/ids-icon-attributes';

import Base from './ids-alert-base';
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
export default class IdsAlert extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The propertires in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.ICON,
      attributes.SIZE
    ];
  }

  /**
   * Create the Template for the contents
   *
   * @returns {string} The template
   */
  template() {
    const cssClass = stringToBool(this.disabled) ? ' class="disabled"' : '';
    return `<ids-icon size="${this.size}"${cssClass} part="icon"></ids-icon>`;
  }

  /**
   * Sets to disabled
   * @param {boolean|string?} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const icon = this.shadowRoot?.querySelector('ids-icon');
    const val = stringToBool(value);
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
   * @param {string | null} value The Icon Type [success, info, error, warning]
   */
  set icon(value) {
    let icon = value;
    if (value) {
      this.setAttribute(attributes.ICON, value);
      if (icon === 'warning') {
        icon = 'alert';
      }
      if (icon === 'warning-solid') {
        icon = 'alert-solid';
      }
      this.shadowRoot?.querySelector('ids-icon')?.setAttribute(attributes.ICON, icon);
    } else {
      this.removeAttribute(attributes.ICON);
    }
  }

  /**
   * Return the size. May be large, normal/medium or small
   * @returns {string} the size
   */
  get size() { return this.getAttribute(attributes.SIZE) || 'normal'; }

  set size(value) {
    if (value && sizes[value]) {
      this.setAttribute(attributes.SIZE, value);
      this.container.querySelector('ids-icon')?.setAttribute(attributes.SIZE);
    } else {
      this.removeAttribute(attributes.SIZE);
      this.container.querySelector('ids-icon')?.removeAttribute(attributes.SIZE);
    }
  }
}
