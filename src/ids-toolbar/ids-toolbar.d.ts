import { IdsElement } from '../ids-base';
import IdsToolbarSection from './ids-toolbar-section';
import IdsToolbarMoreActions from './ids-toolbar-more-actions';

export default class IdsToolbar extends IdsElement {
  /** Provides a list of all available toolbar items */
  readonly items: Array<HTMLElement>;

  /** Provides a list of all available toolbar sections */
  readonly sections: Array<IdsToolbarSection>;

  /** References the currently-focused toolbar item, if applicable */
  readonly focused: HTMLElement | undefined;

  /* Uses a currently-highlighted menu item to "navigate" a specified number of steps to another menu item, highlighting it. */
  navigate(amt: number, doFocus: boolean): Array<HTMLElement>;
}

export {
  IdsToolbarSection,
  IdsToolbarMoreActions
};
