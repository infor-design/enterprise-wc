import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import { removeNewLines, stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import './ids-toolbar-section';
import '../ids-menu-button/ids-menu-button';
import '../ids-popup-menu/ids-popup-menu';

import styles from './ids-toolbar-more-actions.scss';
import type IdsMenuGroup from '../ids-menu/ids-menu-group';
import type IdsMenuButton from '../ids-menu-button/ids-menu-button';
import type IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';

const MORE_ACTIONS_SELECTOR = `[${attributes.MORE_ACTIONS}]`;

const TOOLBAR_TYPES = ['formatter'];

const Base = IdsColorVariantMixin(
  IdsLocaleMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Toolbar Section Component
 */
@customElement('ids-toolbar-more-actions')
@scss(styles)
export default class IdsToolbarMoreActions extends Base {
  constructor() {
    super();
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.OVERFLOW,
      attributes.TOOLBAR_TYPE,
      attributes.VISIBLE,
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.menu || !this.button) {
      this.#renderActionsComponents();
    }
    this.#refresh();
    this.#attachEventHandlers();
    this.button?.configureMenu?.();

    // wait for parent toolbar to finish rendering
    requestAnimationFrame(() => {
      this.#connectOverflowedItems();
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();

    // Cleanup overflow markings on Toolbar items
    // (possibly still present)
    this.overflowMenuItems.forEach((item) => {
      item.removeAttribute(attributes.OVERFLOWED);
    });
  }

  template() {
    return `<div class="ids-toolbar-section ids-toolbar-more-actions more">
      <slot></slot>
    </div>`;
  }

  colorVariants = ['alternate-formatter'];

  #renderActionsComponents() {
    const menuButtonId = 'more-actions';
    const menuId = 'more-actions-menu';
    const disabled = this.disabled ? ' disabled' : '';
    const icon = this.getAttribute('icon') || 'more';

    this.insertAdjacentHTML('afterbegin', `<ids-menu-button tooltip="${this.localeAPI.translate('More')}" id="${menuButtonId}" menu="${menuId}"${disabled}>
        <ids-icon icon="${icon}"></ids-icon>
        <span class="audible">More Actions Button</span>
      </ids-menu-button>
      <ids-popup-menu id="${menuId}" target="#${menuButtonId}" trigger-type="click"></ids-popup-menu>`);

    // Previously, it was possible to define IdsMenuGroups as child elements
    // of the IdsToolbarMoreActions component. For compatability, these groups
    // are moved into the new menu:
    const groups = this.querySelectorAll<IdsMenuGroup>(':scope > ids-menu-group');
    groups?.forEach((groupEl) => this.menu?.append(groupEl));
  }

  /**
   * @private
   * @returns {string} the template for the More Actions Menu Group
   */
  #moreActionsMenuTemplate(): string {
    // Cycle through toolbar items, if present, and render a menu item that represents them
    const renderToolbarItems = () => this.toolbar?.items?.map((i: HTMLElement) => this.#moreActionsItemTemplate(i)).join('') || '';
    return `<ids-menu-group ${attributes.MORE_ACTIONS}>
      ${renderToolbarItems()}
    </ids-menu-group>`;
  }

  /**
   * @private
   * @param {HTMLElement} item an element from inside one of the Toolbar sections
   *  that will be mirrored in the More Actions menu
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
    let viewbox = '';

    if (!isSubmenuItem) {
      overflowed = this.isOverflowed(item) ? '' : ' hidden';
    }

    // NOTE: the `hidden` property is not identified on buttons by design,
    // since the "hidden" attribute is appended to the Toolbar Items
    // to control their visibility when overflowed.
    const handleButton = (thisItem: any) => {
      if (thisItem.disabled) disabled = ' disabled';
      if (thisItem.icon) {
        icon = ` icon="${thisItem.icon}"`;
        viewbox = thisItem.iconEl?.viewbox;
        viewbox = viewbox ? ` viewbox="${viewbox}"` : '';
      }
      text = thisItem.text;
    };

    // Top-level Menus/Submenus are handled by this same method
    const handleSubmenu = (thisItem: any) => {
      const menuProp = isSubmenuItem ? 'submenu' : 'menuEl';

      if (thisItem[menuProp]) {
        const thisSubItems = thisItem[menuProp].items;
        submenu = `<ids-popup-menu slot="submenu">
          <ids-menu-group>
            ${thisSubItems.map((subItem: any) => this.#moreActionsItemTemplate(subItem, true)).join('') || ''}
          </ids-menu-group>
        </ids-popup-menu>`;
      }
    };

    // These represent menu items in top-level menu buttons, which can be hidden.
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
      case 'IDS-MENU-BUTTON':
        handleButton(item);
        handleSubmenu(item);
        break;
      case 'IDS-MENU-ITEM':
        handleMenuItem(item);
        break;
      case 'IDS-BUTTON':
        handleButton(item);
        break;
      default:
        text = item.textContent;
        break;
    }

    // Sanitize text from Toolbar elements to fit menu items
    text = removeNewLines(text)?.trim();

    return `<ids-menu-item${disabled}${icon}${viewbox}${hidden || overflowed}>
      ${text}
      ${submenu}
    </ids-menu-item>`;
  }

  /**
   * @readonly
   * @returns {HTMLElement} the inner menu button
   */
  get button(): IdsMenuButton | undefined | null {
    return this.querySelector<IdsMenuButton>('ids-menu-button');
  }

  /**
   * @readonly
   * @returns {HTMLElement} the inner popup menu
   */
  get menu(): IdsPopupMenu | null {
    return this.querySelector<IdsPopupMenu>('ids-popup-menu') || null;
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of manually-defined menu items
   */
  get predefinedMenuItems(): Array<any> {
    return [...this.querySelectorAll(`:scope > ids-popup-menu > ids-menu-group:not(${MORE_ACTIONS_SELECTOR}) > ids-menu-item`)];
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of menu items that mirror Toolbar items
   */
  get overflowMenuItems(): Array<any> {
    const moreActionsMenu = this.querySelector(MORE_ACTIONS_SELECTOR);
    if (moreActionsMenu) {
      return [...this.querySelector(MORE_ACTIONS_SELECTOR)?.children ?? []];
    }
    return [];
  }

  /**
   * @readonly
   * @returns {HTMLElement} a reference to this section's toolbar parent node
   */
  get toolbar(): any {
    return this.parentElement;
  }

  /**
   * @param {boolean | string} val true if the More Actions menu should be disabled
   */
  set disabled(val: boolean | string) {
    const trueVal = stringToBool(val);

    if (trueVal) {
      this.setAttribute(attributes.DISABLED, val.toString());
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.button?.setAttribute(attributes.DISABLED, trueVal.toString());
    this.container?.classList[trueVal ? 'add' : 'remove'](attributes.DISABLED);
  }

  /**
   * @returns {boolean} true if the More Actions menu is currently disabled
   */
  get disabled(): boolean {
    return !!this.container?.classList.contains(attributes.DISABLED);
  }

  /**
   * @param {boolean | string} val truthy if this More Actions menu should display overflowed items from the toolbar
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
   * @returns {boolean} true if this More Actions menu will display overflowed items from the toolbar
   */
  get overflow(): boolean {
    return this.hasAttribute(attributes.OVERFLOW);
  }

  /**
   * @param {string} value the type of toolbar
   */
  set toolbarType(value: string | null) {
    if (value && TOOLBAR_TYPES.includes(value)) {
      this.setAttribute(attributes.TOOLBAR_TYPE, value);
      this.container?.classList.add(value);
    } else {
      this.removeAttribute(attributes.TOOLBAR_TYPE);
      this.container?.classList.remove(TOOLBAR_TYPES[0]);
    }
  }

  /**
   * @returns {string} the type of toolbar
   */
  get toolbarType(): string | null {
    return this.getAttribute(attributes.TOOLBAR_TYPE);
  }

  /**
   * Overrides the standard toolbar section "type" setter, which is always "more" in this case.
   * @param {string} val the type value
   */
  set type(val: string) {
    this.removeAttribute(attributes.TYPE);
  }

  /**
   * Overrides the standard toolbar section "type" getter, which always returns "more" in this case.
   * @returns {string} representing the Toolbar Section type
   */
  get type(): string {
    return 'more';
  }

  /**
   * @param {boolean | string} val alters whether the More Actions menu is displayed/hidden
   */
  set visible(val: boolean | string) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.VISIBLE, '');
      this.menu?.showIfAble();
    } else {
      this.removeAttribute(attributes.VISIBLE);
      this.menu?.hide();
    }
  }

  /**
   * @returns {boolean} true if the More Actions menu is currently displayed
   */
  get visible(): boolean {
    return this.menu?.visible || false;
  }

  /**
   * @returns {void}
   */
  #attachEventHandlers(): void {
    this.onEvent('beforeshow', this.menu, (e: any) => {
      // Reflect this event to the host element
      this.triggerEvent('beforeshow', this, {
        bubbles: e.bubbles,
        detail: e.detail
      });

      this.refreshOverflowedItems();
    });

    // Forward `selected` events from the More Actions Menu to their
    // Toolbar Item counterparts.  This is needed for firing Toolbar Actions that
    // are only visible inside the overflow menu.
    this.onEvent('selected', this.menu, (e: any) => {
      const menuItem = e.detail.elem;
      if (menuItem.overflowTarget) {
        e.preventDefault();
        e.stopPropagation();
        this.toolbar.triggerSelectedEvent(menuItem, true);
      }
    });

    // Listen to show/hide events from the inner IdsPopupMenu and reflect the `visible` attribute
    this.onEvent('show', this.menu, () => {
      this.visible = true;
    });
    this.onEvent('hide', this.menu, () => {
      this.visible = false;
    });
  }

  /**
   * Refreshes the state of the More Actions button
   * @returns {void}
   */
  #refresh(): void {
    if (this.menu?.popup) {
      this.menu.popup.align = 'bottom, right';
      this.menu.popup.alignEdge = 'bottom';
    }
    this.onColorVariantRefresh();
  }

  /**
   * Refreshes the visible state of menu items representing "overflowed" elements
   * @returns {void}
   */
  refreshOverflowedItems(): void {
    this.overflowMenuItems.forEach((item) => {
      const doHide = !this.isOverflowed(item.overflowTarget);
      item.hidden = doHide;
      if (doHide) {
        item.overflowTarget.removeAttribute(attributes.OVERFLOWED);
      } else {
        item.overflowTarget.setAttribute(attributes.OVERFLOWED, '');
      }
    });

    if (this.button) {
      this.button.hidden = !this.hasVisibleActions();
      this.button.disabled = !this.hasEnabledActions();
    }

    if (this.menu?.visible) {
      this.menu.refreshIconAlignment();
    }
  }

  /**
   * Connects each overflowed menu item to a real Toolbar element
   * @private
   * @returns {void}
   */
  #connectOverflowedItems(): void {
    if (!this.menu) return;

    // Render the "More Actions" area if it doesn't exist
    const el = this.menu.querySelector(MORE_ACTIONS_SELECTOR);
    if (!el && this.overflow) {
      this.menu!.insertAdjacentHTML('afterbegin', this.#moreActionsMenuTemplate());
    }
    if (el && !this.overflow) {
      el.remove();
    }

    // Connects Overflow Menu subitems with corresponding menu items in the Toolbar
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

    // Connect all "More Action" items generated from Toolbar Elements to their
    // real counterparts in the Toolbar
    this.overflowMenuItems.forEach((item: any, i: number) => {
      item.overflowTarget = this.toolbar.items[i];
      if (item.submenu) {
        handleSubmenu(item, item.overflowTarget.menuEl);
      }
    });
  }

  /**
   * Passes focus from the main element into the inner Ids Menu Button
   * @returns {void}
   */
  focus(): void {
    if (!this.visible) {
      this.button?.focus();
    } else {
      this.menu?.focusTarget?.focus();
    }
  }

  /**
   * @returns {boolean} true if there are currently visible actions in this menu
   */
  hasVisibleActions(): boolean {
    return this.predefinedMenuItems.length > 0
      || this.querySelectorAll(`:scope > ids-popup-menu > ids-menu-group${MORE_ACTIONS_SELECTOR} > ids-menu-item:not([hidden])`).length > 0;
  }

  /**
   * @returns {boolean} true if there are currently enabled (read: not disabled) actions in this menu
   */
  hasEnabledActions(): boolean {
    return this.querySelectorAll(`:scope > ids-popup-menu > ids-menu-group${MORE_ACTIONS_SELECTOR} > ids-menu-item:not([disabled])`).length > 0;
  }

  /**
   * @param {HTMLElement} item reference to the toolbar item to be checked for overflow
   * @returns {boolean} true if the item is a toolbar member and should be displayed by overflow
   */
  isOverflowed(item: any): boolean {
    if (!this.toolbar.contains(item)) {
      return false;
    }
    if (item.hidden) {
      return false;
    }

    const itemRect = item.getBoundingClientRect();
    const section = item.parentElement;
    const sectionRect = section.getBoundingClientRect();

    const isBeyondRightEdge = itemRect.right > sectionRect.right;
    const isBeyondLeftEdge = itemRect.left < sectionRect.left;

    return isBeyondLeftEdge || isBeyondRightEdge;
  }

  onColorVariantRefresh(): void {
    const colorVariant = this.colorVariant;
    if (colorVariant === 'alternate-formatter') {
      this.button?.setAttribute(attributes.COLOR_VARIANT, 'alternate-formatter');
    } else {
      this.button?.removeAttribute(attributes.COLOR_VARIANT);
    }
  }
}
