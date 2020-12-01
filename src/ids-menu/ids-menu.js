import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import IdsMenuItem from './ids-menu-item';

import styles from './ids-menu.scss';

/**
 * @private
 * @param {HTMLElement} idsMenu the IdsMenu element
 * @returns {Array<HTMLElement>} list of items
 */
function itemIcons(idsMenu) {
  const icons = [];
  idsMenu.items.forEach((item) => {
    if (item.iconEl) {
      icons.push(item.iconEl);
    }
  });
  return icons;
}

/**
 * IDS Menu Component
 */
@customElement('ids-menu')
@scss(styles)
@mixin(IdsEventsMixin)
class IdsMenu extends IdsElement {
  constructor() {
    super();
  }

  /**
   * @returns {void}
   */
  handleEvents() {
    const highlightItem = (e) => {
      // Menu Items Only, don't change if the target is disabled
      const thisItem = e.target.closest('ids-menu-item');
      if (!thisItem || !this.contains(thisItem) || thisItem.disabled) {
        return;
      }

      // Unhighlight everything, then highlight this.
      this.items.forEach((item) => {
        if (!thisItem.isEqualNode(item)) {
          item.unhighlight();
        }
      });
      thisItem.highlight();
    };

    // Highlight the item on click/hover/focusin
    this.eventHandlers.addEventListener('click', this, highlightItem);
    this.eventHandlers.addEventListener('hover', this, highlightItem);
    this.eventHandlers.addEventListener('focusin', this, highlightItem);

    // Unhighlight if focus is removed
    this.eventHandlers.addEventListener('focusout', this, (e) => {
      // Menu Items Only
      const thisItem = e.target.closest('ids-menu-item');
      if (!thisItem || !this.contains(thisItem)) {
        return;
      }
      thisItem.unhighlight();
    });
  }

  /**
   * Runs when the menu element is connected to the DOM.
   * @returns {void}
   */
  connectedCallBack() {
    this.detectIcons();
    this.handleEvents();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const hasIconsClass = itemIcons(this).length ? ' has-icons' : '';
    return `<ul class="ids-menu${hasIconsClass}" role="menu">
      <slot></slot>
    </ul>`;
  }

  /**
   * @readonly
   * @returns {Array<IdsMenuItem>} available menu items
   */
  get items() {
    return Array.from(this.querySelectorAll('ids-menu-item, .ids-menu-item'));
  }

  /**
   * @returns {Array<IdsMenuItem>} focused menu items
   */
  get focused() {
    return this.items.filter((item) => document.activeElement.isEqualNode(item));
  }

  /**
   * @returns {Array<IdsMenuItem>} menu items that are currently highlighted
   */
  get highlighted() {
    return this.items.filter((item) => item.highlighted);
  }

  /**
   * Sets/Remove an alignment CSS class
   * @returns {void}
   */
  detectIcons() {
    const icons = itemIcons(this);
    const hasIcons = icons.length > 0;
    this.classList[hasIcons ? 'add' : 'remove']('has-icons');

    this.items.forEach((item) => {
      item.setDisplayType(hasIcons);
    });
  }
}

export default IdsMenu;
