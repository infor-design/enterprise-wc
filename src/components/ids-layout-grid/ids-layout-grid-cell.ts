import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import styles from './ids-layout-grid-cell.scss';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsButton from '../ids-button/ids-button';

import {
  ALIGN_TYPES,
  GRID_CELL_ATTRIBUTES,
  PADDING_SIZES,
  prefix,
} from './ids-layout-grid-common';

const Base = IdsEventsMixin(
  IdsElement
);

/**
 * IDS Layout Grid Cell Component
 * @type {IdsLayoutGridCell}
 * @inherits IdsElement
 */
@customElement('ids-layout-grid-cell')
@scss(styles)
export default class IdsLayoutGridCell extends Base {
  closeButton?: IdsButton;

  /**
   * Set the grid-cell align-content
   * @param {string | null} value The align-content [null, start, end, between, around, evenly]
   */
  set alignContent(value: string | null) {
    if (!value || ALIGN_TYPES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.ALIGN_CONTENT);
    } else {
      this.setAttribute(attributes.ALIGN_CONTENT, value);
    }
  }

  /**
   * Get the grid align-content setting
   * @returns {string | null} The align-content [null, start, end, between, around, evenly]
   */
  get alignContent(): string | null { return this.getAttribute(attributes.ALIGN_CONTENT); }

  /**
   * Set col-end attribute
   * @param {string | null} value number value of ending column of the cell
   */
  set colEnd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END, value);
    } else {
      this.removeAttribute(attributes.COL_END);
    }
  }

  /**
   * Get col-end attribute
   * @returns {string | null} number value of ending column of the cell
   */
  get colEnd(): string | null | any {
    return this.getAttribute(attributes.COL_END);
  }

  /**
   * Set col-end-xs attribute
   * @param {string | null} value number value of ending column of the cell at the xs breakpoint
   */
  set colEndXs(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_XS, value);
    } else {
      this.removeAttribute(attributes.COL_END_XS);
    }
  }

  /**
   * Get col-end-xs attribute
   * @returns {string | null} number value of ending column of the cell at the xs breakpoint
   */
  get colEndXs(): string | null | any {
    return this.getAttribute(attributes.COL_END_XS);
  }

  /**
   * Set col-end-sm attribute
   * @param {string | null} value number value of ending column of the cell at the sm breakpoint
   */
  set colEndSm(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_SM, value);
    } else {
      this.removeAttribute(attributes.COL_END_SM);
    }
  }

  /**
   * Get col-end-sm attribute
   * @returns {string | null} number value of ending column of the cell at the sm breakpoint
   */
  get colEndSm(): string | null | any {
    return this.getAttribute(attributes.COL_END_SM);
  }

  /**
   * Set col-end-md attribute
   * @param {string | null} value number value of ending column of the cell at the md breakpoint
   */
  set colEndMd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_MD, value);
    } else {
      this.removeAttribute(attributes.COL_END_MD);
    }
  }

  /**
   * Get col-end-md attribute
   * @returns {string | null} number value of ending column of the cell at the md breakpoint
   */
  get colEndMd(): string | null | any {
    return this.getAttribute(attributes.COL_END_MD);
  }

  /**
   * Set col-end-lg attribute
   * @param {string | null} value number value of ending column of the cell at the lg breakpoint
   */
  set colEndLg(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_LG, value);
    } else {
      this.removeAttribute(attributes.COL_END_LG);
    }
  }

  /**
   * Get col-end-lg attribute
   * @returns {string | null} number value of ending column of the cell at the lg breakpoint
   */
  get colEndLg(): string | null | any {
    return this.getAttribute(attributes.COL_END_LG);
  }

  /**
   * Set col-end-xl attribute
   * @param {string | null} value number value of ending column of the cell at the xl breakpoint
   */
  set colEndXl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_XL, value);
    } else {
      this.removeAttribute(attributes.COL_END_XL);
    }
  }

  /**
   * Get col-end-xl attribute
   * @returns {string | null} number value of ending column of the cell at the xl breakpoint
   */
  get colEndXl(): string | null | any {
    return this.getAttribute(attributes.COL_END_XL);
  }

  /**
   * Set col-end-xxl attribute
   * @param {string | null} value number value of ending column of the cell at the xxl breakpoint
   */
  set colEndXxl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_END_XXL, value);
    } else {
      this.removeAttribute(attributes.COL_END_XXL);
    }
  }

  /**
   * Get col-end-xxl attribute
   * @returns {string | null} number value of ending column of the cell at the xxl breakpoint
   */
  get colEndXxl(): string | null | any {
    return this.getAttribute(attributes.COL_END_XXL);
  }

  /**
   * Set the col-span attribute
   * @param {string | null} value The number value for the columns to span in the grid
   */
  set colSpan(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN);
    }
  }

  /**
   * Get col-span attribute
   * @returns {string | null} The number value for the columns to span in the grid
   */
  get colSpan(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN);
  }

  /**
   * Set the col-span-xs attribute
   * @param {string | null} value The number value for the columns to span in the grid at the xs breakpoint
   */
  set colSpanXs(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_XS, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_XS);
    }
  }

  /**
   * Get col-span-xs attribute
   * @returns {string | null} The number value for the columns to span in the grid at the xs breakpoint
   */
  get colSpanXs(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_XS);
  }

  /**
   * Set the col-span-sm attribute
   * @param {string | null} value The number value for the columns to span in the grid at the sm breakpoint
   */
  set colSpanSm(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_SM, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_SM);
    }
  }

  /**
   * Get col-span-sm attribute
   * @returns {string | null} The number value for the columns to span in the grid at the sm breakpoint
   */
  get colSpanSm(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_SM);
  }

  /**
   * Set the col-span-md attribute
   * @param {string | null} value The number value for the columns to span in the grid at the md breakpoint
   */
  set colSpanMd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_MD, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_MD);
    }
  }

  /**
   * Get col-span-md attribute
   * @returns {string | null} The number value for the columns to span in the grid at the md breakpoint
   */
  get colSpanMd(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_MD);
  }

  /**
   * Set the col-span-lg attribute
   * @param {string | null} value The number value for the columns to span in the grid at the lg breakpoint
   */
  set colSpanLg(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_LG, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_LG);
    }
  }

  /**
   * Get col-span-lg attribute
   * @returns {string | null} The number value for the columns to span in the grid at the lg breakpoint
   */
  get colSpanLg(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_LG);
  }

  /**
   * Set the col-span-xl attribute
   * @param {string | null} value The number value for the columns to span in the grid at the xl breakpoint
   */
  set colSpanXl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_XL, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_XL);
    }
  }

  /**
   * Get col-span-xl attribute
   * @returns {string | null} The number value for the columns to span in the grid at the xl breakpoint
   */
  get colSpanXl(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_XL);
  }

  /**
   * Set the col-span-xxl attribute
   * @param {string | null} value The number value for the columns to span in the grid at the xxl breakpoint
   */
  set colSpanXxl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_XXL, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_XXL);
    }
  }

  /**
   * Get col-span-xxl attribute
   * @returns {string | null} The number value for the columns to span in the grid at the xxl breakpoint
   */
  get colSpanXxl(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_XXL);
  }

  /**
   * Set the col-start attribute
   * @param {string | null} value The number value for the starting column of the cell
   */
  set colStart(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START, value);
    } else {
      this.removeAttribute(attributes.COL_START);
    }
  }

  /**
   * Get the col-start attribute
   * @returns {string | null} The number value for the starting column of the cell
   */
  get colStart(): string | null | any {
    return this.getAttribute(attributes.COL_START);
  }

  /**
   * Set the col-start-xs attribute
   * @param {string | null} value The number value for the starting column of the cell at the xs breakpoint
   */
  set colStartXs(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_XS, value);
    } else {
      this.removeAttribute(attributes.COL_START_XS);
    }
  }

  /**
   * Get the col-start-xs attribute
   * @returns {string | null} The number value for the starting column of the cell at the xs breakpoint
   */
  get colStartXs(): string | null | any {
    return this.getAttribute(attributes.COL_START_XS);
  }

  /**
   * Set the col-start-sm attribute
   * @param {string | null} value The number value for the starting column of the cell at the sm breakpoint
   */
  set colStartSm(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_SM, value);
    } else {
      this.removeAttribute(attributes.COL_START_SM);
    }
  }

  /**
   * Get the col-start-sm attribute
   * @returns {string | null} The number value for the starting column of the cell at the sm breakpoint
   */
  get colStartSm(): string | null | any {
    return this.getAttribute(attributes.COL_START_SM);
  }

  /**
   * Set the col-start-md attribute
   * @param {string | null} value The number value for the starting column of the cell at the md breakpoint
   */
  set colStartMd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_MD, value);
    } else {
      this.removeAttribute(attributes.COL_START_MD);
    }
  }

  /**
   * Get the col-start-md attribute
   * @returns {string | null} The number value for the starting column of the cell at the md breakpoint
   */
  get colStartMd(): string | null | any {
    return this.getAttribute(attributes.COL_START_MD);
  }

  /**
   * Set the col-start-lg attribute
   * @param {string | null} value The number value for the starting column of the cell at the lg breakpoint
   */
  set colStartLg(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_LG, value);
    } else {
      this.removeAttribute(attributes.COL_START_LG);
    }
  }

  /**
   * Get the col-start-lg attribute
   * @returns {string | null} The number value for the starting column of the cell at the lg breakpoint
   */
  get colStartLg(): string | null | any {
    return this.getAttribute(attributes.COL_START_LG);
  }

  /**
   * Set the col-start-xl attribute
   * @param {string | null} value The number value for the starting column of the cell at the xl breakpoint
   */
  set colStartXl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_XL, value);
    } else {
      this.removeAttribute(attributes.COL_START_XL);
    }
  }

  /**
   * Get the col-start-xl attribute
   * @returns {string | null} The number value for the starting column of the cell at the xl breakpoint
   */
  get colStartXl(): string | null | any {
    return this.getAttribute(attributes.COL_START_XL);
  }

  /**
   * Set the col-start-xxl attribute
   * @param {string | null} value The number value for the starting column of the cell at the xxl breakpoint
   */
  set colStartXxl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_START_XXL, value);
    } else {
      this.removeAttribute(attributes.COL_START_XXL);
    }
  }

  /**
   * Get the col-start-xxl attribute
   * @returns {string | null} The number value for the starting column of the cell at the xxl breakpoint
   */
  get colStartXxl(): string | null | any {
    return this.getAttribute(attributes.COL_START_XXL);
  }

  /**
   * Set the editable attribute
   * @param {string | null} value The value of the editable attribute
   */
  set editable(value: string | null | any) {
    const isTruthy = stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.EDITABLE, '');
      this.enableEditable();
    } else {
      this.removeAttribute(attributes.EDITABLE);
      this.disableEditable();
    }
  }

  /**
   * Get the editable attribute
   * @returns {string | null} The value of the editable attribute
   */
  get editable(): string | null | any {
    return stringToBool(this.getAttribute(attributes.EDITABLE));
  }

  /**
   * Set the value of the fill attribute
   * @param {string | null} value The boolean value of the fill attribute.
   */
  set fill(value: string | null | any) {
    const isTruthy = stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.FILL, '');
    } else {
      this.removeAttribute(attributes.FILL);
    }
  }

  /**
   * Get the fill attribute
   * @returns {boolean | null} The boolean value of the fill attribute.
   */
  get fill(): boolean | null | any {
    return stringToBool(this.getAttribute(attributes.FILL));
  }

  /**
   * Set the height attribute
   * @param {string | null} value The value of the height attribute
   */
  set height(value: string | null) {
    if (value !== null) {
      // Check if the value contains a unit, if not, default to 'px'
      const newValue = /^\d+(\.\d+)?$/g.test(value) ? value + 'px' : value;
      this.setAttribute(attributes.HEIGHT, newValue);
      this.style.setProperty(attributes.HEIGHT, newValue);
    } else {
      this.removeAttribute(attributes.HEIGHT);
      this.style.removeProperty(attributes.HEIGHT);
    }
  }

  /**
   * Get the height attribute
   * @returns {boolean | null} The value of the height attribute
   */
  get height(): string | null {
    return this.getAttribute(attributes.HEIGHT);
  }

  /**
   * Set the grid cell justify-content
   * @param {string | null} value The justify-content [null, start, end, between, around, evenly]
   */
  set justifyContent(value: string | null) {
    if (!value || ALIGN_TYPES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.JUSTIFY_CONTENT);
    } else {
      this.setAttribute(attributes.JUSTIFY_CONTENT, value);
    }
  }

  /**
   * Get the grid justify setting
   * @returns {string | null} The justify [null, start, end, between, around, evenly]
   */
  get justifyContent(): string | null { return this.getAttribute(attributes.JUSTIFY_CONTENT); }

  /**
   * Set a minHeight attribute
   * @param {string | null} value The value of the minHeight attribute
   */
  set minHeight(value: string | null | any) {
    if (value !== null) {
      // Check if the value contains a unit, if not, default to 'px'
      const newValue = /^\d+(\.\d+)?$/g.test(value) ? value + 'px' : value;
      this.setAttribute(attributes.MIN_HEIGHT, newValue);
      this.style.setProperty(attributes.MIN_HEIGHT, newValue);
    } else {
      this.removeAttribute(attributes.MIN_HEIGHT);
      this.style.removeProperty(attributes.MIN_HEIGHT);
    }
  }

  /**
   * Get the minHeight attribute
   * @returns {string | null} The value of the height attribute
   */
  get minHeight(): string | null | any {
    return this.getAttribute(attributes.MIN_HEIGHT);
  }

  /**
   * Set the order attribute
   * @param {string | null} value The value of the order attribute
   */
  set order(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER, value);
    } else {
      this.removeAttribute(attributes.ORDER);
    }
  }

  /**
   * Get the order attribute
   * @returns {string | null} The value of the order attribute
   */
  get order(): string | null | any {
    return this.getAttribute(attributes.ORDER);
  }

  /**
   * Set the order-xs attribute
   * @param {string | null} value The value of the order-xs attribute
   */
  set orderXs(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_XS, value);
    } else {
      this.removeAttribute(attributes.ORDER_XS);
    }
  }

  /**
   * Get the order-xs attribute
   * @returns {string | null} The value of the order-xs attribute
   */
  get orderXs(): string | null | any {
    return this.getAttribute(attributes.ORDER_XS);
  }

  /**
   * Set the order-sm attribute
   * @param {string | null} value The value of the order-sm attribute
   */
  set orderSm(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_SM, value);
    } else {
      this.removeAttribute(attributes.ORDER_SM);
    }
  }

  /**
   * Get the order-sm attribute
   * @returns {string | null} The value of the order-sm attribute
   */
  get orderSm(): string | null | any {
    return this.getAttribute(attributes.ORDER_SM);
  }

  /**
   * Set the order-md attribute
   * @param {string | null} value The value of the order-md attribute
   */
  set orderMd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_MD, value);
    } else {
      this.removeAttribute(attributes.ORDER_MD);
    }
  }

  /**
   * Get the order-md attribute
   * @returns {string | null} The value of the order-md attribute
   */
  get orderMd(): string | null | any {
    return this.getAttribute(attributes.ORDER_MD);
  }

  /**
   * Set the order-lg attribute
   * @param {string | null} value The value of the order-lg attribute
   */
  set orderLg(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_LG, value);
    } else {
      this.removeAttribute(attributes.ORDER_LG);
    }
  }

  /**
   * Get the order-lg attribute
   * @returns {string | null} The value of the order-lg attribute
   */
  get orderLg(): string | null | any {
    return this.getAttribute(attributes.ORDER_LG);
  }

  /**
   * Set the order-xl attribute
   * @param {string | null} value The value of the order-xl attribute
   */
  set orderXl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_XL, value);
    } else {
      this.removeAttribute(attributes.ORDER_XL);
    }
  }

  /**
   * Get the order-xl attribute
   * @returns {string | null} The value of the order-xl attribute
   */
  get orderXl(): string | null | any {
    return this.getAttribute(attributes.ORDER_XL);
  }

  /**
   * Set the order-xxl attribute
   * @param {string | null} value The value of the order-xxl attribute
   */
  set orderXxl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ORDER_XXL, value);
    } else {
      this.removeAttribute(attributes.ORDER_XXL);
    }
  }

  /**
   * Get the order-xxl attribute
   * @returns {string | null} The value of the order-xxl attribute
   */
  get orderXxl(): string | null | any {
    return this.getAttribute(attributes.ORDER_XXL);
  }

  /**
   * Set the padding attribute
   * @param {string | null} value The value of the padding attribute
   */
  set padding(value: string | null) {
    if (!value || PADDING_SIZES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.PADDING);
    } else {
      this.setAttribute(attributes.PADDING, value);
    }
  }

  /**
   * Get the padding attribute
   * @returns {string | null} The number value that represents the padding of the grid
   */
  get padding(): string | any { return this.getAttribute(attributes.PADDING); }

  /**
   * Set the row-span attribute
   * @param {string | null} value The value of the row-span attribute
   */
  set rowSpan(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN);
    }
  }

  /**
   * Get the row-span attribute
   * @returns {string | null} The value of the row-span attribute
   */
  get rowSpan(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN);
  }

  /**
   * Set the row-span-xs attribute
   * @param {string | null} value The value of the row-span-xs attribute
   */
  set rowSpanXs(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_XS, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_XS);
    }
  }

  /**
   * Get the row-span attribute
   * @returns {string | null} The value of the row-span-xs attribute
   */
  get rowSpanXs(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_XS);
  }

  /**
   * Set the row-span-sm attribute
   * @param {string | null} value The value of the row-span-sm attribute
   */
  set rowSpanSm(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_SM, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_SM);
    }
  }

  /**
   * Get the row-span-sm attribute
   * @returns {string | null} The value of the row-span-sm attribute
   */
  get rowSpanSm(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_SM);
  }

  /**
   * Set the row-span-md attribute
   * @param {string | null} value The value of the row-span-md attribute
   */
  set rowSpanMd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_MD, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_MD);
    }
  }

  /**
   * Get the row-span-md attribute
   * @returns {string | null} The value of the row-span-md attribute
   */
  get rowSpanMd(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_MD);
  }

  /**
   * Set the row-span-lg attribute
   * @param {string | null} value The value of the row-span-md attribute
   */
  set rowSpanLg(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_LG, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_LG);
    }
  }

  /**
   * Get the row-span-lg attribute
   * @returns {string | null} The value of the row-span-lg attribute
   */
  get rowSpanLg(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_LG);
  }

  /**
   * Set the row-span-xl attribute
   * @param {string | null} value The value of the row-span-xl attribute
   */
  set rowSpanXl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_XL, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_XL);
    }
  }

  /**
   * Get the row-span-xl attribute
   * @returns {string | null} The value of the row-span-xl attribute
   */
  get rowSpanXl(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_XL);
  }

  /**
   * Set the row-span-xxl attribute
   * @param {string | null} value The value of the row-span-xxl attribute
   */
  set rowSpanXxl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN_XXL, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN_XXL);
    }
  }

  /**
   * Get the row-span-xxl attribute
   * @returns {string | null} The value of the row-span-xxl attribute
   */
  get rowSpanXxl(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN_XXL);
  }

  /**
   * Set the sticky attribute
   * @param {string | null} value The value of the sticky attribute
   */
  set sticky(value: string | null | any) {
    const isTruthy = stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.STICKY, '');
      this.classList.add(`${prefix}-sticky`);
      this.style.setProperty('--sticky-position', '0');
    } else {
      this.removeAttribute(attributes.STICKY);
      this.classList.remove(`${prefix}-sticky`);
      this.style.removeProperty('--sticky-position');
    }
  }

  /**
   * Get the sticky attribute
   * @returns {string | null} The value of the sticky attribute
   */
  get sticky(): string | null | any {
    return stringToBool(this.getAttribute(attributes.STICKY));
  }

  /**
   * Set the sticky-position attribute
   * @param {string | null} value The value of the sticky-position attribute
   */
  set stickyPosition(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.STICKY_POSITION, value);
      this.style.setProperty('--sticky-position', value);
    } else {
      this.removeAttribute(attributes.STICKY_POSITION);
      this.style.removeProperty('--sticky-position');
    }
  }

  /**
   * Get the sticky-position attribute
   * @returns {string | null} The value of the sticky-position attribute
   */
  get stickyPosition(): string | null | any {
    return this.getAttribute(attributes.STICKY_POSITION);
  }

  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): any {
    return GRID_CELL_ATTRIBUTES;
  }

  connectedCallback() {
    super.connectedCallback();
    this.initialSettings();
  }

  private initialSettings() {
    this.classList.add(`${prefix}-cell`);
    this.#attachEventHandlers();
  }

  private setupCloseButton() {
    if (this.closeButton) {
      this.closeButton.type = 'button';
      this.closeButton.appearance = 'primary-destructive';
      this.closeButton.icon = 'close';
      this.closeButton.classList.add('close-btn');
    }
  }

  enableEditable() {
    this.closeButton = <IdsButton> document.createElement('ids-button');
    this.classList.add('editable');
    this.appendChild(this.closeButton as any);
    this.setupCloseButton();
  }

  disableEditable() {
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
