import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import styles from './ids-grid.scss';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

type IdsGapType = undefined | 'sm' | 'md' | 'lg' | 'xl';
type IdsJustifyType = undefined | 'around' | 'between' | 'center' | 'end' | 'evenly' | 'start';
type IdsFlowType = undefined | 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';

const GAP_TYPES: Array<IdsGapType> = [
  undefined,
  'sm',
  'md',
  'lg',
  'xl',
];

const JUSTIFY_TYPES: Array<IdsJustifyType> = [
  undefined,
  'around',
  'between',
  'center',
  'end',
  'evenly',
  'start',
];

const FLOW_TYPES: Array<IdsFlowType> = [
  undefined,
  'row',
  'column',
  'dense',
  'row-dense',
  'column-dense'
];

const gridSizes = [
  { size: 'cols', className: 'grid-cols' },
  { size: 'colsXs', className: 'grid-cols-xs' },
  { size: 'colsSm', className: 'grid-cols-sm' },
  { size: 'colsMd', className: 'grid-cols-md' },
  { size: 'colsLg', className: 'grid-cols-lg' },
  { size: 'colsXl', className: 'grid-cols-xl' },
  { size: 'colsXxl', className: 'grid-cols-xxl' }
];

const rowSizes = [
  { size: 'rows', className: 'grid-rows' },
  { size: 'rowsXs', className: 'grid-rows-xs' },
  { size: 'rowsSm', className: 'grid-rows-sm' },
  { size: 'rowsMd', className: 'grid-rows-md' },
  { size: 'rowsLg', className: 'grid-rows-lg' },
  { size: 'rowsXl', className: 'grid-rows-xl' },
  { size: 'rowsXxl', className: 'grid-rows-xxl' }
];

const minMaxWidths = [
  { setting: 'minColWidth', varName: '--min-col-width' },
  { setting: 'maxColWidth', varName: '--max-col-width' }
];

const minMaxRowHeights = [
  { setting: 'minRowHeight', varName: '--min-row-height' },
  { setting: 'maxRowHeight', varName: '--max-row-height' }
];

/**
 * IDS Grid Component
 * @type {IdsGrid}
 * @inherits IdsElement
 */
@customElement('ids-grid')
@scss(styles)
export default class IdsGrid extends IdsElement {
  /**
   * Set auto-fit attribute
   * @param {boolean | string | null} value boolean
   * @memberof IdsGrid
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
   * @type {(string | boolean | null)}
   * @returns {boolean} Indicates whether the auto-fit is enabled
   * @memberof IdsGrid
   */
  get autoFit(): string | boolean | null {
    return stringToBool(this.getAttribute(attributes.AUTO_FIT));
  }

  /**
   * Set auto-fill attribute
   * @param {boolean | string | null} value boolean
   * @memberof IdsGrid
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
   * @type {(string | boolean | null)}
   * @returns {boolean} Indicates whether the auto-fill is enabled
   * @memberof IdsGrid
   */
  get autoFill(): string | boolean | null {
    return stringToBool(this.getAttribute(attributes.AUTO_FILL));
  }

  /**
   * Set columns attribute
   * @param {boolean | string | null} value sets the number of columns
   * @memberof IdsGrid
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
   * @type {(string | null)}
   * @returns {string | null} The number of columns of the grid
   * @memberof IdsGrid
   */
  get cols(): string | null { return this.getAttribute(attributes.COLS); }

  /**
   * Set XS columns attribute
   * @param {boolean | string | null} value sets the number of columns at the XS breakpoint
   * @memberof IdsGrid
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
   * @type {(string | null)}
   * @returns {string | null} The number of columns of the grid at the XS breakpoint
   * @memberof IdsGrid
   */
  get colsXs(): string | null { return this.getAttribute(attributes.COLS_XS); }

