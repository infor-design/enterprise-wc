import { customElement, scss } from '../../core/ids-decorators';
import { parseNumberWithUnits } from '../../utils/ids-dom-utils/ids-dom-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { attributes, htmlAttributes } from '../../core/ids-attributes';

import IdsButton from '../ids-button/ids-button';

import '../ids-icon/ids-icon';
import '../ids-popup-menu/ids-popup-menu';
import '../ids-menu/ids-menu-group';
import '../ids-menu/ids-menu-item';

import styles from '../ids-button/ids-button.scss';

import type IdsIcon from '../ids-icon/ids-icon';
import type IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';

/**
 * IDS Menu Button Component
 * @type {IdsMenuButton}
 * @inherits IdsButton
 */
@customElement('ids-menu-button')
@scss(styles)
export default class IdsMenuButton extends IdsButton {
  constructor() {
    super();
  }

  /**
   * @returns {Array} containing configurable attributes on this component
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.DISPLAY_SELECTED_TEXT,
      attributes.DROPDOWN_ICON,
      attributes.FORMATTER_WIDTH,
      attributes.ID,
      attributes.MENU
    ];
  }

  /**
   * Toggle-Button-level `connectedCallback` implementation (adds an icon refresh)
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    if (this.hasAttribute(attributes.DROPDOWN_ICON)) {
      this.#configureDropdownIcon(true);
    }
    this.#initMenuPopup();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.dropdownIcon = null;
  }

  /**
   * @returns {string[]} containing CSS classes that will be added to the buttons
   */
  get protoClasses() {
    const textSlot = this.querySelector('span:not(.audible), ids-text:not(.audible)');
    const iconSlot = this.querySelector('ids-icon[slot]')
      || this.querySelector('ids-icon');
    if (iconSlot && (!textSlot)) {
      return ['ids-menu-button', 'ids-icon-button'];
    }
    return ['ids-menu-button'];
  }

  /**
   * @param {boolean | string} val true if the component should be disabledd
   */
  set disabled(val: boolean | string) {
    super.disabled = val;
    const truthyVal = stringToBool(val);
    this.menuEl.disabled = truthyVal;
  }

  /**
   * @returns {boolean} true if the component is disabled
   */
  get disabled(): boolean {
    return super.disabled;
  }

  #configureDropdownIcon(doShow: boolean): void {
    const icon = this.dropdownIconEl;
    const iconType = (this.dropdownIcon && this.dropdownIcon.length) ? this.dropdownIcon : 'dropdown';

