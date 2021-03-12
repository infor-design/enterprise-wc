import { IdsElement, mix, scss, customElement } from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
// @ts-ignore
import styles from './ids-toolbar.scss';

// Supporting Components
import IdsToolbarSection, { TOOLBAR_ITEM_TAGNAMES } from './ids-toolbar-section';
import IdsToolbarMoreActions from './ids-toolbar-more-actions';
import IdsDOMUtils from '../ids-base/ids-dom-utils';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';

const TOOLBAR_PROPS = [];

/**
 * IDS Toolbar Component
 */
@customElement('ids-toolbar')
@scss(styles)
class IdsToolbar extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
  constructor() {
    super();
  }

  static get properties() {
    return TOOLBAR_PROPS;
  }

  connectedCallback() {
    this.setAttribute('role', 'toolbar');
    this.handleKeys();
  }

  /**
   * Sets up the connection to the global keyboard handler
   * @returns {void}
   */
  handleKeys() {
    // Arrow Up navigates focus backward
    this.listen(['ArrowLeft'], this, (e) => {
      e.preventDefault();
      e.stopPropagation();

      // If the target is a menu item (either menu/actions button),
      // attempt to close the menu.
      if (e.target.name === 'ids-menu-item' || (e.target.matches('ids-toolbar-more-actions') && e.target.menu.isOpen)) {
        return;
      }
      this.navigate(-1, true);
    });

    // Arrow Right navigates focus forward
    this.listen(['ArrowRight'], this, (e) => {
      e.preventDefault();
      e.stopPropagation();

      // If the target is a menu item (either menu/actions button),
      // attempt to close the menu.
      if (e.target.name === 'ids-menu-item' || (e.target.matches('ids-toolbar-more-actions') && e.target.menu.isOpen)) {
        return;
      }
      this.navigate(1, true);
    });
  }

  /**
   * Uses a currently-highlighted toolbar item to "navigate" a specified number
   * of steps to another toolbar item, highlighting it.
   * @param {number} [amt] the amount of items to navigate
   * @param {boolean} [doFocus] if true, causes the new item to become focused.
   * @returns {any} the item that will be focused
   */
  navigate(amt = 0, doFocus = false) {
    const items = this.items;
    let currentItem = this.focused || items[0];

    if (typeof amt !== 'number') {
      return currentItem;
    }

    // Calculate steps/meta
    const negative = amt < 0;
    let steps = Math.abs(amt);
    let currentIndex = items.indexOf(currentItem);

    // Step through items to the target
    while (steps > 0) {
      currentItem = items[currentIndex + (negative ? -1 : 1)];
      currentIndex = items.indexOf(currentItem);

      // "-1" means we've crossed the boundary and need to loop back around
      if (currentIndex < 0) {
        currentIndex = (negative ? items.length - 1 : 0);
        currentItem = items[currentIndex];
      }

      // Don't count disabled items as "taking a step"
      if (!currentItem.disabled) {
        steps -= 1;
      }
    }

    if (!currentItem.disabled && doFocus) {
      currentItem.focus();
    }

    return currentItem;
  }

  template() {
    return `<div class="ids-toolbar" role="toolbar">
      <slot></slot>
    </div>`;
  }

  /**
   * @readonly
   * @returns {any} the currently focused menu item, if one exists
   */
  get focused() {
    // @TODO clean this up / document why/how it works
    // @ts-ignore
    return this.items.find((item) => {
      const container = IdsDOMUtils.getClosestContainerNode(item);
      const focused = container.activeElement;
      const isEqualNode = focused?.isEqualNode(item);
      return isEqualNode;
    });
  }

  /**
   * @readonly
   * @returns {Array<any>} list of available sections within the toolbar
   */
  get sections() {
    return [...this.children].filter((e) => e.matches('ids-toolbar-section, ids-toolbar-more-actions'));
  }

  /**
   * @readonly
   * @returns {Array<any>} list of available items, separated per section
   */
  get items() {
    let i = [];
    this.sections.forEach((section) => {
      // Pass along the More Actions button, if applicable
      if (section?.name === 'ids-toolbar-more-actions') {
        i.push(section.button);
      } else {
        i = i.concat([...section.items]);
      }
    });
    return i;
  }
}

export default IdsToolbar;
export { IdsToolbarSection, IdsToolbarMoreActions, TOOLBAR_ITEM_TAGNAMES };
