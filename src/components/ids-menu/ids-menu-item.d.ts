// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';
import IdsMenu from './ids-menu';
import IdsMenuGroup from './ids-menu-group';
import IdsIcon from '../ids-icon/ids-icon';

interface selected extends Event {
  bubbles: true,
  detail: {
    elem: IdsMenuItem,
    value: unknown
  }
}

interface deselected extends Event {
  bubbles: true,
  detail: {
    elem: IdsMenuItem,
    value: unknown
  }
}

interface beforeselected extends Event {
  bubbles: true,
  detail: {
    elem: IdsMenuItem,
    response: (isVoid: boolean) => void;
  }
}

interface beforedeselected extends Event {
  bubbles: true,
  detail: {
    elem: IdsMenuItem,
    response: (isVoid: boolean) => void;
  }
}

export default class IdsMenuItem extends IdsElement {
  /* Internal state object used for some attributes */
  readonly state: unknown;

  /* reference to the Menu Item's anchor */
  readonly a: HTMLAnchorElement;

  /* reference to the parent IdsMenuGroup component */
  readonly group: IdsMenuGroup;

  /* reference to a defined IDS Icon element, if applicable */
  readonly iconEl?: IdsIcon;

  /* reference to the parent IdsMenu component, if one exists */
  readonly menu?: IdsMenu;

  /* reference to this item's submenu, if one is present */
  readonly submenu?: IdsMenu;

  /* boolean check, true if this menu item contains a submenu */
  readonly hasSubmenu: boolean;

  /* returns this menu item's textContent stripped of any extraneous white space */
  readonly text: string;

  /* enables/disables the component */
  disabled: boolean;

  /* highlights/unhighlights the component */
  highlighted: boolean;

  /* defines an IdsIcon's `icon` attribute, if one is present */
  icon?: string;

  /* returns true if this item is currently selected */
  selected: boolean;

  /* defines how this component responds to tab focus */
  tabIndex: number;

  /* the value of the menu item */
  value?: unknown;

  /* defines the text alignment of the menu item, start | center | end */
  textAlign?: string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /* Highlights this menu item */
  highlight(): void;

  /* Unhighlights this menu item */
  unhighlight(): void;

  /* Deselects this menu item */
  deselect(): void;

  /* Selects this menu item */
  select(): void;

  /* Hides this menu item's submenu, if one is present */
  hideSubmenu(): void;

  /* Shows this menu item's submenu, if one is present */
  showSubmenu(): void;

  /** Fires before the tag is removed, you can return false in the response to veto. */
  on(event: 'beforeselected', listener: (event: beforeselected) => void): this;

  /** Fires before the tag is removed, you can return false in the response to veto. */
  on(event: 'beforedeselected', listener: (event: beforedeselected) => void): this;

  /** Fires before the tag is removed, you can return false in the response to veto. */
  on(event: 'selected', listener: (event: selected) => void): this;

  /** Fires before the tag is removed, you can return false in the response to veto. */
  on(event: 'deselected', listener: (event: deselected) => void): this;
}
