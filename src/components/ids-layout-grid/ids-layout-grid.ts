import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import styles from './ids-layout-grid.scss';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import {
  ALIGN_ITEMS,
  ALIGN_TYPES,
  GRID_ATTRIBUTES,
  GAP_TYPES,
  FLOW_TYPES,
  MARGIN_SIZES,
  MAX_WIDTH_SIZES,
  PADDING_SIZES,
  prefix
} from './ids-layout-grid-common';

/**
 * IDS Layout Grid Component
 * @type {IdsLayoutGrid}
 * @inherits IdsElement
 */
@customElement('ids-layout-grid')
@scss(styles)
export default class IdsLayoutGrid extends IdsElement {
  /**
   * Set the grid align-content
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
   * Set the grid align-items
   * @param {string | null} value The align-items [null, start, end, center, stretch]
   */
  set alignItems(value: string | null) {
    if (!value || ALIGN_ITEMS.indexOf(value as any) < 0) {
      this.removeAttribute(attributes.ALIGN_ITEMS);
    } else {
      this.setAttribute(attributes.ALIGN_ITEMS, value);
    }
  }

  /**
   * Get the grid align-items setting
   * @returns {string | null} The align-items [null, start, end, center, stretch]
   */
  get alignItems(): string | null { return this.getAttribute(attributes.ALIGN_ITEMS); }

