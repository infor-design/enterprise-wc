export default class IdsLayoutGridCell extends HTMLElement {
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

  /** Float the element to the right using justify-self */
  justify: boolean;
}
