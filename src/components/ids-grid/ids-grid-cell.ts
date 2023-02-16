import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

const colSpanSizes = [
  { size: 'colSpan', className: 'span' },
  { size: 'colSpanXs', className: 'span-xs' },
  { size: 'colSpanSm', className: 'span-sm' },
  { size: 'colSpanMd', className: 'span-md' },
  { size: 'colSpanLg', className: 'span-lg' },
  { size: 'colSpanXl', className: 'span-xl' },
  { size: 'colSpanXxl', className: 'span-xxl' }
];

const rowSpanSizes = [
  { size: 'rowSpan', className: 'row-span' },
  { size: 'rowSpanXs', className: 'row-span-xs' },
  { size: 'rowSpanSm', className: 'row-span-sm' },
  { size: 'rowSpanMd', className: 'row-span-md' },
  { size: 'rowSpanLg', className: 'row-span-lg' },
  { size: 'rowSpanXl', className: 'row-span-xl' },
  { size: 'rowSpanXxl', className: 'row-span-xxl' }
];

/**
 * IDS Grid Cell Component
 * @type {IdsGridCell}
 * @inherits IdsElement
 */
@customElement('ids-grid-cell')
export default class IdsGridCell extends IdsElement {
  /**
   * Set the amount of columns to span
   * @param {string | null} value The number value for the columns to span in the grid
   */
  set colSpan(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN);
    }
  }

  get colSpan(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN);
  }

  set colSpanXs(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_XS, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_XS);
    }
  }

  get colSpanXs(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_XS);
  }

  set colSpanSm(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_SM, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_SM);
    }
  }

  get colSpanSm(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_SM);
  }

  set colSpanMd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_MD, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_MD);
    }
  }

  get colSpanMd(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_MD);
  }

  set colSpanLg(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_LG, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_LG);
    }
  }

  get colSpanLg(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_LG);
  }

  set colSpanXl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_XL, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_XL);
    }
  }

  get colSpanXl(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_XL);
  }

  set colSpanXxl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_XXL, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_XXL);
    }
  }

  get colSpanXxl(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_XXL);
  }

  set fill(value: string | null | any) {
    const isTruthy = stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.FILL, '');
    } else {
      this.removeAttribute(attributes.FILL);
    }
  }

  get fill(): string | boolean | null | any {
    return stringToBool(this.getAttribute(attributes.FILL));
  }

  /**
   * Set a height and center the card
   * @param {number} value height in pixels
   */
  set height(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.HEIGHT, value);
    } else {
      this.removeAttribute(attributes.HEIGHT);
    }
  }

  get height(): string | null | any {
    return this.getAttribute(attributes.HEIGHT);
  }

  /**
   * Set a minHeight and center the card
   * @param {number} value minHeight in pixels
   */
  set minHeight(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.MIN_HEIGHT, value);
    } else {
      this.removeAttribute(attributes.MIN_HEIGHT);
    }
  }

  get minHeight(): string | null | any {
    return this.getAttribute(attributes.MIN_HEIGHT);
  }

  set rowSpan(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN);
    }
  }

  get rowSpan(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN);
  }

  set rowSpanXs(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_XS, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_XS);
    }
  }

  get rowSpanXs(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_XS);
  }

  set rowSpanSm(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_SM, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_SM);
    }
  }

  get rowSpanSm(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_SM);
  }

  set rowSpanMd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_MD, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_MD);
    }
  }

  get rowSpanMd(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_MD);
  }

  set rowSpanLg(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_LG, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_LG);
    }
  }

  get rowSpanLg(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_LG);
  }

  set rowSpanXl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_XL, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_XL);
    }
  }

  get rowSpanXl(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_XL);
  }

  set rowSpanXxl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_XXL, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_XXL);
    }
  }

  get rowSpanXxl(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_XXL);
  }

  constructor() {
    super({ noShadowRoot: true });
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): any {
    return [
      attributes.COL_SPAN,
      attributes.COL_SPAN_XS,
      attributes.COL_SPAN_SM,
      attributes.COL_SPAN_MD,
      attributes.COL_SPAN_LG,
      attributes.COL_SPAN_XL,
      attributes.COL_SPAN_XXL,
      attributes.FILL,
      attributes.HEIGHT,
      attributes.MIN_HEIGHT,
      attributes.ROW_SPAN,
      attributes.ROW_SPAN_XS,
      attributes.ROW_SPAN_SM,
      attributes.ROW_SPAN_MD,
      attributes.ROW_SPAN_LG,
      attributes.ROW_SPAN_XL,
      attributes.ROW_SPAN_XXL,
      // col-start (offset) settings
      // order settings
      // sticky settings?
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.settings();
  }

  private settings() {
    this.classList.add('grid-cell');
    this.setColSpan();
    this.setRowSpan();
    this.setFill();
    this.setHeight();
    this.setMinHeight();
  }

  private setColSpan() {
    for (const { size, className } of colSpanSizes) {
      if (this[size as keyof IdsGridCell] !== null) {
        this.classList.add(`${className}-${this[size as keyof IdsGridCell]}`);
      }
    }
  }

  private setRowSpan() {
    for (const { size, className } of rowSpanSizes) {
      if (this[size as keyof IdsGridCell] !== null) {
        this.classList.add(`${className}-${this[size as keyof IdsGridCell]}`);
      }
    }
  }

  private setHeight() {
    if (this.height !== null) {
      this.style.setProperty(attributes.HEIGHT, this.height);
    }
  }

  private setMinHeight() {
    if (this.minHeight !== null) {
      this.style.setProperty(attributes.MIN_HEIGHT, this.minHeight);
    }
  }

  private setFill() {
    if (this.fill === true) {
      this.classList.add(attributes.FILL);
    }
  }

  template(): string {
    return `<slot></slot>`;
  }
}
