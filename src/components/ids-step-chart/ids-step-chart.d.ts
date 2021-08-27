import { IdsElement } from '../ids-base';

export default class IdsStepChart extends IdsElement {
  color: string;

  completeLabel: string;

  label: string;

  progressColor: string;

  stepsInProgress: Array<string|number>;

  stepNumber: string;

  value: string;
}
