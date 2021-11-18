import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { getClosestRootNode } from '../../utils/ids-dom-utils/ids-dom-utils';
import { BUTTON_ATTRIBUTES } from '../ids-button/ids-button-attributes';
import { MENU_BUTTON_ATTRIBUTES } from './ids-menu-button-attributes';

import Base from './ids-menu-button-base';
import IdsIcon from '../ids-icon/ids-icon';
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';

import styles from '../ids-button/ids-button.scss';

/**
 * IDS Menu Button Component
 * @type {IdsMenuButton}
 * @inherits IdsButton
 */
@customElement('ids-menu-button')
@scss(styles)
export default class IdsMenuButton extends Base {
  constructor() {
    super();
  }

  /**
   * @returns {Array} containing configurable attributes on this component
   */
  static get attributes() {
    return BUTTON_ATTRIBUTES.concat(MENU_BUTTON_ATTRIBUTES);
  }

  /**
   * Toggle-Button-level `connectedCallback` implementation (adds an icon refresh)
   * @returns {void}
   */
  connectedCallback() {
    this.configureMenu();
    this.attachEventHandlers();
    Base.prototype.connectedCallback.apply(this);
  }

  /**
   * @returns {void}
   */
  attachEventHandlers() {
    Base.prototype.attachEventHandlers.apply(this);
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
   * @param {string|undefined} val referencing an icon string name to use
   */
  set dropdownIcon(val) {
    const trueVal = stringToBool(val);
    const iconName = (typeof val === 'string' && val.length) ? `${val}` : 'dropdown';
    const icon = this.dropdownIconEl;
    if (trueVal) {
      if (!icon) {
        this.container.insertAdjacentHTML('beforeend', `<ids-icon icon="${iconName}" class="ids-icon dropdown-icon"></ids-icon>`);
      } else {
        icon.icon = iconName;
      }
    } else if (icon) {
      icon.remove();
    }
    this.setPopupArrow();
  }

  /**
   * @returns {string|undefined} containing the type of icon being displayed as the Dropdown Icon
   */
  get dropdownIcon() {
    return this.dropdownIconEl?.icon;
  }

  /**
   * @returns {IdsIcon|null} the decorative dropdown icon element
   */
  get dropdownIconEl() {
    return this.container.querySelector('ids-icon:not([slot])');
  }

  /**
   * @returns {string|null} an ID selector string matching a menu
   */
  get menu() {
    return this.getAttribute('menu');
  }

  /**
   * @param {string|null} val an ID selector string
   */
  set menu(val) {
    this.setAttribute('menu', `${val}`);
    this.configureMenu();
  }

  /**
   * @readonly
   * @returns {IdsPopupMenu | null} element if one is present
   */
  get menuEl() {
    // Check for a Shadow Root parent.
    // If none, use `document`
    const target = getClosestRootNode(this);
    return target.querySelector(`ids-popup-menu[id="${this.menu}"]`) || target.querySelector(`ids-action-sheet[id="${this.menu}"]`);
  }

  /**
   * @returns {void}
   */
  configureMenu() {
    if (!this.menuEl || !this.menuEl.popup) {
      return;
    }
    this.resizeMenu();
    this.setPopupArrow();
    this.menuEl.trigger = 'click';
    this.menuEl.target = this;

    // ====================================================================
    // Setup menu-specific event listeners, if they aren't already applied

    const hasBeforeShow = this?.handledEvents?.get('beforeshow');
    if (!hasBeforeShow) {
      // On the Popup Menu's `beforeshow` event, set the menu's size to the Menu Button's
      this.onEvent('beforeshow', this.menuEl, () => {
        this.resizeMenu();
      });
    }
  }

  /**
   * @returns {void}
   */
  resizeMenu() {
    if (!this.menuEl || !this.menuEl.popup) {
      return;
    }
    this.menuEl.popup.container.style.minWidth = `${this.button.clientWidth}px`;
  }

  /**
   * @returns {void}
   */
  setPopupArrow() {
    if (!this.menuEl || !this.menuEl.popup) {
      return;
    }
    this.menuEl.popup.arrowTarget = this.dropdownIconEl || this;
    this.menuEl.popup.arrow = 'bottom';
  }
}
