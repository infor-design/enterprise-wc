// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../ids-base/ids-element';

import IdsMenu from './ids-menu';
import IdsMenuHeader from './ids-menu-header';
import IdsMenuItem from './ids-menu-item';
import IdsIcon from '../ids-icon/ids-icon';

export default class IdsMenuGroup extends IdsElement {
  /* Access the menu element */
  readonly menu: IdsMenu;

  /* Access the menu items */
  readonly items: Array<IdsMenuItem>;

  /* Access the menu icons */
  readonly itemIcons: Array<IdsIcon>;

  /* Access the menu header element */
  readonly header?: IdsMenuHeader;

  /* Set the selection mode */
  select: 'none' | 'single' | 'multiple';

  /* Keep the menu open until closed by the user */
  keepOpen: boolean;
}
