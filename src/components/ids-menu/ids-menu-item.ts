import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';
import {
  MENU_ITEM_SIZE, MENU_DEFAULTS, safeForAttribute
} from './ids-menu-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-menu-item-base';
import '../ids-icon/ids-icon';

import styles from './ids-menu-item.scss';

/**
 * IDS Menu Item Component
 * @type {IdsMenuItem}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 * @part menu-item - the menu item element
 * @part text - the text element
 * @part icon - the icon element
 * @part check - the selected check element
 */
@customElement('ids-menu-item')
@scss(styles)
export default class IdsMenuItem extends Base {
  /**
   * Build the menu item
   */
  constructor() {
    super();

    // Build state object
    this.state = {};
    Object.keys(MENU_DEFAULTS).forEach((prop) => {
      const attr = this.getAttribute(prop);
      this.state[prop] = attr || MENU_DEFAULTS[prop];
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
      disabledClass = ' disabled';
      disabledAttr = ' disabled';
    }

    // Check
    const check = this.templateCheck();

    // Icon
    let icon = '';
    if (this.state?.icon) icon = this.templateDisplayIcon(this.state.icon);
    const iconSlot = `<span class="ids-menu-item-icon" role="presentation"><slot name="icon">${icon}</slot></span>`;

    // Selected
    let selectedClass = '';
    if (this.state?.selected) selectedClass = ' selected';

    // Submenu
    let submenuClass = '';
    if (this.submenu) submenuClass = ' has-submenu';

    // Tabindex
    let tabindex = 'tabindex="0"';
    if (this.state?.tabIndex && !this.state?.disabled) tabindex = ` tabindex="${this.state.tabIndex}"`;

    // TextAlign
    const textClass = ` text-${this.textAlign}`;

    // Text
    const textSlot = `<span class="ids-menu-item-text" part="text"><slot></slot></span>`;

    // Main
    return `<div role="none" part="menu-item" class="ids-menu-item${disabledClass}${selectedClass}${submenuClass}${textClass}">
      <a role="menuitem" ${tabindex} ${disabledAttr}>
        ${check}${iconSlot}${textSlot}
      </a>
      <slot name="submenu"></slot>
    </div>`;
  }

  templateCheck() {
    return '<span class="check" part="check" role="presentation"></span>';
  }

  templateDisplayIcon(icon: string) {
    const viewbox = this.viewbox ? ` viewbox="${this.viewbox}"` : '';
    return `<ids-icon slot="icon" icon="${icon}"${viewbox} size="${MENU_ITEM_SIZE}" part="icon" class="ids-icon ids-menu-item-display-icon"></ids-icon>`;
  }

  templateSubmenuIcon() {
    return `<ids-icon slot="icon" icon="dropdown" size="${MENU_ITEM_SIZE}" class="ids-icon ids-menu-item-submenu-icon"></ids-icon>`;
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes as an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.HIDDEN,
      attributes.ICON,
      attributes.SELECTED,
      attributes.SUBMENU,
      attributes.TARGET,
      attributes.TABINDEX,
      attributes.TEXT_ALIGN,
      attributes.VALUE,
      attributes.VIEWBOX
    ];
  }

  /**
   * Menu-level `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    if (!this.state) this.state = {};
    super.connectedCallback();
    this.refresh();
    this.attachEventHandlers();
    this.shouldUpdate = true;
  }

  /**
   * @returns {Array<string>} Menu Item vetoable events
   */
  vetoableEventTypes = ['beforeselected', 'beforedeselected'];

  /**
   * Updates the visual state of this menu item
   * @private
   * @returns {void}
   */
  refresh() {
    this.tabIndex = this.state.tabIndex;
    this.detectHidden();
    this.detectSubmenu();
    this.detectSelectability();
    this.decorateForIcon();
  }

  /**
   * @returns {void}
   */
  attachEventHandlers() {
    // When any of this item's slots change, refresh the visual state of the item
    this.onEvent('slotchange', this.container, () => {
      this.refresh();
    });
  }

  /**
   * @readonly
   * @returns {HTMLAnchorElement} reference to the Menu Item's anchor
   */
  get a() {
    return this.shadowRoot?.querySelector('a');
  }

  /**
   * @readonly
   * @returns {any} ['IdsMenu'] reference to the parent IdsMenu component, if one exists.
   */
  get menu() {
    const toolbarParent = this.closest('ids-toolbar-more-actions');
    if (toolbarParent) {
      return toolbarParent.menu;
    }

    const tabMoreParent = this.closest('ids-tab-more');
    if (tabMoreParent) {
      return tabMoreParent.container?.querySelector('ids-popup-menu');
    }

    return this.closest('ids-menu, ids-popup-menu');
  }

