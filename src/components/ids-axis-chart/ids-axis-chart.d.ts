export default class IdsAxisChart extends HTMLElement {
  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Sets the title of the line chart */
  title: string;

  /** Set the data array of the chart */
  data: Array<unknown>;

  /** The height of the chart (in pixels) */
  height?: number;

  /** The width of the chart (in pixels) */
  width?: number;

  /** Set the left, right, top, bottom margins */
  margins: object;

  /** Show or hide the vertical grid lines */
  showVerticalLines?: boolean;

  /** Show or hide the horizontal grid lines */
  showHorizontalLines?: boolean;

  /** Set the format on the x axis items */
  xAxisFormatter?: object | boolean;

  /** Set the format on the y axis items */
  yAxisFormatter?: object | boolean;
}
