import {
  customElement,
  mix,
  scss
} from '../../core';

import {
  IdsEventsMixin,
  IdsPopupInteractionsMixin,
  IdsPopupOpenEventsMixin,
  IdsLocaleMixin
} from '../../mixins';

import IdsMenu from '../ids-menu/ids-menu';
import IdsPopup from '../ids-popup';
import styles from './ids-popup-menu.scss';

/**
 * IDS Popup Menu Component
 * @type {IdsPopupMenu}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsPopupInteractionsMixin
 * @mixes IdsLocaleMixin
 */
@customElement('ids-popup-menu')
@scss(styles)
class IdsPopupMenu extends mix(IdsMenu).with(
    IdsEventsMixin,
    IdsPopupOpenEventsMixin,
    IdsPopupInteractionsMixin,
    IdsLocaleMixin
  ) {
  constructor() {
    super();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const menuTemplate = IdsMenu.prototype.template.apply(this);
    return `<ids-popup class="ids-popup-menu" type="menu">${menuTemplate}</ids-popup>`;
  }

  /**
   * @returns {void}
   */
  connectedCallback() {
    if (!this.hasAttribute('hidden')) {
      this.setAttribute('hidden', '');
    }

    // If this Popupmenu is a submenu, and no target is pre-defined,
    // align the menu against the parent menu item.
    if (this.parentMenuItem && !this.target) {
      this.popupDelay = 200;
      this.trigger = 'hover';
      this.target = this.parentMenuItem;
      this.popup.align = 'right, top';
      this.popup.alignEdge = 'right';
    }

    super.connectedCallback?.();

    // Respond to parent changing language
    this.offEvent('languagechange.popup-menu');
    this.onEvent('languagechange.popup-menu', this, async (e) => {
      await this.shadowRoot.querySelector('ids-popup')?.setLanguage(e.detail.language.name);
      this.querySelectorAll('ids-menu-group')?.forEach((menuGroup) => {
        menuGroup?.setLanguage(e.detail.language.name);
      });
    });
  }

  /**
   * @returns {void}
   */
  disconnectedCallback() {
    if (this.hasOpenEvents) {
      this.hide();
    }

    super.disconnectedCallback?.();
  }

  /**
   * Sets up event handlers used in this menu.
   * @returns {void}
   */
  attachEventHandlers() {
    super.attachEventHandlers();

    // Hide the menu when an item is selected
    // (only if `keep-open` attribute is not present)
    this.onEvent('selected', this, (e) => {
      if (this.visible) {
        const item = e.detail.elem;
        if (!item?.group?.keepOpen) {
          this.hideAndFocus();
        }
      }
    });

    // When the underlying Popup triggers it's "show" event,
    // focus on the derived focusTarget.
    this.onEvent('show', this.container, () => {
      requestAnimationFrame(() => {
        this.focusTarget?.focus();
      });
    });

    // Set up all the events specifically-related to the "trigger" type
    this.refreshTriggerEvents();
  }

  /**
   * Sets up the connection to the global keyboard handler
   * @returns {void}
   */
  attachKeyboardListeners() {
    super.attachKeyboardListeners();

    // Arrow Right on an item containing a submenu causes that submenu to open
    this.listen(['ArrowRight'], this, (e) => {
      e.preventDefault();
      const thisItem = e.target.closest('ids-menu-item');
      if (thisItem.hasSubmenu) {
        thisItem.showSubmenu();
      }
    });

    // Arrow Left on a submenu item causes the submenu to close, as well as focus
    // on a parent menu item to occur.
    // NOTE: This will never occur on a top-level Popupmenu.
    if (this.parentMenu) {
      this.listen(['ArrowLeft'], this, (e) => {
        e.preventDefault();
        this.hide();
        this.parentMenuItem.focus();
      });
    }

    // Escape closes the menu
    // (NOTE: This only applies to top-level Popupmenus)
    if (!this.parentMenu) {
      this.listen(['Escape'], this, (e) => {
        if (this.hidden) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();

        // Since Escape cancels without selection, re-focus the button
        this.hideAndFocus();
      });
    }
  }

  /**
   * @readonly
   * @returns {boolean} true if the Popup Menu is currently being displayed
   */
  get visible() {
    return this.popup.visible;
  }

  /**
   * Hides this menu and any of its submenus.
   * @returns {void}
   */
  hide() {
    this.hidden = true;
    this.popup.querySelector('nav')?.removeAttribute('role');
    this.lastHovered = undefined;

    // Hide the Ids Popup and all Submenus
    this.popup.visible = false;
    this.hideSubmenus();
    this.removeOpenEvents();
  }

  /**
   * @returns {void}
   */
  show() {
    // Trigger a veto-able `beforeshow` event.
    let canShow = true;
    const beforeShowResponse = (veto) => {
      canShow = !!veto;
    };

    this.triggerEvent('beforeshow', this, {
      detail: {
        elem: this,
        response: beforeShowResponse
      }
    });

    if (!canShow) {
      return;
    }

    this.hidden = false;
    this.popup.querySelector('nav')?.setAttribute('role', 'menu');

    // Hide any "open" submenus (in the event the menu is already open and being positioned)
    this.hideSubmenus();

    // Show the popup and do placement
    this.popup.visible = true;
    this.popup.place();

    this.addOpenEvents();
  }

  /**
   * Shows the Popupmenu if allowed
   * @returns {void}
   */
  showIfAble() {
    if (!this.target) {
      this.show();
    } else if (!this.target.disabled && !this.target.hidden) {
      this.show();
    }
  }

  /**
   * Hides any "open" submenus within this menu structure, optionally ingorning a single
   * menu to "keep open".
   * @param {any} [focusedMenuItem] [IdsMenuItem] if provided, will be ignored and considered the
   * "currently open" menu.
   * @returns {void}
   */
  hideSubmenus(focusedMenuItem = undefined) {
    const submenus = this.submenus;
    let focusedSubmenu;
    if (focusedMenuItem?.hasSubmenu) {
      focusedSubmenu = focusedMenuItem.submenu;
    }

    submenus.forEach((submenu) => {
      const submenuIsIgnored = focusedSubmenu && focusedSubmenu.isEqualNode(submenu);
      if (!submenu.hidden && !submenuIsIgnored) {
        submenu.hide();
      }
    });
  }

  /**
   * Hides the popup menu and focuses a target element, if applicable
   * @returns {void}
   */
  hideAndFocus() {
    this.hide();
    if (this.target) {
      this.target.focus();
    }
  }

  /**
   * Inherited from the Popup Open Events Mixin.
   * Runs when a click event is propagated to the window.
   * @returns {void}
   */
  onOutsideClick() {
    this.hide();
  }

  /**
   * Inherited from the Popup Interactions Mixin.
   * Runs when a Popup Menu has a triggering element, and that element is clicked.
   * @param {MouseEvent} e the original mouse event
   * @returns {boolean} true if the click is allowed to propagate
   */
  onTriggerClick(e) {
    if (e.currentTarget !== window) {
      e.preventDefault();
    }

    // Escape if not using a left-click
    if (e.button !== 0) {
      return true;
    }

    if (this.hidden) {
      this.showIfAble();
    } else {
      this.hide();
    }
    return true;
  }

  /**
   * Inherited from the Popup Interactions Mixin.
   * Runs when a `contextmenu` event is triggered from the page.
   * @param {MouseEvent} e the original `contextmenu` event
   * @returns {void}
   */
  onContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    this.popup.setPosition(e.pageX, e.pageY);
    this.showIfAble();
  }

  /**
   * Inherited from the Popup Interactions Mixin.
   * Runs as soon as the Popup is connected to the DOM.
   * @returns {void}
   */
  onTriggerImmediate() {
    window.requestAnimationFrame(() => {
      this.showIfAble();
    });
  }

  /**
   * Inherited from the Popup Interactions Mixin.
   * Runs on a delayed `mouseenter` event and fires when that delay completes
   * @returns {void}
   */
  onTriggerHover() {
    if (!this.target.disabled && !this.target.hidden) {
      this.showIfAble();
    }
  }

  /**
   * Inherited from the Popup Interactions Mixin.
   * Runs after a `mouseleave` event occurs from this menu
   * @returns {void}
   */
  onCancelTriggerHover() {
    this.hide();
  }

  /**
   * Use the same click event type
   * @param {MouseEvent} e the original click event
   * @returns {boolean} true if the event is allowed to propagate
   */
  onTriggerHoverClick(e) {
    return this.onTriggerClick(e);
  }
}

export default IdsPopupMenu;
export {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
} from '../ids-menu/ids-menu';
