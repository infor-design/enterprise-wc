// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
} from '../ids-menu/ids-menu';
import IdsPopup from '../ids-popup/ids-popup';

// Subcomponent Export
export {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
};

export default class IdsPopupMenu extends HTMLElement {
  /* references this menu's parent menu component, if this menu is a submenu */
  readonly parentMenu: IdsPopupMenu | undefined;

  /* references the internal IdsPopup component */
  readonly popup: IdsPopup;

  /* defines the "target" HTMLElement in which to apply the PopupMenu */
  target?: HTMLElement | undefined;

  /* defines the action that will cause the menu to appear */
  trigger: 'contextmenu' | 'click' | 'immediate';

  /* hides the menu */
  hide(): void;

  /* shows the menu */
  show(): void;

  /* hides all submenus, ignoring submenus attached to the specified menu item */
  hideSubmenus(focusedMenuItem?: IdsMenuItem): void;
}
