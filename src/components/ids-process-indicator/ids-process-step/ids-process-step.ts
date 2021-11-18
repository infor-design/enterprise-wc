import Base from './ids-process-step-base';

export default class IdsProcessStep extends Base {
  /** Sets the label of process step */
  label?: string;

  /** Sets the status of the process step */
  status?: 'done' | 'started' | 'cancelled' | string;
}
