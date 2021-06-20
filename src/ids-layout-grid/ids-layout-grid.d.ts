// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../ids-base';

export default class IdsLayoutGrid extends IdsElement {
  /** If true the grid is not responsive and stays equal width as will fit */
  fixed: boolean;

  /** Handle The Gap Setting */
  gap: 'none' | 'sm' | 'md' | 'lg' | 'xl' | string;

  /** Sets the grid to `auto-fit` */
  auto: boolean;

  /** Sets the amount of columns in the grid */
  cols: string;

  /** Sets the amount of rows in the grid. Works best with fixed height grids */
  rows: string;

  /** If true the grid will not have any margins */
  noMargins: boolean;

  /** Float the element to the right using justify-self */
  justify: boolean;
}
