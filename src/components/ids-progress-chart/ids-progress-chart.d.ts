import Base from './ids-progress-chart-base';

export default class IdsProgressChart extends Base {
  /** Sets the color theme of the chart */
  color: 'success' | 'warning' | 'caution' | 'error' | 'base' | string;

  /** Sets the main label of the chart */
  label: string;

  /** Sets the current progress value of the chart */
  progress: string;

  /** Sets the progressLabel of the chart */
  progressLabel: string;

  /** Sets the size of the chart */
  size: 'small' | 'normal';

  /** Sets the progress goal of the chart */
  total: string;

  /** Sets the totalLabel of the chart */
  totalLabel: string;
}
