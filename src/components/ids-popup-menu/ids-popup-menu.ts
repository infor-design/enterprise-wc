import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import { getElementAtMouseLocation, parents, validMaxHeight } from '../../utils/ids-dom-utils/ids-dom-utils';
import { cssTransitionTimeout } from '../../utils/ids-timer-utils/ids-timer-utils';

import IdsAttachmentMixin from '../../mixins/ids-attachment-mixin/ids-attachment-mixin';
import IdsPopupInteractionsMixin from '../../mixins/ids-popup-interactions-mixin/ids-popup-interactions-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';

import '../ids-popup/ids-popup';
import type IdsPopup from '../ids-popup/ids-popup';
import { onPlace } from '../ids-popup/ids-popup-attributes';
import IdsMenu from '../ids-menu/ids-menu';

import styles from './ids-popup-menu.scss';

const Base = IdsPopupInteractionsMixin(
  IdsLocaleMixin(
    IdsAttachmentMixin(
      IdsMenu
    )
  )
);

/**
 * IDS Popup Menu Component
 * @type {IdsPopupMenu}
 * @inherits IdsMenu
 * @mixes IdsPopupInteractionsMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsAttachmentMixin
 */
@customElement('ids-popup-menu')
@scss(styles)
export default class IdsPopupMenu extends Base {
  /** Component's first child element (in IdsPopupMenu, this is always an IdsPopup component) */
  container?: IdsPopup | null = null;

  recentlyHidden = false;

  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.ALIGN,
      attributes.ARROW,
      attributes.MAX_HEIGHT,
      attributes.WIDTH,
      attributes.X,
      attributes.Y
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    const menuTemplate = super.template();
    const alignAttr = this.align ? ` align="${this.align}"` : '';
    const maxHeightAttr = this.maxHeight ? ` max-height="${this.maxHeight}"` : '';

