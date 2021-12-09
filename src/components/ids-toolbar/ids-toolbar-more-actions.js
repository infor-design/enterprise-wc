import {
  IdsElement,
  scss,
  customElement,
  mix
} from '../../core';
import { attributes } from '../../core/ids-attributes';
import { IdsEventsMixin } from '../../mixins/ids-events-mixin';

import styles from './ids-toolbar-more-actions.scss';

// Subcomponents
import IdsMenuButton from '../ids-menu-button/ids-menu-button';
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import { IdsStringUtils } from '../../utils/ids-string-utils';

const MORE_ACTIONS_SELECTOR = `[${attributes.MORE_ACTIONS}]`;

/**
 * IDS Toolbar Section Component
 */
@customElement('ids-toolbar-more-actions')
@scss(styles)
class IdsToolbarMoreActions extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.OVERFLOW,
      attributes.VISIBLE,
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();

    requestAnimationFrame(() => {
      this.render();
      this.#refresh();
      this.#attachEventHandlers();

      // Connect the menu items to their Toolbar items after everything is rendered
      requestAnimationFrame(() => {
        this.#connectOverflowedItems();
      });
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();

    // Cleanup overflow markings on Toolbar items
    // (possibly still present)
    this.overflowMenuItems.forEach((item) => {
      item.removeAttribute(attributes.OVERFLOWED);
    });
  }

  template() {
    const menuButtonId = 'more-actions';
    const menuId = 'more-actions-menu';
    const disabled = this.disabled ? ' disabled' : '';

    return `<div class="ids-toolbar-section ids-toolbar-more-actions more">
      <ids-menu-button id="${menuButtonId}" menu="${menuId}"${disabled}>
        <ids-icon slot="icon" icon="more"></ids-icon>
        <span class="audible">More Actions Button</span>
      </ids-menu-button>
      <ids-popup-menu id="${menuId}" target="#${menuButtonId}" trigger="click">
        <slot></slot>
      </ids-popup-menu>
    </div>`;
  }

  /**
   * @private
   * @returns {string} the template for the More Actions Menu Group
   */
  #moreActionsMenuTemplate() {
    // Cycle through toolbar items, if present, and render a menu item that represents them
    const renderToolbarItems = () => this.toolbar?.items?.map((i) => this.#moreActionsItemTemplate(i)).join('') || '';
    return `<ids-menu-group ${attributes.MORE_ACTIONS}>
      ${renderToolbarItems() }
    </ids-menu-group>`;
  }

  /**
   * @private
   * @param {HTMLElement} item an element from inside one of the Toolbar sections
   *  that will be mirrored in the More Actions menu
   * @param {boolean} isSubmenuItem true if the item provided is a submenu item
   * @returns {string} representing a single menu item
   */
  #moreActionsItemTemplate(item, isSubmenuItem = false) {
    let text = '';
    let icon = '';
    let hidden = '';
    let disabled = '';
    let submenu = '';
    let overflowed = '';

    if (!isSubmenuItem) {
      overflowed = this.isOverflowed(item) ? '' : ' hidden';
    }

    // NOTE: the `hidden` property is not identified on buttons by design,
    // since the "hidden" attribute is appended to the Toolbar Items
    // to control their visibility when overflowed.
    const handleButton = (thisItem) => {
      if (thisItem.disabled) disabled = ' disabled';
      if (thisItem.icon) icon = ` icon="${thisItem.icon}"`;
      text = thisItem.text;
    };

    // Top-level Menus/Submenus are handled by this same method
    const handleSubmenu = (thisItem) => {
      const menuProp = isSubmenuItem ? 'submenu' : 'menuEl';

      if (thisItem[menuProp]) {
        const thisSubItems = thisItem[menuProp].items;
        submenu = `<ids-popup-menu slot="submenu">
          ${thisSubItems.map((subItem) => this.#moreActionsItemTemplate(subItem, true)).join('') || ''}
        </ids-popup-menu>`;
      }
    };

    // These represent menu items in top-level menu buttons, which can be hidden.
    const handleMenuItem = (thisItem) => {
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
      handleMenuItem(item, isSubmenuItem);
      break;
    case 'IDS-BUTTON':
      handleButton(item);
      break;
    default:
      text = item.textContent;
      break;
    }

    // Sanitize text from Toolbar elements to fit menu items
    text = IdsStringUtils.removeNewLines(text).trim();

    return `<ids-menu-item${disabled}${icon}${hidden || overflowed}>
      ${text}
      ${submenu}
    </ids-menu-item>`;
  }

  /**
   * @readonly
   * @returns {IdsMenuButton} the inner menu button
   */
  get button() {
    return this.shadowRoot.querySelector('ids-menu-button');
  }

  /**
   * @readonly
   * @returns {IdsPopupMenu} the inner popup menu
   */
  get menu() {
    return this.shadowRoot.querySelector('ids-popup-menu');
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of manually-defined menu items
   */
  get predefinedMenuItems() {
    return [...this.querySelectorAll(`:scope > ids-menu-group:not(${MORE_ACTIONS_SELECTOR}) > ids-menu-item`)];
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of menu items that mirror Toolbar items
   */
  get overflowMenuItems() {
    const moreActionsMenu = this.querySelector(MORE_ACTIONS_SELECTOR);
    if (moreActionsMenu) {
      return [...this.querySelector(MORE_ACTIONS_SELECTOR).children];
    }
    return [];
  }

  /**
   * @readonly
   * @returns {HTMLElement} a reference to this section's toolbar parent node
   */
  get toolbar() {
    return this.parentElement;
  }

  /**
   * @param {boolean} val true if the More Actions menu should be disabled
   */
  set disabled(val) {
    const trueVal = IdsStringUtils.stringToBool(val);

    if (trueVal) {
      this.setAttribute(attributes.DISABLED, val);
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.button.disabled = trueVal;
    this.container.classList[trueVal ? 'add' : 'remove'](attributes.DISABLED);
  }

  /**
   * @returns {boolean} true if the More Actions menu is currently disabled
   */
  get disabled() {
    return this.container?.classList.contains(attributes.DISABLED);
  }

  /**
   * @param {boolean|string} val truthy if this More Actions menu should display overflowed items from the toolbar
   */
  set overflow(val) {
    const newValue = IdsStringUtils.stringToBool(val);
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
  get overflow() {
    return this.hasAttribute(attributes.OVERFLOW);
  }

  /**
   * Overrides the standard toolbar section "type" setter, which is always "more" in this case.
   * @param {string} val the type value
   */
  set type(val) {
    this.removeAttribute(attributes.TYPE);
  }

  /**
   * Overrides the standard toolbar section "type" getter, which always returns "more" in this case.
   * @returns {string} representing the Toolbar Section type
   */
  get type() {
    return 'more';
  }

  /**
   * @param {boolean} val alters whether the More Actions menu is displayed/hidden
   */
  set visible(val) {
    if (IdsStringUtils.stringToBool(val)) {
      this.setAttribute(attributes.VISIBLE, '');
      this.menu.showIfAble();
    } else {
      this.removeAttribute(attributes.VISIBLE);
      this.menu.hide();
    }
  }

  /**
   * @returns {boolean} true if the More Actions menu is currently displayed
   */
  get visible() {
    return this.menu?.visible || false;
  }

  /**
   * @returns {void}
   */
  #attachEventHandlers() {
    this.onEvent('beforeshow', this.menu, () => {
      this.refreshOverflowedItems();
    });

    // Forward `selected` events from the More Actions Menu to their
    // Toolbar Item counterparts.  This is needed for firing Toolbar Actions that
    // are only visible inside the overflow menu.
    this.onEvent('selected', this.menu, (e) => {
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
  #refresh() {
    if (this.menu.popup) {
      this.menu.popup.align = 'bottom, right';
      this.menu.popup.alignEdge = 'bottom';
    }
  }

  /**
   * Refreshes the visible state of menu items representing "overflowed" elements
   * @returns {void}
   */
  refreshOverflowedItems() {
    this.overflowMenuItems.forEach((item) => {
      const doHide = !this.isOverflowed(item.overflowTarget);
      item.hidden = doHide;
      if (doHide) {
        item.overflowTarget.removeAttribute(attributes.OVERFLOWED);
      } else {
        item.overflowTarget.setAttribute(attributes.OVERFLOWED, '');
      }
    });
  }

  /**
   * Connects each overflowed menu item to a real Toolbar element
   * @private
   * @returns {void}
   */
  #connectOverflowedItems() {
    // Render the "More Actions" area if it doesn't exist
    const el = this.querySelector(MORE_ACTIONS_SELECTOR);
    if (!el && this.overflow) {
      this.insertAdjacentHTML('afterbegin', this.#moreActionsMenuTemplate());
    }
    if (el && !this.overflow) {
      el.remove();
    }

    // Connects Overflow Menu subitems with corresponding menu items in the Toolbar
    // (generally by way of IdsMenuButtons or other menu-driven components)
    const handleSubmenu = (thisItem, overflowTargetMenu) => {
      [...thisItem.submenu.children].forEach((item, i) => {
        item.overflowTarget = overflowTargetMenu.items[i];
        if (item.submenu) {
          handleSubmenu(item, item.overflowTarget.submenu);
        }
      });
    };

    // Connect all "More Action" items generated from Toolbar Elements to their
    // real counterparts in the Toolbar
    this.overflowMenuItems.forEach((item, i) => {
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
  focus() {
    this.button.focus();
  }

  /**
   * @param {HTMLElement} item reference to the toolbar item to be checked for overflow
   * @returns {boolean} true if the item is a toolbar member and should be displayed by overflow
   */
  isOverflowed(item) {
    if (!this.toolbar.contains(item)) {
      return false;
    }

    const itemRect = item.getBoundingClientRect();
    const section = item.parentElement;
    const sectionRect = section.getBoundingClientRect();

    const isBeyondRightEdge = itemRect.right > sectionRect.right;
    const isBeyondLeftEdge = itemRect.left < sectionRect.left;

    return isBeyondLeftEdge || isBeyondRightEdge;
  }
}

export default IdsToolbarMoreActions;
export {
  IdsMenuButton,
  IdsPopupMenu
};
