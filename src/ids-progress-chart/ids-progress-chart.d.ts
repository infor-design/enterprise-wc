import { IdsElement } from '../ids-base';

export default class IdsNotificationBanner extends IdsElement {
  /** Sets the color theme of the chart */
  color: 'success' | 'warning' | 'caution' | 'error' | 'base' | string;

  /** Sets the main label of the chart */
  label: string;

  /** Sets the labelValue of the chart */
  labelValue: string;

  /** Sets the labelTotal of the chart */
  labelTotal: string;

  value: string;

  total: string;

  size: 'small' | 'large' | string;
}
