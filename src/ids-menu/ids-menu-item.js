import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../ids-render-loop/ids-render-loop-mixin';
import IdsIcon from '../ids-icon/ids-icon';

import styles from './ids-menu-item.scss';

// @TODO handle other menu-item sizes
const MENU_ITEM_SIZE = 'medium';

// Default Button state values
const MENU_DEFAULTS = {
  disabled: false,
  href: null,
  icon: null,
  tabindex: true,
  value: null,
};

// Definable attributes
const MENU_PROPS = [
  props.DISABLED,
  props.ICON,
  props.HREF,
  props.SELECTED,
  props.SUBMENU,
  props.TABINDEX,
  props.VALUE
];

/**
 * Determines if a menu item's stored value can safely be described by its attribute inside the DOM.
 * @param {any} value the value to be checked
 * @returns {boolean} true if the value can be "stringified" safely for the DOM attribute
 */
function safeForAttribute(value) {
  return ['string', 'number', 'boolean'].includes(typeof value);
}

/**
 * IDS Menu Item Component
 */
@customElement('ids-menu-item')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsRenderLoopMixin)
class IdsMenuItem extends IdsElement {
  /**
   * Build the menu item
   * @param {object} settings incoming settings for the menu item
   */
  constructor(settings = {}) {
    super();

    // Pull in settings
    this.state = {};
    Object.keys(MENU_DEFAULTS).forEach((prop) => {
      this.state[prop] = settings[prop] || MENU_DEFAULTS[prop];
    });
    this.shouldUpdate = true;
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    let disabledClass = '';
    let disabledAttr = '';
    if (this.state?.disabled) {
      disabledClass = ' is-disabled';
      disabledAttr = ' disabled';
    }

    let href = '';
    if (this.state?.href) {
      href = ` href="${this.state.href}"`;
    }

    // Check
    let check = '';
    if (this.group?.select !== 'none') {
      check = '<span class="check"></span>';
    }

    // Icon
    let icon = '';
    if (this.state?.icon) {
      icon = `<ids-icon slot="icon" icon="${this.state.icon}" size="${MENU_ITEM_SIZE}"></ids-icon>`;
    }
    const iconSlot = `<slot name="icon">${icon}</slot>`;

    // Submenu
    let submenuClass = '';
    if (this.state?.submenu) {
      submenuClass = ' has-submenu';
    }

    // Tabindex
    let tabindex = 'tabindex="0"';
    if (this.state?.tabindex && !this.state?.disabled) {
      tabindex = ` tabindex="${this.state.tabindex}"`;
    }

    // Text
    const textSlot = `<span class="ids-menu-item-text"><slot></slot></span>`;

    // Main
    return `<li role="presentation" class="ids-menu-item${disabledClass}${submenuClass}">
      <a ${href} ${tabindex} ${disabledAttr} role="menuitem">
        ${check}${iconSlot}${textSlot}
      </a>
      <slot name="submenu"></slot>
    </li>`;
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} properties
   */
  static get properties() {
    return MENU_PROPS;
  }

  /**
   * Override `attributeChangedCallback` from IdsElement to wrap its normal operation in a
   * check for a true `shouldUpdate` property.
   * @private
   * @param  {string} name The property name
   * @param  {string} oldValue The property old value
   * @param  {string} newValue The property new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shouldUpdate) {
      IdsElement.prototype.attributeChangedCallback.apply(this, [name, oldValue, newValue]);
    }
  }

  /**
   * Menu-level `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    this.detectSubmenu();
    this.detectSelectability();
    this.handleEvents();
    this.shouldUpdate = true;
  }

  /**
   * @returns {void}
   */
  handleEvents() {
    let hoverTimeout;
    const self = this;
    const clearTimeout = () => {
      if (hoverTimeout) {
        hoverTimeout.destroy(true);
        hoverTimeout = null;
      }
    };

    // On 'mouseenter', after a specified duration, run some events,
    // including activation of submenus where applicable.
    this.eventHandlers.addEventListener('mouseenter', this, () => {
      if (!this.disabled && this.hasSubmenu) {
        clearTimeout();
        hoverTimeout = new IdsRenderLoopItem({
          duration: 200,
          timeoutCallback() {
            self.showSubmenu();
          }
        });
        this.rl.register(hoverTimeout);
      }

      // Highlight
      this.menu.highlightItem(this);
    });

    // On 'mouseleave', clear any pending timeouts and unhighlight the item
    this.eventHandlers.addEventListener('mouseleave', this, () => {
      clearTimeout();
      this.unhighlight();
    });
  }

