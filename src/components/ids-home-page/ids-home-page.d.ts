// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../../core';

/** Interface for home page event detail */
interface IdsHomePageEventDetail extends Event {
  detail: {
    /** The home page element */
    elem: IdsHomePage,

    /** The number of current rows */
    rows: number,

    /** The number of current columns */
    cols: number,

    /** Current height of the container */
    containerHeight: number,

    /** The current matrix for each block */
    blocks: Array<unknown>
  }
}

export default class IdsHomePage extends IdsElement {
  /** Set to animated or not the home page cards on resize */
  animated: boolean | string;

  /** Set card height for single span */
  cardHeight: number | string;

  /** Set card width for single span */
  cardWidth: number | string;

  /** Set number of columns to display */
  cols: number | string;

  /** Set card gap for single span, apply same for both horizontal and vertical sides */
  gap: number | string;

  /** Set card horizontal gap for single span */
  gapX: number | string;

  /** Set card vertical gap for single span */
  gapY: number | string;

  /** Refresh will resize calculations to update any changes */
  refresh(animated: boolean): void;

  /** Fires after the page is resized and layout is set */
  on(event: 'resized', listener: (detail: IdsHomePageEventDetail) => void): this;
}
