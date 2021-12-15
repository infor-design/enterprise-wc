export default class IdsDraggable extends HTMLElement {
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

  /**
   *  The minimum offset/x-transform/translate the draggable can be translated/dragged on the DOM.
   */
  minTransformX?: number;

  /**
   * The maximum offset/x-transform/translate the draggable can be placed from its position on the DOM.
   */
  maxTransformX?: number;

  /**
   * The minimum offset/y-transform/translate the draggable can be placed frm it's position on the DOM.
   */
  minTransformY?: number;

  /**
   * The maximum offset/y-transform/translate the draggable can be from it's position on the dom
   */
  maxTransformY?: number;
}
