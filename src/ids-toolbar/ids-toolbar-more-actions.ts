import { IdsElement } from '../ids-base/ids-element';
import IdsToolbarSection from './ids-toolbar-section';

// Subcomponents
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import IdsMenuButton from '../ids-menu-button/ids-menu-button';

export default class IdsToolbarMoreActions extends IdsToolbarSection {
  /** The internal Menu Button element */
  readonly buttonEl: IdsMenuButton;

  /** The internal Popup Menu element */
  readonly menuEl: IdsPopupMenu;
}
