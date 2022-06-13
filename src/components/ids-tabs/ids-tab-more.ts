import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, buildClassAttrib, removeNewLines } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-tab-more-base';
import '../ids-popup-menu/ids-popup-menu';
import '../ids-text/ids-text';

const MORE_ACTIONS_SELECTOR = `[${attributes.MORE_ACTIONS}]`;

/**
 * IDS Tab Component
 * @type {IdsTabMore}
 * @inherits IdsElement
 * @part container - the tab container itself
 * @mixes IdsEventsMixin
 * @private
 */
@customElement('ids-tab-more')
export default class IdsTabMore extends Base {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.OVERFLOW
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.#attachMoreMenuEvents();

    // Connect the menu items to their Toolbar items after everything is rendered
    requestAnimationFrame(() => {
      this.#configureMenu();
      this.renderOverflowedItems();
    });
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template(): string {
    const count = 4;
    const cssClassAttr = buildClassAttrib(
      'ids-tab',
      'more',
      this.selected,
      this.orientation
    );
    const selectedAttr = this.selected ? ' font-weight="bold"' : '';

    return `<div id="tab-more" ${cssClassAttr} tabindex="-1" part="container">
      <span class="tab-more-text">
        <ids-text id="count">${count}</ids-text>
        <ids-text id="more-text" size="22"${selectedAttr} translate-text="true">More</ids-text>
        <ids-icon icon="dropdown"></ids-icon>
      </span>
      <ids-popup-menu id="tab-more-menu" target="#tab-more">
        <slot></slot>
      </ids-popup-menu>
    </div>`;
  }

  /**
   * @readonly
   * @returns {HTMLElement} the inner popup menu
   */
  get menu(): any {
    return this.shadowRoot.querySelector('ids-popup-menu');
  }