  /**
   * Set SM columns attribute
   * @param {boolean | string | null} value sets the number of columns at the SM breakpoint
   * @memberof IdsGrid
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
   * @type {(string | null)}
   * @returns {string | null} The number of columns of the grid at the SM breakpoint
   * @memberof IdsGrid
   */
  get colsSm(): string | null { return this.getAttribute(attributes.COLS_SM); }

  /**
   * Set MD columns attribute
   * @param {boolean | string | null} value sets the number of columns at the MD breakpoint
   * @memberof IdsGrid
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
   * @type {(string | null)}
   * @returns {string | null} The number of columns of the grid at the MD breakpoint
   * @memberof IdsGrid
   */
  get colsMd(): string | null { return this.getAttribute(attributes.COLS_MD); }

  /**
   * Set LG columns attribute
   * @param {boolean | string | null} value sets the number of columns at the LG breakpoint
   * @memberof IdsGrid
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
   * @type {(string | null)}
   * @returns {string | null} The number of columns of the grid at the LG breakpoint
   * @memberof IdsGrid
   */
  get colsLg(): string | null { return this.getAttribute(attributes.COLS_LG); }

  /**
   * Set XL columns attribute
   * @param {boolean | string | null} value sets the number of columns at the XL breakpoint
   * @memberof IdsGrid
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
   * @type {(string | null)}
   * @returns {string | null} The number of columns of the grid at the XL breakpoint
   * @memberof IdsGrid
   */
  get colsXl(): string | null { return this.getAttribute(attributes.COLS_XL); }

  /**
   * Set XXL columns attribute
   * @param {boolean | string | null} value sets the number of columns at the XXL breakpoint
   * @memberof IdsGrid
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
   * @type {(string | null)}
   * @returns {string | null} The number of columns of the grid at the XXL breakpoint
   * @memberof IdsGrid
   */
  get colsXxl(): string | null { return this.getAttribute(attributes.COLS_XXL); }

