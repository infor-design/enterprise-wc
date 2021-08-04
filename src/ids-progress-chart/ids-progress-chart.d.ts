import { IdsElement } from '../ids-base';

export default class IdsNotificationBanner extends IdsElement {
  /** Sets the color theme of the chart */
  color: 'success' | 'warning' | 'caution' | 'error' | 'base' | string;

  /** Sets the main label of the chart */
  label: string;

  /** Sets the current progress value of the chart */
  progress: string;

  /** Sets the progressLabel of the chart */
  progressLabel: string;

  /** Sets the size of the chart */
  size: 'small' | 'large' | string;

  /** Sets the progress goal of the chart */
  total: string;

  /** Sets the totalLabel of the chart */
  totalLabel: string;
}