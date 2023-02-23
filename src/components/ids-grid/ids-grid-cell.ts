import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import styles from './ids-grid-cell.scss';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsButton from '../ids-button/ids-button';

const colSpanSizes = [
  { size: 'colSpan', className: 'span' },
  { size: 'colSpanXs', className: 'span-xs' },
  { size: 'colSpanSm', className: 'span-sm' },
  { size: 'colSpanMd', className: 'span-md' },
  { size: 'colSpanLg', className: 'span-lg' },
  { size: 'colSpanXl', className: 'span-xl' },
  { size: 'colSpanXxl', className: 'span-xxl' }
];

const colStartSizes = [
  { size: 'colStart', className: 'col-start' },
  { size: 'colStartXs', className: 'col-start-xs' },
  { size: 'colStartSm', className: 'col-start-sm' },
  { size: 'colStartMd', className: 'col-start-md' },
  { size: 'colStartLg', className: 'col-start-lg' },
  { size: 'colStartXl', className: 'col-start-xl' },
  { size: 'colStartXxl', className: 'col-start-xxl' }
];

const colEndSizes = [
  { size: 'colEnd', className: 'col-end' },
  { size: 'colEndXs', className: 'col-end-xs' },
  { size: 'colEndSm', className: 'col-end-sm' },
  { size: 'colEndMd', className: 'col-end-md' },
  { size: 'colEndLg', className: 'col-end-lg' },
  { size: 'colEndXl', className: 'col-end-xl' },
  { size: 'colEndXxl', className: 'col-end-xxl' }
];

