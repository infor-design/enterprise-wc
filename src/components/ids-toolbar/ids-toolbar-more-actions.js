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
      attributes.OVERFLOW
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();

    requestAnimationFrame(() => {
      this.render();
      this.refresh();

      this.#attachEventHandlers();
    });
  }

  template() {
    // Cycle through toolbar items, if present, and render a menu item that represents them
    const renderToolbarItems = () => this.toolbar?.items?.map((i) => this.moreActionsItemTemplate(i)).join('') || '';

    //
    return `<div class="ids-toolbar-section ids-toolbar-more-actions more">
      <ids-menu-button id="icon-button" menu="icon-menu">
        <ids-icon slot="icon" icon="more"></ids-icon>
        <span class="audible">More Actions Button</span>
      </ids-menu-button>
      <ids-popup-menu id="icon-menu" target="#icon-button" trigger="click">
        <ids-menu-group id="more-actions-items">
          ${ renderToolbarItems() }
        </ids-menu-group>
        <slot></slot>
      </ids-popup-menu>
    </div>`;
  }

  moreActionsItemTemplate(item) {
    let text = '';
    let icon = '';
    let disabled = '';
    const overflowed = this.isOverflowed(item) ? '' : ' hidden';

    switch (item.tagName) {
    case 'IDS-BUTTON':
      if (item.disabled) disabled = ' disabled';
      if (item.icon) icon = ` icon="${item.icon}"`;
      text = item.text;
      break;
    default:
      text = item.textContent;
      break;
    }

    // Sanitize text from Toolbar elements to fit menu items
    text = IdsStringUtils.removeNewLines(text);

    return `<ids-menu-item${disabled}${icon}${overflowed}>${text}</ids-menu-item>`;
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
   * @returns {Array<IdsMenuItem>} list of manually-defined menu items
   */
  get predefinedMenuItems() {
    return [...this.querySelectorAll('ids-menu-item')];
  }

  /**
   * @readonly
   * @returns {Array<IdsMenuItem|IdsMenuGroup>} list of menu items that mirror Toolbar items
   */
  get overflowMenuItems() {
    return [...this.menu.querySelector('#more-actions-items').children];
  }

  /**
   * @readonly
   * @returns {boolean} if this component is in a right-to-left environment
   */
  get rtl() {
    return !!this.closest('[dir="rtl"]');
  }

  /**
   * @readonly
   * @returns {IdsToolbar} a reference to this section's toolbar parent node
   */
  get toolbar() {
    return this.parentElement;
  }

  /**
   * @param {boolean|string} val truthy if this More Actions menu should display overflowed items from the toolbar
   */
  set overflow(val) {
    const newValue = IdsStringUtils.stringToBool(val);
    const currentValue = this.overflow;
    if (newValue !== currentValue) {
      if (newValue) {
        this.setAttribute('overflow', '');
      } else {
        this.removeAttribute('overflow');
      }
    }
  }

  /**
   * @returns {boolean} true if this More Actions menu will display overflowed items from the toolbar
   */
  get overflow() {
    return this.hasAttribute('overflow');
  }

  /**
   * Overrides the standard toolbar section "type" setter, which is always "more" in this case.
   * @param {string} val the type value
   */
  set type(val) {
    this.removeAttribute('type');
  }

  /**
   * Overrides the standard toolbar section "type" getter, which always returns "more" in this case.
   * @returns {string} representing the Toolbar Section type
   */
  get type() {
    return 'more';
  }

  /**
   * @returns {void}
   */
  #attachEventHandlers() {
    this.onEvent('beforeshow', this.menu, () => {
      this.refreshOverflowedItems();
    });
  }

  /**
   * Refreshes the state of the More Actions button
   * @returns {void}
   */
  refresh() {
    this.menu.popup.align = 'bottom, right';
    this.menu.popup.alignEdge = 'bottom';
    this.connectOverflowedItems();
  }

  /**
   * Refreshes the visible state of menu items representing "overflowed" elements
   * @returns {void}
   */
  refreshOverflowedItems() {
    this.overflowMenuItems.forEach((item) => {
      const doHide = !this.isOverflowed(item.target);
      item.hidden = doHide;
    });
  }

  /**
   * Connects each overflowed menu item to a real Toolbar element
   * @returns {void}
   */
  connectOverflowedItems() {
    this.overflowMenuItems.forEach((item, i) => {
      item.target = this.toolbar.items[i];
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

    const isRTL = this.rtl;
    const itemRect = item.getBoundingClientRect();
    const section = item.parentElement;
    const sectionRect = section.getBoundingClientRect();

    const isBeyondRightEdge = itemRect.right > sectionRect.right;
    const isBeyondLeftEdge = itemRect.left < sectionRect.left;

    switch (section.align) {
    case 'center':
      return isBeyondRightEdge || isBeyondLeftEdge;
    case 'end':
      if (isRTL) {
        return isBeyondRightEdge;
      }
      return isBeyondLeftEdge;
    default: // 'start'
      if (isRTL) {
        return isBeyondLeftEdge;
      }
      return isBeyondRightEdge;
    }
  }
}

export default IdsToolbarMoreActions;
export {
  IdsMenuButton,
  IdsPopupMenu
};
