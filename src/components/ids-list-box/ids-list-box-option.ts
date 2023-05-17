import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-list-box-option.scss';

const Base = IdsTooltipMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS List Box Option Component
 * @type {IdsListBoxOption}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsTooltipMixin
 * @part option - the option element
 */
@customElement('ids-list-box-option')
@scss(styles)
export default class IdsListBoxOption extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array<any>} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [
      ...super.attributes,
      attributes.GROUP_LABEL,
      attributes.TOOLTIP,
      attributes.VALUE
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', this.hasAttribute(attributes.GROUP_LABEL) ? 'none' : 'option');
    this.setAttribute('tabindex', '-1');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<slot></slot>`;
  }

  set value(val: string | null) {
    if (val) this.setAttribute(attributes.VALUE, `${val}`);
    else this.removeAttribute(attributes.VALUE);
  }

  get value(): string | null {
    return this.getAttribute(attributes.VALUE);
  }
}
