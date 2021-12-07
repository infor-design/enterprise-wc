import IdsToolbarSection from './ids-toolbar-section';

// Subcomponents
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import IdsMenuButton from '../ids-menu-button/ids-menu-button';

export default class IdsToolbarMoreActions extends IdsToolbarSection {
  /** The internal Menu Button element */
  readonly button: IdsMenuButton;

  /** The internal Popup Menu element */
  readonly menu: IdsPopupMenu;

  /** List of manually-defined menu items (provided via this component's default slot) */
  readonly predefinedMenuItems: Array<HTMLElement>;

  /** List of menu items that mirror Toolbar items (automatically generated when this component is configured to display overflow) */
  readonly overflowMenuItems: Array<HTMLElement>;

  /** Reference to this component's parent Toolbar element */
  readonly toolbar: HTMLElement;

  /** True if this component should be disabled */
  disabled?: boolean;

  /** True if this component should mirror the Toolbar's overflowed items in its menu */
  overflow?: boolean;

  /** Sets the "type" of section (in this case, it's always "more") */
  type?: 'more';

  /** Focuses the inner Menu Button element */
  focus(): void;

  /** Returns `true` if the item provided is a Toolbar member and should be displayed in the overflow menu */
  isOverflowed(item?: HTMLElement): boolean;

  /** Refreshes the visible state of items in the overflow menu to match their Toolbar counterparts */
  refreshOverflowedItems(): void;
}
export {
  IdsMenuButton,
  IdsPopupMenu
};
