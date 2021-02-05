// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export default class IdsVirtualScroll extends HTMLElement {
  /** Set the internal element template markup for a single element */
  itemTemplate: Function | string;
  /** Attach a dataset that matches the list template and render */
  data: Array<Object>;
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
