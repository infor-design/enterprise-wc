// Subcomponents
import IdsMenuGroup from './ids-menu-group';
import IdsMenuHeader from './ids-menu-header';
import IdsMenuItem from './ids-menu-item';
import IdsSeparator from '../ids-separator/ids-separator';

// Subcomponent Export
export {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
};

type IdsMenuTarget = {
  trigger: string
}

export default class IdsMenu extends HTMLElement {
  /* references all available menu groups */
  readonly groups: Array<IdsMenuGroup>;

  /* references all available menu items */
  readonly items: Array<IdsMenuItem>;

  /* references the currently focused menu item, if one exists */
  readonly focused: IdsMenuItem | undefined;

  /* references the next focusable item that was last hovered, last selected, or the first item in the list */
  readonly focusTarget: IdsMenuItem | undefined;

  /* references all menu items that are currently highlighted */
  readonly highlighted: Array<IdsMenuItem>;

  /* references this menu's parent menu component, if this menu is a submenu */
  readonly parentMenu: IdsMenu | undefined;

  /* references this menu's parent menu item, if this menu is a submenu */
  readonly parentMenuItem: IdsMenuItem | undefined;

  /* references all available submenus on this menu's direct children */
  readonly submenus: Array<IdsMenu>;

  /* internal state object */
  state: IdsMenuTarget;

  /* Unhighlights all menu items except for one specified item */
  highlightItem(menuItem: IdsMenuItem): void;

  /* Uses a currently-highlighted menu item to "navigate" a specified number of steps to another menu item, highlighting it. */
  navigate(amt: number, doFocus: boolean): IdsMenuItem;

  /* Returns the first available menu item closest to the top of the menu. */
  getFirstAvailableItem(): IdsMenuItem;

  /* Returns a list of all selected menu items in this menu, or a specified menu group */
  getSelectedItems(menuGroup?: IdsMenuGroup | string): Array<IdsMenuItem>;

  /* Returns a list of the values contained by selected menu items, or a specified menu group */
  getSelectedValues(menuGroup?: IdsMenuGroup | string): Array<unknown>;

  /* Selects menu items containing the value(s) provided */
  setSelectedValues(values: Array<unknown> | string, menuGroup?: IdsMenuGroup | string): void;

  /* Selects a menu item contained in this menu, with some additional internal operations */
  selectItem(menuItem?: IdsMenuItem): void;

  /* Clears any selected items in the menu, or specified menu group */
  clearSelectedItems(menuGroup?: IdsMenuGroup | string): void;
}
