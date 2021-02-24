// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../ids-base/ids-element';

export default class IdsLayoutGridCell extends IdsElement {
  /** Set the background fill color */
  fill: string;

  /** Set the amount of columns to span */
  colSpan: string;

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
