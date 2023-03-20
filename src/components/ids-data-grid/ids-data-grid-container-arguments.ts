import { eventPath, findInPath } from '../../utils/ids-event-path-utils/ids-event-path-utils';
import { stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import type IdsDataGrid from './ids-data-grid';

/**
 * Container arguments interface.
 */
export interface IdsDataGridContainerArgs {
  /* Column id */
  columnId?: string;
  /* Column data */
  columnData?: any;
  /* Column index */
  columnIndex?: number;
  /* Column group id */
  columnGroupId?: string;
  /* Column group data */
  columnGroupData?: any;
  /* Column group index */
  columnGroupIndex?: number;
  /* Field data */
  fieldData?: any;
  /* The grid api object */
  grid?: IdsDataGrid;
  /* Is header group */
  isHeaderGroup?: boolean;
  /* Row data */
  rowData?: any;
  /* Row index */
  rowIndex?: number,
  /* Type of target element */
  type?: string;
}

/**
 * Types for container target element.
 */
export const containerTypes = {
  BODY_CELL: 'body-cell',
  BODY_CELL_EDITOR: 'body-cell-editor',
  HEADER_TITLE: 'header-title',
  HEADER_ICON: 'header-icon',
  HEADER_FILTER: 'header-filter',
  HEADER_FILTER_BUTTON: 'header-filter-button',
};

/**
 * Get header arguments.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @param  {HTMLElement[]} path List of path element.
 * @param  {HTMLElement} columnheader The column header element.
 * @returns {IdsDataGridContainerArgs} The header arguments.
 */
export function containerHeaderArgs(
  this: IdsDataGrid,
  path: HTMLElement[],
  columnheader: HTMLElement
): IdsDataGridContainerArgs {
  const filterWrapper = findInPath(path, '.ids-data-grid-header-cell-filter-wrapper') as HTMLElement;
  const isHeaderIcon = !!(findInPath(path, '.ids-data-grid-header-icon') as HTMLElement);
  const isHeaderGroup = columnheader.hasAttribute('column-group-id');

  // Set type
  const types = containerTypes;
  let type = types.HEADER_TITLE;
  if (isHeaderIcon) type = types.HEADER_ICON;
  else if (filterWrapper) {
    const filterButton = findInPath(path, '[data-filter-conditions-button]') as HTMLElement;
    type = filterButton ? types.HEADER_FILTER_BUTTON : types.HEADER_FILTER;
  }

  // The arguments to pass along callback
  let callbackArgs: IdsDataGridContainerArgs = { type, isHeaderGroup, grid: this };
  if (isHeaderGroup) {
    // Header (Group)
    const columnGroupId = columnheader.getAttribute('column-group-id') as string;
    const columnGroupData = this.columnGroupDataById(columnGroupId);
    callbackArgs = {
      ...callbackArgs,
      columnGroupId,
      columnGroupData,
      rowIndex: 0,
      columnGroupIndex: this.columnGroupIdxById(columnGroupId),
    };
  } else {
    // Header (Non-Group)
    const columnId = columnheader.getAttribute('column-id') as string;
    const columnIndex = this.columnIdxById(columnId);
    const columnData = this.columns[columnIndex as number];
    callbackArgs = {
      ...callbackArgs,
      columnId,
      columnIndex,
      columnData,
      rowIndex: this.columnGroups ? 1 : 0,
    };
  }
  return callbackArgs;
}

/**
 * Get body cell callback arguments.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @param  {HTMLElement[]} path List of path element.
 * @param  {HTMLElement} cellEl The cell element.
 * @returns {void}
 */
export function containerBodyCellArgs(
  this: IdsDataGrid,
  path: HTMLElement[],
  cellEl: HTMLElement
): IdsDataGridContainerArgs {
  const isEditing = !!(findInPath(path, '.is-editing') as HTMLElement);
  const rowIndex = stringToNumber(findInPath(path, '[role="row"]')?.getAttribute('data-index'));
  const columnIndex = stringToNumber(cellEl.getAttribute('aria-colindex')) - 1;
  const rowData = this.data[rowIndex];
  const columnData = this.columns[columnIndex];
  const columnId = columnData.id;
  const fieldData = rowData[columnId];

  // The arguments to pass along callback
  return {
    type: isEditing ? containerTypes.BODY_CELL_EDITOR : containerTypes.BODY_CELL,
    rowData,
    rowIndex,
    columnData,
    columnId,
    columnIndex,
    fieldData,
    grid: this
  };
}

/**
 * Get container arguments.
 * @param {IdsDataGrid} this The data grid object.
 * @param {MouseEvent} e The event.
 * @returns {IdsDataGridContainerArgs} The callback arguments.
 */
export function containerArguments(
  this: IdsDataGrid,
  e: MouseEvent
): IdsDataGridContainerArgs {
  const path = eventPath(e);
  const cellEl = findInPath(path, '[role="gridcell"]');
  const columnheader = findInPath(path, '[role="columnheader"]');
  let args: IdsDataGridContainerArgs = {};

  if (cellEl) {
    args = containerBodyCellArgs.apply(this, [path, cellEl]);
  } else if (columnheader) {
    args = containerHeaderArgs.apply(this, [path, columnheader]);
  }

  return args;
}
