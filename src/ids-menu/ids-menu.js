import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../ids-base/ids-element';

import { IdsDataSource } from '../ids-base/ids-data-source';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';

// SubComponents
import IdsMenuGroup from './ids-menu-group';
import IdsMenuHeader from './ids-menu-header';
import IdsMenuItem from './ids-menu-item';
import IdsSeparator from './ids-separator';

// @ts-ignore
import styles from './ids-menu.scss';
import IdsDOMUtils from '../ids-base/ids-dom-utils';

/**
 * @private
 * @param {string|IdsMenuGroup} menuGroup the group to search for
 * @param {IdsMenu} idsMenu the parent menu element
 * @returns {IdsMenuGroup|undefined} if valid, a reference to the menu group.
 * Otherwise, returns undefined.
 */
function isValidGroup(menuGroup, idsMenu) {
  let hasGroup;
  // @ts-ignore
  const isElem = menuGroup instanceof IdsMenuGroup;
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
 * @returns {boolean} true if the provided element is a "currently-usable" IdsMenuItem type.
 */
function isUsableItem(item, idsMenu) {
  // @ts-ignore
  const isItem = item instanceof IdsMenuItem;
  if (!isItem) {
    return false;
  }

  // The item is only usable if it's contained by the correct IdsMenu
  const menuHasItem = idsMenu.contains(item);

  // In some nested cases, we need to detect the item's Shadow Root containment to accurately
  // figure out if it's slotted inside the same menu.
  // @ts-ignore
  const closestItemRoot = IdsDOMUtils.getClosestRootNode(item.assignedSlot);
  // @ts-ignore
  const itemInMenuShadow = closestItemRoot?.menu?.isEqualNode(idsMenu);

  return (itemInMenuShadow || menuHasItem) && !item.disabled;
}

/**
 * IDS Menu Component
 * @type {IdsMenu|any}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-menu')
@scss(styles)
class IdsMenu extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
  constructor() {
    super();
    this.datasource = new IdsDataSource();
    this.state = {};
    this.lastHovered = undefined;
    this.lastNavigated = undefined;
  }

  /**
   * Sets up event handlers used in this menu.
   * @private
   * @returns {void}
   */
  handleEvents() {
    // Highlight handler -- Menu Items Only, don't change if the target is disabled
    const highlightItem = (/** @type {any} */ e) => {
      const thisItem = e.target.closest('ids-menu-item');
      this.highlightItem(thisItem);
    };

    // Unhighlight handler - Menu Items Only
    const unhighlightItem = (/** @type {any} */ e) => {
      const thisItem = e.target.closest('ids-menu-item');
      thisItem.unhighlight();
    };

    // Highlight the item on click
    // If the item doesn't contain a submenu, select it.
    // If the item does have a submenu, activate it.
    this.onEvent('click', this, (/** @type {any} */ e) => {
      const thisItem = e.target.closest('ids-menu-item');
      this.highlightItem(thisItem);
      this.selectItem(thisItem);
      this.lastNavigated = thisItem;
      e.stopPropagation();
    });

    // Focus in/out causes highlight to change
    this.onEvent('focusin', this, highlightItem);
    this.onEvent('focusout', this, unhighlightItem);
  }

  /**
   * Sets up the connection to the global keyboard handler
   * @returns {void}
   */
  handleKeys() {
    // Arrow Up navigates focus backward
    this.listen(['ArrowUp'], this, (/** @type {any} */ e) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigate(-1, true);
    });

    // Arrow Right navigates focus forward
    this.listen(['ArrowDown'], this, (/** @type {any} */ e) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigate(1, true);
    });

    // Enter/Spacebar select the menu item
    this.listen(['Enter', 'Spacebar', ' '], this, (/** @type {any} */ e) => {
      const thisItem = e.target.closest('ids-menu-item');
      this.selectItem(thisItem);
      this.lastNavigated = thisItem;
      e.stopPropagation();
    });
  }

  /**
   * Runs when the menu element is connected to the DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.handleEvents();
    this.handleKeys();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    // Setup the attributes on the top-level menu container
    let id;
    if (this.id) {
      id = ` id="${this.id}"`;
    }

    let slot = '';
    if (this.tagName.toLowerCase() === 'ids-popup-menu') {
      slot = ` slot="content"`;
    }

    return `<nav class="ids-menu"${id}${slot} role="menu"><slot></slot></nav>`;
  }

  /**
   * @param {any} contentsObj a plain object structure with Popupmenu Contents
   * @returns {string} list of HTML
   */
  menuContentTemplate(contentsObj) {
    // Renders a separator
    const renderSeparator = () => `<ids-separator></ids-separator>`;

    // Renders a header
    const renderHeader = (elem) => {
      if (typeof elem.text !== 'string') {
        return '';
      }
      return `<ids-menu-header>${elem.text}</ids-menu-header>`;
    };

    // Renders the contents of a submenu
    const renderContents = (submenuContents) => {
      let html = '';
      submenuContents.forEach((elem) => {
        switch (elem.type) {
        case 'header':
          html += renderHeader(elem);
          break;
        case 'separator':
          html += renderSeparator();
          break;
        case 'group':
        default: // Assume "Group"
          // eslint-disable-next-line
          html += renderGroup(elem);
          break;
        }
      });
      return html;
    };

    // Renders a submenu wrapper
    const renderSubmenu = (submenuData) => {
      if (!Array.isArray(submenuData?.contents) || !submenuData.contents.length) {
        return '';
      }

      let id = '';
      if (submenuData.id) {
        id = ` id="${submenuData.id}"`;
      }
      const contents = renderContents(submenuData.contents);
      return `<ids-popup-menu slot="submenu"${id}>${contents}</ids-popup-menu>`;
    };

    // Renders a single item
    const renderItem = (item) => {
      if (typeof item.text !== 'string') {
        return '';
      }
      const text = `${item.text}`;

      let id = '';
      if (typeof item.id === 'string') {
        id = ` id="${item.id}"`;
      }
      let disabled = '';
      if (item.disabled) {
        disabled = ' disabled="true"';
      }
      let icon = '';
      if (typeof item.icon === 'string') {
        icon = ` icon="${item.icon}"`;
      }
      let selected = '';
      if (item.selected) {
        selected = ' selected="true"';
      }
      let submenu = '';
      if (item.submenu) {
        submenu = renderSubmenu(item.submenu);
      }

      return `<ids-menu-item${id}${disabled}${icon}${selected}>
        ${text}
        ${submenu}
      </ids-menu-item>`;
    };

    // Renders the contents of a group
    const renderGroup = (groupData) => {
      if (!Array.isArray(groupData?.items) || !groupData.items.length) {
        return '';
      }

      let id = '';
      if (groupData.id) {
        id = ` id="${groupData.id}"`;
      }
      let itemsHTML = '';
      groupData.items?.forEach((newItem) => {
        if (newItem?.type === 'separator') {
          itemsHTML += renderSeparator();
        } else {
          itemsHTML += renderItem(newItem);
        }
      });
      return `<ids-menu-group${id}>${itemsHTML}</ids-menu-group>`;
    };

    return renderContents(contentsObj);
  }

  /**
   * Rerender the list by re applying the template
   * @private
   */
  renderFromData() {
    if (this.data?.length === 0) {
      return;
    }

    // Re-apply template (picks up top-level properties from menu data)
    const template = document.createElement('template');
    const html = this.template();

    // Render and append styles
    this.shadowRoot.innerHTML = '';
    template.innerHTML = html;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Re-render all children
    this.innerHTML = '';
    this.insertAdjacentHTML('beforeend', this.menuContentTemplate(this.data));
  }

  /**
   * Set the data array of the datagrid
   * @param {Array<any>|object} value The array to use
   * @returns {void}
   */
  set data(value) {
    if (value) {
      // If provided an object, search for a `contents` property and store that
      if (typeof value === 'object' && Array.isArray(value.contents)) {
        this.datasource.data = value.contents;
        // Set the ID of this component if it's present in the object
        if (value?.id) {
          this.id = value.id;
        }
      } else if (Array.isArray(value)) {
        this.datasource.data = value;
      } else {
        // accept no other non-empty types
        return;
      }

      this.renderFromData();
      return;
    }

    this.datasource.data = null;
  }

  /**
   * @returns {Array<any>|object} containing the dataset
   */
  get data() {
    return this?.datasource?.data || [];
  }

  /**
   * @readonly
   * @returns {Array<any>} [`IdsMenuGroup`] all available menu groups
   */
  get groups() {
    // Standard Implementation is to simply look at children
    let target = this.children;

    // If the first child is a slot, look in the slot for assigned items instead
    if (this.children[0]?.tagName === 'SLOT') {
      target = this.children[0].assignedElements();
    }
    return [...target].filter((/** @type {any} */ e) => e.matches('ids-menu-group'));
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
   * @readonly
   * @returns {IdsMenuItem|undefined} the currently focused menu item, if one exists
   */
  get focused() {
    // @ts-ignore
    return this.items.find((item) => {
      // @ts-ignore
      const containerNode = IdsDOMUtils.getClosestContainerNode(this);
      // @ts-ignore
      return containerNode?.activeElement?.isEqualNode(item);
    });
  }

  /**
   * @readonly
   * @returns {IdsMenuItem} the next focusable item that is/was:
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
    return this.parentElement.closest('ids-menu, ids-popup-menu');
  }

  /**
   * @readonly
   * @returns {IdsMenuItem} parent menu item, if this menu is a submenu
   */
  get parentMenuItem() {
    return this.parentElement.closest('ids-menu-item');
  }

  /**
   * @readonly
   * @returns {Array<IdsMenu>} all available submenus on this menu's direct children
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
    // @ts-ignore
    if (!isUsableItem(menuItem, this)) {
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
   * Uses a currently-highlighted menu item to "navigate" a specified number
   * of steps to another menu item, highlighting it.
   * @param {number} [amt] the amount of items to navigate
   * @param {boolean} [doFocus] if true, causes the new item to become focused.
   * @returns {IdsMenuItem} the item that will be highlighted
   */
  navigate(amt = 0, doFocus = false) {
    const items = this.items;
    let currentItem = this.focused || this.lastNavigated || items[0];
    if (this.lastHovered) {
      currentItem = this.lastHovered;
      this.lastHovered = undefined;
    }

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

    this.lastNavigated = currentItem;
    if (!currentItem.disabled && doFocus) {
      currentItem.focus();
    }

    return currentItem;
  }

  /**
   * @returns {IdsMenuItem | undefined} the first available item, closest to the top of the menu.
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
   * @param {string|IdsMenuGroup} [menuGroup] a string representing an ID, or an IdsMenuGroup
   * directly, that optionally limits results to within a specified menu group.
   * @returns {Array<IdsMenuItem>} list of selected menu items
   */
  getSelectedItems(menuGroup) {
    // @ts-ignore
    const group = isValidGroup(menuGroup, this);
    return this.items.filter((item) => {
      if (group) {
        return item.selected && item.group.isEqualNode(group);
      }
      return item.selected;
    });
  }

  /**
   * @param {string|IdsMenuGroup} [menuGroup] a string representing an ID, or an IdsMenuGroup
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
    // @ts-ignore
    if (!isUsableItem(menuItem, this)) {
      return;
    }

    // If the menu item is a submenu container, by definition it cannot be selected.
    // In this case, just make an attempt to open the submenu.
    if (menuItem.hasSubmenu) {
      menuItem.showSubmenu();
      return;
    }

    const group = menuItem.group;
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
   * Clears any selected items in the menu, or specified group
   * @param {string|IdsMenuGroup} [menuGroup] a string representing an ID, or an IdsMenuGroup
   * directly, that optionally limits results to within a specified menu group.
   * @returns {void}
   */
  clearSelectedItems(menuGroup) {
    // @ts-ignore
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

export {
  IdsMenu as default,
  IdsMenuHeader,
  IdsMenuGroup,
  IdsMenuItem,
  IdsSeparator
};
