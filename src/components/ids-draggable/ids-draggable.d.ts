import { IdsElement } from '../../core';

export default class IdsDraggable extends IdsElement {
  /**
   * The axis that the draggable content will
   * be moving along (e.g. X => horizontal, Y => vertical);
   * By default, not defined and supports both axes.
   */
  axis?: 'x' | 'y' | undefined;

  /**
   * Whether the draggable should be limited in range
   * by its parent element
   */
   parentContainment?: boolean;

  /**
   * Whether or not draggable functionality is disabled
   */
  disabled?: boolean;

  /**
   * A query selector representing an optional handle that can be used to
   * drag the content of the draggable
   */
  handle?: string;
}
