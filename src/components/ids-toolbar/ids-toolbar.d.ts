import { IdsElement } from '../../core';
import IdsToolbarSection from './ids-toolbar-section';
import IdsToolbarMoreActions from './ids-toolbar-more-actions';

export default class IdsToolbar extends IdsElement {
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

  /** If true, the entire toolbar will become disabled */
  disabled: boolean;

  /** If true, sets the Toolbar mode to allow ALL items to have a usable tabIndex. Default is false, which means one Toolbar element is focusable at a time. */
  tabbable: boolean;

  /* Uses a currently-highlighted menu item to "navigate" a specified number of steps to another menu item, highlighting it. */
  navigate(amt: number, doFocus: boolean): Array<HTMLElement>;
}

export {
  IdsToolbarSection,
  IdsToolbarMoreActions
};