  /**
   * @readonly
   * @returns {HTMLAnchorElement} reference to the Menu Item's anchor
   */
  get a() {
    return this.shadowRoot.querySelector('a');
  }

  /**
   * @readonly
   * @returns {HTMLElement} reference to the parent IdsMenu component, if one exists.
   */
  get menu() {
    return this.closest('ids-menu, ids-popup-menu');
  }

  /**
   * @readonly
   * @returns {HTMLElement} reference to the parent IdsMenuGroup component, if one exists.
   */
  get group() {
    return this.closest('ids-menu-group');
  }

  /**
   * Passes a disabled attribute from the custom element to the button
   * @param {boolean} val true if the button will be disabled
   */
  set disabled(val) {
    const trueVal = val !== null;
    this.state.disabled = trueVal;

    // Update attribute if it doesn't match
    const a = this.a;
    const shouldUpdate = this.shouldUpdate;
    const currentAttr = this.hasAttribute('disabled');
    if ((!currentAttr && trueVal) || (currentAttr && !trueVal)) {
      this.shouldUpdate = false;
      if (trueVal) {
        this.setAttribute('disabled', '');
        if (a) {
          a.disabled = true;
          a.setAttribute('disabled', '');
        }
      } else {
        this.removeAttribute('disabled');
        if (a) {
          a.disabled = false;
          a.removeAttribute('disabled');
        }
      }
      this.shouldUpdate = shouldUpdate;
    }

    // Adjust tabindex/focus
    this.tabindex = trueVal ? -1 : 0;
    this.container.classList[trueVal ? 'add' : 'remove']('disabled');
  }

  /**
   * Retrieve the disabled state of the inner button element
   * @returns {boolean} the inner button's disabled state
   */
  get disabled() {
    return this.state.disabled;
  }

  /**
   * @param {boolean} val true if the menu item should appear highlighted
   */
  set highlighted(val) {
    if (this.disabled) {
      return;
    }

    const trueVal = val === true || val === 'true';
    this.state.highlighted = trueVal;
    this.container.classList[trueVal ? 'add' : 'remove']('highlighted');
  }

  /**
   * @returns {boolean} true if the menu item should show a highlight
   */
  get highlighted() {
    return this.state.highlighted;
  }

  /**
   * @param {string} val representing the icon to set
   */
  set icon(val) {
    if (typeof val !== 'string' || !val.length) {
      this.removeAttribute('icon');
      this.state.icon = undefined;
      this.removeIcon();
    } else {
      this.state.icon = val;
      this.setAttribute('icon', val);
      this.appendIcon(val);
    }
  }

  /**
   * @returns {undefined|string} a defined IdsIcon's `icon` attribute, if one is present
   */
  get icon() {
    return this.iconEl?.icon;
  }

  /**
   * @returns {undefined|IdsIcon} reference to a defined IDS Icon element, if applicable
   */
  get iconEl() {
    // return this.querySelector('ids-icon[slot="icon"]');
    const icon = [...this.children].find((e) => e.matches('ids-icon'));
    return icon;
  }

