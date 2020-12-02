import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import IdsMenuItem from './ids-menu-item';

import styles from './ids-menu.scss';

/**
 * References all icons that describe menu item contents (ignores dropdown/check icons)
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
 * @private
 * @param {IdsMenuItem} item the element to be checked
 * @param {HTMLElement} idsMenu the parent menu element
 * @param {boolean} [checkDisabled] true if "usable" should also mean "not disabled" while checking
 * @returns {boolean} true if the provided element is a "currently-usable" IdsMenuItem type.
 */
function isUsableItem(item, idsMenu, checkDisabled = false) {
  const isItem = item instanceof IdsMenuItem;
  const menuHasItem = idsMenu.contains(item);
  let notDisabled = true;
  if (isItem && checkDisabled) {
    notDisabled = !item.disabled;
  }
  return (isItem && menuHasItem && notDisabled);
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
    this.state = {};
  }

  /**
   * @returns {void}
   */
  handleEvents() {
    // Highlight handler -- Menu Items Only, don't change if the target is disabled
    const highlightItem = (e) => {
      const thisItem = e.target.closest('ids-menu-item');
      if (isUsableItem(thisItem, this, true)) {
        this.highlightItem(thisItem);
      }
    };

    // Unhighlight handler - Menu Items Only
    const unhighlightItem = (e) => {
      const thisItem = e.target.closest('ids-menu-item');
      if (isUsableItem(thisItem, this)) {
        thisItem.unhighlight();
      }
    };

    // Highlight the item on click
    this.eventHandlers.addEventListener('click', this, highlightItem);

    // Focus in/out causes highlight to change
    this.eventHandlers.addEventListener('focusin', this, highlightItem);
    this.eventHandlers.addEventListener('focusout', this, unhighlightItem);
  }

  /**
   * Sets up the connection to the global keyboard handler
   * @returns {void}
   */
  handleKeys() {
    this.keyboard = new IdsKeyboardMixin();

    // Arrow Up/Left navigates focus backward
    this.keyboard.listen(['ArrowUp', 'ArrowLeft'], this, () => {
      this.navigate(-1, true);
    });

    // Arrow Right/Down navigates focus forward
    this.keyboard.listen(['ArrowDown', 'ArrowRight'], this, () => {
      this.navigate(1, true);
    });

    // Enter/Spacebar select the menu item
    this.keyboard.listen(['Enter', 'Spacebar', ' '], this, (e) => {
      const thisItem = e.target.closest('ids-menu-item');
      if (isUsableItem(thisItem, this, true)) {
        this.selectItem(thisItem);
      }
    });
  }

  /**
   * Runs when the menu element is connected to the DOM.
   * @returns {void}
   */
  connectedCallBack() {
    this.detectIcons();
    this.handleEvents();
    this.handleKeys();
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
   * @readonly
   * @returns {IdsMenuItem} the currently focused menu item, if one exists
   */
  get focused() {
    return this.items.find((item) => document.activeElement.isEqualNode(item));
  }

  /**
   * @readonly
   * @returns {Array<IdsMenuItem>} all menu items that are currently highlighted
   */
  get highlighted() {
    return this.items.filter((item) => item.highlighted);
  }

  /**
   * Unhighlights all menu items, then highlights a specified item.
   * @param {IdsMenuItem} menuItem reference to the menu item that will be highlighted
   * @returns {void}
   */
  highlightItem(menuItem) {
    if (!(menuItem instanceof IdsMenuItem)) {
      return;
    }

    this.items.forEach((item) => {
      if (!menuItem.isEqualNode(item)) {
        item.unhighlight();
      }
    });
    menuItem.highlight();
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

  /**
   * Uses a currently-highlighted menu item to "navigate" a specified number
   * of steps to another menu item, highlighting it.
   * @param {number} [amt] the amount of items to navigate
   * @param {boolean} [doFocus] if true, causes the new item to become focused.
   * @returns {IdsMenuItem} the item that will be highlighted
   */
  navigate(amt = 0, doFocus = false) {
    const items = this.items;
    let currentItem = this.focused || items[0];

    if (Number.isNaN(amt)) {
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

    if (doFocus) {
      currentItem.a.focus();
    }

    return currentItem;
  }

  /**
   * Selects a menu item contained by this menu.
   * @param {IdsMenuItem} menuItem the item to be selected
   * @returns {void}
   */
  selectItem(menuItem) {
    const items = this.items;
    items.forEach((item) => {
      if (!item.isEqualNode(menuItem)) {
        item.deselect();
      }
    });

    menuItem.select();
  }
}

export default IdsMenu;