const orderSizes = [
  { size: 'order', className: 'order' },
  { size: 'orderXs', className: 'order-xs' },
  { size: 'orderSm', className: 'order-sm' },
  { size: 'orderMd', className: 'order-md' },
  { size: 'orderLg', className: 'order-lg' },
  { size: 'orderXl', className: 'order-xl' },
  { size: 'orderXxl', className: 'order-xxl' }
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

const Base = IdsEventsMixin(
  IdsElement
);

/**
 * IDS Grid Cell Component
 * @type {IdsGridCell}
 * @inherits IdsElement
 */
@customElement('ids-grid-cell')
@scss(styles)
export default class IdsGridCell extends Base {
  closeButton?: IdsButton;

  set colEnd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END, value);
    } else {
      this.removeAttribute(attributes.COL_END);
    }
  }

  get colEnd(): string | null | any {
    return this.getAttribute(attributes.COL_END);
  }

  set colEndXs(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_XS, value);
    } else {
      this.removeAttribute(attributes.COL_END_XS);
    }
  }

  get colEndXs(): string | null | any {
    return this.getAttribute(attributes.COL_END_XS);
  }

  set colEndSm(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_SM, value);
    } else {
      this.removeAttribute(attributes.COL_END_SM);
    }
  }

  get colEndSm(): string | null | any {
    return this.getAttribute(attributes.COL_END_SM);
  }

  set colEndMd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_MD, value);
    } else {
      this.removeAttribute(attributes.COL_END_MD);
    }
  }

  get colEndMd(): string | null | any {
    return this.getAttribute(attributes.COL_END_MD);
  }

  set colEndLg(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_LG, value);
    } else {
      this.removeAttribute(attributes.COL_END_LG);
    }
  }

  get colEndLg(): string | null | any {
    return this.getAttribute(attributes.COL_END_LG);
  }

  set colEndXl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_XL, value);
    } else {
      this.removeAttribute(attributes.COL_END_XL);
    }
  }

  get colEndXl(): string | null | any {
    return this.getAttribute(attributes.COL_END_XL);
  }

  set colEndXxl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_XXL, value);
    } else {
      this.removeAttribute(attributes.COL_END_XXL);
    }
  }

  get colEndXxl(): string | null | any {
    return this.getAttribute(attributes.COL_END_XXL);
  }

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

  set colStart(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START, value);
    } else {
      this.removeAttribute(attributes.COL_START);
    }
  }

  get colStart(): string | null | any {
    return this.getAttribute(attributes.COL_START);
  }

  set colStartXs(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_XS, value);
    } else {
      this.removeAttribute(attributes.COL_START_XS);
    }
  }

  get colStartXs(): string | null | any {
    return this.getAttribute(attributes.COL_START_XS);
  }

  set colStartSm(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_SM, value);
    } else {
      this.removeAttribute(attributes.COL_START_SM);
    }
  }

  get colStartSm(): string | null | any {
    return this.getAttribute(attributes.COL_START_SM);
  }

  set colStartMd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_MD, value);
    } else {
      this.removeAttribute(attributes.COL_START_MD);
    }
  }

  get colStartMd(): string | null | any {
    return this.getAttribute(attributes.COL_START_MD);
  }

  set colStartLg(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_LG, value);
    } else {
      this.removeAttribute(attributes.COL_START_LG);
    }
  }

  get colStartLg(): string | null | any {
    return this.getAttribute(attributes.COL_START_LG);
  }

  set colStartXl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_XL, value);
    } else {
      this.removeAttribute(attributes.COL_START_XL);
    }
  }

  get colStartXl(): string | null | any {
    return this.getAttribute(attributes.COL_START_XL);
  }

  set colStartXxl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_XXL, value);
    } else {
      this.removeAttribute(attributes.COL_START_XXL);
    }
  }

  get colStartXxl(): string | null | any {
    return this.getAttribute(attributes.COL_START_XXL);
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

  set order(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER, value);
    } else {
      this.removeAttribute(attributes.ORDER);
    }
  }

  get order(): string | null | any {
    return this.getAttribute(attributes.ORDER);
  }

  set orderXs(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_XS, value);
    } else {
      this.removeAttribute(attributes.ORDER_XS);
    }
  }

  get orderXs(): string | null | any {
    return this.getAttribute(attributes.ORDER_XS);
  }

  set orderSm(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_SM, value);
    } else {
      this.removeAttribute(attributes.ORDER_SM);
    }
  }

  get orderSm(): string | null | any {
    return this.getAttribute(attributes.ORDER_SM);
  }

  set orderMd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_MD, value);
    } else {
      this.removeAttribute(attributes.ORDER_MD);
    }
  }

  get orderMd(): string | null | any {
    return this.getAttribute(attributes.ORDER_MD);
  }

  set orderLg(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_LG, value);
    } else {
      this.removeAttribute(attributes.ORDER_LG);
    }
  }

  get orderLg(): string | null | any {
    return this.getAttribute(attributes.ORDER_LG);
  }

  set orderXl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_XL, value);
    } else {
      this.removeAttribute(attributes.ORDER_XL);
    }
  }

  get orderXl(): string | null | any {
    return this.getAttribute(attributes.ORDER_XL);
  }

  set orderXxl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_XXL, value);
    } else {
      this.removeAttribute(attributes.ORDER_XXL);
    }
  }

  get orderXxl(): string | null | any {
    return this.getAttribute(attributes.ORDER_XXL);
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

  set sticky(value: string | null | any) {
    const isTruthy = stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.STICKY, '');
    } else {
      this.removeAttribute(attributes.STICKY);
    }
  }

  get sticky(): string | null | any {
    return stringToBool(this.getAttribute(attributes.STICKY));
  }

  set stickyPosition(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.STICKY_POSITION, value);
    } else {
      this.removeAttribute(attributes.STICKY_POSITION);
    }
  }

  get stickyPosition(): string | null | any {
    return this.getAttribute(attributes.STICKY_POSITION);
  }

  set editable(value: string | null | any) {
    const isTruthy = stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.EDITABLE, '');
    } else {
      this.removeAttribute(attributes.EDITABLE);
    }
  }

  get editable(): string | null | any {
    return stringToBool(this.getAttribute(attributes.EDITABLE));
  }

  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): any {
    return [
      attributes.COL_END,
      attributes.COL_END_XS,
      attributes.COL_END_SM,
      attributes.COL_END_MD,
      attributes.COL_END_LG,
      attributes.COL_END_XL,
      attributes.COL_END_XXL,
      attributes.COL_SPAN,
      attributes.COL_SPAN_XS,
      attributes.COL_SPAN_SM,
      attributes.COL_SPAN_MD,
      attributes.COL_SPAN_LG,
      attributes.COL_SPAN_XL,
      attributes.COL_SPAN_XXL,
      attributes.COL_START,
      attributes.COL_START_XS,
      attributes.COL_START_SM,
      attributes.COL_START_MD,
      attributes.COL_START_LG,
      attributes.COL_START_XL,
      attributes.COL_START_XXL,
      attributes.EDITABLE,
      attributes.FILL,
      attributes.HEIGHT,
      attributes.MIN_HEIGHT,
      attributes.ORDER,
      attributes.ORDER_XS,
      attributes.ORDER_SM,
      attributes.ORDER_MD,
      attributes.ORDER_LG,
      attributes.ORDER_XL,
      attributes.ORDER_XXL,
      attributes.ROW_SPAN,
      attributes.ROW_SPAN_XS,
      attributes.ROW_SPAN_SM,
      attributes.ROW_SPAN_MD,
      attributes.ROW_SPAN_LG,
      attributes.ROW_SPAN_XL,
      attributes.ROW_SPAN_XXL,
      attributes.STICKY,
      attributes.STICKY_POSITION
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.settings();
  }

  private settings() {
    this.classList.add('grid-cell');
    this.setColSpan();
    this.setColStart();
    this.setColEnd();
    this.setRowSpan();
    this.setFill();
    this.setHeight();
    this.setMinHeight();
    this.setOrder();
    this.setSticky();
    this.setStickyPosition();

    requestIdleCallback(() => {
      this.setCloseButton();
    });

    this.#attachEventHandlers();
  }

  private setColSpan() {
    for (const { size, className } of colSpanSizes) {
      if (this[size as keyof IdsGridCell] !== null) {
        this.classList.add(`${className}-${this[size as keyof IdsGridCell]}`);
      }
    }
  }

  private setColStart() {
    for (const { size, className } of colStartSizes) {
      if (this[size as keyof IdsGridCell] !== null) {
        this.classList.add(`${className}-${this[size as keyof IdsGridCell]}`);
      }
    }
  }

  private setColEnd() {
    for (const { size, className } of colEndSizes) {
      if (this[size as keyof IdsGridCell] !== null) {
        this.classList.add(`${className}-${this[size as keyof IdsGridCell]}`);
      }
    }
  }

  private setOrder() {
    for (const { size, className } of orderSizes) {
      if (this[size as keyof IdsGridCell] !== null) {
        this.classList.add(`${className}-${this[size as keyof IdsGridCell]}`);
      }
    }
  }

  private setSticky() {
    if (this.sticky === true) {
      this.classList.add('sticky');
      this.style.setProperty('--sticky-position', '0');
    }
  }

  private setStickyPosition() {
    if (this.stickyPosition !== null) {
      this.style.setProperty('--sticky-position', this.stickyPosition);
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

  private setCloseButton() {
    this.closeButton = <IdsButton> document.createElement('ids-button');
    this.closeButton.type = 'primary';
    this.closeButton.icon = 'close';
  }

  setEditable() {
    this.editable = true;
    this.classList.add('editable');
    this.appendChild(this.closeButton as any);
  }

  removeEditable() {
    this.editable = null;
    this.classList.remove('editable');
    this.closeButton?.remove();
  }

  removeCell(e: any) {
    if (e.target === this.closeButton) {
      this.remove();
    }
  }

  #attachEventHandlers(): void {
    this.onEvent('click', this, (e: any) => this.removeCell(e));
  }

  template(): string {
    return `<slot></slot>`;
  }
}
