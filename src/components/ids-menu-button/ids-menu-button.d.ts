import { IdsButton } from '../ids-button/ids-button';

import IdsIcon from '../ids-icon/ids-icon';
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';

export default class IdsMenuButton extends IdsButton {
  /** Defines the type of icon used as the secondary "dropdown icon".  If null, no icon is used */
  dropdownIcon: string | boolean;

  /** Set the width and formatter style for menu button */
  formatterWidth: string | number;

  /** Sets the selected menu items by value */
  value: Array<unknown> | string;

  /** */
  readonly dropdownIconEl: IdsIcon | null;

  /** */
  menu: string | null;

  /** */
  readonly menuEl: IdsPopupMenu;

  /** */
  configureMenu(): void;

  /** */
  refreshMenu(): void;
}
