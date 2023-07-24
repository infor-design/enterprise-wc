import { attributes } from '../../core/ids-attributes';

export const prefix = 'ids-layout-grid';

export const GRID_ATTRIBUTES: string[] = [
  attributes.ALIGN_CONTENT,
  attributes.ALIGN_ITEMS,
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
  attributes.MAX_WIDTH,
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
  attributes.ALIGN_CONTENT,
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
  attributes.JUSTIFY_CONTENT,
  attributes.MIN_HEIGHT,
  attributes.PADDING,
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

export type IdsGapType = undefined | 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type IdsJustifyType = undefined | 'space-around' | 'space-between' | 'center' | 'end' | 'space-evenly' | 'start';
export type IdsFlowType = undefined | 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';
export type IdsGridAlignItems = 'start' | 'end' | 'center' | 'stretch';
export type IdsGridMargins = undefined | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto';
export type IdsGridPadding = undefined | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IdsMaxWidth = undefined | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | string;

export const GAP_TYPES: Array<IdsGapType> = [
  undefined,
  'none',
  'sm',
  'md',
  'lg',
  'xl',
];

export const ALIGN_ITEMS: Array<IdsGridAlignItems> = [
  'start',
  'end',
  'center',
  'stretch',
];

export const ALIGN_TYPES: Array<IdsJustifyType> = [
  undefined,
  'space-around',
  'space-between',
  'center',
  'end',
  'space-evenly',
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
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'auto'
];

export const PADDING_SIZES: Array<IdsGridPadding | any> = [
  undefined,
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl'
];

export const MAX_WIDTH_SIZES: Array<IdsMaxWidth | any> = [
  undefined,
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl'
];
