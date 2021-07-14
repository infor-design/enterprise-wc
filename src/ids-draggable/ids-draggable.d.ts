import { IdsElement } from '../ids-base';

export default class IdsDraggable extends IdsElement {
  /**
   * value the axis that the draggable content will
   * be moving along (e.g. X => horizontal, Y => vertical);
   * By default, not defined and supports both axes.
   */
  axis?: string;
}