  /**
   * Set auto-fit attribute
   * @param {boolean | string | null} value boolean
   */
  set autoFit(value: string | boolean | null) {
    const isTruthy = stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.AUTO_FIT, '');
    } else {
      this.removeAttribute(attributes.AUTO_FIT);
    }
  }

  /**
   * Get auto-fit attribute
   * @readonly
   * @returns {boolean} Indicates whether the auto-fit is enabled
   */
  get autoFit(): string | boolean | null {
    return stringToBool(this.getAttribute(attributes.AUTO_FIT));
  }

  /**
   * Set auto-fill attribute
   * @param {boolean | string | null} value boolean
   */
  set autoFill(value: string | boolean | null) {
    const isTruthy = stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.AUTO_FILL, '');
    } else {
      this.removeAttribute(attributes.AUTO_FILL);
    }
  }

  /**
   * Get auto-fill attribute
   * @readonly
   * @returns {string | boolean | null} Indicates whether the auto-fill is enabled
   */
  get autoFill(): string | boolean | null {
    return stringToBool(this.getAttribute(attributes.AUTO_FILL));
  }

  /**
   * Set columns attribute
   * @param {boolean | string | null} value sets the number of columns
   */
  set cols(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS, value);
    } else {
      this.removeAttribute(attributes.COLS);
    }
  }

  /**
   * Get columns attribute
   * @readonly
   * @returns {string | null} The number of columns of the grid
   */
  get cols(): string | null { return this.getAttribute(attributes.COLS); }

  /**
   * Set XS columns attribute
   * @param {boolean | string | null} value sets the number of columns at the XS breakpoint
   */
  set colsXs(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_XS, value);
    } else {
      this.removeAttribute(attributes.COLS_XS);
    }
  }

  /**
   * Get XS columns attribute
   * @readonly
   * @returns {string | null} The number of columns of the grid at the XS breakpoint
   */
  get colsXs(): string | null { return this.getAttribute(attributes.COLS_XS); }

  /**
   * Set SM columns attribute
   * @param {boolean | string | null} value sets the number of columns at the SM breakpoint
   */
  set colsSm(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_SM, value);
    } else {
      this.removeAttribute(attributes.COLS_SM);
    }
  }

  /**
   * Get SM columns attribute
   * @readonly
   * @returns {string | null} The number of columns of the grid at the SM breakpoint
   */
  get colsSm(): string | null { return this.getAttribute(attributes.COLS_SM); }

  /**
   * Set MD columns attribute
   * @param {boolean | string | null} value sets the number of columns at the MD breakpoint
   */
  set colsMd(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_MD, value);
    } else {
      this.removeAttribute(attributes.COLS_MD);
    }
  }

  /**
   * Get MD columns attribute
   * @readonly
   * @returns {string | null} The number of columns of the grid at the MD breakpoint
   */
  get colsMd(): string | null { return this.getAttribute(attributes.COLS_MD); }

  /**
   * Set LG columns attribute
   * @param {boolean | string | null} value sets the number of columns at the LG breakpoint
   */
  set colsLg(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_LG, value);
    } else {
      this.removeAttribute(attributes.COLS_LG);
    }
  }

  /**
   * Get LG columns attribute
   * @readonly
   * @returns {string | null} The number of columns of the grid at the LG breakpoint
   */
  get colsLg(): string | null { return this.getAttribute(attributes.COLS_LG); }

  /**
   * Set XL columns attribute
   * @param {boolean | string | null} value sets the number of columns at the XL breakpoint
   */
  set colsXl(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_XL, value);
    } else {
      this.removeAttribute(attributes.COLS_XL);
    }
  }

  /**
   * Get XL columns attribute
   * @readonly
   * @returns {string | null} The number of columns of the grid at the XL breakpoint
   */
  get colsXl(): string | null { return this.getAttribute(attributes.COLS_XL); }

  /**
   * Set XXL columns attribute
   * @param {boolean | string | null} value sets the number of columns at the XXL breakpoint
   */
  set colsXxl(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_XXL, value);
    } else {
      this.removeAttribute(attributes.COLS_XXL);
    }
  }

  /**
   * Get XXL columns attribute
   * @readonly
   * @returns {string | null} The number of columns of the grid at the XXL breakpoint
   */
  get colsXxl(): string | null { return this.getAttribute(attributes.COLS_XXL); }

  /**
   * Set the minColWidth attribute
   * @param {string | null} value Number value that sets the min-width of the grid columns
   */
  set minColWidth(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.MIN_COL_WIDTH, value);
      this.style.setProperty('--min-col-width', value);
    } else {
      this.removeAttribute(attributes.MIN_COL_WIDTH);
      this.style.removeProperty('--min-col-width');
    }
  }

  /**
   * Get the minColWidth attribute
   * @readonly
   * @returns {string | null} The number value that represents the min-height of the grid columns
   */
  get minColWidth(): string | null {
    return this.getAttribute(attributes.MIN_COL_WIDTH);
  }

  /**
   * Set the minRowHeight attribute
   * @param {string | null} value Number value that sets the height of the grid rows
   */
  set minRowHeight(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.MIN_ROW_HEIGHT, value);
      this.style.setProperty('--min-row-height', value);
    } else {
      this.removeAttribute(attributes.MIN_ROW_HEIGHT);
      this.style.removeProperty('--min-row-height');
    }
  }

  /**
   * Get the minRowHeight attribute
   * @readonly
   * @returns {string | null} The number value that represents the min-height of the grid rows
   */
  get minRowHeight(): string | null {
    return this.getAttribute(attributes.MIN_ROW_HEIGHT);
  }

  /**
   * Set the maxColWidth attribute
   * @param {string | null} value Number value that sets the max-width of the grid columns
   */
  set maxColWidth(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.MAX_COL_WIDTH, value);
      this.style.setProperty('--max-col-width', value);
    } else {
      this.removeAttribute(attributes.MAX_COL_WIDTH);
      this.style.removeProperty('--max-col-width');
    }
  }

  /**
   * Get the maxColWidth attribute
   * @readonly
   * @returns {string | null} The number value that represents the max-width of the grid columns
   */
  get maxColWidth(): string | null {
    return this.getAttribute(attributes.MAX_COL_WIDTH);
  }

  /**
   * Set the maxRowHeight attribute
   * @param {string | null} value Number value that sets the max-height of the grid rows
   */
  set maxRowHeight(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.MAX_ROW_HEIGHT, value);
      this.style.setProperty('--max-row-height', value);
    } else {
      this.removeAttribute(attributes.MAX_ROW_HEIGHT);
      this.style.removeProperty('--max-row-height');
    }
  }

  /**
   * Get the maxRowHeight attribute
   * @returns {string | null} The number value that represents the max-height of the grid rows
   */
  get maxRowHeight(): string | null {
    return this.getAttribute(attributes.MAX_ROW_HEIGHT);
  }

  /**
   * Set the grid gap
   * @param {string | null} value The Gap [undefined, none, sm, md, lg, xl]
   */
  set gap(value: string | null) {
    if (!value || GAP_TYPES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.GAP);
    } else {
      this.setAttribute(attributes.GAP, value);
    }
  }

  /**
   * Handle The Gap Setting
   * @returns {string | null} The Gap [null, sm, md, lg, xl]
   */
  get gap(): string | null { return this.getAttribute(attributes.GAP); }

  /**
   * Set the margin attribute
   * @param {string | null} value The value of the margin [null, 'sm', 'md', 'lg', 'xl', 'auto']
   */
  set margin(value: string | null) {
    if (!value || MARGIN_SIZES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.MARGIN);
    } else {
      this.setAttribute(attributes.MARGIN, value);
    }
  }

  /**
   * Get the margin attribute
   * @returns {string | null} The number value that represents the margin of the grid
   */
  get margin(): string | null { return this.getAttribute(attributes.MARGIN); }

  /**
   * Set the marginY attribute
   * @param {string | null} value The value of the margin-y [null, 'sm', 'md', 'lg', 'xl']
   */
  set marginY(value: string | null) {
    if (!value || MARGIN_SIZES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.MARGIN_Y);
    } else {
      this.setAttribute(attributes.MARGIN_Y, value);
    }
  }

  /**
   * Get the margin attribute
   * @returns {string | null} The number value that represents the margin of the grid
   */
  get marginY(): string | null { return this.getAttribute(attributes.MARGIN_Y); }

  /**
   * Set the maxWidth attribute
   * @param {string | null} value The value of the max-width [null, 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '###px']
   */
  set maxWidth(value: string | null) {
    if (!value || MAX_WIDTH_SIZES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.MAX_WIDTH);

      // If custom value is set use custom property
      if (value?.endsWith('px')) {
        this.style.setProperty('--max-width', value);
        this.setAttribute(attributes.MAX_WIDTH, value);
      }
    } else {
      this.setAttribute(attributes.MAX_WIDTH, value);
      this.style.removeProperty('--max-width');
    }
  }

  /**
   * Get the maxWidth attribute
   * @returns {string | null} The value that represents the maxWidth of the grid
   */
  get maxWidth(): string | null { return this.getAttribute(attributes.MAX_WIDTH); }

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
  get padding(): string | null { return this.getAttribute(attributes.PADDING); }

  /**
   * Set the paddingX attribute
   * @param {string | null} value The value of the paddingX attribute
   */
  set paddingX(value: string | null) {
    if (!value || PADDING_SIZES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.PADDING_X);
    } else {
      this.setAttribute(attributes.PADDING_X, value);
    }
  }

  /**
   * Get the paddingX attribute
   * @returns {string | null} The number value that represents the paddingX of the grid
   */
  get paddingX(): string | null { return this.getAttribute(attributes.PADDING_X); }

  /**
   * Set the paddingY attribute
   * @param {string | null} value The value of the paddingY attribute
   */
  set paddingY(value: string | null) {
    if (!value || PADDING_SIZES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.PADDING_Y);
    } else {
      this.setAttribute(attributes.PADDING_Y, value);
    }
  }

  /**
   * Get the paddingY attribute
   * @returns {string | null} The number value that represents the paddingY of the grid
   */
  get paddingY(): string | null { return this.getAttribute(attributes.PADDING_Y); }

  /**
   * Set the grid justify
   * @param {string | null} value The justify [null, start, end, between, around, evenly]
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
   * Set the flow attribute of the grid
   * @param { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  set flow(value: string | null) {
    if (!value || FLOW_TYPES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.FLOW);
    } else {
      this.setAttribute(attributes.FLOW, value);
    }
  }

  /**
   * Get the flow attribute
   * @returns { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  get flow(): string | null {
    return this.getAttribute(attributes.FLOW);
  }

  /**
   * Set the flow-xs attribute of the grid
   * @param { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  set flowXs(value: string | null) {
    if (!value || FLOW_TYPES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.FLOW_XS);
    } else {
      this.setAttribute(attributes.FLOW_XS, value);
    }
  }

  /**
   * Get the flow-xs attribute
   * @returns { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  get flowXs(): string | null {
    return this.getAttribute(attributes.FLOW_XS);
  }

  /**
   * Set the flow-sm attribute of the grid
   * @param { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  set flowSm(value: string | null) {
    if (!value || FLOW_TYPES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.FLOW_SM);
    } else {
      this.setAttribute(attributes.FLOW_SM, value);
    }
  }

  /**
   * Get the flow-sm attribute
   * @returns { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  get flowSm(): string | null {
    return this.getAttribute(attributes.FLOW_SM);
  }

  /**
   * Set the flow-md attribute of the grid
   * @param { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  set flowMd(value: string | null) {
    if (!value || FLOW_TYPES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.FLOW_MD);
    } else {
      this.setAttribute(attributes.FLOW_MD, value);
    }
  }

  /**
   * Get the flow-md attribute
   * @returns { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  get flowMd(): string | null {
    return this.getAttribute(attributes.FLOW_SM);
  }

  /**
   * Set the flow-lg attribute of the grid
   * @param { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  set flowLg(value: string | null) {
    if (!value || FLOW_TYPES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.FLOW_LG);
    } else {
      this.setAttribute(attributes.FLOW_LG, value);
    }
  }

  /**
   * Get the flow-lg attribute
   * @returns { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  get flowLg(): string | null {
    return this.getAttribute(attributes.FLOW_LG);
  }

  /**
   * Set the flow-xl attribute of the grid
   * @param { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  set flowXl(value: string | null) {
    if (!value || FLOW_TYPES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.FLOW_XL);
    } else {
      this.setAttribute(attributes.FLOW_XL, value);
    }
  }

  /**
   * Get the flow-xl attribute
   * @returns { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  get flowXl(): string | null {
    return this.getAttribute(attributes.FLOW_XL);
  }

  /**
   * Set the flow-xxl attribute of the grid
   * @param { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  set flowXxl(value: string | null) {
    if (!value || FLOW_TYPES.indexOf(value as any) <= 0) {
      this.removeAttribute(attributes.FLOW_XXL);
    } else {
      this.setAttribute(attributes.FLOW_XXL, value);
    }
  }

  /**
   * Get the flow-xxl attribute
   * @returns { string | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  get flowXxl(): string | null {
    return this.getAttribute(attributes.FLOW_XXL);
  }

  /**
   * Set the row attribute
   * @param { string | null } value The amount of rows in the grid
   */
  set rows(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS, value);
    } else {
      this.removeAttribute(attributes.ROWS);
    }
  }

  /**
   * Get the row attribute
   * @returns { string | null } The amount of rows in the grid
   */
  get rows(): string | null {
    return this.getAttribute(attributes.ROWS);
  }

  /**
   * Set the rowXs attribute
   * @param { string | null } value The amount of rows at xs breakpoint in the grid
   */
  set rowsXs(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_XS, value);
    } else {
      this.removeAttribute(attributes.ROWS_XS);
    }
  }

  /**
   * Get the rowXs attribute
   * @returns { string | null } The amount of rows at xs breakpoint in the grid
   */
  get rowsXs(): string | null {
    return this.getAttribute(attributes.ROWS_XS);
  }

  /**
   * Set the rowSm attribute
   * @param { string | null } value The amount of rows at sm breakpoint in the grid
   */
  set rowsSm(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_SM, value);
    } else {
      this.removeAttribute(attributes.ROWS_SM);
    }
  }

  /**
   * Get the rowSm attribute
   * @returns { string | null } The amount of rows at sm breakpoint in the grid
   */
  get rowsSm(): string | null {
    return this.getAttribute(attributes.ROWS_SM);
  }

  /**
   * Set the rowMd attribute
   * @param { string | null } value The amount of rows at md breakpoint in the grid
   */
  set rowsMd(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_MD, value);
    } else {
      this.removeAttribute(attributes.ROWS_MD);
    }
  }

  /**
   * Get the rowMd attribute
   * @returns { string | null } The amount of rows at md breakpoint in the grid
   */
  get rowsMd(): string | null {
    return this.getAttribute(attributes.ROWS_MD);
  }

  /**
   * Set the rowLg attribute
   * @param { string | null } value The amount of rows at lg breakpoint in the grid
   */
  set rowsLg(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_LG, value);
    } else {
      this.removeAttribute(attributes.ROWS_LG);
    }
  }

  /**
   * Get the rowLg attribute
   * @returns { string | null } The amount of rows at lg breakpoint in the grid
   */
  get rowsLg(): string | null {
    return this.getAttribute(attributes.ROWS_LG);
  }

  /**
   * Set the rowXl attribute
   * @param { string | null } value The amount of rows at xl breakpoint in the grid
   */
  set rowsXl(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_XL, value);
    } else {
      this.removeAttribute(attributes.ROWS_XL);
    }
  }

  /**
   * Get the rowXl attribute
   * @returns { string | null } The amount of rows at xl breakpoint in the grid
   */
  get rowsXl(): string | null {
    return this.getAttribute(attributes.ROWS_XL);
  }

  /**
   * Set the rowXxl attribute
   * @param { string | null } value The amount of rows at xxl breakpoint in the grid
   */
  set rowsXxl(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_XXL, value);
    } else {
      this.removeAttribute(attributes.ROWS_XXL);
    }
  }

  /**
   * Get the rowXxl attribute
   * @returns { string | null } The amount of rows at xxl breakpoint in the grid
   */
  get rowsXxl(): string | null {
    return this.getAttribute(attributes.ROWS_XXL);
  }

  /**
   * Set the rowHeight attribute
   * @param { string | null } value The height of the rows in the grid
   */
  set rowHeight(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_HEIGHT, value);
      this.classList.add(`${prefix}-auto-row-height`);
      this.style.setProperty('--grid-auto-row-height', value);
    } else {
      this.removeAttribute(attributes.ROW_HEIGHT);
      this.classList.remove(`${prefix}-auto-row-height`);
      this.style.removeProperty('--grid-auto-row-height');
    }
  }

  /**
   * Get the rowHeight attribute
   * @returns { string | null } The height of the rows in the grid
   */
  get rowHeight(): string | null {
    return this.getAttribute(attributes.ROW_HEIGHT);
  }

  constructor() {
    super();
  }

  static get attributes(): any {
    return GRID_ATTRIBUTES;
  }

  connectedCallback() {
    super.connectedCallback();
    this.initialSettings();
  }

  private initialSettings() {
    this.classList.add(`${prefix}`);
  }

  template(): string {
    return `<slot></slot>`;
  }
}
