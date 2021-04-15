import {
  customElement,
  mix,
  scss,
  props
} from '../ids-base/ids-element';

import { IdsRenderLoopItem, IdsRenderLoopMixin } from '../ids-render-loop/ids-render-loop-mixin';

import IdsMenu from '../ids-menu/ids-menu';
import IdsPopup from '../ids-popup/ids-popup';

// @ts-ignore
import styles from './ids-popup-menu.scss';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';

const POPUPMENU_PROPERTIES = [
  props.TARGET,
  props.TRIGGER
];

const POPUPMENU_TRIGGER_TYPES = [
  'contextmenu',
  'click',
  'immediate'
];

/**
 * IDS Popup Menu Component
 * @type {IdsPopupMenu}
 * @inherits IdsElement
 * @mixes IdsRenderLoopMixin
 */
@customElement('ids-popup-menu')
@scss(styles)
class IdsPopupMenu extends mix(IdsMenu).with(IdsRenderLoopMixin, IdsEventsMixin) {
  constructor() {
    super();
    this.state.trigger = POPUPMENU_TRIGGER_TYPES[0];
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return POPUPMENU_PROPERTIES;
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
    this.shouldUpdate = true;

    // If this Popupmenu is a submenu, and no target is pre-defined,
    // align the menu against the parent menu item.
    // @TODO change this logic if Popup accepts HTMLElement
    if (this.parentMenuItem && !this.target) {
      this.target = this.parentMenuItem;
      this.popup.align = 'right, top';
    }

    // @ts-ignore
    IdsMenu.prototype.connectedCallback.apply(this);
  }

  /**
   * Sets up event handlers used in this menu.
   * @returns {void}
   */
  handleEvents() {
    // @ts-ignore
    IdsMenu.prototype.handleEvents.apply(this);

    // This handler runs whenever an item contained by the Popupmenu needs to become focused.
    const doFocusHandler = () => {
      // @ts-ignore
      this.rl.register(new IdsRenderLoopItem({
        duration: 1,
        timeoutCallback: () => {
          this.focusTarget?.focus();
        }
      }));
    };

    // In some situations, hide the menu when an item is selected.
    this.onEvent('selected', this, (/** @type {any} */ e) => {
      const item = e.detail.elem;
      if (!item.group.keepOpen) {
        this.hide();
      }
    });

    // When the underlying Popup triggers it's "show" event, focus on the derived focusTarget.
    this.onEvent('show', this.container, doFocusHandler);

    // Set up all the events specifically-related to the "trigger" type
    this.refreshTriggerEvents();
  }

  /**
   * Sets up the connection to the global keyboard handler
   * @returns {void}
   */
  handleKeys() {
    // @ts-ignore
    IdsMenu.prototype.handleKeys.apply(this);

    // Arrow Right on an item containing a submenu causes that submenu to open
    this.listen(['ArrowRight'], this, (/** @type {any} */ e) => {
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
      this.listen(['ArrowLeft'], this, (/** @type {any} */ e) => {
        e.preventDefault();
        this.hide();
        this.parentMenuItem.focus();
      });
    }

    // Escape closes the menu
    // (NOTE: This only applies to top-level Popupmenus)
    if (!this.parentMenu) {
      this.listen(['Escape'], this, (/** @type {any} */ e) => {
        if (this.hidden) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        this.hide();

        // Since Escape cancels without selection, re-focus the button
        /* istanbul ignore next */
        if (this.target) {
          this.target.focus();
        }
      });
    }
  }

  /**
   * @readonly
   * @returns {IdsPopup} reference to the inner Popup component
   */
  get popup() {
    return this.shadowRoot.querySelector('ids-popup');
  }

  /**
   * @returns {any} [HTMLElement|undefined] reference to a target element, if applicable
   */
  get target() {
    return this.popup.alignTarget;
  }

  /**
   * @param {any} val [HTMLElement|string] reference to an element, or a string that will be used
   * as a CSS Selector referencing an element, that the Popupmenu will align against.
   */
  set target(val) {
    this.popup.alignTarget = val;
  }

  /**
   * @returns {string} the type of action that will trigger this Popupmenu
   */
  get trigger() {
    return this.state.trigger;
  }

  /**
   * @param {string} val a valid trigger type
   */
  set trigger(val) {
    let trueTriggerType = val;
    if (!POPUPMENU_TRIGGER_TYPES.includes(val)) {
      trueTriggerType = POPUPMENU_TRIGGER_TYPES[0];
    }
    this.state.trigger = trueTriggerType;
    this.refreshTriggerEvents();
  }

  /**
   * Causes events related to the Popupmenu's "trigger" style to be unbound/rebound
   * @private
   */
  /* istanbul ignore next */
  refreshTriggerEvents() {
    if (!this.shouldUpdate) {
      return;
    }

    // Remove any pre-existing trigger events
    const removeEventTargets = ['contextmenu.trigger', 'click.trigger'];
    removeEventTargets.forEach((eventName) => {
      const evt = this.handledEvents.get(eventName);
      if (evt) {
        this.detachEventsByName(eventName);
      }
    });

    // Based on the trigger type, bind new events
    const targetElem = this.target || window;
    switch (this.trigger) {
    case 'immediate':
      // @TODO
      break;
    case 'click':
      // Configure some settings for opening
      this.popup.align = 'bottom, left';
      this.popup.arrow = 'bottom';
      this.popup.y = 8;

      // Open/Close the menu when the trigger element is clicked
      this.onEvent('click.trigger', targetElem, (/** @type {any} */e) => {
        e.preventDefault();
        if (this.hidden) {
          this.show();
        } else {
          this.hide();
        }
      });

      break;
    default:
      // Standard `contextmenu` event behavior.
      // `contextmenu` events should only apply to top-level popupmenus.
      // (submenus open/close events are handled by their parent items)
      if (this.parentMenu) {
        break;
      }

      // Attach a contextmenu handler to the target element for opening the popup
      this.onEvent('contextmenu.trigger', targetElem, (/** @type {any} */e) => {
        e.preventDefault();
        e.stopPropagation();
        this.popup.x = e.pageX;
        this.popup.y = e.pageY;
        this.show();
      });
      break;
    }
  }

  /**
   * Attaches some events when the Popupmenu is opened.
   * @private
   * @returns {void}
   */
  addOpenEvents() {
    // Attach all these events on a Renderloop-staggered timeout
    // @ts-ignore
    this.rl.register(new IdsRenderLoopItem({
      duration: 1,
      timeoutCallback: () => {
        // Attach a click handler to the window for detecting clicks outside the popup.
        // If these aren't captured by a popup, the menu will close.
        this.onEvent('click.toplevel', window, () => {
          this.hide();
        });
        this.hasOpenEvents = true;
      }
    }));
  }

  /**
   * Detaches some events when the Popupmenu is closed.
   * @private
   * @returns {void}
   */
  removeOpenEvents() {
    if (!this.hasOpenEvents) {
      return;
    }
    // @ts-ignore
    this.offEvent('click.toplevel', window);
    this.hasOpenEvents = false;
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
    const beforeShowResponse = (/** @type {any} */ veto) => {
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

    // Show this popup
    this.popup.visible = true;

    this.addOpenEvents();
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
        // @ts-ignore
        submenu.hide();
      }
    });
  }
}

export default IdsPopupMenu;
export {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
} from '../ids-menu/ids-menu';
