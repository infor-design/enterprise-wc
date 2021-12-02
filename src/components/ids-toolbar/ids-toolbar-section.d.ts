import { IdsElement } from '../../core';

declare const TOOLBAR_ITEM_TAGNAMES: [
  'ids-button',
  'ids-checkbox',
  'ids-input',
  'ids-menu-button',
  'ids-radio',
  'ids-toolbar-more-actions'
];

export default class IdsToolbarSection extends IdsElement {
  /** Provides a list of all available toolbar items within this section */
  readonly items: Array<HTMLElement>;

  /** Provides a list of all available toolbar separators within this section */
  readonly separators: Array<HTMLElement>;

  /** Sets alignment of the contents in the section */
  align?: string;

  /** Sets the "type" of section */
  type?: 'static' | 'fluid' | 'title' | 'buttonset' | 'search' | 'more';

  /** Sets the type of toolbar */
  toolbarType?: 'formatter';
}
export { TOOLBAR_ITEM_TAGNAMES };
