import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import IdsMenuGroup from './ids-menu-group';
import IdsMenuItem from './ids-menu-item';

import styles from './ids-menu.scss';

/**
 * @private
 * @param {string|HTMLElement} menuGroup the group to search for
 * @param {HTMLElement} idsMenu the parent menu element
 * @returns {HTMLElement|undefined} if valid, a reference to the menu group.
 * Otherwise, returns undefined.
 */
function isValidGroup(menuGroup, idsMenu) {
  let hasGroup;
  const isElem = menuGroup instanceof HTMLElement;

  idsMenu.groups.forEach((group) => {
    if ((isElem && group.isEqualNode(menuGroup)) || (group?.id === menuGroup)) {
      hasGroup = group;
    }
  });
  return hasGroup;
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
class IdsMenu extends IdsElement {
  constructor() {
    super();
    this.state = {};
    this.lastHovered = undefined;
  }

  /**
   * Sets up event handlers used in this menu.
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.eventHandlers = new IdsEventsMixin();

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
    // If the item doesn't contain a submenu, select it.
    // If the item does have a submenu, activate it.
    this.eventHandlers.addEventListener('click', this, (e) => {
      const thisItem = e.target.closest('ids-menu-item');
      this.highlightItem(thisItem);
      this.selectItem(thisItem);
      e.stopPropagation();
    });

    // Focus in/out causes highlight to change
    this.eventHandlers.addEventListener('focusin', this, highlightItem);
    this.eventHandlers.addEventListener('focusout', this, unhighlightItem);

    // Listen for when items are selected and perform some actions within the menu
    this.eventHandlers.addEventListener('selected', this, (e) => {
      const thisItem = e.target.closest('ids-menu-item');
      const thisGroup = e.target.closest('ids-menu-group');

      // Single-select groups will force deselection of other items in the group.
      if (thisGroup.select === 'single') {
        this.deselectAllExcept(thisItem, thisGroup);
      }
    });
  }

  /**
   * Sets up the connection to the global keyboard handler
   * @returns {void}
   */
  handleKeys() {
    this.keyboard = new IdsKeyboardMixin();

    // Arrow Up navigates focus backward
    this.keyboard.listen(['ArrowUp'], this, (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigate(-1, true);
    });

    // Arrow Right navigates focus forward
    this.keyboard.listen(['ArrowDown'], this, (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigate(1, true);
    });

    // Enter/Spacebar select the menu item
    this.keyboard.listen(['Enter', 'Spacebar', ' '], this, (e) => {
      const thisItem = e.target.closest('ids-menu-item');
      this.selectItem(thisItem);
      e.stopPropagation();
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
    const hasIconsClass = this.itemIcons.length ? ' has-icons' : '';
    return `<nav class="ids-menu${hasIconsClass}" role="menu">
      <slot></slot>
    </nav>`;
  }

  /**
   * @readonly
   * @returns {Array<IdsMenuGroup>} all available groups
   */
  get groups() {
    return [...this.children].filter((e) => e.matches('ids-menu-group'));
  }

  /**
   * @readonly
   * @returns {Array<IdsMenuItem>} all available menu items
   */
  get items() {
    let i = [];
    this.groups.forEach((group) => {
      i = i.concat([...group.children].filter((e) => e.matches('ids-menu-item')));
    });
    return i;
  }

  /**
   * References all icons that describe menu item contents (ignores dropdown/check icons)
   * @readonly
   * @returns {Array<HTMLElement>} list of items
   */
  get itemIcons() {
    const icons = [];
    this.items.forEach((item) => {
      if (item.iconEl) {
        icons.push(item.iconEl);
      }
    });
    return icons;
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
   * @returns {IdsMenuItem} the item that is:
   * - last hovered by the mouse (if applicable)
   * - currently/previously selected (if applicable)
   * - the first available menu item closest to the top of the menu that is not disabled or hidden.
   */
  get focusTarget() {
    let target = this.lastHovered;
    if (!target) {
      const selected = this.getSelectedItems();
      if (!selected.length) {
        target = this.getFirstAvailableItem();
      } else {
        target = selected[0];
      }
    }
    return target;
  }

  /**
   * @readonly
   * @returns {Array<IdsMenuItem>} all menu items that are currently highlighted
   */
  get highlighted() {
    return this.items.filter((item) => item.highlighted);
  }

  /**
   * @readonly
   * @returns {IdsMenu} parent menu component, if this menu is a submenu
   */
  get parentMenu() {
    return this.parentNode.closest('ids-menu, ids-popup-menu');
  }

  /**
   * @readonly
   * @returns {IdsMenuItem} parent menu item, if this menu is a submenu
   */
  get parentMenuItem() {
    return this.parentNode.closest('ids-menu-item');
  }

  /**
   * @readonly
   * @returns {Array<IdsMenu>} list of all available submenus
   */
  get submenus() {
    const submenus = [];
    this.items.forEach((item) => {
      const submenu = item.submenu;
      if (submenu) {
        submenus.push(submenu);
      }
    });
    return submenus;
  }

  /**
   * Unhighlights all menu items, then highlights a specified item.
   * @param {IdsMenuItem} menuItem reference to the menu item that will be highlighted
   * @returns {void}
   */
  highlightItem(menuItem) {
    if (!isUsableItem(menuItem, this, true)) {
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
    const icons = this.itemIcons;
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
    if (this.lastHovered) {
      currentItem = this.lastHovered;
      this.lastHovered = undefined;
    }

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

    if (!currentItem.disabled && doFocus) {
      currentItem.focus();
    }

    return currentItem;
  }

  /**
   * @returns {IdsMenuItem} the first available item, closest to the top of the menu.
   */
  getFirstAvailableItem() {
    const items = this.items;
    const itemLength = items.length;
    let item;
    let i = 0;

    while (!item && i < itemLength) {
      if (!items[i].disabled && !items[i].hidden) {
        item = items[i];
      }
      i += 1;
    }
    return item;
  }

  /**
   * Retrieves a list of selected items in this menu.
   * @param {string|HTMLElement} [menuGroup] a string representing an ID, or an IdsMenuGroup
   * directly, that optionally limits results to within a specified menu group.
   * @returns {Array<IdsMenuItem>} list of selected menu items
   */
  getSelectedItems(menuGroup) {
    const group = isValidGroup(menuGroup, this);
    return this.items.filter((item) => {
      if (group) {
        return item.selected && item.group.isEqualNode(group);
      }
      return item.selected;
    });
  }

  /**
   * @param {string|HTMLElement} [menuGroup] a string representing an ID, or an IdsMenuGroup
   * directly, that optionally limits results to within a specified menu group.
   * @returns {Array<any>} list of the values contained by selected menu items
   */
  getSelectedValues(menuGroup) {
    return this.getSelectedItems(menuGroup).map((item) => (item.value));
  }

  /**
   * Selects a menu item contained by this menu.
   * @param {IdsMenuItem} menuItem the item to be selected
   * @returns {void}
   */
  selectItem(menuItem) {
    if (!isUsableItem(menuItem, this, true)) {
      return;
    }

    // If the menu item is a submenu container, by definition it cannot be selected.
    // In this case, just make an attempt to open the submenu.
    if (menuItem.hasSubmenu) {
      menuItem.showSubmenu();
      return;
    }

    const group = menuItem.parentNode;
    const items = group.items;
    let targetDeselection;

    items.forEach((item) => {
      if (!item.isEqualNode(menuItem) && item.selected) {
        targetDeselection = item;
      }
    });

    switch (group.select) {
      case 'multiple':
        // Multiple-select mode (Toggles selection, ignores others)
        menuItem[menuItem.selected ? 'deselect' : 'select']();
        break;
      default:
        // "none" and "single" select mode.
        // In "single" mode, deselection of other items is handled by event
        // at the menu group level.
        menuItem.select();
        break;
    }
  }

  /**
   * Causes all menu items except for those provided to become deselected.
   * @param {IdsMenuItem|Array<IdsMenuItem>} keptItems a single item or list of items
   * whose selection will be ignored.
   * @param {string|HTMLElement} [menuGroup] if provided and valid, causes deselection to be
   * scoped to a menu group.
   * @returns {void}
   */
  deselectAllExcept(keptItems, menuGroup) {
    const keptItemsArr = Array.isArray(keptItems) ? keptItems : [keptItems];
    const selectedItems = this.getSelectedItems(menuGroup);
    selectedItems.forEach((item) => {
      if (!keptItemsArr.includes(item)) {
        item.deselect();
      }
    });
  }

  /**
   * Clears any selected items in the menu, or specified group
   * @param {string|HTMLElement} [menuGroup] a string representing an ID, or an IdsMenuGroup
   * directly, that optionally limits results to within a specified menu group.
   * @returns {void}
   */
  clearSelectedItems(menuGroup) {
    const group = isValidGroup(menuGroup, this);
    this.items.forEach((item) => {
      let doDeselect;
      if (group) {
        doDeselect = item.selected && item.group.isEqualNode(group);
      } else {
        doDeselect = item.selected;
      }

      if (doDeselect) {
        item.deselect();
      }
    });
  }
}

export default IdsMenu;
