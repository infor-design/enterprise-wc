import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-list-box-option-base';

import styles from './ids-list-box-option.scss';

/**
 * IDS List Box Option Component
 * @type {IdsListBoxOption}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
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
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.TOOLTIP
    ];
  }

  connectedCallback() {
    this.setAttribute('role', 'option');
    this.setAttribute('tabindex', '-1');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<slot></slot>`;
  }
}
