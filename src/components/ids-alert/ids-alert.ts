import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { sizes } from '../ids-icon/ids-icon-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';

import IdsElement from '../../core/ids-element';

import '../ids-icon/ids-icon';
import styles from './ids-alert.scss';

/**
 * IDS Alert Component
 * @type {IdsAlert}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part icon - the icon element
 */
@customElement('ids-alert')
@scss(styles)
export default class IdsAlert extends IdsTooltipMixin(IdsEventsMixin(IdsElement)) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Set the alert color on the tooltip (mixin function)
   * @param {any} tooltip the tooltip element
   */
  beforeTooltipShow(tooltip?: any) {
    // Color the tooltip
    if (tooltip.popup) {
      const hasColor = this.toolTipTarget.getAttribute('color');
      tooltip.popup?.container?.classList.add(`${hasColor || this.toolTipTarget.getAttribute('icon')}-color`);
      tooltip.popup.y = 12;
    }
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The propertires in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.COLOR,
      attributes.DISABLED,
      attributes.ICON,
      attributes.TOOLTIP,
      attributes.SIZE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    const cssClass = stringToBool(this.disabled) ? ' class="disabled"' : '';
    return `<ids-icon size="${this.size}"${cssClass} icon="${this.icon === 'warning' ? 'alert' : this.icon}" part="icon"></ids-icon>`;
  }

  /**
   * Set the alert color
   * @param {string|null} value The color to use between: error, success, info, alert, warning, orange, purple
   */
  set color(value: string | null) {
    if (value) {
      this.setAttribute(attributes.COLOR, value);
      this.shadowRoot?.querySelector('ids-icon')?.setAttribute(attributes.COLOR, value);
    } else {
      this.removeAttribute(attributes.COLOR);
    }
  }

  get color(): string | null {
    return this.getAttribute(attributes.COLOR);
  }

  /**
   * Sets to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value: boolean | string) {
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

  get disabled(): boolean {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Return the icon of the alert.
   * @returns {string | null} the path data
   */
  get icon(): string | null { return this.getAttribute(attributes.ICON); }

  /**
   * Set the icon
   * @param {string | null} value The Icon Type [success, info, error, warning]
   */
  set icon(value: string | null) {
    if (value) {
      this.setAttribute(attributes.ICON, value);
      this.shadowRoot?.querySelector('ids-icon')?.setAttribute(attributes.ICON, value === 'warning' ? 'alert' : value);
    } else {
      this.removeAttribute(attributes.ICON);
    }
  }

  /**
   * Return the size. May be large, normal/medium or small
   * @returns {string} the size
   */
  get size(): string { return this.getAttribute(attributes.SIZE) || 'normal'; }

  set size(value: string | null) {
    if (value && sizes[value]) {
      this.setAttribute(attributes.SIZE, value);
      this.container?.querySelector('ids-icon')?.setAttribute(attributes.SIZE, value);
    } else {
      this.removeAttribute(attributes.SIZE);
      this.container?.querySelector('ids-icon')?.removeAttribute(attributes.SIZE);
    }
  }
}