  /**
   * @readonly
   * @returns {any} ['IdsMenuGroup'] reference to the parent IdsMenuGroup component, if one exists.
   */
  get group() {
    return this.closest('ids-menu-group');
  }

  /**
   * Passes a disabled attribute from the custom element to the button
   * @param {boolean} val true if the button will be disabled
   */
  set disabled(val) {
    // Handled as boolean attribute
    const trueVal = stringToBool(val);
    this.state.disabled = trueVal;

    const a = this.a;

    if (!a) return;

    const shouldUpdate = this.shouldUpdate;
    const currentAttr = this.hasAttribute(attributes.DISABLED);

    if (trueVal) {
      a.disabled = true;
      a.setAttribute(attributes.DISABLED, '');
      this.tabIndex = -1;
      this.container?.classList.add(attributes.DISABLED);
      if (!currentAttr) {
        this.shouldUpdate = false;
        this.setAttribute(attributes.DISABLED, '');
        this.shouldUpdate = shouldUpdate;
      }
      return;
    }

    a.disabled = false;
    a.removeAttribute(attributes.DISABLED);
    this.tabIndex = 0;
    this.container?.classList.remove(attributes.DISABLED);
    if (currentAttr) {
      this.shouldUpdate = false;
      this.removeAttribute(attributes.DISABLED);
      this.shouldUpdate = shouldUpdate;
    }
  }

  /**
   * Retrieve the disabled state of the inner button element
   * @returns {boolean} the inner button's disabled state
   */
  get disabled() {
    return this.state.disabled;
  }

  /**
   * @param {boolean|string} val true if the menu item should be hidden from view
   */
  set hidden(val) {
    const newValue = stringToBool(val);
    if (newValue) {
      this.setAttribute(attributes.HIDDEN, '');
      this.container?.classList.add(attributes.HIDDEN);
    } else {
      this.removeAttribute(attributes.HIDDEN);
      this.container?.classList.remove(attributes.HIDDEN);
    }
  }

  /**
   * @returns {boolean} true if the menu item is hidden from view
   */
  get hidden() {
    return this.hasAttribute(attributes.HIDDEN);
  }

  /**
   * @param {boolean} val true if the menu item should appear highlighted
   */
  set highlighted(val) {
    const trueVal = stringToBool(val);

    // Don't highlight if the item is disabled.
    if (trueVal && this.disabled) {
      return;
    }

    this.state.highlighted = trueVal;
    this.container?.classList[trueVal ? 'add' : 'remove']('highlighted');
  }

  /**
   * @returns {boolean} true if the menu item should show a highlight
   */
  get highlighted() {
    return this.state.highlighted;
  }

  /**
   * Causes a menu item to become focused (and therefore highlighted).
   * @returns {void}
   */
  highlight() {
    this.highlighted = true;
    this.triggerEvent('highlighted', this, { bubbles: true, detail: { elem: this } });
  }

  /**
   * Causes a menu item to become unhighlighted.
   * @returns {void}
   */
  unhighlight() {
    this.highlighted = false;
  }

  /**
   * @param {string | undefined} val representing the icon to set
   */
  set icon(val) {
    if (typeof val !== 'string' || !val.length) {
      this.removeAttribute(attributes.ICON);
      this.state.icon = undefined;
      this.removeIcon();
    } else {
      this.state.icon = val;
      this.setAttribute(attributes.ICON, val);
      this.appendIcon(val);
    }

    if (this.group && typeof this.group.updateIconAlignment === 'function') {
      this.group.updateIconAlignment();
    }
  }

  /**
   * @returns {string | undefined} a defined IdsIcon's `icon` attribute, if one is present
   */
  get icon() {
    return this.iconEl?.icon;
  }

  /**
   * @returns {any} [IdsIcon | undefined] reference to a defined IDS Icon element, if applicable
   */
  get iconEl() {
    const icon = [...this.children].find((e) => e.matches('ids-icon'));
    return icon;
  }

