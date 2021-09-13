// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';

export default class IdsLayoutGridCell extends IdsElement {
  /** Set the background fill color */
  fill: string;

  /** Set the amount of columns to span */
  colSpan: string;

  /** Set the amount of columns to span at xs breakpoint */
  colSpanXs: string;

  /** Set the amount of columns to span at sm breakpoint */
  colSpanSm: string;

  /** Set the amount of columns to span at md breakpoint */
  colSpanMd: string;

  /** Set the amount of columns to span at lg breakpoint */
  colSpanLg: string;

  /** Set the amount of columns to span at xl breakpoint */
  colSpanXl: string;

  /** Set the amount of columns to span at xxl breakpoint */
  colSpanXxl: string;

  /** Set the starting column */
  colStart: boolean;

  /** Set the ending column */
  colEnd: string;

  /** Set the amount of rows to span */
  rowSpan: string;

  /** Set the starting row */
  rowStart: string;

  /** Set the ending row */
  rowEnd: string;
}