    return `<ids-popup class="ids-popup-menu" type="menu"${alignAttr}${maxHeightAttr}>${menuTemplate}</ids-popup>`;
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
    this.#configurePopup();
  }

  #configurePopup() {
    if (!this.container) this.container = this.shadowRoot?.querySelector('ids-popup');
    this.configureSubmenuAlignment();
    this.setOnPlace(!!this.parentMenuItem);
    if (this.popup) {
      this.popup.onOutsideClick = this.onOutsideClick.bind(this);
    }
  }

  /**
   * @returns {void}
   */
  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    if (this.popup?.hasOpenEvents) {
      this.hide();
    }
    this.#removeMutationObservers();
  }

  /**
   * Override `renderFromData()` from the IdsMenu base to also re-apply Popup Menu event handlers
   */
  renderFromData() {
    super.renderFromData();
    this.attachEventHandlers();
    this.attachKeyboardListeners();
  }

  /**
   * @returns {Array<string>} Popup Menu vetoable events
   */
  vetoableEventTypes: Array<string> = ['beforeshow'];

  private setInitialFocus() {
    const focusTarget = this.focusTarget;
    if (focusTarget) {
      focusTarget.highlight();
      focusTarget.focus();
    }
  }

  /**
   * Sets up event handlers used in this menu.
   * @returns {void}
   */
  attachEventHandlers(): void {
    super.attachEventHandlers();

    // Hide the menu when an item is "picked"
    // (only if `keep-open` attribute is not present)
    this.offEvent('pick');
    this.onEvent('pick', this, (e: CustomEvent) => {
      if (this.visible) {
        const item = e.detail.elem;
        if (!item?.group?.keepOpen) {
          this.hideAndFocus();
        }
      }
    });

    // When the underlying Popup triggers its "show" event, pass the event to the Host element.
    this.offEvent('show', this.popup);
    this.onEvent('show', this.popup, (e: CustomEvent) => {
      this.hideOtherMenus();
      if (!this.parentMenuItem) {
        this.triggerEvent('show', this, { bubbles: true, detail: e.detail });
      }
      this.setInitialFocus();
    });

    // When the underlying Popup triggers its "hide" event, pass the event to the Host element.
    this.offEvent('hide', this.popup);
    this.onEvent('hide', this.popup, (e: CustomEvent) => {
      if (!this.parentMenuItem) {
        this.triggerEvent('hide', this, { bubbles: true, detail: e.detail });
      }
      this.#mo?.disconnect();
    });

    // Set up all the events specifically-related to the "trigger" type
    this.refreshTriggerEvents();
  }

  /** Hide any older (enterprise) menus */
  hideOtherMenus() {
    const openMenu = (document.querySelector('.popupmenu.is-open') as HTMLElement);
    openMenu?.classList.remove('is-open');
    const openMenuElem = (document.querySelector('[data-popupmenu].is-open') as HTMLElement);
    openMenuElem?.classList.remove('is-open');

    // Use the is-open class to close it
    this.#mo = new MutationObserver((mutations) => {
      mutations.forEach((mutationRecord) => {
        const target = (mutationRecord.target as HTMLElement);
        if (target?.className === 'is-open') {
          this.hide();
        }
      });
    });
    const body = document.querySelector('body');
    if (body) this.#mo.observe(document.querySelector('body') as Node, { attributes: true, subtree: true });
  }

  #mo: MutationObserver | undefined = undefined;

  /**
   * Sets up the connection to the global keyboard handler
   * @returns {void}
   */
  attachKeyboardListeners(): void {
    super.attachKeyboardListeners();
    const target = this.keyboardEventTarget || this;

    const handleArrowHide = () => {
      if (this.parentMenu) {
        this.hideAndFocus(true);
      }
    };

    const handleArrowShow = (e: any) => {
      const thisItem = e.target.closest('ids-menu-item');
      if (thisItem.hasSubmenu) {
        thisItem.showSubmenu();
      }
    };

    // Arrow Right on an item containing a submenu causes that submenu to open
    this.unlisten('ArrowRight');
    this.listen(['ArrowRight'], target, (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.localeAPI.isRTL()) {
        handleArrowHide();
      } else {
        handleArrowShow(e);
      }
    });

    // Arrow Left on a submenu item causes the submenu to close, as well as focus
    // on a parent menu item to occur.
    // NOTE: This will never occur on a top-level Popupmenu.
    this.unlisten('ArrowLeft');
    this.listen(['ArrowLeft'], target, (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.localeAPI.isRTL()) {
        handleArrowShow(e);
      } else {
        handleArrowHide();
      }
    });

    // Escape closes the menu
    // (NOTE: This only applies to top-level Popupmenus)
    this.unlisten('Escape');
    if (!this.parentMenu) {
      this.listen(['Escape'], target, (e: any) => {
        if (this.hidden) return;
        e.preventDefault();
        e.stopPropagation();

        // Since Escape cancels without selection, re-focus the button
        this.hideAndFocus();
      });
    }
  }

  /**
   * @readonly
   * @returns {IdsPopupMenu} parent popup menu component, if this menu is a submenu
   */
  get parentMenu() {
    return this.parentElement?.closest<IdsPopupMenu>('ids-popup-menu');
  }

  /**
   * Passes an `align` setting down to the internal IdsPopup
   * @param {string} val a comma-delimited set of alignment types `direction1, direction2`
   */
  set align(val: string) {
    if (typeof val !== 'string') return;
    if (this.popup) this.popup.align = val;
  }

  /**
   * Retrieves the `align` setting from the internal IdsPopup
   * @returns {string} a comma-delimited set of alignment types `direction1, direction2`
   */
  get align() {
    return this.popup?.align || `top, ${this.popup?.localeAPI?.isRTL() ? 'right' : 'left'}`;
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
    if (!this.popup?.visible) return;

    this.hidden = true;
    this.#removeVisibleARIA();
    this.lastHovered = undefined;

    // Hide the Ids Popup and all Submenus
    this.popup.visible = false;
    this.hideSubmenus();
    this.popup?.removeOpenEvents();
    this.#removeMutationObservers();
    this.startHiddenTimer();
  }

  /**
   * Clean up any Mutation observers
   * @returns {void}
   */
  #removeMutationObservers() {
    if (this.#mo) {
      this.#mo.disconnect();
      this.#mo = undefined;
    }
  }

  /**
   * An async function that fires when the popupmenu or submenu is opened allowing you to set contents dynamically
   * @param {Function} func The async function
   */
  set beforeShow(func: (options: any) => Promise<string>) {
    this.state.beforeShow = func;
  }

  get beforeShow(): () => Promise<string> { return this.state.beforeShow; }

  /**
   * @returns {void}
   */
  async show(): Promise<void> {
    if (this.popup?.visible) return;

    // Trigger a veto-able `beforeshow` event.
    if (!this.triggerVetoableEvent('beforeshow')) {
      return;
    }

    await this.#callBeforeShow();
    this.configureSubmenuAlignment();
    this.refreshIconAlignment();

    this.hidden = false;
    this.#setVisibleARIA();

    // Hide any "open" submenus (in the event the menu is already open and being positioned)
    this.hideSubmenus();

    // Show the popup and do placement
    this.popup?.setAttribute('visible', 'true');

    this.triggerEvent('aftershow', this, {
      bubbles: true,
      detail: {
        elem: this
      }
    });

    this.popup?.addOpenEvents();
  }

  /**
   * Trigger an async callback for contents and update config
   * @private
   */
  async #callBeforeShow() {
    const isSubmenu = this.getAttribute('slot') === 'submenu';
    let rootMenu;
    if (isSubmenu) {
      const parentElems = parents(this, 'ids-popup-menu');
      rootMenu = parentElems[parentElems.length - 1] as IdsPopupMenu;
      this.state.beforeShow = rootMenu?.state.beforeShow;
    }

    if (this.state.beforeShow) {
      const menuData = await this.state.beforeShow({
        popop: this.popup,
        data: this.data,
        isSubmenu: this.getAttribute('slot') === 'submenu',
        contextElement: this
      });
      if (!menuData) return;
      if (!isSubmenu) {
        const alignTarget = this.popup!.alignTarget;
        const arrowTarget = this.popup!.arrowTarget;
        const arrow = this.popup!.arrow;
        this.data = menuData;

        this.#configurePopup();
        if (this.triggerType === 'click') {
          this.popup!.alignTarget = alignTarget;
          this.popup!.arrowTarget = arrowTarget;
          this.popup!.arrow = arrow;
        }
      }
      if (isSubmenu && rootMenu) {
        const submenuDataItem = this.#findSubmenu((rootMenu.data as any)[0].items, 'id', this.id)!;
        submenuDataItem.contents = [menuData];
        this.data = submenuDataItem;
        this.setOnPlace(!!this.parentMenuItem);
      }
      if (!isSubmenu && this.triggerType === 'contextmenu') {
        this.popup?.setPosition(this.state.pageX, this.state.pageY);
      }
      if (!isSubmenu && this.triggerType === 'click') {
        this.setOnPlace(!!this.parentMenuItem);
      }
    }
  }

  /**
   * Find an element in an array when its deeply nested. If we need a generic one this could be made into.
   * @param {Array} array to scan
   * @param {string} key selector containing a CSS selector to be used for matching
   * @param {unknown} value the value to match the key
   * @returns {any} The object in the array (ref)
   * @private
   */
  #findSubmenu(array: any, key: string, value: unknown): any {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
      if (array[i].submenu) {
        // May need recursion soon
        if (array[i].submenu[key] === value) {
          return array[i].submenu;
        }
      }
    }
    return undefined;
  }

  /**
   * Set the aria role
   * @private
   */
  #setVisibleARIA(): void {
    this.popup?.querySelector('nav')?.setAttribute(htmlAttributes.ROLE, 'menu');
    const items: Array<any> = [...this.querySelectorAll('ids-menu-item')];
    items.forEach((item, i) => {
      item.a.setAttribute(htmlAttributes.ARIA_POSINSET, i + 1);
      item.a.setAttribute(htmlAttributes.ARIA_SETSIZE, items.length);
    });
  }

  /**
   * Remove the aria role
   * @private
   */
  #removeVisibleARIA(): void {
    this.popup?.querySelector('nav')?.removeAttribute(htmlAttributes.ROLE);
  }

  /**
   * Shows the Popupmenu if allowed
   * @returns {void}
   */
  showIfAble(): void {
    if (!this.target) {
      this.show();
    } else if (!(this.target as any)?.disabled && !(this.target as any)?.hidden) {
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
      if (!submenu.hidden && !submenuIsIgnored && !submenu.contains(focusedSubmenu)) {
        submenu.hide();
      }
    });
  }

  /**
   * Hides the popup menu and focuses a target element, if applicable
   * @param {boolean} [focusParent] true if focus should be placed on a parent menu item
   * @returns {void}
   */
  hideAndFocus(focusParent?: boolean): void {
    this.hide();

    // Focus a parent menu item if possible, otherwise focus the menu's target
    const focusTarget = this.parentMenu && focusParent ? this.parentMenuItem : this.target;
    focusTarget?.focus();
  }

  /**
   * @returns {string | null} The max height value
   */
  get maxHeight(): string | null {
    return this.getAttribute(attributes.MAX_HEIGHT);
  }

  /**
   * Set the max height value
   * @param {string | number | null} value The value
   */
  set maxHeight(value: string | number | null) {
    const val = validMaxHeight(value);
    if (val) {
      this.setAttribute(attributes.MAX_HEIGHT, val);
      this.popup?.setAttribute(attributes.MAX_HEIGHT, val);
    } else {
      this.removeAttribute(attributes.MAX_HEIGHT);
      this.popup?.removeAttribute(attributes.MAX_HEIGHT);
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
    return (width?.length ? width : null);
  }

  /**
   * Sets the Y (top) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set y(val: number) {
    if (this.popup) this.popup.y = val;
  }

  get y(): number {
    return this.popup?.y || 0;
  }

  /**
   * Sets the X (top) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set x(val: number) {
    if (this.popup) this.popup.x = val;
  }

  get x(): number {
    return this.popup?.x || 0;
  }

  /**
   * Specifies whether to show the Popup Arrow, and in which direction.
   * The direction is in relation to the alignment setting. So for example of you align: top you want arrow: top as well.
   * @param {string|null} val the arrow direction.  Defaults to `none`
   */
  set arrow(val: string | null) {
    if (this.popup) this.popup.arrow = val;
  }

  get arrow(): string | null {
    return this.popup?.arrow || 'none';
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

    if (this.hidden && !this.recentlyHidden) {
      this.showIfAble();
      this.setInitialFocus();
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
    this.hide();
    this.state.pageX = e.pageX;
    this.state.pageY = e.pageY;
    this.popup?.setPosition(e.pageX, e.pageY);
    this.showIfAble();
    this.setInitialFocus();
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
    if (!(this.target as any).disabled && !(this.target as any).hidden) {
      // Hide all submenus attached to parent menu items (except this one)
      if (this.parentMenuItem) {
        (this.parentMenuItem?.menu as IdsPopupMenu)?.hideSubmenus(this.target);
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
    const mouseLeaveNode = e.detail.mouseLeaveNode;
    const currentNodeAtMouse = getElementAtMouseLocation();

    if (currentNodeAtMouse) {
      if (!currentNodeAtMouse.isEqualNode(mouseLeaveNode) || !this.contains(mouseLeaveNode)) {
        this.hide();
        if (mouseLeaveNode?.tagName === 'IDS-MENU-ITEM') {
          mouseLeaveNode.highlight();
          mouseLeaveNode.menu?.hideSubmenus?.(mouseLeaveNode);
        }
      }
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

  /**
   * Sets the `onPlace` method for submenus to account for the host element's position
   * @param {boolean} val true if the `onPlace` method should account for a parent menu's placement
   */
  private setOnPlace(val: boolean) {
    if (this.popup) {
      if (val) {
        this.popup.scrollParentElem = this.parentMenu?.popup?.wrapper;
        this.popup.onPlace = (popupRect: DOMRect): DOMRect => {
          const parentPopup = this.parentMenu && this.parentMenu.popup!;
          if (this.container && parentPopup) {
            this.container.removeAttribute('style');

            // accounts for top/bottom padding + border thickness
            const extra = 10;

            if (!this.container) this.container = this.shadowRoot?.querySelector('ids-popup');
            // adjusts for nested `relative` positioned offsets, and scrolled containers
            const xAdjust = (parentPopup.offsetLeft || 0)
              - this.container!.scrollParentElem!.scrollLeft;
            const yAdjust = (parentPopup.offsetTop || 0)
              - this.container!.scrollParentElem!.scrollTop + extra;

            popupRect.x -= xAdjust;
            popupRect.y -= yAdjust;
          }
          return popupRect;
        };
      } else {
        this.popup.onPlace = onPlace;
      }
    }
  }

  /**
   * Focuses the correct element
   */
  focus() {
    if (this.hidden) return;
    this.focusTarget?.focus();
  }

  /**
   * Runs a private internal timer that controls whether or not
   * some internal event-handling is allowed on the popup menu.
   */
  private async startHiddenTimer() {
    this.recentlyHidden = true;
    await cssTransitionTimeout(10);
    this.recentlyHidden = false;
  }

  /**
   * If this Popupmenu is a submenu, and no target is pre-defined,
   * align the menu against the parent menu item.
   */
  private configureSubmenuAlignment() {
    const isRTL = this.popup?.localeAPI?.isRTL() || false;
    if (this.parentMenuItem) {
      this.popupDelay = 200;
      this.target = this.parentMenuItem;
      this.triggerType = 'hover';
      this.align = `${isRTL ? 'left' : 'right'}, top`;
    }
  }
}
