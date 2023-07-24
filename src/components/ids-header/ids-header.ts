import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-input/ids-input';

import styles from './ids-header.scss';

const Base = IdsColorVariantMixin(
  IdsKeyboardMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Header Component
 * @type {IdsHeader}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-header')
@scss(styles)
export default class IdsHeader extends Base {
  colorVariants: string[] = ['alternate'];

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#refreshVariants();
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
   * Refresh the color variants on all elements
   * @private
   */
  #refreshVariants() {
    const elementNames = ['ids-button', 'ids-breadcrumb', 'ids-search-field', 'ids-text', 'ids-theme-switcher'];

    if (this.colorVariant !== 'alternate') return;

    for (const element of elementNames) {
      const idsElements = [...this.querySelectorAll<any>(element)];
      idsElements.forEach((elem) => {
        elem.colorVariant = 'alternate';
      });
    }
  }

  /**
   * Sets the color attribute
   * @param {string} c string value for color
   */
  set color(c: string) {
    if (typeof c !== 'string' || !c.length) {
      return;
    }
    const sanitzedVal = stripHTML(c);
    // TODO Use Css Variables to set the color
    if (this.container) this.container.style.backgroundColor = sanitzedVal;
    this.setAttribute('color', sanitzedVal);
  }

  get color(): string {
    return this.getAttribute('color') || '#0072ed';
  }
}
