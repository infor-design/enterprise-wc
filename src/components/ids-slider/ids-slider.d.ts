import { IdsElement } from '../../core';

export default class IdsSlider extends IdsElement {
  /** Sets the color of the slider bar */
  color: string | 'success' | 'warning' | 'caution' | 'error' | 'base';

  /** Sets the max value of the slider */
  max: string | number;

  /** Sets the minimum value of the slider */
  min: string | number;

  /** Sets the type of the slider */
  type: 'single' | 'double' | 'step';

  /** Sets the amt of steps in the slider */
  stepNumber: string | number;

  /** Sets the primary value of the slider */
  value: string | number;

  /** Sets the secondary value of the slider; Only applicable for double slider */
  valueSecondary: string | number;

  /** Sets the orientation of the slider to vertical */
  vertical: boolean;
}
