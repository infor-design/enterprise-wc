import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';
import IdsElement from '../../core/ids-element';

import styles from './ids-layout-flex-item.scss';

// List of flex item options
export const FLEX_ITEM_OPTIONS = {
  alignSelf: ['auto', 'baseline', 'center', 'stretch', 'flex-start', 'flex-end'],
  grow: [0, 1],
  overflow: ['auto', 'hidden', 'visible', 'scroll'],
  shrink: [0, 1]
};

/**
 * IDS Layout Flex Item Component
 * @type {IdsLayoutFlexItem}
 * @inherits IdsElement
 */
@customElement('ids-layout-flex-item')
@scss(styles)
export default class IdsLayoutFlexItem extends IdsElement {
  constructor() {
    super();
  }

  static get attributes(): any {
    return [
      ...super.attributes,
      attributes.ALIGN_SELF,
      attributes.GROW,
      attributes.SHRINK
    ];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  template(): string {
    return `<slot></slot>`;
  }

  /**
   * Set the align self setting
   * @param {string} value The value
   */
  set alignSelf(value: string | null) {
    if (value && FLEX_ITEM_OPTIONS.alignSelf.includes(value)) {
      this.setAttribute(attributes.ALIGN_SELF, value);
    } else {
      this.removeAttribute(attributes.ALIGN_SELF);
    }
  }

  get alignSelf() { return this.getAttribute(attributes.ALIGN_SELF); }

  /**
   * Set the grow setting
   * @param {number|string} value The value
   */
  set grow(value: number | string | null) {
    const val = stringToNumber(value);
    if (!Number.isNaN(val) && FLEX_ITEM_OPTIONS.grow.includes(val)) {
      this.setAttribute(attributes.GROW, String(val));
    } else {
      this.removeAttribute(attributes.GROW);
    }
  }

  get grow() { return this.getAttribute(attributes.GROW); }

  /**
   * Set the shrink setting
   * @param {number|string} value The value
   */
  set shrink(value: number | string | null) {
    const val = stringToNumber(value);
    if (!Number.isNaN(val) && FLEX_ITEM_OPTIONS.shrink.includes(val)) {
      this.setAttribute(attributes.SHRINK, String(val));
    } else {
      this.removeAttribute(attributes.SHRINK);
    }
  }

  get shrink() { return this.getAttribute(attributes.SHRINK); }

  /**
   * Set overflow value on flex item
   * @param {string} val overflow value
   */
  set overflow(val: string | null) {
    if (val && FLEX_ITEM_OPTIONS.overflow.includes(val)) {
      this.setAttribute(attributes.OVERFLOW, val);
    } else {
      this.removeAttribute(attributes.OVERFLOW);
    }
  }

  get overflow(): string | null {
    return this.getAttribute(attributes.OVERFLOW);
  }
}
