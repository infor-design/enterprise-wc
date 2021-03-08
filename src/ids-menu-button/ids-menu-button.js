import {
  customElement,
  scss,
  props
} from '../ids-base/ids-element';
import IdsDOMUtils from '../ids-base/ids-dom-utils';

// @ts-ignore
import { IdsButton, BUTTON_PROPS } from '../ids-button/ids-button';
import { IdsStringUtils as stringUtils } from '../ids-base/ids-string-utils';

import IdsIcon from '../ids-icon/ids-icon';
// @ts-ignore
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';

// @ts-ignore
import styles from '../ids-button/ids-button.scss';

// Property names
const MENU_BUTTON_PROPS = [
  'dropdown-icon',
  props.ID,
  props.MENU
];

/**
 * IDS Toggle Button Component
 */
@customElement('ids-menu-button')
@scss(styles)
class IdsMenuButton extends IdsButton {
  constructor() {
    super();
  }

  /**
   * @returns {Array} containing configurable properties on this component
   */
  static get properties() {
    return BUTTON_PROPS.concat(MENU_BUTTON_PROPS);
  }

  /**
   * Toggle-Button-level `connectedCallback` implementation (adds an icon refresh)
   * @returns {void}
   */
  connectedCallback() {
    this.configureMenu();
    this.handleEvents();
    // @ts-ignore
    IdsButton.prototype.connectedCallback.apply(this);
  }

  /**
   * @returns {void}
   */
  handleEvents() {
    // @ts-ignore
    IdsButton.prototype.handleEvents.apply(this);
  }

  /**
   * @returns {string[]} containing CSS classes that will be added to the buttons
   */
  get protoClasses() {
    const textSlot = this.querySelector('span:not(.audible)');
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
    const trueVal = stringUtils.stringToBool(val);
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
   * @returns {HTMLElement | null} element if one is present
   */
  get menuEl() {
    // Check for a Shadow Root parent.
    // If none, use `document`
    /** @type {any} */
    const target = IdsDOMUtils.getClosestRootNode(this);
    return target.querySelector(`ids-popup-menu[id="${this.menu}"]`);
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
    // @ts-ignore
    this.menuEl.trigger = 'click';
    // @ts-ignore
    this.menuEl.target = this;

    // ====================================================================
    // Setup menu-specific event listeners, if they aren't already applied

    // @ts-ignore
    const hasBeforeShow = this?.handledEvents?.get('beforeshow');
    if (!hasBeforeShow) {
      // On the Popup Menu's `beforeshow` event, set the menu's size to the Menu Button's
      // @ts-ignore
      this.onEvent('beforeshow', this.menuEl, () => {
        this.resizeMenu();
      });
    }
  }

  /**
   * @returns {void}
   */
  resizeMenu() {
    // @ts-ignore
    this.menuEl.popup.container.style.minWidth = `${this.button.clientWidth}px`;
  }

  /**
   * @returns {void}
   */
  setPopupArrow() {
    if (!this.menuEl) {
      return;
    }
    // @ts-ignore
    this.menuEl.popup.arrowTarget = this.dropdownIconEl || this;
    // @ts-ignore
    this.menuEl.popup.arrow = 'bottom';
  }
}

export default IdsMenuButton;
