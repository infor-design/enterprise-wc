import { IdsElement } from '../../../core';

export default class IdsProcessStep extends IdsElement {
  /** Sets the label of process step */
  label: string;

  /** Sets the status of the process step */
  status: 'done' | 'started' | 'cancelled';
}
