import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { getClosestContainerNode } from '../../utils/ids-dom-utils/ids-dom-utils';
import {
  isValidGroup,
  isUsableItem,
  IdsMenuContentsData,
  IdsMenuObjectData
} from './ids-menu-attributes';

import IdsDataSource from '../../core/ids-data-source';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';

import './ids-menu-group';
import './ids-menu-header';
import './ids-menu-item';
import '../ids-separator/ids-separator';

import styles from './ids-menu.scss';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import type { IdsMenuData } from './ids-menu-attributes';
import type IdsMenuItem from './ids-menu-item';
import type IdsMenuHeader from './ids-menu-header';

const Base = IdsKeyboardMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Menu Component
 * @type {IdsMenu|any}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @part menu - the menu element
 */
@customElement('ids-menu')
@scss(styles)
export default class IdsMenu extends Base {
  datasource = new IdsDataSource();

  keyboardEventTarget: HTMLElement | null = null;

  lastHovered?: any;

  lastNavigated?: any;

  constructor() {
    super();
    this.state = {};
    this.lastHovered = undefined;
    this.lastNavigated = undefined;
    this.hasIcons = false;
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.DISABLED,
    ];
  }

  /**
   * Safely retrieves child elements of the menu without regard
   * for whether or not they are direct descendants, or slotted
   * @returns {Array<HTMLElement>} child element list
   */
  protected get childElements(): Array<HTMLElement> {
    // Standard Implementation is to simply look at children
    let target = [...this.children];

    // If the first child is a slot, look in the slot for assigned items instead
    if (this.children[0]?.tagName === 'SLOT') {
      target = (this.children[0] as HTMLSlotElement).assignedElements();
    }
    return target as Array<HTMLElement>;
  }

  /**
   * Sets up event handlers used in this menu.
   * @private
   * @returns {void}
   */
  attachEventHandlers() {
    // Highlight the item on click
    // If the item doesn't contain a submenu, select it.
    // If the item does have a submenu, activate it.
    this.offEvent('click');
    this.onEvent('click', this, (e: any) => {
      const thisItem = e.target.closest('ids-menu-item');
      this.highlightItem(thisItem);
      this.selectItem(thisItem);
      this.lastNavigated = thisItem;
      e.stopPropagation();
    });

    // On 'mouseenter', after a specified duration, run some events,
    // including activation of submenus where applicable.
    this.offEvent('mouseover');
    this.onEvent('mouseover', this, (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IDS-MENU-ITEM') {
        e.stopPropagation();

        // Highlight
        const menuItem = target as unknown as IdsMenuItem;
        this.highlightItem(menuItem);

        // Tell the menu which item to use for converting a hover state to keyboard
        if (!menuItem.hasAttribute(attributes.DISABLED)) {
          this.lastHovered = menuItem;
        }
      }
    });

    // On 'mouseleave', clear any pending timeouts, hide submenus if applicable,
    // and unhighlight the item
    this.offEvent('mouseout');
    this.onEvent('mouseout', this, (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IDS-MENU-ITEM') {
        e.stopPropagation();

        // Unhighlight
        const menuItem = target as unknown as IdsMenuItem;
        if (!menuItem.hasSubmenu || menuItem.submenu?.hidden) {
          menuItem.unhighlight();
        }
      }
    });
  }

  /**
   * Sets up the connection to the global keyboard handler
   * @returns {void}
   */
  attachKeyboardListeners() {
    const target = this.keyboardEventTarget || this;

    // Arrow Up navigates focus backward
    this.unlisten('ArrowUp');
    this.listen(['ArrowUp'], target, (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigate(-1, true);
    });

    // Arrow Down navigates focus forward
    this.unlisten('ArrowDown');
    this.listen(['ArrowDown'], target, (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigate(1, true);
    });

    // Enter/Spacebar select the menu item
    this.unlisten('Enter');
    this.unlisten('Spacebar');
    this.unlisten(' ');
    this.listen(['Enter', 'Spacebar', ' '], target, (e: any) => {
      const thisItem = e.target.closest('ids-menu-item');
      this.selectItem(thisItem);
      this.lastNavigated = thisItem;
      e.preventDefault();
      e.stopPropagation();
    });
  }

  /**
   * Runs when the menu element is connected to the DOM.
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this.attachEventHandlers();
    this.attachKeyboardListeners();
    this.setAttribute(htmlAttributes.ROLE, 'none');

    // If a dataset has been loaded, render it
    if (this.data) {
      this.renderFromData();
    }

    this.refreshIconAlignment();

    // After repaint
    requestAnimationFrame(() => {
      this.makeTabbable(this.detectTabbable());
    });
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    let id;
    if (this.id) id = ` id="${this.id}"`;

    let disabledClass = '';
    if (this.disabled) disabledClass = ' disabled';

    let slot = '';
    if (this.tagName.toLowerCase() === 'ids-popup-menu') slot = ` slot="content"`;

    return `<nav class="ids-menu${disabledClass}"${id}${slot} part="menu" role="none"><slot></slot></nav>`;
  }

  /**
   * @param {any} contentsObj a plain object structure with Popupmenu Contents
   * @returns {string} list of HTML
   */
  menuContentTemplate(contentsObj: any) {
    // Renders a separator
    const renderSeparator = () => `<ids-separator></ids-separator>`;

    // Renders a header
    const renderHeader = (elem: any) => {
      if (typeof elem.text !== 'string') {
        return '';
      }
      return `<ids-menu-header>${elem.text}</ids-menu-header>`;
    };

    // Renders the contents of a submenu
    const renderContents = (submenuContents: any) => {
      let html = '';
      submenuContents.forEach((elem: any) => {
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
    const renderSubmenu = (submenuData: any) => {
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
    const renderItem = (item: any) => {
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
      let shortcutKeys = '';
      if (typeof item.shortcutKeys === 'string') {
        shortcutKeys = ` shortcut-keys="${item.shortcutKeys}"`;
      }
      let value = '';
      if (typeof item.value !== 'undefined' && item.value !== null && item.value !== '') {
        value = ` value="${item.value}"`;
      }
      let submenu = '';
      if (item.submenu) {
        submenu = renderSubmenu(item.submenu);
      }

      return `<ids-menu-item${id}${disabled}${icon}${selected}${shortcutKeys}${value}>
        ${text}
        ${submenu}
      </ids-menu-item>`;
    };

    // Renders the contents of a group
    const renderGroup = (groupData: any) => {
      if (!Array.isArray(groupData?.items) || !groupData.items.length) {
        return '';
      }

      let id = '';
      if (groupData.id) {
        id = ` id="${groupData.id}"`;
      }
      let itemsHTML = '';
      groupData.items?.forEach((newItem: any) => {
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
    if (this.data?.length === 0 || !this.shadowRoot) {
      return;
    }

    // Re-apply template (picks up top-level attributes from menu data)
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
   * Set the data array of the menu
   * @param {IdsMenuData} value The array to use
   * @returns {void}
   */
  set data(value: IdsMenuData) {
    // Accept the `contents` array directly if provided
    if (Array.isArray(value)) {
      this.datasource.data = (value as IdsMenuContentsData);
      this.renderFromData();
      return;
    }

    // If provided an object, search for a `contents` property and store its contents
    if (value && typeof value === 'object') {
      const objData = (value as IdsMenuObjectData);
      if (Array.isArray(objData.contents)) {
        this.datasource.data = objData.contents;
        if (objData.id) this.id = objData.id;
        this.renderFromData();
      }
      return;
    }

    this.datasource.data = [];
  }

  /**
   * @returns {IdsMenuData} containing the dataset
   */
  get data() {
    return this?.datasource?.data || [];
  }

  /**
   * @readonly
   * @returns {Array<any>} [`IdsMenuGroup`] all available menu groups
   */
  get groups() {
    return this.childElements?.filter((e) => e.matches('ids-menu-group'));
  }

  /**
   * @readonly
   * @returns {Array<any>} [`IdsMenuHeader`] all available menu groups
   */
  get headers() {
    return this.childElements?.filter((e) => e.matches('ids-menu-header'));
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} all available menu items
   */
  get items() {
    let i: any = [];
    this.groups.forEach((group) => {
      i = i.concat([...group.children].filter((e) => e.matches('ids-menu-item')));
    });
    return i;
  }

  /**
   * @readonly
   * @returns {HTMLElement|undefined} the currently focused menu item, if one exists
   */
  get focused() {
    return this.items.find((item: any) => {
      const containerNode = getClosestContainerNode((this as any));
      return ((containerNode as any)?.activeElement as any)?.isEqualNode(item);
    });
  }

  /**
   * @readonly
   * @returns {HTMLElement} the next focusable item that is/was:
   * - last hovered by the mouse (if applicable)
   * - currently/previously selected (if applicable)
   * - the first available menu item closest to the top of the menu that is not disabled or hidden.
   */
  get focusTarget() {
    if (this.lastHovered) return this.lastHovered;
    if (this.lastNavigated) return this.lastNavigated;

    const highlighted = this.items.filter((item: IdsMenuItem) => item.highlighted);
    if (highlighted.length) return highlighted[highlighted.length - 1];

    const selected = this.getSelectedItems();
    if (selected.length) return selected[0];

    return this.getFirstAvailableItem();
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} all menu items that are currently highlighted
   */
  get highlighted() {
    return this.items.filter((item: any) => item.highlighted);
  }

  /**
   * @readonly
   * @returns {IdsMenu} parent menu component, if this menu is a submenu
   */
  get parentMenu() {
    return this.parentElement?.closest<IdsMenu>('ids-menu');
  }

  /**
   * @readonly
   * @returns {HTMLElement} parent menu item, if this menu is a submenu
   */
  get parentMenuItem() {
    return this.parentElement?.closest<IdsMenuItem>('ids-menu-item');
  }

  /**
   * @readonly
   * @returns {Array<IdsMenu>} all available submenus on this menu's direct children
   */
  get submenus() {
    const submenus: any = [];
    this.items.forEach((item: any) => {
      const submenu = item.submenu;
      if (submenu) {
        submenus.push(submenu);
      }
    });
    return submenus;
  }

  /**
   * @param {boolean | string} val true if the component should be disabled
   */
  set disabled(val: boolean | string) {
    const safeVal = stringToBool(val);
    if (safeVal) {
      this.setAttribute(attributes.DISABLED, '');
      this.#disableItems();
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.#enableItems();
    }
  }

  /**
   * @returns {boolean} true if the component is disabled
   */
  get disabled() {
    return this.hasAttribute(attributes.DISABLED);
  }

  #disableItems(): void {
    this.container?.classList.add('disabled');
    this.items.forEach((item: any) => {
      item.disabled = true;
    });
  }

  #enableItems(): void {
    this.container?.classList.remove('disabled');
    this.items.forEach((item: any) => {
      item.disabled = false;
    });
  }

  /**
   * Unhighlights all menu items, then highlights a specified item.
   * @param {HTMLElement} menuItem reference to the menu item that will be highlighted
   * @returns {void}
   */
  highlightItem(menuItem: any) {
    if (!isUsableItem(menuItem, this)) {
      return;
    }

    this.items.forEach((item: any) => {
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
   * @returns {HTMLElement} the item that will be highlighted
   */
  navigate(amt = 0, doFocus = false) {
    const items = this.items;
    let currentItem = this.focusTarget;

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
      if (!currentItem.disabled && !currentItem.hidden) {
        this.makeTabbable(currentItem);
        steps -= 1;
      }
    }

    this.lastNavigated = currentItem;
    if (this.lastHovered) this.lastHovered = null;

    // Focus/Highlight
    if (!currentItem.disabled && !currentItem.hidden && doFocus) {
      currentItem.focus();
      this.highlightItem(currentItem);
    }

    return currentItem;
  }

  /**
   * Gets the current item that should be used as the "tabbable" item
   * (item that receives focus when the menu is "focused").
   * @returns {HTMLElement | undefined} an element that currently has a usable tabIndex attribute
   */
  detectTabbable() {
    let tabbableItem;
    for (let i = 0; !tabbableItem && i < this.items.length; i++) {
      if (this.items[i].tabIndex > -1) {
        tabbableItem = this.items[i];
      }
    }
    return tabbableItem;
  }

  /**
   * @private
   * @param {HTMLElement} elem an element residing within the menu that can accept
   */
  makeTabbable(elem = this.items[0]) {
    this.items.forEach((item: any) => {
      const nonTabbableTargetIndex = elem.isEqualNode(item) ? 0 : -1;
      item.tabIndex = nonTabbableTargetIndex;
    });
  }

  /**
   * @returns {HTMLElement | undefined} the first available item, closest to the top of the menu.
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
   * @returns {Array<HTMLElement>} list of selected menu items
   */
  getSelectedItems(menuGroup?: any) {
    const group = isValidGroup(menuGroup, this);
    return this.items.filter((item: any) => {
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
  getSelectedValues(menuGroup: any) {
    return this.getSelectedItems(menuGroup).map((item: any) => (item.value));
  }

  /**
   * Selects menu items containing the value(s) provided
   * @param {Array<any>|string} values array|string of menu item value(s)
   * @param {string|HTMLElement} [menuGroup] a string representing an ID, or an IdsMenuGroup
   * @returns {void}
   */
  setSelectedValues(values: any, menuGroup: any) {
    if (!values?.length) return;

    // if group specified and not found, do nothing
    const group: any = isValidGroup(menuGroup, this);
    if (!group && menuGroup !== undefined) return;

    const items = group ? group.items : this.items;
    const valueArr = Array.isArray(values) ? values : [values];

    items.forEach((item: any) => {
      if (valueArr.indexOf(item.value) === -1) {
        item.deselect();
        return;
      }

      if (!item.selected) {
        this.selectItem(item);
      }
    });
  }

  /**
   * Selects a menu item contained by this menu.
   * @param {HTMLElement} menuItem the item to be selected
   * @returns {void}
   */
  selectItem(menuItem: any) {
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
    if (group.select === 'multiple' || menuItem.toggleable) {
      // Multiple-select mode (Toggles selection, ignores others)
      menuItem[menuItem.selected ? 'deselect' : 'select']();
    } else {
      // "none" and "single" select mode.
      // In "single" mode, deselection of other items is handled by event
      // at the menu group level.
      menuItem.select();
    }
  }

  /**
   * Clears any selected items in the menu, or specified group
   * @param {string|HTMLElement} [menuGroup] a string representing an ID, or an IdsMenuGroup
   * directly, that optionally limits results to within a specified menu group.
   * @returns {void}
   */
  clearSelectedItems(menuGroup: any) {
    const group = isValidGroup(menuGroup, this);
    this.items.forEach((item: any) => {
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

  /**
   * @param {boolean} hasIcons true if the menu contains items displaying icons
   */
  protected hasIcons: boolean;

  /**
   * Determines if this menu (not including its submenus) contains icons inside its visible menu items
   * @returns {boolean} true if the menu items contain icons
   */
  detectIcons() {
    this.hasIcons = false;
    for (let i = 0, item: IdsMenuItem; i < this.items.length; i++) {
      if (this.hasIcons) break;
      item = this.items[i];
      if (!item.hidden && item.icon && item.icon.length) this.hasIcons = true;
    }
    return this.hasIcons;
  }

  /**
   * Refreshes the state of alignment of icons inside this menu
   * @returns {void}
   */
  refreshIconAlignment(): void {
    this.detectIcons();
    [...this.items, ...this.headers].forEach((item: IdsMenuItem | IdsMenuHeader) => {
      if (typeof item.decorateForIcon === 'function') item.decorateForIcon(this.hasIcons);
    });
  }

  /**
   * Focuses the correct element
   */
  focus() {
    this.focusTarget?.focus();
  }
}
