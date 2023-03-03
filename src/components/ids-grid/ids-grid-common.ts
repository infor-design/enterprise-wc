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
  attributes.MAX_COL_WIDTH,
  attributes.MIN_COL_WIDTH,
  attributes.MAX_ROW_HEIGHT,
  attributes.MIN_ROW_HEIGHT,
  attributes.PADDING,
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

export const gridSizes = [
  { size: 'cols', className: 'grid-cols' },
  { size: 'colsXs', className: 'grid-cols-xs' },
  { size: 'colsSm', className: 'grid-cols-sm' },
  { size: 'colsMd', className: 'grid-cols-md' },
  { size: 'colsLg', className: 'grid-cols-lg' },
  { size: 'colsXl', className: 'grid-cols-xl' },
  { size: 'colsXxl', className: 'grid-cols-xxl' }
];

export const rowSizes = [
  { size: 'rows', className: 'grid-rows' },
  { size: 'rowsXs', className: 'grid-rows-xs' },
  { size: 'rowsSm', className: 'grid-rows-sm' },
  { size: 'rowsMd', className: 'grid-rows-md' },
  { size: 'rowsLg', className: 'grid-rows-lg' },
  { size: 'rowsXl', className: 'grid-rows-xl' },
  { size: 'rowsXxl', className: 'grid-rows-xxl' }
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
  { size: 'colSpan', className: 'col-span' },
  { size: 'colSpanXs', className: 'col-span-xs' },
  { size: 'colSpanSm', className: 'col-span-sm' },
  { size: 'colSpanMd', className: 'col-span-md' },
  { size: 'colSpanLg', className: 'col-span-lg' },
  { size: 'colSpanXl', className: 'col-span-xl' },
  { size: 'colSpanXxl', className: 'col-span-xxl' }
];

export const colStartSizes = [
  { size: 'colStart', className: 'col-start' },
  { size: 'colStartXs', className: 'col-start-xs' },
  { size: 'colStartSm', className: 'col-start-sm' },
  { size: 'colStartMd', className: 'col-start-md' },
  { size: 'colStartLg', className: 'col-start-lg' },
  { size: 'colStartXl', className: 'col-start-xl' },
  { size: 'colStartXxl', className: 'col-start-xxl' }
];

export const colEndSizes = [
  { size: 'colEnd', className: 'col-end' },
  { size: 'colEndXs', className: 'col-end-xs' },
  { size: 'colEndSm', className: 'col-end-sm' },
  { size: 'colEndMd', className: 'col-end-md' },
  { size: 'colEndLg', className: 'col-end-lg' },
  { size: 'colEndXl', className: 'col-end-xl' },
  { size: 'colEndXxl', className: 'col-end-xxl' }
];

export const orderSizes = [
  { size: 'order', className: 'order' },
  { size: 'orderXs', className: 'order-xs' },
  { size: 'orderSm', className: 'order-sm' },
  { size: 'orderMd', className: 'order-md' },
  { size: 'orderLg', className: 'order-lg' },
  { size: 'orderXl', className: 'order-xl' },
  { size: 'orderXxl', className: 'order-xxl' }
];

export const rowSpanSizes = [
  { size: 'rowSpan', className: 'row-span' },
  { size: 'rowSpanXs', className: 'row-span-xs' },
  { size: 'rowSpanSm', className: 'row-span-sm' },
  { size: 'rowSpanMd', className: 'row-span-md' },
  { size: 'rowSpanLg', className: 'row-span-lg' },
  { size: 'rowSpanXl', className: 'row-span-xl' },
  { size: 'rowSpanXxl', className: 'row-span-xxl' }
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
