import { attributes } from '../../core/ids-attributes';

export const GRID_ATTRIBUTES: string[] = [
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
  attributes.MARGIN,
  attributes.MARGIN_Y,
  attributes.MAX_COL_WIDTH,
  attributes.MIN_COL_WIDTH,
  attributes.MAX_ROW_HEIGHT,
  attributes.MIN_ROW_HEIGHT,
  attributes.PADDING,
  attributes.PADDING_X,
  attributes.PADDING_Y,
  attributes.ROW_HEIGHT,
  attributes.ROWS,
  attributes.ROWS_XS,
  attributes.ROWS_SM,
  attributes.ROWS_MD,
  attributes.ROWS_LG,
  attributes.ROWS_XL,
  attributes.ROWS_XXL
];

export const GRID_CELL_ATTRIBUTES: string[] = [
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

export type IdsGapType = undefined | 'sm' | 'md' | 'lg' | 'xl';
export type IdsJustifyType = undefined | 'around' | 'between' | 'center' | 'end' | 'evenly' | 'start';
export type IdsFlowType = undefined | 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';
export type IdsGridMargins = undefined | 'sm' | 'md' | 'lg' | 'xl';
export type IdsGridPadding = undefined | 'sm' | 'md' | 'lg' | 'xl';

export const GAP_TYPES: Array<IdsGapType> = [
  undefined,
  'sm',
  'md',
  'lg',
  'xl',
];

export const JUSTIFY_TYPES: Array<IdsJustifyType> = [
  undefined,
  'around',
  'between',
  'center',
  'end',
  'evenly',
  'start',
];

export const FLOW_TYPES: Array<IdsFlowType> = [
  undefined,
  'row',
  'column',
  'dense',
  'row-dense',
  'column-dense'
];

export const MARGIN_SIZES: Array<IdsGridMargins> = [
  undefined,
  'sm',
  'md',
  'lg',
  'xl'
];

export const PADDING_SIZES: Array<IdsGridPadding> = [
  undefined,
  'sm',
  'md',
  'lg',
  'xl'
];

export const prefix = 'ids-layout-grid';

export const gridSizes = [
  { size: 'cols', className: `${prefix}-cols` },
  { size: 'colsXs', className: `${prefix}-cols-xs` },
  { size: 'colsSm', className: `${prefix}-cols-sm` },
  { size: 'colsMd', className: `${prefix}-cols-md` },
  { size: 'colsLg', className: `${prefix}-cols-lg` },
  { size: 'colsXl', className: `${prefix}-cols-xl` },
  { size: 'colsXxl', className: `${prefix}-cols-xxl` }
];

export const rowSizes = [
  { size: 'rows', className: `${prefix}-rows` },
  { size: 'rowsXs', className: `${prefix}-rows-xs` },
  { size: 'rowsSm', className: `${prefix}-rows-sm` },
  { size: 'rowsMd', className: `${prefix}-rows-md` },
  { size: 'rowsLg', className: `${prefix}-rows-lg` },
  { size: 'rowsXl', className: `${prefix}-rows-xl` },
  { size: 'rowsXxl', className: `${prefix}-rows-xxl` }
];

export const minMaxWidths = [
  { setting: 'minColWidth', varName: '--min-col-width' },
  { setting: 'maxColWidth', varName: '--max-col-width' }
];

export const minMaxRowHeights = [
  { setting: 'minRowHeight', varName: '--min-row-height' },
  { setting: 'maxRowHeight', varName: '--max-row-height' }
];

export const colSpanSizes = [
  { size: 'colSpan', className: `${prefix}-col-span` },
  { size: 'colSpanXs', className: `${prefix}-col-span-xs` },
  { size: 'colSpanSm', className: `${prefix}-col-span-sm` },
  { size: 'colSpanMd', className: `${prefix}-col-span-md` },
  { size: 'colSpanLg', className: `${prefix}-col-span-lg` },
  { size: 'colSpanXl', className: `${prefix}-col-span-xl` },
  { size: 'colSpanXxl', className: `${prefix}-col-span-xxl` }
];

export const colStartSizes = [
  { size: 'colStart', className: `${prefix}-col-start` },
  { size: 'colStartXs', className: `${prefix}-col-start-xs` },
  { size: 'colStartSm', className: `${prefix}-col-start-sm` },
  { size: 'colStartMd', className: `${prefix}-col-start-md` },
  { size: 'colStartLg', className: `${prefix}-col-start-lg` },
  { size: 'colStartXl', className: `${prefix}-col-start-xl` },
  { size: 'colStartXxl', className: `${prefix}-col-start-xxl` }
];

export const colEndSizes = [
  { size: 'colEnd', className: `${prefix}-col-end` },
  { size: 'colEndXs', className: `${prefix}-col-end-xs` },
  { size: 'colEndSm', className: `${prefix}-col-end-sm` },
  { size: 'colEndMd', className: `${prefix}-col-end-md` },
  { size: 'colEndLg', className: `${prefix}-col-end-lg` },
  { size: 'colEndXl', className: `${prefix}-col-end-xl` },
  { size: 'colEndXxl', className: `${prefix}-col-end-xxl` }
];

export const orderSizes = [
  { size: 'order', className: `${prefix}-order` },
  { size: 'orderXs', className: `${prefix}-order-xs` },
  { size: 'orderSm', className: `${prefix}-order-sm` },
  { size: 'orderMd', className: `${prefix}-order-md` },
  { size: 'orderLg', className: `${prefix}-order-lg` },
  { size: 'orderXl', className: `${prefix}-order-xl` },
  { size: 'orderXxl', className: `${prefix}-order-xxl` }
];

export const rowSpanSizes = [
  { size: 'rowSpan', className: `${prefix}-row-span` },
  { size: 'rowSpanXs', className: `${prefix}-row-span-xs` },
  { size: 'rowSpanSm', className: `${prefix}-row-span-sm` },
  { size: 'rowSpanMd', className: `${prefix}-row-span-md` },
  { size: 'rowSpanLg', className: `${prefix}-row-span-lg` },
  { size: 'rowSpanXl', className: `${prefix}-row-span-xl` },
  { size: 'rowSpanXxl', className: `${prefix}-row-span-xxl` }
];

export const addClasses = (element: any, obj: any) => {
  for (const { size, className } of obj) {
    if (element[size] !== null) {
      element.classList.add(`${className}-${element[size]}`);
    }
  }
};

export const addStyleProperty = (element: any, obj: any) => {
  for (const { setting, varName } of obj) {
    if (element[setting] !== null) {
      element.style.setProperty(varName, element[setting]);
    }
  }
};