  /**
   * Check if an icon exists, and adds the icon if it's missing
   * @param {string} iconName The icon name to check
   * @private
   */
  appendIcon(iconName) {
    // First look specifically for an icon slot.
    const icon = this.querySelector(`ids-icon[slot="icon"]`); // @TODO check for submenu icons here
    if (icon) {
      icon.icon = iconName;
    } else {
      this.insertAdjacentHTML('afterbegin', `<ids-icon slot="icon" icon="${iconName}" size="${MENU_ITEM_SIZE}" class="ids-icon ids-menu-item-display-icon"></ids-icon>`);
    }
  }

  /**
   * Check if an icon exists, and removes the icon if it's present
   * @private
   */
  removeIcon() {
    const icon = this.querySelector(`ids-icon[slot="icon"]`); // @TODO check for submenu icons here
    if (icon) {
      icon.remove();
    }
  }

  /**
   * @readonly
   * @returns {HTMLElement} an IdsMenuGroup, if one is present.
   */
  get submenu() {
    return this.querySelector('ids-menu, ids-popup-menu');
  }

  /**
   * @readonly
   * @returns {boolean} true if a submenu is present
   */
  get hasSubmenu() {
    // @TODO remove to enable submenu functionality in standalone menu
    const prototypeHasMenu = (this.menu?.tagName !== 'IDS-MENU') || false;
    return prototypeHasMenu && !!this.submenu;
  }

  /**
   * @returns {boolean} true if this menu item contains a submenu structure.
   */
  detectSubmenu() {
    const hasSubmenu = this.hasSubmenu;
    this.container.classList[hasSubmenu ? 'add' : 'remove']('has-submenu');
    this.decorateSubmenu(hasSubmenu);
    return hasSubmenu;
  }

  /**
   * @param {boolean} val true if a submenu is present and should be identified
   * with icons and correct aria properties
   */
  decorateSubmenu(val) {
    const icon = this.container.querySelector('ids-icon[icon="dropdown"]');
    if (val === true || val === 'true') {
      this.submenu.setAttribute('slot', 'submenu');
      this.container.setAttribute('aria-haspopup', true);
      this.container.setAttribute('aria-expanded', false);
      if (!icon) {
        this.a.insertAdjacentHTML('beforeend', `<ids-icon slot="icon" icon="dropdown" size="${MENU_ITEM_SIZE}" class="ids-icon ids-menu-item-submenu-icon"></ids-icon>`);
      }
    } else {
      this.container.removeAttribute('aria-haspopup');
      this.container.removeAttribute('aria-expanded');
      icon?.remove();
    }
  }

  /**
   * Decorates the menu for selectability, adding/removing a checkmark
   * @returns {void}
   */
  detectSelectability() {
    const selectType = this.group.select;
    const isSelectable = selectType !== null;
    const check = this.container.querySelector('span.check');

    if (isSelectable) {
      this.container.classList.add(selectType === 'multiple' ? 'has-multi-checkmark' : 'has-checkmark');
      this.container.classList.remove(selectType === 'multiple' ? 'has-checkmark' : 'has-multi-checkmark');
      if (!check) {
        this.a.insertAdjacentHTML('afterbegin', `<span class="check"></span>`);
      }
    } else {
      this.container.classList.remove('has-checkmark', 'has-multi-checkmark');
      check?.remove();
    }
  }

  /**
   * @returns {boolean} true if this item is currently selected
   */
  get selected() {
    return this.state.selected;
  }

