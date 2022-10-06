import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import '../ids-popup/ids-popup';
import Base from './ids-popup-menu-base';

import styles from './ids-popup-menu.scss';

/**
 * IDS Popup Menu Component
 * @type {IdsPopupMenu}
 * @inherits IdsMenu
 * @mixes IdsEventsMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsPopupInteractionsMixin
 * @mixes IdsLocaleMixin
 */
@customElement('ids-popup-menu')
@scss(styles)
export default class IdsPopupMenu extends Base {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.WIDTH
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    const menuTemplate = super.template();
    return `<ids-popup class="ids-popup-menu" type="menu">${menuTemplate}</ids-popup>`;
  }

  /**
   * @returns {void}
   */
  connectedCallback(): void {
    super.connectedCallback();

    if (!this.hasAttribute(attributes.HIDDEN)) {
      this.setAttribute(attributes.HIDDEN, '');
    }
    if (this.hasAttribute(attributes.WIDTH)) {
      this.#setMenuWidth(this.getAttribute(attributes.WIDTH));
    }

    // If this Popupmenu is a submenu, and no target is pre-defined,
    // align the menu against the parent menu item.
    if (this.parentMenuItem) {
      this.popupDelay = 200;
      this.target = this.parentMenuItem;
      this.triggerType = 'hover';
      this.popup.align = 'right, top';
      this.popup.alignEdge = 'right';
    }
  }

  /**
   * @returns {void}
   */
  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    if (this.hasOpenEvents) {
      this.hide();
    }
  }

  /**
   * @returns {Array<string>} Drawer vetoable events
   */
  vetoableEventTypes: Array<string> = ['beforeshow'];

  /**
   * Sets up event handlers used in this menu.
   * @returns {void}
   */
  attachEventHandlers(): void {
    super.attachEventHandlers();

    // Hide the menu when an item is "picked"
    // (only if `keep-open` attribute is not present)
    this.onEvent('pick', this, (e: CustomEvent) => {
      if (this.visible) {
        const item = e.detail.elem;
        if (!item?.group?.keepOpen) {
          this.hideAndFocus();
        }
      }
    });

    // When the underlying Popup triggers its "show" event, pass the event to the Host element.
    this.onEvent('show', this.container, (e: CustomEvent) => {
      if (!this.parentMenuItem) {
        this.triggerEvent('show', this, e);
      }
      requestAnimationFrame(() => {
        this.focusTarget?.focus();
      });
    });

    // When the underlying Popup triggers its "hide" event, pass the event to the Host element.
    this.onEvent('hide', this.container, (e: CustomEvent) => {
      if (!this.parentMenuItem) {
        this.triggerEvent('hide', this, e);
      }
    });

    // Set up all the events specifically-related to the "trigger" type
    this.refreshTriggerEvents();
  }

  /**
   * Sets up the connection to the global keyboard handler
   * @returns {void}
   */
  attachKeyboardListeners(): void {
    super.attachKeyboardListeners();

    // Arrow Right on an item containing a submenu causes that submenu to open
    this.listen(['ArrowRight'], this, (e: any) => {
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
      this.listen(['ArrowLeft'], this, (e: any) => {
        e.preventDefault();
        this.hide();
        this.parentMenuItem.focus();
      });
    }

    // Escape closes the menu
    // (NOTE: This only applies to top-level Popupmenus)
    if (!this.parentMenu) {
      this.listen(['Escape'], this, (e: any) => {
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
  get visible(): boolean {
    return !!this.popup?.visible;
  }

  /**
   * Hides this menu and any of its submenus.
   * @returns {void}
   */
  hide(): void {
    if (!this.popup.visible) return;

    this.hidden = true;
    this.#removeVisibleARIA();
    this.lastHovered = undefined;

    // Hide the Ids Popup and all Submenus
    this.popup.visible = false;
    this.hideSubmenus();
    this.removeOpenEvents();
  }

  /**
   * @returns {void}
   */
  show(): void {
    if (this.popup.visible) return;

    // Trigger a veto-able `beforeshow` event.
    if (!this.triggerVetoableEvent('beforeshow')) {
      return;
    }

    this.hidden = false;
    this.#setVisibleARIA();

    // Hide any "open" submenus (in the event the menu is already open and being positioned)
    this.hideSubmenus();

    // Show the popup and do placement
    this.popup.visible = true;
    this.popup.place();

    this.addOpenEvents();
  }

  #setVisibleARIA(): void {
    this.popup.querySelector('nav')?.setAttribute(htmlAttributes.ROLE, 'menu');
    const items: Array<any> = [...this.querySelectorAll('ids-menu-item')];
    items.forEach((item, i) => {
      item.a.setAttribute(htmlAttributes.ARIA_POSINSET, i + 1);
      item.a.setAttribute(htmlAttributes.ARIA_SETSIZE, items.length);
    });
  }

  #removeVisibleARIA(): void {
    this.popup.querySelector('nav')?.removeAttribute(htmlAttributes.ROLE);
  }

  /**
   * Shows the Popupmenu if allowed
   * @returns {void}
   */
  showIfAble(): void {
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
  hideSubmenus(focusedMenuItem: any = undefined): void {
    const submenus = this.submenus;
    let focusedSubmenu: any;
    if (focusedMenuItem?.hasSubmenu) {
      focusedSubmenu = focusedMenuItem.submenu;
    }

    submenus.forEach((submenu: any) => {
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
  hideAndFocus(): void {
    this.hide();
    if (this.target) {
      this.target.focus();
    }
  }

  /**
   * Sets width of the Popup
   * @param {string | null} value css width value
   */
  set width(value: string | null) {
    const currentValue = this.width;
    const newValue = typeof value === 'string' ? stripHTML(value) : '';
    if (currentValue !== newValue) {
      if (newValue.length) {
        this.setAttribute(attributes.WIDTH, `${newValue}`);
      } else {
        this.removeAttribute(attributes.WIDTH);
      }
    }
    this.#setMenuWidth(newValue);
  }

  /**
   * Gets width
   * @returns {string | null} width value
   */
  get width(): string | null {
    const width = this.container?.style.width;
    return (width.length ? width : null);
  }

  #setMenuWidth(targetWidth: string | null): void {
    if (targetWidth === null) targetWidth = '';
    if (this.container) {
      this.container.style.width = targetWidth;
    }
  }

  /**
   * Inherited from the Popup Open Events Mixin.
   * Runs when a click event is propagated to the window.
   * @returns {void}
   */
  onOutsideClick(): void {
    this.hide();
  }

  /**
   * Inherited from the Popup Interactions Mixin.
   * Runs when a Popup Menu has a triggering element, and that element is clicked.
   * @param {MouseEvent} e the original mouse event
   * @returns {boolean} true if the click is allowed to propagate
   */
  onTriggerClick(e: MouseEvent): boolean {
    if (e.currentTarget !== window) {
      e.preventDefault();
    }

    // Escape if not using a left-click
    if (e.button !== 0) {
      return true;
    }

    if (this.hidden) {
      this.showIfAble();
    }
    return true;
  }

  /**
   * Inherited from the Popup Interactions Mixin.
   * Runs when a `contextmenu` event is triggered from the page.
   * @param {MouseEvent} e the original `contextmenu` event
   * @returns {void}
   */
  onContextMenu(e: MouseEvent): void {
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
  onTriggerImmediate(): void {
    window.requestAnimationFrame(() => {
      this.showIfAble();
    });
  }

  /**
   * Inherited from the Popup Interactions Mixin.
   * Runs on a delayed `mouseenter` event and fires when that delay completes
   * @returns {void}
   */
  onTriggerHover(): void {
    if (!this.target.disabled && !this.target.hidden) {
      // Hide all submenus attached to parent menu items (except this one)
      if (this.parentMenuItem) {
        this.parentMenuItem.menu.hideSubmenus(this.target);
      }

      this.showIfAble();
    }
  }

  /**
   * Inherited from the Popup Interactions Mixin.
   * Runs after a `mouseleave` event occurs from this menu
   * @param {CustomEvent} e IDS `sloped-mouseleave`
   * @returns {void}
   */
  onCancelTriggerHover(e: CustomEvent): void {
    const newTargetNode = e.detail.mouseLeaveNode;
    if (!this.contains(newTargetNode) && !this.isEqualNode(newTargetNode)) {
      this.hide();
    }
  }

  /**
   * Use the same click event type
   * @param {MouseEvent} e the original click event
   * @returns {boolean} true if the event is allowed to propagate
   */
  onTriggerHoverClick(e: MouseEvent): boolean {
    e.preventDefault();
    return this.onTriggerClick(e);
  }
}