  /**
   * Check if an icon exists, and adds the icon if it's missing
   * @param {string} iconName The icon name to check
   * @private
   */
  appendIcon(iconName: string) {
    // First look specifically for an icon slot.
    const icon = this.querySelector(`ids-icon[slot="icon"]`); // @TODO check for submenu icons here
    if (icon) {
      icon.icon = iconName;
    } else {
      this.insertAdjacentHTML('afterbegin', this.templateDisplayIcon(iconName));
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
   * Updates the alignment of text/icon content in the menu item to account for icons
   * that are present either on this menu item, or another one inside this menu item's group.
   * @private
   */
  decorateForIcon() {
    const hasIcons = this.group.itemIcons.length > 0;
    this.container?.classList[hasIcons ? 'add' : 'remove']('has-icon');
  }

  /**
   *
   */
  detectHidden() {
    this.hidden = this.hasAttribute('hidden');
  }

  /**
   * @readonly
   * @returns {any} [IdsMenu | IdsPopupMenu] submenu component, if one is present.
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
   * @private
   * @returns {boolean} true if this menu item contains a submenu structure.
   */
  detectSubmenu() {
    const hasSubmenu = this.hasSubmenu;
    this.container?.classList[hasSubmenu ? 'add' : 'remove']('has-submenu');
    this.decorateSubmenu(hasSubmenu);
    return hasSubmenu;
  }

  /**
   * @private
   * @param {boolean|string} val true if a submenu is present and should be identified
   * with icons and correct aria attributes
   */
  decorateSubmenu(val: boolean | string) {
    const icon = this.container?.querySelector('ids-icon[icon="dropdown"]');
    if (val === true || val === 'true') {
      if (this.submenu) {
        this.submenu.setAttribute(htmlAttributes.SLOT, 'submenu');
        this.submenu.setAttribute(htmlAttributes.ARIA_EXPANDED, this.submenu.visible ? 'true' : 'false');
      }
      this.a?.setAttribute(htmlAttributes.ROLE, 'button');
      this.a?.setAttribute(htmlAttributes.ARIA_HASPOPUP, 'true');
      if (!icon) {
        this.a?.insertAdjacentHTML('beforeend', this.templateSubmenuIcon());
      }
      this.value = null;
    } else {
      if (this.submenu) {
        this.submenu.removeAttribute(htmlAttributes.ARIA_EXPANDED);
      }
      this.a?.setAttribute(htmlAttributes.ROLE, 'menuitem');
      this.a?.removeAttribute(htmlAttributes.ARIA_HASPOPUP);
      icon?.remove();
    }
  }

  /**
   * @returns {boolean} true if this item is able to be selected
   */
  get isSelectable(): boolean {
    return this.group?.select !== null && !this.submenu;
  }

  /**
   * Decorates the menu for selectability, adding/removing a checkmark
   * @private
   * @returns {void}
   */
  detectSelectability() {
    const selectType = this.group.select;
    const check = this.container?.querySelector('span.check');

    if (this.isSelectable) {
      this.container?.classList.add(selectType === 'multiple' ? 'has-multi-checkmark' : 'has-checkmark');
      this.container?.classList.remove(selectType === 'multiple' ? 'has-checkmark' : 'has-multi-checkmark');
      if (!check) {
        this.a?.insertAdjacentHTML('afterbegin', this.templateCheck());
      }
      this.a?.setAttribute(htmlAttributes.ROLE, selectType === 'multiple' ? 'menuitemcheckbox' : 'menuitemradio');
      this.a?.setAttribute(htmlAttributes.ARIA_CHECKED, this.selected ? 'true' : 'false');
    } else {
      this.container?.classList.remove('has-checkmark', 'has-multi-checkmark');
      check?.remove();
      this.a?.setAttribute(htmlAttributes.ROLE, this.hasSubmenu ? 'button' : 'menuitem');
      this.a?.removeAttribute(htmlAttributes.ARIA_CHECKED);
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
    // Determine true state and event names
    const trueVal = stringToBool(val);
    const duringEventName = trueVal ? 'selected' : 'deselected';
    const beforeEventName = `before${duringEventName}`;

    // Trigger a veto-able event for the specified selection type
    if (!this.triggerVetoableEvent(beforeEventName)) {
      return;
    }

    if (this.state.selected !== trueVal) {
      if (this.isSelectable) {
        this.state.selected = trueVal;

        if (trueVal) {
          this.setAttribute(attributes.SELECTED, '');
        } else {
          this.removeAttribute(attributes.SELECTED);
        }

        this.container?.classList[trueVal ? 'add' : 'remove']('selected');
        this.a?.setAttribute(htmlAttributes.ARIA_CHECKED, trueVal ? 'true' : 'false');
      }

      // Build/Fire a `selected` event for performing other actions.
      // This event only fires when selection type changes.
      if (trueVal || this.group?.select === 'multiple') {
        this.triggerEvent(duringEventName, this, {
          bubbles: true,
          detail: {
            elem: this,
            value: this.value
          }
        });
      }
    }

    // This event always fires
    this.triggerEvent('pick', this, {
      bubbles: true,
      detail: {
        elem: this,
        value: this.value,
        selected: trueVal
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
   * Passes a tabindex attribute from the custom element to the hyperlink
   * @param {any} val [number|string] the tabindex value
   * @returns {void}
   */
  set tabIndex(val) {
    const trueVal = Number(val);
    if (!this.state) this.state = {};
    if (this.state.tabIndex !== trueVal) {
      this.removeAttribute(attributes.TABINDEX);

      // Mirror tabindex on the shadow DOM anchor
      if (Number.isNaN(trueVal) || trueVal < -1) {
        this.state.tabIndex = 0;
        this.a?.setAttribute(attributes.TABINDEX, '0');
      } else {
        this.state.tabIndex = trueVal;
        this.a?.setAttribute(attributes.TABINDEX, `${trueVal}`);
      }
    }
  }

  /**
   * @returns {any} [number] the current tabindex number for the hyperlink
   */
  get tabIndex() {
    return this.state?.tabIndex || 0;
  }

  #target: any = undefined;

  /**
   * @param {HTMLElement|undefined} element an element reference to use for triggering/responding to elements
   */
  set target(element: any) {
    const currentTarget = this.target;
    if (element !== currentTarget) {
      if (element instanceof HTMLElement || element instanceof SVGElement) {
        if (!element.isEqualNode(currentTarget)) {
          this.#target = element;
        }
      } else if (element === null || element === undefined) {
        this.#target = undefined;
      }
    }
  }

  /**
   * @returns {HTMLElement|undefined} a reference to a target element, if applicable
   */
  get target() {
    return this.#target;
  }

  /**
   * @readonly
   * @returns {string} a menu item's textContent stripped of any extraneous white space.
   */
  get text() {
    const textNode = (n: any) => ((n.nodeType === Node.TEXT_NODE) || (n.name === 'ids-text'));
    return [...this.childNodes].find((i) => textNode(i)).textContent.trim();
  }

  /**
   * Set the value of the text align attribute
   * @param {string} val start / center / end
   * @memberof IdsMenuItem
   */
  set textAlign(val) {
    if (val) {
      this.setAttribute(attributes.TEXT_ALIGN, val);
    } else {
      this.removeAttribute(attributes.TEXT_ALIGN);
    }
  }

  /**
   * @readonly
   * @returns {string} a menu item's textAlign attribute
   */
  get textAlign() {
    return this.getAttribute(attributes.TEXT_ALIGN);
  }

  /**
   * @param {any} val the value for this menu item
   */
  set value(val) {
    this.state.value = val;

    // Don't display the value in the DOM.
    if (!safeForAttribute(val)) {
      const shouldUpdate = this.shouldUpdate;
      this.shouldUpdate = false;
      this.removeAttribute(attributes.VALUE);
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
   * Displays this menu item's submenu, if one is present.
   * @returns {void}
   */
  showSubmenu() {
    if (!this.hasSubmenu || (this.hasSubmenu && !this.submenu.hidden)) {
      return;
    }
    this.a?.setAttribute(htmlAttributes.ARIA_EXPANDED, 'true');
    this.menu.hideSubmenus(this);
    this.submenu.show();
  }

  /**
   * Hides this menu item's submenu, if one is present.
   * @returns {void}
   */
  hideSubmenu() {
    if (!this.hasSubmenu || (this.hasSubmenu && this.submenu.hidden)) {
      return;
    }
    this.a?.setAttribute(htmlAttributes.ARIA_EXPANDED, 'false');
    this.submenu.hide();
  }

  /**
   * Correctly focuses the menu item.  In this case, override the browser's default
   * focus routine and force focusing to occur on the anchor.
   * @returns {void}
   */
  focus() {
    if (!this.hidden && !this.disabled) {
      this.a?.focus();
      this.menu.highlightItem(this);
    }
  }

  /**
   * Set icon viewbox
   * @param {string} value for icon viewbox
   */
  set viewbox(value) {
    if (value) {
      this.setAttribute(attributes.VIEWBOX, value);
    } else {
      this.removeAttribute(attributes.VIEWBOX);
    }
  }

  /**
   * Return the viewbox
   * @returns {string} the viewbox
   */
  get viewbox() {
    return this.getAttribute(attributes.VIEWBOX);
  }
}