  /**
   * Set the minColWidth attribute
   * @param {string | null} value Number value that sets the min-width of the grid columns
   * @memberof IdsGrid
   */
  set minColWidth(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.MIN_COL_WIDTH, value);
    } else {
      this.removeAttribute(attributes.MIN_COL_WIDTH);
    }
  }

  /**
   * Get the minColWidth attribute
   * @readonly
   * @type {(string | null)}
   * @returns {string | null} The number value that represents the min-height of the grid columns
   * @memberof IdsGrid
   */
  get minColWidth(): string | null {
    return this.getAttribute(attributes.MIN_COL_WIDTH);
  }

  /**
   * Set the minRowHeight attribute
   * @param {string | null} value Number value that sets the height of the grid rows
   * @memberof IdsGrid
   */
  set minRowHeight(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.MIN_ROW_HEIGHT, value);
    } else {
      this.removeAttribute(attributes.MIN_ROW_HEIGHT);
    }
  }

  /**
   * Get the minRowHeight attribute
   * @readonly
   * @type {(string | null)}
   * @returns {string | null} The number value that represents the min-height of the grid rows
   * @memberof IdsGrid
   */
  get minRowHeight(): string | null {
    return this.getAttribute(attributes.MIN_ROW_HEIGHT);
  }

  /**
   * Set the maxColWidth attribute
   * @param {string | null} value Number value that sets the max-width of the grid columns
   * @memberof IdsGrid
   */
  set maxColWidth(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.MAX_COL_WIDTH, value);
    } else {
      this.removeAttribute(attributes.MAX_COL_WIDTH);
    }
  }

  /**
   * Get the maxColWidth attribute
   * @readonly
   * @type {(string | null)}
   * @returns {string | null} The number value that represents the max-width of the grid columns
   * @memberof IdsGrid
   */
  get maxColWidth(): string | null {
    return this.getAttribute(attributes.MAX_COL_WIDTH);
  }

  /**
   * Set the maxRowHeight attribute
   * @param {string | null} value Number value that sets the max-height of the grid rows
   * @memberof IdsGrid
   */
  set maxRowHeight(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.MAX_ROW_HEIGHT, value);
    } else {
      this.removeAttribute(attributes.MAX_ROW_HEIGHT);
    }
  }

  /**
   * Get the maxRowHeight attribute
   * @readonly
   * @type {(string | null)}
   * @returns {string | null} The number value that represents the max-height of the grid rows
   * @memberof IdsGrid
   */
  get maxRowHeight(): string | null {
    return this.getAttribute(attributes.MAX_ROW_HEIGHT);
  }

  /**
   * Set the grid gap
   * @param {IdsGapType | null} value The Gap [null, sm, md, lg, xl]
   */
  set gap(value: IdsGapType | null) {
    if (!value || GAP_TYPES.indexOf(value) <= 0) {
      this.removeAttribute(attributes.GAP);
      this.state.gap = GAP_TYPES[0];
    } else {
      this.setAttribute(attributes.GAP, value);
      if (this.state.gap !== value) this.state.gap = value;
    }
  }

  /**
   * Handle The Gap Setting
   * @returns {IdsGapType | null} The Gap [null, sm, md, lg, xl]
   */
  get gap(): IdsGapType | null { return this.state.gap; }

  /**
   * Set the grid justify
   * @param {IdsJustifyType | null} value The justify [null, start, end, between, around, evenly]
   */
  set justifyContent(value: IdsJustifyType | null) {
    if (!value || JUSTIFY_TYPES.indexOf(value) <= 0) {
      this.removeAttribute(attributes.JUSTIFY_CONTENT);
      this.state.justifyContent = JUSTIFY_TYPES[0];
    } else {
      this.setAttribute(attributes.JUSTIFY_CONTENT, value);
      if (this.state.justifyContent !== value) this.state.justifyContent = value;
    }
  }

  /**
   * Get the grid justify setting
   * @returns {IdsJustifyType | null} The justify [null, start, end, between, around, evenly]
   */
  get justifyContent(): IdsJustifyType | null { return this.state.justifyContent; }

  /**
   * Set the flow attribute of the grid
   * @param { IdsFlowType | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  set flow(value: IdsFlowType | null) {
    if (!value || FLOW_TYPES.indexOf(value) <= 0) {
      this.removeAttribute(attributes.FLOW);
      this.state.flow = FLOW_TYPES[0];
    } else {
      this.setAttribute(attributes.FLOW, value);
      if (this.state.flow !== value) this.state.flow = value;
    }
  }

  /**
   * Get the flow attribute
   * @returns { IdsFlowType | null } value Flow [undefined, row, column, dense, row-dense, column-dense]
   */
  get flow(): IdsFlowType | null {
    return this.state.flow;
  }

  set rows(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS, value);
    } else {
      this.removeAttribute(attributes.ROWS);
    }
  }

  get rows(): string | null {
    return this.getAttribute(attributes.ROWS);
  }

  set rowsXs(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_XS, value);
    } else {
      this.removeAttribute(attributes.ROWS_XS);
    }
  }

  get rowsXs(): string | null {
    return this.getAttribute(attributes.ROWS_XS);
  }

  set rowsSm(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_SM, value);
    } else {
      this.removeAttribute(attributes.ROWS_SM);
    }
  }

  get rowsSm(): string | null {
    return this.getAttribute(attributes.ROWS_SM);
  }

  set rowsMd(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_MD, value);
    } else {
      this.removeAttribute(attributes.ROWS_MD);
    }
  }

  get rowsMd(): string | null {
    return this.getAttribute(attributes.ROWS_MD);
  }

  set rowsLg(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_LG, value);
    } else {
      this.removeAttribute(attributes.ROWS_LG);
    }
  }

  get rowsLg(): string | null {
    return this.getAttribute(attributes.ROWS_LG);
  }

  set rowsXl(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_XL, value);
    } else {
      this.removeAttribute(attributes.ROWS_XL);
    }
  }

  get rowsXl(): string | null {
    return this.getAttribute(attributes.ROWS_XL);
  }

  set rowsXxl(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROWS_XXL, value);
    } else {
      this.removeAttribute(attributes.ROWS_XXL);
    }
  }

  get rowsXxl(): string | null {
    return this.getAttribute(attributes.ROWS_XXL);
  }

  set rowHeight(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_HEIGHT, value);
    } else {
      this.removeAttribute(attributes.ROW_HEIGHT);
    }
  }

  get rowHeight(): string | null {
    return this.getAttribute(attributes.ROW_HEIGHT);
  }

  constructor() {
    super();
  }

  static get attributes(): any {
    return [
      attributes.AUTO_FIT,
      attributes.AUTO_FILL,
      attributes.COLS,
      attributes.COLS_XS,
      attributes.COLS_SM,
      attributes.COLS_MD,
      attributes.COLS_LG,
      attributes.COLS_XL,
      attributes.COLS_XXL,
      attributes.FLOW,
      attributes.GAP,
      attributes.JUSTIFY_CONTENT,
      attributes.MAX_COL_WIDTH,
      attributes.MIN_COL_WIDTH,
      attributes.MAX_ROW_HEIGHT,
      attributes.MIN_ROW_HEIGHT,
      attributes.ROW_HEIGHT,
      attributes.ROWS,
      attributes.ROWS_XS,
      attributes.ROWS_SM,
      attributes.ROWS_MD,
      attributes.ROWS_LG,
      attributes.ROWS_XL,
      attributes.ROWS_XXL
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addSettings();
  }

  private addSettings() {
    this.classList.add('grid');
    this.setColumns();
    this.setRows();
    this.setMinMaxWidth();
    this.setMinMaxRowHeight();
    this.setAutoFit();
    this.setAutoFill();
    this.setRowHeight();

    requestIdleCallback(() => {
      this.setGap();
      this.setJustify();
      this.setFlow();
    });
  }

  private setColumns() {
    for (const { size, className } of gridSizes) {
      if (this[size as keyof IdsGrid] !== null) {
        this.classList.add(`${className}-${this[size as keyof IdsGrid]}`);
      }
    }
  }

  private setRows() {
    for (const { size, className } of rowSizes) {
      if (this[size as keyof IdsGrid] !== null) {
        this.classList.add(`${className}-${this[size as keyof IdsGrid]}`);
      }
    }
  }

  private setMinMaxWidth() {
    for (const { setting, varName } of minMaxWidths) {
      if (this[setting as keyof IdsGrid] !== null) {
        this.style.setProperty(varName, this[setting as keyof IdsGrid]);
      }
    }
  }

  private setMinMaxRowHeight() {
    for (const { setting, varName } of minMaxRowHeights) {
      if (this[setting as keyof IdsGrid] !== null) {
        this.style.setProperty(varName, this[setting as keyof IdsGrid]);
      }
    }
  }

  private setGap() {
    if (this.gap !== undefined) {
      this.classList.add(`grid-gap-${this.gap}`);
    }
  }

  private setAutoFit() {
    if (this.autoFit) {
      this.classList.add('grid-auto-fit');
    }
  }

  private setAutoFill() {
    if (this.autoFill) {
      this.classList.add('grid-auto-fill');
    }
  }

  private setFlow() {
    if (this.flow !== undefined) {
      this.classList.add(`grid-flow-${this.flow}`);
    }
  }

  private setRowHeight() {
    if (this.rowHeight !== null) {
      this.classList.add('grid-auto-row-height');
      this.style.setProperty('--grid-auto-row-height', this.rowHeight);
    }
  }

  private setJustify() {
    if (this.justifyContent !== undefined) {
      this.classList.add(`justify-content-${this.justifyContent}`);
    }
  }

  template(): string {
    return `<slot></slot>`;
  }
}
