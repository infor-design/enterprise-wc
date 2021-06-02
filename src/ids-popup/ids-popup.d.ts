// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../ids-base';

export default class IdsPopup extends IdsElement {
  /** Sets the element to align with via a css selector */
  alignTarget: string | HTMLElement;

  /**
   * Sets the alignment direction between left, right, top, bottom, center and
   * can be a comma delimited set of multiple alignment types for example `left, top`
   */
  align: string;

  /** Strategy for the parent X alignment (see the ALIGNMENTS_X array) */
  alignX: string;

  /** Strategy for the parent X alignment ((see the ALIGNMENTS_Y array) */
  alignY: string;

  /** Specifies the edge of the parent element to be placed adjacent, in configurations where a relative placement occurs */
  alignEdge: string;

  /** Whether or not the component should animate its movement */
  animated: boolean;

  /** Direction of the Popup Arrow, if applicable (defaults to `none`) */
  arrow: 'none' | 'bottom' | 'top' | 'left' | 'right';

  /** Reference to the Arrow Element inside the Popup's Shadow DOM */
  readonly arrowEl: HTMLDivElement;

  /** */
  arrowTarget: string | HTMLElement;

  /** The style of popup to use between 'none', 'menu', 'menu-alt', 'tooltip', 'tooltip-alt' */
  type: string;

  /** Whether or not the component should be displayed */
  visible: boolean;

  /** Sets the X (left) coordinate of the Popup */
  x: number;

  /** Sets the Y (top) coordinate of the Popup */
  y: number;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Calculates the current placement of the Popup */
  refresh(): void;

  /** Places the arrow */
  placeArrow(): void;
}