    if (doShow) {
      if (!icon) {
        this.container?.insertAdjacentHTML('beforeend', `<ids-icon icon="${iconType}" class="ids-icon dropdown-icon"></ids-icon>`);
      } else {
        icon.icon = iconType;
      }
    } else if (icon) {
      icon.remove();
    }
  }

  /**
   * @param {boolean | string} val true if the menu button should adopt a selected menu item's text content when chosen
   */
  set displaySelectedText(val: boolean | string) {
    const bool = stringToBool(val);
    if (bool) this.setAttribute(attributes.DISPLAY_SELECTED_TEXT, `${val}`);
    else this.removeAttribute(attributes.DISPLAY_SELECTED_TEXT);
    this.configureMenu();
  }

  /**
   * @returns {string} true if the menu button will adopt a selected menu item's text content when chosen
   */
  get displaySelectedText() {
    return stringToBool(this.getAttribute(attributes.DISPLAY_SELECTED_TEXT));
  }

  /**
   * @param {string|undefined} val referencing an icon string name to use
   */
  set dropdownIcon(val) {
    const trueVal = stringToBool(val);
    if (trueVal) {
      this.setAttribute(attributes.DROPDOWN_ICON, (typeof val === 'string' && val.length) ? `${val}` : 'dropdown');
    } else {
      this.removeAttribute(attributes.DROPDOWN_ICON);
    }
    this.#configureDropdownIcon(trueVal);
    this.setPopupArrow();
  }

  /**
   * @returns {string|undefined} containing the type of icon being displayed as the Dropdown Icon
   */
  get dropdownIcon() {
    return this.getAttribute(attributes.DROPDOWN_ICON);
  }

  /**
   * @returns {HTMLElement|null} the decorative dropdown icon element
   */
  get dropdownIconEl() {
    return this.container?.querySelector<IdsIcon>('ids-icon:not([slot])');
  }

  /**
   * @returns {string|null} an ID selector string matching a menu
   */
  get menu() {
    return this.getAttribute(attributes.MENU);
  }

  /**
   * @param {string|null} val an ID selector string
   */
  set menu(val) {
    this.setAttribute(attributes.MENU, `${val}`);
    this.configureMenu();
  }

  /**
   * Retrieves a list of selected items from menu.
   * @returns {Array<any>} list of the values contained by selected menu items
   */
  get value() {
    return this.menuEl?.getSelectedValues();
  }

  /**
   * Set menu's selected items by value
   * @param {Array<any>|string} values array|string of value(s) contained in menu items
   * @returns {void}
   */
  set value(values) {
    if (typeof (this.menuEl?.setSelectedValues) === 'function') {
      this.menuEl.setSelectedValues(values);
    }
  }

  /**
   * @readonly
   * @returns {HTMLElement | null} element if one is present
   */
  get menuEl() {
    const findPopup = (root: any) => root?.querySelector(`ids-popup-menu[id="${this.menu}"]`)
      || root?.querySelector(`ids-action-sheet[id="${this.menu}"]`);

    let el = findPopup(this.parentElement);
    if (!el) el = findPopup(this.getRootNode());
    return el;
  }

  /**
   * Set popup menu initially
   * @private
   * @returns {void}
   */
  #initMenuPopup(): void {
    this.configureMenu();
    if (!this.menuEl?.popup) requestAnimationFrame(() => this.configureMenu());
  }

  /**
   * @returns {void}
   */
  configureMenu() {
    if (!this.menuEl || !this.menuEl.popup) {
      return;
    }
    this.resizeMenu();
    this.menuEl.triggerType = 'click';
    this.menuEl.target = this;

    this.setAttribute(htmlAttributes.ARIA_HASPOPUP, 'menu');

    if (this.menuEl.popup) {
      this.menuEl.popup.align = 'bottom, left';
      this.menuEl.popup.alignEdge = 'top';
      this.menuEl.popup.y = 8;
      this.setPopupArrow();
    }

    // ====================================================================
    // Setup menu-specific event listeners, if they aren't already applied

    const hasBeforeShow = this?.handledEvents?.get('beforeshow');
    if (!hasBeforeShow) {
      // On the Popup Menu's `beforeshow` event, set the menu's size to the Menu Button's
      this.onEvent('beforeshow', this.menuEl, () => {
        this.setActiveState(true);
        this.resizeMenu();
      });
    }

    const hasHideHandler = this?.handledEvents?.get('hide');
    if (!hasHideHandler) {
      this.onEvent('hide', this.menuEl, () => {
        this.setActiveState(false);
      });
    }

    // Enabled using `displaySelectedText` setting
    this.offEvent('selected.menu');
    if (this.menuEl && this.displaySelectedText) {
      this.onEvent('selected.menu', this.menuEl, (e: CustomEvent) => {
        let btnTextEl = this.querySelector('ids-text, span');
        if (!btnTextEl) btnTextEl = this;
        btnTextEl.textContent = e.detail.elem.textContent.trim();
      });
    }
  }

  /**
   * Set button's active state
   * @param {boolean} isActive true when menu is open
   */
  setActiveState(isActive: boolean) {
    if (isActive) {
      this.button?.classList.add('is-active');
    } else {
      this.button?.classList.remove('is-active');
    }
  }

  /**
   * @returns {void}
   */
  resizeMenu() {
    if (!this.menuEl || !this.menuEl.popup || !this.menuEl.popup.container) {
      return;
    }
    this.menuEl.popup.container.style.minWidth = `${this.button?.clientWidth}px`;
  }

  /**
   * @returns {void}
   */
  setPopupArrow() {
    if (!this.menuEl || !this.menuEl.popup) {
      return;
    }

    const popupMenuEl = document.querySelector(`#${this.menu}`);
    let arrow = 'bottom';
    this.menuEl.popup.arrowTarget = this.dropdownIconEl || this;

    if (popupMenuEl && (popupMenuEl as IdsPopupMenu).getAttribute('arrow')) {
      arrow = (popupMenuEl as IdsPopupMenu).arrow || '';
    }
    this.menuEl.popup.arrow = arrow;
  }

  /**
   * Set the formatter width for menu button
   * @param {string | number} value The formatter width value
   */
  set formatterWidth(value: string | number) {
    const val = parseNumberWithUnits(value);

    this.container?.classList[/%$/g.test(val) ? 'add' : 'remove']('formatter-width-percentage');

    if (val) {
      this.setAttribute(attributes.FORMATTER_WIDTH, String(value));
      this.container?.classList.add(attributes.FORMATTER_WIDTH);
      if (this.container) this.container.style.minWidth = val;
    } else {
      this.removeAttribute(attributes.FORMATTER_WIDTH);
      this.container?.classList.remove(attributes.FORMATTER_WIDTH);
      if (this.container) this.container.style.minWidth = '';
    }
  }
}
