import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import IdsElement from '../../core/ids-element';

import styles from './ids-layout-flex.scss';

import './ids-layout-flex-item';

// List of flex options
export const FLEX_OPTIONS = {
  alignContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'stretch', 'start', 'end', 'baseline'],
  alignItems: ['start', 'end', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
  direction: ['row', 'row-reverse', 'column', 'column-reverse'],
  display: ['flex', 'inline-flex'],
  justifyContent: ['start', 'end', 'flex-start', 'flex-end', 'center', 'left', 'right', 'space-between', 'space-around', 'space-evenly'],
  wrap: ['nowrap', 'wrap', 'wrap-reverse'],
  units: [0, 1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40]
};

/**
 * IDS Layout Flex Component
 * @type {IdsLayoutFlex}
 * @inherits IdsElement
 */
@customElement('ids-layout-flex')
@scss(styles)
export default class IdsLayoutFlex extends IdsElement {
  constructor() {
    super();
  }

  static get attributes(): any {
    return [
      ...super.attributes,
      attributes.ALIGN_CONTENT,
      attributes.ALIGN_ITEMS,
      attributes.DIRECTION,
      attributes.DISPLAY,
      attributes.FILL,
      attributes.GAP,
      attributes.GAP_X,
      attributes.GAP_Y,
      attributes.JUSTIFY_CONTENT,
      attributes.WRAP
    ];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  template(): string {
    return `<slot></slot>`;
  }

  /**
   * Set the align content setting
   * @param {string} value The value
   */
  set alignContent(value: string | null) {
    if (value && FLEX_OPTIONS.alignContent.includes(value)) {
      this.setAttribute(attributes.ALIGN_CONTENT, value);
    } else {
      this.removeAttribute(attributes.ALIGN_CONTENT);
    }
  }

  get alignContent() { return this.getAttribute(attributes.ALIGN_CONTENT); }

  /**
   * Set the align items setting
   * @param {string} value The value
   */
  set alignItems(value: string | null) {
    if (value && FLEX_OPTIONS.alignItems.includes(value)) {
      this.setAttribute(attributes.ALIGN_ITEMS, value);
    } else {
      this.removeAttribute(attributes.ALIGN_ITEMS);
    }
  }

  get alignItems() { return this.getAttribute(attributes.ALIGN_ITEMS); }

  /**
   * Set the direction setting
   * @param {string} value The value
   */
  set direction(value: string | null) {
    if (value && FLEX_OPTIONS.direction.includes(value)) {
      this.setAttribute(attributes.DIRECTION, value);
    } else {
      this.removeAttribute(attributes.DIRECTION);
    }
  }

  get direction() { return this.getAttribute(attributes.DIRECTION); }

  /**
   * Set the display setting
   * @param {string} value The value
   */
  set display(value: string | null) {
    if (value && FLEX_OPTIONS.display.includes(value)) {
      this.setAttribute(attributes.DISPLAY, value);
    } else {
      this.removeAttribute(attributes.DISPLAY);
    }
  }

  get display() { return this.getAttribute(attributes.DISPLAY); }

  /**
   * Set the gap, apply same for both horizontal and vertical sides
   * @param {number|string} value The value
   */
  set gap(value: number | string | null) {
    const val = stringToNumber(value);
    if (!Number.isNaN(val) && FLEX_OPTIONS.units.includes(val)) {
      this.setAttribute(attributes.GAP, String(val));
    } else {
      this.removeAttribute(attributes.GAP);
    }
  }

  get gap() { return this.getAttribute(attributes.GAP); }

  /**
   * Set the horizontal gap
   * @param {number|string} value The value
   */
  set gapX(value: number | string | null) {
    const val = stringToNumber(value);
    if (!Number.isNaN(val) && FLEX_OPTIONS.units.includes(val)) {
      this.setAttribute(attributes.GAP_X, String(val));
    } else {
      this.removeAttribute(attributes.GAP_X);
    }
  }

  get gapX() { return this.getAttribute(attributes.GAP_X); }

  /**
   * Set card vertical gap
   * @param {number|string} value The value
   */
  set gapY(value: number | string | null) {
    const val = stringToNumber(value);
    if (!Number.isNaN(val) && FLEX_OPTIONS.units.includes(val)) {
      this.setAttribute(attributes.GAP_Y, String(val));
    } else {
      this.removeAttribute(attributes.GAP_Y);
    }
  }

  get gapY() { return this.getAttribute(attributes.GAP_Y); }

  /**
   * Set the justify content setting
   * @param {string} value The value
   */
  set justifyContent(value: string | null) {
    if (value && FLEX_OPTIONS.justifyContent.includes(value)) {
      this.setAttribute(attributes.JUSTIFY_CONTENT, value);
    } else {
      this.removeAttribute(attributes.JUSTIFY_CONTENT);
    }
  }

  get justifyContent() { return this.getAttribute(attributes.JUSTIFY_CONTENT); }

  /**
   * Set the wrap setting
   * @param {string} value The value
   */
  set wrap(value: string | null) {
    if (value && FLEX_OPTIONS.wrap.includes(value)) {
      this.setAttribute(attributes.WRAP, value);
    } else {
      this.removeAttribute(attributes.WRAP);
    }
  }

  get wrap() { return this.getAttribute(attributes.WRAP); }

  /**
   * Set flex container to 100% height
   * @param {boolean} val value
   */
  set fullHeight(val: boolean | string | null) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.FULL_HEIGHT, '');
    } else {
      this.removeAttribute(attributes.FULL_HEIGHT);
    }
  }

  get fullHeight(): boolean {
    return this.hasAttribute(attributes.FULL_HEIGHT);
  }
}
