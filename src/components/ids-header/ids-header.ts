import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';
import IdsPersonalization from '../ids-personalize/ids-personalize';
import styles from './ids-header.scss';

/**
 * IDS Header Component
 * @type {IdsHeader}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-header')
@scss(styles)
export default class IdsHeader extends IdsKeyboardMixin(IdsEventsMixin(IdsElement)) {
  colorVariants: string[] = ['alternate'];

  constructor() {
    super();
  }

  personalization?: IdsPersonalization;

  connectedCallback() {
    super.connectedCallback();
    // Set initial color
    const initialColor = this.getAttribute('color');
    if (initialColor) this.color = initialColor;
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.COLOR
    ];
  }

  /**
   * Create the template for the header contents
   * @returns {string} The template
   */
  template(): string {
    return `
    <div class="ids-header">
      <slot></slot>
    </div>`;
  }

  /**
   * Sets the color attribute
   * @param {string} value string value for color
   */
  set color(value: string) {
    if (typeof value !== 'string' || !value.length) {
      return;
    }
    const sanitzedVal = stripHTML(value);

    this.personalization = new IdsPersonalization();
    this.personalization!.color = sanitzedVal;
  }

  get color(): string {
    return this.getAttribute('color') || '#fff';
  }
}
