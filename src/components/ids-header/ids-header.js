import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes'
import IdsInput from '../ids-input/ids-input';
import styles from './ids-header.scss';
import Base from './ids-header-base';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

/**
 * IDS Header Component
 * @type {IdsHeader}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-header')
@scss(styles)

export default class IdsHeader extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.COLOR,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * Create the template for the header contents
   * @returns {string} The template
   */
  template() {
    return `
    <div class="ids-header">
      <slot></slot>
    </div>`;
  }

  /**
   * Sets the color attribute
   * @param {string} c string value for color
   */
  set color(c) {
    if (typeof c !== 'string' || !c.length) {
      return;
    }
    const sanitzedVal = stripHTML(c);
    this.container.style.backgroundColor = sanitzedVal;
    this.setAttribute('color', sanitzedVal);
  }

  get color() {
    return this.getAttribute('color') || '#0072ed';
  }
}
