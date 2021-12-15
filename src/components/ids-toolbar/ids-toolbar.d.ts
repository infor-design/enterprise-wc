import IdsToolbarSection from './ids-toolbar-section';
import IdsToolbarMoreActions from './ids-toolbar-more-actions';

export default class IdsToolbar extends HTMLElement {
  /** Provides a list of all available toolbar items */
  readonly items: Array<HTMLElement>;

  /** Provides a list of all available toolbar sections */
  readonly sections: Array<IdsToolbarSection>;

  /** Provides a list of all available toolbar separators */
  readonly separators: Array<HTMLElement>;

  /** References the currently-focused toolbar item, if applicable */
  readonly focused: HTMLElement | undefined;

  /** Sets the type of toolbar */
  type?: 'formatter';

  /* Uses a currently-highlighted menu item to "navigate" a specified number of steps to another menu item, highlighting it. */
  navigate(amt: number, doFocus: boolean): Array<HTMLElement>;
}

export {
  IdsToolbarSection,
  IdsToolbarMoreActions
};