  /**
   * @param {boolean} val true if the item should be selected
   */
  set selected(val) {
    if (this.disabled) {
      return;
    }

    // Determine true state and event names
    const trueVal = val !== null && val !== false;
    const duringEventName = trueVal ? 'selected' : 'deselected';
    const beforeEventName = `before${duringEventName}`;

    // Build/Fire a `beforeselect` event that will allow an external hook to
    // determine if this menu item can be selected, or perform other actions.
    let canSelect = true;
    const beforeSelectResponse = (veto) => {
      canSelect = !!veto;
    };
    this.eventHandlers.dispatchEvent(beforeEventName, this, {
      detail: {
        elem: this,
        response: beforeSelectResponse
      }
    });
    if (!canSelect) {
      return;
    }

    // Store true state
    this.state.selected = trueVal;
    this.container.classList[trueVal ? 'add' : 'remove']('selected');

    // Sync the attribute
    const shouldUpdate = this.shouldUpdate;
    const currentAttr = this.hasAttribute('selected');
    if ((!currentAttr && trueVal) || (currentAttr && !trueVal)) {
      this.shouldUpdate = false;
      if (trueVal) {
        this.setAttribute('selected', '');
      } else {
        this.removeAttribute('selected');
      }
      this.shouldUpdate = shouldUpdate;
    }

    // @TODO handle selected state markers (checks?)

    // Build/Fire a `selected` event for performing other actions.
    this.eventHandlers.dispatchEvent(duringEventName, this, {
      bubbles: true,
      detail: {
        elem: this,
        value: this.value
      }
    });
  }

  /**
   * @returns {void}
   */
  select() {
    this.selected = true;
  }

  /**
   * @returns {void}
   */
  deselect() {
    this.selected = false;
  }

  /**
   * Passes a tabindex attribute from the custom element to the button
   * @param {number} val the tabindex value
   * @returns {void}
   */
  set tabindex(val) {
    // Tabindex should exist on the anchor only
    this.shouldUpdate = false;
    this.removeAttribute('tabindex');
    this.shouldUpdate = true;

    const trueVal = parseInt(val, 10);
    if (Number.isNaN(trueVal) || trueVal < -1) {
      this.state.tabindex = 0;
      this.a.removeAttribute('tabindex');
      return;
    }
    this.state.tabindex = trueVal;
    this.a.setAttribute('tabindex', trueVal);
  }

  /**
   * @returns {number} the current tabindex number for the button
   */
  get tabindex() {
    return this.state.tabindex;
  }

  /**
   * @readonly
   * @returns {string} containing the text content of the menu item
   */
  get text() {
    if (this.hasSubmenu) {
      return [...this.childNodes].find((i) => i.nodeType === Node.TEXT_NODE).textContent.trim();
    }
    return this.textContent.trim();
  }

  /**
   * @param {any} val the value for this menu item
   */
  set value(val) {
    this.state.value = val;

    // Don't display the value in the DOM if it doesn't make sense.
    if (!safeForAttribute(val)) {
      const shouldUpdate = this.shouldUpdate;
      this.shouldUpdate = false;
      this.removeAttribute('value');
      this.shouldUpdate = shouldUpdate;
    }
  }

  /**
   * @returns {any} the value of the menu item.
   */
  get value() {
    return this.state.value;
  }

  /**
   * Causes a menu item to become focused (and therefore highlighted).
   * @returns {void}
   */
  highlight() {
    this.highlighted = true;
  }

  /**
   * Causes a menu item to become unhighlighted.
   * @returns {void}
   */
  unhighlight() {
    this.highlighted = false;
  }

  /**
   * @param {boolean} val true if icons are present
   */
  setDisplayType(val) {
    // @TODO include checkmarks/selected/other states
    this.container.classList[val === true ? 'add' : 'remove']('has-icon');
  }

  /**
   * Displays this menu item's submenu, if one is present.
   * @returns {void}
   */
  showSubmenu() {
    if (!this.hasSubmenu) {
      return;
    }
    this.container.setAttribute('aria-expanded', true);
    this.menu.hideSubmenus();
    this.submenu?.show();
  }

  /**
   * Hides this menu item's submenu, if one is present.
   * @returns {void}
   */
  hideSubmenu() {
    if (!this.hasSubmenu) {
      return;
    }
    this.container.setAttribute('aria-expanded', false);
    this.submenu?.hide();
  }
}

export default IdsMenuItem;
