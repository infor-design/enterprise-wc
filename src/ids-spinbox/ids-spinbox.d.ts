import { IdsElement } from '../ids-base';

export default class IdsSpinbox extends IdsElement {
  max: number | string;

  min: number | string;

  value: number | string;

  placeholder?: string;

  label: string;

  dirtyTracker: boolean | string;

  disabled: boolean | string;

  validate?: string;
}