  get moreActionsGroup(): any {
    return this.querySelector(MORE_ACTIONS_SELECTOR);
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of manually-defined menu items
   */
  get predefinedMenuItems(): Array<any> {
    return [...this.querySelectorAll(`:scope > ids-menu-group:not(${MORE_ACTIONS_SELECTOR}) > ids-menu-item`)];
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of menu items that mirror Tabs
   */
  get overflowMenuItems(): Array<any> {
    const moreActionsGroup = this.moreActionsGroup;
    if (moreActionsGroup) {
      return [...moreActionsGroup.children];
    }
    return [];
  }

  /**
   * @readonly
   * @returns {Array<any>} array of IdsTab elements that can be placed in Overflow
   */
  get availableOverflowTabs() {
    return this.parentElement.tabListElements;
  }

  /**
   * @private
   * @returns {string} the template for the More Actions Menu Group
   */
  #moreActionsMenuTemplate(): string {
    const childTabs: Array<any> = this.availableOverflowTabs;
    const renderedTabItems = childTabs?.map((i: HTMLElement) => this.#moreActionsItemTemplate(i)).join('') || '';

    // Cycle through tabs, if present, and render a menu item that represents them
    return `<ids-menu-group ${attributes.MORE_ACTIONS}>
      ${renderedTabItems}
    </ids-menu-group>`;
  }

  /**
   * @private
   * @param {HTMLElement} item an element from inside the Tab List that will be mirrored in the More Actions menu
   * @param {boolean} isSubmenuItem true if the item provided is a submenu item
   * @returns {string} representing a single menu item
   */
  #moreActionsItemTemplate(item: HTMLElement, isSubmenuItem = false): string {
    let text: any = '';
    let icon = '';
    let hidden = '';
    let disabled = '';
    let submenu = '';
    let overflowed = '';
    let value = '';

    if (!isSubmenuItem) {
      overflowed = this.isOverflowed(item) ? '' : ' hidden';
    }

    // Handles regular tabs
    const handleTab = (thisItem: any) => {
      text = thisItem.textContent;
      if (thisItem.disabled) disabled = ' disabled';
      if (thisItem.value) value = ` value="${thisItem.value}"`;

      const tabIcon = thisItem.querySelector('ids-icon');
      if (tabIcon) {
        icon = ` icon="${tabIcon.icon}"`;
      }
    };

    // Top-level Menus/Submenus are handled by this same method
    const handleSubmenu = (thisItem: any) => {
      const menuProp = isSubmenuItem ? 'submenu' : 'menuEl';

      if (thisItem[menuProp]) {
        const thisSubItems = thisItem[menuProp].items;
        submenu = `<ids-popup-menu slot="submenu">
          ${thisSubItems.map((subItem: any) => this.#moreActionsItemTemplate(subItem, true)).join('') || ''}
        </ids-popup-menu>`;
      }
    };

    // These represent menu items in Dropdown Tabs, which can be hidden.
    const handleMenuItem = (thisItem: any) => {
      if (thisItem.disabled) disabled = ' disabled';
      if (thisItem.icon) icon = ` icon="${thisItem.icon}"`;
      if (thisItem.hidden) hidden = ` hidden`;
      text = thisItem.text;

      if (thisItem.submenu) {
        handleSubmenu(thisItem);
      }
    };

    switch (item.tagName) {
      case 'IDS-TAB-DROPDOWN':
        handleTab(item);
        handleSubmenu(item);
        break;
      case 'IDS-MENU-ITEM':
        handleMenuItem(item);
        break;
      case 'IDS-TAB':
        handleTab(item);
        break;
      default:
        text = item.textContent;
        break;
    }

    // Sanitize text from Tabs to fit menu items
    text = removeNewLines(text)?.trim();

    return `<ids-menu-item${disabled}${icon}${hidden || overflowed}${value}>
      ${text}
      ${submenu}
    </ids-menu-item>`;
  }

  /**
   * Refreshes the visible state of menu items representing "overflowed" elements,
   * and hides/shows this component from view
   * @returns {void}
   */
  refreshOverflowedItems(): void {
    let overflowed = 0;

    this.hidden = false;
    this.overflowMenuItems.forEach((item) => {
      const doHide = !this.isOverflowed(item.overflowTarget);
      item.hidden = doHide;
      if (doHide) {
        item.overflowTarget.removeAttribute(attributes.OVERFLOWED);
      } else {
        item.overflowTarget.setAttribute(attributes.OVERFLOWED, '');
        overflowed++;
      }
    });

    this.container.querySelector('#count').innerHTML = `${overflowed}`;

    this.hidden = !this.hasVisibleActions();
    if (!this.hasVisibleActions) {
      this.menu.hide();
    }

    this.disabled = !this.hasEnabledActions();
  }

  /**
   * Re-renders the overflowed items
   * @private
   */
  renderOverflowedItems(): void {
    // Render the "More Actions" area if it doesn't exist
    const el = this.querySelector(MORE_ACTIONS_SELECTOR);
    if (el && !this.overflow) {
      el.remove();
      return;
    }

    this.innerHTML = '';
    this.insertAdjacentHTML('afterbegin', this.#moreActionsMenuTemplate());

    // Connects Overflow Menu subitems with corresponding menu items in the Tab List
    // (generally by way of IdsMenuButtons or other menu-driven components)
    const handleSubmenu = (thisItem: any, overflowTargetMenu: any) => {
      if (!overflowTargetMenu) return;
      [...thisItem.submenu.children].forEach((item: any, i: number) => {
        item.overflowTarget = overflowTargetMenu.items[i];
        if (item.submenu) {
          handleSubmenu(item, item.overflowTarget.submenu);
        }
      });
    };

    // Connect all "More Action" items generated from Tabs to their
    // real counterparts in the Tab List
    const moreActionsGroup = this.moreActionsGroup;
    const parentTabs = this.availableOverflowTabs;
    const overflowMenuItems = this.overflowMenuItems;
    parentTabs.forEach((tab: any, i: number) => {
      // Draws new "missing" menu items that may have
      // been added by a slotchange or other event
      let menuItem = overflowMenuItems[i];
      if (!menuItem) {
        moreActionsGroup.insertAdjacentHTML('beforeend', this.#moreActionsItemTemplate(tab));
        menuItem = moreActionsGroup[moreActionsGroup.length - 1];
      }

      menuItem.overflowTarget = tab;
      if (menuItem.submenu) {
        handleSubmenu(menuItem, menuItem.overflowTarget.menuEl);
      }
    });
  }

  /**
   * @param {boolean | string} val truthy if this More Actions menu should display overflowed Tabs from the Tab List
   */
  set overflow(val: boolean | string) {
    const newValue = stringToBool(val);
    const currentValue = this.overflow;
    if (newValue !== currentValue) {
      if (newValue) {
        this.setAttribute(attributes.OVERFLOW, '');
      } else {
        this.removeAttribute(attributes.OVERFLOW);
      }
    }
  }

  /**
   * @returns {boolean} true if this More Actions menu will display overflowed Tabs from the Tab List
   */
  get overflow(): boolean {
    return this.hasAttribute(attributes.OVERFLOW);
  }

  /**
   * @returns {boolean} true if there are currently visible actions in this menu
   */
  hasVisibleActions(): boolean {
    return this.querySelectorAll(':scope > ids-menu-group > ids-menu-item:not([hidden])').length > 0;
  }

  /**
   * @returns {boolean} true if there are currently enabled (read: not disabled) actions in this menu
   */
  hasEnabledActions(): boolean {
    return this.querySelectorAll(':scope > ids-menu-group > ids-menu-item:not([disabled])').length > 0;
  }

  /**
   * @param {HTMLElement} tab reference to the Tab to be checked for overflow
   * @returns {boolean} true if the Tab belongs to this Tab List and should be displayed by overflow
   */
  isOverflowed(tab: any): boolean {
    if (!this.parentElement.contains(tab)) {
      return false;
    }
    if (tab.isEqualNode(this)) {
      return false;
    }
    if (tab.hidden) {
      return false;
    }

    const tabRect = tab.getBoundingClientRect();
    const moreTabRect = this.parentElement.moreContainer.getBoundingClientRect();

    if (this.locale?.isRTL()) {
      // Beyond left edge
      return tabRect.left < moreTabRect.right;
    }
    // Beyond right edge
    return tabRect.right > moreTabRect.left;
  }

  #configureMenu() {
    this.menu.width = '100%';
    this.menu.popup.align = 'bottom, left';
    this.menu.popup.y = -10;
  }

  #attachMoreMenuEvents(): void {
    this.onEvent('beforeshow', this.menu, (e: any) => {
      // Reflect this event to the host element
      this.triggerEvent('beforeshow', this, {
        bubbles: e.bubbles,
        detail: e.detail
      });

      this.refreshOverflowedItems();
    });

    this.onEvent('click', this, () => {
      if (!this.menu.visible) {
        this.menu.show();
      } else {
        this.menu.hide();
      }
    });

    this.onEvent('selected', this.menu, (e: CustomEvent) => {
      const elem = e.detail.elem;
      if (elem.overflowTarget) {
        elem.overflowTarget.click();
      }
    });
  }
}
