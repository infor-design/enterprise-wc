import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core/ids-element';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../../mixins';

import styles from './ids-header.scss';
import IdsInput from '../ids-input/ids-input';
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

class IdsHeader extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
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

export default IdsHeader;
