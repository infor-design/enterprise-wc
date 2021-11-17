import Base from './ids-virtual-scroll-base';

export default class IdsVirtualScroll extends Base {
  /** Set the internal element template markup for a single element */
  itemTemplate: (item: unknown) => string | string;

  /** Attach a dataset that matches the list template and render */
  data: Array<unknown>;

  /** Set internal element that will be the scrollable area  */
  scrollTarget?: HTMLElement;

  /** Set the scroll top position and scroll down to that location  */
  scrollTop: number;

  /** The height in pixels we want the scroll area to be  */
  height: number;

  /** The height of each item in the list, must be fixed size */
  itemHeight: number;

  /** The number of elements in the dataset. This is also set internally when attaching data */
  itemCount: number;

  /** The number of extra elements to render to improve or tweak the scroll experience */
  bufferSize: number;
}
