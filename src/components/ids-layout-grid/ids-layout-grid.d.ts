import Base from './ids-layout-grid-base';

export default class IdsLayoutGrid extends Base {
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

  /** Minimum column width for auto grids. ex: 120px. */
  minColWidth: string;
}
