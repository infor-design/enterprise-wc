// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../ids-base/ids-element';

import IdsMenu from './ids-menu';
import IdsMenuHeader from './ids-menu-header';
import IdsMenuItem from './ids-menu-item';
import IdsIcon from '../ids-icon/ids-icon';

export default class IdsMenuGroup extends IdsElement {
  /* */
  readonly menu: IdsMenu;

  /* */
  readonly items: Array<IdsMenuItem>;

  /* */
  readonly itemIcons: Array<IdsIcon>;

  /* */
  readonly header?: IdsMenuHeader;

  /* */
  select: 'none' | 'single' | 'multiple';

  /* */
  keepOpen: boolean;

  /* */
  deselectAllExcept(keptItems?: Array<IdsMenuItem>): void;

  /* */
  connectedCallback(): void;
}
